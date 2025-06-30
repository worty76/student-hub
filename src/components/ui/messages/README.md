# Chat System Integration

This document explains how to use the integrated chat system with your backend API.

## Overview

The chat system has been updated to work with real backend APIs instead of mock data. It includes:

- **Real-time chat functionality** with your backend
- **Authentication handling** using stored tokens
- **Optimistic UI updates** for better user experience
- **Error handling** and loading states
- **Type-safe** API calls and data structures

## Quick Start

### 1. Ensure Authentication

The chat system requires user authentication. Make sure the user is logged in and their token is stored:

```javascript
// The system expects these to be in localStorage:
localStorage.setItem('token', 'your-jwt-token');
localStorage.setItem('user', JSON.stringify(userObject));
```

### 2. Basic Usage in a Page

```tsx
import { ChatLayout } from "@/components/ui/messages/chat/chat-layout";

export default function MessagesPage() {
  const layout = cookies().get("react-resizable-panels:layout");
  const defaultLayout = layout ? JSON.parse(layout.value) : undefined;

  return (
    <div className="w-full h-screen">
      <ChatLayout defaultLayout={defaultLayout} navCollapsedSize={8} />
    </div>
  );
}
```

### 3. Creating New Chats

Use the `ChatExample` component or create chats programmatically:

```tsx
import { ChatExample } from "@/components/ui/messages/chat-example";
import useChatStore from "@/hooks/useChatStore";

// Using the example component
function ProductPage({ product }) {
  return (
    <div>
      {/* Product details */}
      <ChatExample 
        productId={product.id}
        sellerId={product.sellerId}
        sellerName={product.sellerName}
      />
    </div>
  );
}

// Or programmatically
function CustomComponent() {
  const { createNewChat } = useChatStore();

  const handleStartChat = async () => {
    try {
      const chat = await createNewChat({
        receiverId: "user-id-to-chat-with",
        productId: "optional-product-id" // If chat is about a specific product
      });
      console.log('Chat created:', chat);
    } catch (error) {
      console.error('Failed to create chat:', error);
    }
  };

  return <button onClick={handleStartChat}>Start Chat</button>;
}
```

## API Reference

### Chat Service (`chatService`)

Located in `src/services/chat.service.ts`:

```typescript
import { chatService } from '@/services/chat.service';

// Get all user chats
const chats = await chatService.getUserChats();

// Get specific chat by ID
const chat = await chatService.getChatById(chatId);

// Create new chat
const newChat = await chatService.createChat({
  receiverId: "user-id",
  productId: "optional-product-id"
});

// Send message
const message = await chatService.sendMessage(chatId, {
  content: "Hello!",
  attachments: [] // Optional
});

// Get chat messages
const messages = await chatService.getChatMessages(chatId);

// Mark chat as read
await chatService.markChatAsRead(chatId);

// Delete chat
await chatService.deleteChat(chatId);
```

### Chat Store (`useChatStore`)

The Zustand store provides reactive state management:

```typescript
import useChatStore from '@/hooks/useChatStore';

function ChatComponent() {
  const {
    // State
    chats,           // Array of user's chats
    selectedChat,    // Currently selected chat
    messages,        // Messages in selected chat
    isLoading,       // Loading state
    error,           // Error message
    currentUserId,   // Current user ID

    // Actions
    loadUserChats,   // Load all chats
    selectChat,      // Select and load a chat
    createNewChat,   // Create new chat
    sendMessage,     // Send message
    markChatAsRead,  // Mark chat as read
    deleteChat,      // Delete chat
    setCurrentUserId,// Set current user
    clearError,      // Clear error state
  } = useChatStore();

  // Example usage
  useEffect(() => {
    loadUserChats();
  }, []);

  return (
    // Your component JSX
  );
}
```

## Data Types

### Chat

```typescript
interface Chat {
  _id: string;
  participants: Array<{
    _id: string;
    name: string;
    avatar: string;
  }>;
  product?: {
    _id: string;
    title: string;
    images: string[];
    price: number;
    status: string;
  };
  lastMessage?: Message;
  unreadCount: Record<string, number>; // userId -> count
  createdAt: string;
  updatedAt: string;
}
```

### Message

```typescript
interface Message {
  _id: string;
  chat: string;
  sender: {
    _id: string;
    name: string;
    avatar: string;
  };
  content: string;
  attachments: string[];
  createdAt: string;
  updatedAt: string;
  role?: 'user' | 'ai';
  isLoading?: boolean;
  isLiked?: boolean;
}
```

## Error Handling

The system includes comprehensive error handling:

```typescript
function ChatComponent() {
  const { error, clearError, loadUserChats } = useChatStore();

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button onClick={() => {
          clearError();
          loadUserChats();
        }}>
          Retry
        </button>
      </div>
    );
  }

  // Normal component rendering
}
```

## Backend Integration

### Required API Endpoints

Your backend should implement these endpoints:

```
GET    /api/chats              - Get user chats
GET    /api/chats/:id          - Get specific chat
POST   /api/chats              - Create new chat
POST   /api/chats/:id/messages - Send message
GET    /api/chats/:id/messages - Get chat messages
PUT    /api/chats/:id/read     - Mark chat as read
DELETE /api/chats/:id          - Delete chat
```

### Authentication

All requests include the Authorization header:

```
Authorization: Bearer <jwt-token>
```

The token is automatically retrieved from `localStorage.getItem('token')`.

## Environment Variables

Set your API base URL:

```env
NEXT_PUBLIC_API_URL=https://your-api-domain.com/api
```

If not set, it defaults to `https://be-student-hub-production.up.railway.app/api`.

## Real-time Updates (Optional)

For real-time chat updates, you can integrate WebSocket support:

```typescript
// In a useEffect or custom hook
useEffect(() => {
  const socket = io('your-websocket-server');
  
  socket.on('new-message', (message) => {
    useChatStore.getState().addMessage(message);
  });

  socket.on('message-updated', ({ messageId, updates }) => {
    useChatStore.getState().updateMessage(messageId, updates);
  });

  return () => socket.disconnect();
}, []);
```

## Migration from Mock Data

The system maintains backward compatibility with existing UI components by using type adapters. The old mock data interface is preserved while using real API data under the hood.

## Troubleshooting

### Common Issues

1. **Chat not loading**: Check authentication and network connectivity
2. **Messages not sending**: Verify chat is selected and user has permissions
3. **Real-time updates not working**: Implement WebSocket integration
4. **Type errors**: Ensure all imports use the correct type definitions

### Debug Mode

Enable debug logging by checking the browser console for error messages. All API calls include detailed error information.

## Example Implementation

See `client/src/components/ui/messages/chat-example.tsx` for a complete example of how to integrate the chat system into your application. 