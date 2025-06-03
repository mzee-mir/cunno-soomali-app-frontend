import React, { useState, useCallback, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDispatch, useSelector } from "react-redux";
import { Form } from "@/components/ui/form";
import { RootState } from "@/store/store";
import { MenuItemService } from "@/lib/menuItemservice";
import MenuItemImageUploader from "@/components/MenuItemImageUploader";
import { updateMenuItemImage } from "@/store/menuItemSlice";
import { setMenuItemLoading } from "@/store/menuItemSlice";
import toast from "react-hot-toast";
import LoadinButton from "@/components/LoadinButton";
import { MdDelete, MdEdit } from "react-icons/md";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from 'react-i18next';

const menuItemFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.coerce.number().min(0, "Price must be positive"),
  description: z.string().min(1, "Description is required"),
  stock: z.boolean().default(true),
  publish: z.boolean().default(true),
  discount: z.coerce.number().min(0).max(100).optional(),
});

type MenuItemFormData = z.infer<typeof menuItemFormSchema>;

const DEFAULT_FORM_VALUES: MenuItemFormData = {
  name: "",
  price: 0,
  description: "",
  stock: true,
  publish: true,
};

const MobileMenuItems = () => {
  const [openForm, setOpenForm] = useState(false);
  const [editData, setEditData] = useState<any>(null);
  const [newItemImage, setNewItemImage] = useState<File | null>(null);
  const { t } = useTranslation();

  const dispatch = useDispatch();
  const { currentRestaurant } = useSelector(
    (state: RootState) => state.restaurant
  );
  const { menuItems, loading } = useSelector(
    (state: RootState) => state.menuItem
  );

  const form = useForm<MenuItemFormData>({
    resolver: zodResolver(menuItemFormSchema),
    defaultValues: DEFAULT_FORM_VALUES,
  });

  useEffect(() => {
    if (currentRestaurant?._id) {
      MenuItemService.getMenuItems(dispatch, currentRestaurant._id);
    }
  }, [currentRestaurant, dispatch]);

  useEffect(() => {
    if (editData) {
      form.reset({
        name: editData.name,
        price: editData.price,
        description: editData.description,
        stock: editData.stock,
        publish: editData.publish,
        discount: editData.discount || undefined,
      });
    } else {
      form.reset(DEFAULT_FORM_VALUES);
    }
  }, [editData, form]);

  const onSubmit = async (formData: MenuItemFormData) => {
    try {
      if (!currentRestaurant?._id) {
        toast.error(t("menuItems.noRestaurant"));
        return;
      }

      dispatch(setMenuItemLoading(true));

      if (editData?._id) {
        // Update existing menu item
        await MenuItemService.updateMenuItem(
          dispatch,
          currentRestaurant._id,
          editData._id,
          formData
        );

        // Handle image update if new image was selected
        if (newItemImage) {
          const uploadedImageUrl = await MenuItemService.uploadMenuItemImage(
            dispatch,
            currentRestaurant._id,
            editData._id,
            newItemImage
          );
          
          if (uploadedImageUrl) {
            dispatch(updateMenuItemImage({ 
              menuItemId: editData._id, 
              imageUrl: uploadedImageUrl 
            }));
          }
        }

        toast.success(t("menuItems.update"));
      } else {
        // Create new menu item
        const newMenuItem = await MenuItemService.createMenuItem(
          dispatch,
          currentRestaurant._id,
          {
            ...formData,
            restaurantId: { _id: currentRestaurant._id },
            imageUrl: "",
          }
        );

        // Upload image if one was selected
        if (newItemImage && newMenuItem._id) {
          const uploadedImageUrl = await MenuItemService.uploadMenuItemImage(
            dispatch,
            currentRestaurant._id,
            newMenuItem._id,
            newItemImage
          );
      
          if (uploadedImageUrl) {
            dispatch(updateMenuItemImage({ 
              menuItemId: newMenuItem._id, 
              imageUrl: uploadedImageUrl 
            }));
          }
        }

        toast.success(t("menuItems.success"));
      }

      setOpenForm(false);
      setEditData(null);
      setNewItemImage(null);
      form.reset(DEFAULT_FORM_VALUES);
      
      // Refresh menu items
      if (currentRestaurant?._id) {
        await MenuItemService.getMenuItems(dispatch, currentRestaurant._id);
      }
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : t("menuItems.error");
      toast.error(errorMessage);
    } finally {
      dispatch(setMenuItemLoading(false));
    }
  };

  const handleDelete = async (menuItemId: string) => {
    try {
      if (window.confirm(t("menuItems.deleteConfirm"))) {
        await MenuItemService.softDeleteMenuItem(dispatch, menuItemId);
        toast.success(t("menuItems.deleteSuccess"));
        if (editData?._id === menuItemId) {
          setEditData(null);
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : t("menuItems.deleteError");
      toast.error(errorMessage);
    }
  };

  return (
    <div className="">
      <div className="bg-card shadow-lg px-2 py-2 flex justify-between gap-4 items-center">
        <h2 className="font-semibold text-ellipsis line-clamp-1">
          {t("menuItems.title")}
        </h2>
        <button 
          onClick={() => {
            setEditData(null);
            setOpenForm(true);
          }} 
          className="border border-primary-200 text-primary-200 px-3 hover:bg-primary-200 hover:text-foreground/50 py-1 rounded-full"
        >
          {t("menuItems.addItem")}
        </button>
      </div>

      <div className="bg-card p-2 grid gap-4">
        {menuItems.map((item) => (
          <div key={item._id} className="border rounded p-3 flex gap-3 bg-input/40">
            <div className="w-full">
              <div className="flex items-center gap-2 mb-2">
                {item.imageUrl && (
                  <img 
                    src={item.imageUrl} 
                    alt={item.name} 
                    className="w-16 h-16 object-cover rounded"
                  />
                )}
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p>{t("commons.currencyFormat", { amount: item.price.toFixed(2) })}</p>
                  {item.discount && item.discount > 0 && (
                    <span className="text-xs bg-green-100 text-green-800 px-1.5 py-0.5 rounded-full">
                      {t("menuItemList.discount", { percent: item.discount })}
                    </span>
                  )}
                </div>
              </div>
              <p className="text-sm text-foreground/70">{item.description}</p>
              <div className="flex gap-2 mt-2">
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                  item.stock ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                }`}>
                  {item.stock ? t("menuItemList.inStock") : t("menuItemList.outOfStock")}
                </span>
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                  item.publish ? "bg-blue-100 text-blue-800" : "bg-yellow-100 text-yellow-800"
                }`}>
                  {item.publish ? t("menuItemList.published") : t("menuItemList.hidden")}
                </span>
              </div>
            </div>
            <div className="grid gap-4">
              <button 
                onClick={() => {
                  setEditData(item);
                  setOpenForm(true);
                }} 
                className="bg-green-300 p-1 rounded hover:text-white hover:bg-green-600"
              >
                <MdEdit size={20}/>
              </button>
              <button 
                onClick={() => handleDelete(item._id)}
                className="bg-red-300 p-1 rounded hover:text-white hover:bg-red-600"
              >
                <MdDelete size={20}/>
              </button>
            </div>
          </div>
        ))}

        <div 
          onClick={() => {
            setEditData(null);
            setOpenForm(true);
          }} 
          className="h-16 bg-input/40 border-2 border-dashed flex justify-center items-center cursor-pointer"
        >
          {t("menuItems.addItem")}
        </div>
      </div>

      {/* Menu Item Form Modal */}
      {openForm && (
        <section className="bg-black fixed top-0 left-0 right-0 bottom-0 z-50 bg-opacity-70 h-screen overflow-auto">
          <div className="bg-card p-4 w-full max-w-lg mt-8 mx-auto rounded">
            <div className="flex justify-between items-center gap-4">
              <h2 className="font-semibold">
                {editData ? t("menuItems.editItem") : t("menuItems.addItem")}
              </h2>
              <button 
                onClick={() => {
                  setOpenForm(false);
                  setEditData(null);
                  setNewItemImage(null);
                }} 
                className="hover:text-red-500"
              >
                <MdDelete size={20}/>
              </button>
            </div>

            <FormProvider {...form}>
              <Form {...form}>
                <form 
                  onSubmit={form.handleSubmit(onSubmit)} 
                  className="mt-4 grid gap-4"
                >
                  <div className="grid gap-1">
                    <Label>{t("menuItems.image")}</Label>
                    <MenuItemImageUploader
                      restaurantId={currentRestaurant?._id || ""}
                      menuItemId={editData?._id || undefined}
                      currentImage={editData?.imageUrl}
                      onImageUpload={(file) => setNewItemImage(file)}
                      isModal={false}
                    />
                  </div>

                  <div className="grid gap-1">
                    <Label>{t("menuItems.name")}</Label>
                    <Input
                      {...form.register("name")}
                      placeholder={t("menuItems.name")}
                      className="bg-input/20"
                    />
                    {form.formState.errors.name && (
                      <p className="text-red-500 text-sm">
                        {form.formState.errors.name.message}
                      </p>
                    )}
                  </div>

                  <div className="grid gap-1">
                    <Label>{t("menuItems.price")}</Label>
                    <Input
                      type="number"
                      step="0.01"
                      {...form.register("price")}
                      placeholder="0.00"
                      className="bg-input/20"
                    />
                    {form.formState.errors.price && (
                      <p className="text-red-500 text-sm">
                        {form.formState.errors.price.message}
                      </p>
                    )}
                  </div>

                  <div className="grid gap-1">
                    <Label>{t("menuItems.description")}</Label>
                    <Textarea
                      {...form.register("description")}
                      placeholder={t("menuItems.description")}
                      rows={3}
                      className="bg-input/20"
                    />
                    {form.formState.errors.description && (
                      <p className="text-red-500 text-sm">
                        {form.formState.errors.description.message}
                      </p>
                    )}
                  </div>

                  <div className="grid gap-1">
                    <Label>{t("menuItems.discount")}</Label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      className="bg-input/20"
                      {...form.register("discount")}
                    />
                    {form.formState.errors.discount && (
                      <p className="text-red-500 text-sm">
                        {form.formState.errors.discount.message}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="stock"
                      checked={form.watch("stock")}
                      onCheckedChange={(checked) =>
                        form.setValue("stock", checked)
                      }
                    />
                    <Label htmlFor="stock">{t("menuItems.stock")}</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="publish"
                      checked={form.watch("publish")}
                      onCheckedChange={(checked) =>
                        form.setValue("publish", checked)
                      }
                    />
                    <Label htmlFor="publish">{t("menuItems.publish")}</Label>
                  </div>

                  <button 
                    type="submit" 
                    className="bg-primary w-full py-2 font-semibold
                    borderadius-e mt-4 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-400 hover:to-blue-600 transition-all duration-300"
                    disabled={loading}
                  >
                    {loading ? (
                      <LoadinButton />
                    ) : editData ? (
                      t("menuItems.updateItem")
                    ) : (
                      t("menuItems.createItem")
                    )}
                  </button>
                </form>
              </Form>
            </FormProvider>
          </div>
        </section>
      )}
    </div>
  );
};

export default MobileMenuItems;