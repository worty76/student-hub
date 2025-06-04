import { User, LoginCredentials, RegisterCredentials } from '@/types/auth';

// This would be replaced with actual API calls in a real application
export class AuthService {
  private static readonly API_DELAY = 1000;

  static async login(credentials: LoginCredentials): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, this.API_DELAY));
    
    // Mock validation - replace with actual API call
    const mockUsers = [
      { id: '1', email: 'admin@example.com', password: 'admin123', role: 'admin' as const, name: 'Admin User' },
      { id: '2', email: 'seller@example.com', password: 'seller123', role: 'seller' as const, name: 'Seller User' },
      { id: '3', email: 'user@example.com', password: 'user123', role: 'user' as const, name: 'Regular User' },
    ];

    const user = mockUsers.find(u => 
      u.email === credentials.email && u.password === credentials.password
    );

    if (!user) {
      throw new Error('Invalid email or password');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  static async register(credentials: RegisterCredentials): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, this.API_DELAY));
    
    // Validation
    if (credentials.password !== credentials.confirmPassword) {
      throw new Error('Passwords do not match');
    }
    
    if (credentials.password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }

    if (!credentials.email.includes('@')) {
      throw new Error('Please enter a valid email address');
    }

    if (!credentials.name.trim()) {
      throw new Error('Name is required');
    }
    
    // Check if email already exists
    const existingEmails = ['admin@example.com', 'seller@example.com', 'user@example.com'];
    if (existingEmails.includes(credentials.email)) {
      throw new Error('Email already exists');
    }
    
    return { 
      id: Math.random().toString(36), 
      email: credentials.email, 
      role: credentials.role,
      name: credentials.name,
      phone: credentials.phone,
      address: credentials.address
    };
  }

  static async getCurrentUser(): Promise<User | null> {
    // This would check with the backend to validate the current session
    // For now, we'll rely on the persisted store data
    return null;
  }

  static async refreshToken(): Promise<string> {
    // In a real app, this would refresh the JWT token
    await new Promise(resolve => setTimeout(resolve, 500));
    return 'refreshed-token';
  }

  static async logout(): Promise<void> {
    // This would call the backend to invalidate the session
    await new Promise(resolve => setTimeout(resolve, 300));
  }
} 