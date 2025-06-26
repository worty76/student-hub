import { create } from 'zustand';
import { User } from '@/types/auth';
import { AdminService, AdminApiError } from '@/services/admin.service';

interface AdminState {
  users: User[];
  loading: boolean;
  error: string | null;
  deletingUserId: string | null;
}

interface AdminStore extends AdminState {
  fetchAllUsers: (token: string) => Promise<void>;
  deleteUser: (token: string, userId: string) => Promise<void>;
  clearError: () => void;
  setUserStatus: (userId: string, status: string) => void;
}

export const useAdminStore = create<AdminStore>((set, get) => ({
  users: [],
  loading: false,
  error: null,
  deletingUserId: null,

  fetchAllUsers: async (token: string) => {
    set({ loading: true, error: null });
    try {
      const users = await AdminService.getAllUsers(token);
      set({ 
        users, 
        loading: false, 
        error: null 
      });
    } catch (error) {
      if (error instanceof AdminApiError) {
        if (error.status === 401) {
          set({ 
            error: 'Bạn không có quyền truy cập', 
            loading: false,
            users: []
          });
        } else if (error.status === 403) {
          set({ 
            error: 'Quyền truy cập bị từ chối', 
            loading: false,
            users: []
          });
        } else {
          set({ 
            error: error.message, 
            loading: false,
            users: []
          });
        }
      } else {
        set({ 
          error: 'Lỗi tải người dùng', 
          loading: false,
          users: []
        });
      }
    }
  },

  deleteUser: async (token: string, userId: string) => {
    set({ deletingUserId: userId, error: null });
    try {
      await AdminService.deleteUser(token, userId);
      
      // Remove user from the list after successful deletion
      const { users } = get();
      const updatedUsers = users.filter(user => user._id !== userId);
      
      set({ 
        users: updatedUsers, 
        deletingUserId: null, 
        error: null 
      });
    } catch (error) {
      if (error instanceof AdminApiError) {
        set({ 
          error: error.message, 
          deletingUserId: null 
        });
      } else {
        set({ 
          error: 'Lỗi xóa người dùng', 
          deletingUserId: null 
        });
      }
      throw error; // Re-throw to allow component to handle it
    }
  },

  clearError: () => {
    set({ error: null });
  },

  setUserStatus: (userId: string, status: string) => {
    const { users } = get();
    const updatedUsers = users.map(user => 
      user._id === userId 
        ? { ...user, status } 
        : user
    );
    set({ users: updatedUsers });
  },
})); 