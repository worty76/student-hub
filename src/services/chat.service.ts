/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Chat,
  Message,
  CreateChatRequest,
  SendMessageRequest,
} from "@/types/chat";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

export class ChatService {
  private static getAuthHeaders(token: string): HeadersInit {
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    console.log("Auth headers:", {
      hasToken: !!token,
      tokenPreview: token ? token.substring(0, 20) + "..." : "none",
      headers: Object.keys(headers),
    }); // Debug log

    return headers;
  }

  // Get all chats for the authenticated user
  static async getUserChats(token: string): Promise<Chat[]> {
    try {
      console.log("API_BASE_URL:", API_BASE_URL); // Debug log

      const response = await fetch(`${API_BASE_URL}/chats`, {
        method: "GET",
        headers: ChatService.getAuthHeaders(token),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Unauthorized. Please login again.");
        }
        throw new Error(`Failed to fetch chats: ${response.statusText}`);
      }

      const chats: Chat[] = await response.json();
      return chats;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("An error occurred while fetching chats");
    }
  }

  // Get a specific chat by ID
  static async getChatById(token: string, chatId: string): Promise<Chat> {
    try {
      const response = await fetch(`${API_BASE_URL}/chats/${chatId}`, {
        method: "GET",
        headers: ChatService.getAuthHeaders(token),
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Chat not found");
        }
        if (response.status === 403) {
          throw new Error("Not authorized to access this chat");
        }
        throw new Error(`Failed to fetch chat: ${response.statusText}`);
      }

      const chat: Chat = await response.json();
      return chat;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("An error occurred while fetching chat");
    }
  }

  // Create a new chat
  static async createChat(
    token: string,
    data: CreateChatRequest
  ): Promise<Chat> {
    try {
      console.log("Creating chat with data:", data); // Debug log
      console.log("API_BASE_URL for create chat:", API_BASE_URL); // Debug log

      const response = await fetch(`${API_BASE_URL}/chats`, {
        method: "POST",
        headers: ChatService.getAuthHeaders(token),
        body: JSON.stringify(data),
      });

      console.log("Create chat response status:", response.status); // Debug log
      console.log(
        "Create chat response headers:",
        Object.fromEntries(response.headers.entries())
      ); // Debug log

      if (!response.ok) {
        let errorMessage = `Failed to create chat: ${response.statusText}`;

        try {
          const errorData = await response.json();
          console.log("Error response data:", errorData); // Debug log

          if (errorData.message) {
            errorMessage = errorData.message;
          } else if (errorData.error) {
            errorMessage = errorData.error;
          } else if (errorData.errors && Array.isArray(errorData.errors)) {
            errorMessage = errorData.errors
              .map((err: any) => err.message || err.msg)
              .join(", ");
          }
        } catch (parseError) {
          console.log("Failed to parse error response:", parseError);
          // If we can't parse the error response, use the status text
        }

        if (response.status === 400) {
          throw new Error(errorMessage || "Invalid request data");
        }
        if (response.status === 404) {
          throw new Error("User not found");
        }
        if (response.status === 401) {
          throw new Error("Unauthorized. Please login again.");
        }
        if (response.status === 403) {
          throw new Error(
            "Forbidden. You do not have permission to create this chat."
          );
        }

        throw new Error(errorMessage);
      }

      const chat: Chat = await response.json();
      console.log("Successfully created chat:", chat); // Debug log
      return chat;
    } catch (error) {
      console.error("Create chat error:", error); // Debug log

      // Handle network errors specifically
      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new Error(
          "Network error: Unable to connect to the server. Please check your internet connection."
        );
      }

      if (error instanceof Error) {
        throw error;
      }
      throw new Error("An error occurred while creating chat");
    }
  }

  // Send a message in a chat
  static async sendMessage(
    token: string,
    chatId: string,
    data: SendMessageRequest
  ): Promise<Message> {
    try {
      const response = await fetch(`${API_BASE_URL}/chats/${chatId}/messages`, {
        method: "POST",
        headers: ChatService.getAuthHeaders(token),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Chat not found");
        }
        if (response.status === 403) {
          throw new Error("Not authorized to send messages in this chat");
        }
        const errorData = await response.json();
        throw new Error(
          errorData.message || `Failed to send message: ${response.statusText}`
        );
      }

      const message: Message = await response.json();
      return message;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("An error occurred while sending message");
    }
  }

  // Get all messages for a specific chat
  static async getChatMessages(
    token: string,
    chatId: string
  ): Promise<Message[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/chats/${chatId}/messages`, {
        method: "GET",
        headers: ChatService.getAuthHeaders(token),
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Chat not found");
        }
        if (response.status === 403) {
          throw new Error("Not authorized to access messages in this chat");
        }
        throw new Error(`Failed to fetch messages: ${response.statusText}`);
      }

      const messages: Message[] = await response.json();
      return messages;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("An error occurred while fetching messages");
    }
  }

  // Mark chat as read
  static async markChatAsRead(token: string, chatId: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/chats/${chatId}/read`, {
        method: "PUT",
        headers: ChatService.getAuthHeaders(token),
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Chat not found");
        }
        if (response.status === 403) {
          throw new Error("Not authorized to access this chat");
        }
        throw new Error(`Failed to mark chat as read: ${response.statusText}`);
      }
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("An error occurred while marking chat as read");
    }
  }

  // Delete a chat
  static async deleteChat(token: string, chatId: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/chats/${chatId}`, {
        method: "DELETE",
        headers: ChatService.getAuthHeaders(token),
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Chat not found");
        }
        if (response.status === 403) {
          throw new Error("Not authorized to delete this chat");
        }
        throw new Error(`Failed to delete chat: ${response.statusText}`);
      }
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("An error occurred while deleting chat");
    }
  }
}

// Updated chatService export to maintain backward compatibility but require token
export const chatService = {
  getUserChats: (token: string) => ChatService.getUserChats(token),
  getChatById: (token: string, chatId: string) =>
    ChatService.getChatById(token, chatId),
  createChat: (token: string, data: CreateChatRequest) =>
    ChatService.createChat(token, data),
  sendMessage: (token: string, chatId: string, data: SendMessageRequest) =>
    ChatService.sendMessage(token, chatId, data),
  getChatMessages: (token: string, chatId: string) =>
    ChatService.getChatMessages(token, chatId),
  markChatAsRead: (token: string, chatId: string) =>
    ChatService.markChatAsRead(token, chatId),
  deleteChat: (token: string, chatId: string) =>
    ChatService.deleteChat(token, chatId),
};
