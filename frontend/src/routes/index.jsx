import { Routes, Route } from 'react-router-dom';
import ClientRoutes from './ClientRoutes';
import AdminRoutes from './AdminRoutes';

/**
 * Main Routes - Điểm vào chính của routing
 */
export default function AppRoutes() {
  return (
    <Routes>
      {/* Admin Routes - Phải đặt trước để match chính xác */}
      <Route path="/admin/*" element={<AdminRoutes />} />
      
      {/* Client Routes - Match tất cả routes còn lại */}
      <Route path="/*" element={<ClientRoutes />} />
    </Routes>
  );
}