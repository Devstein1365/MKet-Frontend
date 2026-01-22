// Mock notifications service
const mockNotifications = [
  {
    id: 1,
    type: "message",
    title: "New Message",
    message: "John Doe sent you a message about 'iPhone 13 Pro'",
    time: "2 minutes ago",
    read: false,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    link: "/dashboard/chat",
  },
  {
    id: 2,
    type: "sale",
    title: "Item Sold!",
    message: "Your 'Samsung Galaxy Watch' has been sold",
    time: "1 hour ago",
    read: false,
    avatar: null,
    link: "/dashboard/profile",
  },
  {
    id: 3,
    type: "like",
    title: "New Interest",
    message: "Someone added your 'MacBook Pro' to their wishlist",
    time: "3 hours ago",
    read: false,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    link: "/dashboard/product/3",
  },
  {
    id: 4,
    type: "price",
    title: "Price Drop Alert",
    message: "A product in your wishlist has dropped in price",
    time: "5 hours ago",
    read: true,
    avatar: null,
    link: "/dashboard/wishlist",
  },
  {
    id: 5,
    type: "comment",
    title: "New Comment",
    message: "Ahmed commented on your post 'Gaming PC Setup'",
    time: "Yesterday",
    read: true,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmed",
    link: "/dashboard/product/5",
  },
  {
    id: 6,
    type: "message",
    title: "New Message",
    message: "Fatima replied to your message",
    time: "Yesterday",
    read: true,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Fatima",
    link: "/dashboard/chat",
  },
  {
    id: 7,
    type: "sale",
    title: "Payment Received",
    message: "You received payment for 'Office Chair'",
    time: "2 days ago",
    read: true,
    avatar: null,
    link: "/dashboard/profile",
  },
  {
    id: 8,
    type: "like",
    title: "New Interest",
    message: "3 people added your items to wishlist today",
    time: "2 days ago",
    read: true,
    avatar: null,
    link: "/dashboard/profile",
  },
];

const notificationsService = {
  // Get all notifications
  getAllNotifications: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockNotifications);
      }, 300);
    });
  },

  // Get recent notifications (for dropdown)
  getRecentNotifications: (count = 3) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockNotifications.slice(0, count));
      }, 300);
    });
  },

  // Get unread count
  getUnreadCount: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const unreadCount = mockNotifications.filter((n) => !n.read).length;
        resolve(unreadCount);
      }, 100);
    });
  },

  // Mark notification as read
  markAsRead: (notificationId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const notification = mockNotifications.find(
          (n) => n.id === notificationId
        );
        if (notification) {
          notification.read = true;
        }
        resolve(notification);
      }, 200);
    });
  },

  // Mark all as read
  markAllAsRead: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        mockNotifications.forEach((n) => (n.read = true));
        resolve(true);
      }, 300);
    });
  },
};

export default notificationsService;
