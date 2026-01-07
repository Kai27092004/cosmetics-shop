import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Loading from '../../../components/common/Loading';

// Lazy load để code splitting (chỉ tải khi cần)
const ProductList = lazy(() => import('./ProductList'));
const ProductCreate = lazy(() => import('./ProductCreate'));
const ProductEdit = lazy(() => import('./ProductEdit'));

export default function ProductRoutes() {
  return (
    <Suspense fallback={<Loading fullScreen text="Đang tải..." />}>
      <Routes>
        <Route index element={<ProductList />} />
        <Route path="create" element={<ProductCreate />} />
        <Route path="edit/:id" element={<ProductEdit />} />
      </Routes>
    </Suspense>
  );
}