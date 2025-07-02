"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/messages/ui/resizable";
import { cn } from "@/lib/utils";
import { Sidebar } from "../sidebar";
import { Chat } from "./chat";
import useChatStore from "@/hooks/useChatStore";
import { formatDate } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Users } from "lucide-react";

interface ChatLayoutProps {
  defaultLayout: number[] | undefined;
  defaultCollapsed?: boolean;
  navCollapsedSize: number;
}

export function ChatLayout({
  defaultLayout = [320, 480],
  defaultCollapsed = false,
  navCollapsedSize,
}: ChatLayoutProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);
  const [isMobile, setIsMobile] = useState(false);
  const searchParams = useSearchParams();
  const chatIdFromUrl = searchParams.get("chat");

  const {
    chats,
    selectedChat,
    messages,
    isLoading,
    isSwitchingChat,
    error,
    currentUserId,
    loadUserChats,
    selectChat,
    setCurrentUserId,
    clearError,
    initializeSocket,
    disconnectSocket,
  } = useChatStore();

  useEffect(() => {
    const checkScreenWidth = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkScreenWidth();

    window.addEventListener("resize", checkScreenWidth);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("resize", checkScreenWidth);
    };
  }, []);

  // Load user data and chats on mount
  useEffect(() => {
    const initializeChat = async () => {
      // Only initialize in browser environment
      if (typeof window === "undefined") {
        return;
      }

      try {
        // Get current user from localStorage or auth context
        const token = localStorage.getItem("token");
        const userData = localStorage.getItem("user");

        if (token && userData) {
          const user = JSON.parse(userData);
          setCurrentUserId(user._id);

          // Initialize socket connection first
          await initializeSocket(token, user._id);

          // Then load chats
          await loadUserChats();
        }
      } catch (error) {
        console.error("Failed to initialize chat:", error);
      }
    };

    initializeChat();

    // Cleanup on unmount (only in browser)
    return () => {
      if (typeof window !== "undefined") {
        disconnectSocket();
      }
    };
  }, [loadUserChats, setCurrentUserId, initializeSocket, disconnectSocket]);

  // Handle auto-selecting chat from URL parameter (optimized to prevent double calls)
  useEffect(() => {
    if (chatIdFromUrl && chats.length > 0 && !isSwitchingChat) {
      // Only select if it's different from current selection and not already switching
      if (!selectedChat || selectedChat._id !== chatIdFromUrl) {
        const chatExists = chats.find((chat) => chat._id === chatIdFromUrl);
        if (chatExists) {
          console.log("URL effect: Selecting chat from URL:", chatIdFromUrl);
          selectChat(chatIdFromUrl);
        }
      }
    }
  }, [chatIdFromUrl, chats, selectedChat, selectChat, isSwitchingChat]);

  // Handle chat selection with optimized URL sync
  const handleChatSelect = async (chatId: string) => {
    // Prevent multiple calls
    if (isSwitchingChat || selectedChat?._id === chatId) {
      return;
    }

    try {
      // Update URL immediately to prevent race conditions
      const url = new URL(window.location.href);
      url.searchParams.set("chat", chatId);
      window.history.replaceState({}, "", url.toString());

      // Then select the chat
      await selectChat(chatId);
    } catch (error) {
      console.error("Failed to select chat:", error);
    }
  };

  // Convert chats to sidebar format
  const sidebarChats = chats.map((chat) => {
    // Find the other participant (not the current user)
    const otherParticipant = chat.participants.find(
      (p) => p._id !== currentUserId
    );
    const unreadCount = currentUserId
      ? chat.unreadCount[currentUserId] || 0
      : 0;

    return {
      id: chat._id,
      name: otherParticipant?.name || "Unknown User",
      avatar: otherParticipant?.avatar || "",
      lastMessage: chat.lastMessage?.content || "",
      timestamp: chat.lastMessage?.createdAt
        ? formatDate.relative(chat.lastMessage.createdAt)
        : "",
      unreadCount,
      variant: (selectedChat?._id === chat._id ? "secondary" : "ghost") as
        | "secondary"
        | "ghost",
    };
  });

  // Empty state for when no chat is selected
  const EmptyState = () => (
    <div className="h-full flex flex-col">
      {/* Header area to match chat topbar height */}
      <div className="h-16 border-b border-border/50 flex items-center justify-center">
        <div className="text-sm text-muted-foreground font-medium">
          Chọn một cuộc trò chuyện
        </div>
      </div>

      {/* Main empty state content */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", bounce: 0.4 }}
            className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <MessageCircle className="w-10 h-10 text-primary/70" />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-muted-foreground mb-6 leading-relaxed"
          >
            Chọn một cuộc trò chuyện từ thanh bên để bắt đầu trò chuyện, hoặc tạo
            một cuộc trò chuyện mới để kết nối với ai đó.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex items-center justify-center gap-4 text-sm text-muted-foreground/70"
          >
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>{chats.length} cuộc trò chuyện</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );

  // Error state component
  const ErrorState = () => (
    <div className="h-full flex flex-col">
      {/* Header area to match chat topbar height */}
      <div className="h-16 border-b border-border/50 flex items-center justify-center">
        <div className="text-sm text-destructive font-medium">Lỗi</div>
      </div>

      {/* Main error content */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <h3 className="text-lg font-semibold text-destructive mb-2">
            Có lỗi xảy ra
          </h3>
          <p className="text-muted-foreground mb-6">
            {error || "Không thể tải tin nhắn. Vui lòng thử lại."}
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              clearError();
              loadUserChats();
            }}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-lg font-medium"
          >
            Thử lại
          </motion.button>
        </motion.div>
      </div>
    </div>
  );

  // Handle error display
  if (error && !isLoading) {
    return (
      <div className="relative h-full w-full bg-background overflow-hidden">
        <ErrorState />
      </div>
    );
  }

  return (
    <div className="relative h-full w-full bg-background overflow-hidden">
      <ResizablePanelGroup
        direction="horizontal"
        onLayout={(sizes: number[]) => {
          document.cookie = `react-resizable-panels:layout=${JSON.stringify(
            sizes
          )}`;
        }}
        className="h-full w-full items-stretch"
      >
        <ResizablePanel
          defaultSize={defaultLayout[0]}
          collapsedSize={navCollapsedSize}
          collapsible={true}
          minSize={isMobile ? 0 : 24}
          maxSize={isMobile ? 8 : 35}
          onCollapse={() => {
            setIsCollapsed(true);
            document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
              true
            )}`;
          }}
          onExpand={() => {
            setIsCollapsed(false);
            document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
              false
            )}`;
          }}
          className={cn(
            "transition-all duration-300 ease-in-out h-full",
            isCollapsed && "min-w-[50px] md:min-w-[70px]"
          )}
        >
          <Sidebar
            isCollapsed={isCollapsed || isMobile}
            chats={sidebarChats}
            isMobile={isMobile}
            onChatSelect={handleChatSelect}
            isLoading={isLoading}
          />
        </ResizablePanel>

        <ResizableHandle
          withHandle
          className="w-1 bg-border/50 hover:bg-border transition-colors data-[panel-group-direction=vertical]:h-1 data-[panel-group-direction=vertical]:w-full"
        />

        <ResizablePanel
          defaultSize={defaultLayout[1]}
          minSize={30}
          className="flex flex-col h-full"
        >
          <AnimatePresence mode="wait">
            {selectedChat ? (
              <motion.div
                key={selectedChat._id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="h-full w-full flex flex-col"
              >
                <Chat
                  messages={messages}
                  selectedUser={{
                    id:
                      parseInt(
                        selectedChat.participants.find(
                          (p) => p._id !== currentUserId
                        )?._id || "0"
                      ) || 0,
                    name:
                      selectedChat.participants.find(
                        (p) => p._id !== currentUserId
                      )?.name || "Unknown User",
                    avatar:
                      selectedChat.participants.find(
                        (p) => p._id !== currentUserId
                      )?.avatar || "",
                    messages: [],
                  }}
                  isMobile={isMobile}
                />
              </motion.div>
            ) : (
              <EmptyState />
            )}
          </AnimatePresence>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
