import React from "react";
import { cn } from "@/lib/utils";

interface ChatInputProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
}

export const ChatInput = React.forwardRef<HTMLTextAreaElement, ChatInputProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none overflow-hidden",
          className
        )}
        {...props}
        style={{
          minHeight: "44px",
          maxHeight: "120px",
          ...props.style,
        }}
        onInput={(e) => {
          const target = e.target as HTMLTextAreaElement;
          target.style.height = "44px";
          target.style.height = Math.min(target.scrollHeight, 120) + "px";
          if (props.onInput) {
            props.onInput(e);
          }
        }}
      />
    );
  }
);

ChatInput.displayName = "ChatInput";
