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
    if (error.response?.status === 401) {
      console.warn('⚠️ [Client API] Unauthorized - Token expired or invalid');
      
      // Xóa token và redirect về login
      localStorage.removeItem('userToken');
      localStorage.removeItem('user');
      
      // Chỉ redirect nếu không phải đang ở trang login
      if (! window.location.pathname.includes('/login')) {
        window.location.href = '/login? expired=true';
      }
    }

    // Log lỗi chi tiết
    console.error('❌ [Client API] Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      data: error.response?.data,
    });

    return Promise. reject(error);
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
adminAPI.interceptors. response.use(
  (response) => {
    console.log('✅ [Admin API] Response:', response.config.url, response.status);
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      console.warn('⚠️ [Admin API] Unauthorized - Token expired or invalid');
      
      // Xóa token và redirect về admin login
      localStorage.removeItem('adminToken');
      localStorage.removeItem('admin');
      
      if (!window.location.pathname.includes('/admin/login')) {
        window.location.href = '/admin/login?expired=true';
      }
    }

    console.error('❌ [Admin API] Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      data: error.response?.data,
    });

    return Promise.reject(error);
  }
);

// Export default là clientAPI
export default clientAPI;