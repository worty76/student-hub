export const NAVIGATION_LINKS = [
  { href: '/products', label: 'Sản phẩm' },
  { href: '/about', label: 'Giới thiệu' },
] as const;

export const APP_CONFIG = {
  name: 'StudentHub',
  description: 'Second-Hand Marketplace for Students',
  search: {
    placeholder: 'Search for items...',
    minQueryLength: 2,
  },
  auth: {
    minPasswordLength: 6,
  },
} as const;

export const ROUTES = {
  home: '/',
  login: '/auth/login',
  register: '/auth/register',
  profile: '/profile',
  favorites: '/favorites',
  messages: '/messages',
  admin: '/admin',
} as const; 