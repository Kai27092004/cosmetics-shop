import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import orderService from '../../services/orderService';
import { formatCurrency } from '../../utils/formatters';
import { getImageUrl } from '../../utils/helpers';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import showToast from '../../utils/toast';
import Loading from '../../components/common/Loading';

export default function Profile() {
  const location = useLocation();
  const { user, updateProfile, changePassword, logout } = useAuth();

  // Nếu có state từ navigation, dùng nó. Nếu không, mặc định là 'profile'
  const [activeTab, setActiveTab] = useState(location.state?.activeTab || 'profile');
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  const [profileData, setProfileData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Đọc state từ navigation để mở tab tương ứng
  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state]);

  useEffect(() => {
    if (activeTab === 'orders' && orders.length === 0) {
      fetchOrders();
    }
  }, [activeTab]);

  const fetchOrders = async () => {
    try {
      setLoadingOrders(true);
      const data = await orderService.getMyOrders();
      setOrders(data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      showToast.error('Không thể tải đơn hàng');
    } finally {
      setLoadingOrders(false);
    }
  };

  const getOrderStatusText = (status) => {
    const statusMap = {
      pending: { text: 'Chờ xác nhận', color: 'text-yellow-600 bg-yellow-100' },
      confirmed: { text: 'Đã xác nhận', color: 'text-blue-600 bg-blue-100' },
      shipping: { text: 'Đang giao', color: 'text-purple-600 bg-purple-100' },
      delivered: { text: 'Đã giao', color: 'text-green-600 bg-green-100' },
      cancelled: { text: 'Đã hủy', color: 'text-red-600 bg-red-100' },
    };
    return statusMap[status] || { text: status, color: 'text-gray-600 bg-gray-100' };
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await updateProfile(profileData);
    setLoading(false);

    if (result.success) {
      showToast.success('Cập nhật thông tin thành công!');
    } else {
      showToast.error(result.error || 'Cập nhật thất bại');
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!passwordData.oldPassword) newErrors.oldPassword = 'Vui lòng nhập mật khẩu cũ';
    if (!passwordData.newPassword) {
      newErrors.newPassword = 'Vui lòng nhập mật khẩu mới';
    } else if (passwordData.newPassword.length < 6) {
      newErrors.newPassword = 'Mật khẩu phải có ít nhất 6 ký tự';
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    const result = await changePassword({
      oldPassword: passwordData.oldPassword,
      newPassword: passwordData.newPassword,
    });

    setLoading(false);

    if (result.success) {
      showToast.success('Đổi mật khẩu thành công!');
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
      setErrors({});
    } else {
      showToast.error(result.error || 'Đổi mật khẩu thất bại');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Tài khoản của tôi</h1>
        <p className="text-gray-600 mb-8">Quản lý thông tin cá nhân và đơn hàng</p>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              {/* User Info */}
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-3xl">
                    {user?.fullName?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-gray-900">{user?.fullName}</h2>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>

              {/* Navigation */}
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${
                    activeTab === 'profile'
                      ? 'bg-primary-50 text-primary-600 font-semibold'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span>👤</span>
                  Thông tin cá nhân
                </button>

                <button
                  onClick={() => setActiveTab('password')}
                  className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${
                    activeTab === 'password'
                      ? 'bg-primary-50 text-primary-600 font-semibold'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span>🔒</span>
                  Đổi mật khẩu
                </button>

                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${
                    activeTab === 'orders'
                      ? 'bg-primary-50 text-primary-600 font-semibold'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span>📦</span>
                  Đơn hàng của tôi
                </button>

                <button
                  onClick={logout}
                  className="w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 text-red-600 hover:bg-red-50 transition-colors"
                >
                  <span>🚪</span>
                  Đăng xuất
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow p-8">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Thông tin cá nhân</h2>

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
                      <Button type="submit" variant="primary" loading={loading} disabled={loading}>
                        Lưu thay đổi
                      </Button>

                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => setProfileData({
                          fullName: user?.fullName || '',
                          email: user?.email || '',
                          phone: user?.phone || '',
                          address: user?.address || '',
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
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Đổi mật khẩu</h2>

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

                    <Button type="submit" variant="primary" loading={loading} disabled={loading}>
                      Đổi mật khẩu
                    </Button>
                  </form>
                </div>
              )}

              {/* Orders Tab */}
              {activeTab === 'orders' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Đơn hàng của tôi</h2>

                  {loadingOrders ? (
                    <div className="text-center py-12">
                      <Loading size="lg" text="Đang tải đơn hàng..." />
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-12">
                      <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                      </svg>
                      <p className="text-gray-600 mb-4">Bạn chưa có đơn hàng nào</p>
                      <p className="text-sm text-gray-500">Hãy bắt đầu mua sắm để xem đơn hàng tại đây</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => {
                        const statusInfo = getOrderStatusText(order.status);
                        return (
                          <div key={order.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-4 pb-4 border-b">
                              <div>
                                <p className="text-sm text-gray-500">Mã đơn hàng</p>
                                <p className="font-bold text-gray-900">#{order.id}</p>
                              </div>
                              <div className="text-right">
                                <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${statusInfo.color}`}>
                                  {statusInfo.text}
                                </span>
                              </div>
                            </div>

                            <div className="space-y-3 mb-4">
                              {/* Kiểm tra cả items và orderItems */}
                              {(order.items || order.orderItems || []).map((item, index) => {
                                // Nếu có product nested, dùng nó. Nếu không, item chính là product data
                                const productData = item.product || item;
                                
                                return (
                                  <div key={item.id || index} className="flex gap-4">
                                    <img
                                      src={getImageUrl(productData.imageUrl)}
                                      alt={productData.name || 'Sản phẩm'}
                                      className="w-16 h-16 object-cover rounded"
                                      onError={(e) => {
                                        e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="64" height="64"%3E%3Crect fill="%23f0f0f0" width="64" height="64"/%3E%3Ctext fill="%23999" font-family="sans-serif" font-size="12" dy="4" font-weight="400" x="50%25" y="50%25" text-anchor="middle"%3ENo Image%3C/text%3E%3C/svg%3E';
                                      }}
                                    />
                                    <div className="flex-1">
                                      <p className="font-medium text-gray-900">{productData.name || 'Sản phẩm'}</p>
                                      <p className="text-sm text-gray-500">x{item.quantity || 1}</p>
                                      <p className="text-sm font-semibold text-primary-600">
                                        {formatCurrency(item.price || 0)}
                                      </p>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t">
                              <div className="text-sm text-gray-500">
                                <p>Ngày đặt: {new Date(order.createdAt).toLocaleDateString('vi-VN')}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm text-gray-500">Tổng tiền</p>
                                <p className="text-xl font-bold text-primary-600">
                                  {formatCurrency(order.totalAmount)}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
