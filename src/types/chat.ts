export interface Message {
  _id: string;
  chat: string;
  sender: {
    _id: string;
    name: string;
    avatar: string;
  };
  content: string;
  attachments: string[];
  createdAt: string;
  updatedAt: string;
  role?: 'user' | 'ai';
  isLoading?: boolean;
  isLiked?: boolean;
}

export interface Chat {
  _id: string;
  participants: Array<{
    _id: string;
    name: string;
    avatar: string;
  }>;
  product?: {
    _id: string;
    title: string;
    images: string[];
    price: number;
    status: string;
  };
  lastMessage?: Message;
  unreadCount: Record<string, number>;
  createdAt: string;
  updatedAt: string;
}

export interface CreateChatRequest {
  receiverId: string;
  productId?: string;
}

export interface SendMessageRequest {
  content: string;
  attachments?: string[];
}

export interface ChatListResponse {
  chats: Chat[];
}

export interface ChatMessagesResponse {
  messages: Message[];
}

// Frontend-specific interfaces for UI components
export interface ChatSidebarItem {
  id: string;
  name: string;
  avatar: string;
  lastMessage?: string;
  timestamp?: string;
  unreadCount: number;
  isOnline?: boolean;
  variant: "secondary" | "ghost";
}

export interface ChatState {
  chats: Chat[];
  selectedChat: Chat | null;
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}

export interface ApiError {
  message: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
} 