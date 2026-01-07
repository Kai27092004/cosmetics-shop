import { clientAPI, adminAPI } from './api';
import { API_ENDPOINTS } from '../utils/constants';

export const userService = {
  // ==================== USER PROFILE APIS ====================

  /**
   * Lấy thông tin profile người dùng đang đăng nhập
   * @returns {Promise<object>} - User profile data
   */
  getProfile: async () => {
    try {
      console.log('👤 [User Service] Fetching user profile');
      
      const { data } = await clientAPI.get(API_ENDPOINTS.PROFILE);
      
      console.log('✅ [User Service] Profile fetched:', data.fullName);
      return data;
    } catch (error) {
      console.error('❌ [User Service] Failed to fetch profile:', error.response?.data || error.message);
      throw error.response?.data || { message: error.message };
    }
  },

  /**
   * Cập nhật profile người dùng
   * @param {object} userData - Updated user data
   * @returns {Promise<object>} - Updated user profile
   */
  updateProfile: async (userData) => {
    try {
      console.log('👤 [User Service] Updating user profile');
      
      const { data } = await clientAPI.put(API_ENDPOINTS.PROFILE, userData);
      
      console.log('✅ [User Service] Profile updated successfully');
      return data;
    } catch (error) {
      console.error('❌ [User Service] Failed to update profile:', error.response?.data || error.message);
      throw error.response?.data || { message: error.message };
    }
  },

  /**
   * Đổi mật khẩu
   * @param {object} passwordData - {currentPassword, newPassword}
   * @returns {Promise<object>}
   */
  changePassword: async (passwordData) => {
    try {
      console.log('👤 [User Service] Changing password');
      
      const { data } = await clientAPI.put(API_ENDPOINTS.CHANGE_PASSWORD, passwordData);
      
      console.log('✅ [User Service] Password changed successfully');
      return data;
    } catch (error) {
      console.error('❌ [User Service] Failed to change password:', error.response?.data || error.message);
      throw error.response?.data || { message: error.message };
    }
  },

  // ==================== ADMIN USER APIS ====================

  /**
   * Lấy danh sách tất cả người dùng (Admin only)
   * @param {object} filters - {search, role, sortBy}
   * @returns {Promise<Array>} - Array of users
   */
  getAllUsers: async (filters = {}) => {
    try {
      console.log('👥 [User Service] Fetching all users with filters:', filters);
      
      const { data } = await adminAPI.get('/users/admin/all', { params: filters });
      
      console.log(`✅ [User Service] Fetched ${data.length} users`);
      return data;
    } catch (error) {
      console.error('❌ [User Service] Failed to fetch users:', error.response?.data || error.message);
      throw error.response?.data || { message: error.message };
    }
  },

  /**
   * Lấy thống kê người dùng (Admin only)
   * @returns {Promise<object>} - User statistics
   */
  getUserStats: async () => {
    try {
      console.log('📊 [User Service] Fetching user stats');
      
      const { data } = await adminAPI.get('/users/admin/stats');
      
      console.log('✅ [User Service] User stats fetched');
      return data;
    } catch (error) {
      console.error('❌ [User Service] Failed to fetch user stats:', error.response?.data || error.message);
      throw error.response?.data || { message: error.message };
    }
  },

  /**
   * Tạo người dùng mới (Admin only)
   * @param {object} userData - User data to create
   * @returns {Promise<object>} - Created user
   */
  createUser: async (userData) => {
    try {
      console.log('👤 [User Service] Creating new user:', userData.email);
      
      const { data } = await adminAPI.post('/users/admin/create', userData);
      
      console.log('✅ [User Service] User created:', data.id);
      return data;
    } catch (error) {
      console.error('❌ [User Service] Failed to create user:', error.response?.data || error.message);
      throw error.response?.data || { message: error.message };
    }
  },

  /**
   * Cập nhật thông tin người dùng (Admin only)
   * @param {number} userId - User ID
   * @param {object} userData - Updated user data
   * @returns {Promise<object>} - Updated user
   */
  updateUser: async (userId, userData) => {
    try {
      console.log('👤 [User Service] Updating user:', userId);
      
      const { data } = await adminAPI.put(`/users/admin/${userId}`, userData);
      
      console.log('✅ [User Service] User updated successfully');
      return data;
    } catch (error) {
      console.error('❌ [User Service] Failed to update user:', error.response?.data || error.message);
      throw error.response?.data || { message: error.message };
    }
  },

  /**
   * Xóa người dùng (Admin only)
   * @param {number} userId - User ID
   * @returns {Promise<object>}
   */
  deleteUser: async (userId) => {
    try {
      console.log('👤 [User Service] Deleting user:', userId);
      
      const { data } = await adminAPI.delete(`/users/admin/${userId}`);
      
      console.log('✅ [User Service] User deleted successfully');
      return data;
    } catch (error) {
      console.error('❌ [User Service] Failed to delete user:', error.response?.data || error.message);
      throw error.response?.data || { message: error.message };
    }
  },
};

export default userService;
