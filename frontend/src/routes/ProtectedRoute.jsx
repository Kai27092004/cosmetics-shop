import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function ProtectedRoute({ children }) {
  const location = useLocation();
  const { user, isAuthenticated } = useAuthStore();

  // Kiểm tra cả isAuthenticated và user để chắc chắn
  if (!isAuthenticated || !user) {
    // Lưu URL hiện tại để redirect sau khi login
    const redirectUrl = `${location.pathname}${location.search}`;
    return <Navigate to={`/login?redirect=${encodeURIComponent(redirectUrl)}`} replace />;
  }

  return children;
}