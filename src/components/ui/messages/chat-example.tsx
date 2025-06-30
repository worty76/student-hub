"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import useChatStore from '@/hooks/useChatStore';
import { CreateChatRequest } from '@/types/chat';

interface ChatExampleProps {
  // Example: when viewing a product, you might want to start a chat with the seller
  productId?: string;
  sellerId?: string;
  sellerName?: string;
}

export function ChatExample({ productId, sellerId, sellerName }: ChatExampleProps) {
  const [isCreating, setIsCreating] = useState(false);
  const { createNewChat } = useChatStore();

  const handleStartChat = async () => {
    if (!sellerId) {
      alert('Seller ID is required to start a chat');
      return;
    }

    setIsCreating(true);
    try {
      const chatData: CreateChatRequest = {
        receiverId: sellerId,
        productId: productId // Optional: if this chat is about a specific product
      };

      const newChat = await createNewChat(chatData);
      console.log('Chat created successfully:', newChat);
      
      // You can redirect to the messages page or show a success message
      // For example: router.push('/messages');
      
    } catch (error) {
      console.error('Failed to create chat:', error);
      alert('Failed to start chat. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-card">
      <h3 className="text-lg font-semibold mb-2">Chat with {sellerName || 'Seller'}</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Have questions about this item? Start a conversation!
      </p>
      
      <Button 
        onClick={handleStartChat} 
        disabled={isCreating || !sellerId}
        className="w-full"
      >
        {isCreating ? 'Starting Chat...' : 'Message Seller'}
      </Button>
      
      {!sellerId && (
        <p className="text-xs text-red-500 mt-2">
          Seller information not available
        </p>
      )}
    </div>
  );
}

// Example of how to use this component in a product page:
/*
<ChatExample 
  productId="12345"
  sellerId="user-456"
  sellerName="John Doe"
/>
*/ 