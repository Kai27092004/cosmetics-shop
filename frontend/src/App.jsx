import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import socketService from './services/socketService';
import showToast from './utils/toast';

// Routes
import AppRoutes from './routes';
import ScrollToTop from './components/ScrollToTop'; 

function App() {
  const { user, admin, initAuth, logoutUser, logoutAdmin } = useAuthStore();

  // Khởi tạo auth CHỈ 1 LẦN khi app start
  React.useEffect(() => {
    console.log('🚀 [App] Initializing application...');
    initAuth();
  }, []); // Empty dependency - chỉ chạy 1 lần

  // Lắng nghe event logout từ API interceptors
  React.useEffect(() => {
    const handleAuthLogout = (event) => {
      const { reason, isAdmin } = event.detail || {};
      
      if (reason === 'token_expired') {
        console.warn('⚠️ [App] Token expired - Logging out...');
        showToast.warning('Phiên đăng nhập đã hết hạn!');
        
        if (isAdmin) {
          logoutAdmin();
        } else {
          logoutUser();
        }
      }
    };

    window.addEventListener('auth:logout', handleAuthLogout);
    
    return () => {
      window.removeEventListener('auth:logout', handleAuthLogout);
    };
  }, [logoutUser, logoutAdmin]);

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
      <ScrollToTop />
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;