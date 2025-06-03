export interface ProductDetail {
  id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  condition: 'like-new' | 'good' | 'fair' | 'poor';
  location: string;
  createdAt: Date;
  updatedAt: Date;
  views: number;
  likes: number;
  isAvailable: boolean;
  specifications?: Record<string, string>;
  seller: {
    id: string;
    name: string;
    avatar?: string;
    rating: number;
    totalReviews: number;
    responseRate: number;
    memberSince: Date;
    isVerified: boolean;
    isOnline: boolean;
  };
  shipping: {
    methods: string[];
    cost: number;
    estimatedDays: number;
  };
  bargaining: {
    enabled: boolean;
    minPrice?: number;
    acceptsOffers: boolean;
  };
}

export interface BargainOffer {
  id: string;
  productId: string;
  buyerId: string;
  sellerId: string;
  offerPrice: number;
  message?: string;
  status: 'pending' | 'accepted' | 'rejected' | 'countered';
  createdAt: Date;
  expiresAt: Date;
  counterOffer?: {
    price: number;
    message?: string;
    createdAt: Date;
  };
}

export interface ProductReview {
  id: string;
  productId: string;
  buyerId: string;
  rating: number;
  comment: string;
  images?: string[];
  createdAt: Date;
  helpful: number;
} 