import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ratingService } from '@/services/rating.service';
import { userService } from '@/services/user.service';

interface TestResult {
  test: string;
  success: boolean;
  data: unknown;
  timestamp: string;
}

export function RatingDebug() {
  const [userId, setUserId] = useState('');
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addResult = (test: string, success: boolean, data: unknown) => {
    setTestResults(prev => [...prev, {
      test,
      success,
      data,
      timestamp: new Date().toISOString()
    }]);
  };

  const testAPIs = async () => {
    if (!userId.trim()) {
      alert('Please enter a user ID');
      return;
    }

    setIsLoading(true);
    setTestResults([]);

    try {
      // Test 1: Fetch user info
      console.log('Testing user info API...');
      try {
        const user = await userService.getUserById(userId);
        addResult('User Info API', true, user);
      } catch (error) {
        addResult('User Info API', false, error);
      }

      // Test 2: Fetch ratings
      console.log('Testing ratings API...');
      try {
        const ratings = await ratingService.getUserRatings(userId);
        addResult('Ratings API', true, ratings);
        
        // Test 3: Test fetching user info for each rating author
        if (ratings && ratings.length > 0) {
          for (const rating of ratings.slice(0, 3)) { // Test first 3 ratings only
            try {
              const author = await userService.getUserById(rating.user);
              addResult(`Author Info (${rating.user})`, true, author);
            } catch (error) {
              addResult(`Author Info (${rating.user})`, false, error);
            }
          }
        }
      } catch (error) {
        addResult('Ratings API', false, error);
      }

    } catch (error) {
      console.error('Test error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Rating API Debug Tool</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex space-x-2">
          <Input
            placeholder="Enter User ID to test"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="flex-1"
          />
          <Button onClick={testAPIs} disabled={isLoading}>
            {isLoading ? 'Testing...' : 'Test APIs'}
          </Button>
          <Button onClick={clearResults} variant="outline">
            Clear
          </Button>
        </div>

        {testResults.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-semibold">Test Results:</h3>
            {testResults.map((result, index) => (
              <Card key={index} className={result.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{result.test}</span>
                    <span className={`px-2 py-1 rounded text-sm ${
                      result.success 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {result.success ? 'SUCCESS' : 'FAILED'}
                    </span>
                  </div>
                  <pre className="text-sm bg-gray-100 p-2 rounded overflow-x-auto">
                    {JSON.stringify(result.data, null, 2)}
                  </pre>
                  <div className="text-xs text-gray-500 mt-2">
                    {result.timestamp}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="mt-6 p-4 bg-gray-50 rounded">
          <h4 className="font-semibold mb-2">Instructions:</h4>
          <ol className="text-sm space-y-1">
            <li>1. Enter a valid user ID from your database</li>
            <li>2. Click &quot;Test APIs&quot; to check all endpoints</li>
            <li>3. Check the console for detailed error logs</li>
            <li>4. Review the results to identify which API is failing</li>
          </ol>
          
          <div className="mt-4">
            <h5 className="font-medium mb-1">Common Issues:</h5>
            <ul className="text-sm text-gray-600 space-y-1">
                          <li>• User ID format incorrect (should be MongoDB ObjectId)</li>
            <li>• Rating API endpoint doesn&apos;t exist yet</li>
            <li>• User referenced in rating doesn&apos;t exist (deleted user)</li>
              <li>• CORS issues with API</li>
              <li>• Network connectivity problems</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 