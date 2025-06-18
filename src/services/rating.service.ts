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
          throw new Error('Bạn không có quyền đánh giá');
        }
        if (response.status === 404) {
          throw new Error('Người dùng không tồn tại');
        }
        if (response.status === 400) {
          throw new Error(data.message || 'Dữ liệu đánh giá không hợp lệ');
        }
        throw new Error(data.message || `Lỗi khi đánh giá: ${response.statusText}`);
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Lỗi khi đánh giá');
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
          throw new Error('Người dùng không tồn tại');
        }
        throw new Error(`Lỗi khi tải đánh giá: ${response.status} ${response.statusText}`);
      }

      const ratings: Rating[] = await response.json();
      
      if (!Array.isArray(ratings)) {
        console.warn('❌ API returned non-array ratings data:', ratings);
        return [];
      }
      
      return ratings;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Lỗi khi tải đánh giá');
    }
  }
}

export const ratingService = {
  createRating: RatingService.createRating,
  getUserRatings: RatingService.getUserRatings,
}; 