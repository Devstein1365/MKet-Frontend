import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import chatService from "../../services/chatService";
import notificationsService from "../../services/notificationsService";
import browserNotificationService from "../../services/browserNotificationService";

const NotificationBridge = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const seenNotificationIdsRef = useRef(new Set());

  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const shouldShowPush =
      user.pushNotifications !== false && user.notificationsEnabled !== false;

    const shouldShowMessagePush =
      shouldShowPush && user.messageNotifications !== false;

    const shouldShowListingPush =
      shouldShowPush && user.listingUpdates !== false;

    if (!browserNotificationService.canNotify()) {
      return;
    }

    const handleMessageReceived = (message) => {
      const currentUserId = chatService.getCurrentUserId();
      if (!shouldShowMessagePush || message.senderId === currentUserId) {
        return;
      }

      const title = "New message";
      const body = message.text || "You have a new message";

      browserNotificationService.showNotification(
        title,
        {
          body,
          tag: `message-${message.conversationId}`,
        },
        () => {
          window.focus();
          navigate("/dashboard/chat");
        },
      );
    };

    const loadSeenIds = async () => {
      const result = await notificationsService.getNotifications(1, 20, false);
      if (result.success) {
        result.notifications.forEach((n) =>
          seenNotificationIdsRef.current.add(n.id),
        );
      }
    };

    const pollNotifications = async () => {
      if (!shouldShowListingPush) return;

      const result = await notificationsService.getNotifications(1, 20, false);
      if (!result.success) return;

      result.notifications.forEach((notification) => {
        const alreadySeen = seenNotificationIdsRef.current.has(notification.id);
        if (alreadySeen) return;

        seenNotificationIdsRef.current.add(notification.id);

        // NEW_MESSAGE is already handled by socket event above to avoid duplicate toasts
        if (notification.type === "message") return;

        browserNotificationService.showNotification(
          notification.title || "New update",
          {
            body: notification.message || "You have a new notification",
            tag: `notification-${notification.id}`,
          },
          () => {
            window.focus();
            navigate(notification.link || "/dashboard/notifications");
          },
        );
      });
    };

    loadSeenIds();
    chatService.on("message_received", handleMessageReceived);

    const pollInterval = setInterval(() => {
      pollNotifications();
    }, 20000);

    return () => {
      chatService.off("message_received", handleMessageReceived);
      clearInterval(pollInterval);
    };
  }, [isAuthenticated, navigate, user]);

  return null;
};

export default NotificationBridge;
