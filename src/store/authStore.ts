import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, AuthState, LoginCredentials, RegisterCredentials } from '@/types/auth';
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
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true, error: null });
        try {
          const user = await AuthService.login(credentials);
          set({ user, isAuthenticated: true, isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Login failed', 
            isLoading: false,
            isAuthenticated: false,
            user: null
          });
          throw error; // Re-throw to allow components to handle the error
        }
      },

      register: async (credentials: RegisterCredentials) => {
        set({ isLoading: true, error: null });
        try {
          const user = await AuthService.register(credentials);
          set({ user, isAuthenticated: true, isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Registration failed', 
            isLoading: false,
            isAuthenticated: false,
            user: null
          });
          throw error; // Re-throw to allow components to handle the error
        }
      },

      logout: async () => {
        set({ isLoading: true });
        try {
          await AuthService.logout();
          set({ user: null, isAuthenticated: false, error: null, isLoading: false });
        } catch (error) {
          // Even if logout fails on the backend, clear the local state
          set({ user: null, isAuthenticated: false, error: null, isLoading: false });
          console.error('Logout error:', error);
        }
      },

      clearError: () => {
        set({ error: null });
      },

      checkAuth: () => {
        const { user } = get();
        set({ isAuthenticated: !!user });
      },

      refreshAuth: async () => {
        const { user } = get();
        if (!user) return;

        try {
          await AuthService.refreshToken();
          // If successful, the user is still authenticated
        } catch (error) {
          // If refresh fails, log the user out
          set({ user: null, isAuthenticated: false, error: 'Session expired' });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      }),
      version: 1, // Add versioning for future migrations
    }
  )
); 