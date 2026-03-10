import api from "./api";
import { io } from "socket.io-client";

// Socket.io connection URL
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:3000";

// Chat Service - Real Backend Integration with Socket.io
class ChatService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.onlineUsers = new Set();
    this.eventListeners = new Map();
  }

  getCurrentUserId() {
    try {
      const storedUser = JSON.parse(
        localStorage.getItem("mket_current_user") || "null",
      );
      return storedUser?.id || null;
    } catch {
      return null;
    }
  }

  getProductImage(product) {
    if (!product) return null;

    if (product.image) return product.image;

    if (Array.isArray(product.images) && product.images.length > 0) {
      const firstImage = product.images[0];

      if (typeof firstImage === "string") return firstImage;
      if (firstImage?.url) return firstImage.url;
    }

    return null;
  }

  normalizeConversation(conversation) {
    const currentUserId = this.getCurrentUserId();

    const participant = conversation.participant || {
      id:
        conversation.user1?.id === currentUserId
          ? conversation.user2?.id
          : conversation.user1?.id,
      fullName:
        conversation.user1?.id === currentUserId
          ? conversation.user2?.fullName
          : conversation.user1?.fullName,
      avatarUrl:
        conversation.user1?.id === currentUserId
          ? conversation.user2?.avatarUrl
          : conversation.user1?.avatarUrl,
      avatarColor:
        conversation.user1?.id === currentUserId
          ? conversation.user2?.avatarColor
          : conversation.user1?.avatarColor,
      isVerified:
        conversation.user1?.id === currentUserId
          ? conversation.user2?.isVerified
          : conversation.user1?.isVerified,
    };

    const normalizedLastMessage = conversation.lastMessage
      ? {
          ...conversation.lastMessage,
          timestamp:
            conversation.lastMessage.timestamp ||
            conversation.lastMessage.createdAt ||
            new Date().toISOString(),
          senderId:
            conversation.lastMessage.senderId === currentUserId
              ? 0
              : conversation.lastMessage.senderId,
        }
      : null;

    return {
      id: conversation.id,
      participant: {
        id: participant?.id,
        name: participant?.name || participant?.fullName || "Unknown User",
        avatar: participant?.avatar || participant?.avatarUrl || null,
        verified: Boolean(participant?.verified ?? participant?.isVerified),
        isOnline: this.isUserOnline(participant?.id),
        lastSeen: participant?.lastSeen || participant?.lastLogin || null,
      },
      product: conversation.product
        ? {
            id: conversation.product.id,
            title: conversation.product.title,
            image: this.getProductImage(conversation.product),
            price: conversation.product.price,
          }
        : {
            id: null,
            title: "",
            image: null,
            price: null,
          },
      lastMessage: normalizedLastMessage,
      unreadCount: conversation.unreadCount || 0,
      updatedAt: conversation.updatedAt,
    };
  }

  normalizeMessage(message) {
    const currentUserId = this.getCurrentUserId();

    return {
      id: message.id,
      conversationId: message.conversationId,
      senderId: message.senderId === currentUserId ? 0 : message.senderId,
      text: message.text || "",
      image: message.image || null,
      isRead: Boolean(message.isRead),
      timestamp:
        message.timestamp || message.createdAt || new Date().toISOString(),
      createdAt: message.createdAt || message.timestamp,
    };
  }

  // ========================================
  // SOCKET.IO CONNECTION
  // ========================================

  /**
   * Initialize Socket.io connection with JWT authentication
   */
  connect() {
    if (this.socket?.connected) {
      console.log("Socket already connected");
      return;
    }

    const token = localStorage.getItem("mket_auth_token");
    if (!token) {
      console.error("No auth token found. Cannot connect to Socket.io");
      return;
    }

    try {
      this.socket = io(SOCKET_URL, {
        auth: {
          token: token,
        },
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5,
      });

      // Connection events
      this.socket.on("connect", () => {
        console.log("✅ Socket.io connected:", this.socket.id);
        this.isConnected = true;
        this.emit("connection_status", { connected: true });
      });

      this.socket.on("disconnect", (reason) => {
        console.log("❌ Socket.io disconnected:", reason);
        this.isConnected = false;
        this.emit("connection_status", { connected: false, reason });
      });

      this.socket.on("connect_error", (error) => {
        console.error("Socket.io connection error:", error.message);
        this.emit("connection_error", error);
      });

      // User online/offline events
      this.socket.on("user_online", ({ userId }) => {
        this.onlineUsers.add(userId);
        this.emit("user_status_changed", { userId, isOnline: true });
      });

      this.socket.on("user_offline", ({ userId }) => {
        this.onlineUsers.delete(userId);
        this.emit("user_status_changed", { userId, isOnline: false });
      });

      // Message events
      this.socket.on("message_received", (message) => {
        this.emit("message_received", message);
      });

      this.socket.on("message_read", ({ messageId, conversationId }) => {
        this.emit("message_read", { messageId, conversationId });
      });

      // Typing events
      this.socket.on("user_typing", ({ userId, conversationId }) => {
        this.emit("user_typing", { userId, conversationId });
      });

      this.socket.on("user_stop_typing", ({ userId, conversationId }) => {
        this.emit("user_stop_typing", { userId, conversationId });
      });

      // Error events
      this.socket.on("error", (error) => {
        console.error("Socket.io error:", error);
        this.emit("socket_error", error);
      });
    } catch (error) {
      console.error("Failed to initialize Socket.io:", error);
    }
  }

  /**
   * Disconnect Socket.io
   */
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      this.onlineUsers.clear();
    }
  }

  /**
   * Check if Socket.io is connected
   */
  isSocketConnected() {
    return this.isConnected && this.socket?.connected;
  }

  /**
   * Check if a user is online
   */
  isUserOnline(userId) {
    return this.onlineUsers.has(userId);
  }

  // ========================================
  // EVENT LISTENERS
  // ========================================

  /**
   * Register event listener
   */
  on(event, callback) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event).push(callback);
  }

  /**
   * Remove event listener
   */
  off(event, callback) {
    if (!this.eventListeners.has(event)) return;

    const listeners = this.eventListeners.get(event);
    const index = listeners.indexOf(callback);
    if (index > -1) {
      listeners.splice(index, 1);
    }
  }

  /**
   * Emit event to listeners
   */
  emit(event, data) {
    if (!this.eventListeners.has(event)) return;

    const listeners = this.eventListeners.get(event);
    listeners.forEach((callback) => {
      try {
        callback(data);
      } catch (error) {
        console.error(`Error in ${event} listener:`, error);
      }
    });
  }

  // ========================================
  // CONVERSATIONS API
  // ========================================

  /**
   * Get all conversations for the current user
   */
  async getConversations() {
    try {
      const response = await api.get("/conversations");
      const conversations = response.data?.conversations || [];
      return conversations.map((conversation) =>
        this.normalizeConversation(conversation),
      );
    } catch (error) {
      console.error("Error fetching conversations:", error);
      throw error;
    }
  }

  async getAllConversations() {
    return this.getConversations();
  }

  async searchConversations(query = "") {
    const normalizedQuery = query.trim().toLowerCase();
    const conversations = await this.getAllConversations();

    if (!normalizedQuery) {
      return conversations;
    }

    return conversations.filter((conversation) => {
      const participantName =
        conversation.participant?.name?.toLowerCase() || "";
      const productTitle = conversation.product?.title?.toLowerCase() || "";
      const lastMessageText =
        conversation.lastMessage?.text?.toLowerCase() || "";

      return (
        participantName.includes(normalizedQuery) ||
        productTitle.includes(normalizedQuery) ||
        lastMessageText.includes(normalizedQuery)
      );
    });
  }

  /**
   * Get or create a conversation with a user about a product
   */
  async createOrGetConversation(user2Id, productId) {
    try {
      console.log("createOrGetConversation API call mapping:", {
        user2Id,
        productId,
      });
      const response = await api.post("/conversations", {
        user2Id,
        productId,
      });
      return response.data;
    } catch (error) {
      console.error("Error creating/getting conversation:", error);
      throw error;
    }
  }

  /**
   * Get a specific conversation by ID
   */
  async getConversationById(conversationId) {
    try {
      const response = await api.get(`/conversations/${conversationId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching conversation:", error);
      throw error;
    }
  }

  /**
   * Join a conversation room (Socket.io)
   */
  joinConversation(conversationId) {
    if (!this.isSocketConnected()) {
      console.warn("Socket not connected. Cannot join conversation.");
      return;
    }

    this.socket.emit("join_conversation", { conversationId });
  }

  /**
   * Leave a conversation room (Socket.io)
   */
  leaveConversation(conversationId) {
    if (!this.isSocketConnected()) return;

    this.socket.emit("leave_conversation", { conversationId });
  }

  // ========================================
  // MESSAGES API
  // ========================================

  /**
   * Get messages for a conversation (REST API - for loading history)
   */
  async getMessages(conversationId, page = 1, limit = 50) {
    try {
      if (String(conversationId).startsWith("new-")) {
        return [];
      }

      const response = await api.get(
        `/conversations/${conversationId}/messages`,
        {
          params: { page, limit },
        },
      );
      const messages = response.data?.messages || [];
      return messages.map((message) => this.normalizeMessage(message));
    } catch (error) {
      console.error("Error fetching messages:", error);
      throw error;
    }
  }

  /**
   * Send a message (Socket.io for real-time)
   */
  sendMessage(conversationId, text) {
    const payload = typeof text === "string" ? { text } : text || {};
    const messageText =
      payload.text?.trim() || (payload.image ? "[Image]" : "");

    if (!messageText) {
      return Promise.reject(new Error("Message cannot be empty"));
    }

    if (!this.isSocketConnected()) {
      console.warn("Socket not connected. Falling back to REST API.");
      return this.sendMessageREST(conversationId, {
        text: messageText,
        image: payload.image || null,
      });
    }

    return new Promise((resolve, reject) => {
      this.socket.emit(
        "send_message",
        { conversationId, text: messageText },
        (response) => {
          if (response.success) {
            resolve(
              this.normalizeMessage({
                ...response.data,
                image: payload.image || null,
              }),
            );
          } else {
            reject(new Error(response.message || "Failed to send message"));
          }
        },
      );
    });
  }

  /**
   * Send a message via REST API (fallback)
   */
  async sendMessageREST(conversationId, payload) {
    try {
      const response = await api.post("/messages", {
        conversationId,
        text: payload.text,
      });
      return this.normalizeMessage({
        ...(response.data?.message || {}),
        image: payload.image || null,
      });
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  }

  /**
   * Mark a message as read (Socket.io)
   */
  markMessageAsRead(messageId) {
    if (!this.isSocketConnected()) {
      console.warn("Socket not connected. Falling back to REST API.");
      return this.markMessageAsReadREST(messageId);
    }

    this.socket.emit("mark_read", { messageId });
  }

  /**
   * Mark message as read via REST API (fallback)
   */
  async markMessageAsReadREST(messageId) {
    try {
      const response = await api.put(`/messages/${messageId}/read`);
      return response.data;
    } catch (error) {
      console.error("Error marking message as read:", error);
      throw error;
    }
  }

  /**
   * Mark all messages in a conversation as read
   */
  async markAllMessagesAsRead(conversationId) {
    try {
      if (String(conversationId).startsWith("new-")) {
        return { success: true };
      }

      const response = await api.put(
        `/conversations/${conversationId}/mark-all-read`,
      );
      return response.data;
    } catch (error) {
      console.error("Error marking all messages as read:", error);
      throw error;
    }
  }

  async markAsRead(conversationId) {
    return this.markAllMessagesAsRead(conversationId);
  }

  // ========================================
  // TYPING INDICATORS
  // ========================================

  /**
   * Send typing indicator
   */
  startTyping(conversationId) {
    if (!this.isSocketConnected()) return;

    this.socket.emit("typing", { conversationId });
  }

  /**
   * Send stop typing indicator
   */
  stopTyping(conversationId) {
    if (!this.isSocketConnected()) return;

    this.socket.emit("stop_typing", { conversationId });
  }
}

// Create and export singleton instance
const chatService = new ChatService();
export default chatService;
