import { useCallback } from 'react';
import { useAuthStore } from '../store/authStore';
import authService from '../services/authService';
import socketService from '../services/socketService';
import { useNavigate } from 'react-router-dom';

/**
 * Custom hook để xử lý authentication
 * @returns {object} - Auth methods và state
 */
export function useAuth() {
  const navigate = useNavigate();
  
  const {
    user,
    admin,
    isAuthenticated,
    isAdmin,
    loginUser,
    loginAdmin,
    logoutUser,
    logoutAdmin,
    updateUser,
    updateAdmin,
  } = useAuthStore();

  /**
   * Đăng ký user mới
   */
  const register = useCallback(async (userData) => {
    try {
      console.log('📝 [useAuth] Registering user.. .');
      
      const response = await authService. register(userData);
      
      console.log('✅ [useAuth] Registration successful');
      return { success: true, data: response };
    } catch (error) {
      console.error('❌ [useAuth] Registration failed:', error);
      return { 
        success: false, 
        error: error.message || 'Đăng ký thất bại' 
      };
    }
  }, []);

  /**
   * Đăng nhập user
   */
  const login = useCallback(async (credentials) => {
    try {
      console. log('🔐 [useAuth] Logging in.. .');
      
      const response = await authService.login(credentials);
      
      // Lưu vào store
      loginUser(response.user, response.token);
      
      // Kết nối WebSocket
      socketService.connect(response.token);
      socketService.joinUserRoom(response. user.id);
      socketService.joinRoleRoom('customer');
      
      console. log('✅ [useAuth] Login successful');
      return { success: true, data: response };
    } catch (error) {
      console.error('❌ [useAuth] Login failed:', error);
      return { 
        success: false, 
        error: error.message || 'Đăng nhập thất bại' 
      };
    }
  }, [loginUser]);

  /**
   * Đăng nhập admin
   */
  const adminLogin = useCallback(async (credentials) => {
    try {
      console.log('🔐 [useAuth] Admin logging in...');
      
      const response = await authService.adminLogin(credentials);
      
      // Lưu vào store
      loginAdmin(response.user, response.token);
      
      // Kết nối WebSocket
      socketService.connect(response.token);
      socketService.joinUserRoom(response.user.id);
      socketService. joinRoleRoom('admin');
      
      console.log('✅ [useAuth] Admin login successful');
      return { success:  true, data: response };
    } catch (error) {
      console.error('❌ [useAuth] Admin login failed:', error);
      return { 
        success: false, 
        error: error.message || 'Đăng nhập admin thất bại' 
      };
    }
  }, [loginAdmin]);

  /**
   * Đăng xuất
   */
  const logout = useCallback(() => {
    console.log('👋 [useAuth] Logging out...');
    
    if (isAdmin) {
      authService.adminLogout();
      logoutAdmin();
    } else {
      authService.logout();
      logoutUser();
    }
    
    // Ngắt WebSocket
    socketService.disconnect();
    
    // Redirect về trang login
    navigate(isAdmin ? '/admin/login' : '/login');
    
    console.log('✅ [useAuth] Logout successful');
  }, [isAdmin, logoutUser, logoutAdmin, navigate]);

  /**
   * Cập nhật profile
   */
  const updateProfile = useCallback(async (profileData) => {
    try {
      console.log('🔄 [useAuth] Updating profile...');
      
      const response = await authService.updateProfile(profileData);
      
      // Cập nhật store
      if (isAdmin) {
        updateAdmin(response);
      } else {
        updateUser(response);
      }
      
      console.log('✅ [useAuth] Profile updated');
      return { success: true, data: response };
    } catch (error) {
      console.error('❌ [useAuth] Update profile failed:', error);
      return { 
        success: false, 
        error: error.message || 'Cập nhật profile thất bại' 
      };
    }
  }, [isAdmin, updateUser, updateAdmin]);

  /**
   * Đổi mật khẩu
   */
  const changePassword = useCallback(async (passwordData) => {
    try {
      console.log('🔒 [useAuth] Changing password...');
      
      const response = await authService.changePassword(passwordData);
      
      console.log('✅ [useAuth] Password changed');
      return { success: true, data: response };
    } catch (error) {
      console.error('❌ [useAuth] Change password failed:', error);
      return { 
        success: false, 
        error: error.message || 'Đổi mật khẩu thất bại' 
      };
    }
  }, []);

  /**
   * Quên mật khẩu
   */
  const forgotPassword = useCallback(async (email) => {
    try {
      console.log('📧 [useAuth] Sending reset password email...');
      
      const response = await authService.forgotPassword(email);
      
      console.log('✅ [useAuth] Reset email sent');
      return { success:  true, data: response };
    } catch (error) {
      console.error('❌ [useAuth] Forgot password failed:', error);
      return { 
        success: false, 
        error: error.message || 'Gửi email thất bại' 
      };
    }
  }, []);

  /**
   * Reset mật khẩu
   */
  const resetPassword = useCallback(async (token, newPassword) => {
    try {
      console.log('🔒 [useAuth] Resetting password...');
      
      const response = await authService.resetPassword(token, newPassword);
      
      console.log('✅ [useAuth] Password reset successful');
      return { success: true, data: response };
    } catch (error) {
      console.error('❌ [useAuth] Reset password failed:', error);
      return { 
        success: false, 
        error:  error.message || 'Reset mật khẩu thất bại' 
      };
    }
  }, []);

  return {
    // State
    user,
    admin,
    currentUser: user || admin,
    isAuthenticated,
    isAdmin,
    
    // Methods
    register,
    login,
    adminLogin,
    logout,
    updateProfile,
    changePassword,
    forgotPassword,
    resetPassword,
  };
}

export default useAuth;