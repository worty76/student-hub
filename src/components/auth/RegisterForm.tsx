"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth.service';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2, CheckCircle2, User, Mail, Lock, Eye, EyeOff } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(2, 'Tên phải có ít nhất 2 ký tự'),
  email: z.string().email('Vui lòng nhập địa chỉ email hợp lệ'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
});

type FormData = z.infer<typeof formSchema>;

export default function RegisterForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: FormData) => {
    setIsLoading(true);
    try {
      const response = await authService.register({
        ...values,
        role: 'user' as const,
      });
      
      
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      setIsSuccess(true);
      toast.success("Tài khoản của bạn đã được tạo thành công.");

      setTimeout(() => {
        router.push('/');
      }, 1500);
    } catch (err) {
      console.error('Registration failed:', err);
      toast.error(err instanceof Error ? err.message : 'Đăng ký thất bại');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <Card className="w-full max-w-md mx-auto backdrop-blur-sm bg-white/80 border-0 shadow-2xl shadow-green-500/10">
        <CardContent className="pt-8 pb-8 text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mb-6 shadow-lg">
            <CheckCircle2 className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Đăng ký thành công!</h2>
          <p className="text-gray-600 mb-4">Tài khoản của bạn đã được tạo thành công.</p>
          <div className="flex items-center justify-center">
            <Loader2 className="mr-2 h-4 w-4 animate-spin text-indigo-600" />
            <span className="text-sm text-gray-600">Đang chuyển hướng...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto backdrop-blur-sm bg-white/80 border-0 shadow-2xl shadow-indigo-500/10">
      <CardHeader className="space-y-2 pb-6">
        <CardTitle className="text-2xl font-bold text-center bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Đăng ký
        </CardTitle>
        <CardDescription className="text-center text-gray-600">
          Tạo tài khoản để bắt đầu hành trình của bạn
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-sm font-semibold text-gray-700">Tên đầy đủ</FormLabel>
                  <FormControl>
                    <div className="relative group">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                      <Input 
                        placeholder="Nhập tên của bạn" 
                        {...field} 
                        className="pl-12 pr-4 py-3 h-12 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 rounded-xl bg-gray-50/50 focus:bg-white transition-all duration-200 text-gray-900 placeholder:text-gray-400"
                        disabled={isLoading}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-500 text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-sm font-semibold text-gray-700">Email</FormLabel>
                  <FormControl>
                    <div className="relative group">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                      <Input 
                        placeholder="Nhập địa chỉ email của bạn" 
                        type="email" 
                        {...field} 
                        className="pl-12 pr-4 py-3 h-12 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 rounded-xl bg-gray-50/50 focus:bg-white transition-all duration-200 text-gray-900 placeholder:text-gray-400"
                        disabled={isLoading}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-500 text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-sm font-semibold text-gray-700">Mật khẩu</FormLabel>
                  <FormControl>
                    <div className="relative group">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                      <Input 
                        placeholder="Tạo mật khẩu mạnh" 
                        type={showPassword ? 'text' : 'password'} 
                        {...field} 
                        className="pl-12 pr-12 py-3 h-12 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 rounded-xl bg-gray-50/50 focus:bg-white transition-all duration-200 text-gray-900 placeholder:text-gray-400"
                        disabled={isLoading}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100 rounded-lg transition-colors"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isLoading}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-500" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-500" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-500 text-xs" />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Đang tạo tài khoản...
                </>
              ) : (
                'Tạo tài khoản'
              )}
            </Button>

            {/* Terms and conditions */}
            <div className="text-center">
              <p className="text-xs text-gray-500">
                Bằng cách đăng ký, bạn đồng ý với{' '}
                <a href="#" className="text-indigo-600 hover:text-indigo-700 hover:underline">
                  Điều khoản dịch vụ
                </a>{' '}
                và{' '}
                <a href="#" className="text-indigo-600 hover:text-indigo-700 hover:underline">
                  Chính sách bảo mật
                </a>
              </p>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
} 