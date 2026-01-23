import { Routes, Route, Navigate } from 'react-router-dom';
import EmailDashboard from './EmailDashboard';

export default function EmailRoutes() {
  return (
    <Routes>
      <Route index element={<EmailDashboard />} />
      <Route path="*" element={<Navigate to="/admin/email" replace />} />
    </Routes>
  );
}
