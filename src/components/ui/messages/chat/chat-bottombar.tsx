import {
  FileImage,
  Paperclip,
  SendHorizontal,
  ThumbsUp,
  Smile,
  X,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { EmojiPicker } from "../emoji-picker";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { ChatInput } from "../components/chat-input";
import useChatStore from "@/hooks/useChatStore";

interface ChatBottombarProps {
  isMobile: boolean;
}

export const BottombarIcons = [{ icon: FileImage }, { icon: Paperclip }];

export default function ChatBottombar({ isMobile }: ChatBottombarProps) {
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  console.log(isMobile);
  // Use the real API methods from the store
  const {
    sendMessage: sendMessageAPI,
    selectedChat,
    isLoading,
    error,
    sendTyping,
  } = useChatStore();

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(event.target.value);

    // Typing indicator logic
    const hasContent = event.target.value.length > 0;

    if (hasContent && !isTyping) {
      setIsTyping(true);
      if (selectedChat) {
        sendTyping(selectedChat._id, true);
      }
    }

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to stop typing indicator after 1.5 seconds of inactivity
    if (hasContent) {
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
        if (selectedChat) {
          sendTyping(selectedChat._id, false);
        }
      }, 1500);
    } else if (isTyping) {
      // If input is empty, stop typing immediately
      setIsTyping(false);
      if (selectedChat) {
        sendTyping(selectedChat._id, false);
      }
    }
  };

  const handleThumbsUp = async () => {
    if (selectedChat) {
      try {
        await sendMessageAPI("👍");
        setMessage("");
        // Stop typing indicator when sending
        if (isTyping) {
          setIsTyping(false);
          sendTyping(selectedChat._id, false);
        }
      } catch (error) {
        console.error("Failed to send thumbs up:", error);
      }
    }
  };

  const handleSend = async () => {
    if (message.trim() && selectedChat) {
      try {
        await sendMessageAPI(message.trim());
        setMessage("");

        // Stop typing indicator when sending
        if (isTyping) {
          setIsTyping(false);
          sendTyping(selectedChat._id, false);
        }

        // Clear any pending typing timeout
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
          typingTimeoutRef.current = null;
        }

        if (inputRef.current) {
          inputRef.current.focus();
        }
      } catch (error) {
        console.error("Failed to send message:", error);
      }
    }
  };

  // Clean up typing timeout on unmount or chat change
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      if (isTyping && selectedChat) {
        sendTyping(selectedChat._id, false);
      }
    };
  }, [selectedChat, isTyping, sendTyping]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }

    // Reset typing state when chat changes
    if (isTyping) {
      setIsTyping(false);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = null;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChat]);

  const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }

    if (event.key === "Enter" && event.shiftKey) {
      event.preventDefault();
      setMessage((prev) => prev + "\n");
    }
  };

  // Don't render if no chat is selected
  if (!selectedChat) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="border-t border-blue-200/50 bg-gradient-to-r from-blue-50/95 to-indigo-50/95 backdrop-blur-md shadow-lg"
    >
      {/* Error state */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="px-4 py-3 bg-gradient-to-r from-red-50 to-orange-50 border-b border-red-200/50 shadow-sm"
          >
            <div className="flex items-center gap-3 text-sm">
              <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center shadow-sm">
                <X className="w-4 h-4 text-white" />
              </div>
              <span className="text-red-700 font-medium">Không thể gửi tin nhắn. Vui lòng thử lại.</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="px-6 py-4 flex justify-between w-full items-center gap-4">
        {/* Left side actions */}
        {/* <div className="flex items-center">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 shrink-0 text-muted-foreground hover:text-foreground transition-colors"
              >
                <PlusCircle size={20} />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              side="top"
              className="w-auto p-2 bg-background/95 backdrop-blur-sm border border-border/50 shadow-lg"
            >
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 shrink-0 text-muted-foreground hover:text-foreground"
                  disabled={isLoading}
                >
                  <Mic size={18} />
                </Button>
                {BottombarIcons.map((icon, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 shrink-0 text-muted-foreground hover:text-foreground"
                    disabled={isLoading}
                  >
                    <icon.icon size={18} />
                  </Button>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          {!message.trim() && !isMobile && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex gap-1"
            >
              {BottombarIcons.map((icon, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 shrink-0 text-muted-foreground hover:text-foreground transition-colors"
                  disabled={isLoading}
                >
                  <icon.icon size={18} />
                </Button>
              ))}
            </motion.div>
          )}
        </div> */}

        {/* Message input area */}
        <div className="flex-1 relative">
          <motion.div layout className="relative">
            <ChatInput
              value={message}
              ref={inputRef}
              onKeyDown={handleKeyPress}
              onChange={handleInputChange}
              placeholder={
                selectedChat
                  ? "Nhập tin nhắn..."
                  : "Chọn một cuộc trò chuyện để bắt đầu trò chuyện"
              }
              className="min-h-[48px] max-h-32 pr-24 rounded-2xl border border-blue-200/50 bg-white/80 hover:bg-white/90 focus:bg-white focus:border-blue-400/60 focus:ring-2 focus:ring-blue-200/50 transition-all duration-200 resize-none shadow-sm placeholder:text-gray-500"
              disabled={isLoading || !selectedChat}
            />

            {/* Emoji picker - improved positioning */}
            <div className="absolute right-12 top-1/2 -translate-y-1/2">
              <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-xl text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
                    disabled={isLoading}
                  >
                    <Smile size={18} />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  side="top"
                  className="w-auto p-0 border-blue-200/50 shadow-xl rounded-2xl bg-white/95 backdrop-blur-sm"
                >
                  <EmojiPicker
                    onChange={(emoji) => {
                      setMessage(message + emoji);
                      setShowEmojiPicker(false);
                      if (inputRef.current) {
                        inputRef.current.focus();
                      }
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Character count for long messages */}
            {message.length > 100 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute right-3 top-2 px-2 py-1 bg-blue-100/80 rounded-lg text-xs text-blue-700 font-medium shadow-sm"
              >
                {message.length}/1000
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Send button */}
        <div className="flex items-center">
          <AnimatePresence mode="wait">
            {message.trim() ? (
              <motion.div
                key="send"
                initial={{ opacity: 0, scale: 0.8, rotate: -45 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.8, rotate: 45 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <Button
                  onClick={handleSend}
                  disabled={isLoading || !selectedChat}
                  size="icon"
                  className="h-11 w-11 shrink-0 rounded-full shadow-lg bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 hover:scale-105 hover:shadow-xl"
                >
                  {isLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                    />
                  ) : (
                    <SendHorizontal size={18} />
                  )}
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="thumbsup"
                initial={{ opacity: 0, scale: 0.8, rotate: 45 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.8, rotate: -45 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <Button
                  onClick={handleThumbsUp}
                  disabled={isLoading || !selectedChat}
                  variant="ghost"
                  size="icon"
                  className="h-11 w-11 shrink-0 rounded-full text-gray-500 hover:text-blue-600 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 transition-all duration-200 hover:scale-105 shadow-sm hover:shadow-md"
                >
                  <ThumbsUp size={18} />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Typing indicator placeholder */}
      <AnimatePresence>
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="px-6 pb-3"
          >
            <div className="flex items-center gap-2 text-xs">
              <div className="flex space-x-1">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                  className="w-1.5 h-1.5 bg-blue-500 rounded-full"
                />
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: 0.1 }}
                  className="w-1.5 h-1.5 bg-blue-500 rounded-full"
                />
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                  className="w-1.5 h-1.5 bg-blue-500 rounded-full"
                />
              </div>
              <span className="text-blue-600 font-medium">Đang nhập...</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
