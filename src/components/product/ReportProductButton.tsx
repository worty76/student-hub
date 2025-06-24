'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { useAuthStore } from '@/store/authStore';
import { ProductService } from '@/services/product.service';
import { ReportProductRequest, ReportProductError, REPORT_REASONS } from '@/types/product';
import { 
  Loader2, 
  Flag, 
  AlertTriangle,
  CheckCircle 
} from 'lucide-react';

interface ReportProductButtonProps {
  productId: string;
  productTitle: string;
  className?: string;
}

export default function ReportProductButton({
  productId,
  productTitle,
  className
}: ReportProductButtonProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { token, isAuthenticated } = useAuthStore();
  
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [reason, setReason] = useState<string>('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<{ reason?: string; description?: string }>({});
  const [reportSuccess, setReportSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const validateForm = (): boolean => {
    const newErrors: { reason?: string; description?: string } = {};
    
    if (!reason) {
      newErrors.reason = 'Vui lòng chọn lý do báo cáo';
    }
    
    if (!description.trim()) {
      newErrors.description = 'Mô tả chi tiết bắt buộc điền';
    } else if (description.trim().length < 10) {
      newErrors.description = 'Mô tả phải có ít nhất 10 ký tự';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleReportClick = () => {
    if (!isAuthenticated) {
      toast({
        variant: "destructive",
        title: "Yêu cầu đăng nhập",
        description: "Xin hãy đăng nhập để báo cáo sản phẩm"
      });
      router.push('/auth/login');
      return;
    }

    setIsOpen(true);
  };

  const handleConfirmReport = async () => {
    if (!validateForm() || !token) return;

    setIsLoading(true);
    setErrors({});

    try {
      const reportData: ReportProductRequest = {
        reason: reason as ReportProductRequest['reason'],
        description: description.trim()
      };

      const response = await ProductService.reportProduct(productId, token, reportData);

      if (response.success) {
        // Show success state in modal
        setReportSuccess(true);
        setSuccessMessage(response.message);
        setIsLoading(false);
        
        // Auto-close dialog and navigate after 2 seconds
        setTimeout(() => {
          setIsOpen(false);
          setReportSuccess(false);
          setReason('');
          setDescription('');
          setSuccessMessage('');
          
          // Show toast notification
          toast({
            title: "Báo cáo thành công!",
            description: response.message,
          });
        }, 2000);
      }
    } catch (error) {
      console.error('Report product error:', error);
      
      if (error && typeof error === 'object' && 'code' in error) {
        const reportError = error as ReportProductError;
        
        switch (reportError.code) {
          case 401:
            toast({
              variant: "destructive",
              title: "Không được phép",
              description: "Xin hãy đăng nhập lại để tiếp tục"
            });
            router.push('/auth/login');
            break;
          case 400:
            toast({
              variant: "destructive",
              title: "Báo cáo thất bại",
              description: "Dữ liệu nhập không hợp lệ"
            });
            break;
          case 404:
            toast({
              variant: "destructive",
              title: "Sản phẩm không tồn tại",
              description: "Sản phẩm bạn đang cố báo cáo không còn tồn tại"
            });
            break;
          default:
            toast({
              variant: "destructive",
              title: "Báo cáo thất bại",
              description: reportError.message || "Đã xảy ra lỗi không xác định"
            });
        }
      } else {
        toast({
          variant: "destructive",
          title: "Báo cáo thất bại",
          description: "Đã xảy ra lỗi không xác định. Xin hãy thử lại."
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsOpen(false);
    setReason('');
    setDescription('');
    setErrors({});
    setReportSuccess(false);
    setSuccessMessage('');
  };

//   const getReasonLabel = (value: string) => {
//     const reasonOption = REPORT_REASONS.find(r => r.value === value);
//     return reasonOption ? reasonOption.label : value;
//   };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          onClick={handleReportClick}
          variant="outline"
          size="sm"
          className={className}
        >
          <Flag className="h-4 w-4 mr-2" />
          Báo cáo
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[500px]">
        {reportSuccess ? (
          <>
            <DialogHeader>
              <div className="flex flex-col items-center text-center space-y-4">
                <CheckCircle className="h-16 w-16 text-green-500" />
                <DialogTitle className="text-2xl text-green-600">
                  Báo cáo thành công!
                </DialogTitle>
                <DialogDescription className="text-lg">
                  {successMessage}
                </DialogDescription>
              </div>
            </DialogHeader>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                Báo cáo sản phẩm
              </DialogTitle>
              <DialogDescription>
                Báo cáo sản phẩm này nếu bạn thấy có vấn đề. Chúng tôi sẽ xem xét và xử lý kịp thời.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* Product Info */}
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="font-medium text-gray-900">{productTitle}</div>
                <div className="text-sm text-gray-600">ID: {productId}</div>
              </div>

              {/* Report Reason */}
              <div className="space-y-2">
                <Label htmlFor="reason">
                  Lý do báo cáo *
                </Label>
                <Select
                  value={reason}
                  onValueChange={(value) => {
                    setReason(value);
                    if (errors.reason) {
                      setErrors(prev => ({ ...prev, reason: undefined }));
                    }
                  }}
                >
                  <SelectTrigger className={errors.reason ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Chọn lý do báo cáo" />
                  </SelectTrigger>
                  <SelectContent>
                    {REPORT_REASONS.map((reasonOption) => (
                      <SelectItem key={reasonOption.value} value={reasonOption.value}>
                        {reasonOption.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.reason && (
                  <p className="text-sm text-red-600">{errors.reason}</p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">
                  Mô tả chi tiết *
                </Label>
                <Textarea
                  id="description"
                  placeholder="Vui lòng mô tả chi tiết vấn đề bạn gặp phải với sản phẩm này..."
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    if (errors.description) {
                      setErrors(prev => ({ ...prev, description: undefined }));
                    }
                  }}
                  className={errors.description ? 'border-red-500' : ''}
                  rows={4}
                />
                {errors.description && (
                  <p className="text-sm text-red-600">{errors.description}</p>
                )}
                <p className="text-xs text-gray-500">
                  Tối thiểu 10 ký tự. Càng chi tiết càng giúp chúng tôi xử lý tốt hơn.
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading}
              >
                Hủy
              </Button>
              <Button
                type="button"
                onClick={handleConfirmReport}
                disabled={isLoading}
                variant="destructive"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <Flag className="h-4 w-4 mr-2" />
                    Gửi báo cáo
                  </>
                )}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
} 