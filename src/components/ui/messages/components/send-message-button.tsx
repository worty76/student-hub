'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { MessageCircle, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import useChatStore from '@/hooks/useChatStore';
import { CreateChatRequest } from '@/types/chat';
import { toast } from 'sonner';

interface SendMessageButtonProps {
  receiverId: string;
  receiverName: string;
  productId?: string;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  children?: React.ReactNode;
}

export function SendMessageButton({
  receiverId,
  receiverName,
  productId,
  variant = 'default',
  size = 'default',
  className,
  children
}: SendMessageButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { user: currentUser, isAuthenticated, token, initializeAuth } = useAuthStore();
  const { 
    createNewChat, 
    chats, 
    setCurrentUserId, 
    loadUserChats,
    currentUserId 
  } = useChatStore();

  // Initialize auth state on component mount
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // Debug logging for authentication state
  useEffect(() => {
    console.log('SendMessageButton auth state:', {
      isAuthenticated,
      hasUser: !!currentUser,
      hasToken: !!token,
      userId: currentUser?._id,
      tokenPreview: token ? token.substring(0, 20) + '...' : 'none'
    });
  }, [isAuthenticated, currentUser, token]);

  // Ensure user chats are loaded
  useEffect(() => {
    if (isAuthenticated && currentUser && token && !currentUserId) {
      setCurrentUserId(currentUser._id);
      if (chats.length === 0) {
        loadUserChats(token);
      }
    }
  }, [isAuthenticated, currentUser, token, currentUserId, chats.length, setCurrentUserId, loadUserChats]);

  const handleSendMessage = async () => {
    console.log('SendMessageButton clicked - Auth check:', {
      isAuthenticated,
      hasUser: !!currentUser,
      hasToken: !!token
    });

    // Try to initialize auth if it seems inconsistent
    if ((!isAuthenticated || !currentUser || !token)) {
      console.log('Auth state inconsistent, trying to initialize...');
      initializeAuth();
      
      // Wait a moment for the state to update
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const { user, isAuthenticated: newAuth, token: newToken } = useAuthStore.getState();
      
      if (!newAuth || !user || !newToken) {
        console.log('Authentication failed after initialization, redirecting to login');
        toast.error('Please log in to send messages');
        router.push('/login');
        return;
      }
    }

    const finalUser = currentUser || useAuthStore.getState().user;
    const finalToken = token || useAuthStore.getState().token;

    if (!finalUser || !finalToken) {
      console.log('Final auth check failed, redirecting to login');
      toast.error('Please log in to send messages');
      router.push('/login');
      return;
    }

    if (finalUser._id === receiverId) {
      toast.error('You cannot send a message to yourself');
      return;
    }

    console.log('Send message button clicked:', { receiverId, receiverName, productId, currentUser: finalUser._id }); // Debug log

    setIsLoading(true);

    try {
      // Set current user ID if not already set
      if (!currentUserId) {
        setCurrentUserId(finalUser._id);
      }

      // Ensure chats are loaded
      if (chats.length === 0) {
        console.log('Loading user chats...'); // Debug log
        await loadUserChats(finalToken);
      }

      // Check if a chat already exists with this user
      const existingChat = chats.find(chat => 
        chat.participants.some(participant => participant._id === receiverId)
      );

      if (existingChat) {
        console.log('Found existing chat:', existingChat._id); // Debug log
        // Chat already exists, redirect to it
        router.push(`/messages?chat=${existingChat._id}`);
        toast.success(`Opening chat with ${receiverName}`);
        return;
      }

      // Create new chat
      const createChatData: CreateChatRequest = {
        receiverId,
        ...(productId && { productId })
      };

      console.log('Creating new chat with data:', createChatData); // Debug log

      const newChat = await createNewChat(createChatData, finalToken);
      
      console.log('New chat created successfully:', newChat._id); // Debug log
      
      // Redirect to messages page with the new chat
      router.push(`/messages?chat=${newChat._id}`);
      toast.success(`Started new conversation with ${receiverName}`);

    } catch (error) {
      console.error('Failed to create chat:', error); // Debug log
      const errorMessage = error instanceof Error ? error.message : 'Failed to start conversation. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleSendMessage}
      disabled={isLoading}
      variant={variant}
      size={size}
      className={className}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      ) : (
        <MessageCircle className="w-4 h-4 mr-2" />
      )}
      {children || (isLoading ? 'Starting chat...' : 'Send Message')}
    </Button>
  );
} 