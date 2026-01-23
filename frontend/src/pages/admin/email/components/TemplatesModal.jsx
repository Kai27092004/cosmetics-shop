import { useState, useEffect } from 'react';
import emailService from '../../../../services/emailService';
import Modal from '../../../../components/common/Modal';
import Button from '../../../../components/common/Button';
import showToast from '../../../../utils/toast';

export default function TemplatesModal({ isOpen, onClose, onSuccess }) {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [templatesModalOpen, setTemplatesModalOpen] = useState(false);
  
  // Form modal
  const [formOpen, setFormOpen] = useState(false);
  const [mode, setMode] = useState('create');
  const [selected, setSelected] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    content: '',
    description: ''
  });
  const [submitting, setSubmitting] = useState(false);

  // Delete modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  // View modal
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [toView, setToView] = useState(null);

  useEffect(() => {
    setTemplatesModalOpen(isOpen);
    if (isOpen) {
      setLoading(true);
      fetchTemplates();
    }
  }, [isOpen]);

  const fetchTemplates = async () => {
    try {
      const data = await emailService.getAllTemplates();
      setTemplates(data);
    } catch (error) {
      showToast.error('Không thể tải mẫu email');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    console.log('📝 Creating new template');
    setMode('create');
    setSelected(null);
    setFormData({ name: '', subject: '', content: '', description: '' });
    setTemplatesModalOpen(false); // Đóng modal chính
    setTimeout(() => setFormOpen(true), 100); // Mở form modal sau một chút
  };

  const handleEdit = (template) => {
    setMode('edit');
    setSelected(template);
    setFormData({
      name: template.name,
      subject: template.subject,
      content: template.content,
      description: template.description || ''
    });
    setTemplatesModalOpen(false); // Đóng modal chính
    setTimeout(() => setFormOpen(true), 100); // Mở form modal sau một chút
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setTimeout(() => setTemplatesModalOpen(true), 100); // Mở lại modal chính
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('📤 Submitting template:', formData);
    
    if (!formData.name || !formData.subject || !formData.content) {
      showToast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    try {
      setSubmitting(true);
      if (mode === 'create') {
        console.log('➕ Creating template...');
        const result = await emailService.createTemplate(formData);
        console.log('✅ Template created:', result);
        showToast.success('Tạo mẫu email thành công!');
      } else {
        console.log('✏️ Updating template:', selected.id);
        const result = await emailService.updateTemplate(selected.id, formData);
        console.log('✅ Template updated:', result);
        showToast.success('Cập nhật mẫu email thành công!');
      }
      setFormOpen(false);
      await fetchTemplates();
      setTimeout(() => setTemplatesModalOpen(true), 100); // Mở lại modal chính
      onSuccess();
    } catch (error) {
      console.error('❌ Template submit error:', error);
      showToast.error(error.message || 'Lưu mẫu email thất bại');
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    try {
      await emailService.deleteTemplate(toDelete.id);
      showToast.success('Xóa mẫu email thành công!');
      setDeleteModalOpen(false);
      setToDelete(null);
      await fetchTemplates();
      setTimeout(() => setTemplatesModalOpen(true), 100);
      onSuccess();
    } catch (error) {
      showToast.error(error.message || 'Xóa mẫu email thất bại');
    }
  };

  return (
    <>
      <Modal isOpen={templatesModalOpen} onClose={onClose} title="" size="2xl" noPadding={true} showCloseButton={false}>
        <div className="relative">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-6">
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-3xl">
                  📝
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Mẫu Email</h2>
                  <p className="text-blue-100">Quản lý các mẫu email</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="secondary" onClick={handleCreate} className="bg-white text-blue-600 hover:bg-blue-50 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Tạo mẫu
                </Button>
                <button
                  onClick={onClose}
                  className="text-white hover:text-blue-200 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div className="p-6 max-h-[600px] overflow-y-auto">
            {/* Loading Overlay */}
            {loading && (
              <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-10">
                <div className="text-center">
                  <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
                  <p className="text-gray-600 mt-4 font-semibold">Đang tải...</p>
                </div>
              </div>
            )}

            {templates.length === 0 && !loading ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Chưa có mẫu email nào</h3>
                <p className="text-gray-600 mb-6">Tạo mẫu email đầu tiên để bắt đầu</p>
                <Button variant="primary" onClick={handleCreate}>
                  Tạo mẫu đầu tiên
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white text-xl">
                        📧
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => { setToView(template); setTemplatesModalOpen(false); setTimeout(() => setViewModalOpen(true), 100); }}
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleEdit(template)}
                          className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => { setToDelete(template); setTemplatesModalOpen(false); setTimeout(() => setDeleteModalOpen(true), 100); }}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <h3 className="font-bold text-gray-900 mb-1">{template.name}</h3>
                    <p className="text-xs text-gray-600 mb-2 line-clamp-2">{template.description || 'Không có mô tả'}</p>
                    <div className="bg-white rounded-lg p-2">
                      <p className="text-xs text-gray-500">Tiêu đề</p>
                      <p className="text-sm font-semibold text-gray-900 line-clamp-1">{template.subject}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </Modal>

      {/* Form Modal */}
      <Modal isOpen={formOpen} onClose={handleCloseForm} title={mode === 'create' ? 'Tạo mẫu email mới' : 'Chỉnh sửa mẫu email'} size="2xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tên mẫu <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
              placeholder="VD: Chào mừng khách hàng mới"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tiêu đề email <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
              placeholder="VD: Chào mừng bạn đến với cửa hàng"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Mô tả
            </label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
              placeholder="Mô tả ngắn về mẫu email này"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Nội dung email <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={10}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent font-mono text-sm transition-all"
              placeholder="Nội dung HTML của email. Có thể sử dụng biến: {{customerName}}, {{email}}"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              💡 Sử dụng biến: <code className="bg-gray-100 px-1 py-0.5 rounded">{'{{customerName}}'}</code>, <code className="bg-gray-100 px-1 py-0.5 rounded">{'{{email}}'}</code>
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={handleCloseForm}
              className="flex-1"
              disabled={submitting}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="flex-1"
              disabled={submitting}
            >
              {submitting ? 'Đang lưu...' : (mode === 'create' ? 'Tạo mẫu' : 'Cập nhật')}
            </Button>
          </div>
        </form>
      </Modal>

      {/* View Modal */}
      <Modal isOpen={viewModalOpen} onClose={() => { setViewModalOpen(false); setTimeout(() => setTemplatesModalOpen(true), 100); }} title="" size="2xl">
        {toView && (
          <div className="relative">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-6">
              <div className="flex items-center gap-4 text-white">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-3xl">
                  📧
                </div>
                <div className="flex-1">
                  <p className="text-sm text-blue-100">Mẫu email</p>
                  <h2 className="text-2xl font-bold">{toView.name}</h2>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
                <p className="text-xs text-gray-600 mb-1">Tiêu đề email</p>
                <p className="text-lg font-bold text-gray-900">{toView.subject}</p>
              </div>

              {toView.description && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-600 mb-1">Mô tả</p>
                  <p className="text-sm text-gray-900">{toView.description}</p>
                </div>
              )}

              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">Nội dung email</p>
                <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
                  <pre className="text-xs text-gray-700 whitespace-pre-wrap font-mono">
                    {toView.content}
                  </pre>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button variant="secondary" onClick={() => { setViewModalOpen(false); setTimeout(() => setTemplatesModalOpen(true), 100); }}>
                  Đóng
                </Button>
                <button
                  onClick={() => {
                    setViewModalOpen(false);
                    handleEdit(toView);
                  }}
                  className="px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold rounded-lg transition-colors"
                >
                  Chỉnh sửa
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Modal */}
      <Modal isOpen={deleteModalOpen} onClose={() => { setDeleteModalOpen(false); setTimeout(() => setTemplatesModalOpen(true), 100); }} title="" size="md">
        <div className="relative overflow-hidden">
          <div className="bg-gradient-to-r from-red-500 to-pink-500 px-6 py-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-4">
              <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Xác nhận xóa mẫu email</h3>
            <p className="text-red-100">Hành động này không thể hoàn tác</p>
          </div>

          <div className="p-6">
            {toDelete && (
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <p className="text-sm text-gray-600 mb-1">Tên mẫu</p>
                <p className="text-lg font-bold text-gray-900">{toDelete.name}</p>
              </div>
            )}

            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={() => { setDeleteModalOpen(false); setTimeout(() => setTemplatesModalOpen(true), 100); }}
                className="flex-1"
              >
                Hủy
              </Button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-3 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold rounded-lg transition-colors"
              >
                Xác nhận xóa
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
