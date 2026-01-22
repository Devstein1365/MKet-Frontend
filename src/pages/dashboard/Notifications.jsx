import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  FaArrowLeft,
  FaEnvelope,
  FaShoppingBag,
  FaHeart,
  FaTag,
  FaComment,
  FaCheckCircle,
} from "react-icons/fa";
import Button from "../../components/shared/Button";
import Card from "../../components/shared/Card";
import Avatar from "../../components/shared/Avatar";
import notificationsService from "../../services/notificationsService";
import { motion } from "framer-motion";

const Notifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // 'all', 'unread'

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const result = await notificationsService.getNotifications(1, 50, false);
      if (result.success && result.notifications) {
        setNotifications(result.notifications);
      } else {
        console.error("Failed to load notifications:", result.message);
        setNotifications([]);
      }
    } catch (error) {
      console.error("Error loading notifications:", error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const result = await notificationsService.markAllAsRead();
      if (result.success) {
        loadNotifications();
      } else {
        console.error("Failed to mark all as read:", result.message);
      }
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      const result = await notificationsService.markAsRead(notificationId);
      if (result.success) {
        loadNotifications();
      } else {
        console.error("Failed to mark as read:", result.message);
      }
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "message":
        return <FaEnvelope className="text-blue-500" />;
      case "sale":
        return <FaShoppingBag className="text-green-500" />;
      case "like":
        return <FaHeart className="text-red-500" />;
      case "price":
        return <FaTag className="text-orange-500" />;
      case "comment":
        return <FaComment className="text-purple-500" />;
      default:
        return <FaEnvelope className="text-gray-500" />;
    }
  };

  const filteredNotifications =
    filter === "unread" ? notifications.filter((n) => !n.read) : notifications;

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-600 hover:text-[#7E22CE] transition-colors"
              >
                <FaArrowLeft />
                <span className="font-instrument">Back</span>
              </button>
              <div>
                <h1 className="text-2xl font-inter font-bold text-gray-900">
                  Notifications
                </h1>
                {unreadCount > 0 && (
                  <p className="text-sm text-gray-600 font-instrument">
                    {unreadCount} unread notification
                    {unreadCount !== 1 ? "s" : ""}
                  </p>
                )}
              </div>
            </div>
            {unreadCount > 0 && (
              <Button variant="outline" size="sm" onClick={handleMarkAllAsRead}>
                <FaCheckCircle className="mr-2" />
                Mark all as read
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg font-inter font-semibold transition-colors ${
              filter === "all"
                ? "bg-[#7E22CE] text-white"
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            All ({notifications.length})
          </button>
          <button
            onClick={() => setFilter("unread")}
            className={`px-4 py-2 rounded-lg font-inter font-semibold transition-colors ${
              filter === "unread"
                ? "bg-[#7E22CE] text-white"
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            Unread ({unreadCount})
          </button>
        </div>

        {/* Notifications List */}
        {loading ? (
          <Card>
            <div className="py-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#7E22CE] mx-auto"></div>
            </div>
          </Card>
        ) : filteredNotifications.length > 0 ? (
          <div className="space-y-3">
            {filteredNotifications.map((notification) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Card
                  className={`transition-all ${
                    !notification.read
                      ? "bg-purple-50 border-l-4 border-l-[#7E22CE]"
                      : ""
                  }`}
                >
                  <Link
                    to={notification.link}
                    onClick={() =>
                      !notification.read && handleMarkAsRead(notification.id)
                    }
                    className="block"
                  >
                    <div className="flex gap-4">
                      {/* Icon or Avatar */}
                      <div className="shrink-0">
                        {notification.avatar ? (
                          <Avatar
                            src={notification.avatar}
                            alt={notification.title}
                            size="md"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                            {getNotificationIcon(notification.type)}
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="font-inter font-bold text-gray-900">
                            {notification.title}
                          </h3>
                          {!notification.read && (
                            <div className="w-3 h-3 bg-[#7E22CE] rounded-full shrink-0 mt-1"></div>
                          )}
                        </div>
                        <p className="text-gray-700 font-instrument text-sm mb-2">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500 font-instrument">
                          {notification.time}
                        </p>
                      </div>
                    </div>
                  </Link>

                  {/* Mark as read button for unread notifications */}
                  {!notification.read && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleMarkAsRead(notification.id);
                        }}
                        className="text-sm text-[#7E22CE] hover:text-[#6B21A8] font-instrument flex items-center gap-1"
                      >
                        <FaCheckCircle className="text-xs" />
                        Mark as read
                      </button>
                    </div>
                  )}
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <Card>
            <div className="py-12 text-center">
              <FaCheckCircle className="text-gray-300 text-5xl mx-auto mb-3" />
              <p className="text-gray-600 font-instrument mb-2">
                {filter === "unread"
                  ? "No unread notifications"
                  : "No notifications yet"}
              </p>
              <p className="text-sm text-gray-500 font-instrument">
                {filter === "unread"
                  ? "All caught up! Check back later for new updates."
                  : "You'll see updates here when you get new notifications."}
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Notifications;
