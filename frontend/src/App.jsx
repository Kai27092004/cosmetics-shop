import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import socketService from './services/socketService';

// Routes
import AppRoutes from './routes';
import ScrollToTop from './components/ScrollToTop'; 

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
      <ScrollToTop />
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;