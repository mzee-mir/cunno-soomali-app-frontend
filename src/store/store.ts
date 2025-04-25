// store.ts
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "@/store/userSlice";
import restaurantReducer from "@/store/restaurantSlice";
import menuItemReducer from "@/store/menuItemSlice";
import addressReducer from "@/store/addressSlice";
import cartMenuItemReducer from "@/store/cartMenuItem";
import orderReducer from "@/store/OrderSlice";
import anylyticalReducer from "@/store/analyticalSlice";
import dashboardReducer from './dashboardSlice';
import reviewReducer from "@/store/ReviewSlice";
import notificationReducer from '@/store/Notification';
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

const store = configureStore({
  reducer: {
    user: userReducer,
    restaurant: restaurantReducer,
    menuItem: menuItemReducer,
    address: addressReducer,
    cartMenuItem: cartMenuItemReducer,
    order: orderReducer, 
    analytical: anylyticalReducer,
    dashboard: dashboardReducer,
    review: reviewReducer,
    notifications: notificationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;