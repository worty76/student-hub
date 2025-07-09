import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState, LoginCredentials, RegisterCredentials, LogoutResponse } from '@/types/auth';
import { AuthService } from '@/services/auth.service';

interface AuthStore extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => Promise<LogoutResponse>;
  clearError: () => void;
  checkAuth: () => void;
  refreshAuth: () => Promise<void>;
  initializeAuth: () => void;
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
          // Clear any existing authentication state before login
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          localStorage.removeItem('auth-storage');
          
          const response = await AuthService.login(credentials);
          
          // Set token in localStorage for compatibility with other services
          if (response.token) {
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));
          }
          
          set({ 
            user: response.user, 
            token: response.token,
            isAuthenticated: true, 
            isLoading: false 
          });
        } catch (error) {
          // Clear localStorage on login failure
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          localStorage.removeItem('auth-storage');
          localStorage.removeItem('user-profile-storage');
          
          const errorMessage = error instanceof Error 
            ? error.message 
            : 'Đăng nhập thất bại';
            
          set({ 
            error: errorMessage, 
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
          // Clear any existing authentication state before registration
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          localStorage.removeItem('auth-storage');
          localStorage.removeItem('user-profile-storage');
          
          const registerData = {
            email: credentials.email,
            password: credentials.password,
            name: credentials.name,
            role: credentials.role,
          };
          
          const response = await AuthService.register(registerData);
          
          // Set token in localStorage for compatibility with other services
          if (response.token) {
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));
          }
          
          set({ 
            user: response.user, 
            token: response.token,
            isAuthenticated: true, 
            isLoading: false 
          });
        } catch (error) {
          // Clear localStorage on register failure
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          localStorage.removeItem('auth-storage');
          localStorage.removeItem('user-profile-storage');
          
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
        set({ isLoading: true, error: null });
        try {
          // Call logout API
          const result = await AuthService.logout();
          
          // Clear localStorage
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          
          // Clear Zustand persist storage
          localStorage.removeItem('auth-storage');
          
          // Clear user profile storage (this was the missing piece!)
          localStorage.removeItem('user-profile-storage');
          
          // Also clear the userStore programmatically
          try {
            const { useUserStore } = await import('@/store/userStore');
            useUserStore.getState().clearProfile();
          } catch (error) {
            console.warn('Could not clear user store:', error);
          }
          
          // Clear any auth cookies if they exist
          if (typeof document !== 'undefined') {
            document.cookie.split(";").forEach((c) => {
              const eqPos = c.indexOf("=");
              const name = eqPos > -1 ? c.substr(0, eqPos).trim() : c.trim();
              document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
            });
          }
          
          // Reset store state
          set({ 
            user: null, 
            token: null,
            isAuthenticated: false, 
            error: null, 
            isLoading: false,
          });
      
          
          return result; // Return API response for UI feedback
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Đăng xuất thất bại';
          console.error('Logout failed:', errorMessage);
          
          // Still clear auth data even if API call fails
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          
          // Clear Zustand persist storage even on error
          localStorage.removeItem('auth-storage');
          
          // Clear user profile storage even on error
          localStorage.removeItem('user-profile-storage');
          
          // Also clear the userStore programmatically even on error
          try {
            const { useUserStore } = await import('@/store/userStore');
            useUserStore.getState().clearProfile();
          } catch (error) {
            console.warn('Could not clear user store on error:', error);
          }
          
          set({ 
            user: null, 
            token: null,
            isAuthenticated: false, 
            error: errorMessage, 
            isLoading: false,
          });
          
          throw error; // Re-throw for UI error handling
        }
      },

      clearError: () => {
        set({ error: null });
      },

      checkAuth: () => {
        const { user, token } = get();
        const isAuth = !!(user && token);
        
        // Also check localStorage for consistency
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        
        if (isAuth && storedToken && storedUser) {
          // Both sources have data, we're good
          set({ isAuthenticated: true });
        } else if (!isAuth && (!storedToken || !storedUser)) {
          // Both sources are empty, we're good
          set({ isAuthenticated: false });
        } else {
          // Inconsistent state, prioritize authStore but sync localStorage
          if (isAuth && token) {
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            set({ isAuthenticated: true });
          } else {
            console.log('Auth check: Clearing inconsistent state');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('auth-storage');
            localStorage.removeItem('user-profile-storage');
            set({ 
              isAuthenticated: false,
              user: null,
              token: null
            });
          }
        }
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

      initializeAuth: () => {
        const { user: storeUser, token: storeToken } = get();
        const storedToken = localStorage.getItem('token');
        const storedUserStr = localStorage.getItem('user');
        const authStorage = localStorage.getItem('auth-storage');
        const userProfileStorage = localStorage.getItem('user-profile-storage');
        
        console.log(authStorage, userProfileStorage);

        try {
          const storedUser = storedUserStr ? JSON.parse(storedUserStr) : null;
          
          if (storedToken && storedUser && (!storeUser || !storeToken)) {
            set({
              user: storedUser,
              token: storedToken,
              isAuthenticated: true
            });
          }
          else if (storeUser && storeToken && (!storedToken || !storedUser)) {
            localStorage.setItem('token', storeToken);
            localStorage.setItem('user', JSON.stringify(storeUser));
            set({ isAuthenticated: true });
          }
          else if (storeUser && storeToken && storedToken && storedUser) {
            set({ isAuthenticated: true });
          }
          else if (!storeUser && !storeToken && !storedToken && !storedUser) {
            set({ isAuthenticated: false });
          }
          else {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('auth-storage');
            localStorage.removeItem('user-profile-storage');
            set({
              user: null,
              token: null,
              isAuthenticated: false
            });
          }
        } catch (error) {
          console.error('Error initializing auth:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          localStorage.removeItem('auth-storage');
          localStorage.removeItem('user-profile-storage');
          set({
            user: null,
            token: null,
            isAuthenticated: false
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