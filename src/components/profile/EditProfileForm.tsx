'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore } from '@/store/authStore';
import { useUserStore } from '@/store/userStore';
import { editProfileSchema, EditProfileFormData } from '@/types/profile';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { AlertCircle, Save, User, Mail, MapPin, Link, FileText, Shield } from 'lucide-react';

interface EditProfileFormProps {
  className?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const EditProfileForm: React.FC<EditProfileFormProps> = ({ 
  className, 
  onSuccess, 
  onCancel 
}) => {
  const { token, isAuthenticated } = useAuthStore();
  const { 
    profile, 
    isUpdating, 
    updateError, 
    validationErrors, 
    updateProfile, 
    clearUpdateError,
    clearValidationErrors 
  } = useUserStore();
  const { toast } = useToast();

  const form = useForm<EditProfileFormData>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      name: '',
      email: '',
      bio: '',
      avatar: '',
      location: '',
      role: 'user',
    },
  });

  // Initialize form with current profile data
  useEffect(() => {
    if (profile) {
      form.reset({
        name: profile.name || '',
        email: profile.email || '',
        bio: profile.bio || '',
        avatar: profile.avatar || '',
        location: profile.location || '',
        role: profile.role || 'user',
      });
    }
  }, [profile, form]);

  // Clear errors when form changes
  useEffect(() => {
    const subscription = form.watch(() => {
      if (updateError || Object.keys(validationErrors).length > 0) {
        clearUpdateError();
        clearValidationErrors();
      }
    });
    return () => subscription.unsubscribe();
  }, [form, updateError, validationErrors, clearUpdateError, clearValidationErrors]);

  const onSubmit = async (data: EditProfileFormData) => {
    if (!token) {
      toast({
        title: "Lỗi xác thực",
        description: "Vui lòng đăng nhập lại để cập nhật hồ sơ của bạn.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await updateProfile(token, data);
      
      if (response.success) {
        toast({
          title: "Hồ sơ đã được cập nhật",
          description: "Hồ sơ của bạn đã được cập nhật thành công.",
        });
        onSuccess?.();
      } else {
        // Handle validation errors from server
        if (response.errors) {
          Object.entries(response.errors).forEach(([field, message]) => {
            form.setError(field as keyof EditProfileFormData, {
              type: 'server',
              message: message,
            });
          });
        }
        
        toast({
          title: "Lỗi khi cập nhật hồ sơ",
          description: response.message || "Lỗi khi cập nhật hồ sơ. Vui lòng kiểm tra lại form.",
          variant: "destructive",
        });
      }
    } catch (error) {
      if (error instanceof Error && error.message.includes('Unauthorized')) {
        toast({
          title: "Phiên đăng nhập hết hạn",
          description: "Vui lòng đăng nhập lại để tiếp tục.",
          variant: "destructive",
        });
        // You might want to redirect to login here
      } else {
        toast({
          title: "Lỗi khi cập nhật hồ sơ",
          description: error instanceof Error ? error.message : "Lỗi khi cập nhật hồ sơ.",
          variant: "destructive",
        });
      }
    }
  };

  const handleCancel = () => {
    if (profile) {
      form.reset({
        name: profile.name || '',
        email: profile.email || '',
        bio: profile.bio || '',
        avatar: profile.avatar || '',
        location: profile.location || '',
        role: profile.role || 'user',
      });
    }
    clearUpdateError();
    clearValidationErrors();
    onCancel?.();
  };

  if (!isAuthenticated) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Vui lòng đăng nhập để chỉnh sửa hồ sơ của bạn</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Chỉnh sửa hồ sơ
        </CardTitle>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Name Field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Họ và tên
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Nhập họ và tên của bạn" 
                      {...field} 
                      disabled={isUpdating}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Địa chỉ Email
                  </FormLabel>
                  <FormControl>
                    <Input 
                      type="email"
                      placeholder="Nhập địa chỉ email của bạn" 
                      {...field} 
                      disabled={isUpdating}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Bio Field */}
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Giới thiệu
                  </FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Nói cho chúng tôi biết về bạn (tùy chọn)"
                      className="min-h-[100px]"
                      {...field} 
                      disabled={isUpdating}
                    />
                  </FormControl>
                  <FormMessage />
                  <p className="text-xs text-muted-foreground">
                    {field.value?.length || 0}/500 ký tự
                  </p>
                </FormItem>
              )}
            />

            {/* Avatar URL Field */}
            <FormField
              control={form.control}
              name="avatar"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Link className="h-4 w-4" />
                    Ảnh đại diện
                  </FormLabel>
                  <FormControl>
                    <Input 
                      type="url"
                      placeholder="https://example.com/avatar.jpg (tùy chọn)" 
                      {...field} 
                      disabled={isUpdating}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Location Field */}
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Địa chỉ
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Thành phố, Quốc gia (tùy chọn)" 
                      {...field} 
                      disabled={isUpdating}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Global Error Message */}
            {updateError && (
              <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                <AlertCircle className="h-4 w-4 text-destructive flex-shrink-0" />
                <p className="text-sm text-destructive">{updateError}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button 
                type="submit" 
                disabled={isUpdating}
                className="flex-1"
              >
                <Save className="h-4 w-4 mr-2" />
                {isUpdating ? 'Đang cập nhật...' : 'Cập nhật hồ sơ'}
              </Button>
              
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleCancel}
                disabled={isUpdating}
              >
                Bỏ qua
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}; 