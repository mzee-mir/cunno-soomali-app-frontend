import { useCallback, useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { RootState } from "@/store/store";
import { MenuItemService } from "@/lib/menuItemservice";
import MenuItemImageUploader from "@/components/MenuItemImageUploader";
import { updateMenuItemImage } from "@/store/menuItemSlice";
import { setMenuItemLoading } from "@/store/menuItemSlice";
import toast from "react-hot-toast";
import LoadinButton from "@/components/LoadinButton";
import MenuItemsList from "./MenuItemList";
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

const MenuItems = () => {
  const [selectedMenuItem, setSelectedMenuItem] = useState<string | null>(null);
  const [newItemImage, setNewItemImage] = useState<File | null>(null);

  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { currentRestaurant } = useSelector(
    (state: RootState) => state.restaurant
  );
  
  const currentMenuItem = useSelector((state: RootState) => 
    selectedMenuItem 
      ? state.menuItem.menuItems.find(item => item._id === selectedMenuItem) 
      : null
  );

  const { menuItems, loading, error } = useSelector(
    (state: RootState) => state.menuItem
  );

  const form = useForm<MenuItemFormData>({
    resolver: zodResolver(menuItemFormSchema),
    defaultValues: DEFAULT_FORM_VALUES,
  });

  const handleSelectItem = useCallback((id: string | null) => {
    setSelectedMenuItem(id);
    if (id === null) {
      form.reset(DEFAULT_FORM_VALUES);
    }
  }, [form]);

  useEffect(() => {
    if (currentRestaurant?._id) {
      MenuItemService.getMenuItems(dispatch, currentRestaurant._id);
    }
  }, [currentRestaurant, dispatch]);

  useEffect(() => {
    if (selectedMenuItem) {
      const item = menuItems.find(item => item._id === selectedMenuItem);
      if (item) {
        form.reset({
          name: item.name,
          price: item.price,
          description: item.description,
          stock: item.stock,
          publish: item.publish,
          discount: item.discount || undefined,
        });
      }
    } else {
      form.reset(DEFAULT_FORM_VALUES);
    }
  }, [selectedMenuItem, menuItems, form]);

  const onSubmit = async (formData: MenuItemFormData) => {
    try {
      if (!currentRestaurant?._id) {
        toast.error(t("menuItems.noRestaurant"));
        return;
      }
  
      dispatch(setMenuItemLoading(true));

      const restaurantId = currentRestaurant._id;
    
      if (selectedMenuItem && currentMenuItem) {
        await MenuItemService.updateMenuItem(
          dispatch,
          restaurantId,  
          selectedMenuItem,        
          formData
        );
        
        if (newItemImage) {
          const uploadedImageUrl = await MenuItemService.uploadMenuItemImage(
            dispatch,
            restaurantId,
            selectedMenuItem,
            newItemImage
          );
          
          if (uploadedImageUrl) {
            dispatch(updateMenuItemImage({ 
              menuItemId: selectedMenuItem, 
              imageUrl: uploadedImageUrl 
            }));
          }
        }
        
        toast.success(t("menuItems.update"));
      } else {
        const newMenuItem = await MenuItemService.createMenuItem(
          dispatch,
          restaurantId,
          {
            ...formData,
            restaurantId: { _id: restaurantId },
            imageUrl: "",
          }
        );

        if (newItemImage && newMenuItem._id) {
          const uploadedImageUrl = await MenuItemService.uploadMenuItemImage(
            dispatch,
            restaurantId,
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
      
      setSelectedMenuItem(null);
      setNewItemImage(null);
      form.reset(DEFAULT_FORM_VALUES);
      
      await MenuItemService.getMenuItems(dispatch, restaurantId);
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
        if (selectedMenuItem === menuItemId) {
          setSelectedMenuItem(null);
          form.reset(DEFAULT_FORM_VALUES);
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
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Menu Items List */}
        <div className="lg:col-span-1 bg-card p-6 rounded-lg shadow">
          <h2 className="text-foregroundT text-2xl font-bold mb-4">{t("menuItems.title")}</h2>
          <MenuItemsList 
            items={menuItems}
            selectedItemId={selectedMenuItem}
            onSelectItem={handleSelectItem}
            loading={loading}
          />
        </div>

        {/* Menu Item Form */}
        <div className="lg:col-span-2">
          <FormProvider {...form}>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6 bg-card p-6 rounded-lg shadow"
              >
                <h2 className="text-2xl font-bold">
                  {selectedMenuItem ? t("menuItems.addItem") : t("menuItems.editItem")}
                </h2>

                <div className="grid grid-cols-1 gap-4">
                  {/* Image Upload Section */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">{t("menuItems.image")}</h3>
                    <MenuItemImageUploader
                      restaurantId={currentRestaurant?._id || ""}
                      menuItemId={selectedMenuItem || undefined}
                      currentImage={currentMenuItem?.imageUrl}
                      onImageUpload={(file) => setNewItemImage(file)}
                      isModal={false}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("menuItems.name")}
                    </label>
                    <input
                      {...form.register("name")}
                      className="w-full px-3 py-2 border bg-input/20 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {form.formState.errors.name && (
                      <p className="text-red-500 text-sm mt-1">
                        {form.formState.errors.name.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("menuItems.price")}
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      {...form.register("price")}
                      className="w-full px-3 py-2 border bg-input/20 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {form.formState.errors.price && (
                      <p className="text-red-500 text-sm mt-1">
                        {form.formState.errors.price.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("menuItems.description")}
                    </label>
                    <textarea
                      {...form.register("description")}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 bg-input/20 focus:ring-blue-500"
                    />
                    {form.formState.errors.description && (
                      <p className="text-red-500 text-sm mt-1">
                        {form.formState.errors.description.message}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t("menuItems.discount")} (%)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        {...form.register("discount")}
                        className="w-full px-3 py-2 border bg-input/20 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {form.formState.errors.discount && (
                        <p className="text-red-500 text-sm mt-1">
                          {form.formState.errors.discount.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="stock"
                        {...form.register("stock")}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="stock" className="ml-2 block text-sm text-gray-700">
                      {t("menuItems.stock")}
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="publish"
                        {...form.register("publish")}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="publish" className="ml-2 block text-sm text-gray-700">
                      {t("menuItems.publish")}
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <div>
                    {selectedMenuItem && (
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={() => handleDelete(selectedMenuItem)}
                        disabled={loading}
                      >
                        {t("menuItems.delete")}
                      </Button>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                      disabled={loading}
                    >
                      {loading ? (
                        <LoadinButton />
                      ) : selectedMenuItem ? (
                        t("menuItems.createItem")
                      ) : (
                        t("menuItems.updateItem")
                      )}
                    </Button>
                  </div>
                </div>

                {error && (
                  <p className="text-red-500 text-center mt-4">{error}</p>
                )}
              </form>
            </Form>
          </FormProvider>
        </div>
      </div>
    </div>
  );
};

export default MenuItems;