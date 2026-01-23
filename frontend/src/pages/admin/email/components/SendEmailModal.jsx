import { useState, useEffect } from 'react';
import emailService from '../../../../services/emailService';
import userService from '../../../../services/userService';
import Modal from '../../../../components/common/Modal';
import Button from '../../../../components/common/Button';
import showToast from '../../../../utils/toast';

export default function SendEmailModal({ isOpen, onClose, onSuccess }) {
  const [loading, setLoading] = useState(true); // Bắt đầu với true
  const [users, setUsers] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [formData, setFormData] = useState({
    recipientType: 'all',
    selectedUsers: [],
    templateId: '',
    subject: '',
    content: ''
  });
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLoading(true); // Reset loading khi mở modal
      fetchData();
    }
  }, [isOpen]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [usersData, templatesData] = await Promise.all([
        userService.getAllUsers({}),
        emailService.getAllTemplates()
      ]);
      setUsers(usersData.filter(u => u.role === 'customer'));
      setTemplates(templatesData);
    } catch (error) {
      showToast.error('Không thể tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const handleTemplateChange = (templateId) => {
    const template = templates.find(t => t.id === parseInt(templateId));
    if (template) {
      setFormData({
        ...formData,
        templateId,
        subject: template.subject,
        content: template.content
      });
    } else {
      setFormData({ ...formData, templateId: '', subject: '', content: '' });
    }
  };

  const handleUserToggle = (userId) => {
    setFormData(prev => ({
      ...prev,
      selectedUsers: prev.selectedUsers.includes(userId)
        ? prev.selectedUsers.filter(id => id !== userId)
        : [...prev.selectedUsers, userId]
    }));
  };

  const handleSelectAll = () => {
    setFormData(prev => ({
      ...prev,
      selectedUsers: prev.selectedUsers.length === users.length ? [] : users.map(u => u.id)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('📤 Submitting email:', formData);
    
    if (!formData.subject || !formData.content) {
      showToast.error('Vui lòng nhập tiêu đề và nội dung email');
      return;
    }
    if (formData.recipientType === 'selected' && formData.selectedUsers.length === 0) {
      showToast.error('Vui lòng chọn ít nhất một người nhận');
      return;
    }

    try {
      setSending(true);
      if (formData.recipientType === 'all') {
        console.log('📧 Sending to all customers...');
        const result = await emailService.sendEmailToAllCustomers({
          subject: formData.subject,
          content: formData.content,
          templateId: formData.templateId || null
        });
        console.log('✅ Email sent:', result);
      } else {
        const recipients = users
          .filter(u => formData.selectedUsers.includes(u.id))
          .map(u => ({ userId: u.id, email: u.email, name: u.fullName }));
        console.log('📧 Sending to selected users:', recipients.length);
        const result = await emailService.sendEmail({
          recipients,
          subject: formData.subject,
          content: formData.content,
          templateId: formData.templateId || null
        });
        console.log('✅ Email sent:', result);
      }
      showToast.success('Gửi email thành công!');
      onClose();
      setFormData({
        recipientType: 'all',
        selectedUsers: [],
        templateId: '',
        subject: '',
        content: ''
      });
      onSuccess();
    } catch (error) {
      console.error('❌ Send email error:', error);
      showToast.error(error.message || 'Gửi email thất bại');
    } finally {
      setSending(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="" size="2xl" noPadding={true} showCloseButton={false}>
      <div className="relative">
        <div className="bg-gradient-to-r from-pink-500 to-purple-600 px-6 py-6">
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-3xl">
                📧
              </div>
              <div>
                <h2 className="text-2xl font-bold">Gửi Email</h2>
                <p className="text-pink-100">Gửi email thông báo cho khách hàng</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-pink-200 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Loading Overlay */}
        {loading && (
          <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-10 rounded-b-lg">
            <div className="text-center">
              <div className="animate-spin w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full mx-auto"></div>
              <p className="text-gray-600 mt-4 font-semibold">Đang tải dữ liệu...</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[600px] overflow-y-auto">
          {/* Recipient Type */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Người nhận</h3>
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-pink-500 transition-colors">
                  <input
                    type="radio"
                    name="recipientType"
                    value="all"
                    checked={formData.recipientType === 'all'}
                    onChange={(e) => setFormData({ ...formData, recipientType: e.target.value })}
                    className="w-5 h-5 text-pink-600"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">Tất cả khách hàng</p>
                    <p className="text-sm text-gray-600">Gửi email cho {users.length} khách hàng</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-pink-500 transition-colors">
                  <input
                    type="radio"
                    name="recipientType"
                    value="selected"
                    checked={formData.recipientType === 'selected'}
                    onChange={(e) => setFormData({ ...formData, recipientType: e.target.value })}
                    className="w-5 h-5 text-pink-600"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">Chọn khách hàng</p>
                    <p className="text-sm text-gray-600">Chọn từng khách hàng cụ thể</p>
                  </div>
                </label>
              </div>

              {/* User Selection */}
              {formData.recipientType === 'selected' && (
                <div className="mt-4 border-t pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-semibold text-gray-700">
                      Đã chọn: {formData.selectedUsers.length}/{users.length}
                    </p>
                    <button
                      type="button"
                      onClick={handleSelectAll}
                      className="text-sm text-pink-600 hover:text-pink-700 font-semibold"
                    >
                      {formData.selectedUsers.length === users.length ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
                    </button>
                  </div>
                  <div className="max-h-64 overflow-y-auto space-y-2">
                    {users.map(user => (
                      <label
                        key={user.id}
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={formData.selectedUsers.includes(user.id)}
                          onChange={() => handleUserToggle(user.id)}
                          className="w-4 h-4 text-pink-600"
                        />
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 text-sm">{user.fullName}</p>
                          <p className="text-xs text-gray-600">{user.email}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Template Selection */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Mẫu email (tùy chọn)</h3>
              <select
                value={formData.templateId}
                onChange={(e) => handleTemplateChange(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
              >
                <option value="">Không sử dụng mẫu</option>
                {templates.map(template => (
                  <option key={template.id} value={template.id}>
                    {template.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Email Content */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900">Nội dung email</h3>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tiêu đề <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                  placeholder="Nhập tiêu đề email"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nội dung <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={12}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 font-mono text-sm"
                  placeholder="Nhập nội dung email (HTML)"
                  required
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-4 border-t">
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
                className="flex-1"
                disabled={sending}
              >
                Hủy
              </Button>
              <button
                type="submit"
                disabled={sending}
                className="flex-1 py-3 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold rounded-lg transition-colors disabled:opacity-50"
              >
                {sending ? 'Đang gửi...' : 'Gửi Email'}
              </button>
            </div>
          </form>
      </div>
    </Modal>
  );
}
