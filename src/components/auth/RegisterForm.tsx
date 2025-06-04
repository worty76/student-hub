'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Eye, EyeOff, CheckCircle, XCircle, User, ShoppingBag } from 'lucide-react';
import { UserRole } from '@/types/auth';

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  address: string;
  role: UserRole | '';
}

interface ValidationErrors {
  [key: string]: string;
}

export function RegisterForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    role: '',
  });
  
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    hasMinLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecialChar: false,
  });
  
  const { register, isLoading, error, clearError } = useAuthStore();
  const router = useRouter();

  // Validation functions
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    // Accepts formats: (123) 456-7890, 123-456-7890, 123.456.7890, 1234567890
    const phoneRegex = /^(\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  const validateName = (name: string): boolean => {
    // Check for at least 2 characters and only letters, spaces, hyphens, and apostrophes
    const nameRegex = /^[a-zA-Z\s\-']{2,}$/;
    return nameRegex.test(name.trim());
  };

  const checkPasswordStrength = (password: string) => {
    const strength = {
      hasMinLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
    setPasswordStrength(strength);
    return strength;
  };

  const isPasswordStrong = (strength: typeof passwordStrength): boolean => {
    return Object.values(strength).filter(Boolean).length >= 4;
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};
    
    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (!validateName(formData.name)) {
      newErrors.name = 'Please enter a valid name (minimum 2 characters, letters only)';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    
    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email address is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else {
      const strength = checkPasswordStrength(formData.password);
      if (!isPasswordStrong(strength)) {
        newErrors.password = 'Password must meet at least 4 of the strength requirements';
      }
    }
    
    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    // Phone validation
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number (e.g., (123) 456-7890)';
    }
    
    // Address validation
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    } else if (formData.address.trim().length < 10) {
      newErrors.address = 'Please enter a complete address (minimum 10 characters)';
    }
    
    // Role validation
    if (!formData.role) {
      newErrors.role = 'Please select an account type';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    if (!validateForm()) {
      // Scroll to first error
      const firstErrorField = Object.keys(errors)[0];
      if (firstErrorField) {
        const element = document.getElementById(firstErrorField);
        element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element?.focus();
      }
      return;
    }
    
    try {
      await register({
        ...formData,
        role: formData.role as UserRole,
      });
      router.push('/dashboard');
    } catch (err) {
      console.error('Registration error:', err);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    
    // Real-time password strength checking
    if (field === 'password') {
      checkPasswordStrength(value);
      // Also check confirm password if it exists
      if (formData.confirmPassword && value !== formData.confirmPassword) {
        setErrors(prev => ({ ...prev, confirmPassword: 'Passwords do not match' }));
      } else if (formData.confirmPassword && value === formData.confirmPassword) {
        setErrors(prev => ({ ...prev, confirmPassword: '' }));
      }
    }
    
    // Real-time password matching
    if (field === 'confirmPassword' && formData.password) {
      if (value !== formData.password) {
        setErrors(prev => ({ ...prev, confirmPassword: 'Passwords do not match' }));
      } else {
        setErrors(prev => ({ ...prev, confirmPassword: '' }));
      }
    }

    // Real-time email validation
    if (field === 'email' && value && !validateEmail(value)) {
      setErrors(prev => ({ ...prev, email: 'Please enter a valid email address' }));
    }

    // Real-time phone validation (only if they've typed something)
    if (field === 'phone' && value.length > 3 && !validatePhone(value)) {
      setErrors(prev => ({ ...prev, phone: 'Please enter a valid phone number' }));
    }
  };

  const formatPhoneNumber = (value: string) => {
    const phoneNumber = value.replace(/[^\d]/g, '');
    const phoneNumberLength = phoneNumber.length;
    
    if (phoneNumberLength < 4) return phoneNumber;
    if (phoneNumberLength < 7) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    }
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedPhone = formatPhoneNumber(e.target.value);
    handleInputChange('phone', formattedPhone);
  };

  const PasswordStrengthIndicator = () => (
    <div className="mt-2 space-y-2">
      <p className="text-xs font-medium text-gray-700">Password Requirements:</p>
      <div className="grid grid-cols-1 gap-1 text-xs">
        <div className={`flex items-center gap-1 ${passwordStrength.hasMinLength ? 'text-green-600' : 'text-gray-400'}`}>
          {passwordStrength.hasMinLength ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
          At least 8 characters
        </div>
        <div className={`flex items-center gap-1 ${passwordStrength.hasUppercase ? 'text-green-600' : 'text-gray-400'}`}>
          {passwordStrength.hasUppercase ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
          One uppercase letter (A-Z)
        </div>
        <div className={`flex items-center gap-1 ${passwordStrength.hasLowercase ? 'text-green-600' : 'text-gray-400'}`}>
          {passwordStrength.hasLowercase ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
          One lowercase letter (a-z)
        </div>
        <div className={`flex items-center gap-1 ${passwordStrength.hasNumber ? 'text-green-600' : 'text-gray-400'}`}>
          {passwordStrength.hasNumber ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
          One number (0-9)
        </div>
        <div className={`flex items-center gap-1 ${passwordStrength.hasSpecialChar ? 'text-green-600' : 'text-gray-400'}`}>
          {passwordStrength.hasSpecialChar ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
          One special character (!@#$%^&*)
        </div>
      </div>
      <div className="mt-2">
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${
                Object.values(passwordStrength).filter(Boolean).length <= 2 
                  ? 'bg-red-500 w-1/4' 
                  : Object.values(passwordStrength).filter(Boolean).length === 3
                  ? 'bg-yellow-500 w-1/2'
                  : Object.values(passwordStrength).filter(Boolean).length === 4
                  ? 'bg-blue-500 w-3/4'
                  : 'bg-green-500 w-full'
              }`}
            />
          </div>
          <span className={`text-xs font-medium ${
            Object.values(passwordStrength).filter(Boolean).length <= 2 
              ? 'text-red-500' 
              : Object.values(passwordStrength).filter(Boolean).length === 3
              ? 'text-yellow-500'
              : Object.values(passwordStrength).filter(Boolean).length === 4
              ? 'text-blue-500'
              : 'text-green-500'
          }`}>
            {Object.values(passwordStrength).filter(Boolean).length <= 2 ? 'Weak' 
             : Object.values(passwordStrength).filter(Boolean).length === 3 ? 'Fair'
             : Object.values(passwordStrength).filter(Boolean).length === 4 ? 'Good'
             : 'Strong'}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Full Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter your full name"
              error={errors.name}
              className="w-full"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address <span className="text-red-500">*</span>
            </label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="Enter your email address"
              error={errors.email}
              className="w-full"
            />
          </div>

          {/* Phone Number */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={handlePhoneChange}
              placeholder="012 345 6789"
              error={errors.phone}
              maxLength={14}
              className="w-full"
            />
          </div>

          {/* Address */}
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
              Address <span className="text-red-500">*</span>
            </label>
            <Input
              id="address"
              type="text"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder="Enter your complete address"
              error={errors.address}
              className="w-full"
            />
          </div>

          {/* Role Selection */}
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
              Account Type <span className="text-red-500">*</span>
            </label>
            <div className="space-y-1">
              <Select value={formData.role} onValueChange={(value) => handleInputChange('role', value)}>
                <SelectTrigger 
                  className={`w-full ${errors.role ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                  id="role"
                >
                  <SelectValue placeholder="Select your account type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-blue-600" />
                      <div>
                        <div className="font-medium">User Account</div>
                        <div className="text-xs text-gray-500">Browse and purchase items</div>
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="seller">
                    <div className="flex items-center gap-2">
                      <ShoppingBag className="h-4 w-4 text-green-600" />
                      <div>
                        <div className="font-medium">Seller Account</div>
                        <div className="text-xs text-gray-500">Sell and manage products</div>
                      </div>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              {errors.role && (
                <p className="text-sm text-red-500">{errors.role}</p>
              )}
            </div>
          </div>
          
          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder="Create a strong password"
                error={errors.password}
                className="w-full pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {formData.password && <PasswordStrengthIndicator />}
          </div>
          
          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password <span className="text-red-500">*</span>  
            </label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                placeholder="Confirm your password"
                error={errors.confirmPassword}
                className="w-full pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {formData.confirmPassword && formData.password === formData.confirmPassword && !errors.confirmPassword && (
              <div className="flex items-center gap-1 mt-1 text-green-600 text-xs">
                <CheckCircle className="h-3 w-3" />
                Passwords match
              </div>
            )}
          </div>
          
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
              <p className="font-medium">Registration failed</p>
              <p>{error}</p>
            </div>
          )}
          
          <Button 
            type="submit" 
            className="w-full h-11 text-base font-medium" 
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </form>
        
        <div className="mt-6 text-center text-xs text-gray-500">
          <p className="mt-1">
            By creating an account, you agree to our{' '}
            <span className="text-blue-600 hover:underline">Terms of Service</span>
            {' '}and{' '}
            <span className="text-blue-600 hover:underline">Privacy Policy</span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}