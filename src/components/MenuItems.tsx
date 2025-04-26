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
import {updateMenuItemImage} from "@/store/menuItemSlice";
import {
  setMenuItemLoading,
} from "@/store/menuItemSlice";
import toast from "react-hot-toast";
import LoadinButton from "@/components/LoadinButton";
import MenuItemsList from "./MenuItemList";

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

const ErrorDisplay = ({ error }: { error: string | null }) => (
  error ? <p className="text-red-500 text-center mt-4">{error}</p> : null
);

const SubmitButton = ({ 
  isSubmitting, 
  hasMenuItem 
}: { 
  isSubmitting: boolean; 
  hasMenuItem: boolean; 
}) => (
  <Button 
    type="submit"
    className="bg-blue-600 hover:bg-blue-700 text-white"
    disabled={isSubmitting}
  >
    {isSubmitting ? (
      <LoadinButton />
    ) : hasMenuItem ? (
      "Update Menu Item"
    ) : (
      "Create Menu Item"
    )}
  </Button>
);

const MenuItems = () => {
  // 1. First declare all state hooks
  const [selectedMenuItem, setSelectedMenuItem] = useState<string | null>(null);
  const [newItemImage, setNewItemImage] = useState<File | null>(null);

  // 2. Then use other hooks that depend on state
  const dispatch = useDispatch();
  const { currentRestaurant } = useSelector(
    (state: RootState) => state.restaurant
  );
  
  // Now we can safely use selectedMenuItem in this selector
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
    // If clearing selection, also reset the form
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

  // Update your onSubmit function to handle the image properly
  const onSubmit = async (formData: MenuItemFormData) => {
    try {
      if (!currentRestaurant?._id) {
        toast.error("No restaurant selected");
        return;
      }
  
      dispatch(setMenuItemLoading(true));

      const restaurantId = currentRestaurant?._id;
      if (!restaurantId) return null;
    
    if (selectedMenuItem && currentMenuItem) {
      // Update existing menu item
      await MenuItemService.updateMenuItem(
        dispatch,
        currentRestaurant._id,  
        selectedMenuItem,        
        formData
      );
      
      // Handle image update if new image was selected
      if (newItemImage) {
        const uploadedImageUrl = await MenuItemService.uploadMenuItemImage(
          dispatch,
          currentRestaurant._id,
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
      
      toast.success("Menu item updated successfully");
    } else {
      // Create new menu item
      if (!currentRestaurant?._id) {
        throw new Error("No restaurant selected");
      }
      
      const newMenuItem = await MenuItemService.createMenuItem(
        dispatch,
        restaurantId,
        {
          ...formData,
          restaurantId: { _id: restaurantId },
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
      
      toast.success("Menu item created successfully");
    }
    
    // Reset form
    setSelectedMenuItem(null);
    setNewItemImage(null);
    form.reset(DEFAULT_FORM_VALUES);
    
    // Refresh menu items
    if (currentRestaurant?._id) {
      await MenuItemService.getMenuItems(dispatch, currentRestaurant._id);
    }
  } catch (error) {
    // Error handling remains the same
  } finally {
    dispatch(setMenuItemLoading(false));
  }
};

  const handleDelete = async (menuItemId: string) => {
    try {
      if (window.confirm("Are you sure you want to delete this menu item?")) {
        await MenuItemService.softDeleteMenuItem(dispatch, menuItemId);
        toast.success("Menu item deleted successfully");
        if (selectedMenuItem === menuItemId) {
          setSelectedMenuItem(null);
          form.reset(DEFAULT_FORM_VALUES);
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Failed to delete menu item";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Menu Items List */}
        <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4">Menu Items</h2>
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
                className="space-y-6 bg-gray-50 p-6 rounded-lg shadow"
              >
                <h2 className="text-2xl font-bold">
                  {selectedMenuItem ? "Edit Menu Item" : "Add New Menu Item"}
                </h2>

                <div className="grid grid-cols-1 gap-4">
                  {/* Image Upload Section - Show for both new and existing items */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Menu Item Image</h3>
                    <MenuItemImageUploader
                      restaurantId={currentRestaurant?._id || ""}
                      menuItemId={selectedMenuItem || undefined}
                      currentImage={currentMenuItem?.imageUrl} // Now properly typed as string | undefined
                      onImageUpload={(file) => setNewItemImage(file)}
                      isModal={false}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <input
                      {...form.register("name")}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {form.formState.errors.name && (
                      <p className="text-red-500 text-sm mt-1">
                        {form.formState.errors.name.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      {...form.register("price")}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {form.formState.errors.price && (
                      <p className="text-red-500 text-sm mt-1">
                        {form.formState.errors.price.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      {...form.register("description")}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                        Discount (%)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        {...form.register("discount")}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                        In Stock
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
                        Publish
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
                        Delete
                      </Button>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <SubmitButton 
                      isSubmitting={loading} 
                      hasMenuItem={!!selectedMenuItem} 
                    />
                  </div>
                </div>

                <ErrorDisplay error={error} />
              </form>
            </Form>
          </FormProvider>
        </div>
      </div>
    </div>
  );
};

export default MenuItems;