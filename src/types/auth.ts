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