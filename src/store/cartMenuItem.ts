// store/cartMenuItemSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ICartMenuItem {
  _id: string;
  menuItemId: {
    _id: string;
    name: string;
    price: number;
    imageUrl: string;
    stock: boolean;
    discount?: number | null;
    restaurantId: string;
  };
  quantity: number;
  userId: string;
  createdAt?: string;
  updatedAt?: string;
}

interface CartState {
  cartItems: ICartMenuItem[];
  loading: boolean;
  error: string | null;
  totalItems: number;
  subtotal: number;
}

const initialState: CartState = {
  cartItems: [],
  loading: false,
  error: null,
  totalItems: 0,
  subtotal: 0,
};

const cartMenuItemSlice = createSlice({
  name: "cartMenuItem",
  initialState,
  reducers: {
    // Set loading state
    setCartLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    // Set error message
    setCartError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    // Set all cart items
    setCartItems: (state, action: PayloadAction<ICartMenuItem[]>) => {
      state.cartItems = action.payload;
      state.totalItems = action.payload.reduce((total, item) => total + item.quantity, 0);
      state.subtotal = action.payload.reduce((total, item) => {
        const price = item.menuItemId.discount 
          ? item.menuItemId.price * (1 - (item.menuItemId.discount / 100))
          : item.menuItemId.price;
        return total + (price * item.quantity);
      }, 0);
    },

    // Add item to cart
    addToCart: (state, action: PayloadAction<ICartMenuItem>) => {
      const existingItem = state.cartItems.find(
        item => item.menuItemId._id === action.payload.menuItemId._id
      );

      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.cartItems.push(action.payload);
      }

      state.totalItems += action.payload.quantity;
      const price = action.payload.menuItemId.discount 
        ? action.payload.menuItemId.price * (1 - (action.payload.menuItemId.discount / 100))
        : action.payload.menuItemId.price;
      state.subtotal += price * action.payload.quantity;
    },

    // Update item quantity
    updateCartItemQuantity: (state, action: PayloadAction<{_id: string; quantity: number}>) => {
      const item = state.cartItems.find(item => item._id === action.payload._id);
      if (item) {
        const oldQuantity = item.quantity;
        item.quantity = action.payload.quantity;
        state.totalItems += action.payload.quantity - oldQuantity;

        const price = item.menuItemId.discount 
          ? item.menuItemId.price * (1 - (item.menuItemId.discount / 100))
          : item.menuItemId.price;
        state.subtotal += price * (action.payload.quantity - oldQuantity);
      }
    },

    // Remove item from cart
    removeFromCart: (state, action: PayloadAction<string>) => {
      const index = state.cartItems.findIndex(item => item._id === action.payload);
      if (index !== -1) {
        const removedItem = state.cartItems[index];
        state.totalItems -= removedItem.quantity;
        
        const price = removedItem.menuItemId.discount 
          ? removedItem.menuItemId.price * (1 - (removedItem.menuItemId.discount / 100))
          : removedItem.menuItemId.price;
        state.subtotal -= price * removedItem.quantity;
        
        state.cartItems.splice(index, 1);
      }
    },

    // Clear entire cart
    clearCart: () => initialState,
  },
});

export const {
  setCartLoading,
  setCartError,
  setCartItems,
  addToCart,
  updateCartItemQuantity,
  removeFromCart,
  clearCart,
} = cartMenuItemSlice.actions;

export type { ICartMenuItem, CartState };
export default cartMenuItemSlice.reducer;