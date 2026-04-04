import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaSearch,
  FaPaperPlane,
  FaImage,
  FaTimes,
  FaArrowLeft,
  FaCheckCircle,
  FaCircle,
  FaEllipsisV,
} from "react-icons/fa";
import chatService from "../../services/chatService";
import reportService from "../../services/reportService";
import { useUnreadMessages } from "../../context/UnreadMessagesContext";
import Button from "../../components/shared/Button";
import Input from "../../components/shared/Input";
import Avatar from "../../components/shared/Avatar";
import Card from "../../components/shared/Card";
import Modal from "../../components/shared/Modal";

const Messages = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { decrementUnreadCount } = useUnreadMessages();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sending, setSending] = useState(false);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [isSocketConnected, setIsSocketConnected] = useState(
    chatService.isSocketConnected(),
  );
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [blockedUsers, setBlockedUsers] = useState(() => {
    const stored = localStorage.getItem("mket_blocked_users");
    return stored ? JSON.parse(stored) : [];
  });
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [showQuickReplies, setShowQuickReplies] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportDescription, setReportDescription] = useState("");
  const [submittingReport, setSubmittingReport] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const optionsMenuRef = useRef(null);
  const selectedConversationRef = useRef(null);

  // Keep ref in sync so socket handlers always read the latest value
  useEffect(() => {
    selectedConversationRef.current = selectedConversation;
  }, [selectedConversation]);

  // Modal state
  const [modal, setModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "info",
  });

  const showModal = (title, message, type = "info") => {
    setModal({ isOpen: true, title, message, type });
  };

  const closeModal = () => {
    setModal({ ...modal, isOpen: false });
  };

  // Load conversations
  useEffect(() => {
    const loadConversations = async () => {
      try {
        const data = await chatService.getAllConversations();

        // Filter out blocked users
        const filteredData = data.filter(
          (conv) => !blockedUsers.includes(conv.participant?.id),
        );

        setConversations(filteredData);

        // Check if we came from "Chat with Seller" button
        if (location.state?.sellerId) {
          const {
            sellerId,
            sellerName,
            sellerAvatar,
            productId,
            productTitle,
            productImage,
            productPrice,
          } = location.state;

          // Find existing conversation with this seller (mock data uses `participant`)
          let conversation = data.find(
            (conv) => conv.participant?.id === sellerId,
          );

          // If no existing conversation, create a temporary one
          // DON'T save to localStorage yet - only save when user sends first message
          if (!conversation) {
            conversation = {
              id: `new-${sellerId}`,
              participant: {
                id: sellerId,
                name: sellerName,
                avatar: sellerAvatar || null,
                verified: false,
                isOnline: true,
              },
              lastMessage: null, // No last message yet
              unreadCount: 0,
              product: productId
                ? {
                    id: productId,
                    title: productTitle,
                    image: productImage,
                    price: productPrice,
                  }
                : {
                    id: null,
                    title: "",
                    image: null,
                    price: null,
                  },
              updatedAt: new Date().toISOString(),
              isTemporary: true, // Flag to indicate this is not yet saved
            };
          }

          // Auto-select this conversation (but don't add to list yet if temporary)
          setSelectedConversation(conversation);

          // Show quick replies only for NEW conversations from "Chat with Seller"
          if (!conversation.lastMessage && productId) {
            setShowQuickReplies(true);
          }
        }
      } catch (error) {
        console.error("Error loading conversations:", error);
      }
    };

    loadConversations();
  }, [location.state, blockedUsers]);

  // Load messages when conversation is selected
  useEffect(() => {
    if (
      selectedConversation &&
      !String(selectedConversation.id).startsWith("new-")
    ) {
      loadMessages(selectedConversation.id);
      chatService.markAsRead(selectedConversation.id);
      chatService.joinConversation(selectedConversation.id);
    }
    return () => {
      if (
        selectedConversation &&
        !String(selectedConversation.id).startsWith("new-")
      ) {
        chatService.leaveConversation(selectedConversation.id);
      }
    };
  }, [selectedConversation]);

  // Auto-scroll to bottom
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Search conversations
  useEffect(() => {
    const searchChats = async () => {
      const results = await chatService.searchConversations(searchQuery);
      setConversations(results);
    };

    const debounce = setTimeout(() => {
      searchChats();
    }, 300);

    return () => clearTimeout(debounce);
  }, [searchQuery]);

  // Socket.IO event listeners for real-time chat
  useEffect(() => {
    // Connect to socket when component mounts
    chatService.connect();

    // Listen for new messages
    const handleMessageReceived = (message) => {
      console.log("New message received:", message);

      const current = selectedConversationRef.current;

      // If the message is for the currently selected conversation, add it to messages.
      // Guard against duplicates — the sender already added their own message optimistically.
      if (current && message.conversationId === current.id) {
        setMessages((prev) => {
          const alreadyExists = prev.some((m) => m.id === message.id);
          if (alreadyExists) return prev;
          return [...prev, { ...message, deliveryState: "SENT" }];
        });

        chatService.markAsRead(message.conversationId).catch((error) => {
          console.error("Failed to mark conversation as read:", error);
        });
      }

      // Update conversations list to reflect new message
      setConversations((prevConversations) => {
        return prevConversations.map((conv) => {
          if (conv.id === message.conversationId) {
            return {
              ...conv,
              lastMessage: message,
              unreadCount:
                selectedConversationRef.current?.id === message.conversationId
                  ? 0
                  : (conv.unreadCount || 0) + 1,
              updatedAt: message.timestamp || new Date().toISOString(),
            };
          }
          return conv;
        });
      });
    };

    // Listen for user status changes
    const handleUserStatusChanged = ({ userId, isOnline }) => {
      setConversations((prevConversations) => {
        return prevConversations.map((conv) => {
          if (conv.participant?.id === userId) {
            return {
              ...conv,
              participant: {
                ...conv.participant,
                isOnline,
              },
            };
          }
          return conv;
        });
      });

      // Update currently selected conversation if needed
      const current = selectedConversationRef.current;
      if (current?.participant?.id === userId) {
        setSelectedConversation((prev) => ({
          ...prev,
          participant: {
            ...prev.participant,
            isOnline,
          },
        }));
      }
    };

    const handleMessageRead = ({ messageId, conversationId }) => {
      setMessages((prev) =>
        prev.map((msg) => {
          if (msg.id === messageId) {
            return { ...msg, isRead: true };
          }

          if (msg.conversationId === conversationId && msg.senderId === 0) {
            return { ...msg, isRead: true };
          }

          return msg;
        }),
      );
    };

    const handleMessageDelivered = ({ messageId, clientTempId }) => {
      setMessages((prev) =>
        prev.map((msg) => {
          const byTemp = Boolean(
            clientTempId && msg.clientTempId === clientTempId,
          );
          const byId = Boolean(!clientTempId && msg.id === messageId);
          if (!byTemp && !byId) return msg;

          return {
            ...msg,
            id: String(msg.id).startsWith("temp-") ? messageId : msg.id,
            deliveryState: "SENT",
            failed: false,
          };
        }),
      );
    };

    const handleConnectionStatus = ({ connected }) => {
      setIsSocketConnected(Boolean(connected));
      if (connected) {
        setIsReconnecting(false);
      }
    };

    const handleReconnecting = () => {
      setIsReconnecting(true);
      setIsSocketConnected(false);
    };

    const handleConnectionRestored = async () => {
      setIsReconnecting(false);
      setIsSocketConnected(true);

      try {
        const refreshed = await chatService.getAllConversations();
        const filteredData = refreshed.filter(
          (conv) => !blockedUsers.includes(conv.participant?.id),
        );
        setConversations(filteredData);

        const current = selectedConversationRef.current;
        if (current && !String(current.id).startsWith("new-")) {
          const refreshedMessages = await chatService.getMessages(current.id);
          setMessages(refreshedMessages);
          await chatService.markAsRead(current.id);
          chatService.joinConversation(current.id);
        }
      } catch (error) {
        console.error("Reconnect sync failed:", error);
      }
    };

    // Register event listeners once — ref keeps values current
    chatService.on("message_received", handleMessageReceived);
    chatService.on("user_status_changed", handleUserStatusChanged);
    chatService.on("message_read", handleMessageRead);
    chatService.on("message_delivered", handleMessageDelivered);
    chatService.on("connection_status", handleConnectionStatus);
    chatService.on("connection_reconnecting", handleReconnecting);
    chatService.on("connection_restored", handleConnectionRestored);

    // Cleanup: remove listeners on unmount
    return () => {
      chatService.off("message_received", handleMessageReceived);
      chatService.off("user_status_changed", handleUserStatusChanged);
      chatService.off("message_read", handleMessageRead);
      chatService.off("message_delivered", handleMessageDelivered);
      chatService.off("connection_status", handleConnectionStatus);
      chatService.off("connection_reconnecting", handleReconnecting);
      chatService.off("connection_restored", handleConnectionRestored);
      // Note: Don't disconnect socket here as other components might be using it
    };
  }, [blockedUsers]);

  const loadMessages = async (conversationId) => {
    try {
      const data = await chatService.getMessages(conversationId);
      setMessages(data);
    } catch (error) {
      console.error("Error loading messages:", error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);

    // Decrement global unread count if this conversation has unread messages
    if (conversation.unreadCount > 0) {
      decrementUnreadCount(conversation.unreadCount);
    }

    // Update unread count
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === conversation.id ? { ...conv, unreadCount: 0 } : conv,
      ),
    );
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim() && !imagePreview) return;

    setSending(true);

    // Hide quick replies when user sends a message
    setShowQuickReplies(false);

    try {
      const tempId = `temp-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

      const messageData = {
        text: messageInput.trim(),
        image: imagePreview,
        clientTempId: tempId,
      };

      const optimisticMessage = {
        id: tempId,
        clientTempId: tempId,
        conversationId: selectedConversation.id,
        senderId: 0,
        text: messageData.text,
        image: messageData.image,
        isRead: false,
        timestamp: new Date().toISOString(),
        deliveryState: "SENDING",
        failed: false,
      };
      setMessages((prev) => [...prev, optimisticMessage]);

      let targetConversationId = selectedConversation.id;

      // If this is a temporary conversation (first message), save it first
      if (selectedConversation.isTemporary) {
        const backendConversation = await chatService.createOrGetConversation(
          selectedConversation.participant.id,
          selectedConversation.product?.id || undefined,
        );

        const realConversationId = backendConversation?.conversation?.id;

        if (!realConversationId) {
          throw new Error("Failed to create conversation");
        }

        targetConversationId = realConversationId;

        const conversationToSave = {
          ...selectedConversation,
          id: realConversationId,
          isTemporary: false, // Remove temporary flag
        };

        // Save the conversation to localStorage before sending message
        const storedConversations =
          JSON.parse(localStorage.getItem("mket_conversations")) || [];
        localStorage.setItem(
          "mket_conversations",
          JSON.stringify([conversationToSave, ...storedConversations]),
        );

        // Update selectedConversation to remove temporary flag
        setSelectedConversation(conversationToSave);
      }

      const newMessage = await chatService.sendMessage(
        targetConversationId,
        messageData,
      );

      setMessages((prev) =>
        prev.map((msg) =>
          msg.clientTempId === tempId
            ? {
                ...newMessage,
                clientTempId: tempId,
                deliveryState: "SENT",
                failed: false,
              }
            : msg,
        ),
      );
      setMessageInput("");
      setImagePreview(null);

      // Reload conversations from service to get updated data from localStorage
      const updatedConversations = await chatService.getAllConversations();
      setConversations(updatedConversations);

      // Update the selectedConversation with the new lastMessage
      const updatedSelectedConv = updatedConversations.find(
        (conv) =>
          conv.id === targetConversationId ||
          String(conv.id) === String(targetConversationId),
      );
      if (updatedSelectedConv) {
        setSelectedConversation(updatedSelectedConv);
      }
    } catch (error) {
      console.error("Error sending message:", error);

      setMessages((prev) => {
        if (!prev.length) return prev;

        const updated = [...prev];
        for (let i = updated.length - 1; i >= 0; i -= 1) {
          if (
            updated[i].senderId === 0 &&
            updated[i].deliveryState === "SENDING"
          ) {
            updated[i] = {
              ...updated[i],
              deliveryState: "FAILED",
              failed: true,
            };
            break;
          }
        }

        return updated;
      });

      showModal("Error", "Failed to send message. Please try again.", "error");
    } finally {
      setSending(false);
    }
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleQuickReply = (message) => {
    setMessageInput(message);
    setShowQuickReplies(false);
    // Auto-focus the input after selecting quick reply
    setTimeout(() => {
      const textarea = document.querySelector(
        'textarea[placeholder="Type a message..."]',
      );
      if (textarea) textarea.focus();
    }, 100);
  };

  const handleViewProduct = () => {
    if (selectedConversation?.product?.id) {
      navigate(`/dashboard/product/${selectedConversation.product.id}`);
    }
  };

  const handleViewProfile = () => {
    if (selectedConversation?.participant?.id) {
      navigate(`/dashboard/profile/${selectedConversation.participant.id}`);
      setShowOptionsMenu(false);
    }
  };

  const handleBlockUser = () => {
    setConfirmAction({
      type: "block",
      title: "Block User",
      message: `Are you sure you want to block ${selectedConversation?.participant?.name}? You won't receive messages from this user anymore.`,
      onConfirm: () => {
        const userId = selectedConversation.participant.id;
        const updatedBlockedUsers = [...blockedUsers, userId];
        setBlockedUsers(updatedBlockedUsers);
        localStorage.setItem(
          "mket_blocked_users",
          JSON.stringify(updatedBlockedUsers),
        );

        // Remove conversation from list
        setConversations((prev) =>
          prev.filter((conv) => conv.participant.id !== userId),
        );
        setSelectedConversation(null);
        setShowConfirmModal(false);
        showModal(
          "User Blocked",
          `${selectedConversation?.participant?.name} has been blocked successfully.`,
          "success",
        );
      },
    });
    setShowConfirmModal(true);
    setShowOptionsMenu(false);
  };

  const handleReportUser = () => {
    setShowOptionsMenu(false);
    setShowReportModal(true);
    setReportReason("");
    setReportDescription("");
  };

  const submitReport = async () => {
    if (!reportReason) {
      showModal("Error", "Please select a reason for reporting", "error");
      return;
    }

    setSubmittingReport(true);

    try {
      const result = await reportService.reportUser(
        selectedConversation.participant.id,
        reportReason,
        reportDescription,
      );

      if (result.success) {
        setShowReportModal(false);
        showModal(
          "Report Submitted",
          "Thank you for your report. We will review it shortly.",
          "success",
        );
      } else {
        showModal(
          "Error",
          result.message || "Failed to submit report",
          "error",
        );
      }
    } catch (error) {
      console.error("Report submission error:", error);
      showModal(
        "Error",
        "An error occurred while submitting the report",
        "error",
      );
    } finally {
      setSubmittingReport(false);
    }
  };

  const handleDeleteConversation = () => {
    setConfirmAction({
      type: "delete",
      title: "Delete Conversation",
      message: `Are you sure you want to delete this conversation with ${selectedConversation?.participant?.name}? This action cannot be undone.`,
      onConfirm: async () => {
        const conversationId = selectedConversation.id;

        try {
          // Call API to delete conversation
          const result = await chatService.deleteConversation(conversationId);

          if (result.success) {
            // Remove from state
            setConversations((prev) =>
              prev.filter((conv) => conv.id !== conversationId),
            );
            setSelectedConversation(null);
            setShowConfirmModal(false);
            showModal(
              "Conversation Deleted",
              "The conversation has been deleted successfully.",
              "success",
            );
          } else {
            showModal(
              "Error",
              result.message || "Failed to delete conversation",
              "error",
            );
          }
        } catch (error) {
          console.error("Delete conversation error:", error);
          showModal(
            "Error",
            "An error occurred while deleting the conversation.",
            "error",
          );
        }
      },
    });
    setShowConfirmModal(true);
    setShowOptionsMenu(false);
  };

  // Close options menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        optionsMenuRef.current &&
        !optionsMenuRef.current.contains(event.target)
      ) {
        setShowOptionsMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formatTime = (timestamp) => {
    // Handle null/undefined timestamps
    if (!timestamp) return "Offline";

    const date = new Date(timestamp);

    // Check if date is valid
    if (isNaN(date.getTime())) return "Offline";

    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  };

  const formatLastSeen = (timestamp, isOnline) => {
    // If user is online, don't show last seen
    if (isOnline) return null;

    // Handle null/undefined timestamps
    if (!timestamp) return "Offline";

    const date = new Date(timestamp);

    // Check if date is valid
    if (isNaN(date.getTime())) return "Offline";

    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    // For recent activity, show relative time
    if (diffMins < 1) return "Last seen just now";
    if (diffMins < 60)
      return `Last seen ${diffMins} ${diffMins === 1 ? "min" : "mins"} ago`;
    if (diffHours < 24)
      return `Last seen ${diffHours} ${diffHours === 1 ? "hour" : "hours"} ago`;

    // For today, show time
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dateDay = new Date(date);
    dateDay.setHours(0, 0, 0, 0);

    if (dateDay.getTime() === today.getTime()) {
      return `Last seen today at ${date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })}`;
    }

    // For yesterday
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (dateDay.getTime() === yesterday.getTime()) {
      return `Last seen yesterday at ${date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })}`;
    }

    // For this week, show day name
    if (diffDays < 7) {
      return `Last seen ${date.toLocaleDateString("en-US", { weekday: "long" })} at ${date.toLocaleTimeString(
        "en-US",
        {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        },
      )}`;
    }

    // For older, show date
    return `Last seen ${date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    })}`;
  };

  const formatMessageTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="h-[calc(100vh-4rem)] bg-gray-50 flex">
      {/* Conversations List - Left Sidebar */}
      <div
        className={`${
          selectedConversation ? "hidden lg:flex" : "flex"
        } w-full lg:w-96 flex-col bg-white border-r border-gray-200`}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-2xl font-inter font-bold text-gray-900 mb-4">
            Messages
          </h1>
          {/* Search */}
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg font-instrument focus:outline-none focus:ring-2 focus:ring-[#7E22CE] focus:border-transparent"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <FaSearch className="text-4xl text-gray-400" />
              </div>
              <p className="text-gray-600 font-instrument">
                {searchQuery ? "No conversations found" : "No messages yet"}
              </p>
            </div>
          ) : (
            <AnimatePresence>
              {conversations.map((conversation) => (
                <motion.div
                  key={conversation.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onClick={() => handleSelectConversation(conversation)}
                  className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedConversation?.id === conversation.id
                      ? "bg-[#7E22CE]/5"
                      : ""
                  }`}
                >
                  <div className="flex gap-3">
                    {/* Avatar with online status */}
                    <div className="relative shrink-0">
                      <Avatar
                        src={conversation.participant.avatar}
                        alt={conversation.participant.name}
                        size="lg"
                      />
                      {conversation.participant.isOnline && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <div className="flex items-center gap-1">
                          <h3 className="font-instrument font-semibold text-gray-900 truncate">
                            {conversation.participant.name}
                          </h3>
                          {conversation.participant.verified && (
                            <FaCheckCircle className="text-[#14B8A6] text-xs shrink-0" />
                          )}
                        </div>
                        {conversation.lastMessage && (
                          <span className="text-xs text-gray-500 font-instrument shrink-0 ml-2">
                            {formatTime(conversation.lastMessage.timestamp)}
                          </span>
                        )}
                      </div>

                      {/* Product info */}
                      <div className="flex items-center gap-2 mb-1">
                        <img
                          src={conversation.product.image}
                          alt=""
                          className="w-6 h-6 rounded object-cover"
                        />
                        <p className="text-xs text-gray-600 font-instrument truncate">
                          {conversation.product.title}
                        </p>
                      </div>

                      {/* Last message */}
                      <div className="flex items-center justify-between">
                        {conversation.lastMessage ? (
                          <p
                            className={`text-sm font-instrument truncate ${
                              conversation.unreadCount > 0
                                ? "font-semibold text-gray-900"
                                : "text-gray-600"
                            }`}
                          >
                            {conversation.lastMessage.senderId === 0 && "You: "}
                            {conversation.lastMessage.text}
                          </p>
                        ) : (
                          <p className="text-sm font-instrument text-gray-400 italic truncate">
                            Start a conversation...
                          </p>
                        )}
                        {conversation.unreadCount > 0 && (
                          <div className="shrink-0 ml-2 w-5 h-5 bg-[#7E22CE] text-white rounded-full flex items-center justify-center text-xs font-inter font-bold">
                            {conversation.unreadCount}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>

      {/* Chat Window - Right Side */}
      {selectedConversation ? (
        <div className="flex-1 flex flex-col bg-white">
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-white">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedConversation(null)}
                className="lg:hidden text-gray-600 hover:text-gray-900"
              >
                <FaArrowLeft />
              </button>
              <div className="relative">
                <Avatar
                  src={selectedConversation.participant.avatar}
                  alt={selectedConversation.participant.name}
                  size="md"
                />
                {selectedConversation.participant.isOnline && (
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <h2 className="font-instrument font-semibold text-gray-900">
                    {selectedConversation.participant.name}
                  </h2>
                  {selectedConversation.participant.verified && (
                    <FaCheckCircle className="text-[#14B8A6] text-xs" />
                  )}
                </div>
                <p className="text-xs text-gray-600 font-instrument">
                  {selectedConversation.participant.isOnline
                    ? "Online"
                    : formatLastSeen(
                        selectedConversation.participant.lastSeen,
                        selectedConversation.participant.isOnline,
                      )}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {!isSocketConnected && (
                <span className="text-xs font-instrument text-amber-600">
                  {isReconnecting ? "Reconnecting..." : "Offline"}
                </span>
              )}
              <div className="relative" ref={optionsMenuRef}>
                <button
                  onClick={() => setShowOptionsMenu(!showOptionsMenu)}
                  className="text-gray-600 hover:text-gray-900"
                >
                  <FaEllipsisV />
                </button>

                {/* Options Dropdown Menu */}
                {showOptionsMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                  >
                    <button
                      onClick={handleViewProfile}
                      className="w-full px-4 py-2 text-left text-sm font-instrument text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      View Profile
                    </button>
                    <button
                      onClick={handleDeleteConversation}
                      className="w-full px-4 py-2 text-left text-sm font-instrument text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Delete Conversation
                    </button>
                    <button
                      onClick={handleBlockUser}
                      className="w-full px-4 py-2 text-left text-sm font-instrument text-red-600 hover:bg-red-50 transition-colors"
                    >
                      Block User
                    </button>
                    <button
                      onClick={handleReportUser}
                      className="w-full px-4 py-2 text-left text-sm font-instrument text-red-600 hover:bg-red-50 transition-colors"
                    >
                      Report User
                    </button>
                  </motion.div>
                )}
              </div>
            </div>
          </div>

          {/* Product Context Banner - Only show if there's a product */}
          {selectedConversation.product?.id &&
            selectedConversation.product?.price && (
              <div className="p-3 bg-gray-50 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedConversation.product.image}
                    alt={selectedConversation.product.title}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-instrument font-semibold text-gray-900 truncate">
                      {selectedConversation.product.title}
                    </p>
                    <p className="text-sm font-inter font-bold text-[#7E22CE]">
                      ₦
                      {parseInt(
                        selectedConversation.product.price,
                      ).toLocaleString()}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleViewProduct}
                  >
                    View
                  </Button>
                </div>
              </div>
            )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => {
              const isCurrentUser = message.senderId === 0;
              const showTime =
                index === 0 ||
                new Date(message.timestamp).getTime() -
                  new Date(messages[index - 1].timestamp).getTime() >
                  300000; // 5 minutes

              return (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${
                    isCurrentUser ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[75%] ${
                      isCurrentUser ? "items-end" : "items-start"
                    } flex flex-col gap-1`}
                  >
                    {showTime && (
                      <span className="text-xs text-gray-500 font-instrument px-3">
                        {formatMessageTime(message.timestamp)}
                      </span>
                    )}
                    {message.image && (
                      <img
                        src={message.image}
                        alt="Attachment"
                        className="max-w-64 rounded-lg"
                      />
                    )}
                    {message.text && (
                      <div
                        className={`px-4 py-2 rounded-2xl ${
                          isCurrentUser
                            ? "bg-[#7E22CE] text-white"
                            : "bg-gray-100 text-gray-900"
                        }`}
                      >
                        <p className="text-sm font-instrument wrap-break-word">
                          {message.text}
                        </p>
                      </div>
                    )}
                    {isCurrentUser && (
                      <span className="text-[10px] text-gray-500 font-instrument px-1">
                        {message.deliveryState === "SENDING"
                          ? "Sending..."
                          : message.deliveryState === "FAILED"
                            ? "Failed"
                            : message.isRead
                              ? "Read"
                              : "Sent"}
                      </span>
                    )}
                  </div>
                </motion.div>
              );
            })}

            {/* Quick Reply Suggestions - Only show for new conversations */}
            {showQuickReplies && messages.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-3"
              >
                <div className="flex items-center gap-2 text-gray-500 text-xs font-instrument mb-2">
                  <div className="h-px flex-1 bg-gray-300"></div>
                  <span>Quick replies</span>
                  <div className="h-px flex-1 bg-gray-300"></div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() =>
                      handleQuickReply("Hello! Is this still available?")
                    }
                    className="px-4 py-2 bg-white border-2 border-[#7E22CE] text-[#7E22CE] rounded-full font-instrument text-sm hover:bg-[#7E22CE] hover:text-white transition-all duration-200 shadow-sm"
                  >
                    Is this still available?
                  </button>
                  <button
                    onClick={() =>
                      handleQuickReply("Hi! What's the condition of the item?")
                    }
                    className="px-4 py-2 bg-white border-2 border-[#7E22CE] text-[#7E22CE] rounded-full font-instrument text-sm hover:bg-[#7E22CE] hover:text-white transition-all duration-200 shadow-sm"
                  >
                    What's the condition?
                  </button>
                  <button
                    onClick={() =>
                      handleQuickReply("Can we negotiate the price?")
                    }
                    className="px-4 py-2 bg-white border-2 border-[#7E22CE] text-[#7E22CE] rounded-full font-instrument text-sm hover:bg-[#7E22CE] hover:text-white transition-all duration-200 shadow-sm"
                  >
                    Can we negotiate?
                  </button>
                  <button
                    onClick={() =>
                      handleQuickReply("Where can we meet for the exchange?")
                    }
                    className="px-4 py-2 bg-white border-2 border-[#7E22CE] text-[#7E22CE] rounded-full font-instrument text-sm hover:bg-[#7E22CE] hover:text-white transition-all duration-200 shadow-sm"
                  >
                    Where can we meet?
                  </button>
                  <button
                    onClick={() =>
                      handleQuickReply(
                        "I'm interested! Can I get more details?",
                      )
                    }
                    className="px-4 py-2 bg-white border-2 border-[#7E22CE] text-[#7E22CE] rounded-full font-instrument text-sm hover:bg-[#7E22CE] hover:text-white transition-all duration-200 shadow-sm"
                  >
                    More details please
                  </button>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Image Preview */}
          {imagePreview && (
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <div className="relative inline-block">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="max-h-32 rounded-lg"
                />
                <button
                  onClick={() => setImagePreview(null)}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                >
                  <FaTimes className="text-xs" />
                </button>
              </div>
            </div>
          )}

          {/* Message Input */}
          <div className="p-4 border-t border-gray-200 bg-white">
            <div className="flex items-end gap-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageSelect}
                accept="image/*"
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="shrink-0 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors"
              >
                <FaImage />
              </button>
              <div className="flex-1">
                <textarea
                  value={messageInput}
                  onChange={(e) => {
                    setMessageInput(e.target.value);
                    // Hide quick replies when user starts typing manually
                    if (e.target.value.length > 0 && showQuickReplies) {
                      setShowQuickReplies(false);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Type a message..."
                  rows={1}
                  className="w-full px-4 py-2 border border-gray-300 rounded-2xl font-instrument focus:outline-none focus:ring-2 focus:ring-[#7E22CE] focus:border-transparent resize-none"
                  style={{
                    minHeight: "40px",
                    maxHeight: "120px",
                  }}
                />
              </div>
              <Button
                onClick={handleSendMessage}
                disabled={sending || (!messageInput.trim() && !imagePreview)}
                className="shrink-0 w-10 h-10 !rounded-full !p-0"
              >
                {sending ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                ) : (
                  <FaPaperPlane />
                )}
              </Button>
            </div>
          </div>
        </div>
      ) : (
        // Empty State - No conversation selected
        <div className="hidden lg:flex flex-1 items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="w-32 h-32 bg-linear-to-br from-[#7E22CE]/10 to-[#14B8A6]/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaPaperPlane className="text-5xl text-[#7E22CE]" />
            </div>
            <h2 className="text-2xl font-inter font-bold text-gray-900 mb-2">
              Your Messages
            </h2>
            <p className="text-gray-600 font-instrument max-w-sm">
              Select a conversation from the list to start chatting with buyers
              and sellers
            </p>
          </div>
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={modal.isOpen}
        onClose={closeModal}
        title={modal.title}
        message={modal.message}
        type={modal.type}
      />

      {/* Confirmation Modal for Block/Delete */}
      {showConfirmModal && confirmAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-xl"
          >
            <h3 className="text-xl font-inter font-bold text-gray-900 mb-3">
              {confirmAction.title}
            </h3>
            <p className="text-gray-600 font-instrument mb-6">
              {confirmAction.message}
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowConfirmModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant={confirmAction.type === "block" ? "danger" : "primary"}
                onClick={confirmAction.onConfirm}
                className="flex-1 bg-red-600 hover:bg-red-700"
              >
                {confirmAction.type === "block" ? "Block" : "Delete"}
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Report User Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-xl"
          >
            <h3 className="text-xl font-inter font-bold text-gray-900 mb-3">
              Report User
            </h3>
            <p className="text-gray-600 font-instrument mb-4">
              Report {selectedConversation?.participant?.name} for inappropriate
              behavior
            </p>

            {/* Reason Selection */}
            <div className="mb-4">
              <label className="block text-sm font-inter font-semibold text-gray-700 mb-2">
                Reason *
              </label>
              <select
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg font-instrument focus:outline-none focus:ring-2 focus:ring-[#7E22CE] focus:border-transparent"
              >
                <option value="">Select a reason</option>
                <option value="SPAM">Spam or misleading</option>
                <option value="HARASSMENT">Harassment or bullying</option>
                <option value="INAPPROPRIATE_CONTENT">
                  Inappropriate content
                </option>
                <option value="SCAM">Scam or fraud</option>
                <option value="FAKE_ACCOUNT">Fake account</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            {/* Description */}
            <div className="mb-6">
              <label className="block text-sm font-inter font-semibold text-gray-700 mb-2">
                Additional Details (Optional)
              </label>
              <textarea
                value={reportDescription}
                onChange={(e) => setReportDescription(e.target.value)}
                placeholder="Provide more information about this report..."
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg font-instrument focus:outline-none focus:ring-2 focus:ring-[#7E22CE] focus:border-transparent resize-none"
              ></textarea>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowReportModal(false)}
                className="flex-1"
                disabled={submittingReport}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={submitReport}
                className="flex-1"
                disabled={submittingReport || !reportReason}
              >
                {submittingReport ? "Submitting..." : "Submit Report"}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Messages;
