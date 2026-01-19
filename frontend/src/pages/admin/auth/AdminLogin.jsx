import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';
import showToast from '../../../utils/toast';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { adminLogin } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Hiển thị thông báo nếu token hết hạn
  useEffect(() => {
    const expired = searchParams.get('expired');
    if (expired === 'true') {
      showToast.warning('Phiên đăng nhập admin đã hết hạn. Vui lòng đăng nhập lại!');
      // Xóa query param
      searchParams.delete('expired');
      navigate({ search: searchParams.toString() }, { replace: true });
    }
  }, [searchParams, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Vui lòng nhập email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (!formData.password) {
      newErrors.password = 'Vui lòng nhập mật khẩu';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    const result = await adminLogin({
      email: formData.email,
      password: formData.password,
    });

    setLoading(false);

    if (result.success) {
      showToast.success('Đăng nhập thành công!');
      setTimeout(() => {
        navigate('/admin/dashboard');
      }, 1000);
    } else {
      showToast.error(result.error || 'Đăng nhập thất bại.  Vui lòng kiểm tra email và mật khẩu.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-4xl">👑</span>
            </div>
          </div>
          <h2 className="text-4xl font-bold text-white mb-2">
            Admin Portal
          </h2>
          <p className="text-indigo-100">
            Cosmetics Shop Management System
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Đăng nhập quản trị
          </h3>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Email Admin"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              placeholder="admin@cosmetics-shop.com"
              required
              disabled={loading}
            />

            <Input
              label="Mật khẩu"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              placeholder="••••••••"
              required
              disabled={loading}
            />

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <span className="ml-2 text-sm text-gray-600">
                  Ghi nhớ đăng nhập
                </span>
              </label>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={loading}
              disabled={loading}
              className="! bg-gradient-to-r ! from-indigo-600 !to-purple-600 hover:!from-indigo-700 hover:!to-purple-700"
            >
              Đăng nhập
            </Button>
          </form>

          {/* Info */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="text-center text-sm text-gray-600">
              <p className="mb-2">🔒 Khu vực dành riêng cho quản trị viên</p>
              <p className="text-xs text-gray-500">
                Chỉ tài khoản admin mới có thể truy cập
              </p>
            </div>
          </div>
        </div>

        {/* Back to home */}
        <div className="mt-6 text-center">
          <a
            href="/"
            className="text-white hover:text-indigo-100 font-medium text-sm flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Quay về trang chủ
          </a>
        </div>
      </div>
    </div>
  );
}