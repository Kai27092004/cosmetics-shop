import { clientAPI, adminAPI } from './api';
import { API_ENDPOINTS } from '../utils/constants';

export const productService = {
  // ==================== PUBLIC PRODUCT APIS ====================

  /**
   * Lấy tất cả sản phẩm (có filter, search, pagination)
   * @param {object} params - {categoryId, search, page, limit, sortBy}
   * @returns {Promise<Array>} - Array of products
   */
  getAllProducts: async (params = {}) => {
    try {
      console.log('📦 [Product Service] Fetching products with params:', params);
      
      const { data } = await clientAPI.get(API_ENDPOINTS. PRODUCTS, { params });
      
      console.log(`✅ [Product Service] Fetched ${data.length} products`);
      return data;
    } catch (error) {
      console.error('❌ [Product Service] Failed to fetch products:', error.response?.data || error.message);
      throw error. response?.data || { message: error.message };
    }
  },

  /**
   * Lấy chi tiết một sản phẩm
   * @param {number} id - Product ID
   * @returns {Promise<object>} - Product data
   */
  getProductById:  async (id) => {
    try {
      console.log('📦 [Product Service] Fetching product:', id);
      
      const { data } = await clientAPI.get(API_ENDPOINTS.PRODUCT_DETAIL(id));
      
      console.log('✅ [Product Service] Product fetched:', data. name);
      return data;
    } catch (error) {
      console.error('❌ [Product Service] Failed to fetch product:', error.response?.data || error. message);
      throw error.response?.data || { message: error. message };
    }
  },

  /**
   * Lấy sản phẩm theo danh mục
   * @param {number} categoryId - Category ID
   * @param {object} params - {page, limit, sortBy}
   * @returns {Promise<Array>} - Array of products
   */
  getProductsByCategory: async (categoryId, params = {}) => {
    try {
      console.log('📦 [Product Service] Fetching products by category:', categoryId);
      
      const { data } = await clientAPI.get(API_ENDPOINTS.PRODUCTS, {
        params: { categoryId, ...params },
      });
      
      console.log(`✅ [Product Service] Fetched ${data.length} products in category`);
      return data;
    } catch (error) {
      console.error('❌ [Product Service] Failed to fetch products by category:', error.response?.data || error.message);
      throw error.response?.data || { message: error.message };
    }
  },

  /**
   * Tìm kiếm sản phẩm
   * @param {string} searchTerm - Search keyword
   * @param {object} params - {categoryId, page, limit}
   * @returns {Promise<Array>} - Array of products
   */
  searchProducts: async (searchTerm, params = {}) => {
    try {
      console.log('🔍 [Product Service] Searching products:', searchTerm);
      
      const { data } = await clientAPI.get(API_ENDPOINTS.PRODUCTS, {
        params: { search: searchTerm, ...params },
      });
      
      console.log(`✅ [Product Service] Found ${data.length} products`);
      return data;
    } catch (error) {
      console.error('❌ [Product Service] Search failed:', error.response?.data || error.message);
      throw error.response?.data || { message: error.message };
    }
  },

  // ==================== ADMIN PRODUCT APIS ====================

  /**
   * Tạo sản phẩm mới (Admin only)
   * @param {object} productData - Product information
   * @returns {Promise<object>} - Created product
   */
  createProduct: async (productData) => {
    try {
      console.log('📦 [Product Service] Creating product:', productData. name);
      
      const { data } = await adminAPI.post(API_ENDPOINTS.PRODUCTS, productData);
      
      console.log('✅ [Product Service] Product created:', data.id);
      return data;
    } catch (error) {
      console.error('❌ [Product Service] Failed to create product:', error.response?.data || error. message);
      throw error.response?.data || { message: error. message };
    }
  },

  /**
   * Cập nhật sản phẩm (Admin only)
   * @param {number} id - Product ID
   * @param {object} productData - Updated product data
   * @returns {Promise<object>} - Updated product
   */
  updateProduct: async (id, productData) => {
    try {
      console. log('📦 [Product Service] Updating product:', id);
      
      const { data } = await adminAPI.put(API_ENDPOINTS.PRODUCT_DETAIL(id), productData);
      
      console.log('✅ [Product Service] Product updated successfully');
      return data;
    } catch (error) {
      console.error('❌ [Product Service] Failed to update product:', error.response?.data || error. message);
      throw error.response?.data || { message: error. message };
    }
  },

  /**
   * Xóa sản phẩm (Admin only)
   * @param {number} id - Product ID
   * @returns {Promise<object>}
   */
  deleteProduct:  async (id) => {
    try {
      console.log('📦 [Product Service] Deleting product:', id);
      
      const { data } = await adminAPI.delete(API_ENDPOINTS.PRODUCT_DETAIL(id));
      
      console. log('✅ [Product Service] Product deleted successfully');
      return data;
    } catch (error) {
      console.error('❌ [Product Service] Failed to delete product:', error.response?. data || error.message);
      throw error.response?.data || { message: error.message };
    }
  },
};

export default productService;