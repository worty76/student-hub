export interface Order {
  id: string;
  type: 'purchase' | 'sale';
  product: {
    id: string;
    title: string;
    image: string;
    price: number;
  };
  buyer?: {
    id: string;
    name: string;
    email: string;
  };
  seller?: {
    id: string;
    name: string;
    email: string;
  };
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  quantity: number;
  totalAmount: number;
  orderDate: Date;
  deliveryDate?: Date;
  trackingNumber?: string;
}

export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  condition: 'like-new' | 'good' | 'fair' | 'poor';
  status: 'active' | 'sold' | 'hidden' | 'pending';
  createdAt: Date;
  updatedAt: Date;
  views: number;
  likes: number;
  location: string;
}

export interface Review {
  id: string;
  type: 'received' | 'given';
  rating: number;
  comment: string;
  reviewer: {
    id: string;
    name: string;
    avatar?: string;
  };
  reviewee: {
    id: string;
    name: string;
    avatar?: string;
  };
  order: {
    id: string;
    productTitle: string;
  };
  createdAt: Date;
}

export interface ShippingAddress {
  id: string;
  label: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'bank' | 'wallet';
  label: string;
  details: string;
  isDefault: boolean;
  lastUsed?: Date;
}

export interface ProfileSettings {
  shippingAddresses: ShippingAddress[];
  paymentMethods: PaymentMethod[];
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  privacy: {
    showEmail: boolean;
    showPhone: boolean;
    allowMessages: boolean;
  };
} 