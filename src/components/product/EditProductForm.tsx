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
  Edit3
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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

// Validation schema
const productSchema = z.object({
  title: z.string()
    .min(1, 'Tiêu đề là bắt buộc')
    .min(3, 'Tiêu đề phải có ít nhất 3 ký tự')
    .max(100, 'Tiêu đề không được vượt quá 100 ký tự'),
  description: z.string()
    .min(1, 'Mô tả là bắt buộc')
    .min(10, 'Mô tả phải có ít nhất 10 ký tự')
    .max(1000, 'Mô tả không được vượt quá 1000 ký tự'),
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
  
  // Zustand stores
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

  // Form setup
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

  // Load product data on component mount
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

  // Update form when product data is loaded
  useEffect(() => {
    if (currentProduct && currentProduct._id === productId) {
      // Handle seller field - extract string value if it's an object
      const sellerValue = typeof currentProduct.seller === 'object' 
        ? (currentProduct.seller as { name?: string; seller?: string })?.name || (currentProduct.seller as { name?: string; seller?: string })?.seller || JSON.stringify(currentProduct.seller)
        : currentProduct.seller || '';

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
  }, [currentProduct, productId, form]);

  // Handle form submission
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
        
        // Call success callback
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

  // Handle cancel
  const handleCancel = () => {
    form.reset();
    resetEditState();
    onCancel?.();
  };

  // Get field error from validation errors
  const getFieldError = (fieldName: string) => {
    return validationErrors[fieldName] || '';
  };

  const isFormLoading = isEditing || isSubmitting;

  // Show loading state during initial load
  if (isInitialLoad || (isLoading && !currentProduct)) {
    return (
      <div className={className}>
        <Card className="w-full max-w-4xl mx-auto">
          <div className="p-6">
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                <p className="text-gray-600">Đang tải dữ liệu sản phẩm...</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // Show error if product failed to load
  if (error && !currentProduct) {
    return (
      <div className={className}>
        <Card className="w-full max-w-4xl mx-auto">
          <div className="p-6">
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <AlertCircle className="h-8 w-8 mx-auto mb-4 text-red-500" />
                <p className="text-red-600 mb-4">{error}</p>
                <Button onClick={() => window.location.reload()}>
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
      <Card className="w-full max-w-4xl mx-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Edit3 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Chỉnh sửa sản phẩm</h2>
              <p className="text-gray-600">Cập nhật thông tin sản phẩm của bạn</p>
            </div>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-green-800">{successMessage}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearSuccessMessage}
                className="ml-auto p-1"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Error Message */}
          {editError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <span className="text-red-800">{editError}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearEditError}
                className="ml-auto p-1"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tiêu đề sản phẩm <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Nhập tiêu đề sản phẩm" 
                          disabled={isFormLoading}
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage>{getFieldError('title')}</FormMessage>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Giá (VND) <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="0" 
                          disabled={isFormLoading}
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage>{getFieldError('price')}</FormMessage>
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
                    <FormLabel>Mô tả sản phẩm <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Mô tả sản phẩm của bạn" 
                        className="min-h-[120px]"
                        disabled={isFormLoading}
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Mô tả chi tiết sản phẩm của bạn
                    </FormDescription>
                    <FormMessage>{getFieldError('description')}</FormMessage>
                  </FormItem>
                )}
              />

              {/* Category, Condition, Status */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Danh mục <span className="text-red-500">*</span></FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        value={field.value}
                        disabled={isFormLoading}
                      >
                        <FormControl>
                          <SelectTrigger>
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
                      <FormMessage>{getFieldError('category')}</FormMessage>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="condition"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Điều kiện <span className="text-red-500">*</span></FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        value={field.value}
                        disabled={isFormLoading}
                      >
                        <FormControl>
                          <SelectTrigger>
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
                      <FormMessage>{getFieldError('condition')}</FormMessage>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Trạng thái <span className="text-red-500">*</span></FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        value={field.value}
                        disabled={isFormLoading}
                      >
                        <FormControl>
                          <SelectTrigger>
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
                      <FormMessage>{getFieldError('status')}</FormMessage>
                    </FormItem>
                  )}
                />
              </div>

              {/* Seller and Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="seller"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Người bán <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Tên của bạn" 
                          disabled={isFormLoading}
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage>{getFieldError('seller')}</FormMessage>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vị trí <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Thành phố, Quốc gia" 
                          disabled={isFormLoading}
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage>{getFieldError('location')}</FormMessage>
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
                    <FormLabel>Ảnh sản phẩm <span className="text-red-500">*</span></FormLabel>
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
                    <FormDescription>
                      Tải lên tối đa 5 ảnh (PNG, JPG, GIF tối đa 5MB mỗi ảnh)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Form Actions */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
                <Button
                  type="submit"
                  disabled={isFormLoading}
                  className="flex-1 sm:flex-none"
                >
                  {isFormLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  {isFormLoading ? 'Đang cập nhật sản phẩm...' : 'Cập nhật sản phẩm'}
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isFormLoading}
                  className="flex-1 sm:flex-none"
                >
                  Hủy bỏ
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </Card>
    </div>
  );
} 