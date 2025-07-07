# Student Hub

A marketplace platform for students to buy and sell products.

## Features

- User authentication and authorization
- Product listing and browsing
- Admin dashboard with analytics
- User management
- Real-time data visualization

## Admin Dashboard

The admin dashboard provides comprehensive statistics and analytics for the platform:

### Features:
- **Real-time Statistics**: Total users, products, sales, revenue, active users, and pending reports
- **Interactive Charts**: User growth trends, product categories distribution, sales overview, and revenue analysis
- **Error Handling**: Proper handling of authentication errors (401/403) with user-friendly messages
- **Loading States**: Smooth loading indicators while fetching data
- **Responsive Design**: Clean and modern UI that works on all devices

### State Management:
Uses Zustand for efficient state management with proper error handling and loading states.

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
npm install
# or
yarn install
```

### Running the Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Admin Access

To access the admin dashboard:
1. Login with admin credentials
2. Navigate to `/admin`
3. Access the dashboard overview for real-time analytics

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Charts**: Recharts
- **UI Components**: Custom components with Radix UI primitives
- **API**: RESTful API integration

## License

This project is licensed under the MIT License.