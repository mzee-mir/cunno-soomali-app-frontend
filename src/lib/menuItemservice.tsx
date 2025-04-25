import Axios from "@/lib/Axios";
import SummaryApi from "@/api/Userauth";
import { Dispatch } from "redux";
import {
    fetchMenuItems, 
    addMenuItem, 
    updateMenuItem, 
    deleteMenuItem, 
    setMenuItemLoading, 
    setMenuItemError,
} from "@/store/menuItemSlice";
import type { IMenuItem } from "@/store/menuItemSlice";

export const MenuItemService = {
    /**
     * Add a new menu item
     */
    async createMenuItem(
        dispatch: Dispatch, 
        restaurantId: string,
        menuItemData: Omit<IMenuItem, '_id' | 'createdAt' | 'updatedAt'>
    ): Promise<IMenuItem> {
        try {
            dispatch(setMenuItemLoading(true));
            dispatch(setMenuItemError(null));

            const endpoint = SummaryApi.menuItem.addMenuItem.url
            .replace(':restaurantId', restaurantId)
            const response = await Axios({
                ...SummaryApi.menuItem.addMenuItem,
                url: endpoint,
                data: menuItemData
                
            });
            console.log("response", response);
            

            if (!response.data.success) {
                throw new Error(response.data.message || "Failed to add menu item");
            }

            const newMenuItem = response.data.data as IMenuItem;
            dispatch(addMenuItem(newMenuItem));
            return newMenuItem;
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "Failed to add menu item";
            dispatch(setMenuItemError(errorMessage));
            throw error;
        } finally {
            dispatch(setMenuItemLoading(false));
        }
    },

    /**
     * Fetch menu items for a restaurant
     */
    async getMenuItems(dispatch: Dispatch, restaurantId: string): Promise<IMenuItem[]> {
        try {
            dispatch(setMenuItemLoading(true));
            dispatch(setMenuItemError(null));

            const endpoint = SummaryApi.menuItem.getMenuItems.url.replace(':restaurantId', restaurantId);
            const response = await Axios({
                ...SummaryApi.menuItem.getMenuItems,
                url: endpoint
            });

            if (!response.data.success) {
                throw new Error(response.data.message || "Failed to fetch menu items");
            }

            const menuItems = response.data.data as IMenuItem[];
            dispatch(fetchMenuItems(menuItems));
            return menuItems;
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "Failed to fetch menu items";
            dispatch(setMenuItemError(errorMessage));
            throw error;
        } finally {
            dispatch(setMenuItemLoading(false));
        }
    },

    /**
     * Update a menu item
     */
    async updateMenuItem(
        dispatch: Dispatch,
        restaurantId: string,  // Add this parameter
        menuItemId: string,
        updateData: Partial<IMenuItem>
      ): Promise<IMenuItem> {
        try {
          dispatch(setMenuItemLoading(true));
          dispatch(setMenuItemError(null));
      
          const endpoint = SummaryApi.menuItem.updateMenuItem.url
            .replace(':restaurantId', restaurantId)
            .replace(':menuItemId', menuItemId);
      
          const response = await Axios({
            ...SummaryApi.menuItem.updateMenuItem,
            url: endpoint,
            data: updateData
          });
      
          if (!response.data.success) {
            throw new Error(response.data.message || "Failed to update menu item");
          }
      
          const updatedMenuItem = response.data.data as IMenuItem;
          dispatch(updateMenuItem(updatedMenuItem));
          return updatedMenuItem;
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : "Failed to update menu item";
          dispatch(setMenuItemError(errorMessage));
          throw error;
        } finally {
          dispatch(setMenuItemLoading(false));
        }
      },

      /**
       * Upload menu item image
       */
      async uploadMenuItemImage(
        dispatch: Dispatch,
        restaurantId: string,
        menuItemId: string,
        imageFile: File
      ): Promise<string> {
        try {
          dispatch(setMenuItemLoading(true));
          dispatch(setMenuItemError(null));
      
          const formData = new FormData();
          formData.append('Dish-image', imageFile);
      
          const endpoint = SummaryApi.menuItem.uploadMenuItemImage.url
            .replace(':restaurantId', restaurantId)
            .replace(':menuItemId', menuItemId);
      
          const response = await Axios({
            ...SummaryApi.menuItem.uploadMenuItemImage,
            url: endpoint,
            data: formData,
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
      
          return response.data.data.imageUrl;
        } catch (error) {
          const errorMessage = error instanceof Error 
            ? error.message 
            : 'Failed to upload menu item image';
          dispatch(setMenuItemError(errorMessage));
          throw error;
        } finally {
          dispatch(setMenuItemLoading(false));
        }
      },

      async softDeleteMenuItem(
          dispatch: Dispatch,
          menuItemId: string
      ): Promise<boolean> {
          try {
              dispatch(setMenuItemLoading(true));
              dispatch(setMenuItemError(null));

              const endpoint = SummaryApi.menuItem.deleteMenuItem.url
                  .replace(':menuItemId', menuItemId);

              const response = await Axios({
                  ...SummaryApi.menuItem.deleteMenuItem,
                  url: endpoint,
                  headers: {
                      Authorization: `Bearer ${localStorage.getItem('token')}`
                  }
              });

              if (!response.data.success) {
                  throw new Error(response.data.message || "Failed to soft delete menu item");
              }

              dispatch(deleteMenuItem(menuItemId));
              return true;
          } catch (error: unknown) {
              const errorMessage = error instanceof Error 
                  ? error.message 
                  : "Failed to soft delete menu item";
              dispatch(setMenuItemError(errorMessage));
              throw error;
          } finally {
              dispatch(setMenuItemLoading(false));
          }
      }
};