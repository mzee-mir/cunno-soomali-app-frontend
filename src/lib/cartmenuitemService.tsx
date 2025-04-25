// services/cartMenuItemService.ts
import Axios from "@/lib/Axios";
import SummaryApi from "@/api/Userauth";
import { Dispatch } from "redux";
import {
  setCartItems,
  addToCart,
  updateCartItemQuantity,
  removeFromCart,
  setCartLoading,
  setCartError,
  clearCart,
} from "@/store/cartMenuItem";
import type { ICartMenuItem } from "@/store/cartMenuItem";

export const CartMenuItemService = {
  /**
   * Fetch all cart items for the current user
   */
  async getCartItems(dispatch: Dispatch): Promise<ICartMenuItem[]> {
    try {
      dispatch(setCartLoading(true));
      dispatch(setCartError(null));

      const response = await Axios(SummaryApi.cartMenu.getCart);

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to fetch cart items");
      }

      const cartItems = response.data.data as ICartMenuItem[];
      dispatch(setCartItems(cartItems));
      return cartItems;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch cart items";
      dispatch(setCartError(errorMessage));
      throw error;
    } finally {
      dispatch(setCartLoading(false));
    }
  },

  /**
   * Add item to cart
   */
  async addItemToCart(
    dispatch: Dispatch,
    menuItemId: string
  ): Promise<ICartMenuItem> {
    try {
      dispatch(setCartLoading(true));
      dispatch(setCartError(null));

      const response = await Axios({
        ...SummaryApi.cartMenu.createCart,
        data: { menuItemId },
      });

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to add item to cart");
      }

      const newCartItem = response.data.data as ICartMenuItem;
      dispatch(addToCart(newCartItem));
      return newCartItem;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to add item to cart";
      dispatch(setCartError(errorMessage));
      throw error;
    } finally {
      dispatch(setCartLoading(false));
    }
  },

  /**
   * Update item quantity in cart
   */
  async updateItemQuantity(
    dispatch: Dispatch,
    cartItemId: string,
    quantity: number
  ): Promise<ICartMenuItem> {
    try {
      dispatch(setCartLoading(true));
      dispatch(setCartError(null));

      const response = await Axios({
        ...SummaryApi.cartMenu.updateCart,
        data: { _id: cartItemId, qty: quantity },
      });

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to update cart item");
      }

      const updatedItem = response.data.data as ICartMenuItem;
      dispatch(updateCartItemQuantity({ _id: cartItemId, quantity }));
      return updatedItem;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update cart item";
      dispatch(setCartError(errorMessage));
      throw error;
    } finally {
      dispatch(setCartLoading(false));
    }
  },

  /**
   * Remove item from cart
   */
  async removeItemFromCart(
    dispatch: Dispatch,
    cartItemId: string
  ): Promise<boolean> {
    try {
      dispatch(setCartLoading(true));
      dispatch(setCartError(null));

      const response = await Axios({
        ...SummaryApi.cartMenu.deleteCart,
        data: { _id: cartItemId },
      });

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to remove item from cart");
      }

      dispatch(removeFromCart(cartItemId));
      return true;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to remove item from cart";
      dispatch(setCartError(errorMessage));
      throw error;
    } finally {
      dispatch(setCartLoading(false));
    }
  },

  /**
   * Clear entire cart
   */
  async clearCart(dispatch: Dispatch): Promise<boolean> {
    try {
      dispatch(setCartLoading(true));
      dispatch(setCartError(null));

      // This would need a new endpoint in your backend
      const response = await Axios({
        url: "/api/user/clear-cart",
        method: "DELETE",
      });

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to clear cart");
      }

      dispatch(clearCart());
      return true;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to clear cart";
      dispatch(setCartError(errorMessage));
      throw error;
    } finally {
      dispatch(setCartLoading(false));
    }
  },
};