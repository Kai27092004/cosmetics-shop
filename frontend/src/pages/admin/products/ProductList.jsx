import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import productService from '../../../services/productService';
import ProductTable from './ProductTable';
import ProductFilters from './ProductFilters';
import ProductStats from './ProductStats';
import Button from '../../../components/common/Button';
import showToast from '../../../utils/toast';
import Loading from '../../../components/common/Loading';

export default function ProductList() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    categoryId: '',
    sortBy:  'createdAt',
  });

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getAllProducts(filters);
      setProducts(data);
    } catch (error) {
      showToast.error(error.message || 'Không thể tải sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    if (! window.confirm('Bạn có chắc muốn xóa sản phẩm này? ')) return;

    try {
      await productService.deleteProduct(productId);
      showToast.success('Xóa sản phẩm thành công!');
      fetchProducts();
    } catch (error) {
      showToast.error(error.message || 'Xóa thất bại');
    }
  };

  const handleEdit = (productId) => {
    navigate(`/admin/products/edit/${productId}`);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý sản phẩm</h1>
          <p className="text-gray-600 mt-1">
            Quản lý danh sách sản phẩm, giá cả và tồn kho
          </p>
        </div>
        <Button
          variant="primary"
          size="lg"
          onClick={() => navigate('/admin/products/create')}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Thêm sản phẩm
        </Button>
      </div>

      {/* Stats */}
      <ProductStats products={products} />

      {/* Filters */}
      <ProductFilters
        filters={filters}
        onFilterChange={handleFilterChange}
      />

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loading size="lg" text="Đang tải sản phẩm..." />
        </div>
      ) : (
        <ProductTable
          products={products}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}