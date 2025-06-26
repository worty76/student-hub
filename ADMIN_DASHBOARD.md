    # Admin Dashboard

This document describes the admin dashboard functionality for the StudentHub marketplace application.

## Access

The admin dashboard is accessible at `/admin` for users with the `admin` role. The dashboard includes role-based access control to ensure only administrators can access admin features.

## Features

### 1. Overview Dashboard
- Real-time statistics (users, products, sales, revenue)
- Recent activity feed
- Key performance indicators
- Quick refresh functionality

### 2. User Management
- View all users with search and filtering
- User status management (active, suspended, banned)
- Role promotion/demotion
- User activity monitoring
- Report tracking per user

### 3. Product Management
- Product listing with search and category filters
- Product moderation (approve, remove, delete)
- Status tracking (active, sold, removed, pending)
- Report count monitoring
- Seller information

### 4. Reports Management
- View user and product reports
- Filter by type and status
- Resolve or dismiss reports
- Track report statistics
- Action history

### 5. System Settings
- General site configuration
- File upload settings
- Security and moderation controls
- Email notification settings
- System maintenance tools

## Components

### Main Components
- `AdminDashboard`: Main dashboard wrapper with navigation
- `AdminOverview`: Dashboard overview with stats and activity
- `AdminUserManagement`: User management interface
- `AdminProductManagement`: Product moderation interface
- `AdminReports`: Reports management system
- `AdminSettings`: System configuration panel

### Navigation
Admin users will see an "Admin Dashboard" link in their user menu that provides quick access to the admin interface.

## Security

- Role-based access control
- Protected routes for admin-only content
- Automatic redirection for unauthorized users
- Confirmation dialogs for destructive actions

## Mock Data

Currently, the dashboard uses mock data for demonstration purposes. In production, replace the mock API calls with actual backend integration:

```typescript
// Replace mock data calls like this:
setTimeout(() => {
  setStats(mockStats);
}, 1000);

// With actual API calls:
const response = await fetch('/api/admin/stats');
const stats = await response.json();
setStats(stats);
```

## Required Backend Endpoints

To fully integrate this admin dashboard, implement these backend endpoints:

### Statistics
- `GET /api/admin/stats` - Dashboard statistics
- `GET /api/admin/activity` - Recent activity

### User Management
- `GET /api/admin/users` - List all users
- `PUT /api/admin/users/:id/status` - Update user status
- `PUT /api/admin/users/:id/role` - Update user role

### Product Management
- `GET /api/admin/products` - List all products
- `PUT /api/admin/products/:id/status` - Update product status
- `DELETE /api/admin/products/:id` - Delete product

### Reports
- `GET /api/admin/reports` - List all reports
- `PUT /api/admin/reports/:id/resolve` - Resolve report
- `PUT /api/admin/reports/:id/dismiss` - Dismiss report

### Settings
- `GET /api/admin/settings` - Get system settings
- `PUT /api/admin/settings` - Update system settings

## Usage

1. **Login as Admin**: Ensure your user account has the `admin` role
2. **Access Dashboard**: Click "Admin Dashboard" in the user menu or navigate to `/admin`
3. **Navigate Sections**: Use the sidebar to switch between different admin functions
4. **Manage Content**: Use the filtering, search, and action buttons to manage users, products, and reports
5. **Configure System**: Use the settings panel to configure system-wide options

## Responsive Design

The admin dashboard is fully responsive and works on:
- Desktop (optimal experience)
- Tablet (collapsible sidebar)
- Mobile (mobile-first navigation) 