import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Loading from '../../../components/common/Loading';

// Lazy load
const OrderList = lazy(() => import('./OrderList'));
const OrderDetail = lazy(() => import('./OrderDetail'));

export default function OrderRoutes() {
  return (
    <Suspense fallback={<Loading fullScreen text="Đang tải..." />}>
      <Routes>
        <Route index element={<OrderList />} />
        <Route path=":id" element={<OrderDetail />} />
      </Routes>
    </Suspense>
  );
}