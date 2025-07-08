/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { Chat, Message, ChatState, CreateChatRequest } from "@/types/chat";
import { chatService } from "@/services/chat.service";
import socketService from "@/services/socket.service";

export interface Example {
  name: string;
  url: string;
}

interface ExtendedChatState extends ChatState {
  selectedExample: Example;
  examples: Example[];
  input: string;
  hasInitialAIResponse: boolean;
  hasInitialResponse: boolean;
  currentUserId: string | null;
  isSwitchingChat: boolean;
  typingUsers: Record<string, string[]>; // chatId -> userIds
  isSocketConnected: boolean;
}

interface Actions {
  // Example/navigation actions
  setSelectedExample: (example: Example) => void;
  setExamples: (examples: Example[]) => void;

  // Input handling
  setInput: (input: string) => void;
  handleInputChange: (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => void;

  // Chat actions
  loadUserChats: (token?: string) => Promise<void>;
  selectChat: (chatId: string, token?: string) => Promise<void>;
  createNewChat: (data: CreateChatRequest, token?: string) => Promise<Chat>;
  sendMessage: (
    content: string,
    attachments?: string[],
    token?: string
  ) => Promise<void>;
  markChatAsRead: (chatId: string, token?: string) => Promise<void>;
  deleteChat: (chatId: string, token?: string) => Promise<void>;

  // Real-time message handling
  addMessage: (message: Message) => void;
  updateMessage: (messageId: string, updates: Partial<Message>) => void;

  // Socket management
  initializeSocket: (token?: string, userId?: string) => Promise<void>;
  disconnectSocket: () => void;
  joinChatRoom: (chatId: string) => void;
  leaveChatRoom: (chatId: string) => void;
  sendTyping: (chatId: string, isTyping: boolean) => void;

  // Legacy actions for compatibility
  setchatBotMessages: (fn: (chatBotMessages: Message[]) => Message[]) => void;
  setMessages: (fn: (messages: Message[]) => Message[]) => void;
  setHasInitialAIResponse: (hasInitialAIResponse: boolean) => void;
  setHasInitialResponse: (hasInitialResponse: boolean) => void;

  // Error handling
  setError: (error: string | null) => void;
  clearError: () => void;

  // Set current user
  setCurrentUserId: (userId: string) => void;
}

const useChatStore = create<ExtendedChatState & Actions>()((set, get) => ({
  // Chat state
  chats: [],
  selectedChat: null,
  messages: [],
  isLoading: false,
  isSwitchingChat: false,
  error: null,
  currentUserId: null,
  isSocketConnected: false,
  typingUsers: {},

  // Legacy state for compatibility
  selectedExample: { name: "Messenger example", url: "/" },
  examples: [
    { name: "Messenger example", url: "/" },
    { name: "Chatbot example", url: "/chatbot" },
    { name: "Chatbot2 example", url: "/chatbot2" },
  ],
  input: "",
  hasInitialAIResponse: false,
  hasInitialResponse: false,

  // Example/navigation actions
  setSelectedExample: (selectedExample) => set({ selectedExample }),
  setExamples: (examples) => set({ examples }),

  // Input handling
  setInput: (input) => set({ input }),
  handleInputChange: (e) => set({ input: e.target.value }),

  // Error handling
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),

  // Set current user
  setCurrentUserId: (userId) => set({ currentUserId: userId }),

  // Socket management
  initializeSocket: async (token?: string, userId?: string) => {
    // Only initialize socket in browser environment
    if (typeof window === "undefined") {
      console.warn("Socket initialization skipped: not in browser environment");
      return;
    }

    try {
      console.log("Initializing socket connection...");
      await socketService.connect(token, userId);
      set({ isSocketConnected: true });

      // Set up real-time event handlers
      const messageCleanup = socketService.onMessage((message, chatId) => {
        const { selectedChat, messages } = get();

        // Check if this message already exists in the messages array (by id or temp-id)
        const isDuplicate = messages.some(
          (existingMsg) =>
            // Check if IDs match
            existingMsg._id === message._id ||
            // Check if this is the real version of a temp message
            (existingMsg._id.startsWith("temp-") &&
              existingMsg.sender._id === message.sender._id &&
              existingMsg.content === message.content &&
              // Compare timestamps - within 5 seconds
              Math.abs(
                new Date(existingMsg.createdAt).getTime() -
                  new Date(message.createdAt).getTime()
              ) < 5000)
        );

        // Add message to current chat if it matches and isn't a duplicate
        if (selectedChat?._id === chatId && !isDuplicate) {
          console.log("Adding new message to chat:", message._id);
          set((state) => ({
            messages: [...state.messages, message],
          }));
        }

        // Update last message in chat list
        set((state) => ({
          chats: state.chats.map((chat) =>
            chat._id === chatId ? { ...chat, lastMessage: message } : chat
          ),
        }));
      });

      const chatUpdateCleanup = socketService.onChatUpdate((data) => {
        const { chatId, lastMessage, unreadCount } = data;

        set((state) => ({
          chats: state.chats.map((chat) =>
            chat._id === chatId
              ? {
                  ...chat,
                  lastMessage,
                  unreadCount: unreadCount || chat.unreadCount,
                }
              : chat
          ),
        }));
      });

      const readCleanup = socketService.onChatRead((data) => {
        const { chatId, unreadCount } = data;

        set((state) => ({
          chats: state.chats.map((chat) =>
            chat._id === chatId
              ? { ...chat, unreadCount: unreadCount || chat.unreadCount }
              : chat
          ),
        }));
      });

      const typingCleanup = socketService.onTyping((data) => {
        const { chatId, userId, isTyping } = data;

        set((state) => {
          const currentTyping = state.typingUsers[chatId] || [];
          const updatedTyping = isTyping
            ? [...currentTyping.filter((id) => id !== userId), userId]
            : currentTyping.filter((id) => id !== userId);

          return {
            typingUsers: {
              ...state.typingUsers,
              [chatId]: updatedTyping,
            },
          };
        });
      });

      // Store cleanup functions for later use (only in browser)
      if (typeof window !== "undefined") {
        (window as any).__socketCleanup = {
          messageCleanup,
          chatUpdateCleanup,
          readCleanup,
          typingCleanup,
        };
      }

      console.log("Socket initialized successfully");
    } catch (error) {
      console.error("Failed to initialize socket:", error);
      set({ isSocketConnected: false });
    }
  },

  disconnectSocket: () => {
    // Only disconnect in browser environment
    if (typeof window === "undefined") {
      return;
    }

    console.log("Disconnecting socket...");
    socketService.disconnect();
    set({ isSocketConnected: false });

    // Clean up event handlers (only in browser)
    const cleanup = (window as any).__socketCleanup;
    if (cleanup) {
      Object.values(cleanup).forEach((cleanupFn: any) => {
        if (typeof cleanupFn === "function") cleanupFn();
      });
      delete (window as any).__socketCleanup;
    }
  },

  joinChatRoom: (chatId) => {
    socketService.joinChatRoom(chatId);
  },

  leaveChatRoom: (chatId) => {
    socketService.leaveChatRoom(chatId);
  },

  sendTyping: (chatId, isTyping) => {
    socketService.sendTyping(chatId, isTyping);
  },

  // Load all chats for the user
  loadUserChats: async (token?: string) => {
    set({ isLoading: true, error: null });
    try {
      const authToken = token || localStorage.getItem("token");
      if (!authToken) {
        throw new Error("No authentication token found. Please login.");
      }

      console.log(
        "Loading user chats with token:",
        authToken ? "token present" : "no token"
      );
      const chats = await chatService.getUserChats(authToken);
      set({ chats, isLoading: false });

      // Join all chat rooms via socket
      if (socketService.connected) {
        const chatIds = chats.map((chat) => chat._id);
        socketService.joinUserRooms(chatIds);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to load chats";
      set({ error: errorMessage, isLoading: false });
    }
  },

  // Select and load a specific chat
  selectChat: async (chatId: string, token?: string) => {
    const { isSwitchingChat, selectedChat } = get();

    // Prevent multiple simultaneous calls or selecting the same chat
    if (isSwitchingChat || selectedChat?._id === chatId) {
      console.log(
        "selectChat: Already switching or chat already selected, skipping"
      );
      return;
    }

    set({ isSwitchingChat: true, error: null });

    try {
      const authToken = token || localStorage.getItem("token");
      if (!authToken) {
        throw new Error("No authentication token found. Please login.");
      }

      console.log("selectChat: Loading chat and messages for:", chatId);

      // Leave previous chat room
      if (selectedChat) {
        socketService.leaveChatRoom(selectedChat._id);
      }

      const [chat, messages] = await Promise.all([
        chatService.getChatById(authToken, chatId),
        chatService.getChatMessages(authToken, chatId),
      ]);

      set({
        selectedChat: chat,
        messages,
        isSwitchingChat: false,
        isLoading: false,
      });

      // Join new chat room
      socketService.joinChatRoom(chatId);

      // Mark chat as read (don't wait for this)
      chatService.markChatAsRead(authToken, chatId).catch(console.error);

      // Update the chat in the chats list to reset unread count
      const { chats, currentUserId } = get();
      if (currentUserId) {
        const updatedChats = chats.map((c) =>
          c._id === chatId
            ? { ...c, unreadCount: { ...c.unreadCount, [currentUserId]: 0 } }
            : c
        );
        set({ chats: updatedChats });
      }

      console.log("selectChat: Successfully loaded chat:", chatId);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to load chat";
      console.error("selectChat: Error loading chat:", errorMessage);
      set({
        error: errorMessage,
        isSwitchingChat: false,
        isLoading: false,
      });
    }
  },

  // Create a new chat
  createNewChat: async (
    data: CreateChatRequest,
    token?: string
  ): Promise<Chat> => {
    set({ isLoading: true, error: null });
    try {
      const authToken = token || localStorage.getItem("token");
      if (!authToken) {
        throw new Error("No authentication token found. Please login.");
      }

      console.log(
        "Creating new chat with token:",
        authToken ? "token present" : "no token"
      );
      const newChat = await chatService.createChat(authToken, data);
      const { chats } = get();
      set({
        chats: [newChat, ...chats],
        selectedChat: newChat,
        messages: [],
        isLoading: false,
      });

      // Join the new chat room
      socketService.joinChatRoom(newChat._id);

      return newChat;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create chat";
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  // Send a message
  sendMessage: async (
    content: string,
    attachments?: string[],
    token?: string
  ) => {
    const { selectedChat, currentUserId } = get();
    if (!selectedChat) {
      set({ error: "No chat selected" });
      return;
    }

    const authToken = token || localStorage.getItem("token");
    if (!authToken) {
      set({ error: "No authentication token found. Please login." });
      return;
    }

    // Ensure currentUserId is set
    let effectiveCurrentUserId = currentUserId;
    if (!effectiveCurrentUserId) {
      try {
        const userData = localStorage.getItem("user");
        if (userData) {
          const user = JSON.parse(userData);
          effectiveCurrentUserId = user._id;
          set({ currentUserId: effectiveCurrentUserId });
        }
      } catch (error) {
        console.error("Error getting user ID:", error);
      }
    }

    console.log("sendMessage - Using currentUserId:", effectiveCurrentUserId);

    // Optimistically add the message to the UI
    const tempMessage: Message = {
      _id: "temp-" + Date.now(),
      chat: selectedChat._id,
      sender: {
        _id: effectiveCurrentUserId || "",
        name: "You",
        avatar: "",
      },
      content,
      attachments: attachments || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isLoading: true,
    };

    set((state) => ({
      messages: [...state.messages, tempMessage],
      input: "",
    }));

    try {
      const sentMessage = await chatService.sendMessage(
        authToken,
        selectedChat._id,
        {
          content,
          attachments,
        }
      );

      console.log("sendMessage - Received message from server:", sentMessage);

      // Replace the temporary message with the real one
      set((state) => {
        // First, check if we already have this message in the list (could have come from socket)
        const alreadyHasRealMessage = state.messages.some(
          (msg) => msg._id === sentMessage._id && !msg._id.startsWith("temp-")
        );

        if (alreadyHasRealMessage) {
          // If we already have the real message, just remove the temp message
          return {
            messages: state.messages.filter(
              (msg) => msg._id !== tempMessage._id
            ),
          };
        } else {
          // Otherwise replace the temp message with the real one
          return {
            messages: state.messages.map((msg) =>
              msg._id === tempMessage._id ? sentMessage : msg
            ),
          };
        }
      });

      // The socket will handle updating other users and chat list via real-time events
      // No need to manually update chats here as the backend will emit events
    } catch (error) {
      // Remove the failed message and show error
      set((state) => ({
        messages: state.messages.filter((msg) => msg._id !== tempMessage._id),
        error:
          error instanceof Error ? error.message : "Failed to send message",
      }));
    }
  },

  // Mark chat as read
  markChatAsRead: async (chatId: string, token?: string) => {
    try {
      const authToken = token || localStorage.getItem("token");
      if (!authToken) {
        throw new Error("No authentication token found. Please login.");
      }

      await chatService.markChatAsRead(authToken, chatId);
      // The socket will handle real-time updates via chatRead event
    } catch (error) {
      console.error("Failed to mark chat as read:", error);
    }
  },

  // Delete a chat
  deleteChat: async (chatId: string, token?: string) => {
    try {
      const authToken = token || localStorage.getItem("token");
      if (!authToken) {
        throw new Error("No authentication token found. Please login.");
      }

      // Leave the chat room before deleting
      socketService.leaveChatRoom(chatId);

      await chatService.deleteChat(authToken, chatId);

      set((state) => ({
        chats: state.chats.filter((chat) => chat._id !== chatId),
        selectedChat:
          state.selectedChat?._id === chatId ? null : state.selectedChat,
        messages: state.selectedChat?._id === chatId ? [] : state.messages,
      }));
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete chat";
      set({ error: errorMessage });
    }
  },

  // Real-time message handling
  addMessage: (message: Message) => {
    set((state) => ({
      messages: [...state.messages, message],
    }));
  },

  updateMessage: (messageId: string, updates: Partial<Message>) => {
    set((state) => ({
      messages: state.messages.map((msg) =>
        msg._id === messageId ? { ...msg, ...updates } : msg
      ),
    }));
  },

  // Legacy actions for compatibility with existing components
  setchatBotMessages: (fn) => {
    const currentMessages = get().messages;
    const updatedMessages = fn(currentMessages);
    set({ messages: updatedMessages });
  },

  setMessages: (fn) => {
    const currentMessages = get().messages;
    const updatedMessages = fn(currentMessages);
    set({ messages: updatedMessages });
  },

  setHasInitialAIResponse: (hasInitialAIResponse) =>
    set({ hasInitialAIResponse }),

  setHasInitialResponse: (hasInitialResponse) => set({ hasInitialResponse }),
}));

export default useChatStore;
