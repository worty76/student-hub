import { User, LoginCredentials, LoginResponse, RegisterRequest, RegisterResponse, ForgetPasswordRequest, ForgetPasswordResponse, ResetPasswordRequest, ResetPasswordResponse } from '@/types/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export class AuthService {

  static async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Tài khoản hoặc mật khẩu không chính xác');
        }
        throw new Error(`Đăng nhập thất bại: ${response.statusText}`);
      }

      const data: LoginResponse = await response.json();
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Lỗi đã xảy ra');
    }
  }

  static async register(data: RegisterRequest): Promise<RegisterResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Đăng ký thất bại!');
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Lỗi đã xảy ra khi đăng ký');
    }
  }

  static async forgetPassword(data: ForgetPasswordRequest): Promise<ForgetPasswordResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/forget-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Không thể gửi yêu cầu đặt lại mật khẩu');
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Lỗi đã xảy ra khi gửi yêu cầu đặt lại mật khẩu');
    }
  }

  static async resetPassword(data: ResetPasswordRequest): Promise<ResetPasswordResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Không thể đặt lại mật khẩu');
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Lỗi đã xảy ra khi đặt lại mật khẩu');
    }
  }

  static async getCurrentUser(): Promise<User | null> {
    return null;
  }

  static async refreshToken(): Promise<string> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Không thể làm mới token');
      }

      const data = await response.json();
      return data.token;
    } catch {
      throw new Error('Phiên đăng nhập đã hết hạn');
    }
  }

  static async logout(): Promise<void> {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
    } catch (error) {
      console.warn('Logout API call failed:', error);
    }
  }

  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static isValidPassword(password: string): boolean {
    return password.length >= 6;
  }
}

export const authService = {
  register: AuthService.register,
  login: AuthService.login,
  logout: AuthService.logout,
  getCurrentUser: AuthService.getCurrentUser,
  refreshToken: AuthService.refreshToken,
  isValidEmail: AuthService.isValidEmail,
  isValidPassword: AuthService.isValidPassword,
  forgetPassword: AuthService.forgetPassword,
  resetPassword: AuthService.resetPassword,
}; 