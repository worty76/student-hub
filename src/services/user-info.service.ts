const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export interface UserInfo {
  _id: string;
  name: string;
  avatar?: string;
}

export class UserInfoService {
  private static userCache = new Map<string, UserInfo>();

  static async getUserInfo(userId: string): Promise<UserInfo> {
    // Check cache first
    if (this.userCache.has(userId)) {
      console.log('📋 Using cached user info for:', userId, this.userCache.get(userId));
      return this.userCache.get(userId)!;
    }

    console.log('🔍 Fetching user info for userId:', userId);

    // Try to get current user from auth store if this is the logged-in user
    try {
      const authStoreModule = await import('@/store/authStore');
      const currentUser = authStoreModule.useAuthStore.getState().user;
      
      if (currentUser) {
        console.log('👤 Current user object:', currentUser);
        
        // Handle different possible ID field names
        const currentUserId = currentUser._id;
        console.log('🆔 Extracted user ID:', currentUserId);
        
        if (currentUserId && currentUserId === userId) {
          console.log('✅ Using current user from auth store for own comment');
          const userInfo = {
            _id: currentUserId,
            name: currentUser.name,
            avatar: currentUser.avatar
          };
          this.userCache.set(userId, userInfo);
          return userInfo;
        }
      }
    } catch (error) {
      console.log('📝 Could not get current user from auth store:', error);
    }

    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('📡 User API response:', response.status, response.statusText);

      if (!response.ok) {
        console.warn('❌ User API failed:', response.status, 'for userId:', userId);
        // If user not found, return a fallback
        return {
          _id: userId,
          name: 'Người dùng ẩn danh',
        };
      }

      const userInfo: UserInfo = await response.json();
      console.log('✅ Successfully fetched user info:', userInfo);
      
      // Cache the result
      this.userCache.set(userId, userInfo);
      
      return userInfo;
    } catch (error) {
      console.error('💥 Error fetching user info for userId:', userId, error);
      // Return fallback on error
      return {
        _id: userId,
        name: 'Người dùng ẩn danh',
      };
    }
  }

  static async getUserInfoBatch(userIds: string[]): Promise<Map<string, UserInfo>> {
    const results = new Map<string, UserInfo>();
    const uncachedIds = userIds.filter(id => !this.userCache.has(id));

    // Get cached users
    userIds.forEach(id => {
      if (this.userCache.has(id)) {
        results.set(id, this.userCache.get(id)!);
      }
    });

    // Fetch uncached users
    if (uncachedIds.length > 0) {
      try {
        const promises = uncachedIds.map(id => this.getUserInfo(id));
        const userInfos = await Promise.all(promises);
        
        uncachedIds.forEach((id, index) => {
          results.set(id, userInfos[index]);
        });
      } catch (error) {
        console.error('Error in batch user fetch:', error);
        // Add fallbacks for failed requests
        uncachedIds.forEach(id => {
          if (!results.has(id)) {
            results.set(id, {
              _id: id,
              name: 'Người dùng ẩn danh',
            });
          }
        });
      }
    }

    return results;
  }

  static clearCache() {
    this.userCache.clear();
  }
} 