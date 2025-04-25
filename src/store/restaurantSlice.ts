// store/restaurantSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// src/types/restaurant.ts
interface IRestaurant {
  _id: string;
  name: string;
  description: string;
  address: string;
  city: string;
  country: string;
  deliveryPrice: number;
  estimatedDeliveryTime: number;
  phone: string;
  email: string;
  openingHours: string;
  imageUrl: string;
  cuisineType: string[];
  isActive: boolean;
}

interface SearchRestaurantsResponse {
  data: IRestaurant[];
  pagination: {
    total: number;
    page: number;
    pages: number;
  };
}

interface RestaurantState {
  currentRestaurant: IRestaurant | null;
  loading: boolean;
  error: string | null;
}

const initialState: RestaurantState = {
    currentRestaurant: null,
    loading: false,
    error: null
};

const restaurantSlice = createSlice({
    name: 'restaurant',
    initialState,
    reducers: {
        setCurrentRestaurant: (state, action: PayloadAction<IRestaurant | null>) => {
          state.currentRestaurant = action.payload;
        },
        setRestaurantImage: (state, action: PayloadAction<string>) => {
          if (state.currentRestaurant) {
            state.currentRestaurant.imageUrl = action.payload;
          }
        },
        setRestaurantLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setRestaurantError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
        clearRestaurantState: () => initialState,
    }
});

export const { 
    setCurrentRestaurant,
    setRestaurantImage,
    setRestaurantLoading,
    setRestaurantError,
    clearRestaurantState 
} = restaurantSlice.actions;

export type { IRestaurant, RestaurantState, SearchRestaurantsResponse };
export default restaurantSlice.reducer;