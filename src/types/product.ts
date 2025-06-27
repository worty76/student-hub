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

// Seller interface for API responses
export interface Seller {
  _id: string;
  name: string;
  rating?: number;
  ratingCount?: number;
  avatar?: string;
  location?: string;
}

// Pagination interfaces
export interface Pagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface ProductsResponse {
  products: Product[];
  pagination: Pagination;
}

export interface ProductsQueryParams {
  page?: number;
  limit?: number;
  category?: string;
  condition?: string;
  status?: string;
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  search?: string;
  sortBy?: 'price' | 'createdAt' | 'views' | 'favorites';
  sortOrder?: 'asc' | 'desc';
}

// New product types for API integration
export interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  condition: 'new' | 'like-new' | 'good' | 'fair' | 'poor';
  status: 'available' | 'sold' | 'pending';
  seller: string | Seller;
  location: string;
  views?: number;
  favorites?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateProductRequest {
  _id?: string;
  title: string;
  description: string;
  price: number;
  images: (File | string)[];
  category: string;
  condition: 'new' | 'like-new' | 'good' | 'fair' | 'poor';
  status: 'available' | 'sold' | 'pending';
  seller: string;
  location: string;
}

export interface CreateProductResponse {
  success: boolean;
  message: string;
  product?: Product;
  errors?: Record<string, string>;
}

// Edit product types
export interface EditProductRequest {
  _id: string;
  title: string;
  description: string;
  price: number;
  images: (File | string)[];
  category: string;
  condition: 'new' | 'like-new' | 'good' | 'fair' | 'poor';
  status: 'available' | 'sold' | 'pending';
  seller: string;
  location: string;
}

export interface EditProductResponse {
  success: boolean;
  message: string;
  product?: Product;
  errors?: Record<string, string>;
}

export interface DeleteProductResponse {
  success: boolean;
  message: string;
}

// Form validation schema type
export interface ProductFormData {
  title: string;
  description: string;
  price: number;
  images: (File | string)[];
  category: string;
  condition: 'new' | 'like-new' | 'good' | 'fair' | 'poor';
  status: 'available' | 'sold' | 'pending';
  seller: string;
  location: string;
}

// Constants for form options
export const PRODUCT_CATEGORIES = [
  { value: 'books', label: 'Sách' },
  { value: 'electronics', label: 'Điện tử' },
  { value: 'clothing', label: 'Quần áo' },
  { value: 'furniture', label: 'Nội thất' },
  { value: 'sports', label: 'Thể thao' },
  { value: 'other', label: 'Khác' }
] as const;

export const PRODUCT_CONDITIONS = [
  { value: 'new', label: 'Đồ mới' },
  { value: 'like-new', label: 'Như mới' },
  { value: 'good', label: 'Còn tốt' },
  { value: 'fair', label: 'Tạm được' },
  { value: 'poor', label: 'Hư hỏng' },
] as const;

export const PRODUCT_STATUS = [
  { value: 'available', label: 'Còn hàng' },
  { value: 'sold', label: 'Đã bán' },
  { value: 'pending', label: 'Đang chờ' }
] as const;

// Helper functions to get Vietnamese labels
export const getCategoryLabel = (value: string): string => {
  const category = PRODUCT_CATEGORIES.find(cat => cat.value === value);
  return category ? category.label : value;
};

export const getConditionLabel = (value: string): string => {
  const condition = PRODUCT_CONDITIONS.find(cond => cond.value === value);
  return condition ? condition.label : value;
};

export const getStatusLabel = (value: string): string => {
  const status = PRODUCT_STATUS.find(stat => stat.value === value);
  return status ? status.label : value;
};

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

// Buy Product Types
export interface BuyProductRequest {
  paymentMethod: 'cash';
  shippingAddress: string;
}

export interface BuyProductResponse {
  success: boolean;
  message: string;
  orderId?: string;
  orderDetails?: {
    productId: string;
    productTitle: string;
    price: number;
    paymentMethod: string;
    shippingAddress: string;
    estimatedDelivery?: string;
    sellerId: string;
    sellerName: string;
  };
}

export interface BuyProductError {
  message: string;
  code: number;
}

// Report Product Types
export interface ReportProductRequest {
  reason: 'inappropriate' | 'spam' | 'fraud' | 'offensive' | 'other';
  description: string;
}

export interface ReportProductResponse {
  success: boolean;
  message: string;
  reportId?: string;
}

export interface ReportProductError {
  message: string;
  code: number;
}

// Report reason options
export const REPORT_REASONS = [
  { value: 'inappropriate', label: 'Nội dung không phù hợp' },
  { value: 'spam', label: 'Spam' },
  { value: 'fraud', label: 'Lừa đảo' },
  { value: 'offensive', label: 'Ngôn từ xúc phạm' },
  { value: 'other', label: 'Khác' }
] as const;

// Admin Reports Types
export interface ProductReport {
  _id: string;
  type: 'product';
  reporter: {
    _id: string;
    name: string;
    email: string;
  };
  reported: {
    _id: string;
    name: string;
    email: string;
  };
  product: {
    _id: string;
    title: string;
    // ... other product properties
  } | null;
  reason: string;
  description: string;
  status: 'pending' | 'reviewed' | 'dismissed';
  createdAt: string;
  updatedAt: string;
}

export interface ProductReportsResponse {
  reports: ProductReport[];
  pagination: Pagination;
}

export interface ProductReportsQueryParams {
  page?: number;
  limit?: number;
  status?: 'pending' | 'reviewed' | 'dismissed';
  reason?: string;
  sortBy?: 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
} 