# Products List with Pagination - Complete Implementation

This document provides a comprehensive guide for the products list feature with pagination, filters, and search functionality.

## Overview

The products list system provides a complete solution for displaying and managing product listings with:
- ✅ API integration with the backend endpoint
- ✅ Pagination controls
- ✅ Search and filtering capabilities
- ✅ Responsive design
- ✅ Loading and error states
- ✅ Zustand state management
- ✅ TypeScript support

## Architecture

### 1. Types (`src/types/product.ts`)
- `Product` - Main product interface
- `ProductsResponse` - API response structure
- `Pagination` - Pagination metadata
- `ProductsQueryParams` - Query parameters for filtering

### 2. API Service (`src/services/product.service.ts`)
- `ProductService.getAllProducts()` - Fetches products with pagination and filters
- Handles query parameter building
- Error handling and type safety

### 3. State Management (`src/store/productsListStore.ts`)
- Zustand store for managing products list state
- Pagination state and actions
- Filter management
- Loading and error states

### 4. UI Components
- `ProductListCard` - Individual product display
- `ProductFilters` - Search and filter controls
- `Pagination` - Page navigation controls
- `ProductsList` - Main container component

## API Integration

### Endpoint
```
GET https://be-student-hub-production.up.railway.app/api/products
```

### Query Parameters
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 12)
- `category` - Filter by category
- `condition` - Filter by condition
- `status` - Filter by status
- `minPrice` - Minimum price filter
- `maxPrice` - Maximum price filter
- `location` - Location filter
- `search` - Search term
- `sortBy` - Sort field (price, createdAt, views, favorites)
- `sortOrder` - Sort direction (asc, desc)

### Response Structure
```json
{
  "products": [
    {
      "_id": "string",
      "title": "string",
      "description": "string",
      "price": 0,
      "images": ["string"],
      "category": "books",
      "condition": "new",
      "status": "available",
      "seller": "string",
      "location": "string",
      "views": 0,
      "favorites": 0,
      "createdAt": "2025-06-17T03:19:19.675Z",
      "updatedAt": "2025-06-17T03:19:19.675Z"
    }
  ],
  "pagination": {
    "total": 0,
    "page": 0,
    "limit": 0,
    "pages": 0
  }
}
```

## Usage

### 1. Basic Usage
```tsx
import { ProductsList } from '@/components/marketplace/ProductsList';

export function ProductsPage() {
  return (
    <div>
      <ProductsList />
    </div>
  );
}
```

### 2. Using the Store Directly
```tsx
import { useProductsListStore } from '@/store/productsListStore';

export function CustomProductsComponent() {
  const {
    products,
    pagination,
    isLoading,
    error,
    fetchProducts,
    updateFilters,
    nextPage,
    previousPage,
    goToPage,
  } = useProductsListStore();

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div>
      {/* Custom UI implementation */}
    </div>
  );
}
```

### 3. Custom Filtering
```tsx
const handleFilterChange = async () => {
  await updateFilters({
    category: 'electronics',
    condition: 'new',
    minPrice: 100000,
    maxPrice: 1000000,
  });
};
```

### 4. Pagination Controls
```tsx
const handlePageChange = async (page: number) => {
  await goToPage(page);
};

// Or use built-in navigation
await nextPage();
await previousPage();
```

## Components

### ProductsList
Main container component that includes:
- Header with title and refresh button
- Filters sidebar
- Products grid
- Pagination controls
- Loading, error, and empty states

```tsx
<ProductsList className="custom-class" />
```

### ProductListCard
Individual product card component:
- Product image with status badge
- Title, price, category, condition
- Location, views, favorites
- Creation date
- Description preview

```tsx
<ProductListCard product={product} className="custom-class" />
```

### ProductFilters
Search and filter controls:
- Search input
- Category, condition, status selectors
- Price range inputs
- Location filter
- Sort options
- Clear filters button

```tsx
<ProductFilters
  onFiltersChange={handleFiltersChange}
  currentParams={currentParams}
  isLoading={isLoading}
/>
```

### Pagination
Page navigation component:
- Previous/Next buttons
- Page number buttons
- Results summary
- Mobile-friendly layout

```tsx
<Pagination
  pagination={pagination}
  onPageChange={handlePageChange}
  isLoading={isLoading}
/>
```

## Store Actions

### Data Fetching
- `fetchProducts(params?, append?)` - Fetch products with optional parameters
- `refreshProducts()` - Refresh current products list

### Pagination
- `nextPage()` - Go to next page
- `previousPage()` - Go to previous page
- `goToPage(page)` - Go to specific page

### Filtering
- `updateFilters(params)` - Update filters and reset to page 1
- `clearFilters()` - Reset all filters to default

### State Management
- `clearError()` - Clear error state
- `resetState()` - Reset entire store to initial state

## Customization

### Styling
All components use Tailwind CSS classes and can be customized:
- Pass `className` prop to components
- Modify Tailwind classes in component files
- Use CSS modules or styled-components if needed

### Categories and Conditions
Defined in `src/types/product.ts`:
```tsx
export const PRODUCT_CATEGORIES = [
  { value: 'books', label: 'Sách' },
  { value: 'electronics', label: 'Điện tử' },
  // ...
];

export const PRODUCT_CONDITIONS = [
  { value: 'new', label: 'Đồ mới' },
  { value: 'like-new', label: 'Như mới' },
  // ...
];
```

## Error Handling

### API Errors
- Network failures
- 404 - No products found
- 500 - Server errors
- Invalid parameters

### User Feedback
- Loading states with spinners
- Error messages with retry buttons
- Empty states with helpful messages
- Toast notifications for actions

## Performance Optimizations

### Caching
- Store includes cache timeout (5 minutes)
- Prevents unnecessary API calls
- Automatic cache invalidation

### Loading States
- Separate loading states for initial load vs. updates
- Skeleton loading states
- Progressive loading for large datasets

### Pagination
- Configurable page sizes
- Smart pagination controls
- Efficient re-renders

## Accessibility

### Keyboard Navigation
- Tab navigation through all controls
- Enter/Space for button activation
- Arrow keys for pagination

### Screen Readers
- ARIA labels on all interactive elements
- Semantic HTML structure
- Status announcements for loading/error states

### Visual Indicators
- Clear focus states
- Loading indicators
- Error highlighting

## Testing

### Unit Tests
```bash
# Test store actions
npm test -- --testPathPattern=productsListStore

# Test components
npm test -- --testPathPattern=ProductsList
```

### Integration Tests
```bash
# Test API integration
npm test -- --testPathPattern=product.service

# Test full user flow
npm test -- --testPathPattern=ProductsList.integration
```

## Deployment

### Environment Variables
```env
NEXT_PUBLIC_API_URL=https://be-student-hub-production.up.railway.app/api
```

### Build Configuration
The components are optimized for production builds:
- Tree-shaking support
- Code splitting
- Optimized bundle sizes

## Troubleshooting

### Common Issues

1. **Products not loading**
   - Check API endpoint is accessible
   - Verify environment variables
   - Check network connectivity

2. **Pagination not working**
   - Ensure pagination object is valid
   - Check page bounds
   - Verify API response structure

3. **Filters not applying**
   - Check parameter formatting
   - Verify API supports all filter types
   - Ensure proper URL encoding

4. **Images not displaying**
   - Check image URLs are valid
   - Verify CORS settings
   - Ensure Next.js image optimization is configured

### Debug Mode
Enable debug logging:
```tsx
// In store or service files
console.log('API Request:', params);
console.log('API Response:', response);
```

## Future Enhancements

### Potential Improvements
- [ ] Infinite scroll option
- [ ] Advanced filtering UI
- [ ] Product comparison feature
- [ ] Saved searches
- [ ] Real-time updates
- [ ] Image lazy loading
- [ ] Virtual scrolling for large lists

### API Enhancements
- [ ] Full-text search
- [ ] Faceted search
- [ ] Geo-location filtering
- [ ] Price history
- [ ] Recommendation engine 