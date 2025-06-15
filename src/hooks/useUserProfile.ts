import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useUserStore } from '@/store/userStore';

export const useUserProfile = () => {
  const { token, isAuthenticated, user: authUser } = useAuthStore();
  const { 
    profile, 
    isLoading, 
    error, 
    fetchProfile, 
    clearProfile, 
    clearError,
    shouldRefetch
  } = useUserStore();

  useEffect(() => {
    if (isAuthenticated && token && shouldRefetch()) {
      fetchProfile(token).catch(console.error);
    }
  }, [isAuthenticated, token, fetchProfile, shouldRefetch]);

  useEffect(() => {
    if (!isAuthenticated) {
      clearProfile();
    }
  }, [isAuthenticated, clearProfile]);

  const refetchProfile = async () => {
    if (!token) {
      throw new Error('Không có token xác thực');
    }
    await fetchProfile(token);
  };

  return {
    profile,
    isLoading,
    error,
    isAuthenticated,
    refetchProfile,
    clearError,
    displayUser: profile || authUser,
  };
}; 