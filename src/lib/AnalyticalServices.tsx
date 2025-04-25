import Axios from "@/lib/Axios";
import SummaryApi from "@/api/Userauth";
import { Dispatch } from "redux";
import {
  setOverallStats,
  setDailyStats,
  setRestaurantStats,
} from "@/store/analyticalSlice";
import AxiosToastError from "./AxiosTost";

export const AnalyticsService = {
    async fetchOverallStats(dispatch: Dispatch) {
      try {
        const response = await Axios(SummaryApi.analytics.getOverallStats);
        dispatch(setOverallStats(response.data?.data ?? { totalOrders: 0, totalRevenue: 0 }));
      } catch (error) {
        AxiosToastError(error);
      }
    },
  
    async fetchDailyStats(dispatch: Dispatch) {
      try {
        const response = await Axios(SummaryApi.analytics.getDailyStats);
        dispatch(setDailyStats(Array.isArray(response.data?.data) ? response.data.data : []));
      } catch (error) {
        AxiosToastError(error);
      }
    },
  
    async fetchRestaurantStats(dispatch: Dispatch) {
      try {
        const response = await Axios(SummaryApi.analytics.getStatsPerRestaurant); // fixed!
        dispatch(setRestaurantStats(Array.isArray(response.data?.data) ? response.data.data : []));
      } catch (error) {
        AxiosToastError(error);
      }
    },
  };
  
