import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login? redirect=/checkout" replace />;
  }

  return children;
}