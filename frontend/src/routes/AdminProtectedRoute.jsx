import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

/**
 * AdminProtectedRoute - Route guard cho admin
 * Chỉ cho phép admin truy cập
 */
export default function AdminProtectedRoute({ children }) {
  const { admin, isAdmin } = useAuthStore();

  if (! isAdmin || !admin) {
    // Redirect về admin login
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}