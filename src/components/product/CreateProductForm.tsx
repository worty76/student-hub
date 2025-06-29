'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Loader2, 
  CheckCircle, 
  AlertCircle, 
  X,
  Plus,
  Sparkles
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FileUpload } from '@/components/ui/file-upload';
import { useToast } from '@/components/ui/use-toast';

import { useProductStore } from '@/store/productStore';
import { useAuthStore } from '@/store/authStore';
import { 
  PRODUCT_CATEGORIES, 
  PRODUCT_CONDITIONS, 
  PRODUCT_STATUS 
} from '@/types/product';

// Helper function to strip HTML tags for validation
const stripHtmlTags = (html: string): string => {
  if (typeof window === 'undefined') {
    // Simple regex fallback for SSR
    return html.replace(/<[^>]*>/g, '').trim();
  }
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || '';
};

const productSchema = z.object({
  title: z.string()
    .min(1, 'Tiêu đề không được để trống')
    .min(3, 'Tiêu đề phải có ít nhất 3 ký tự')
    .max(100, 'Tiêu đề không được vượt quá 100 ký tự'),
  description: z.string()
    .min(1, 'Mô tả không được để trống')
    .refine((val) => {
      const textContent = stripHtmlTags(val);
      return textContent.length >= 10;
    }, 'Mô tả phải có ít nhất 10 ký tự')
    .refine((val) => {
      const textContent = stripHtmlTags(val);
      return textContent.length <= 1000;
    }, 'Mô tả không được vượt quá 1000 ký tự'),
  price: z.number()
    .min(0, 'Giá phải là số dương')
    .max(999999999, 'Giá quá cao'),
  images: z.array(z.union([z.instanceof(File), z.string()]))
    .min(1, 'Ít nhất 1 ảnh là bắt buộc')
    .max(5, 'Tối đa 5 ảnh'),
  category: z.string()
    .min(1, 'Danh mục là bắt buộc'),
  condition: z.string()
    .min(1, 'Điều kiện là bắt buộc'),
  status: z.string()
    .min(1, 'Trạng thái là bắt buộc'),
  seller: z.string()
    .min(1, 'Thông tin người bán là bắt buộc'),
  location: z.string()
    .min(1, 'Vị trí là bắt buộc')
    .min(2, 'Vị trí phải có ít nhất 2 ký tự')
    .max(100, 'Vị trí không được vượt quá 100 ký tự'),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface CreateProductFormProps {
  onSuccess?: (productId: string) => void;
  onCancel?: () => void;
  className?: string;
}

export function CreateProductForm({ 
  onSuccess, 
  onCancel, 
  className 
}: CreateProductFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Zustand stores
  const {
    isCreating,
    createError,
    validationErrors,
    successMessage,
    createProduct,
    clearCreateError,
    clearSuccessMessage,
    resetCreateState
  } = useProductStore();

  const { user, token } = useAuthStore();

  // Reset loading states on component mount to prevent stuck states
  useEffect(() => {
    resetCreateState();
  }, [resetCreateState]);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: '',
      description: '',
      price: 0,
      images: [],
      category: '',
      condition: '',
      status: 'available',
      seller: user?.name || '',
      location: '',
    },
  });

  useEffect(() => {
    if (user?.name) {
      form.setValue('seller', user.name);
    }
    // Don't auto-populate location from user profile - let user enter manually
    // This prevents the backend from overriding with profile location
  }, [user, form]);

  const onSubmit = async (data: ProductFormValues) => {
    if (!token) {
      toast({
        title: 'Lỗi xác thực',
        description: 'Vui lòng đăng nhập để tạo sản phẩm',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    clearCreateError();
    clearSuccessMessage();

    const requestData = {
      title: data.title,
      description: data.description,
      price: data.price,
      images: data.images,
      category: data.category,
      condition: data.condition as 'new' | 'like-new' | 'good' | 'fair' | 'poor',
      status: data.status as 'available' | 'sold' | 'pending',
      seller: data.seller,
      location: data.location,
    }; 

    try {
      const response = await createProduct(token, requestData);

      if (response.success && response.product) {
        toast({
          title: 'Thành công!',
          description: 'Sản phẩm đã được tạo thành công',
          variant: 'default',
        });
        
        form.reset();
        
        onSuccess?.(response.product._id);
      } else {
        console.log('❌ Product creation failed');
        console.log('❌ Error message:', response.message);
        console.log('❌ Validation errors:', response.errors);
        
        toast({
          title: 'Lỗi',
          description: response.message || 'Không thể tạo sản phẩm',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: 'Đã xảy ra lỗi không xác định',
        variant: 'destructive',
      });
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    form.reset();
    resetCreateState();
    onCancel?.();
  };

  const getFieldError = (fieldName: string) => {
    return validationErrors[fieldName] || '';
  };

  const isLoading = isCreating || isSubmitting;

  return (
    <div className={className}>
      <Card className="w-full max-w-4xl mx-auto shadow-2xl border-0 bg-gradient-to-br from-white to-blue-50">
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl shadow-lg">
                <Plus className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Tạo sản phẩm mới
                </h1>
                <p className="text-gray-600 flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Chia sẻ sản phẩm của bạn với cộng đồng
                </p>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={handleCancel}
              disabled={isLoading}
              className="hover:bg-gray-50 border-gray-300"
            >
              <X className="h-4 w-4 mr-2" />
              Hủy
            </Button>
          </div>

          {successMessage && (
            <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl flex items-center gap-3 shadow-md">
              <div className="p-1 bg-green-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <span className="text-green-800 font-medium">{successMessage}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearSuccessMessage}
                className="ml-auto p-1 hover:bg-green-100"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}

          {createError && (
            <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl flex items-center gap-3 shadow-md">
              <div className="p-1 bg-red-100 rounded-lg">
                <AlertCircle className="h-5 w-5 text-red-600" />
              </div>
              <span className="text-red-800 font-medium">{createError}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearCreateError}
                className="ml-auto p-1 hover:bg-red-100"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-semibold">
                        Tiêu đề sản phẩm <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Nhập tiêu đề sản phẩm" 
                          disabled={isLoading}
                          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage className="text-red-600">{getFieldError('title')}</FormMessage>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-semibold">
                        Giá (VND) <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input 
                          type="text" 
                          placeholder="0" 
                          disabled={isLoading}
                          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          value={field.value ? field.value.toLocaleString('vi-VN') : ''}
                          onChange={(e) => {
                            const numericValue = e.target.value.replace(/[^\d]/g, '');
                            field.onChange(parseFloat(numericValue) || 0);
                          }}
                        />
                      </FormControl>
                      <FormMessage className="text-red-600">{getFieldError('price')}</FormMessage>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-semibold">
                      Mô tả sản phẩm <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <RichTextEditor
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Mô tả chi tiết sản phẩm của bạn..."
                        disabled={isLoading}
                        minHeight="150px"
                      />
                    </FormControl>
                    <FormDescription className="text-gray-600">
                      Mô tả chi tiết sản phẩm của bạn với định dạng văn bản phong phú
                    </FormDescription>
                    <FormMessage className="text-red-600">{getFieldError('description')}</FormMessage>
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-semibold">
                        Danh mục <span className="text-red-500">*</span>
                      </FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                        disabled={isLoading}
                      >
                        <FormControl>
                          <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                            <SelectValue placeholder="Chọn danh mục" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {PRODUCT_CATEGORIES.map((category) => (
                            <SelectItem key={category.value} value={category.value}>
                              {category.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-red-600">{getFieldError('category')}</FormMessage>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="condition"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-semibold">
                        Điều kiện <span className="text-red-500">*</span>
                      </FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                        disabled={isLoading}
                      >
                        <FormControl>
                          <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                            <SelectValue placeholder="Chọn điều kiện" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {PRODUCT_CONDITIONS.map((condition) => (
                            <SelectItem key={condition.value} value={condition.value}>
                              {condition.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-red-600">{getFieldError('condition')}</FormMessage>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-semibold">
                        Trạng thái <span className="text-red-500">*</span>
                      </FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                        disabled={isLoading}
                      >
                        <FormControl>
                          <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                            <SelectValue placeholder="Chọn trạng thái" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {PRODUCT_STATUS.map((status) => (
                            <SelectItem key={status.value} value={status.value}>
                              <Badge variant={status.value === 'available' ? 'default' : 'secondary'}>
                                {status.label}
                              </Badge>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-red-600">{getFieldError('status')}</FormMessage>
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="seller"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-semibold">
                        Người bán <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Tên của bạn" 
                          disabled={isLoading}
                          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage className="text-red-600">{getFieldError('seller')}</FormMessage>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-semibold">
                        Vị trí <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Thành phố, Quốc gia" 
                          disabled={isLoading}
                          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage className="text-red-600">{getFieldError('location')}</FormMessage>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="images"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-semibold">
                      Ảnh sản phẩm <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <FileUpload
                        value={field.value}
                        onChange={field.onChange}
                        maxFiles={5}
                        maxSize={5}
                        disabled={isLoading}
                        error={getFieldError('images')}
                      />
                    </FormControl>
                    <FormDescription className="text-gray-600">
                      Tải lên tối đa 5 ảnh (PNG, JPG, GIF tối đa 5MB mỗi ảnh)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 sm:flex-none bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg"
                >
                  {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  {isLoading ? 'Đang tạo sản phẩm...' : 'Tạo sản phẩm'}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </Card>
    </div>
  );
} 