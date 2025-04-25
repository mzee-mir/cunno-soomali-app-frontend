// store/dashboardSlice.ts
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Axios from "@/lib/Axios";
import SummaryApi from "@/api/Userauth";

interface DashboardData {
  totalRevenue: number;
  regularCustomers: number;
  growthRate: number;
  totalOrders: number;
  orderCompletionRate: number;
}

interface DashboardState {
  data: DashboardData | null;
  loading: boolean;
  error: string | null;
  timePeriod: string;
}

const initialState: DashboardState = {
  data: null,
  loading: false,
  error: null,
  timePeriod: 'month'
};

export const fetchDashboardData = createAsyncThunk(
  'dashboard/fetchData',
  async (timePeriod: string, { rejectWithValue }) => {
    try {
      const response = await Axios({
        ...SummaryApi.dashboard.getDashboardData,
        params: { timePeriod }
      });

      // Remove the success check since API returns data directly
      return response.data as DashboardData;

    } catch (error: unknown) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Failed to fetch dashboard data";
      return rejectWithValue(errorMessage);
    }
  }
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    setTimePeriod: (state, action) => {
      state.timePeriod = action.payload;
    },
    clearDashboard: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const { 
  setTimePeriod,
  clearDashboard
} = dashboardSlice.actions;

export default dashboardSlice.reducer;