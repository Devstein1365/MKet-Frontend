// Notifications Service - Mock for now (will be integrated with backend later)
// Storage key
const NOTIFICATIONS_KEY = "mket_notifications";

// Load from localStorage
const loadNotifications = () => {
  try {
    const stored = localStorage.getItem(NOTIFICATIONS_KEY);
    return stored ? JSON.parse(stored) : getDefaultNotifications();
  } catch (error) {
    console.error("Error loading notifications:", error);
    return getDefaultNotifications();
  }
};

// Save to localStorage
const saveNotifications = (notifications) => {
  try {
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
  } catch (error) {
    console.error("Error saving notifications:", error);
  }
};

// Default mock notifications
const getDefaultNotifications = () => [
  {
    id: 1,
    type: "message",
    title: "New Message",
    message: "Aisha Mohammed sent you a message",
    timestamp: new Date().toISOString(),
    read: false,
    link: "/dashboard/chat",
  },
  {
    id: 2,
    type: "product",
    title: "Product Sold",
    message: "Your iPhone 13 Pro Max has been marked as sold",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    read: false,
    link: "/dashboard/profile",
  },
  {
    id: 3,
    type: "review",
    title: "New Review",
    message: "Someone left a review on your MacBook Pro listing",
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    read: false,
    link: "/dashboard/product/2",
  },
];

class NotificationsService {
  // Get all notifications
  getAllNotifications() {
    return loadNotifications();
  }

  // Get unread count
  getUnreadCount() {
    const notifications = loadNotifications();
    return notifications.filter((n) => !n.read).length;
  }

  // Mark notification as read
  markAsRead(notificationId) {
    const notifications = loadNotifications();
    const notification = notifications.find((n) => n.id === notificationId);
    if (notification) {
      notification.read = true;
      saveNotifications(notifications);
    }
    return notifications;
  }

  // Mark all as read
  markAllAsRead() {
    const notifications = loadNotifications();
    notifications.forEach((n) => (n.read = true));
    saveNotifications(notifications);
    return notifications;
  }

  // Delete notification
  deleteNotification(notificationId) {
    let notifications = loadNotifications();
    notifications = notifications.filter((n) => n.id !== notificationId);
    saveNotifications(notifications);
    return notifications;
  }

  // Add new notification (for testing/demo)
  addNotification(notification) {
    const notifications = loadNotifications();
    const newNotification = {
      id: Date.now(),
      ...notification,
      timestamp: new Date().toISOString(),
      read: false,
    };
    notifications.unshift(newNotification);
    saveNotifications(notifications);
    return notifications;
  }

  // Clear all notifications
  clearAll() {
    saveNotifications([]);
    return [];
  }
}

export default new NotificationsService();
