import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      // ==================== STATE ====================
      user: null,                  // Thông tin user (customer)
      admin: null,                 // Thông tin admin
      userToken: null,             // JWT token của user
      adminToken: null,            // JWT token của admin
      isAuthenticated: false,      // User đã đăng nhập chưa? 
      isAdmin: false,              // Có phải admin không? 

      // ==================== ACTIONS ====================

      /**
       * Đăng nhập User (Customer)
       * @param {object} userData - Thông tin user
       * @param {string} token - JWT token
       */
      loginUser: (userData, token) => {
        console.log('✅ [Auth Store] User logged in:', userData);
        localStorage.setItem('userToken', token);
        localStorage.setItem('user', JSON.stringify(userData));
        
        set({
          user: userData,
          userToken: token,
          isAuthenticated: true,
          isAdmin: false,
          // Clear admin data nếu có
          admin: null,
          adminToken: null,
        });
      },

      /**
       * Đăng nhập Admin
       * @param {object} adminData - Thông tin admin
       * @param {string} token - JWT token
       */
      loginAdmin: (adminData, token) => {
        console.log('✅ [Auth Store] Admin logged in:', adminData);
        localStorage.setItem('adminToken', token);
        localStorage.setItem('admin', JSON.stringify(adminData));
        
        set({
          admin:  adminData,
          adminToken:  token,
          isAuthenticated:  true,
          isAdmin: true,
          // Clear user data nếu có
          user: null,
          userToken: null,
        });
      },

      /**
       * Cập nhật thông tin User
       * @param {object} userData - Thông tin user mới
       */
      updateUser: (userData) => {
        console.log('🔄 [Auth Store] User info updated:', userData);
        localStorage.setItem('user', JSON. stringify(userData));
        
        set({ user: userData });
      },

      /**
       * Cập nhật thông tin Admin
       * @param {object} adminData - Thông tin admin mới
       */
      updateAdmin:  (adminData) => {
        console.log('🔄 [Auth Store] Admin info updated:', adminData);
        localStorage.setItem('admin', JSON.stringify(adminData));
        
        set({ admin: adminData });
      },

      /**
       * Đăng xuất User
       */
      logoutUser: () => {
        console.log('👋 [Auth Store] User logged out');
        localStorage.removeItem('userToken');
        localStorage.removeItem('user');
        
        set({
          user: null,
          userToken: null,
          isAuthenticated: false,
          isAdmin: false,
        });
      },

      /**
       * Đăng xuất Admin
       */
      logoutAdmin: () => {
        console.log('👋 [Auth Store] Admin logged out');
        localStorage.removeItem('adminToken');
        localStorage.removeItem('admin');
        
        set({
          admin: null,
          adminToken: null,
          isAuthenticated: false,
          isAdmin: false,
        });
      },

      /**
       * Khởi tạo auth từ localStorage (khi reload page)
       */
      initAuth: () => {
        const userToken = localStorage.getItem('userToken');
        const adminToken = localStorage.getItem('adminToken');
        const userStr = localStorage.getItem('user');
        const adminStr = localStorage.getItem('admin');

        // Kiểm tra và restore user session
        if (userToken && userStr) {
          // Kiểm tra token có hết hạn không
          const isExpired = get().isTokenExpired();
          
          if (isExpired) {
            console.warn('⚠️ [Auth Store] User token expired on init, clearing session');
            get().logoutUser();
            return;
          }

          try {
            const user = JSON.parse(userStr);
            console.log('🔄 [Auth Store] Restored user session:', user);
            set({
              user,
              userToken,
              isAuthenticated: true,
              isAdmin: false,
            });
          } catch (error) {
            console.error('❌ [Auth Store] Failed to restore user session:', error);
            get().logoutUser();
          }
        } 
        // Kiểm tra và restore admin session
        else if (adminToken && adminStr) {
          // Kiểm tra token có hết hạn không
          const isExpired = get().isTokenExpired();
          
          if (isExpired) {
            console.warn('⚠️ [Auth Store] Admin token expired on init, clearing session');
            get().logoutAdmin();
            return;
          }

          try {
            const admin = JSON.parse(adminStr);
            console.log('🔄 [Auth Store] Restored admin session:', admin);
            set({
              admin,
              adminToken,
              isAuthenticated: true,
              isAdmin: true,
            });
          } catch (error) {
            console.error('❌ [Auth Store] Failed to restore admin session:', error);
            get().logoutAdmin();
          }
        } else {
          console.log('ℹ️ [Auth Store] No saved session found');
        }
      },

      /**
       * Kiểm tra token có hết hạn không (optional)
       * @returns {boolean}
       */
      isTokenExpired: () => {
        const token = get().userToken || get().adminToken;
        if (!token) return true;

        try {
          // Decode JWT token (phần payload)
          const payload = JSON.parse(atob(token.split('.')[1]));
          const expirationTime = payload.exp * 1000; // Convert to milliseconds
          const currentTime = Date.now();

          const isExpired = currentTime >= expirationTime;
          
          if (isExpired) {
            console.warn('⚠️ [Auth Store] Token expired');
          }

          return isExpired;
        } catch (error) {
          console.error('❌ [Auth Store] Failed to decode token:', error);
          return true;
        }
      },

      /**
       * Lấy thông tin người dùng hiện tại (user hoặc admin)
       * @returns {object|null}
       */
      getCurrentUser: () => {
        return get().user || get().admin || null;
      },

      /**
       * Lấy token hiện tại (userToken hoặc adminToken)
       * @returns {string|null}
       */
      getToken: () => {
        return get().userToken || get().adminToken || null;
      },
    }),
    {
      name: 'auth-storage', // localStorage key
      partialize: (state) => ({
        // Chỉ lưu những field này vào localStorage
        user: state. user,
        admin: state. admin,
        userToken: state.userToken,
        adminToken: state.adminToken,
        isAuthenticated: state.isAuthenticated,
        isAdmin: state.isAdmin,
      }),
    }
  )
);