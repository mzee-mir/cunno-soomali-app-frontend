import Axios from "@/lib/Axios";
import SummaryApi from "@/api/Userauth";
import { Dispatch } from "redux";
import {
  setNotifications,
  setUnreadCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  setNotificationLoading,
  setNotificationError,
} from "@/store/Notification";

export const NotificationService = {
  async fetchNotifications(dispatch: Dispatch) {
    try {
      dispatch(setNotificationLoading(true));
      const response = await Axios({ ...SummaryApi.notification.getNotifications });
      if (!response.data.success) throw new Error("Failed to fetch notifications");
      dispatch(setNotifications(response.data.data));
    } catch (error) {
      dispatch(setNotificationError("Failed to fetch notifications"));
    } finally {
      dispatch(setNotificationLoading(false));
    }
  },

  async fetchUnreadCount(dispatch: Dispatch) {
    try {
      const response = await Axios({ ...SummaryApi.notification.getUnreadCount });
      if (response.data.success) {
        // Extract the count from the response data
        dispatch(setUnreadCount(response.data.data.count));
      }
    } catch {
      // silently fail
    }
  },

  async markAsRead(dispatch: Dispatch, notificationId: string) {
    try {
      const endpoint = SummaryApi.notification.markAsRead.url.replace(
        ":notificationId",
        notificationId
      );
      await Axios({ ...SummaryApi.notification.markAsRead, url: endpoint });
      dispatch(markNotificationAsRead(notificationId));
    } catch {
      // fail silently or log error
    }
  },

  async markAllAsRead(dispatch: Dispatch) {
    try {
      await Axios({ ...SummaryApi.notification.markAllAsRead });
      dispatch(markAllNotificationsAsRead());
    } catch {
      // silently fail
    }
  },

  async deleteNotification(dispatch: Dispatch, notificationId: string) {
    try {
      const endpoint = SummaryApi.notification.deleteNotification.url.replace(
        ":notificationId",
        notificationId
      );
      await Axios({ ...SummaryApi.notification.deleteNotification, url: endpoint });
      // Optional: refetch notifications or optimistically update local state
      NotificationService.fetchNotifications(dispatch);
      NotificationService.fetchUnreadCount(dispatch);
    } catch (error) {
      console.error("Failed to delete notification", error);
    }
  },

  async deleteAllRead(dispatch: Dispatch) {
    try {
      await Axios({ ...SummaryApi.notification.deleteAllReadNotification });
      NotificationService.fetchNotifications(dispatch);
      NotificationService.fetchUnreadCount(dispatch);
    } catch (error) {
      console.error("Failed to delete read notifications", error);
    }
  },

};

