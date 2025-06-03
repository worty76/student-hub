export interface Product {
  id: string;
  title: string;
  price: number;
  image: string;
  location: string;
  status: 'newly-posted' | 'good-price' | 'urgent';
  category: string;
  description?: string;
  seller: {
    id: string;
    name: string;
    avatar?: string;
  };
  createdAt: Date;
  condition: 'like-new' | 'good' | 'fair' | 'poor';
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
  productCount: number;
  image: string;
}

export interface BannerSlide {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  ctaText: string;
  ctaLink: string;
}

export interface Area {
  id: string;
  name: string;
  productCount: number;
} 