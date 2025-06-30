import { Message, UserData } from "@/components/ui/messages/data";
import { Message as APIMessage } from "@/types/chat";
import ChatTopbar from "./chat-topbar";
import { ChatList } from "./chat-list";
import React from "react";
import useChatStore from "@/hooks/useChatStore";
import ChatBottombar from "./chat-bottombar";

interface ChatProps {
  messages?: APIMessage[];
  selectedUser: UserData;
  isMobile: boolean;
}

export function Chat({ messages, selectedUser, isMobile }: ChatProps) {
  const { sendMessage: sendMessageAPI, selectedChat } = useChatStore();

  const sendMessage = async (newMessage: Message) => {
    if (selectedChat && newMessage.message) {
      try {
        await sendMessageAPI(newMessage.message);
      } catch (error) {
        console.error('Failed to send message:', error);
      }
    }
  };

  return (
    <div className="h-full w-full flex flex-col bg-background relative">
      {/* Chat Top Bar */}
      <div className="flex-shrink-0">
        <ChatTopbar selectedUser={selectedUser} />
      </div>

      {/* Chat Messages Area */}
      <div className="flex-1 overflow-hidden">
        <ChatList
          messages={messages || []}
          selectedUser={selectedUser}
          sendMessage={sendMessage}
          isMobile={isMobile}
        />
      </div>

      {/* Chat Input Area */}
      <div className="flex-shrink-0">
        <ChatBottombar isMobile={isMobile} />
      </div>
    </div>
  );
}
