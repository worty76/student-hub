import React from 'react';
import { SendMessageButton } from './send-message-button';
import { Button } from '@/components/ui/button';
import { chatService } from '@/services/chat.service';
import { toast } from 'sonner';

/**
 * Example component showing different ways to use the SendMessageButton
 * This can be used as a reference for developers
 */
export function SendMessageExample() {
  const testChatCreation = async () => {
    try {
      console.log('Testing chat creation API...');
      
      // Test auth
      const token = localStorage.getItem('token');
      console.log('Auth token exists:', !!token);
      
      if (!token) {
        toast.error('No auth token found. Please log in.');
        return;
      }
      
      // Test API connectivity first
      const testResponse = await fetch(process.env.NEXT_PUBLIC_API_URL || 'https://be-student-hub-production.up.railway.app/api');
      console.log('API base connectivity test:', testResponse.status);
      
      // Test with a sample user ID (replace with a real one for testing)
      const testData = {
        receiverId: 'test-user-id-replace-me'
      };
      
      const result = await chatService.createChat(token, testData);
      console.log('Test chat creation result:', result);
      toast.success('Test chat creation successful!');
      
    } catch (error) {
      console.error('Test chat creation failed:', error);
      toast.error(`Test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="space-y-4 p-4">
      <h2 className="text-xl font-semibold">SendMessageButton Examples</h2>
      
      {/* Debug section */}
      <div className="border border-yellow-300 bg-yellow-50 p-4 rounded-lg">
        <h3 className="text-lg font-medium mb-2 text-yellow-800">Debug Section</h3>
        <p className="text-sm text-yellow-700 mb-2">
          Use this to test the chat creation API directly. Check the browser console for detailed logs.
        </p>
        <Button onClick={testChatCreation} variant="outline" size="sm">
          🧪 Test Chat Creation API
        </Button>
      </div>
      
      {/* Basic usage */}
      <div>
        <h3 className="text-lg font-medium mb-2">Basic Usage</h3>
        <SendMessageButton
          receiverId="user123"
          receiverName="John Doe"
        />
      </div>

      {/* With product context */}
      <div>
        <h3 className="text-lg font-medium mb-2">With Product Context</h3>
        <SendMessageButton
          receiverId="seller456"
          receiverName="Jane Smith"
          productId="product789"
          variant="outline"
        />
      </div>

      {/* Different styles */}
      <div>
        <h3 className="text-lg font-medium mb-2">Different Styles</h3>
        <div className="flex gap-2 flex-wrap">
          <SendMessageButton
            receiverId="user1"
            receiverName="User 1"
            variant="default"
            size="sm"
          />
          <SendMessageButton
            receiverId="user2"
            receiverName="User 2"
            variant="outline"
            size="sm"
          />
          <SendMessageButton
            receiverId="user3"
            receiverName="User 3"
            variant="secondary"
            size="sm"
          />
        </div>
      </div>

      {/* Custom content */}
      <div>
        <h3 className="text-lg font-medium mb-2">Custom Button Content</h3>
        <SendMessageButton
          receiverId="user123"
          receiverName="John Doe"
          variant="outline"
          className="w-full"
        >
          💬 Start Conversation
        </SendMessageButton>
      </div>

      {/* In a card layout (like seller profile) */}
      <div>
        <h3 className="text-lg font-medium mb-2">In Card Layout</h3>
        <div className="border rounded-lg p-4 space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
            <div>
              <p className="font-medium">Product Seller</p>
              <p className="text-sm text-gray-600">Online now</p>
            </div>
          </div>
          <SendMessageButton
            receiverId="seller789"
            receiverName="Product Seller"
            productId="product123"
            variant="outline"
            size="sm"
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}

// Usage in different contexts:

// 1. In a user profile page:
// <SendMessageButton receiverId={user.id} receiverName={user.name} />

// 2. In a product page with seller info:
// <SendMessageButton 
//   receiverId={product.seller.id} 
//   receiverName={product.seller.name}
//   productId={product.id}
// />

// 3. In a user listing or directory:
// <SendMessageButton 
//   receiverId={user.id} 
//   receiverName={user.name}
//   variant="outline"
//   size="sm"
// />

// 4. Custom styling for specific use cases:
// <SendMessageButton 
//   receiverId={user.id} 
//   receiverName={user.name}
//   className="bg-blue-600 hover:bg-blue-700 text-white"
// >
//   Contact {user.name}
// </SendMessageButton> 