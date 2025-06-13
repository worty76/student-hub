import { RegisterRequest, RegisterResponse } from '@/types/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://be-student-hub-production.up.railway.app/api';

export const authService = {
  async register(data: RegisterRequest): Promise<RegisterResponse> {
    const response = await fetch(`${API_URL}/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Đăng ký thất bại!');
    }

    return response.json();
  },
}; 