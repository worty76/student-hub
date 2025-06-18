import React from 'react';
import { UserRatingsList } from './UserRatingsList';

export function UserRatingsExample() {
  // Example usage of UserRatingsList component
  const exampleUserId = "60f7b3b3b3f3f3f3f3f3f3f3"; // Replace with actual user ID
  const exampleUserName = "John Doe"; // Replace with actual user name

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          User Ratings Example
        </h1>
        <p className="text-gray-600">
          This demonstrates how to display user ratings using the UserRatingsList component.
        </p>
      </div>

      <UserRatingsList 
        userId={exampleUserId}
        userName={exampleUserName}
      />

      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold text-gray-900 mb-2">Usage:</h3>
        <pre className="text-sm text-gray-700 overflow-x-auto">
{`<UserRatingsList 
  userId="user-id-here"
  userName="User Name Here"
/>`}
        </pre>
        
        <div className="mt-4">
          <h4 className="font-medium text-gray-900 mb-2">Features:</h4>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• Fetches ratings automatically when component mounts</li>
            <li>• Displays loading state while fetching data</li>
            <li>• Handles API errors gracefully (404, network errors)</li>
            <li>• Shows average rating and total count</li>
            <li>• Displays each rating with stars, comment, author, and timestamp</li>
            <li>• Fetches author information for each rating</li>
            <li>• Responsive design that works on mobile and desktop</li>
            <li>• Empty state when user has no ratings</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default UserRatingsExample; 