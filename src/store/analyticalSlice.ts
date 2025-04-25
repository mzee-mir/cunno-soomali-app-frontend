import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface DailyStats {
  _id: {
    year: number;
    month: number;
    day: number;
  };
  totalOrders: number;
  totalRevenue: number;
}

export interface RestaurantStats {
  restaurantId: string;
  name: string;
  totalOrders: number;
  totalRevenue: number;
}

interface AnalyticsState {
  totalOrders: number;
  totalRevenue: number;
  dailyStats: DailyStats[];
  restaurantStats: RestaurantStats[];
  loading: boolean;
  error: string | null;
}

const initialState: AnalyticsState = {
  totalOrders: 0,
  totalRevenue: 0,
  dailyStats: [],
  restaurantStats: [],
  loading: false,
  error: null,
};

const analyticsSlice = createSlice({
  name: "analytics",
  initialState,
  reducers: {
    setOverallStats: (state, action: PayloadAction<{ totalOrders: number; totalRevenue: number }>) => {
        state.totalOrders = action.payload.totalOrders;
        state.totalRevenue = action.payload.totalRevenue;
      },
      
    setDailyStats: (state, action: PayloadAction<any[]>) => {
        state.dailyStats = action.payload;
      },
      setRestaurantStats: (state, action: PayloadAction<any[]>) => {
        state.restaurantStats = action.payload;
      },
      
    setAnalyticsLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setAnalyticsError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    clearAnalytics() {
      return initialState;
    },
  },
});

export const {
  setOverallStats,
  setDailyStats,
  setRestaurantStats,
  setAnalyticsLoading,
  setAnalyticsError,
  clearAnalytics,
} = analyticsSlice.actions;

export default analyticsSlice.reducer;
