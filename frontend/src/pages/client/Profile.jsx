import { useState } from 'react';
import useAuth from '../../hooks/useAuth';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';

export default function Profile() {
  const { user, updateProfile, changePassword, logout } = useAuth();

  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'password' | 'orders'

  // Profile form
  const [profileData, setProfileData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
  });

  // Password form
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword:  '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]:  '' }));
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e. target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert(null);

    const result = await updateProfile(profileData);

    setLoading(false);

    if (result.success) {
      setAlert({ type: 'success', message:  'Cập nhật thông tin thành công!' });
    } else {
      setAlert({ type: 'error', message:  result.error || 'Cập nhật thất bại' });
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    // Validate
    const newErrors = {};
    if (! passwordData.oldPassword) newErrors.oldPassword = 'Vui lòng nhập mật khẩu cũ';
    if (!passwordData.newPassword) {
      newErrors.newPassword = 'Vui lòng nhập mật khẩu mới';
    } else if (passwordData.newPassword. length < 6) {
      newErrors.newPassword = 'Mật khẩu phải có ít nhất 6 ký tự';
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }

    if (Object. keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setAlert(null);

    const result = await changePassword({
      oldPassword: passwordData. oldPassword,
      newPassword:  passwordData.newPassword,
    });

    setLoading(false);

    if (result.success) {
      setAlert({ type: 'success', message: 'Đổi mật khẩu thành công!' });
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } else {
      setAlert({ type: 'error', message: result.error || 'Đổi mật khẩu thất bại' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg: px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Tài khoản của tôi
          </h1>
          <p className="text-gray-600">
            Quản lý thông tin cá nhân và đơn hàng
          </p>
        </div>

        {/* Alert */}
        {alert && (
          <div className="mb-6">
            <Alert
              type={alert.type}
              message={alert.message}
              onClose={() => setAlert(null)}
            />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              {/* User Info */}
              <div className="text-center mb-6 pb-6 border-b">
                <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-primary-600 font-bold text-3xl">
                    {user?. fullName?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <h3 className="font-bold text-gray-900">{user?.fullName}</h3>
                <p className="text-sm text-gray-600">{user?.email}</p>
              </div>

              {/* Menu */}
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                    activeTab === 'profile'
                      ? 'bg-primary-50 text-primary-600 font-semibold'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  📝 Thông tin cá nhân
                </button>

                <button
                  onClick={() => setActiveTab('password')}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                    activeTab === 'password'
                      ? 'bg-primary-50 text-primary-600 font-semibold'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  🔒 Đổi mật khẩu
                </button>

                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                    activeTab === 'orders'
                      ? 'bg-primary-50 text-primary-600 font-semibold'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  📦 Đơn hàng của tôi
                </button>

                <button
                  onClick={logout}
                  className="w-full text-left px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                >
                  🚪 Đăng xuất
                </button>
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow p-6">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Thông tin cá nhân
                  </h2>

                  <form onSubmit={handleProfileSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input
                        label="Họ và tên"
                        name="fullName"
                        value={profileData.fullName}
                        onChange={handleProfileChange}
                        error={errors.fullName}
                        disabled={loading}
                      />

                      <Input
                        label="Email"
                        name="email"
                        type="email"
                        value={profileData.email}
                        disabled
                      />

                      <Input
                        label="Số điện thoại"
                        name="phone"
                        type="tel"
                        value={profileData.phone}
                        onChange={handleProfileChange}
                        placeholder="0123456789"
                        disabled={loading}
                      />

                      <div className="md:col-span-2">
                        <Input
                          label="Địa chỉ"
                          name="address"
                          value={profileData.address}
                          onChange={handleProfileChange}
                          placeholder="Số nhà, tên đường, quận/huyện, tỉnh/thành phố"
                          disabled={loading}
                        />
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <Button
                        type="submit"
                        variant="primary"
                        loading={loading}
                        disabled={loading}
                      >
                        Lưu thay đổi
                      </Button>

                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => setProfileData({
                          fullName: user?.fullName || '',
                          email: user?.email || '',
                          phone: user?.phone || '',
                          address: user?. address || '',
                        })}
                        disabled={loading}
                      >
                        Hủy
                      </Button>
                    </div>
                  </form>
                </div>
              )}

              {/* Password Tab */}
              {activeTab === 'password' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Đổi mật khẩu
                  </h2>

                  <form onSubmit={handlePasswordSubmit} className="space-y-6 max-w-md">
                    <Input
                      label="Mật khẩu hiện tại"
                      name="oldPassword"
                      type="password"
                      value={passwordData.oldPassword}
                      onChange={handlePasswordChange}
                      error={errors.oldPassword}
                      placeholder="••••••••"
                      disabled={loading}
                    />

                    <Input
                      label="Mật khẩu mới"
                      name="newPassword"
                      type="password"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      error={errors.newPassword}
                      placeholder="••••••••"
                      disabled={loading}
                    />

                    <Input
                      label="Xác nhận mật khẩu mới"
                      name="confirmPassword"
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      error={errors.confirmPassword}
                      placeholder="••••••••"
                      disabled={loading}
                    />

                    <Button
                      type="submit"
                      variant="primary"
                      loading={loading}
                      disabled={loading}
                    >
                      Đổi mật khẩu
                    </Button>
                  </form>
                </div>
              )}

              {/* Orders Tab */}
              {activeTab === 'orders' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Đơn hàng của tôi
                  </h2>

                  <div className="text-center py-12">
                    <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-. 707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-. 707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                    <p className="text-gray-600 mb-4">Chức năng đang phát triển</p>
                    <p className="text-sm text-gray-500">
                      Tính năng xem lịch sử đơn hàng sẽ được cập nhật sớm
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}