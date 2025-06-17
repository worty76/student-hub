import { CreateRatingRequest, CreateRatingResponse, Rating } from '@/types/rating';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://be-student-hub-production.up.railway.app/api';

export class RatingService {
  static async createRating(
    userId: string,
    ratingData: CreateRatingRequest,
    token: string
  ): Promise<CreateRatingResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}/rate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(ratingData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized - Please login again');
        }
        if (response.status === 404) {
          throw new Error('User not found');
        }
        if (response.status === 400) {
          throw new Error(data.message || 'Invalid rating data');
        }
        throw new Error(data.message || `Failed to create rating: ${response.statusText}`);
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to create rating');
    }
  }

  static async getUserRatings(userId: string): Promise<Rating[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}/ratings`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('User not found');
        }
        throw new Error(`Failed to fetch ratings: ${response.status} ${response.statusText}`);
      }

      const ratings: Rating[] = await response.json();
      
      // Validate the ratings array
      if (!Array.isArray(ratings)) {
        console.warn('API returned non-array ratings data:', ratings);
        return [];
      }
      
      return ratings;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to fetch user ratings');
    }
  }
}

export const ratingService = {
  createRating: RatingService.createRating,
  getUserRatings: RatingService.getUserRatings,
}; 