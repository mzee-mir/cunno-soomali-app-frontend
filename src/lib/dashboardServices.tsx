// services/dashboardService.tsx
import Axios from "@/lib/Axios";
import SummaryApi from "@/api/Userauth";
import { AppDispatch } from "@/store/store";
import { 
  setDashboardData,
  setDashboardLoading,
  setDashboardError
} from "@/store/dashboardSlice";

interface DashboardData {
  totalRevenue: number;
  regularCustomers: number;
  growthRate: number;
  totalOrders: number;
  orderCompletionRate: number;
}

export const DashboardService = {
  getDashboardData: (timePeriod: string = 'month') => 
    async (dispatch: AppDispatch): Promise<DashboardData> => {
    try {
      dispatch(setDashboardLoading(true));
      dispatch(setDashboardError(null));

      const response = await Axios({
        ...SummaryApi.analytics.getOverallStats,
        params: { timePeriod }
      });

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to fetch dashboard data");
      }

      const data = response.data.data as DashboardData;
      dispatch(setDashboardData(data));
      return data;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Failed to fetch dashboard data";
      dispatch(setDashboardError(errorMessage));
      throw error;
    } finally {
      dispatch(setDashboardLoading(false));
    }
  }
};