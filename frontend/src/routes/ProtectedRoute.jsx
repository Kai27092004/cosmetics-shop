import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

/**
 * ProtectedRoute - Route guard cho user (customer)
 * Chỉ cho phép user đã login truy cập
 */
export default function ProtectedRoute({ children }) {
  const { user, isAuthenticated } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated || !user) {
    // Redirect về login, lưu current path để redirect lại sau khi login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}