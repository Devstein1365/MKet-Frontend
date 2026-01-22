import api from "./api";

// Notifications Service - Connected to Backend API

class NotificationsService {
  // Get notifications
  async getNotifications(page = 1, limit = 20, unreadOnly = false) {
    try {
      const params = new URLSearchParams();
      params.append("page", page);
      params.append("limit", limit);
      if (unreadOnly) params.append("unreadOnly", "true");

      const response = await api.get(`/notifications?${params.toString()}`);

      return {
        success: true,
        notifications: response.data.notifications,
        unreadCount: response.data.unreadCount,
        pagination: response.data.pagination,
      };
    } catch (error) {
      console.error("Get notifications error:", error);
      return {
        success: false,
        message:
          error.response?.data?.message || "Failed to load notifications",
        notifications: [],
        unreadCount: 0,
      };
    }
  }

  // Mark notification as read
  async markAsRead(notificationId) {
    try {
      const response = await api.put(`/notifications/${notificationId}/read`);

      return {
        success: true,
        message: response.data.message,
        notification: response.data.notification,
      };
    } catch (error) {
      console.error("Mark as read error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to mark as read",
      };
    }
  }

  // Mark all notifications as read
  async markAllAsRead() {
    try {
      const response = await api.put("/notifications/read-all");

      return {
        success: true,
        message: response.data.message,
      };
    } catch (error) {
      console.error("Mark all as read error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to mark all as read",
      };
    }
  }

  // Delete notification
  async deleteNotification(notificationId) {
    try {
      const response = await api.delete(`/notifications/${notificationId}`);

      return {
        success: true,
        message: response.data.message,
      };
    } catch (error) {
      console.error("Delete notification error:", error);
      return {
        success: false,
        message:
          error.response?.data?.message || "Failed to delete notification",
      };
    }
  }

  // Clear all notifications
  async clearAllNotifications() {
    try {
      const response = await api.delete("/notifications");

      return {
        success: true,
        message: response.data.message,
      };
    } catch (error) {
      console.error("Clear all notifications error:", error);
      return {
        success: false,
        message:
          error.response?.data?.message || "Failed to clear notifications",
      };
    }
  }

  // Get unread count only
  async getUnreadCount() {
    try {
      const response = await api.get("/notifications?limit=1");

      return {
        success: true,
        unreadCount: response.data.unreadCount,
      };
    } catch (error) {
      console.error("Get unread count error:", error);
      return {
        success: false,
        unreadCount: 0,
      };
    }
  }
}

export default new NotificationsService();
