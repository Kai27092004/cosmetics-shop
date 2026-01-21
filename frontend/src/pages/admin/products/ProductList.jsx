import { useState, useEffect } from 'react';
import productService from '../../../services/productService';
import ProductTable from './ProductTable';
import ProductFilters from './ProductFilters';
import ProductStats from './ProductStats';
import ProductForm from './ProductForm';
import Button from '../../../components/common/Button';
import Modal from '../../../components/common/Modal';
import showToast from '../../../utils/toast';
import Loading from '../../../components/common/Loading';

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true); // Only for first load
  const [searching, setSearching] = useState(false); // For search/filter updates
  const [filters, setFilters] = useState({
    search: '',
    categoryId: '',
    sortBy: 'createdAt',
  });

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Delete confirmation modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const fetchProducts = async () => {
    try {
      setSearching(true);
      const data = await productService.getAllProducts(filters);

      // Apply client-side sorting
      let sortedData = [...data];

      switch (filters.sortBy) {
        case 'name':
          sortedData.sort((a, b) => a.name.localeCompare(b.name, 'vi'));
          break;
        case 'price-asc':
          sortedData.sort((a, b) => a.price - b.price);
          break;
        case 'price-desc':
          sortedData.sort((a, b) => b.price - a.price);
          break;
        case 'stock-asc':
          sortedData.sort((a, b) => a.stockQuantity - b.stockQuantity);
          break;
        case 'stock-desc':
          sortedData.sort((a, b) => b.stockQuantity - a.stockQuantity);
          break;
        case 'createdAt':
        default:
          // Newest first (assuming higher ID = newer)
          sortedData.sort((a, b) => b.id - a.id);
          break;
      }

      setProducts(sortedData);
      setInitialLoading(false); // Only set to false after first successful load
    } catch (error) {
      showToast.error(error.message || 'Không thể tải sản phẩm');
      setInitialLoading(false);
    } finally {
      setSearching(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleDelete = (productId) => {
    // Find product to show in confirmation
    const product = products.find(p => p.id === productId);
    setProductToDelete(product);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;

    try {
      await productService.deleteProduct(productToDelete.id);
      showToast.success('Xóa sản phẩm thành công!');
      setDeleteModalOpen(false);
      setProductToDelete(null);
      fetchProducts();
    } catch (error) {
      showToast.error(error.message || 'Xóa thất bại');
    }
  };

  const cancelDelete = () => {
    setDeleteModalOpen(false);
    setProductToDelete(null);
  };

  const handleCreate = () => {
    setModalMode('create');
    setSelectedProduct(null);
    setModalOpen(true);
  };

  const handleEdit = (product) => {
    setModalMode('edit');
    setSelectedProduct(product);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedProduct(null);
  };

  const handleSaveProduct = async (productData) => {
    try {
      setSubmitting(true);
      if (modalMode === 'create') {
        await productService.createProduct(productData);
        showToast.success('Thêm sản phẩm thành công!');
      } else {
        await productService.updateProduct(selectedProduct.id, productData);
        showToast.success('Cập nhật sản phẩm thành công!');
      }
      handleCloseModal();
      fetchProducts(); // Refresh list
    } catch (error) {
      showToast.error(error.message || 'Lưu sản phẩm thất bại');
    } finally {
      setSubmitting(false);
    }
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
          onClick={handleCreate}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Thêm sản phẩm
        </Button>
      </div>

      {/* Stats */}
      <ProductStats products={products} />

      {/* Filters with searching indicator */}
      <div className="relative">
        {searching && (
          <div className="absolute top-4 right-4 z-10 flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-full text-sm font-medium shadow-sm">
            <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Đang tìm kiếm...
          </div>
        )}
        <ProductFilters
          filters={filters}
          onFilterChange={handleFilterChange}
        />
      </div>

      {/* Table */}
      {initialLoading ? (
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

      {/* Product Form Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        title={modalMode === 'create' ? 'Thêm sản phẩm mới' : 'Chỉnh sửa sản phẩm'}
        size="2xl"
      >
        <ProductForm
          initialData={selectedProduct}
          onSubmit={handleSaveProduct}
          onCancel={handleCloseModal}
          loading={submitting}
          submitText={modalMode === 'create' ? 'Thêm sản phẩm' : 'Cập nhật'}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={cancelDelete}
        title="Xác nhận xóa sản phẩm"
        size="md"
      >
        <div className="p-6">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>

          <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
            Bạn có chắc chắn muốn xóa sản phẩm này?
          </h3>

          {productToDelete && (
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <p className="text-sm text-gray-600 mb-1">Tên sản phẩm:</p>
              <p className="font-semibold text-gray-900">{productToDelete.name}</p>
            </div>
          )}

          <p className="text-sm text-gray-600 text-center mb-6">
            Hành động này không thể hoàn tác. Sản phẩm sẽ bị xóa vĩnh viễn khỏi hệ thống.
          </p>

          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={cancelDelete}
              className="flex-1"
            >
              Hủy
            </Button>
            <Button
              variant="danger"
              onClick={confirmDelete}
              className="flex-1"
            >
              Xóa sản phẩm
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}