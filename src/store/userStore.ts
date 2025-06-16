import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types/auth';
import { UserService, UpdateProfileRequest, UpdateProfileResponse } from '@/services/user.service';

interface UserProfileState {
  profile: User | null;
  isLoading: boolean;
  error: string | null;
  lastFetched: number | null;
  isUpdating: boolean;
  updateError: string | null;
  validationErrors: Record<string, string>;
}

interface UserProfileActions {
  fetchProfile: (token: string) => Promise<void>;
  updateProfile: (token: string, profileData: UpdateProfileRequest) => Promise<UpdateProfileResponse>;
  setProfile: (profile: User) => void;
  clearProfile: () => void;
  clearError: () => void;
  clearUpdateError: () => void;
  clearValidationErrors: () => void;
  shouldRefetch: () => boolean;
}

interface UserStore extends UserProfileState, UserProfileActions {}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      // State
      profile: null,
      isLoading: false,
      error: null,
      lastFetched: null,
      isUpdating: false,
      updateError: null,
      validationErrors: {},

      // Actions
      fetchProfile: async (token: string) => {
        // Check if we should skip fetching due to recent cache
        const { lastFetched, profile, shouldRefetch } = get();
        if (profile && lastFetched && !shouldRefetch()) {
          return;
        }

        set({ isLoading: true, error: null });
        
        try {
          const profileData = await UserService.getUserProfile(token);
          set({ 
            profile: profileData, 
            isLoading: false, 
            error: null,
            lastFetched: Date.now()
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Lỗi khi tải hồ sơ', 
            isLoading: false 
          });
          throw error;
        }
      },

      updateProfile: async (token: string, profileData: UpdateProfileRequest) => {
        set({ 
          isUpdating: true, 
          updateError: null, 
          validationErrors: {} 
        });
        
        try {
          const response = await UserService.updateProfile(token, profileData);
          
          if (response.success && response.user) {
            // Update succeeded
            set({ 
              profile: response.user,
              isUpdating: false,
              updateError: null,
              validationErrors: {},
              lastFetched: Date.now()
            });
            return response;
          } else {
            // Validation errors
            set({ 
              isUpdating: false,
              updateError: response.message,
              validationErrors: response.errors || {}
            });
            return response;
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Lỗi khi cập nhật hồ sơ';
          set({ 
            updateError: errorMessage,
            isUpdating: false,
            validationErrors: {}
          });
          throw error;
        }
      },

      setProfile: (profile: User) => {
        set({ profile, lastFetched: Date.now() });
      },

      clearProfile: () => {
        set({ 
          profile: null, 
          error: null, 
          isLoading: false,
          lastFetched: null,
          isUpdating: false,
          updateError: null,
          validationErrors: {}
        });
      },

      clearError: () => {
        set({ error: null });
      },

      clearUpdateError: () => {
        set({ updateError: null, validationErrors: {} });
      },

      clearValidationErrors: () => {
        set({ validationErrors: {} });
      },

      shouldRefetch: () => {
        const { lastFetched } = get();
        if (!lastFetched) return true;
        return Date.now() - lastFetched > CACHE_DURATION;
      },
    }),
    {
      name: 'user-profile-storage',
      partialize: (state) => ({ 
        profile: state.profile,
        lastFetched: state.lastFetched
      }),
      version: 1,
    }
  )
); 