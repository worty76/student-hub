import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, CreateProductRequest, CreateProductResponse, EditProductRequest, EditProductResponse, DeleteProductResponse } from '@/types/product';
import { ProductService } from '@/services/product.service';

interface ProductState {
  // Current product being created/edited
  currentProduct: Product | null;
  
  // Loading states
  isLoading: boolean;
  isCreating: boolean;
  isEditing: boolean;
  isDeleting: boolean;
  
  // Error states
  error: string | null;
  createError: string | null;
  editError: string | null;
  deleteError: string | null;
  validationErrors: Record<string, string>;
  
  // Success state
  successMessage: string | null;
  
  // User products list
  userProducts: Product[];
  isLoadingUserProducts: boolean;
  userProductsError: string | null;
}

interface ProductActions {
  // Product creation, editing, and deletion
  createProduct: (token: string, productData: CreateProductRequest) => Promise<CreateProductResponse>;
  editProduct: (productId: string, token: string, productData: EditProductRequest) => Promise<EditProductResponse>;
  deleteProduct: (productId: string, token: string) => Promise<DeleteProductResponse>;
  
  // Product fetching
  loadProduct: (productId: string) => Promise<void>;
  loadUserProducts: (token: string) => Promise<void>;
  loadUserProductsByUserId: (userId: string, token?: string) => Promise<void>;
  
  // State management
  setCurrentProduct: (product: Product) => void;
  clearCurrentProduct: () => void;
  
  // Error management
  clearError: () => void;
  clearCreateError: () => void;
  clearEditError: () => void;
  clearDeleteError: () => void;
  clearValidationErrors: () => void;
  clearUserProductsError: () => void;
  
  // Success management
  clearSuccessMessage: () => void;
  
  // Reset states
  resetCreateState: () => void;
  resetEditState: () => void;
  resetAllState: () => void;
}

interface ProductStore extends ProductState, ProductActions {}

export const useProductStore = create<ProductStore>()(
  persist(
    (set, get) => ({
      // Initial State
      currentProduct: null,
      isLoading: false,
      isCreating: false,
      isEditing: false,
      isDeleting: false,
      error: null,
      createError: null,
      editError: null,
      deleteError: null,
      validationErrors: {},
      successMessage: null,
      userProducts: [],
      isLoadingUserProducts: false,
      userProductsError: null,

      // Actions
      createProduct: async (token: string, productData: CreateProductRequest) => {
        set({ 
          isCreating: true, 
          createError: null, 
          validationErrors: {},
          successMessage: null
        });
        
        try {
          const response = await ProductService.createProduct(token, productData);
          
          if (response.success && response.product) {
            // Creation succeeded
            set({ 
              currentProduct: response.product,
              isCreating: false,
              createError: null,
              validationErrors: {},
              successMessage: response.message || 'Product created successfully'
            });
            
            // Add to user products list if it exists
            const { userProducts } = get();
            set({
              userProducts: [response.product, ...userProducts]
            });
            
            return response;
          } else {
            // Validation errors
            set({ 
              isCreating: false,
              createError: response.message,
              validationErrors: response.errors || {}
            });
            return response;
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Lỗi khi đăng bán sản phẩm';
          set({ 
            createError: errorMessage,
            isCreating: false,
            validationErrors: {},
            successMessage: null
          });
          throw error;
        }
      },

      editProduct: async (productId: string, token: string, productData: EditProductRequest) => {
        set({ 
          isEditing: true, 
          editError: null, 
          validationErrors: {},
          successMessage: null
        });
        
        try {
          const response = await ProductService.editProduct(productId, token, productData);
          
          if (response.success && response.product) {
            // Edit succeeded
            set({ 
              currentProduct: response.product,
              isEditing: false,
              editError: null,
              validationErrors: {},
              successMessage: response.message || 'Sản phẩm đã được cập nhật thành công'
            });
            
            // Update in user products list if it exists
            const { userProducts } = get();
            const updatedProducts = userProducts.map(p => 
              p._id === response.product!._id ? response.product! : p
            );
            set({
              userProducts: updatedProducts
            });
            
            return response;
          } else {
            // Validation errors
            set({ 
              isEditing: false,
              editError: response.message,
              validationErrors: response.errors || {}
            });
            return response;
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Lỗi khi chỉnh sửa sản phẩm';
          set({ 
            editError: errorMessage,
            isEditing: false,
            validationErrors: {},
            successMessage: null
          });
          throw error;
        }
      },

      deleteProduct: async (productId: string, token: string) => {
        set({ 
          isDeleting: true, 
          deleteError: null, 
          successMessage: null
        });
        
        try {
          const response = await ProductService.deleteProduct(productId, token);
          
          // Remove product from user products list
          const { userProducts } = get();
          const updatedProducts = userProducts.filter(p => p._id !== productId);
          
          set({
            userProducts: updatedProducts,
            isDeleting: false,
            deleteError: null,
            successMessage: response.message || 'Sản phẩm đã được xóa thành công'
          });
          
          return response;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Lỗi khi xóa sản phẩm';
          set({ 
            deleteError: errorMessage,
            isDeleting: false,
            successMessage: null
          });
          throw error;
        }
      },

      loadProduct: async (productId: string) => {
        set({ isLoading: true, error: null });
        
        try {
          const product = await ProductService.getProduct(productId);
          set({ 
            currentProduct: product, 
            isLoading: false, 
            error: null 
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Lỗi khi lấy thông tin sản phẩm', 
            isLoading: false 
          });
          throw error;
        }
      },

      loadUserProducts: async (token: string) => {
        set({ isLoadingUserProducts: true, userProductsError: null });
        
        try {
          const products = await ProductService.getUserProducts(token);
          set({ 
            userProducts: products,
            isLoadingUserProducts: false,
            userProductsError: null
          });
        } catch (error) {
          set({
            userProductsError: error instanceof Error ? error.message : 'Lỗi khi lấy thông tin sản phẩm của người dùng',
            isLoadingUserProducts: false
          });
          throw error;
        }
      },

      loadUserProductsByUserId: async (userId: string, token?: string) => {
        set({ isLoadingUserProducts: true, userProductsError: null });
        
        try {
          const products = await ProductService.getUserProductsByUserId(userId, token);
          set({ 
            userProducts: products,
            isLoadingUserProducts: false,
            userProductsError: null
          });
        } catch (error) {
          set({
            userProductsError: error instanceof Error ? error.message : 'Lỗi khi lấy thông tin sản phẩm của người dùng',
            isLoadingUserProducts: false
          });
          throw error;
        }
      },

      setCurrentProduct: (product: Product) => {
        set({ currentProduct: product });
      },

      clearCurrentProduct: () => {
        set({ 
          currentProduct: null, 
          error: null, 
          isLoading: false
        });
      },

      clearError: () => {
        set({ error: null });
      },

      clearCreateError: () => {
        set({ createError: null, validationErrors: {} });
      },

      clearEditError: () => {
        set({ editError: null, validationErrors: {} });
      },

      clearDeleteError: () => {
        set({ deleteError: null });
      },

      clearValidationErrors: () => {
        set({ validationErrors: {} });
      },

      clearUserProductsError: () => {
        set({ userProductsError: null });
      },

      clearSuccessMessage: () => {
        set({ successMessage: null });
      },

      resetCreateState: () => {
        set({
          isCreating: false,
          createError: null,
          validationErrors: {},
          successMessage: null
        });
      },

      resetEditState: () => {
        set({
          isEditing: false,
          editError: null,
          validationErrors: {},
          successMessage: null
        });
      },

      resetAllState: () => {
        set({
          currentProduct: null,
          isLoading: false,
          isCreating: false,
          isEditing: false,
          isDeleting: false,
          error: null,
          createError: null,
          editError: null,
          deleteError: null,
          validationErrors: {},
          successMessage: null,
          userProducts: [],
          isLoadingUserProducts: false,
          userProductsError: null
        });
      },
      
    }),
    {
      name: 'product-storage',
      partialize: (state) => ({ 
        userProducts: state.userProducts 
      }),
      version: 1,
    }
  )
); 