import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import socketService from './services/socketService';

// Layouts
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import AdminLayout from './components/layout/AdminLayout'; // ✅ THÊM

// Protected Route
import ProtectedRoute from './routes/ProtectedRoute';
import AdminProtectedRoute from './routes/AdminProtectedRoute'; // ✅ THÊM

// Pages
import Home from './pages/client/Home';
import Products from './pages/client/Products';
import ProductDetail from './pages/client/ProductDetail';
import Cart from './pages/client/Cart';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Checkout from './pages/client/Checkout';
import OrderSuccess from './pages/client/OrderSuccess';
import Profile from './pages/client/Profile';

// Admin Pages
import AdminLogin from './pages/admin/auth/AdminLogin'; // ✅ THÊM
import Dashboard from './pages/admin/Dashboard'; // ✅ THÊM

function App() {
  const { user, admin, initAuth } = useAuthStore();

  // Khởi tạo auth CHỈ 1 LẦN khi app start
  React.useEffect(() => {
    console.log('🚀 [App] Initializing application...');
    initAuth();
  }, []); // Empty dependency - chỉ chạy 1 lần

  // Kết nối WebSocket khi có user/admin
  React.useEffect(() => {
    if (user || admin) {
      console.log('🔌 [App] Connecting WebSocket...');
      socketService.connect();
      
      if (user) {
        socketService.joinUserRoom(user.id);
        socketService.joinRoleRoom('customer');
      }
      
      if (admin) {
        socketService.joinUserRoom(admin.id);
        socketService.joinRoleRoom('admin');
      }

      return () => {
        socketService.disconnect();
      };
    }
  }, [user, admin]);

  return (
    <BrowserRouter>
      <Routes>
        {/* ==================== CLIENT ROUTES (with Header/Footer) ==================== */}
        <Route path="/*" element={
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/about" element={<div className="p-8">About Page (TODO)</div>} />
                <Route path="/contact" element={<div className="p-8">Contact Page (TODO)</div>} />

                {/* Protected Routes */}
                <Route 
                  path="/checkout" 
                  element={
                    <ProtectedRoute>
                      <Checkout />
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/order-success" 
                  element={
                    <ProtectedRoute>
                      <OrderSuccess />
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/profile" 
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  } 
                />

                {/* 404 */}
                <Route path="*" element={
                  <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                      <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
                      <p className="text-xl text-gray-600 mb-4">Trang không tồn tại</p>
                      <a href="/" className="text-primary-600 hover:underline">
                        ← Quay về trang chủ
                      </a>
                    </div>
                  </div>
                } />
              </Routes>
            </main>
            <Footer />
          </div>
        } />

        {/* ==================== ADMIN ROUTES (without Header/Footer) ==================== */}
        <Route path="/admin/login" element={<AdminLogin />} />
        
        <Route path="/admin" element={
          <AdminProtectedRoute>
            <AdminLayout />
          </AdminProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          {/* Thêm các admin routes khác ở đây */}
          
          {/* 404 Admin */}
          <Route path="*" element={
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
                <p className="text-xl text-gray-600 mb-4">Admin page not found</p>
                <a href="/admin" className="text-primary-600 hover:underline">
                  ← Back to Dashboard
                </a>
              </div>
            </div>
          } />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;