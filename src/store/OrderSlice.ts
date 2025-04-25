// store/OrderSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface OrderItem {
  menuItemId: string;
  quantity: number;
  name: string;
  price: number;
  imageUrl: string;
}

interface UserInfo {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
}


export type OrderStatus = 
  | "placed" 
  | "paid"
  | "inProgress"
  | "outForDelivery"
  | "delivered"
  | "cancelled";
  
  export type Restaurant = {
    _id: string;
    name: string;
  };
  
  export type Order = {
    _id: string;
    createdAt: string;
    restaurant: Restaurant;
    user: UserInfo; 
    deliveryDetails?: {
      name?: string;
      email?: string;
      mobile?: string;
      address?: string;
    };
    cartItems: OrderItem[];
    totalAmount: number;
    status: OrderStatus;
  };

interface OrderState {
  orders: Order[];
  loading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  orders: [],
  loading: false,
  error: null,
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    setOrders: (state, action: PayloadAction<Order[]>) => {
      state.orders = action.payload;
    },
    updateOrderStatus: (state, action: PayloadAction<{orderId: string, status: string}>) => {
      const index = state.orders.findIndex(order => order._id === action.payload.orderId);
      if (index !== -1) {
        state.orders[index].status = action.payload.status;
      }
    },
    setOrderLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setOrderError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearOrders: () => initialState,
  },
});

export const { 
  setOrders, 
  updateOrderStatus,
  setOrderLoading, 
  setOrderError, 
  clearOrders 
} = orderSlice.actions;

export default orderSlice.reducer;