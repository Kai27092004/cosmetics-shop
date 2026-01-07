import { clientAPI, adminAPI } from './api';
import { API_ENDPOINTS } from '../utils/constants';

export const categoryService = {
  // ==================== PUBLIC CATEGORY APIS ====================

  /**
   * Lấy tất cả danh mục
   * @returns {Promise<Array>} - Array of categories
   */
  getAllCategories: async () => {
    try {
      console.log('📂 [Category Service] Fetching all categories');
      
      const { data } = await clientAPI.get(API_ENDPOINTS.CATEGORIES);
      
      console.log(`✅ [Category Service] Fetched ${data.length} categories`);
      return data;
    } catch (error) {
      console.error('❌ [Category Service] Failed to fetch categories:', error.response?.data || error.message);
      throw error.response?.data || { message: error.message };
    }
  },

  /**
   * Lấy chi tiết một danh mục
   * @param {number} id - Category ID
   * @returns {Promise<object>} - Category data
   */
  getCategoryById: async (id) => {
    try {
      console.log('📂 [Category Service] Fetching category:', id);
      
      const { data } = await clientAPI.get(API_ENDPOINTS.CATEGORY_DETAIL(id));
      
      console.log('✅ [Category Service] Category fetched:', data.name);
      return data;
    } catch (error) {
      console.error('❌ [Category Service] Failed to fetch category:', error.response?.data || error.message);
      throw error.response?.data || { message: error.message };
    }
  },

  // ==================== ADMIN CATEGORY APIS ====================

  /**
   * Tạo danh mục mới (Admin only)
   * @param {object} categoryData - {name, description}
   * @returns {Promise<object>} - Created category
   */
  createCategory: async (categoryData) => {
    try {
      console.log('📂 [Category Service] Creating category:', categoryData.name);
      
      const { data } = await adminAPI.post(API_ENDPOINTS.CATEGORIES, categoryData);
      
      console.log('✅ [Category Service] Category created:', data.id);
      return data;
    } catch (error) {
      console.error('❌ [Category Service] Failed to create category:', error.response?.data || error.message);
      throw error.response?.data || { message: error.message };
    }
  },

  /**
   * Cập nhật danh mục (Admin only)
   * @param {number} id - Category ID
   * @param {object} categoryData - Updated data
   * @returns {Promise<object>} - Updated category
   */
  updateCategory: async (id, categoryData) => {
    try {
      console.log('📂 [Category Service] Updating category:', id);
      
      const { data } = await adminAPI.put(API_ENDPOINTS.CATEGORY_DETAIL(id), categoryData);
      
      console.log('✅ [Category Service] Category updated successfully');
      return data;
    } catch (error) {
      console.error('❌ [Category Service] Failed to update category:', error.response?.data || error.message);
      throw error.response?.data || { message: error.message };
    }
  },

  /**
   * Xóa danh mục (Admin only)
   * @param {number} id - Category ID
   * @returns {Promise<object>}
   */
  deleteCategory: async (id) => {
    try {
      console.log('📂 [Category Service] Deleting category:', id);
      
      const { data } = await adminAPI.delete(API_ENDPOINTS.CATEGORY_DETAIL(id));
      
      console.log('✅ [Category Service] Category deleted successfully');
      return data;
    } catch (error) {
      console.error('❌ [Category Service] Failed to delete category:', error.response?.data || error.message);
      throw error.response?.data || { message: error.message };
    }
  },
};

export default categoryService;