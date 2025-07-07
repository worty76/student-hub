import { Product, Category, BannerSlide } from '@/types/marketplace';

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
    id: 'books',
    name: 'Sách & Giáo Trình',
    icon: '📚',
    description: 'Sách giáo khoa, tài liệu học tập, sách tham khảo và tiểu thuyết',
    productCount: 1580,
    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&q=80'
  },
  {
    id: 'electronics',
    name: 'Đồ Điện Tử',
    icon: '💻',
    description: 'Laptop, điện thoại, tai nghe, máy tính bảng và phụ kiện công nghệ',
    productCount: 892,
    image: 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=400&q=80'
  },
  {
    id: 'clothing',
    name: 'Quần Áo & Phụ Kiện',
    icon: '👕',
    description: 'Áo quần, giày dép, túi xách và phụ kiện thời trang sinh viên',
    productCount: 1247,
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&q=80'
  },
  {
    id: 'furniture',
    name: 'Nội Thất & Đồ Dùng',
    icon: '🪑',
    description: 'Bàn ghế, giường tủ, đồ trang trí và đồ dùng gia đình',
    productCount: 673,
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80'
  },
  {
    id: 'sports',
    name: 'Thể Thao & Giải Trí',
    icon: '⚽',
    description: 'Dụng cụ thể thao, xe đạp, đồ chơi và thiết bị giải trí',
    productCount: 428,
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80'
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
      return 'bg-green-100 text-green-800 hover:bg-green-200';
    case 'good-price':
      return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
    case 'urgent':
      return 'bg-red-100 text-red-800 hover:bg-red-200';
    default:
      return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
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