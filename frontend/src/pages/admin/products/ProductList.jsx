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

  // View detail modal
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [productToView, setProductToView] = useState(null);

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

  const handleView = (product) => {
    setProductToView(product);
    setViewModalOpen(true);
  };

  const handleCloseViewModal = () => {
    setViewModalOpen(false);
    setProductToView(null);
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
          onView={handleView}
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

      {/* Delete Confirmation Modal - Modern Design */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={cancelDelete}
        title=""
        size="md"
      >
        <div className="relative overflow-hidden">
          {/* Gradient Header */}
          <div className="bg-gradient-to-r from-red-500 to-pink-500 px-6 py-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-4 animate-bounce">
              <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">
              Xác nhận xóa sản phẩm
            </h3>
            <p className="text-red-100">
              Hành động này không thể hoàn tác
            </p>
          </div>

          {/* Content */}
          <div className="p-6">
            {productToDelete && (
              <div className="space-y-4 mb-6">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={`http://localhost:5000${productToDelete.imageUrl}`}
                      alt={productToDelete.name}
                      className="w-16 h-16 object-cover rounded-lg"
                      onError={(e) => e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="64" height="64"%3E%3Crect fill="%23f0f0f0" width="64" height="64"/%3E%3C/svg%3E'}
                    />
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 font-medium">Tên sản phẩm</p>
                      <p className="text-lg font-bold text-gray-900">{productToDelete.name}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white rounded-lg p-3">
                      <p className="text-xs text-gray-500 mb-1">Giá bán</p>
                      <p className="font-bold text-red-600 text-sm">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(productToDelete.price)}
                      </p>
                    </div>
                    <div className="bg-white rounded-lg p-3">
                      <p className="text-xs text-gray-500 mb-1">Tồn kho</p>
                      <p className="font-semibold text-gray-900 text-sm">{productToDelete.stockQuantity} sản phẩm</p>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="font-semibold text-yellow-800 text-sm">Lưu ý quan trọng</p>
                      <p className="text-yellow-700 text-xs mt-1">
                        Sản phẩm sẽ bị xóa vĩnh viễn khỏi hệ thống và không thể khôi phục.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={cancelDelete}
                className="flex-1 py-3"
              >
                <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Hủy bỏ
              </Button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-3 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold rounded-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Xác nhận xóa
              </button>
            </div>
          </div>
        </div>
      </Modal>

      {/* View Product Detail Modal */}
      <Modal
        isOpen={viewModalOpen}
        onClose={handleCloseViewModal}
        title=""
        size="2xl"
      >
        {productToView && (
          <div className="relative">
            {/* Gradient Header */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-6">
              <div className="flex items-center gap-4 text-white">
                <img
                  src={`http://localhost:5000${productToView.imageUrl}`}
                  alt={productToView.name}
                  className="w-20 h-20 object-cover rounded-lg border-4 border-white/30"
                  onError={(e) => e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="80" height="80"%3E%3Crect fill="%23f0f0f0" width="80" height="80"/%3E%3C/svg%3E'}
                />
                <div className="flex-1">
                  <p className="text-sm text-indigo-100">Sản phẩm</p>
                  <h2 className="text-2xl font-bold">{productToView.name}</h2>
                </div>
                <div className={`px-4 py-2 rounded-full font-semibold ${productToView.stockQuantity > 0
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                  }`}>
                  {productToView.stockQuantity > 0 ? '✓ Còn hàng' : '✗ Hết hàng'}
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Price & Stock */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="font-bold text-gray-900">Giá bán</h3>
                  </div>
                  <p className="text-3xl font-bold text-green-600">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(productToView.price)}
                  </p>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    <h3 className="font-bold text-gray-900">Tồn kho</h3>
                  </div>
                  <p className="text-3xl font-bold text-blue-600">
                    {productToView.stockQuantity} <span className="text-lg">sản phẩm</span>
                  </p>
                </div>
              </div>

              {/* Category */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-5 border border-purple-200">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  <h3 className="font-bold text-gray-900">Danh mục</h3>
                </div>
                <p className="text-lg font-semibold text-purple-700">{productToView.category?.name || 'Chưa phân loại'}</p>
              </div>

              {/* Description */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                  </svg>
                  <h3 className="font-bold text-gray-900">Mô tả sản phẩm</h3>
                </div>
                <p className="text-gray-700 leading-relaxed bg-gray-50 rounded-lg p-4">
                  {productToView.description || 'Chưa có mô tả'}
                </p>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button variant="secondary" onClick={handleCloseViewModal} className="px-6">
                  Đóng
                </Button>
                <button
                  onClick={() => {
                    handleCloseViewModal();
                    handleEdit(productToView);
                  }}
                  className="px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold rounded-lg transition-all transform hover:scale-105 flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Chỉnh sửa
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}