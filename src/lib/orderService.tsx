// services/orderService.ts
import Axios from "@/lib/Axios";
import SummaryApi from "@/api/Userauth";
import { Dispatch } from "redux";
import { 
  setOrders,
  updateOrderStatus,
  setOrderLoading,
  setOrderError
} from "@/store/OrderSlice";
import type { Order } from "@/types";

export const OrderService = {
  /**
   * Get all orders for the logged-in restaurant owner
   */
  async getRestaurantOrders(dispatch: Dispatch): Promise<Order[]> {
    try {
      dispatch(setOrderLoading(true));
      dispatch(setOrderError(null));

      const response = await Axios({
        ...SummaryApi.OrdersRestaurant.getOrdersRestaurant,
      });

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to fetch orders");
      }

      const orders = response.data.data as Order[];
      dispatch(setOrders(orders));
      return orders;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Failed to fetch orders";
      dispatch(setOrderError(errorMessage));
      throw error;
    } finally {
      dispatch(setOrderLoading(false));
    }
  },

  /**
   * Update order status
   */
  async updateRestaurantOrderStatus(
    dispatch: Dispatch,
    orderId: string,
    status: string
  ): Promise<Order> {
    try {
      dispatch(setOrderLoading(true));
      dispatch(setOrderError(null));

      const endpoint = SummaryApi.OrdersRestaurant.updateOrdersRestaurant.url
        .replace(':orderId', orderId);

      const response = await Axios({
        ...SummaryApi.OrdersRestaurant.updateOrdersRestaurant,
        url: endpoint,
        data: { status }
      });

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to update order status");
      }

      const updatedOrder = response.data.data as Order;
      dispatch(updateOrderStatus({orderId, status}));
      return updatedOrder;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Failed to update order status";
      dispatch(setOrderError(errorMessage));
      throw error;
    } finally {
      dispatch(setOrderLoading(false));
    }
  }
};