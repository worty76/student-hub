import { User } from '@/types/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://be-student-hub-production.up.railway.app/api';

export interface UpdateProfileRequest {
  name: string;
  email: string;
  bio: string;
  avatar: string;
  location: string;
  role: 'user' | 'admin';
}

export interface UpdateProfileResponse {
  success: boolean;
  message: string;
  user?: User;
  errors?: Record<string, string>;
}

export class UserService {
  static async getUserProfile(token: string): Promise<User> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/profile`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Bạn không có quyền truy cập');
        }
        throw new Error(`Lỗi khi lấy hồ sơ: ${response.statusText}`);
      }

      const profile: User = await response.json();
      return profile;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Lỗi khi lấy hồ sơ');
    }
  }

  static async updateProfile(token: string, profileData: UpdateProfileRequest): Promise<UpdateProfileResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Bạn không có quyền truy cập');
        }
        
        if (response.status === 400) {
          // Return validation errors
          return {
            success: false,
            message: data.message || 'Lỗi khi cập nhật hồ sơ',
            errors: data.errors || {},
          };
        }
        
        throw new Error(data.message || `Lỗi khi cập nhật hồ sơ: ${response.statusText}`);
      }

      // Success response
      return {
        success: true,
        message: data.message || 'Hồ sơ đã được cập nhật thành công',
        user: data.user || data,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Lỗi khi cập nhật hồ sơ');
    }
  }
}

export const userService = {
  getUserProfile: UserService.getUserProfile,
  updateProfile: UserService.updateProfile,
}; 