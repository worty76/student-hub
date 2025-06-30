import { create } from "zustand";
import { Chat, Message, ChatState, CreateChatRequest, SendMessageRequest } from "@/types/chat";
import { chatService } from "@/services/chat.service";

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
  sendMessage: (content: string, attachments?: string[], token?: string) => Promise<void>;
  markChatAsRead: (chatId: string, token?: string) => Promise<void>;
  deleteChat: (chatId: string, token?: string) => Promise<void>;
  
  // Real-time message handling
  addMessage: (message: Message) => void;
  updateMessage: (messageId: string, updates: Partial<Message>) => void;
  
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
  error: null,
  currentUserId: null,

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

  // Load all chats for the user
  loadUserChats: async (token?: string) => {
    set({ isLoading: true, error: null });
    try {
      const authToken = token || localStorage.getItem('token');
      if (!authToken) {
        throw new Error('No authentication token found. Please login.');
      }
      
      console.log('Loading user chats with token:', authToken ? 'token present' : 'no token');
      const chats = await chatService.getUserChats(authToken);
      set({ chats, isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load chats';
      set({ error: errorMessage, isLoading: false });
    }
  },

  // Select and load a specific chat
  selectChat: async (chatId: string, token?: string) => {
    set({ isLoading: true, error: null });
    try {
      const authToken = token || localStorage.getItem('token');
      if (!authToken) {
        throw new Error('No authentication token found. Please login.');
      }
      
      const [chat, messages] = await Promise.all([
        chatService.getChatById(authToken, chatId),
        chatService.getChatMessages(authToken, chatId)
      ]);
      
      set({ 
        selectedChat: chat, 
        messages, 
        isLoading: false 
      });
      
      // Mark chat as read
      await chatService.markChatAsRead(authToken, chatId);
      
      // Update the chat in the chats list to reset unread count
      const { chats, currentUserId } = get();
      if (currentUserId) {
        const updatedChats = chats.map(c => 
          c._id === chatId 
            ? { ...c, unreadCount: { ...c.unreadCount, [currentUserId]: 0 } }
            : c
        );
        set({ chats: updatedChats });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load chat';
      set({ error: errorMessage, isLoading: false });
    }
  },

  // Create a new chat
  createNewChat: async (data: CreateChatRequest, token?: string): Promise<Chat> => {
    set({ isLoading: true, error: null });
    try {
      const authToken = token || localStorage.getItem('token');
      if (!authToken) {
        throw new Error('No authentication token found. Please login.');
      }
      
      console.log('Creating new chat with token:', authToken ? 'token present' : 'no token');
      const newChat = await chatService.createChat(authToken, data);
      const { chats } = get();
      set({ 
        chats: [newChat, ...chats], 
        selectedChat: newChat,
        messages: [],
        isLoading: false 
      });
      return newChat;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create chat';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  // Send a message
  sendMessage: async (content: string, attachments?: string[], token?: string) => {
    const { selectedChat, currentUserId } = get();
    if (!selectedChat) {
      set({ error: 'No chat selected' });
      return;
    }

    const authToken = token || localStorage.getItem('token');
    if (!authToken) {
      set({ error: 'No authentication token found. Please login.' });
      return;
    }

    // Ensure currentUserId is set
    let effectiveCurrentUserId = currentUserId;
    if (!effectiveCurrentUserId) {
      try {
        const userData = localStorage.getItem('user');
        if (userData) {
          const user = JSON.parse(userData);
          effectiveCurrentUserId = user._id;
          set({ currentUserId: effectiveCurrentUserId });
        }
      } catch (error) {
        console.error('Error getting user ID:', error);
      }
    }

    console.log('sendMessage - Using currentUserId:', effectiveCurrentUserId);

    // Optimistically add the message to the UI
    const tempMessage: Message = {
      _id: 'temp-' + Date.now(),
      chat: selectedChat._id,
      sender: {
        _id: effectiveCurrentUserId || '',
        name: 'You',
        avatar: ''
      },
      content,
      attachments: attachments || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isLoading: true
    };

    set(state => ({
      messages: [...state.messages, tempMessage],
      input: ''
    }));

    try {
      const sentMessage = await chatService.sendMessage(authToken, selectedChat._id, {
        content,
        attachments
      });

      console.log('sendMessage - Received message from server:', sentMessage);

      // Replace the temporary message with the real one
      set(state => ({
        messages: state.messages.map(msg => 
          msg._id === tempMessage._id ? sentMessage : msg
        )
      }));

      // Update the last message in the chat list
      set(state => ({
        chats: state.chats.map(chat =>
          chat._id === selectedChat._id
            ? { ...chat, lastMessage: sentMessage }
            : chat
        )
      }));

    } catch (error) {
      // Remove the failed message and show error
      set(state => ({
        messages: state.messages.filter(msg => msg._id !== tempMessage._id),
        error: error instanceof Error ? error.message : 'Failed to send message'
      }));
    }
  },

  // Mark chat as read
  markChatAsRead: async (chatId: string, token?: string) => {
    try {
      const authToken = token || localStorage.getItem('token');
      if (!authToken) {
        throw new Error('No authentication token found. Please login.');
      }
      
      await chatService.markChatAsRead(authToken, chatId);
    } catch (error) {
      console.error('Failed to mark chat as read:', error);
    }
  },

  // Delete a chat
  deleteChat: async (chatId: string, token?: string) => {
    try {
      const authToken = token || localStorage.getItem('token');
      if (!authToken) {
        throw new Error('No authentication token found. Please login.');
      }
      
      await chatService.deleteChat(authToken, chatId);
      
      set(state => ({
        chats: state.chats.filter(chat => chat._id !== chatId),
        selectedChat: state.selectedChat?._id === chatId ? null : state.selectedChat,
        messages: state.selectedChat?._id === chatId ? [] : state.messages
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete chat';
      set({ error: errorMessage });
    }
  },

  // Real-time message handling
  addMessage: (message: Message) => {
    set(state => ({
      messages: [...state.messages, message]
    }));
  },

  updateMessage: (messageId: string, updates: Partial<Message>) => {
    set(state => ({
      messages: state.messages.map(msg => 
        msg._id === messageId ? { ...msg, ...updates } : msg
      )
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

  setHasInitialResponse: (hasInitialResponse) => 
    set({ hasInitialResponse }),
}));

export default useChatStore;
