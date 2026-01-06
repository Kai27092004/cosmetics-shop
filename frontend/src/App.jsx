import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import socketService from './services/socketService';

// Layouts
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Pages
import Home from './pages/client/Home';
import Products from './pages/client/Products'; // ✅ THÊM
import ProductDetail from './pages/client/ProductDetail'; // ✅ THÊM
import Cart from './pages/client/Cart'; // ✅ THÊM
import Login from './pages/auth/Login'; // ✅ THÊM
import Register from './pages/auth/Register'; // ✅ THÊM
import Checkout from './pages/client/Checkout'; // ✅ THÊM
import OrderSuccess from './pages/client/OrderSuccess'; // ✅ THÊM
import Profile from './pages/client/Profile'; // ✅ THÊM


function App() {
  const { user, admin, initAuth } = useAuthStore();

  // Khởi tạo auth và WebSocket
  React.useEffect(() => {
    console.log('🚀 [App] Initializing application.. .');
    initAuth();
    
    if (user || admin) {
      console.log('🔌 [App] Connecting WebSocket...');
      socketService. connect();
      
      if (user) {
        socketService.joinUserRoom(user.id);
        socketService.joinRoleRoom('customer');
      }
      
      if (admin) {
        socketService.joinUserRoom(admin.id);
        socketService.joinRoleRoom('admin');
      }
    }

    return () => {
      socketService.disconnect();
    };
  }, [user, admin, initAuth]);

  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Header />
        
        <main className="flex-1">
          <Routes>
            {/* Client Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} /> {/* ✅ THÊM */}
            <Route path="/products/:id" element={<ProductDetail />} /> {/* ✅ THÊM */}
            <Route path="/cart" element={<Cart />} /> {/* ✅ THÊM */}
            <Route path="/login" element={<Login />} /> {/* ✅ THÊM */}
            <Route path="/register" element={<Register />} /> {/* ✅ THÊM */}
            <Route path="/products" element={<div className="p-8">Products Page (TODO)</div>} />
            <Route path="/products/:id" element={<div className="p-8">Product Detail (TODO)</div>} />
            <Route path="/cart" element={<div className="p-8">Cart Page (TODO)</div>} />
            <Route path="/login" element={<div className="p-8">Login Page (TODO)</div>} />
            <Route path="/register" element={<div className="p-8">Register Page (TODO)</div>} />
            <Route path="/about" element={<div className="p-8">About Page (TODO)</div>} />
            <Route path="/contact" element={<div className="p-8">Contact Page (TODO)</div>} />

            {/* Admin Routes */}
            <Route path="/admin/login" element={<div className="p-8">Admin Login (TODO)</div>} />
            <Route path="/admin" element={<div className="p-8">Admin Dashboard (TODO)</div>} />

            {/* 404 */}
            <Route path="*" element={
              <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
                  <p className="text-xl text-gray-600">Trang không tồn tại</p>
                </div>
              </div>
            } />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;