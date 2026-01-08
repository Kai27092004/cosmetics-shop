import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from '../components/layout/AdminLayout';
import AdminProtectedRoute from './AdminProtectedRoute';

// Admin Pages
import AdminLogin from '../pages/admin/auth/AdminLogin';
import Dashboard from '../pages/admin/Dashboard';
import ProductRoutes from '../pages/admin/products';
import OrderRoutes from '../pages/admin/orders';
import CategoryManagement from '../pages/admin/categories';
import UserManagement from '../pages/admin/users';

/**
 * Admin Routes - Routes cho admin
 */
export default function AdminRoutes() {
  return (
    <Routes>
      {/* Admin Login (không cần layout) */}
      <Route path="login" element={<AdminLogin />} />

      {/* Admin Protected Routes */}
      <Route
        path="/*"
        element={
          <AdminProtectedRoute>
            <AdminLayout />
          </AdminProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="products/*" element={<ProductRoutes />} />
        <Route path="orders/*" element={<OrderRoutes />} />
        <Route path="categories" element={<CategoryManagement />} />
        <Route path="users" element={<UserManagement />} />
      </Route>
    </Routes>
  );
}