import { clientAPI, adminAPI } from './api';
import { API_ENDPOINTS } from '../utils/constants';

export const authService = {
  // ==================== USER AUTHENTICATION ====================

  /**
   * Đăng ký user mới
   * @param {object} userData - {fullName, email, password}
   * @returns {Promise<object>} - User data
   */
  register: async (userData) => {
    try {
      console.log('📝 [Auth Service] Registering user:', userData. email);
      
      const { data } = await clientAPI.post(API_ENDPOINTS.REGISTER, {
        fullName: userData.fullName,
        email: userData.email,
        password: userData.password,
      });

      console.log('✅ [Auth Service] Registration successful');
      return data;
    } catch (error) {
      console.error('❌ [Auth Service] Registration failed:', error. response?.data || error.message);
      throw error. response?.data || { message: error.message };
    }
  },

  /**
   * Đăng nhập user
   * @param {object} credentials - {email, password}
   * @returns {Promise<object>} - {user, token}
   */
  login: async (credentials) => {
    try {
      console.log('🔐 [Auth Service] Logging in user:', credentials.email);
      
      const { data } = await clientAPI.post(API_ENDPOINTS.LOGIN, {
        email: credentials.email,
        password: credentials.password,
      });

      // Backend trả về flat object với accessToken
      const token = data.accessToken;
      const user = {
        id: data.id,
        fullName: data.fullName,
        email: data.email,
        role: data.role,
        avatar: data.avatar
      };

      // Lưu token vào localStorage
      if (token) {
        localStorage.setItem('userToken', token);
        console.log('✅ [Auth Service] Token saved to localStorage');
      }

      console.log('✅ [Auth Service] Login successful:', user);
      return { user, token };
    } catch (error) {
      console.error('❌ [Auth Service] Login failed:', error.response?.data || error.message);
      throw error.response?.data || { message: error.message };
    }
  },

  /**
   * Đăng xuất user
   */
  logout: () => {
    console.log('👋 [Auth Service] Logging out user');
    localStorage.removeItem('userToken');
    localStorage.removeItem('user');
  },

  /**
   * Lấy thông tin user hiện tại
   * @returns {Promise<object>} - User data
   */
  getCurrentUser: async () => {
    try {
      console.log('👤 [Auth Service] Fetching current user info');
      
      const { data } = await clientAPI.get(API_ENDPOINTS. PROFILE);
      
      console.log('✅ [Auth Service] User info fetched:', data);
      return data;
    } catch (error) {
      console.error('❌ [Auth Service] Failed to fetch user info:', error. response?.data || error.message);
      throw error.response?.data || { message: error.message };
    }
  },

  /**
   * Cập nhật profile user
   * @param {object} profileData - {fullName, phone, address}
   * @returns {Promise<object>} - Updated user data
   */
  updateProfile: async (profileData) => {
    try {
      console.log('🔄 [Auth Service] Updating profile');
      
      const { data } = await clientAPI.put(API_ENDPOINTS.PROFILE, profileData);
      
      console. log('✅ [Auth Service] Profile updated successfully');
      return data;
    } catch (error) {
      console.error('❌ [Auth Service] Failed to update profile:', error.response?.data || error.message);
      throw error.response?. data || { message: error.message };
    }
  },

  /**
   * Đổi mật khẩu
   * @param {object} passwordData - {oldPassword, newPassword}
   * @returns {Promise<object>}
   */
  changePassword: async (passwordData) => {
    try {
      console.log('🔒 [Auth Service] Changing password');
      
      const { data } = await clientAPI.put(API_ENDPOINTS.CHANGE_PASSWORD, {
        oldPassword: passwordData. oldPassword,
        newPassword:  passwordData.newPassword,
      });
      
      console.log('✅ [Auth Service] Password changed successfully');
      return data;
    } catch (error) {
      console.error('❌ [Auth Service] Failed to change password:', error.response?.data || error.message);
      throw error. response?.data || { message: error.message };
    }
  },

  // ==================== ADMIN AUTHENTICATION ====================

  /**
   * Đăng nhập admin
   * @param {object} credentials - {email, password}
   * @returns {Promise<object>} - {user, token}
   */
  adminLogin: async (credentials) => {
    try {
      console.log('🔐 [Auth Service] Admin logging in:', credentials.email);
      
      const { data } = await adminAPI.post(API_ENDPOINTS.LOGIN, {
        email: credentials.email,
        password: credentials.password,
      });

      // Backend trả về flat object với accessToken
      const token = data.accessToken;
      const user = {
        id: data.id,
        fullName: data.fullName,
        email: data.email,
        role: data.role,
        avatar: data.avatar
      };

      // Kiểm tra role phải là admin
      if (user.role !== 'admin') {
        console.error('❌ [Auth Service] User is not an admin');
        throw new Error('Bạn không có quyền truy cập trang quản trị');
      }

      // Lưu token vào localStorage
      if (token) {
        localStorage.setItem('adminToken', token);
        console.log('✅ [Auth Service] Admin token saved to localStorage');
      }

      console.log('✅ [Auth Service] Admin login successful:', user);
      return { user, token };
    } catch (error) {
      console.error('❌ [Auth Service] Admin login failed:', error.response?.data || error.message);
      throw error.response?.data || { message: error.message };
    }
  },

  /**
   * Đăng xuất admin
   */
  adminLogout:  () => {
    console.log('👋 [Auth Service] Logging out admin');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('admin');
  },

  /**
   * Lấy thông tin admin hiện tại
   * @returns {Promise<object>} - Admin data
   */
  getCurrentAdmin: async () => {
    try {
      console.log('👤 [Auth Service] Fetching current admin info');
      
      const { data } = await adminAPI.get(API_ENDPOINTS.PROFILE);

      // Kiểm tra role phải là admin
      if (data. role !== 'admin') {
        console.error('❌ [Auth Service] User is not an admin');
        throw new Error('Unauthorized');
      }

      console.log('✅ [Auth Service] Admin info fetched:', data);
      return data;
    } catch (error) {
      console.error('❌ [Auth Service] Failed to fetch admin info:', error.response?.data || error.message);
      throw error.response?. data || { message: error.message };
    }
  },

  // ==================== PASSWORD RESET ====================

  /**
   * Quên mật khẩu - Gửi email reset
   * @param {string} email - Email người dùng
   * @returns {Promise<object>}
   */
  forgotPassword: async (email) => {
    try {
      console.log('📧 [Auth Service] Sending password reset email to:', email);
      
      const { data } = await clientAPI. post(API_ENDPOINTS. FORGOT_PASSWORD, { email });
      
      console. log('✅ [Auth Service] Password reset email sent');
      return data;
    } catch (error) {
      console.error('❌ [Auth Service] Failed to send reset email:', error.response?.data || error.message);
      throw error.response?.data || { message: error.message };
    }
  },

  /**
   * Reset mật khẩu
   * @param {string} token - Reset token từ email
   * @param {string} newPassword - Mật khẩu mới
   * @returns {Promise<object>}
   */
  resetPassword: async (token, newPassword) => {
    try {
      console.log('🔒 [Auth Service] Resetting password with token');
      
      const { data } = await clientAPI.post(API_ENDPOINTS.RESET_PASSWORD, {
        token,
        newPassword,
      });
      
      console.log('✅ [Auth Service] Password reset successful');
      return data;
    } catch (error) {
      console.error('❌ [Auth Service] Failed to reset password:', error.response?.data || error.message);
      throw error.response?.data || { message: error.message };
    }
  },

  /**
   * Verify reset token
   * @param {string} token - Reset token
   * @returns {Promise<object>}
   */
  verifyResetToken: async (token) => {
    try {
      console.log('🔍 [Auth Service] Verifying reset token');
      
      const { data } = await clientAPI.get(`/auth/verify-reset-token/${token}`);
      
      console.log('✅ [Auth Service] Token is valid');
      return data;
    } catch (error) {
      console.error('❌ [Auth Service] Token is invalid or expired');
      throw error.response?.data || { message: error.message };
    }
  },
};

export default authService;