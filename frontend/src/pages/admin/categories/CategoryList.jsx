import { useState, useEffect } from 'react';
import categoryService from '../../../services/categoryService';
import CategoryTable from './components/CategoryTable';
import CategoryForm from './components/CategoryForm';
import Button from '../../../components/common/Button';
import Alert from '../../../components/common/Alert';
import Loading from '../../../components/common/Loading';
import Modal from '../../../components/common/Modal';

export default function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' | 'edit'
  const [currentCategory, setCurrentCategory] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await categoryService.getAllCategories();
      setCategories(data);
    } catch (error) {
      setAlert({ type: 'error', message: error.message || 'Không thể tải danh mục' });
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
        setAlert({ type: 'success', message: 'Thêm danh mục thành công!' });
      } else {
        await categoryService.updateCategory(currentCategory.id, categoryData);
        setAlert({ type: 'success', message: 'Cập nhật danh mục thành công!' });
      }
      handleCloseModal();
      fetchCategories();
    } catch (error) {
      setAlert({ type: 'error', message: error.message || 'Thao tác thất bại' });
    }
  };

  const handleDelete = async (categoryId) => {
    if (!window.confirm('Bạn có chắc muốn xóa danh mục này? Sản phẩm thuộc danh mục sẽ không bị xóa.')) {
      return;
    }

    try {
      await categoryService.deleteCategory(categoryId);
      setAlert({ type: 'success', message: 'Xóa danh mục thành công!' });
      fetchCategories();
    } catch (error) {
      setAlert({ type: 'error', message: error.message || 'Xóa thất bại' });
    }
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

      {/* Alert */}
      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

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
        />
      )}

      {/* Modal */}
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
    </div>
  );
}