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
        } catch (error) {
          console.error('Đăng xuất thất bại:', error);
        } finally {
          // Always clear both authStore and localStorage
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          
          set({ 
            user: null, 
            token: null,
            isAuthenticated: false, 
            error: null, 
            isLoading: false 
          });
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
            localStorage.removeItem('token');
            localStorage.removeItem('user');
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
        
        try {
          const storedUser = storedUserStr ? JSON.parse(storedUserStr) : null;
          
          // If we have data in localStorage but not in store, update store
          if (storedToken && storedUser && (!storeUser || !storeToken)) {
            console.log('Initializing auth from localStorage');
            set({
              user: storedUser,
              token: storedToken,
              isAuthenticated: true
            });
          }
          // If we have data in store but not in localStorage, update localStorage
          else if (storeUser && storeToken && (!storedToken || !storedUser)) {
            console.log('Syncing auth to localStorage');
            localStorage.setItem('token', storeToken);
            localStorage.setItem('user', JSON.stringify(storeUser));
            set({ isAuthenticated: true });
          }
          // If both have data, ensure they match
          else if (storeUser && storeToken && storedToken && storedUser) {
            set({ isAuthenticated: true });
          }
          // If neither has data, ensure clean state
          else if (!storeUser && !storeToken && !storedToken && !storedUser) {
            set({ isAuthenticated: false });
          }
          // Handle inconsistent state by clearing everything
          else {
            console.log('Clearing inconsistent auth state');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            set({
              user: null,
              token: null,
              isAuthenticated: false
            });
          }
        } catch (error) {
          console.error('Error initializing auth:', error);
          // Clear everything on error
          localStorage.removeItem('token');
          localStorage.removeItem('user');
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