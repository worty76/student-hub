'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { UserInfoService } from '@/services/user-info.service';
import { useAuthStore } from '@/store/authStore';

// Temporary debug component - remove in production
export default function UserApiDebug() {
  const [testUserId, setTestUserId] = useState('');
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuthStore();

  const addResult = (result: string) => {
    setTestResults(prev => [`${new Date().toLocaleTimeString()}: ${result}`, ...prev]);
  };

  const inspectAuthStore = () => {
    addResult(`🔍 Full auth store user object: ${JSON.stringify(user)}`);
    
    if (user) {
      const possibleIds = [
        user._id && `_id: ${user._id}`
      ].filter(Boolean);
      
      addResult(`🆔 Possible user ID fields: ${possibleIds.join(', ') || 'None found'}`);
    }
  };

  const testCurrentUser = async () => {
    if (!user) {
      addResult('❌ No user logged in');
      return;
    }

    const userId = user._id;
    setIsLoading(true);
    addResult(`🔍 Testing current user ID: ${userId}`);
    
    try {
      const userInfo = await UserInfoService.getUserInfo(userId);
      addResult(`✅ User info fetched: ${JSON.stringify(userInfo)}`);
    } catch (error) {
      addResult(`❌ Failed to fetch current user: ${error}`);
    }
    
    setIsLoading(false);
  };

  const testCustomUserId = async () => {
    if (!testUserId.trim()) {
      addResult('❌ Please enter a user ID to test');
      return;
    }

    setIsLoading(true);
    addResult(`🔍 Testing user ID: ${testUserId}`);
    
    try {
      const userInfo = await UserInfoService.getUserInfo(testUserId.trim());
      addResult(`✅ User info fetched: ${JSON.stringify(userInfo)}`);
    } catch (error) {
      addResult(`❌ Failed to fetch user: ${error}`);
    }
    
    setIsLoading(false);
  };

  const testCommentsApi = async () => {
    setIsLoading(true);
    addResult(`📡 Testing comments API for current product...`);
    
    try {
      // Get product ID from URL
      const productId = window.location.pathname.split('/').pop();
      addResult(`🆔 Product ID: ${productId}`);
      
      const response = await fetch(`https://be-student-hub.onrender.com/api/comments/product/${productId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      addResult(`📡 Comments API status: ${response.status} ${response.statusText}`);
      
      if (response.ok) {
        const comments = await response.json();
        addResult(`📋 Number of comments: ${comments.length}`);
        
        if (comments.length > 0) {
          const userIds = [...new Set(comments.map((c: unknown) => (c as { user: string }).user))];
          addResult(`👥 User IDs in comments: ${JSON.stringify(userIds)}`);
          
          const currentUserId = user?._id;
          addResult(`👤 Your user ID: ${currentUserId}`);
          addResult(`🔍 Your comments: ${comments.filter((c: unknown) => (c as { user: string }).user === currentUserId).length}`);
        }
      } else {
        const errorText = await response.text();
        addResult(`❌ Comments API error: ${errorText}`);
      }
    } catch (error) {
      addResult(`💥 Comments API error: ${error}`);
    }
    
    setIsLoading(false);
  };

  const testUserEndpoint = async () => {
    const testId = user?._id || 'test-user-id';
    setIsLoading(true);
    addResult(`📡 Testing user endpoint directly: /users/${testId}`);
    
    try {
      const response = await fetch(`https://be-student-hub.onrender.com/api/users/${testId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      addResult(`📡 Response status: ${response.status} ${response.statusText}`);
      
      if (response.ok) {
        const data = await response.json();
        addResult(`✅ Response data: ${JSON.stringify(data)}`);
      } else {
        const errorText = await response.text();
        addResult(`❌ Error response: ${errorText}`);
      }
    } catch (error) {
      addResult(`💥 Network error: ${error}`);
    }
    
    setIsLoading(false);
  };

  const clearResults = () => {
    setTestResults([]);
  };

  const clearCache = () => {
    UserInfoService.clearCache();
    addResult('🗑️ User info cache cleared');
  };

  return (
    <Card className="mb-6 border-orange-200 bg-orange-50/50">
      <CardHeader>
        <CardTitle className="text-lg flex items-center justify-between">
          <span>🔍 User API Debug Panel</span>
          <Badge variant="outline" className="text-xs">Debug Only</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {user && (
          <div className="text-sm bg-blue-50 p-2 rounded">
            <strong>Current User:</strong> {user.name} (ID: {user._id})
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          <Button 
            onClick={inspectAuthStore} 
            disabled={!user}
            variant="outline" 
            size="sm"
          >
            Inspect Auth Store
          </Button>
          <Button 
            onClick={testCommentsApi} 
            disabled={isLoading}
            variant="outline" 
            size="sm"
          >
            Test Comments API
          </Button>
          <Button 
            onClick={testCurrentUser} 
            disabled={isLoading || !user}
            variant="outline" 
            size="sm"
          >
            Test Current User
          </Button>
          <Button 
            onClick={testUserEndpoint} 
            disabled={isLoading}
            variant="outline" 
            size="sm"
          >
            Test User Endpoint
          </Button>
          <Button 
            onClick={clearCache} 
            variant="ghost" 
            size="sm"
          >
            Clear Cache
          </Button>
          <Button 
            onClick={clearResults} 
            variant="ghost" 
            size="sm"
          >
            Clear Results
          </Button>
        </div>

        <div className="flex gap-2">
          <Input
            value={testUserId}
            onChange={(e) => setTestUserId(e.target.value)}
            placeholder="Enter user ID to test..."
            className="flex-1"
          />
          <Button 
            onClick={testCustomUserId}
            disabled={isLoading}
            size="sm"
          >
            Test ID
          </Button>
        </div>

        <div className="bg-gray-900 text-green-400 p-3 rounded-lg font-mono text-xs max-h-60 overflow-y-auto">
          {testResults.length === 0 ? (
            <div className="text-gray-500">Run tests to see results...</div>
          ) : (
            testResults.map((result, index) => (
              <div key={index} className="mb-1">
                {result}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
} 