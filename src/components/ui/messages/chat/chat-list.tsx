import { Message, UserData } from "@/components/ui/messages/data";
import { Message as APIMessage } from "@/types/chat";
import { cn } from "@/lib/utils";
import React, { useRef, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChatBubbleAvatar,
  ChatBubbleMessage,
  ChatBubbleTimestamp,
  ChatBubble,
} from "../components/chat-bubble";
import { ChatMessageList } from "../components/chat-message-list";
import useChatStore from "@/hooks/useChatStore";

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
    return "Just now";
  }
  
  // Less than 1 hour
  if (diff < 3600000) {
    const minutes = Math.floor(diff / 60000);
    return `${minutes}m ago`;
  }
  
  // Less than 24 hours
  if (diff < 86400000) {
    const hours = Math.floor(diff / 3600000);
    return `${hours}h ago`;
  }
  
  // More than 24 hours
  return date.toLocaleDateString();
};

// Group messages by sender and time
const groupMessages = (messages: APIMessage[]) => {
  const groups: APIMessage[][] = [];
  let currentGroup: APIMessage[] = [];
  
  messages.forEach((message, index) => {
    const prevMessage = messages[index - 1];
    const shouldGroup = 
      prevMessage &&
      prevMessage.sender._id === message.sender._id &&
      prevMessage.createdAt &&
      message.createdAt &&
      new Date(message.createdAt).getTime() - new Date(prevMessage.createdAt).getTime() < 300000; // 5 minutes
    
    if (shouldGroup) {
      currentGroup.push(message);
    } else {
      if (currentGroup.length > 0) {
        groups.push(currentGroup);
      }
      currentGroup = [message];
    }
  });
  
  if (currentGroup.length > 0) {
    groups.push(currentGroup);
  }
  
  return groups;
};

export function ChatList({
  messages,
  selectedUser,
  sendMessage,
  isMobile,
}: ChatListProps) {
  const { isLoading, currentUserId, setCurrentUserId } = useChatStore();

  // Immediately detect and set currentUserId in store if not available
  useEffect(() => {
    if (!currentUserId && messages.length > 0) {
      console.log('Attempting to detect currentUserId...');
      
      // Try localStorage first
      try {
        const userData = localStorage.getItem('user');
        if (userData) {
          const user = JSON.parse(userData);
          if (user._id) {
            console.log('Setting currentUserId from localStorage:', user._id);
            setCurrentUserId(user._id);
            return;
          }
        }
      } catch (error) {
        console.error('Error parsing user data from localStorage:', error);
      }
      
      // Fallback: If all messages are from the same sender, assume current user
      const allSenderIds = new Set(messages.map(m => m.sender._id));
      if (allSenderIds.size === 1) {
        const singleSenderId = Array.from(allSenderIds)[0];
        console.log('All messages from single sender, setting as currentUserId:', singleSenderId);
        setCurrentUserId(singleSenderId);
      }
    }
  }, [currentUserId, messages, setCurrentUserId]);

  // Get effective currentUserId (prefer store, fallback to detection)
  const getEffectiveCurrentUserId = () => {
    if (currentUserId) {
      return currentUserId;
    }
    
    // Only for immediate rendering before useEffect runs
    try {
      const userData = localStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        return user._id;
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
    }
    
    return null;
  };

  const effectiveCurrentUserId = getEffectiveCurrentUserId();

  // Simplified message variant detection
  const getMessageVariant = (senderId: string, currentUserId: string) => {
    const isMatch = senderId === currentUserId;
    console.log('getMessageVariant:', { 
      senderId, 
      currentUserId, 
      match: isMatch,
      result: isMatch ? "sent" : "received"
    });
    
    return isMatch ? "sent" : "received";
  };

  // Debug logging
  useEffect(() => {
    console.log('=== ChatList Debug Info ===');
    console.log('ChatList - Current User ID from store:', currentUserId);
    console.log('ChatList - Effective Current User ID:', effectiveCurrentUserId);
    
    // Debug localStorage
    const userData = localStorage.getItem('user');
    console.log('ChatList - Raw user data from localStorage:', userData);
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        console.log('ChatList - Parsed user from localStorage:', parsedUser);
        console.log('ChatList - User ID from localStorage:', parsedUser._id);
      } catch (e) {
        console.log('ChatList - Error parsing user data:', e);
      }
    }
    
    console.log('ChatList - Messages with sender info:', messages.map((m, index) => ({ 
      index,
      messageId: m._id, 
      senderId: m.sender._id, 
      senderName: m.sender.name, 
      content: m.content.substring(0, 30) + '...',
      senderIdType: typeof m.sender._id,
      senderIdLength: m.sender._id?.length
    })));
    
    // Check if all messages are from the same sender
    if (messages.length > 0) {
      const senderIds = messages.map(m => m.sender._id);
      const uniqueSenders = new Set(senderIds);
      console.log('Unique senders in chat:', Array.from(uniqueSenders));
      console.log('All messages from same sender?', uniqueSenders.size === 1);
    }
    
    console.log('=== End ChatList Debug Info ===');
  }, [currentUserId, effectiveCurrentUserId, messages]);

  const messageGroups = groupMessages(messages);
  const hasMessages = messages.length > 0;

  return (
    <div className="w-full overflow-y-hidden h-full flex flex-col">
      <ChatMessageList 
        isLoading={isLoading}
        isEmpty={!hasMessages && !isLoading}
        emptyStateMessage="Start your conversation"
        emptyStateAction={
          <p className="text-xs text-muted-foreground">
            Send a message to {selectedUser.name} to get started
          </p>
        }
      >
        <AnimatePresence>
          {messageGroups.map((group, groupIndex) => (
            <motion.div
              key={`group-${groupIndex}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: groupIndex * 0.1 }}
              className="flex flex-col"
            >
              {group.map((message, messageIndex) => {
                const globalIndex = messages.indexOf(message);
                const variant = getMessageVariant(message.sender._id, effectiveCurrentUserId || '');
                const isFirstInGroup = messageIndex === 0;
                const isLastInGroup = messageIndex === group.length - 1;
                
                return (
                  <motion.div
                    key={`message-${globalIndex}`}
                    layout
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -20 }}
                    transition={{
                      duration: 0.3,
                      ease: "easeOut",
                      layout: { duration: 0.2 }
                    }}
                    className={cn(
                      "flex flex-col relative",
                      !isLastInGroup && "mb-1",
                      isLastInGroup && "mb-4"
                    )}
                  >
                    <ChatBubble variant={variant}>
                      {/* Show avatar only for first message in group and received messages */}
                      {isFirstInGroup && variant === "received" ? (
                        <ChatBubbleAvatar 
                          src={message.sender.avatar || ''} 
                          fallback={message.sender.name.charAt(0).toUpperCase()}
                        />
                      ) : (
                        variant === "received" && <div className="w-8" />
                      )}
                      
                      <div className="flex flex-col max-w-full">
                        <ChatBubbleMessage 
                          variant={variant}
                          isLoading={message.isLoading}
                        >
                          {message.content}
                        </ChatBubbleMessage>
                        
                        {/* Show timestamp only for last message in group */}
                        {isLastInGroup && message.createdAt && (
                          <ChatBubbleTimestamp 
                            timestamp={formatTimestamp(message.createdAt)}
                            variant={variant}
                            status={variant === "sent" ? "delivered" : undefined}
                          />
                        )}
                      </div>
                    </ChatBubble>
                  </motion.div>
                );
              })}
            </motion.div>
          ))}
        </AnimatePresence>
      </ChatMessageList>
    </div>
  );
}
