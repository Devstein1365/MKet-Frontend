class BrowserNotificationService {
  isSupported() {
    return typeof window !== "undefined" && "Notification" in window;
  }

  getPermission() {
    if (!this.isSupported()) return "unsupported";
    return Notification.permission;
  }

  async requestPermission() {
    if (!this.isSupported()) return "unsupported";

    try {
      const permission = await Notification.requestPermission();
      return permission;
    } catch (error) {
      console.error("Notification permission request failed:", error);
      return "denied";
    }
  }

  canNotify() {
    return this.isSupported() && Notification.permission === "granted";
  }

  showNotification(title, options = {}, onClick) {
    if (!this.canNotify()) return null;

    try {
      const notification = new Notification(title, {
        icon: "/favicon.ico",
        badge: "/favicon.ico",
        silent: false,
        ...options,
      });

      if (typeof onClick === "function") {
        notification.onclick = (event) => {
          event.preventDefault();
          onClick();
          notification.close();
        };
      }

      return notification;
    } catch (error) {
      console.error("Failed to show browser notification:", error);
      return null;
    }
  }
}

export default new BrowserNotificationService();
