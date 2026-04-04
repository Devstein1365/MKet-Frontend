import api from "./api";

// Notifications Service - Connected to Backend API

class NotificationsService {
  formatRelativeTime(dateString) {
    if (!dateString) return "Just now";

    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return "Just now";

    const diffMs = Date.now() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
    });
  }

  mapNotificationType(rawType) {
    const type = String(rawType || "").toUpperCase();
    switch (type) {
      case "NEW_MESSAGE":
        return "message";
      case "PRODUCT_SOLD":
        return "sale";
      case "PRODUCT_LIKED":
        return "like";
      case "PRICE_DROP":
        return "price";
      case "NEW_REVIEW":
        return "comment";
      default:
        return "system";
    }
  }

  mapNotificationLink(notification) {
    if (notification.relatedType === "conversation" && notification.relatedId) {
      return "/dashboard/chat";
    }

    if (notification.relatedType === "product" && notification.relatedId) {
      return `/dashboard/product/${notification.relatedId}`;
    }

    return "/dashboard/notifications";
  }

  normalizeNotification(notification) {
    return {
      ...notification,
      read: Boolean(notification.isRead),
      type: this.mapNotificationType(notification.type),
      time: this.formatRelativeTime(notification.createdAt),
      link: this.mapNotificationLink(notification),
    };
  }

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
        notifications: (response.data.notifications || []).map((n) =>
          this.normalizeNotification(n),
        ),
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

  // Get a few recent notifications for dropdowns/quick UI
  async getRecentNotifications(limit = 3) {
    const result = await this.getNotifications(1, limit, false);
    if (!result.success) return [];
    return result.notifications;
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
