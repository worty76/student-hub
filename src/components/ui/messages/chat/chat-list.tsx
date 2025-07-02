import { Message, UserData } from "@/components/ui/messages/data";
import { Message as APIMessage } from "@/types/chat";
import { cn } from "@/lib/utils";
import React, { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChatBubbleAvatar,
  ChatBubbleMessage,
  ChatBubbleTimestamp,
} from "../components/chat-bubble";
import { ChatMessageList } from "../components/chat-message-list";
import useChatStore from "@/hooks/useChatStore";
import {
  shouldShowAvatar,
  getMessageAlignment,
  getMarginTop,
  isSameUser,
} from "@/utils/chatLogics";

interface ChatListProps {
  messages: APIMessage[];
  selectedUser: UserData;
  sendMessage: (newMessage: Message) => void;
  isMobile: boolean;
}

// Format timestamp to be more human readable
const formatTimestamp = (timestamp: string): string => {
  if (!timestamp) return "";

  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  // Less than 1 minute
  if (diff < 60000) {
    return "Vừa xong";
  }

  // Less than 1 hour
  if (diff < 3600000) {
    const minutes = Math.floor(diff / 60000);
    return `${minutes} phút trước`;
  }

  // Less than 24 hours
  if (diff < 86400000) {
    const hours = Math.floor(diff / 3600000);
    return `${hours} giờ trước`;
  }

  // Same day (today)
  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  }

  // Yesterday
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) {
    return `Hôm qua ${date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    })}`;
  }

  // This week (within 7 days)
  if (diff < 7 * 24 * 60 * 60 * 1000) {
    const dayNames = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];
    return `${dayNames[date.getDay()]} ${date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    })}`;
  }

  // More than a week ago
  return date.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

export function ChatList({ messages, selectedUser }: ChatListProps) {
  const {
    isLoading,
    currentUserId,
    setCurrentUserId,
    isSwitchingChat,
    selectedChat,
    typingUsers,
  } = useChatStore();

  useEffect(() => {
    if (!currentUserId) {
      try {
        const userData = localStorage.getItem("user");
        if (userData) {
          const user = JSON.parse(userData);
          const userId = user._id || user.id;
          if (userId) {
            setCurrentUserId(userId);
            return;
          }
        }
      } catch (error) {
        console.error("Error getting user ID from localStorage:", error);
      }
    }
  }, [currentUserId, setCurrentUserId]); // Only depend on currentUserId, not messages

  // Get effective currentUserId
  const getEffectiveCurrentUserId = () => {
    if (currentUserId) {
      return currentUserId;
    }

    // Immediate fallback for rendering
    try {
      const userData = localStorage.getItem("user");
      if (userData) {
        const user = JSON.parse(userData);
        return user._id || user.id;
      }
    } catch (error) {
      console.error("Error in fallback user ID detection:", error);
    }

    return null;
  };

  const effectiveCurrentUserId = getEffectiveCurrentUserId();
  const hasMessages = messages.length > 0;

  // Get typing users for current chat (excluding current user)
  const currentChatTypingUsers =
    selectedChat?.participants.filter((participant) => {
      const chatTypingUsers = typingUsers[selectedChat._id] || [];
      return (
        chatTypingUsers.includes(participant._id) &&
        participant._id !== effectiveCurrentUserId
      );
    }) || [];

  // Typing indicator component
  const TypingIndicator = () => {
    if (currentChatTypingUsers.length === 0) return null;

    const getTypingText = () => {
      if (currentChatTypingUsers.length === 1) {
        return `${currentChatTypingUsers[0].name} đang nhập...`;
      } else if (currentChatTypingUsers.length === 2) {
        return `${currentChatTypingUsers[0].name} và ${currentChatTypingUsers[1].name} đang nhập...`;
      } else {
        return `${currentChatTypingUsers[0].name} và ${
          currentChatTypingUsers.length - 1
        } người khác đang nhập...`;
      }
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="flex items-center justify-start px-4 py-2"
      >
        <div className="flex items-end max-w-[80%]">
          {/* Avatar for typing user */}
          <div className="flex-shrink-0 w-8 h-8 mr-2">
            <ChatBubbleAvatar
              src={currentChatTypingUsers[0]?.avatar || ""}
              fallback={
                currentChatTypingUsers[0]?.name?.charAt(0).toUpperCase() || "U"
              }
            />
          </div>

          {/* Typing bubble */}
          <div className="bg-muted rounded-2xl px-4 py-2 max-w-fit">
            <div className="flex items-center gap-1">
              <span className="text-sm text-muted-foreground">
                {getTypingText()}
              </span>
              <div className="flex gap-1 ml-2">
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 bg-muted-foreground/50 rounded-full"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="w-full overflow-y-hidden h-full flex flex-col">
      <ChatMessageList
        isLoading={isLoading || isSwitchingChat}
        isEmpty={!hasMessages && !isLoading && !isSwitchingChat}
        emptyStateMessage="Bắt đầu trò chuyện"
        emptyStateAction={
          <p className="text-xs text-muted-foreground">
            Gửi tin nhắn đến {selectedUser.name} để bắt đầu trò chuyện
          </p>
        }
      >
        {!isSwitchingChat && (
          <AnimatePresence>
            {messages.map((message, index) => {
              const variant = getMessageAlignment(
                message.sender._id,
                effectiveCurrentUserId || ""
              );
              const showAvatar = shouldShowAvatar(
                messages,
                message,
                index,
                effectiveCurrentUserId || ""
              );
              const marginTop = getMarginTop(messages, message, index);
              const isSameUserMsg = isSameUser(messages, message, index);

              return (
                <motion.div
                  key={`message-${index}`}
                  layout
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -20 }}
                  transition={{
                    duration: 0.3,
                    ease: "easeOut",
                    layout: { duration: 0.2 },
                  }}
                  className={cn(
                    "flex w-full mb-1",
                    variant === "sent" ? "justify-end" : "justify-start"
                  )}
                  style={{
                    marginTop: `${marginTop * 4}px`,
                  }}
                >
                  <div
                    className={cn(
                      "flex items-end max-w-[80%]",
                      variant === "sent" ? "flex-row-reverse" : "flex-row"
                    )}
                  >
                    {/* Avatar section for received messages */}
                    {variant === "received" && (
                      <div className="flex-shrink-0 w-8 h-8 mr-2">
                        {showAvatar ? (
                          <ChatBubbleAvatar
                            src={message.sender.avatar || ""}
                            fallback={message.sender.name
                              .charAt(0)
                              .toUpperCase()}
                          />
                        ) : (
                          <div className="w-8 h-8" />
                        )}
                      </div>
                    )}

                    {/* Message content */}
                    <div className="flex flex-col">
                      <ChatBubbleMessage
                        variant={variant}
                        isLoading={message.isLoading}
                      >
                        {message.content}
                      </ChatBubbleMessage>

                      {/* Show timestamp for non-grouped messages or last message */}
                      {(!isSameUserMsg || index === messages.length - 1) &&
                        message.createdAt && (
                          <ChatBubbleTimestamp
                            timestamp={formatTimestamp(message.createdAt)}
                            variant={variant}
                            status={
                              variant === "sent" ? "delivered" : undefined
                            }
                          />
                        )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
            <TypingIndicator />
          </AnimatePresence>
        )}
      </ChatMessageList>
    </div>
  );
}
