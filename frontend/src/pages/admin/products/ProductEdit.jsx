import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import productService from '../../../services/productService';
import ProductForm from './ProductForm';
import Button from '../../../components/common/Button';
import Alert from '../../../components/common/Alert';
import Loading from '../../../components/common/Loading';

export default function ProductEdit() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const data = await productService.getProductById(id);
      setProduct(data);
    } catch (error) {
      setAlert({ type: 'error', message: 'Không thể tải thông tin sản phẩm' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (productData) => {
    try {
      setSubmitting(true);
      await productService.updateProduct(id, productData);
      setAlert({ type: 'success', message: 'Cập nhật sản phẩm thành công!' });
      
      setTimeout(() => {
        navigate('/admin/products');
      }, 1500);
    } catch (error) {
      setAlert({ type: 'error', message: error.message || 'Cập nhật thất bại' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (window. confirm('Bạn có chắc muốn hủy? Thay đổi sẽ không được lưu.')) {
      navigate('/admin/products');
    }
  };

  if (loading) {
    return <Loading fullScreen text="Đang tải sản phẩm..." />;
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">Không tìm thấy sản phẩm</p>
        <Button onClick={() => navigate('/admin/products')}>
          Quay lại danh sách
        </Button>
      </div>
    );
  }

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
          <h1 className="text-3xl font-bold text-gray-900">Chỉnh sửa sản phẩm</h1>
          <p className="text-gray-600 mt-1">#{product.id} - {product.name}</p>
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
          initialData={product}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={submitting}
          submitText="Cập nhật sản phẩm"
        />
      </div>
    </div>
  );
}