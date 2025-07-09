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
import { useToast } from '@/components/ui/use-toast';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { FileUpload } from '@/components/ui/file-upload';
import { AlertCircle, Save, User, Mail, MapPin, Upload, FileText } from 'lucide-react';
import Link from 'next/link';

interface EditProfileFormProps {
  className?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const EditProfileForm: React.FC<EditProfileFormProps> = ({ 
  className, 
  onSuccess, 
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

  useEffect(() => {
    if (profile) {
      const mappedRole = profile.role === 'seller' ? 'user' : (profile.role || 'user');
      form.reset({
        name: profile.name || '',
        email: profile.email || '',
        bio: profile.bio || '',
        avatar: profile.avatar || '',
        location: profile.location || '',
        role: mappedRole as 'user' | 'admin',
      });
    }
  }, [profile, form]);

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
      // Convert File to data URL if avatar is a File
      let avatarData = data.avatar;
      
      if (data.avatar instanceof File) {
        
        try {
          avatarData = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
              const result = e.target?.result as string || '';
              resolve(result);
            };
            reader.onerror = (error) => {
              console.error("FileReader error:", error);
              reject(error);
            };
            reader.readAsDataURL(data.avatar as File);
          });
        } catch (fileError) {
          console.error("Error reading file:", fileError);
          toast({
            title: "Lỗi khi xử lý ảnh",
            description: "Không thể đọc file ảnh, vui lòng thử lại với ảnh khác.",
            variant: "destructive",
          });
          return;
        }
      }

      
      const profileData = {
        ...data,
        avatar: avatarData as string
      };

      const response = await updateProfile(token, profileData);
      
      if (response.success) {
        toast({
          title: "Hồ sơ đã được cập nhật",
          description: "Hồ sơ của bạn đã được cập nhật thành công.",
        });
        onSuccess?.();
      } else {
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
      console.error("Profile update error:", error);
      if (error instanceof Error && error.message.includes('Unauthorized')) {
        toast({
          title: "Phiên đăng nhập hết hạn",
          description: "Vui lòng đăng nhập lại để tiếp tục.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Lỗi khi cập nhật hồ sơ",
          description: error instanceof Error ? error.message : "Lỗi khi cập nhật hồ sơ.",
          variant: "destructive",
        });
      }
    }
  };

  // const handleCancel = () => {
  //   if (profile) {
  //     const mappedRole = profile.role === 'seller' ? 'user' : (profile.role || 'user');
  //     form.reset({
  //       name: profile.name || '',
  //       email: profile.email || '',
  //       bio: profile.bio || '',
  //       avatar: profile.avatar || '',
  //       location: profile.location || '',
  //       role: mappedRole as 'user' | 'admin',
  //     });
  //   }
  //   clearUpdateError();
  //   clearValidationErrors();
  //   onCancel?.();
  // };

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
      <CardHeader className="pb-6">
        <CardTitle className="flex items-center gap-3 text-xl">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg text-white">
            <User className="h-5 w-5" />
          </div>
          <span className="bg-gradient-to-r from-gray-700 via-blue-700 to-purple-700 dark:from-gray-200 dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent">
            Chỉnh sửa hồ sơ
          </span>
        </CardTitle>
        <p className="text-muted-foreground ml-11">
          Cập nhật thông tin cá nhân và tùy chỉnh hồ sơ của bạn
        </p>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    <div className="p-1.5 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 rounded-md">
                      <User className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                    </div>
                    Họ và tên
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Nhập họ và tên của bạn" 
                      {...field} 
                      disabled={isUpdating}
                      className="border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    <div className="p-1.5 bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900/30 dark:to-emerald-800/30 rounded-md">
                      <Mail className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    Địa chỉ Email
                  </FormLabel>
                  <FormControl>
                    <Input 
                      type="email"
                      placeholder="Nhập địa chỉ email của bạn" 
                      {...field} 
                      disabled={isUpdating}
                      className="border-gray-200 dark:border-gray-700 focus:border-emerald-500 focus:ring-emerald-500/20 transition-all duration-200"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    <div className="p-1.5 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30 rounded-md">
                      <FileText className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
                    </div>
                    Giới thiệu
                  </FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Nói cho chúng tôi biết về bạn (tùy chọn)"
                      className="min-h-[120px] border-gray-200 dark:border-gray-700 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-200 resize-none"
                      {...field} 
                      disabled={isUpdating}
                    />
                  </FormControl>
                  <div className="flex items-center justify-between">
                    <FormMessage />
                    <p className="text-xs text-muted-foreground">
                      <span className={field.value?.length > 450 ? 'text-orange-500' : field.value?.length > 400 ? 'text-yellow-500' : 'text-gray-500'}>
                        {field.value?.length || 0}
                      </span>
                      <span className="text-gray-400">/500 ký tự</span>
                    </p>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="avatar"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    <div className="p-1.5 bg-gradient-to-br from-indigo-100 to-indigo-200 dark:from-indigo-900/30 dark:to-indigo-800/30 rounded-md">
                      <Upload className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    Ảnh đại diện
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      {field.value && typeof field.value === 'string' && field.value.startsWith('http') && (
                        <div className="mb-2 relative w-24 h-24 overflow-hidden rounded-lg border-2 border-indigo-200">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img 
                            src={field.value}
                            alt="Current avatar"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <FileUpload
                        value={field.value ? [field.value] : []}
                        onChange={(files) => {
                          const file = files[0];
                          console.log("File selected:", file);
                          if (file instanceof File) {
                            console.log("File details:", file.name, file.size, file.type);
                          }
                          field.onChange(file || '');
                        }}
                        accept="image/png,image/jpeg,image/jpg"
                        maxFiles={1}
                        maxSize={5}
                        disabled={isUpdating}
                        className="w-full"
                      />
                      {isUpdating && (
                        <div className="absolute inset-0 bg-white/50 dark:bg-gray-800/50 rounded-lg flex items-center justify-center backdrop-blur-sm">
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                            Đang xử lý...
                          </div>
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    <div className="p-1.5 bg-gradient-to-br from-rose-100 to-rose-200 dark:from-rose-900/30 dark:to-rose-800/30 rounded-md">
                      <MapPin className="h-3.5 w-3.5 text-rose-600 dark:text-rose-400" />
                    </div>
                    Địa chỉ
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Thành phố, Quốc gia (tùy chọn)" 
                      {...field} 
                      disabled={isUpdating}
                      className="border-gray-200 dark:border-gray-700 focus:border-rose-500 focus:ring-rose-500/20 transition-all duration-200"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {updateError && (
              <div className="relative">
                <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border border-red-200 dark:border-red-800/30 rounded-xl">
                  <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg flex-shrink-0">
                    <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-red-800 dark:text-red-200 mb-1">Có lỗi xảy ra</h4>
                    <p className="text-sm text-red-700 dark:text-red-300">{updateError}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-4 pt-6">
              <Button 
                type="submit" 
                disabled={isUpdating}
                className="flex-1 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 hover:from-blue-600 hover:via-purple-600 hover:to-indigo-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                size="lg"
              >
                <Save className="h-4 w-4 mr-2" />
                {isUpdating ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Đang cập nhật...
                  </span>
                ) : (
                  'Cập nhật hồ sơ'
                )}
              </Button>
              
              <Button variant="outline" size="lg">
                <Link href={`/users/${profile?._id}`}>
                  Trang cá nhân
                </Link>
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}; 