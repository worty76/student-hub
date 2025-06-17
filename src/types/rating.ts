export interface Rating {
  _id: string;
  rating: number;
  comment: string;
  rater: {
    _id: string;
    name: string;
    avatar?: string;
  };
  rated: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface CreateRatingRequest {
  rating: number;
  comment: string;
}

export interface CreateRatingResponse {
  _id: string;
  rating: number;
  comment: string;
  user: string;
  target: string;
  createdAt: string;
}

export interface RatingFormData {
  rating: number;
  comment: string;
}

export interface RatingValidationErrors {
  rating?: string;
  comment?: string;
}

export interface RatingWithUserInfo extends Rating {
  userInfo?: {
    _id: string;
    name: string;
    avatar?: string;
  };
}

export interface UserRatingsResponse {
  ratings: Rating[];
  averageRating: number;
  totalCount: number;
} 