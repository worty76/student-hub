import { Message as OldMessage } from "@/components/ui/messages/data";
import { Message as NewMessage } from "@/types/chat";

export function convertNewMessageToOld(newMessage: NewMessage): OldMessage {
  return {
    id: parseInt(newMessage._id.replace(/[^0-9]/g, '')) || Math.floor(Math.random() * 10000),
    avatar: newMessage.sender.avatar,
    name: newMessage.sender.name,
    message: newMessage.content,
    timestamp: new Date(newMessage.createdAt).toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }),
    role: newMessage.role as "user" | "ai" | undefined,
    isLoading: newMessage.isLoading,
    isLiked: newMessage.isLiked,
  };
}

export function convertOldMessageToNew(oldMessage: OldMessage, chatId: string): NewMessage {
  return {
    _id: oldMessage.id.toString(),
    chat: chatId,
    sender: {
      _id: oldMessage.id.toString(),
      name: oldMessage.name,
      avatar: oldMessage.avatar,
    },
    content: oldMessage.message || '',
    attachments: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    role: oldMessage.role as "user" | "ai" | undefined,
    isLoading: oldMessage.isLoading,
    isLiked: oldMessage.isLiked,
  };
}

export function convertNewMessagesToOld(newMessages: NewMessage[]): OldMessage[] {
  return newMessages.map(msg => convertNewMessageToOld(msg));
} 