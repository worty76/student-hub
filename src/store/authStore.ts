import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState, LoginCredentials, RegisterCredentials } from '@/types/auth';
import { AuthService } from '@/services/auth.service';

interface AuthStore extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  checkAuth: () => void;
  refreshAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true, error: null });
        try {
          const response = await AuthService.login(credentials);
          set({ 
            user: response.user, 
            token: response.token,
            isAuthenticated: true, 
            isLoading: false 
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Đăng nhập thất bại', 
            isLoading: false,
            isAuthenticated: false,
            user: null,
            token: null
          });
          throw error;
        }
      },

      register: async (credentials: RegisterCredentials) => {
        set({ isLoading: true, error: null });
        try {
          const registerData = {
            email: credentials.email,
            password: credentials.password,
            name: credentials.name,
            role: credentials.role,
          };
          
          const response = await AuthService.register(registerData);
          set({ 
            user: response.user, 
            token: response.token,
            isAuthenticated: true, 
            isLoading: false 
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Đăng ký thất bại', 
            isLoading: false,
            isAuthenticated: false,
            user: null,
            token: null
          });
          throw error;
        }
      },

      logout: async () => {
        set({ isLoading: true });
        try {
          await AuthService.logout();
          set({ 
            user: null, 
            token: null,
            isAuthenticated: false, 
            error: null, 
            isLoading: false 
          });
        } catch (error) {
          set({ 
            user: null, 
            token: null,
            isAuthenticated: false, 
            error: null, 
            isLoading: false 
          });
          console.error('Đăng xuất thất bại:', error);
        }
      },

      clearError: () => {
        set({ error: null });
      },

      checkAuth: () => {
        const { user, token } = get();
        set({ isAuthenticated: !!(user && token) });
      },

      refreshAuth: async () => {
        const { user } = get();
        if (!user) return;

        try {
          await AuthService.refreshToken();
        } catch {
          set({ 
            user: null, 
            token: null,
            isAuthenticated: false, 
            error: 'Phiên đăng nhập đã hết hạn' 
          });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token,
        isAuthenticated: state.isAuthenticated 
      }),
      version: 1,
    }
  )
); 