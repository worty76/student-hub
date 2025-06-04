import { Product, Category, BannerSlide, Area } from '@/types/marketplace';

export const bannerSlides: BannerSlide[] = [
  {
    id: '1',
    title: 'Find Your Perfect Second-Hand Items',
    subtitle: 'Quality Goods at Great Prices',
    description: 'Discover thousands of pre-loved items from trusted sellers in your area. From study materials to household essentials.',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80',
    ctaText: 'Start Shopping',
    ctaLink: '/browse'
  },
  {
    id: '2',
    title: 'Sell Your Items Quickly & Safely',
    subtitle: 'Turn Your Unused Items into Cash',
    description: 'List your items for free and reach thousands of potential buyers. Our secure platform ensures safe transactions.',
    image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&q=80',
    ctaText: 'Start Selling',
    ctaLink: '/sell'
  },
  {
    id: '3',
    title: 'Local Community Marketplace',
    subtitle: 'Connect with Neighbors',
    description: 'Buy and sell within your local community. Meet face-to-face, inspect items, and build lasting connections.',
    image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&q=80',
    ctaText: 'Join Community',
    ctaLink: '/community'
  }
];

export const categories: Category[] = [
  {
    id: 'household',
    name: 'Household Items',
    icon: '🏠',
    description: 'Furniture, appliances, and home essentials',
    productCount: 1247,
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80'
  },
  {
    id: 'study',
    name: 'Study Items',
    icon: '📚',
    description: 'Books, laptops, stationery, and learning materials',
    productCount: 892,
    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&q=80'
  },
  {
    id: 'moving',
    name: 'Moving/Room clearing',
    icon: '📦',
    description: 'Bulk items, furniture sets, and quick sales',
    productCount: 356,
    image: 'https://images.unsplash.com/photo-1591528287446-43c9c0e1075e?w=400&q=80'
  }
];

export const areas: Area[] = [
  { id: 'fpt', name: 'FPT University Area', productCount: 324 },
  { id: 'duytan', name: 'Duy Tân Area', productCount: 198 },
  { id: 'bachkhoa', name: 'Bách Khoa Area', productCount: 156 },
  { id: 'downtown', name: 'Downtown Area', productCount: 289 }
];

export const mockProducts: Product[] = [
  {
    id: '1',
    title: 'MacBook Air M1 - Excellent Condition',
    price: 18500000,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&q=80',
    location: 'FPT University Area',
    status: 'newly-posted',
    category: 'study',
    description: 'Barely used MacBook Air with M1 chip. Perfect for students. Includes original charger and box.',
    seller: { id: '1', name: 'Nguyễn Văn A' },
    createdAt: new Date('2024-01-15'),
    condition: 'like-new'
  },
  {
    id: '2',
    title: 'Study Desk with Drawers',
    price: 850000,
    image: 'https://images.unsplash.com/photo-1549497538-303791108f95?w=400&q=80',
    location: 'Duy Tân Area',
    status: 'good-price',
    category: 'household',
    description: 'Wooden study desk in great condition. Perfect for dorm rooms. 3 drawers with smooth sliding mechanism.',
    seller: { id: '2', name: 'Trần Thị B' },
    createdAt: new Date('2024-01-14'),
    condition: 'good'
  },
  {
    id: '3',
    title: 'Complete Textbook Set - Computer Science',
    price: 1200000,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
    location: 'Bách Khoa Area',
    status: 'urgent',
    category: 'study',
    description: 'Full set of CS textbooks for 4-year program. Moving sale! Includes programming, algorithms, and database books.',
    seller: { id: '3', name: 'Lê Văn C' },
    createdAt: new Date('2024-01-13'),
    condition: 'good'
  },
  {
    id: '4',
    title: 'Rice Cooker - Sharp 1.8L',
    price: 450000,
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80',
    location: 'FPT University Area',
    status: 'good-price',
    category: 'household',
    description: 'Well-maintained rice cooker. Perfect for student living. Energy efficient and easy to clean.',
    seller: { id: '4', name: 'Phạm Thị D' },
    createdAt: new Date('2024-01-12'),
    condition: 'good'
  },
  {
    id: '5',
    title: 'Moving Sale - Furniture Bundle',
    price: 2800000,
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80',
    location: 'Downtown Area',
    status: 'urgent',
    category: 'moving',
    description: 'Complete room furniture set. Bed, desk, chair, wardrobe. Must sell this week due to relocation.',
    seller: { id: '5', name: 'Hoàng Văn E' },
    createdAt: new Date('2024-01-11'),
    condition: 'fair'
  },
  {
    id: '6',
    title: 'iPad Pro 11" with Apple Pencil',
    price: 15000000,
    image: 'https://images.unsplash.com/photo-1544244015-d72c7d2275cb?w=400&q=80',
    location: 'Duy Tân Area',
    status: 'newly-posted',
    category: 'study',
    description: 'iPad Pro with Apple Pencil for digital note-taking and design. Includes keyboard case and screen protector.',
    seller: { id: '6', name: 'Vũ Thị F' },
    createdAt: new Date('2024-01-10'),
    condition: 'like-new'
  },
  {
    id: '7',
    title: 'Gaming Chair - Ergonomic Design',
    price: 1200000,
    image: 'https://images.unsplash.com/photo-1541558869434-2840d308329a?w=400&q=80',
    location: 'FPT University Area',
    status: 'good-price',
    category: 'household',
    description: 'Comfortable gaming chair with lumbar support. Perfect for long study sessions. Adjustable height and armrests.',
    seller: { id: '7', name: 'Đỗ Minh G' },
    createdAt: new Date('2024-01-09'),
    condition: 'good'
  },
  {
    id: '8',
    title: 'Engineering Calculator - Casio FX-991ES',
    price: 350000,
    image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&q=80',
    location: 'Bách Khoa Area',
    status: 'newly-posted',
    category: 'study',
    description: 'Scientific calculator perfect for engineering students. All functions working perfectly. Includes user manual.',
    seller: { id: '8', name: 'Bùi Thị H' },
    createdAt: new Date('2024-01-08'),
    condition: 'like-new'
  },
  {
    id: '9',
    title: 'Kitchen Appliance Set',
    price: 950000,
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80',
    location: 'Downtown Area',
    status: 'urgent',
    category: 'household',
    description: 'Complete kitchen set including blender, toaster, and kettle. Perfect for student apartments. Urgent sale!',
    seller: { id: '9', name: 'Lương Văn I' },
    createdAt: new Date('2024-01-07'),
    condition: 'fair'
  },
  {
    id: '10',
    title: 'Programming Books Collection',
    price: 800000,
    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&q=80',
    location: 'Duy Tân Area',
    status: 'good-price',
    category: 'study',
    description: 'Collection of programming books including Python, Java, and Web Development. Great for self-learning.',
    seller: { id: '10', name: 'Cao Thị J' },
    createdAt: new Date('2024-01-06'),
    condition: 'good'
  },
  {
    id: '11',
    title: 'Dorm Room Essentials Bundle',
    price: 1500000,
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80',
    location: 'FPT University Area',
    status: 'newly-posted',
    category: 'moving',
    description: 'Everything you need for dorm life: bedding, desk lamp, storage boxes, and more. Perfect starter pack!',
    seller: { id: '11', name: 'Phan Văn K' },
    createdAt: new Date('2024-01-05'),
    condition: 'good'
  },
  {
    id: '12',
    title: 'Art Supplies - Complete Set',
    price: 600000,
    image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&q=80',
    location: 'Bách Khoa Area',
    status: 'good-price',
    category: 'study',
    description: 'Professional art supplies including paints, brushes, and canvases. Perfect for art students. Barely used.',
    seller: { id: '12', name: 'Huỳnh Thị L' },
    createdAt: new Date('2024-01-04'),
    condition: 'like-new'
  }
];

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
  }).format(price);
};

export const getStatusColor = (status: Product['status']): string => {
  switch (status) {
    case 'newly-posted':
      return 'bg-green-100 text-green-800';
    case 'good-price':
      return 'bg-blue-100 text-blue-800';
    case 'urgent':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const getStatusLabel = (status: Product['status']): string => {
  switch (status) {
    case 'newly-posted':
      return 'Newly Posted';
    case 'good-price':
      return 'Good Price';
    case 'urgent':
      return 'Urgent Sale';
    default:
      return status;
  }
}; 