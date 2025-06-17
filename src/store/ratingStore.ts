import { create } from 'zustand';
import { CreateRatingRequest, CreateRatingResponse, Rating } from '@/types/rating';
import { ratingService } from '@/services/rating.service';

interface RatingState {
  // Rating creation state
  isLoading: boolean;
  error: string | null;
  lastRating: CreateRatingResponse | null;
  
  // User ratings state
  userRatings: Rating[];
  isLoadingRatings: boolean;
  ratingsError: string | null;
  currentUserId: string | null;
}

interface RatingActions {
  // Rating creation actions
  createRating: (userId: string, ratingData: CreateRatingRequest, token: string) => Promise<CreateRatingResponse>;
  clearError: () => void;
  clearLastRating: () => void;
  
  // User ratings actions
  fetchUserRatings: (userId: string) => Promise<void>;
  clearUserRatings: () => void;
  clearRatingsError: () => void;
}

type RatingStore = RatingState & RatingActions;

export const useRatingStore = create<RatingStore>((set) => ({
  // Rating creation state
  isLoading: false,
  error: null,
  lastRating: null,
  
  // User ratings state
  userRatings: [],
  isLoadingRatings: false,
  ratingsError: null,
  currentUserId: null,

  // Rating creation actions
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
      const errorMessage = error instanceof Error ? error.message : 'Failed to create rating';
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

  // User ratings actions
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
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch ratings';
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