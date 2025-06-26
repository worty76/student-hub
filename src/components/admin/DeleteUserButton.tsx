'use client';

import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DeleteConfirmationDialog } from '@/components/ui/delete-confirmation-dialog';
import { useAdminStore } from '@/store/adminStore';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';
import { User } from '@/types/auth';

interface DeleteUserButtonProps {
  user: User;
  variant?: 'icon' | 'button';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export function DeleteUserButton({ user, variant = 'icon', size = 'sm' }: DeleteUserButtonProps) {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const { token } = useAuthStore();
  const { deleteUser, deletingUserId } = useAdminStore();

  const isLoading = deletingUserId === user._id;

  const handleDeleteClick = () => {
    setShowConfirmDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (!token) {
      toast.error('Không có token xác thực');
      return;
    }

    try {
      await deleteUser(token, user._id);
      toast.success('Xóa người dùng thành công');
      setShowConfirmDialog(false);
    } catch (error: unknown) {
      // Error handling based on the response codes
      const apiError = error as { status?: number; message?: string };
      if (apiError?.status === 401) {
        toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        // Optionally redirect to login
      } else if (apiError?.status === 403) {
        toast.error('Không có quyền admin để xóa người dùng');
      } else if (apiError?.status === 404) {
        toast.error('Không tìm thấy người dùng');
      } else {
        toast.error(apiError?.message || 'Lỗi khi xóa người dùng');
      }
    }
  };

  const handleCloseDialog = () => {
    if (!isLoading) {
      setShowConfirmDialog(false);
    }
  };

  // Prevent deleting admin users or the current user (additional safety)
  const canDelete = user.role !== 'admin' && user._id !== useAuthStore.getState().user?._id;

  if (!canDelete) {
    return null; // Don't show delete button for admin users or current user
  }

  if (variant === 'icon') {
    return (
      <>
        <Button
          onClick={handleDeleteClick}
          variant="ghost"
          size={size}
          disabled={isLoading}
          className="text-red-600 hover:text-red-800 hover:bg-red-50 p-1 h-8 w-8"
          title="Xóa người dùng"
        >
          {isLoading ? (
            <div className="animate-spin h-4 w-4 border-2 border-red-600 border-t-transparent rounded-full" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
        </Button>

        <DeleteConfirmationDialog
          isOpen={showConfirmDialog}
          onClose={handleCloseDialog}
          onConfirm={handleConfirmDelete}
          isLoading={isLoading}
          title="Xóa người dùng"
          message={`Bạn có chắc chắn muốn xóa người dùng "${user.name}"?\n\nHành động này sẽ:\n• Xóa vĩnh viễn tài khoản người dùng\n• Xóa tất cả dữ liệu liên quan\n• Không thể hoàn tác\n\nVui lòng xác nhận để tiếp tục.`}
          confirmText="Xóa người dùng"
          cancelText="Hủy"
        />
      </>
    );
  }

  return (
    <>
      <Button
        onClick={handleDeleteClick}
        variant="destructive"
        size={size}
        disabled={isLoading}
        className="flex items-center gap-2"
      >
        {isLoading ? (
          <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
        ) : (
          <Trash2 className="h-4 w-4" />
        )}
        {isLoading ? 'Đang xóa...' : 'Xóa'}
      </Button>

      <DeleteConfirmationDialog
        isOpen={showConfirmDialog}
        onClose={handleCloseDialog}
        onConfirm={handleConfirmDelete}
        isLoading={isLoading}
        title="Xóa người dùng"
        message={`Bạn có chắc chắn muốn xóa người dùng "${user.name}"?\n\nHành động này sẽ:\n• Xóa vĩnh viễn tài khoản người dùng\n• Xóa tất cả dữ liệu liên quan\n• Không thể hoàn tác\n\nVui lòng xác nhận để tiếp tục.`}
        confirmText="Xóa người dùng"
        cancelText="Hủy"
      />
    </>
  );
} 