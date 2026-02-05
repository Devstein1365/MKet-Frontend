// Mock Chat/Messaging Service
// This simulates chat functionality and will be replaced with real backend + WebSocket later

// Storage keys
const STORAGE_KEYS = {
  CONVERSATIONS: "mket_conversations",
  MESSAGES: "mket_messages",
};

// Load from localStorage or use defaults
const loadFromStorage = (key, defaultValue) => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch (error) {
    console.error("Error loading from storage:", error);
    return defaultValue;
  }
};

// Save to localStorage
const saveToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error("Error saving to storage:", error);
  }
};

const mockConversations = [
  {
    id: 1,
    participant: {
      id: 2,
      name: "Aisha Mohammed",
      avatar: null,
      verified: true,
      isOnline: true,
    },
    product: {
      id: 1,
      title: "iPhone 13 Pro Max 256GB",
      image:
        "https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=400",
      price: 450000,
    },
    lastMessage: {
      id: 5,
      text: "Yes, battery health is at 95%. Would you like to see more pictures?",
      senderId: 2,
      timestamp: "2025-11-04T14:30:00Z",
      isRead: false,
    },
    unreadCount: 2,
    updatedAt: "2025-11-04T14:30:00Z",
  },
  {
    id: 2,
    participant: {
      id: 4,
      name: "Ibrahim Usman",
      avatar: null,
      verified: true,
      isOnline: false,
      lastSeen: "2025-11-04T12:00:00Z",
    },
    product: {
      id: 4,
      title: "Gaming Laptop - ASUS ROG",
      image:
        "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400",
      price: 650000,
    },
    lastMessage: {
      id: 12,
      text: "Okay, I'll check it out tomorrow. Thanks!",
      senderId: 0, // Current user
      timestamp: "2025-11-04T10:15:00Z",
      isRead: true,
    },
    unreadCount: 0,
    updatedAt: "2025-11-04T10:15:00Z",
  },
  {
    id: 3,
    participant: {
      id: 3,
      name: "Fatima Yusuf",
      avatar: null,
      verified: false,
      isOnline: true,
    },
    product: {
      id: 3,
      title: "Engineering Mathematics Textbook Set",
      image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400",
      price: 15000,
    },
    lastMessage: {
      id: 8,
      text: "The books are in great condition, barely used. I can meet at Main Campus.",
      senderId: 3,
      timestamp: "2025-11-03T16:45:00Z",
      isRead: true,
    },
    unreadCount: 0,
    updatedAt: "2025-11-03T16:45:00Z",
  },
  {
    id: 4,
    participant: {
      id: 7,
      name: "Chioma Nwosu",
      avatar: null,
      verified: true,
      isOnline: false,
      lastSeen: "2025-11-03T20:30:00Z",
    },
    product: {
      id: 7,
      title: "iPad Air 5th Gen 256GB - WiFi Only",
      image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400",
      price: 380000,
    },
    lastMessage: {
      id: 15,
      text: "Is this still available?",
      senderId: 0,
      timestamp: "2025-11-03T15:20:00Z",
      isRead: true,
    },
    unreadCount: 0,
    updatedAt: "2025-11-03T15:20:00Z",
  },
];

const mockMessages = {
  1: [
    {
      id: 1,
      text: "Hello! I'm interested in the iPhone. Is it still available?",
      senderId: 0,
      timestamp: "2025-11-04T13:00:00Z",
      isRead: true,
    },
    {
      id: 2,
      text: "Yes, it's available! Would you like to know more about it?",
      senderId: 2,
      timestamp: "2025-11-04T13:05:00Z",
      isRead: true,
    },
    {
      id: 3,
      text: "Great! What's the battery health? Any issues with the phone?",
      senderId: 0,
      timestamp: "2025-11-04T13:10:00Z",
      isRead: true,
    },
    {
      id: 4,
      text: "No issues at all. Everything works perfectly.",
      senderId: 2,
      timestamp: "2025-11-04T14:00:00Z",
      isRead: true,
    },
    {
      id: 5,
      text: "Yes, battery health is at 95%. Would you like to see more pictures?",
      senderId: 2,
      timestamp: "2025-11-04T14:30:00Z",
      isRead: false,
    },
  ],
  2: [
    {
      id: 9,
      text: "Hi! Is the laptop still available?",
      senderId: 0,
      timestamp: "2025-11-04T09:00:00Z",
      isRead: true,
    },
    {
      id: 10,
      text: "Yes! It's available. Would you like to meet up?",
      senderId: 4,
      timestamp: "2025-11-04T09:30:00Z",
      isRead: true,
    },
    {
      id: 11,
      text: "Sure! Where are you located?",
      senderId: 0,
      timestamp: "2025-11-04T09:45:00Z",
      isRead: true,
    },
    {
      id: 12,
      text: "Okay, I'll check it out tomorrow. Thanks!",
      senderId: 0,
      timestamp: "2025-11-04T10:15:00Z",
      isRead: true,
    },
  ],
  3: [
    {
      id: 6,
      text: "Hi! I need the Engineering Math books. Are they available?",
      senderId: 0,
      timestamp: "2025-11-03T16:00:00Z",
      isRead: true,
    },
    {
      id: 7,
      text: "Yes! All volumes are available.",
      senderId: 3,
      timestamp: "2025-11-03T16:20:00Z",
      isRead: true,
    },
    {
      id: 8,
      text: "The books are in great condition, barely used. I can meet at Main Campus.",
      senderId: 3,
      timestamp: "2025-11-03T16:45:00Z",
      isRead: true,
    },
  ],
  4: [
    {
      id: 13,
      text: "Hi! I saw your iPad listing.",
      senderId: 0,
      timestamp: "2025-11-03T15:00:00Z",
      isRead: true,
    },
    {
      id: 14,
      text: "Yes, it's a great device!",
      senderId: 7,
      timestamp: "2025-11-03T15:10:00Z",
      isRead: true,
    },
    {
      id: 15,
      text: "Is this still available?",
      senderId: 0,
      timestamp: "2025-11-03T15:20:00Z",
      isRead: true,
    },
  ],
};

// Service functions
export const chatService = {
  // Get all conversations
  getAllConversations: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Load stored conversations from localStorage
        const storedConversations = loadFromStorage(
          STORAGE_KEYS.CONVERSATIONS,
          []
        );

        // Merge with mock conversations (prioritize stored ones)
        const mergedConversations = [...storedConversations];

        // Add mock conversations that don't exist in stored
        mockConversations.forEach((mockConv) => {
          const exists = storedConversations.some(
            (stored) => stored.id === mockConv.id
          );
          if (!exists) {
            mergedConversations.push(mockConv);
          }
        });

        // Sort by most recent
        const sorted = mergedConversations.sort(
          (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
        );

        resolve(sorted);
      }, 300);
    });
  },

  // Get conversation by ID
  getConversationById: (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const conversation = mockConversations.find(
          (c) => c.id === parseInt(id)
        );
        if (conversation) {
          resolve(conversation);
        } else {
          reject(new Error("Conversation not found"));
        }
      }, 300);
    });
  },

  // Get messages for a conversation
  getMessages: (conversationId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Load stored messages
        const allMessages = loadFromStorage(STORAGE_KEYS.MESSAGES, {});

        // Check stored messages first, then fall back to mock
        const messages =
          allMessages[conversationId] || mockMessages[conversationId] || [];
        resolve(messages);
      }, 300);
    });
  },

  // Send a message
  sendMessage: (conversationId, messageData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newMessage = {
          id: Date.now(),
          text: messageData.text,
          image: messageData.image || null,
          senderId: 0, // Current user
          timestamp: new Date().toISOString(),
          isRead: false,
        };

        // Load all messages from storage
        const allMessages = loadFromStorage(STORAGE_KEYS.MESSAGES, {});

        // Store the message in the conversation's messages
        if (!allMessages[conversationId]) {
          allMessages[conversationId] = [];
        }
        allMessages[conversationId].push(newMessage);

        // Save messages to localStorage
        saveToStorage(STORAGE_KEYS.MESSAGES, allMessages);

        // Update the conversation's last message in stored conversations
        const storedConversations = loadFromStorage(
          STORAGE_KEYS.CONVERSATIONS,
          []
        );

        const updatedConversations = storedConversations.map((conv) =>
          conv.id === conversationId ||
          String(conv.id) === String(conversationId)
            ? {
                ...conv,
                lastMessage: newMessage,
                updatedAt: newMessage.timestamp,
              }
            : conv
        );

        // If conversation doesn't exist in stored, find it in mock and update
        const convExists = storedConversations.some(
          (conv) =>
            conv.id === conversationId ||
            String(conv.id) === String(conversationId)
        );

        if (!convExists) {
          const mockConv = mockConversations.find(
            (c) =>
              c.id === conversationId || String(c.id) === String(conversationId)
          );
          if (mockConv) {
            updatedConversations.push({
              ...mockConv,
              lastMessage: newMessage,
              updatedAt: newMessage.timestamp,
            });
          }
        }

        // Save conversations to localStorage
        saveToStorage(STORAGE_KEYS.CONVERSATIONS, updatedConversations);

        resolve(newMessage);
      }, 300);
    });
  },

  // Mark messages as read
  markAsRead: (conversationId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const conversation = mockConversations.find(
          (c) => c.id === parseInt(conversationId)
        );
        if (conversation) {
          conversation.unreadCount = 0;

          // Mark all messages as read
          const messages = mockMessages[conversationId] || [];
          messages.forEach((msg) => {
            if (msg.senderId !== 0) {
              msg.isRead = true;
            }
          });
        }
        resolve();
      }, 100);
    });
  },

  // Search conversations
  searchConversations: (query) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Load stored conversations from localStorage
        const storedConversations = loadFromStorage(
          STORAGE_KEYS.CONVERSATIONS,
          []
        );

        // Merge with mock conversations (prioritize stored ones)
        const mergedConversations = [...storedConversations];

        // Add mock conversations that don't exist in stored
        mockConversations.forEach((mockConv) => {
          const exists = storedConversations.some(
            (stored) => stored.id === mockConv.id
          );
          if (!exists) {
            mergedConversations.push(mockConv);
          }
        });

        if (!query.trim()) {
          // Sort by most recent
          const sorted = mergedConversations.sort(
            (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
          );
          resolve(sorted);
          return;
        }

        const filtered = mergedConversations.filter((conv) => {
          const nameMatch = conv.participant.name
            .toLowerCase()
            .includes(query.toLowerCase());
          const productMatch = conv.product.title
            .toLowerCase()
            .includes(query.toLowerCase());
          const messageMatch = conv.lastMessage.text
            .toLowerCase()
            .includes(query.toLowerCase());
          return nameMatch || productMatch || messageMatch;
        });

        // Sort by most recent
        const sorted = filtered.sort(
          (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
        );

        resolve(sorted);
      }, 200);
    });
  },

  // Get unread count
  getUnreadCount: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const total = mockConversations.reduce(
          (sum, conv) => sum + conv.unreadCount,
          0
        );
        resolve(total);
      }, 100);
    });
  },
};

export default chatService;
