import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// ==================== CLIENT API (CHO USER) ====================
export const clientAPI = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
});

// ==================== ADMIN API (CHO ADMIN) ====================
export const adminAPI = axios.create({
  baseURL:  API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// ==================== INTERCEPTOR CHO CLIENT API ====================
// Tự động thêm userToken vào mỗi request
clientAPI. interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('🔑 [Client API] Added token to request:', config.url);
    }
    return config;
  },
  (error) => {
    console.error('❌ [Client API] Request error:', error);
    return Promise.reject(error);
  }
);

// Xử lý response lỗi
clientAPI.interceptors.response.use(
  (response) => {
    console.log('✅ [Client API] Response:', response.config.url, response.status);
    return response;
  },
  (error) => {
    const status = error.response?.status;
    const errorCode = error.response?.data?.code;
    
    // Xử lý token hết hạn hoặc không hợp lệ
    if (status === 401 && (errorCode === 'TOKEN_EXPIRED' || errorCode === 'INVALID_TOKEN' || errorCode === 'NO_TOKEN')) {
      console.warn('⚠️ [Client API] Token expired/invalid - Auto logout');
      
      // Xóa token và user data
      localStorage.removeItem('userToken');
      localStorage.removeItem('user');
      localStorage.removeItem('auth-storage');
      
      // Dispatch custom event để trigger logout trong authStore
      window.dispatchEvent(new CustomEvent('auth:logout', { detail: { reason: 'token_expired' } }));
      
      // Redirect về login nếu không phải đang ở trang login/register
      if (!window.location.pathname.includes('/login') && 
          !window.location.pathname.includes('/register')) {
        setTimeout(() => {
          window.location.href = '/login?expired=true';
        }, 100);
      }
    }

    // Log lỗi chi tiết
    console.error('❌ [Client API] Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: status,
      code: errorCode,
      message: error.response?.data?.message || error.message,
    });

    return Promise.reject(error);
  }
);

// ==================== INTERCEPTOR CHO ADMIN API ====================
// Tự động thêm adminToken vào mỗi request
adminAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('🔑 [Admin API] Added token to request:', config.url);
    }
    return config;
  },
  (error) => {
    console.error('❌ [Admin API] Request error:', error);
    return Promise.reject(error);
  }
);

// Xử lý response lỗi
adminAPI.interceptors.response.use(
  (response) => {
    console.log('✅ [Admin API] Response:', response.config.url, response.status);
    return response;
  },
  (error) => {
    const status = error.response?.status;
    const errorCode = error.response?.data?.code;
    
    // Xử lý token hết hạn hoặc không hợp lệ
    if (status === 401 && (errorCode === 'TOKEN_EXPIRED' || errorCode === 'INVALID_TOKEN' || errorCode === 'NO_TOKEN')) {
      console.warn('⚠️ [Admin API] Token expired/invalid - Auto logout');
      
      // Xóa token và admin data
      localStorage.removeItem('adminToken');
      localStorage.removeItem('admin');
      localStorage.removeItem('auth-storage');
      
      // Dispatch custom event để trigger logout trong authStore
      window.dispatchEvent(new CustomEvent('auth:logout', { detail: { reason: 'token_expired', isAdmin: true } }));
      
      // Redirect về admin login
      if (!window.location.pathname.includes('/admin/login')) {
        setTimeout(() => {
          window.location.href = '/admin/login?expired=true';
        }, 100);
      }
    }

    console.error('❌ [Admin API] Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: status,
      code: errorCode,
      message: error.response?.data?.message || error.message,
    });

    return Promise.reject(error);
  }
);

// Export default là clientAPI
export default clientAPI;