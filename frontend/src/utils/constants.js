// ==================== API ENDPOINTS ====================
export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  PROFILE: '/users/profile',
  CHANGE_PASSWORD: '/users/change-password',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  
  // Products
  PRODUCTS: '/products',
  PRODUCT_DETAIL: (id) => `/products/${id}`,
  
  // Categories
  CATEGORIES: '/categories',
  CATEGORY_DETAIL: (id) => `/categories/${id}`,
  
  // Orders
  ORDERS: '/orders',
  ORDER_DETAIL: (id) => `/orders/${id}`,
  ORDER_CANCEL: (id) => `/orders/${id}/cancel`,
  MY_ORDERS: '/users/my-orders',
  
  // Admin
  ADMIN_ORDERS: '/orders/admin/all',
  ADMIN_ORDER_DETAIL: (id) => `/orders/admin/${id}`,
  ADMIN_ORDER_UPDATE_STATUS: (id) => `/orders/admin/${id}/status`,
  ADMIN_ORDER_DELETE: (id) => `/orders/admin/${id}`,
  ADMIN_USERS: '/users',
  DASHBOARD_STATS: '/dashboard/stats',
};

// ==================== ORDER STATUS ====================
export const ORDER_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
};

export const ORDER_STATUS_LABELS = {
  pending: 'Chờ xử lý',
  processing: 'Đang xử lý',
  shipped: 'Đang giao',
  delivered: 'Đã giao',
  cancelled: 'Đã hủy',
};

export const ORDER_STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

// ==================== USER ROLES ====================
export const USER_ROLES = {
  ADMIN: 'admin',
  CUSTOMER: 'customer',
};

// ==================== PAGINATION ====================
export const ITEMS_PER_PAGE = 12;
export const ADMIN_ITEMS_PER_PAGE = 10;

// ==================== LOCAL STORAGE KEYS ====================
export const STORAGE_KEYS = {
  USER_TOKEN: 'userToken',
  ADMIN_TOKEN: 'adminToken',
  USER: 'user',
  ADMIN: 'admin',
  CART: 'cart-storage',
};

// ==================== WEBSOCKET EVENTS ====================
export const SOCKET_EVENTS = {
  // Client → Server
  JOIN_USER_ROOM: 'join:user',
  JOIN_ROLE_ROOM: 'join:role',
  JOIN_ORDER_ROOM: 'join:order',
  
  // Server → Client
  ORDER_NEW: 'order:new',
  ORDER_CREATED: 'order:created',
  ORDER_UPDATED: 'order:updated',
  ORDER_STATUS_CHANGED: 'order:statusChanged',
  ORDER_CANCELLED: 'order:cancelled',
  ORDER_DELETED: 'order:deleted',
  ORDER_UPDATE: 'order:update',
};

// ==================== VALIDATION RULES ====================
export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /(84|0[3|5|7|8|9])+([0-9]{8})\b/,
  PASSWORD_MIN_LENGTH: 6,
  PASSWORD_STRONG_REGEX: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
};

// ==================== DATE FORMATS ====================
export const DATE_FORMATS = {
  DISPLAY: 'dd/MM/yyyy',
  DISPLAY_TIME: 'dd/MM/yyyy HH:mm',
  API: 'yyyy-MM-dd',
};