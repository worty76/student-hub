import * as React from "react";
import { ArrowDown, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAutoScroll } from "./useAutoScroll";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface ChatMessageListProps extends React.HTMLAttributes<HTMLDivElement> {
  smooth?: boolean;
  isLoading?: boolean;
  isEmpty?: boolean;
  emptyStateMessage?: string;
  emptyStateAction?: React.ReactNode;
}

const ChatMessageList = React.forwardRef<HTMLDivElement, ChatMessageListProps>(
  (
    {
      className,
      children,
      smooth = true,
      isLoading = false,
      isEmpty = false,
      emptyStateMessage = "No messages yet",
      emptyStateAction,
      ...props
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _ref
  ) => {
    const { scrollRef, isAtBottom, scrollToBottom, disableAutoScroll } =
      useAutoScroll({
        smooth,
        content: children,
      });

    // Empty state component
    const EmptyState = () => (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center h-full text-center p-8"
      >
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
          <MessageCircle className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium text-muted-foreground mb-2">
          {emptyStateMessage}
        </h3>
        <p className="text-sm text-muted-foreground/70 mb-4 max-w-sm">
          Start a conversation by sending a message below.
        </p>
        {emptyStateAction}
      </motion.div>
    );

    // Loading state component
    const LoadingState = () => (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center h-full p-8"
      >
        <div className="flex gap-2 mb-4">
          <motion.div
            className="w-2 h-2 bg-muted-foreground/50 rounded-full"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
          />
          <motion.div
            className="w-2 h-2 bg-muted-foreground/50 rounded-full"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
          />
          <motion.div
            className="w-2 h-2 bg-muted-foreground/50 rounded-full"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
          />
        </div>
        <p className="text-sm text-muted-foreground">Loading messages...</p>
      </motion.div>
    );

    if (isLoading) {
      return (
        <div className="relative w-full h-full">
          <LoadingState />
        </div>
      );
    }

    if (isEmpty) {
      return (
        <div className="relative w-full h-full">
          <EmptyState />
        </div>
      );
    }

    return (
      <div className="relative w-full h-full">
        <div
          className={cn(
            "flex flex-col w-full h-full p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent",
            className
          )}
          ref={scrollRef}
          onWheel={disableAutoScroll}
          onTouchMove={disableAutoScroll}
          {...props}
        >
          <AnimatePresence>
            <motion.div
              className="flex flex-col gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {!isAtBottom && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.8 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute bottom-4 left-1/2 transform -translate-x-1/2"
            >
              <Button
                onClick={scrollToBottom}
                size="sm"
                variant="secondary"
                className="inline-flex items-center gap-2 rounded-full shadow-lg border bg-background/95 backdrop-blur-sm hover:bg-background"
                aria-label="Scroll to bottom"
              >
                <ArrowDown className="h-3 w-3" />
                <span className="text-xs">New messages</span>
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scroll indicator gradient */}
        <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-background to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-background to-transparent pointer-events-none" />
      </div>
    );
  }
);

ChatMessageList.displayName = "ChatMessageList";

export { ChatMessageList };
