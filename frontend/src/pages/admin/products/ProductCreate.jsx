import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import productService from '../../../services/productService';
import ProductForm from './ProductForm';
import Button from '../../../components/common/Button';
import Alert from '../../../components/common/Alert';

export default function ProductCreate() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const handleSubmit = async (productData) => {
    try {
      setLoading(true);
      await productService.createProduct(productData);
      setAlert({ type: 'success', message: 'Thêm sản phẩm thành công!' });
      
      // Redirect về danh sách sau 1. 5s
      setTimeout(() => {
        navigate('/admin/products');
      }, 1500);
    } catch (error) {
      setAlert({ type: 'error', message: error.message || 'Thêm sản phẩm thất bại' });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm('Bạn có chắc muốn hủy?  Dữ liệu sẽ không được lưu.')) {
      navigate('/admin/products');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="secondary"
          onClick={() => navigate('/admin/products')}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Quay lại
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Thêm sản phẩm mới</h1>
          <p className="text-gray-600 mt-1">Điền thông tin sản phẩm vào form bên dưới</p>
        </div>
      </div>

      {/* Alert */}
      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      {/* Form */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <ProductForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={loading}
          submitText="Thêm sản phẩm"
        />
      </div>
    </div>
  );
}