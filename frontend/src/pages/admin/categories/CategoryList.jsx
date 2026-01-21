import { useState, useEffect } from 'react';
import categoryService from '../../../services/categoryService';
import CategoryTable from './components/CategoryTable';
import CategoryForm from './components/CategoryForm';
import Button from '../../../components/common/Button';
import showToast from '../../../utils/toast';
import Loading from '../../../components/common/Loading';
import Modal from '../../../components/common/Modal';

export default function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' | 'edit'
  const [currentCategory, setCurrentCategory] = useState(null);

  // Delete modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  // View modal
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [categoryToView, setCategoryToView] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await categoryService.getAllCategories();
      setCategories(data);
    } catch (error) {
      showToast.error(error.message || 'Không thể tải danh mục');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (mode, category = null) => {
    setModalMode(mode);
    setCurrentCategory(category);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentCategory(null);
  };

  const handleSubmit = async (categoryData) => {
    try {
      if (modalMode === 'create') {
        await categoryService.createCategory(categoryData);
        showToast.success('Thêm danh mục thành công!');
      } else {
        await categoryService.updateCategory(currentCategory.id, categoryData);
        showToast.success('Cập nhật danh mục thành công!');
      }
      handleCloseModal();
      fetchCategories();
    } catch (error) {
      showToast.error(error.message || 'Thao tác thất bại');
    }
  };

  const handleView = (category) => {
    setCategoryToView(category);
    setViewModalOpen(true);
  };

  const handleCloseViewModal = () => {
    setViewModalOpen(false);
    setCategoryToView(null);
  };

  const handleDelete = (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    setCategoryToDelete(category);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!categoryToDelete) return;

    try {
      await categoryService.deleteCategory(categoryToDelete.id);
      showToast.success('Xóa danh mục thành công!');
      setDeleteModalOpen(false);
      setCategoryToDelete(null);
      fetchCategories();
    } catch (error) {
      showToast.error(error.message || 'Xóa thất bại');
    }
  };

  const cancelDelete = () => {
    setDeleteModalOpen(false);
    setCategoryToDelete(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý danh mục</h1>
          <p className="text-gray-600 mt-1">
            Tổng cộng: <span className="font-semibold">{categories.length}</span> danh mục
          </p>
        </div>
        <Button
          variant="primary"
          size="lg"
          onClick={() => handleOpenModal('create')}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Thêm danh mục
        </Button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loading size="lg" text="Đang tải danh mục..." />
        </div>
      ) : (
        <CategoryTable
          categories={categories}
          onEdit={(category) => handleOpenModal('edit', category)}
          onDelete={handleDelete}
          onView={handleView}
        />
      )}

      {/* Create/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={modalMode === 'create' ? 'Thêm danh mục mới' : 'Chỉnh sửa danh mục'}
        size="md"
      >
        <CategoryForm
          initialData={currentCategory}
          onSubmit={handleSubmit}
          onCancel={handleCloseModal}
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
              Xác nhận xóa danh mục
            </h3>
            <p className="text-red-100">
              Hành động này không thể hoàn tác
            </p>
          </div>

          {/* Content */}
          <div className="p-6">
            {categoryToDelete && (
              <div className="space-y-4 mb-6">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-xl">
                        {categoryToDelete.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 font-medium">Tên danh mục</p>
                      <p className="text-lg font-bold text-gray-900">{categoryToDelete.name}</p>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">Số sản phẩm</p>
                    <p className="font-semibold text-indigo-600 text-sm">{categoryToDelete.productCount || 0} sản phẩm</p>
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
                        Danh mục sẽ bị xóa vĩnh viễn. Sản phẩm thuộc danh mục sẽ không bị xóa.
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

      {/* View Category Detail Modal */}
      <Modal
        isOpen={viewModalOpen}
        onClose={handleCloseViewModal}
        title=""
        size="lg"
      >
        {categoryToView && (
          <div className="relative">
            {/* Gradient Header */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-6">
              <div className="flex items-center gap-4 text-white">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                  <span className="text-3xl font-bold">
                    {categoryToView.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-indigo-100">Danh mục</p>
                  <h2 className="text-2xl font-bold">{categoryToView.name}</h2>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Product Count */}
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-5 border border-indigo-200">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  <h3 className="font-bold text-gray-900">Số sản phẩm</h3>
                </div>
                <p className="text-3xl font-bold text-indigo-600">
                  {categoryToView.productCount || 0} <span className="text-lg">sản phẩm</span>
                </p>
              </div>

              {/* Description */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                  </svg>
                  <h3 className="font-bold text-gray-900">Mô tả</h3>
                </div>
                <p className="text-gray-700 leading-relaxed bg-gray-50 rounded-lg p-4">
                  {categoryToView.description || 'Chưa có mô tả'}
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
                    handleOpenModal('edit', categoryToView);
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