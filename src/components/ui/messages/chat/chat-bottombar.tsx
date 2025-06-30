import {
  FileImage,
  Mic,
  Paperclip,
  PlusCircle,
  SendHorizontal,
  ThumbsUp,
  Smile,
  X,
} from "lucide-react";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { Button, buttonVariants } from "../ui/button";
import { cn } from "@/lib/utils";
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
  
  // Use the real API methods from the store
  const { 
    sendMessage: sendMessageAPI, 
    selectedChat, 
    isLoading,
    error 
  } = useChatStore();

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(event.target.value);
    
    // Typing indicator logic
    if (!isTyping && event.target.value.length > 0) {
      setIsTyping(true);
    } else if (isTyping && event.target.value.length === 0) {
      setIsTyping(false);
    }
  };

  const handleThumbsUp = async () => {
    if (selectedChat) {
      try {
        await sendMessageAPI("👍");
        setMessage("");
      } catch (error) {
        console.error('Failed to send thumbs up:', error);
      }
    }
  };

  const handleSend = async () => {
    if (message.trim() && selectedChat) {
      try {
        await sendMessageAPI(message.trim());
        setMessage("");
        setIsTyping(false);

        if (inputRef.current) {
          inputRef.current.focus();
        }
      } catch (error) {
        console.error('Failed to send message:', error);
      }
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
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
      className="border-t border-border/50 bg-background/95 backdrop-blur-sm"
    >
      {/* Error state */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="px-4 py-2 bg-destructive/10 border-b border-destructive/20"
          >
            <div className="flex items-center gap-2 text-sm text-destructive">
              <X className="w-4 h-4" />
              <span>Failed to send message. Please try again.</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="px-4 py-3 flex justify-between w-full items-center gap-3">
        {/* Left side actions */}
        <div className="flex items-center">
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
        </div>

        {/* Message input area */}
        <div className="flex-1 relative">
          <motion.div
            layout
            className="relative"
          >
            <ChatInput
              value={message}
              ref={inputRef}
              onKeyDown={handleKeyPress}
              onChange={handleInputChange}
              placeholder={selectedChat ? "Type a message..." : "Select a chat to start messaging"}
              className="min-h-[44px] max-h-32 pr-24 rounded-2xl border-border/50 bg-muted/30 focus:bg-background transition-colors resize-none"
              disabled={isLoading || !selectedChat}
            />
            
            {/* Emoji picker - improved positioning */}
            <div className="absolute right-12 top-1/2 -translate-y-1/2">
              <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground transition-colors"
                    disabled={isLoading}
                  >
                    <Smile size={18} />
                  </Button>
                </PopoverTrigger>
                <PopoverContent 
                  side="top" 
                  className="w-auto p-0 border-border/50 shadow-xl"
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
                className="absolute right-2 top-1 text-xs text-muted-foreground/70"
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
                  className="h-10 w-10 shrink-0 rounded-full shadow-lg bg-primary hover:bg-primary/90 transition-all duration-200 hover:scale-105"
                >
                  {isLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
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
                  className="h-10 w-10 shrink-0 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200 hover:scale-105"
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
            className="px-4 pb-2"
          >
            <div className="text-xs text-muted-foreground/70">
              You are typing...
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
