import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Product Store - Cache sản phẩm và categories
 * Giảm số lần gọi API, lưu filters khi user chuyển trang
 */
export const useProductStore = create(
  persist(
    (set, get) => ({
      // ==================== STATE ====================
      products: [],           // Cache danh sách sản phẩm
      categories: [],         // Cache danh sách categories
      selectedProduct: null,  // Sản phẩm đang xem chi tiết
      
      // Filters
      filters: {
        search: '',
        categoryId: '',
        sortBy: 'createdAt',
        minPrice: 0,
        maxPrice: 0,
      },

      // Pagination
      pagination: {
        page: 1,
        limit: 12,
        total: 0,
        totalPages: 0,
      },

      // ==================== ACTIONS ====================

      /**
       * Set danh sách sản phẩm
       * @param {Array} products
       */
      setProducts: (products) => {
        console.log('📦 [Product Store] Set products:', products. length);
        set({ products });
      },

      /**
       * Set danh sách categories
       * @param {Array} categories
       */
      setCategories: (categories) => {
        console.log('🏷️ [Product Store] Set categories:', categories.length);
        set({ categories });
      },

      /**
       * Set sản phẩm đang xem
       * @param {Object} product
       */
      setSelectedProduct: (product) => {
        console.log('👁️ [Product Store] Set selected product:', product?. name);
        set({ selectedProduct: product });
      },

      /**
       * Update filters
       * @param {Object} newFilters
       */
      updateFilters: (newFilters) => {
        console.log('🔍 [Product Store] Update filters:', newFilters);
        set((state) => ({
          filters:  { ...state.filters, ...newFilters },
        }));
      },

      /**
       * Clear filters
       */
      clearFilters: () => {
        console.log('🧹 [Product Store] Clear filters');
        set({
          filters: {
            search: '',
            categoryId: '',
            sortBy: 'createdAt',
            minPrice:  0,
            maxPrice:  0,
          },
        });
      },

      /**
       * Update pagination
       * @param {Object} paginationData
       */
      updatePagination: (paginationData) => {
        set((state) => ({
          pagination: { ...state.pagination, ... paginationData },
        }));
      },

      /**
       * Get product by ID từ cache
       * @param {number} id
       * @returns {Object|null}
       */
      getProductById: (id) => {
        const { products } = get();
        return products.find((p) => p.id === parseInt(id)) || null;
      },

      /**
       * Get category by ID từ cache
       * @param {number} id
       * @returns {Object|null}
       */
      getCategoryById: (id) => {
        const { categories } = get();
        return categories.find((c) => c.id === parseInt(id)) || null;
      },

      /**
       * Add hoặc update product trong cache
       * @param {Object} product
       */
      upsertProduct: (product) => {
        set((state) => {
          const index = state.products.findIndex((p) => p.id === product.id);
          if (index !== -1) {
            // Update existing
            const newProducts = [...state.products];
            newProducts[index] = product;
            return { products:  newProducts };
          } else {
            // Add new
            return { products: [...state.products, product] };
          }
        });
      },

      /**
       * Remove product từ cache
       * @param {number} id
       */
      removeProduct: (id) => {
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        }));
      },

      /**
       * Clear toàn bộ cache
       */
      clearCache: () => {
        console.log('🗑️ [Product Store] Clear cache');
        set({
          products: [],
          categories: [],
          selectedProduct: null,
        });
      },
    }),
    {
      name: 'product-storage', // localStorage key
      partialPersist: (state) => ({
        // Chỉ persist filters và categories (không persist products vì dễ outdated)
        filters: state. filters,
        categories: state. categories,
      }),
    }
  )
);

export default useProductStore;