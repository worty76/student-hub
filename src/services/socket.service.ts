/* eslint-disable @typescript-eslint/no-explicit-any */
import { io, Socket } from "socket.io-client";
import { Message } from "@/types/chat";

class SocketService {
  private socket: Socket | null = null;
  private token: string | null = null;
  private isConnected = false;
  private currentUserId: string | null = null;

  // Event handlers
  private messageHandlers: ((message: Message, chatId: string) => void)[] = [];
  private chatUpdateHandlers: ((data: any) => void)[] = [];
  private typingHandlers: ((data: any) => void)[] = [];
  private statusHandlers: ((data: any) => void)[] = [];
  private readHandlers: ((data: any) => void)[] = [];

  constructor() {
    this.initializeFromStorage();
  }

  private initializeFromStorage() {
    // Only access localStorage in browser environment
    if (typeof window === "undefined") {
      return;
    }

    try {
      this.token = localStorage.getItem("token");
      const userData = localStorage.getItem("user");
      if (userData) {
        const user = JSON.parse(userData);
        this.currentUserId = user._id || user.id;
      }
    } catch (error) {
      console.error("Error initializing socket service from storage:", error);
    }
  }

  connect(token?: string, userId?: string): Promise<void> {
    return new Promise((resolve, reject) => {
      // Only connect in browser environment
      if (typeof window === "undefined") {
        reject(new Error("Socket connection only available in browser"));
        return;
      }

      if (this.socket && this.isConnected) {
        resolve();
        return;
      }

      // Update credentials if provided
      if (token) this.token = token;
      if (userId) this.currentUserId = userId;

      if (!this.token) {
        reject(new Error("No authentication token available"));
        return;
      }

      // Get the socket URL - try dedicated socket URL first, then derive from API URL
      const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 
                       (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api').replace('/api', '');
      
      console.log('Connecting socket to:', socketUrl);

      // Create socket connection with correct URL
      this.socket = io(socketUrl, {
        auth: {
          token: this.token,
        },
        transports: ['websocket', 'polling'],
      });

      // Connection event handlers
      this.socket.on("connect", () => {
        console.log("Socket connected:", this.socket?.id);
        this.isConnected = true;
        resolve();
      });

      this.socket.on("connect_error", (error) => {
        console.error("Socket connection error:", error);
        this.isConnected = false;
        reject(error);
      });

      this.socket.on("disconnect", (reason) => {
        console.log("Socket disconnected:", reason);
        this.isConnected = false;
      });

      // Real-time event listeners
      this.socket.on("newMessage", (data) => {
        console.log("Received new message:", data);
        this.messageHandlers.forEach((handler) => {
          handler(data.message, data.chatId);
        });
      });

      this.socket.on("chatUpdated", (data) => {
        console.log("Chat updated:", data);
        this.chatUpdateHandlers.forEach((handler) => {
          handler(data);
        });
      });

      this.socket.on("chatRead", (data) => {
        console.log("Chat read:", data);
        this.readHandlers.forEach((handler) => {
          handler(data);
        });
      });

      this.socket.on("userTyping", (data) => {
        this.typingHandlers.forEach((handler) => {
          handler(data);
        });
      });

      this.socket.on("userStatusChanged", (data) => {
        this.statusHandlers.forEach((handler) => {
          handler(data);
        });
      });

      this.socket.on("error", (error) => {
        console.error("Socket error:", error);
      });
    });
  }

  disconnect() {
    if (this.socket) {
      console.log("Disconnecting socket");
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  // Join user rooms with all their chats
  joinUserRooms(chatIds: string[]) {
    if (
      typeof window === "undefined" ||
      !this.socket ||
      !this.isConnected ||
      !this.currentUserId
    ) {
      console.warn(
        "Cannot join rooms: socket not connected or user ID missing"
      );
      return;
    }

    this.socket.emit("joinUserRooms", {
      userId: this.currentUserId,
      chatIds,
    });
  }

  // Join a specific chat room
  joinChatRoom(chatId: string) {
    if (typeof window === "undefined" || !this.socket || !this.isConnected) {
      console.warn("Cannot join chat room: socket not connected");
      return;
    }

    this.socket.emit("joinRoom", chatId);
  }

  // Leave a specific chat room
  leaveChatRoom(chatId: string) {
    if (typeof window === "undefined" || !this.socket || !this.isConnected) {
      console.warn("Cannot leave chat room: socket not connected");
      return;
    }

    this.socket.emit("leaveRoom", chatId);
  }

  // Send typing indicator
  sendTyping(chatId: string, isTyping: boolean) {
    if (
      typeof window === "undefined" ||
      !this.socket ||
      !this.isConnected ||
      !this.currentUserId
    ) {
      return;
    }

    this.socket.emit("typing", {
      chatId,
      userId: this.currentUserId,
      isTyping,
    });
  }

  // Update user status
  updateStatus(status: "online" | "offline" | "away") {
    if (
      typeof window === "undefined" ||
      !this.socket ||
      !this.isConnected ||
      !this.currentUserId
    ) {
      return;
    }

    this.socket.emit("updateStatus", {
      userId: this.currentUserId,
      status,
    });
  }

  // Event handler registration methods
  onMessage(handler: (message: Message, chatId: string) => void) {
    this.messageHandlers.push(handler);

    // Return cleanup function
    return () => {
      this.messageHandlers = this.messageHandlers.filter((h) => h !== handler);
    };
  }

  onChatUpdate(handler: (data: any) => void) {
    this.chatUpdateHandlers.push(handler);

    return () => {
      this.chatUpdateHandlers = this.chatUpdateHandlers.filter(
        (h) => h !== handler
      );
    };
  }

  onChatRead(handler: (data: any) => void) {
    this.readHandlers.push(handler);

    return () => {
      this.readHandlers = this.readHandlers.filter((h) => h !== handler);
    };
  }

  onTyping(handler: (data: any) => void) {
    this.typingHandlers.push(handler);

    return () => {
      this.typingHandlers = this.typingHandlers.filter((h) => h !== handler);
    };
  }

  onStatusChange(handler: (data: any) => void) {
    this.statusHandlers.push(handler);

    return () => {
      this.statusHandlers = this.statusHandlers.filter((h) => h !== handler);
    };
  }

  // Getter methods
  get connected(): boolean {
    return this.isConnected;
  }

  get socketId(): string | undefined {
    return this.socket?.id;
  }
}

// Export singleton instance
export const socketService = new SocketService();
export default socketService;
