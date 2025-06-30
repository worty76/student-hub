import React from "react";
import { Avatar, AvatarImage } from "../ui/avatar";
import { UserData } from "@/components/ui/messages/data";
import { motion } from "framer-motion";
import { ExpandableChatHeader } from "../components/expandable-chat";

interface ChatTopbarProps {
  selectedUser: UserData;
}

export default function ChatTopbar({ selectedUser }: ChatTopbarProps) {
  return (
    <ExpandableChatHeader>
      <motion.div 
        className="flex items-center gap-3 flex-1 min-w-0"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Avatar className="w-10 h-10 ring-2 ring-background shadow-sm">
          <AvatarImage
            src={selectedUser.avatar}
            alt={selectedUser.name}
            className="rounded-full"
          />
        </Avatar>
        
        <div className="flex flex-col min-w-0 flex-1">
          <h3 className="font-semibold text-sm truncate">
            {selectedUser.name}
          </h3>
        </div>
      </motion.div>
    </ExpandableChatHeader>
  );
}
