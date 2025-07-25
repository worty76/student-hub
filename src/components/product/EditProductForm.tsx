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
  Edit3,
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

const stripHtmlTags = (html: string): string => {
  if (typeof window === 'undefined') {
    return html.replace(/<[^>]*>/g, '').trim();
  }
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || '';
};

// Validation schema
const productSchema = z.object({
  title: z.string()
    .min(1, 'Tiêu đề là bắt buộc')
    .min(3, 'Tiêu đề phải có ít nhất 3 ký tự')
    .max(100, 'Tiêu đề không được vượt quá 100 ký tự'),
  description: z.string()
    .min(1, 'Mô tả là bắt buộc')
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

interface EditProductFormProps {
  productId: string;
  onSuccess?: (productId: string) => void;
  onCancel?: () => void;
  className?: string;
}

export function EditProductForm({ 
  productId,
  onSuccess, 
  onCancel, 
  className 
}: EditProductFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  
  const {
    currentProduct,
    isLoading,
    isEditing,
    error,
    editError,
    validationErrors,
    successMessage,
    loadProduct,
    editProduct,
    clearEditError,
    clearSuccessMessage,
    resetEditState
  } = useProductStore();

  const { user, token } = useAuthStore();

  useEffect(() => {
    resetEditState();
  }, [resetEditState]);

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
    const loadProductData = async () => {
      if (!productId) return;
      
      try {
        await loadProduct(productId);
      } catch (error) {
        console.error('Failed to load product:', error);
        toast({
          title: 'Lỗi',
          description: 'Không thể tải dữ liệu sản phẩm',
          variant: 'destructive',
        });
      } finally {
        setIsInitialLoad(false);
      }
    };

    loadProductData();
  }, [productId, loadProduct, toast]);

  useEffect(() => {
    if (currentProduct && currentProduct._id === productId) {
      const sellerValue = typeof currentProduct.seller === 'object' 
        ? (currentProduct.seller as { name?: string; seller?: string })?.name || (currentProduct.seller as { name?: string; seller?: string })?.seller || JSON.stringify(currentProduct.seller)
        : currentProduct.seller || '';

      // // Use currentProduct location if it's valid and not "System", otherwise fall back to user location
      // const locationValue = currentProduct.location && currentProduct.location !== 'System' 
      //   ? currentProduct.location 
      //   : user?.location || currentProduct.location || '';

      form.reset({
        title: currentProduct.title,
        description: currentProduct.description,
        price: currentProduct.price,
        images: currentProduct.images,
        category: currentProduct.category,
        condition: currentProduct.condition,
        status: currentProduct.status,
        seller: sellerValue,
        location: currentProduct.location,
      });
    }
  }, [currentProduct, productId, form, user]);

  const onSubmit = async (data: ProductFormValues) => {
    if (!token) {
      toast({
        title: 'Lỗi xác thực',
        description: 'Vui lòng đăng nhập để chỉnh sửa sản phẩm',
        variant: 'destructive',
      });
      return;
    }

    if (!currentProduct) {
      toast({
        title: 'Lỗi',
        description: 'Không thể tải dữ liệu sản phẩm',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    clearEditError();
    clearSuccessMessage();

    try {
      const response = await editProduct(productId, token, {
        _id: currentProduct._id,
        title: data.title,
        description: data.description,
        price: data.price,
        images: data.images,
        category: data.category,
        condition: data.condition as 'new' | 'like-new' | 'good' | 'fair' | 'poor',
        status: data.status as 'available' | 'sold' | 'pending',
        seller: data.seller,
        location: data.location,
      });

      if (response.success && response.product) {
        toast({
          title: 'Thành công!',
          description: 'Sản phẩm đã được cập nhật thành công',
          variant: 'default',
        });
        
        onSuccess?.(response.product._id);
      } else {
        toast({
          title: 'Lỗi',
          description: response.message || 'Không thể cập nhật sản phẩm',
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
    resetEditState();
    onCancel?.();
  };

  const getFieldError = (fieldName: string) => {
    return validationErrors[fieldName] || '';
  };

  const isFormLoading = isEditing || isSubmitting;

  if (isInitialLoad || (isLoading && !currentProduct)) {
    return (
      <div className={className}>
        <Card className="w-full max-w-4xl mx-auto bg-white rounded-2xl border border-gray-200 shadow-sm">
          <div className="p-4 sm:p-6">
            <div className="flex items-center justify-center py-8 sm:py-12">
              <div className="text-center">
                <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin mx-auto mb-3 sm:mb-4 text-blue-600" />
                <p className="text-sm sm:text-base text-gray-600">Đang tải dữ liệu sản phẩm...</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (error && !currentProduct) {
    return (
      <div className={className}>
        <Card className="w-full max-w-4xl mx-auto bg-white rounded-2xl border border-gray-200 shadow-sm">
          <div className="p-4 sm:p-6">
            <div className="flex items-center justify-center py-8 sm:py-12">
              <div className="text-center max-w-md mx-auto">
                <AlertCircle className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-3 sm:mb-4 text-red-500" />
                <p className="text-sm sm:text-base text-red-600 mb-3 sm:mb-4 px-4">{error}</p>
                <Button onClick={() => window.location.reload()} size="sm">
                  Thử lại
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className={className}>
      <Card className="w-full max-w-4xl mx-auto shadow-2xl border-0 bg-gradient-to-br from-white to-blue-50 rounded-2xl">
        <div className="p-4 sm:p-6 lg:p-8">
          {/* Header Section - Mobile Optimized */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                <Edit3 className="h-5 w-5 sm:h-7 sm:w-7 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Chỉnh sửa sản phẩm
                </h1>
                <p className="text-sm sm:text-base text-gray-600 flex items-center gap-2">
                  <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />
                  Cập nhật thông tin sản phẩm của bạn
                </p>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={handleCancel}
              disabled={isFormLoading}
              className="w-full sm:w-auto hover:bg-gray-50 border-gray-300 text-sm"
              size="sm"
            >
              <X className="h-4 w-4 mr-2" />
              Hủy
            </Button>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl flex items-center gap-3 shadow-md">
              <div className="p-1 bg-green-100 rounded-lg">
                <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
              </div>
              <span className="text-sm sm:text-base text-green-800 font-medium flex-1">{successMessage}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearSuccessMessage}
                className="p-1 hover:bg-green-100 flex-shrink-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Error Message */}
          {editError && (
            <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl flex items-center gap-3 shadow-md">
              <div className="p-1 bg-red-100 rounded-lg">
                <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-600" />
              </div>
              <span className="text-sm sm:text-base text-red-800 font-medium flex-1">{editError}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearEditError}
                className="p-1 hover:bg-red-100 flex-shrink-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 sm:space-y-8">
              {/* Title and Price Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm sm:text-base text-gray-700 font-semibold">
                        Tiêu đề sản phẩm <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Nhập tiêu đề sản phẩm" 
                          disabled={isFormLoading}
                          className="text-sm sm:text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage className="text-sm text-red-600">{getFieldError('title')}</FormMessage>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm sm:text-base text-gray-700 font-semibold">
                        Giá (VND) <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input 
                          type="text" 
                          placeholder="0" 
                          disabled={isFormLoading}
                          className="text-sm sm:text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          value={field.value ? field.value.toLocaleString('vi-VN') : ''}
                          onChange={(e) => {
                            const numericValue = e.target.value.replace(/[^\d]/g, '');
                            field.onChange(parseFloat(numericValue) || 0);
                          }}
                        />
                      </FormControl>
                      <FormMessage className="text-sm text-red-600">{getFieldError('price')}</FormMessage>
                    </FormItem>
                  )}
                />
              </div>

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm sm:text-base text-gray-700 font-semibold">
                      Mô tả sản phẩm <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <RichTextEditor
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Mô tả chi tiết sản phẩm của bạn..."
                        disabled={isFormLoading}
                        minHeight="120px"
                      />
                    </FormControl>
                    <FormDescription className="text-xs sm:text-sm text-gray-600">
                      Mô tả chi tiết sản phẩm của bạn với định dạng văn bản phong phú
                    </FormDescription>
                    <FormMessage className="text-sm text-red-600">{getFieldError('description')}</FormMessage>
                  </FormItem>
                )}
              />

              {/* Category, Condition, Status Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm sm:text-base text-gray-700 font-semibold">
                        Danh mục <span className="text-red-500">*</span>
                      </FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        value={field.value}
                        disabled={isFormLoading}
                      >
                        <FormControl>
                          <SelectTrigger className="text-sm sm:text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500">
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
                      <FormMessage className="text-sm text-red-600">{getFieldError('category')}</FormMessage>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="condition"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm sm:text-base text-gray-700 font-semibold">
                        Điều kiện <span className="text-red-500">*</span>
                      </FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        value={field.value}
                        disabled={isFormLoading}
                      >
                        <FormControl>
                          <SelectTrigger className="text-sm sm:text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500">
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
                      <FormMessage className="text-sm text-red-600">{getFieldError('condition')}</FormMessage>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2 lg:col-span-1">
                      <FormLabel className="text-sm sm:text-base text-gray-700 font-semibold">
                        Trạng thái <span className="text-red-500">*</span>
                      </FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        value={field.value}
                        disabled={isFormLoading}
                      >
                        <FormControl>
                          <SelectTrigger className="text-sm sm:text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500">
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
                      <FormMessage className="text-sm text-red-600">{getFieldError('status')}</FormMessage>
                    </FormItem>
                  )}
                />
              </div>

              {/* Seller and Location Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <FormField
                  control={form.control}
                  name="seller"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm sm:text-base text-gray-700 font-semibold">
                        Người bán <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Tên của bạn" 
                          disabled={isFormLoading}
                          className="text-sm sm:text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage className="text-sm text-red-600">{getFieldError('seller')}</FormMessage>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm sm:text-base text-gray-700 font-semibold">
                        Vị trí <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Thành phố, Quốc gia" 
                          disabled={isFormLoading}
                          className="text-sm sm:text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage className="text-sm text-red-600">{getFieldError('location')}</FormMessage>
                    </FormItem>
                  )}
                />
              </div>

              {/* Images */}
              <FormField
                control={form.control}
                name="images"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm sm:text-base text-gray-700 font-semibold">
                      Ảnh sản phẩm <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <FileUpload
                        value={field.value}
                        onChange={field.onChange}
                        maxFiles={5}
                        maxSize={5}
                        disabled={isFormLoading}
                        error={getFieldError('images')}
                      />
                    </FormControl>
                    <FormDescription className="text-xs sm:text-sm text-gray-600">
                      Tải lên tối đa 5 ảnh (PNG, JPG, JPEG tối đa 5MB mỗi ảnh)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6 border-t border-gray-200">
                <Button
                  type="submit"
                  disabled={isFormLoading}
                  className="w-full sm:w-auto sm:flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg text-sm sm:text-base"
                  size="default"
                >
                  {isFormLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  {isFormLoading ? 'Đang cập nhật sản phẩm...' : 'Cập nhật sản phẩm'}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </Card>
    </div>
  );
} 