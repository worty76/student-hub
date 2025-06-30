import { Message as APIMessage } from "@/types/chat";

export const isSameSenderMargin = (
  messages: APIMessage[],
  message: APIMessage,
  index: number,
  userId: string
): number | "auto" => {
  // For sent messages (current user), use auto to align right
  if (message.sender._id === userId) {
    return "auto";
  }
  
  // For received messages, always use 0 margin for consistent left alignment
  // The ChatBubble component will handle the avatar spacing internally
  return 0;
};

export const isSameSender = (
  messages: APIMessage[],
  message: APIMessage,
  index: number,
  userId: string
): boolean => {
  return (
    index < messages.length - 1 &&
    (messages[index + 1].sender._id !== message.sender._id ||
      messages[index + 1].sender._id === undefined) &&
    messages[index].sender._id !== userId
  );
};

export const isLastMessage = (
  messages: APIMessage[],
  index: number,
  userId: string
): boolean => {
  return (
    index === messages.length - 1 &&
    messages[messages.length - 1].sender._id !== userId &&
    !!messages[messages.length - 1].sender._id
  );
};

export const isSameUser = (
  messages: APIMessage[],
  message: APIMessage,
  index: number
): boolean => {
  return index > 0 && messages[index - 1].sender._id === message.sender._id;
};

export const shouldShowAvatar = (
  messages: APIMessage[],
  message: APIMessage,
  index: number,
  userId: string
): boolean => {
  return (
    isSameSender(messages, message, index, userId) ||
    isLastMessage(messages, index, userId)
  );
};

export const getMessageAlignment = (
  senderId: string,
  userId: string
): "sent" | "received" => {
  return senderId === userId ? "sent" : "received";
};

export const getMarginTop = (
  messages: APIMessage[],
  message: APIMessage,
  index: number
): number => {
  return isSameUser(messages, message, index) ? 1 : 3;
}; 