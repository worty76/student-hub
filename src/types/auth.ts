export type UserRole = 'user' | 'admin' | 'seller';

export interface User {
  _id: string;
  email: string;
  name: string;
  avatar: string;
  bio: string;
  location: string;
  rating: number;
  ratingCount: number;
  favorites: string[];
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface LogoutResponse {
  success: boolean;
  message: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  address: string;
  role: UserRole;
}

export interface AuthError {
  message: string;
  field?: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  role: UserRole;
}

export interface RegisterResponse {
  token: string;
  user: User;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface ForgetPasswordRequest {
  email: string;
}

export interface ForgetPasswordResponse {
  message: string;
  resetToken: string;
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface ResetPasswordResponse {
  message: string;
}

// Report User Types
export interface ReportUserRequest {
  reason: 'inappropriate' | 'spam' | 'fraud' | 'offensive' | 'other';
  description: string;
}

export interface ReportUserResponse {
  success: boolean;
  message: string;
  reportId?: string;
}

export interface ReportUserError {
  message: string;
  code: number;
}

// Report reason options for users
export const USER_REPORT_REASONS = [
  { value: 'inappropriate', label: 'Hành vi không phù hợp' },
  { value: 'spam', label: 'Gửi spam' },
  { value: 'fraud', label: 'Lừa đảo' },
  { value: 'offensive', label: 'Ngôn từ xúc phạm' },
  { value: 'other', label: 'Khác' }
] as const;