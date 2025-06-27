export const NAVIGATION_LINKS = [
  { href: '/products', label: 'Sản phẩm' },
  { href: '/categories', label: 'Categories' },
  { href: '/about', label: 'About' },
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