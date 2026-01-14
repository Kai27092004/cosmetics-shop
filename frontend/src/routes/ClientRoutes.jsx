import { Routes, Route } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import ProtectedRoute from './ProtectedRoute';

// Pages
import Home from '../pages/client/Home';
import Products from '../pages/client/Products';
import ProductDetail from '../pages/client/ProductDetail';
import Cart from '../pages/client/Cart';
import Checkout from '../pages/client/Checkout';
import OrderSuccess from '../pages/client/OrderSuccess';
import Profile from '../pages/client/Profile';
import Payment from '../pages/client/Payment';
import About from '../pages/client/About';
import Contact from '../pages/client/Contact';

// Auth
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import GoogleCallback from '../pages/auth/GoogleCallback';

/**
 * Client Routes - Routes cho user (customer)
 */
export default function ClientRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="products" element={<Products />} />
        <Route path="products/:id" element={<ProductDetail />} />
        <Route path="cart" element={<Cart />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="auth/google/callback" element={<GoogleCallback />} />

        {/* Protected Routes - Cần login */}
        <Route
          path="checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />
        <Route
          path="order-success"
          element={
            <ProtectedRoute>
              <OrderSuccess />
            </ProtectedRoute>
          }
        />
        <Route
          path="payment/:orderId"
          element={
            <ProtectedRoute>
              <Payment />
            </ProtectedRoute>
          }
        />
        <Route
          path="profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* 404 */}
        <Route
          path="*"
          element={
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
                <p className="text-xl text-gray-600 mb-4">Trang không tồn tại</p>
                <a href="/" className="text-primary-600 hover:underline">
                  ← Quay về trang chủ
                </a>
              </div>
            </div>
          }
        />
      </Route>
    </Routes>
  );
}