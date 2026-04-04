import React, { createContext, useContext, useState, useEffect } from "react";
import chatService from "../services/chatService";
import { useAuth } from "./AuthContext";

const UnreadMessagesContext = createContext();

export const useUnreadMessages = () => {
  const context = useContext(UnreadMessagesContext);
  if (!context) {
    throw new Error(
      "useUnreadMessages must be used within an UnreadMessagesProvider",
    );
  }
  return context;
};

export const UnreadMessagesProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Load unread count when user is authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      setUnreadCount(0);
      return;
    }

    const handleNewMessage = (message) => {
      // Only increment if we're not the sender
      const currentUserId = chatService.getCurrentUserId();
      if (message.senderId !== currentUserId) {
        setUnreadCount((prev) => prev + 1);
      }
    };

    const handleConnectionRestored = () => {
      // Re-sync from server after reconnect to avoid stale badge counts
      loadUnreadCount();
    };

    const setupSocketListeners = () => {
      // Connect to socket
      chatService.connect();

      // Listen for new messages
      chatService.on("message_received", handleNewMessage);
      chatService.on("connection_restored", handleConnectionRestored);
    };

    const cleanupSocketListeners = () => {
      chatService.off("message_received", handleNewMessage);
      chatService.off("connection_restored", handleConnectionRestored);
    };

    loadUnreadCount();
    setupSocketListeners();

    return () => {
      cleanupSocketListeners();
    };
  }, [isAuthenticated]);

  const loadUnreadCount = async () => {
    try {
      setLoading(true);
      const conversations = await chatService.getAllConversations();

      // Calculate total unread messages across all conversations
      const total = conversations.reduce(
        (sum, conv) => sum + (conv.unreadCount || 0),
        0,
      );

      setUnreadCount(total);
    } catch (error) {
      console.error("Error loading unread count:", error);
      setUnreadCount(0);
    } finally {
      setLoading(false);
    }
  };

  const decrementUnreadCount = (amount = 1) => {
    setUnreadCount((prev) => Math.max(0, prev - amount));
  };

  const resetUnreadCount = () => {
    setUnreadCount(0);
  };

  const value = {
    unreadCount,
    loading,
    loadUnreadCount,
    decrementUnreadCount,
    resetUnreadCount,
  };

  return (
    <UnreadMessagesContext.Provider value={value}>
      {children}
    </UnreadMessagesContext.Provider>
  );
};
