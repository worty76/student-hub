"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarImage } from "./ui/avatar";
import { 
  MessageSquare,
  SquarePen,
  MoreHorizontal,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface SidebarChat {
  id: string;
  name: string;
  avatar: string;
  variant: "secondary" | "ghost";
  lastMessage?: string;
  timestamp?: string;
  unreadCount?: number;
}

interface SidebarProps {
  isCollapsed: boolean;
  chats: SidebarChat[];
  onChatSelect?: (chatId: string) => void;
  isMobile: boolean;
  isLoading?: boolean;
}

export function Sidebar({ 
  chats, 
  isCollapsed, 
  isMobile, 
  onChatSelect,
  isLoading = false 
}: SidebarProps) {

  const handleChatClick = (chatId: string) => {
    onChatSelect?.(chatId);
  };

  if (isLoading && chats.length === 0) {
    return (
      <div className="h-full flex flex-col bg-background border-r border-border/50">
        <div className="flex-1 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center gap-3"
          >
            <div className="flex gap-1">
              <motion.div
                className="w-2 h-2 bg-muted-foreground/50 rounded-full"
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
              />
              <motion.div
                className="w-2 h-2 bg-muted-foreground/50 rounded-full"
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
              />
              <motion.div
                className="w-2 h-2 bg-muted-foreground/50 rounded-full"
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
              />
            </div>
            <span className="text-sm text-muted-foreground font-medium">Loading chats...</span>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background border-r border-border/50">
      {/* Header */}
      {!isCollapsed && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="border-b border-border/50 bg-background/95 backdrop-blur-sm"
        >
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <MessageSquare className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="font-semibold text-base text-foreground">Messages</h2>
                <p className="text-xs text-muted-foreground">
                  {chats.length} conversation{chats.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                className="inline-flex items-center justify-center w-8 h-8 rounded-md transition-colors hover:bg-accent hover:text-accent-foreground text-muted-foreground"
              >
                <SquarePen className="w-4 h-4" />
              </button>

              <button
                className="inline-flex items-center justify-center w-8 h-8 rounded-md transition-colors hover:bg-accent hover:text-accent-foreground text-muted-foreground"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Chat List */}
      <div className="flex-1 overflow-hidden">
        <div className={cn(
          "h-full overflow-y-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent",
          isCollapsed ? "px-2 py-4" : "p-2"
        )}>
          <AnimatePresence>
            {chats.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center h-32 text-center px-4"
              >
                <p className="text-sm text-muted-foreground mb-2">
                  No conversations yet
                </p>
              </motion.div>
            ) : (
              <div className="space-y-1">
                {chats.map((chat, index) =>
                  isCollapsed ? (
                    <TooltipProvider key={chat.id}>
                      <Tooltip delayDuration={0}>
                        <TooltipTrigger asChild>
                          <motion.button
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            onClick={() => handleChatClick(chat.id)}
                            className={cn(
                              "w-full h-12 p-2 rounded-lg relative transition-all duration-200 hover:bg-accent",
                              "flex items-center justify-center",
                              chat.variant === "secondary" && "bg-accent text-accent-foreground"
                            )}
                          >
                            <Avatar className="w-8 h-8">
                              <AvatarImage
                                src={chat.avatar}
                                alt={chat.name}
                                className="rounded-full"
                              />
                            </Avatar>
                            {chat.unreadCount && chat.unreadCount > 0 && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium shadow-lg"
                              >
                                {chat.unreadCount > 9 ? '9+' : chat.unreadCount}
                              </motion.div>
                            )}
                            <span className="sr-only">{chat.name}</span>
                          </motion.button>
                        </TooltipTrigger>
                        <TooltipContent
                          side="right"
                          className="max-w-xs"
                        >
                          <div>
                            <p className="font-medium">{chat.name}</p>
                            {chat.lastMessage && (
                              <p className="text-xs text-muted-foreground truncate max-w-48">
                                {chat.lastMessage}
                              </p>
                            )}
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ) : (
                    <motion.button
                      key={chat.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => handleChatClick(chat.id)}
                      className={cn(
                        "w-full p-3 rounded-lg text-left transition-all duration-200 hover:bg-accent relative group/item",
                        chat.variant === "secondary"
                          ? "bg-accent text-accent-foreground" 
                          : "hover:bg-accent/50"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative flex-shrink-0">
                          <Avatar className="w-10 h-10">
                            <AvatarImage
                              src={chat.avatar}
                              alt={chat.name}
                              className="rounded-full"
                            />
                          </Avatar>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-medium text-sm truncate text-foreground">
                              {chat.name}
                            </p>
                            {chat.timestamp && (
                              <span className="text-xs text-muted-foreground shrink-0 ml-2">
                                {chat.timestamp}
                              </span>
                            )}
                          </div>
                          
                          {chat.lastMessage && (
                            <p className="text-xs text-muted-foreground truncate leading-relaxed">
                              {chat.lastMessage}
                            </p>
                          )}
                        </div>
                        
                        {chat.unreadCount && chat.unreadCount > 0 && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium shadow-sm shrink-0"
                          >
                            {chat.unreadCount > 9 ? '9+' : chat.unreadCount}
                          </motion.div>
                        )}
                      </div>
                    </motion.button>
                  )
                )}
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
