import { User, ReportUserRequest, ReportUserResponse, ReportUserError } from '@/types/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

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

  static async getUserById(id: string): Promise<User> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('User not found');
        }
        throw new Error(`Lỗi khi lấy thông tin người dùng: ${response.statusText}`);
      }

      const user: User = await response.json();
      return user;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Lỗi khi lấy thông tin người dùng');
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

    static async reportUser(userId: string, token: string, reportData: ReportUserRequest): Promise<ReportUserResponse> {
    try {
      // Try the original format first
      let response = await fetch(`${API_BASE_URL}/users/${userId}/report`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reportData),
      });

      let data = await response.json();

      // If 400 error, try alternative formats
      if (response.status === 400) {
        console.log('400 error with original format, trying alternatives...');
        console.log('Server response:', data);
        
        // Try format 2: Minimal data
        const altFormat1 = {
          reason: "inappropriate",
          description: "Test report"
        };
        
        console.log('Trying minimal format:', altFormat1);
        response = await fetch(`${API_BASE_URL}/users/${userId}/report`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(altFormat1),
        });

        data = await response.json();
        console.log('Minimal format response:', response.status, data);

        if (!response.ok) {
          // Try format 3: Check if endpoint exists by trying OPTIONS
          console.log('Trying OPTIONS request to check endpoint...');
          const optionsResponse = await fetch(`${API_BASE_URL}/users/${userId}/report`, {
            method: 'OPTIONS',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          
          console.log('OPTIONS response:', optionsResponse.status, optionsResponse.statusText);
          
          if (optionsResponse.status === 404) {
            throw new Error('API endpoint không tồn tại - có thể chưa được triển khai');
          }
        }
      }

      if (!response.ok) {
        const error: ReportUserError = {
          message: data.message || 'Lỗi khi báo cáo người dùng',
          code: response.status
        };

        if (response.status === 401) {
          error.message = 'Vui lòng đăng nhập lại';
          throw error;
        }
        
        if (response.status === 400) {
          error.message = 'Dữ liệu nhập không hợp lệ';
          console.log('Final 400 error details:', data);
          throw error;
        }
        
        if (response.status === 404) {
          error.message = 'Người dùng không tồn tại';
          throw error;
        }
        
        throw error;
      }

      return {
        success: true,
        message: data.message || 'Báo cáo người dùng thành công',
        reportId: data.reportId
      };
    } catch (error) {
      console.error('💥 Error in reportUser service:', error);
      
      if (error instanceof Error || (error && typeof error === 'object' && 'code' in error)) {
        throw error;
      }
      
      throw new Error('Lỗi khi báo cáo người dùng');
    }
  }
}

export const userService = {
  getUserProfile: UserService.getUserProfile,
  getUserById: UserService.getUserById,
  updateProfile: UserService.updateProfile,
  reportUser: UserService.reportUser,
}; 