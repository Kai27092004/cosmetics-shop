# 📚 FRONTEND DOCUMENTATION - TỔNG HỢP

## 📋 Giới Thiệu

Đây là tài liệu đầy đủ cho Frontend của hệ thống **Cosmetics Shop** (E-commerce Platform).

Frontend được xây dựng bằng:
- **React 19** + **Vite**
- **Zustand** - State Management
- **React Router v7** - Routing
- **Tailwind CSS** - Styling
- **Axios** - HTTP Client
- **Socket.IO Client** - Realtime
- **React Hook Form** + **Yup** - Form Validation
- **React Toastify** - Notifications
- **Recharts** - Charts (Dashboard)
- **Three.js** + **React Three Fiber** - 3D Product Carousel

---

## 📂 Danh Sách Tài Liệu

### 1. [🔄 STATE_MANAGEMENT.md](./STATE_MANAGEMENT.md)
**So sánh Redux, Zustand, Context API**
- Redux vs Zustand vs Context API
- Khi nào dùng cái gì?
- Ví dụ code chi tiết
- Best practices
- Performance comparison

---

## 🚀 Quick Start

### 1. Cài đặt dependencies:
```bash
cd frontend
npm install
```

### 2. Cấu hình `.env`:
```env
VITE_API_URL=http://localhost:8080/api
VITE_SOCKET_URL=http://localhost:8080
VITE_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
```

### 3. Chạy development server:
```bash
npm run dev
```

### 4. Build production:
```bash
npm run build
```

### 5. Preview production build:
```bash
npm run preview
```

---

## 📁 Cấu Trúc Thư Mục

```
frontend/
├── public/                      # Static files
│   ├── upload/                  # Product images
│   └── ...
├── src/
│   ├── assets/                  # Images, icons
│   │   ├── icons/
│   │   └── images/
│   ├── components/              # Reusable components
│   │   ├── cart/                # Cart components
│   │   ├── common/              # Common components (Button, Input, ...)
│   │   ├── dashboard/           # Admin dashboard components
│   │   ├── layout/              # Layout components (Header, Footer, ...)
│   │   └── product/             # Product components
│   ├── contexts/                # React Context
│   │   └── ThemeContext.jsx    # Theme (light/dark mode)
│   ├── hooks/                   # Custom hooks
│   │   ├── useLocalStorage.js
│   │   └── ...
│   ├── pages/                   # Page components
│   │   ├── admin/               # Admin pages
│   │   ├── auth/                # Auth pages (Login, Register, ...)
│   │   ├── cart/                # Cart page
│   │   ├── product/             # Product pages
│   │   └── ...
│   ├── routes/                  # Routing
│   │   └── index.jsx            # Route configuration
│   ├── services/                # API services
│   │   ├── api.js               # Axios instance
│   │   ├── authService.js       # Auth API
│   │   ├── productService.js    # Product API
│   │   ├── orderService.js      # Order API
│   │   └── socketService.js     # Socket.IO client
│   ├── store/                   # Zustand stores
│   │   ├── authStore.js         # Auth state
│   │   ├── cartStore.js         # Cart state
│   │   ├── productStore.js      # Product state
│   │   └── uiStore.js           # UI state
│   ├── styles/                  # Global styles
│   │   └── ...
│   ├── utils/                   # Utility functions
│   │   ├── toast.js             # Toast notifications
│   │   └── ...
│   ├── App.jsx                  # Root component
│   ├── main.jsx                 # Entry point
│   └── index.css                # Global CSS
├── .env                         # Environment variables
├── .env.example                 # Environment variables example
├── package.json                 # Dependencies
├── vite.config.js               # Vite configuration
├── tailwind.config.js           # Tailwind CSS configuration
└── postcss.config.js            # PostCSS configuration
```

---

## 🔄 State Management (Zustand)

### Stores:

#### 1. Auth Store (`authStore.js`)
```javascript
{
  user: null,              // User info
  admin: null,             // Admin info
  userToken: null,         // JWT token (user)
  adminToken: null,        // JWT token (admin)
  isAuthenticated: false,  // Is logged in?
  isAdmin: false,          // Is admin?
  
  // Actions
  loginUser(userData, token)
  loginAdmin(adminData, token)
  logoutUser()
  logoutAdmin()
  updateUser(userData)
  updateAdmin(adminData)
  initAuth()
  isTokenExpired()
  getCurrentUser()
  getToken()
}
```

#### 2. Cart Store (`cartStore.js`)
```javascript
{
  items: [],  // Cart items
  
  // Actions
  addItem(product, quantity)
  removeItem(productId)
  updateQuantity(productId, quantity)
  incrementQuantity(productId)
  decrementQuantity(productId)
  clearCart()
  getTotalItems()
  getTotalPrice()
  isInCart(productId)
  getItemQuantity(productId)
  getItem(productId)
}
```

#### 3. Product Store (`productStore.js`)
```javascript
{
  products: [],         // Cached products
  categories: [],       // Cached categories
  selectedProduct: null,
  filters: {
    search: '',
    categoryId: '',
    sortBy: 'createdAt',
    minPrice: 0,
    maxPrice: 0,
  },
  pagination: {
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  },
  
  // Actions
  setProducts(products)
  setCategories(categories)
  setSelectedProduct(product)
  updateFilters(newFilters)
  clearFilters()
  updatePagination(paginationData)
  getProductById(id)
  getCategoryById(id)
  upsertProduct(product)
  removeProduct(id)
  clearCache()
}
```

#### 4. UI Store (`uiStore.js`)
```javascript
{
  isLoading: false,
  isSidebarOpen: false,
  isCartDrawerOpen: false,
  isMobileMenuOpen: false,
  modal: { ... },
  toast: { ... },
  
  // Actions
  setLoading(isLoading)
  toggleSidebar()
  openSidebar()
  closeSidebar()
  toggleCartDrawer()
  openCartDrawer()
  closeCartDrawer()
  toggleMobileMenu()
  openMobileMenu()
  closeMobileMenu()
  openModal(options)
  closeModal()
  confirmModal()
  cancelModal()
  showToast(message, type, duration)
  hideToast()
  showSuccessToast(message)
  showErrorToast(message)
  showWarningToast(message)
  showInfoToast(message)
}
```

### Sử dụng Store:

```jsx
import { useAuthStore } from './store/authStore';
import { useCartStore } from './store/cartStore';

function MyComponent() {
  // Lấy state và actions
  const { user, isAuthenticated, loginUser } = useAuthStore();
  const { items, addItem, getTotalPrice } = useCartStore();

  return (
    <div>
      {isAuthenticated && <p>Welcome, {user.fullName}</p>}
      <p>Cart: {items.length} items - {getTotalPrice()} VND</p>
    </div>
  );
}
```

---

## 🎨 Styling (Tailwind CSS)

### Cấu hình:

```javascript
// tailwind.config.js
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#db2777',    // Pink
        secondary: '#9333ea',  // Purple
        // ...
      },
    },
  },
  plugins: [],
};
```

### Sử dụng:

```jsx
<button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90">
  Click me
</button>
```

### Dark Mode:

```jsx
import { useTheme } from './contexts/ThemeContext';

function MyComponent() {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <div className="bg-white dark:bg-gray-900 text-black dark:text-white">
      <button onClick={toggleTheme}>
        {isDark ? '☀️ Light' : '🌙 Dark'}
      </button>
    </div>
  );
}
```

---

## 🛣️ Routing (React Router v7)

### Cấu hình:

```jsx
// routes/index.jsx
import { Routes, Route } from 'react-router-dom';

function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/products/:id" element={<ProductDetailPage />} />
      
      {/* Auth routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      
      {/* Protected routes (User) */}
      <Route element={<ProtectedRoute />}>
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/orders" element={<OrdersPage />} />
      </Route>
      
      {/* Admin routes */}
      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="products" element={<AdminProductsPage />} />
          <Route path="orders" element={<AdminOrdersPage />} />
          <Route path="users" element={<AdminUsersPage />} />
        </Route>
      </Route>
    </Routes>
  );
}
```

### Protected Route:

```jsx
function ProtectedRoute() {
  const { isAuthenticated } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <Outlet />;
}
```

---

## 🌐 API Services (Axios)

### Cấu hình:

```javascript
// services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor (thêm token)
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor (xử lý lỗi)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired
      const { isAdmin, logoutUser, logoutAdmin } = useAuthStore.getState();
      if (isAdmin) {
        logoutAdmin();
      } else {
        logoutUser();
      }
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

### Sử dụng:

```javascript
// services/productService.js
import api from './api';

export const productService = {
  getAll: (params) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
};
```

---

## 🔔 Realtime (Socket.IO)

### Cấu hình:

```javascript
// services/socketService.js
import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
  }

  connect() {
    this.socket = io(import.meta.env.VITE_SOCKET_URL, {
      auth: {
        token: useAuthStore.getState().getToken(),
      },
    });

    this.socket.on('connect', () => {
      console.log('✅ Socket connected');
    });

    this.socket.on('disconnect', () => {
      console.log('❌ Socket disconnected');
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  joinUserRoom(userId) {
    this.socket.emit('join:user', userId);
  }

  joinRoleRoom(role) {
    this.socket.emit('join:role', role);
  }

  on(event, callback) {
    this.socket.on(event, callback);
  }

  off(event, callback) {
    this.socket.off(event, callback);
  }
}

export default new SocketService();
```

### Sử dụng:

```jsx
import socketService from './services/socketService';

function MyComponent() {
  useEffect(() => {
    // Kết nối
    socketService.connect();
    
    // Lắng nghe events
    socketService.on('order:new', (data) => {
      console.log('New order:', data);
      showToast.success(`Đơn hàng mới #${data.orderId}`);
    });

    return () => {
      socketService.disconnect();
    };
  }, []);
}
```

---

## 📝 Form Validation (React Hook Form + Yup)

### Cấu hình:

```jsx
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object({
  email: yup.string().email('Email không hợp lệ').required('Email là bắt buộc'),
  password: yup.string().min(6, 'Mật khẩu tối thiểu 6 ký tự').required('Mật khẩu là bắt buộc'),
});

function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} />
      {errors.email && <p>{errors.email.message}</p>}

      <input type="password" {...register('password')} />
      {errors.password && <p>{errors.password.message}</p>}

      <button type="submit">Login</button>
    </form>
  );
}
```

---

## 🎨 Components

### Common Components:

#### Button
```jsx
<Button variant="primary" size="md" onClick={handleClick}>
  Click me
</Button>
```

#### Input
```jsx
<Input
  label="Email"
  type="email"
  placeholder="Enter your email"
  error={errors.email?.message}
  {...register('email')}
/>
```

#### Modal
```jsx
const { openModal, closeModal } = useUIStore();

openModal({
  title: 'Xác nhận xóa',
  content: 'Bạn có chắc chắn muốn xóa sản phẩm này?',
  onConfirm: () => handleDelete(),
  confirmText: 'Xóa',
  cancelText: 'Hủy',
});
```

#### Loading
```jsx
<Loading />
```

#### Alert
```jsx
<Alert type="success" message="Thành công!" />
<Alert type="error" message="Có lỗi xảy ra!" />
```

---

## 📊 Charts (Recharts)

### Line Chart:

```jsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

function RevenueChart({ data }) {
  return (
    <LineChart width={600} height={300} data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="month" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="revenue" stroke="#db2777" />
    </LineChart>
  );
}
```

---

## 🎭 3D Product Carousel (Three.js)

```jsx
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

function ProductCarousel3D({ images }) {
  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <OrbitControls />
      {/* 3D models */}
    </Canvas>
  );
}
```

---

## 🔧 Environment Variables

```env
# API
VITE_API_URL=http://localhost:8080/api
VITE_SOCKET_URL=http://localhost:8080

# Google OAuth
VITE_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com

# Other
VITE_APP_NAME=Cosmetics Shop
VITE_APP_VERSION=1.0.0
```

---

## 📦 Dependencies

### Production:
```json
{
  "react": "^19.2.0",
  "react-dom": "^19.2.0",
  "react-router-dom": "^7.11.0",
  "zustand": "^5.0.9",
  "axios": "^1.13.2",
  "socket.io-client": "^4.8.3",
  "react-hook-form": "^7.70.0",
  "yup": "^1.7.1",
  "@hookform/resolvers": "^5.2.2",
  "react-toastify": "^11.0.5",
  "react-icons": "^5.5.0",
  "recharts": "^3.6.0",
  "three": "^0.182.0",
  "@react-three/fiber": "^9.5.0",
  "@react-three/drei": "^10.7.7",
  "date-fns": "^4.1.0"
}
```

### Development:
```json
{
  "vite": "^7.2.4",
  "@vitejs/plugin-react": "^5.1.1",
  "tailwindcss": "^3.4.1",
  "autoprefixer": "^10.4.23",
  "postcss": "^8.5.6",
  "eslint": "^9.39.1"
}
```

---

## 🚀 Deployment

### Build:
```bash
npm run build
```

### Preview:
```bash
npm run preview
```

### Deploy to Vercel:
```bash
vercel --prod
```

### Deploy to Netlify:
```bash
netlify deploy --prod
```

---

## ✅ Summary

### Tổng số pages: **30+**
### Tổng số components: **50+**
### Tổng số stores: **4**
### Tổng số services: **10+**

### Các tính năng chính:
1. ✅ Authentication (Email + Google OAuth)
2. ✅ Product Catalog (List, Detail, Search, Filter)
3. ✅ Shopping Cart
4. ✅ Checkout & Orders
5. ✅ User Profile
6. ✅ Admin Dashboard
7. ✅ Product Management (CRUD)
8. ✅ Order Management
9. ✅ User Management
10. ✅ Email Marketing
11. ✅ AI Chatbot
12. ✅ Realtime Notifications (Socket.IO)
13. ✅ Dark Mode
14. ✅ Responsive Design
15. ✅ 3D Product Carousel

---

**Date**: February 9, 2026  
**Version**: 1.0.0  
**Status**: ✅ Production Ready  
**Author**: Frontend Team  
**License**: MIT
