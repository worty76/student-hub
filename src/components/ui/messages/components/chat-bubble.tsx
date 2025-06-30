import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Button, type ButtonProps } from "../ui/button";
import { cn } from "@/lib/utils";
import { Check, CheckCheck } from "lucide-react";
import { motion } from "framer-motion";

// ChatBubble
const chatBubbleVariant = cva(
  "flex gap-2 max-w-[80%] relative group transition-all duration-200",
  {
    variants: {
      variant: {
        received: "self-start",
        sent: "self-end flex-row-reverse",
      },
      layout: {
        default: "",
        ai: "max-w-full w-full mx-0",
      },
    },
    defaultVariants: {
      variant: "received",
      layout: "default",
    },
  }
);

interface ChatBubbleProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof chatBubbleVariant> {}

const ChatBubble = React.forwardRef<HTMLDivElement, ChatBubbleProps>(
  ({ className, variant, layout, children, ...props }, ref) => (
    <div
      className={cn(
        chatBubbleVariant({ variant, layout, className }),
        "animate-in fade-in-0 slide-in-from-bottom-2 duration-300"
      )}
      ref={ref}
      {...props}
    >
      {children}
    </div>
  )
);
ChatBubble.displayName = "ChatBubble";

// Message Loading Component
const MessageLoading = () => (
  <div className="flex items-center space-x-1">
    <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
    <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
    <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce"></div>
  </div>
);

// ChatBubbleAvatar
interface ChatBubbleAvatarProps {
  src?: string;
  fallback?: string;
  className?: string;
}

const ChatBubbleAvatar: React.FC<ChatBubbleAvatarProps> = ({
  src,
  fallback,
  className,
}) => (
  <Avatar className={cn("w-8 h-8 ring-2 ring-background", className)}>
    <AvatarImage src={src} alt="Avatar" />
    <AvatarFallback className="text-xs font-medium">
      {fallback || "U"}
    </AvatarFallback>
  </Avatar>
);

// ChatBubbleMessage
const chatBubbleMessageVariants = cva(
  "px-4 py-3 rounded-2xl shadow-sm relative transition-all duration-200 hover:shadow-md",
  {
    variants: {
      variant: {
        received:
          "bg-card text-card-foreground border border-border/50 rounded-bl-md",
        sent: "bg-primary text-primary-foreground rounded-br-md shadow-lg",
      },
      layout: {
        default: "",
        ai: "border-t w-full rounded-none bg-transparent shadow-none",
      },
    },
    defaultVariants: {
      variant: "received",
      layout: "default",
    },
  }
);

interface ChatBubbleMessageProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof chatBubbleMessageVariants> {
  isLoading?: boolean;
}

const ChatBubbleMessage = React.forwardRef<
  HTMLDivElement,
  ChatBubbleMessageProps
>(
  (
    { className, variant, layout, isLoading = false, children, ...props },
    ref
  ) => (
    <div
      className={cn(
        chatBubbleMessageVariants({ variant, layout, className }),
        "break-words max-w-full whitespace-pre-wrap leading-relaxed"
      )}
      ref={ref}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center space-x-2">
          <MessageLoading />
        </div>
      ) : (
        <div className="relative">
          {children}
        </div>
      )}
    </div>
  )
);
ChatBubbleMessage.displayName = "ChatBubbleMessage";

// Message Status Component
interface MessageStatusProps {
  status: "sending" | "sent" | "delivered" | "read";
  className?: string;
}

const MessageStatus: React.FC<MessageStatusProps> = ({ status, className }) => {
  const getStatusIcon = () => {
    switch (status) {
      case "sending":
        return <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-pulse" />;
      case "sent":
        return <Check className="w-3 h-3 text-muted-foreground/70" />;
      case "delivered":
        return <CheckCheck className="w-3 h-3 text-muted-foreground/70" />;
      case "read":
        return <CheckCheck className="w-3 h-3 text-blue-500" />;
      default:
        return null;
    }
  };

  return (
    <div className={cn("flex items-center", className)}>
      {getStatusIcon()}
    </div>
  );
};

// ChatBubbleTimestamp
interface ChatBubbleTimestampProps
  extends React.HTMLAttributes<HTMLDivElement> {
  timestamp: string;
  variant?: "sent" | "received";
  status?: "sending" | "sent" | "delivered" | "read";
}

const ChatBubbleTimestamp: React.FC<ChatBubbleTimestampProps> = ({
  timestamp,
  variant,
  status,
  className,
  ...props
}) => (
  <div 
    className={cn(
      "flex items-center gap-1 text-xs text-muted-foreground/70 mt-1",
      variant === "sent" ? "justify-end" : "justify-start",
      className
    )} 
    {...props}
  >
    <span>{timestamp}</span>
    {variant === "sent" && status && (
      <MessageStatus status={status} />
    )}
  </div>
);

export {
  ChatBubble,
  ChatBubbleAvatar,
  ChatBubbleMessage,
  ChatBubbleTimestamp,
};
