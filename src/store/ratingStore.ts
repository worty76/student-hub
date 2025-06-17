import { create } from 'zustand';
import { CreateRatingRequest, CreateRatingResponse, Rating } from '@/types/rating';
import { ratingService } from '@/services/rating.service';

interface RatingState {
  isLoading: boolean;
  error: string | null;
  lastRating: CreateRatingResponse | null;
  
  userRatings: Rating[];
  isLoadingRatings: boolean;
  ratingsError: string | null;
  currentUserId: string | null;
}

interface RatingActions {
  createRating: (userId: string, ratingData: CreateRatingRequest, token: string) => Promise<CreateRatingResponse>;
  clearError: () => void;
  clearLastRating: () => void;
  
  fetchUserRatings: (userId: string) => Promise<void>;
  clearUserRatings: () => void;
  clearRatingsError: () => void;
}

type RatingStore = RatingState & RatingActions;

export const useRatingStore = create<RatingStore>((set) => ({
  isLoading: false,
  error: null,
  lastRating: null,
  
  userRatings: [],
  isLoadingRatings: false,
  ratingsError: null,
  currentUserId: null,

  createRating: async (userId: string, ratingData: CreateRatingRequest, token: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const rating = await ratingService.createRating(userId, ratingData, token);
      set({ 
        isLoading: false, 
        lastRating: rating,
        error: null 
      });
      return rating;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Lỗi khi đánh giá';
      set({ 
        isLoading: false, 
        error: errorMessage,
        lastRating: null 
      });
      throw error;
    }
  },

  clearError: () => {
    set({ error: null });
  },

  clearLastRating: () => {
    set({ lastRating: null });
  },

  fetchUserRatings: async (userId: string) => {
    set({ isLoadingRatings: true, ratingsError: null });
    
    try {
      const ratings = await ratingService.getUserRatings(userId);
      set({ 
        userRatings: ratings,
        isLoadingRatings: false,
        ratingsError: null,
        currentUserId: userId
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Lỗi khi tải đánh giá';
      set({ 
        userRatings: [],
        isLoadingRatings: false,
        ratingsError: errorMessage,
        currentUserId: userId
      });
    }
  },

  clearUserRatings: () => {
    set({ 
      userRatings: [], 
      ratingsError: null, 
      currentUserId: null 
    });
  },

  clearRatingsError: () => {
    set({ ratingsError: null });
  },
})); 