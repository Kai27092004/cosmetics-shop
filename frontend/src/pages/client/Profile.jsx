import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import orderService from '../../services/orderService';
import { formatCurrency } from '../../utils/formatters';
import { getImageUrl } from '../../utils/helpers';
import showToast from '../../utils/toast';
import Loading from '../../components/common/Loading';
import { useSocket } from '../../hooks/useSocket';

export default function Profile() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, updateProfile, changePassword, logout } = useAuth();
  const { socket } = useSocket();

  const [activeTab, setActiveTab] = useState(location.state?.activeTab || 'profile');
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [showPassword, setShowPassword] = useState({
    old: false,
    new: false,
    confirm: false
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || null);

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
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  // Listen to payment updates via WebSocket
  useEffect(() => {
    if (!socket) return;

    socket.on('order:payment_updated', (data) => {
      setOrders(prevOrders => prevOrders.map(order =>
        order.id === data.orderId
          ? { ...order, paymentStatus: 'paid', status: 'processing' }
          : order
      ));
      showToast.success(data.message || 'Thanh toán đơn hàng thành công!');
    });

    return () => {
      socket.off('order:payment_updated');
    };
  }, [socket]);

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

  const handlePayment = (order) => {
    navigate(`/payment/${order.id}`, {
      state: {
        orderId: order.id,
        totalAmount: order.totalAmount,
      },
    });
  };

  const handleCancelOrder = (orderId) => {
    setSelectedOrderId(orderId);
    setCancelModalOpen(true);
  };

  const confirmCancelOrder = async () => {
    if (!selectedOrderId) return;

    try {
      setLoading(true);
      await orderService.cancelOrder(selectedOrderId);

      setOrders(orders.map(order =>
        order.id === selectedOrderId
          ? { ...order, status: 'cancelled' }
          : order
      ));

      showToast.success('Đã hủy đơn hàng thành công!');
      setCancelModalOpen(false);
      setSelectedOrderId(null);
    } catch (error) {
      showToast.error(error.message || 'Hủy đơn hàng thất bại');
    } finally {
      setLoading(false);
    }
  };

  const getOrderStatusText = (status) => {
    const statusMap = {
      pending: { text: 'Chờ xác nhận', color: 'bg-yellow-100 text-yellow-800', icon: '⏳' },
      processing: { text: 'Đang xử lý', color: 'bg-blue-100 text-blue-800', icon: '⚙️' },
      shipped: { text: 'Đang giao', color: 'bg-purple-100 text-purple-800', icon: '🚚' },
      delivered: { text: 'Đã giao', color: 'bg-green-100 text-green-800', icon: '✅' },
      cancelled: { text: 'Đã hủy', color: 'bg-red-100 text-red-800', icon: '❌' },
    };
    return statusMap[status] || { text: status, color: 'bg-gray-100 text-gray-800', icon: '📦' };
  };

  const getPaymentStatusText = (status) => {
    const statusMap = {
      unpaid: { text: 'Chưa thanh toán', color: 'bg-orange-100 text-orange-800', icon: '💳' },
      paid: { text: 'Đã thanh toán', color: 'bg-green-100 text-green-800', icon: '✓' },
    };
    return statusMap[status] || { text: status, color: 'bg-gray-100 text-gray-800', icon: '💰' };
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

  const tabs = [
    { id: 'profile', label: 'Thông tin cá nhân', icon: '👤' },
    { id: 'password', label: 'Đổi mật khẩu', icon: '🔒' },
    { id: 'orders', label: 'Đơn hàng của tôi', icon: '📦' },
  ];

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast.error('Kích thước ảnh không được vượt quá 5MB');
        return;
      }

      if (!file.type.startsWith('image/')) {
        showToast.error('Vui lòng chọn file ảnh');
        return;
      }

      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarUpload = async () => {
    if (!avatarFile) return;

    const formData = new FormData();
    formData.append('avatar', avatarFile);

    setLoading(true);
    const result = await updateProfile(formData);
    setLoading(false);

    if (result.success) {
      showToast.success('Cập nhật ảnh đại diện thành công!');
      setAvatarFile(null);
    } else {
      showToast.error(result.error || 'Cập nhật ảnh đại diện thất bại');
      setAvatarPreview(user?.avatar || null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-pink-50/30 to-purple-50/30 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-gray-900 mb-2 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            Tài Khoản Của Tôi
          </h1>
          <p className="text-gray-600">Quản lý thông tin cá nhân và đơn hàng của bạn</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20 sticky top-24">
              {/* User Avatar */}
              <div className="text-center mb-6 pb-6 border-b border-gray-200">
                <div className="relative inline-block mb-4">
                  <input
                    type="file"
                    id="avatar-upload"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt={user?.fullName}
                      className="w-24 h-24 rounded-full border-4 border-pink-200 shadow-lg object-cover"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-4xl">
                        {user?.fullName?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                  )}
                  <label
                    htmlFor="avatar-upload"
                    className="absolute bottom-0 right-0 w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:scale-110 transition-transform"
                  >
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </label>
                </div>

                {avatarFile && (
                  <button
                    onClick={handleAvatarUpload}
                    disabled={loading}
                    className="mb-3 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-sm font-bold rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50"
                  >
                    {loading ? 'Đang lưu...' : 'Lưu ảnh'}
                  </button>
                )}

                <h2 className="text-xl font-bold text-gray-900 mb-1 truncate px-2">{user?.fullName}</h2>
                <p className="text-sm text-gray-500 truncate px-2">{user?.email}</p>
              </div>

              {/* Navigation */}
              <nav className="space-y-2 mb-6">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 transition-all font-semibold ${activeTab === tab.id
                      ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg scale-105'
                      : 'text-gray-700 hover:bg-gray-100'
                      }`}
                  >
                    <span className="text-xl">{tab.icon}</span>
                    <span className="text-sm">{tab.label}</span>
                  </button>
                ))}
              </nav>

              {/* Logout Button */}
              <button
                onClick={logout}
                className="w-full px-4 py-3 rounded-xl flex items-center gap-3 text-red-600 hover:bg-red-50 transition-all font-semibold border-2 border-red-200 hover:border-red-300"
              >
                <span className="text-xl">🚪</span>
                <span className="text-sm">Đăng xuất</span>
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div>
                  <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-200">
                    <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <span className="text-2xl">👤</span>
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-gray-900">Thông Tin Cá Nhân</h2>
                      <p className="text-sm text-gray-500">Cập nhật thông tin của bạn</p>
                    </div>
                  </div>

                  <form onSubmit={handleProfileSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Full Name */}
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          Họ và tên
                        </label>
                        <input
                          type="text"
                          name="fullName"
                          value={profileData.fullName}
                          onChange={handleProfileChange}
                          disabled={loading}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-pink-500 transition-all"
                        />
                        {errors.fullName && (
                          <p className="mt-2 text-sm text-red-600">{errors.fullName}</p>
                        )}
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={profileData.email}
                          disabled
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-100 cursor-not-allowed"
                        />
                      </div>

                      {/* Phone */}
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          Số điện thoại
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={profileData.phone}
                          onChange={handleProfileChange}
                          placeholder="0123456789"
                          disabled={loading}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-pink-500 transition-all"
                        />
                      </div>

                      {/* Address */}
                      <div className="md:col-span-2">
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          Địa chỉ
                        </label>
                        <input
                          type="text"
                          name="address"
                          value={profileData.address}
                          onChange={handleProfileChange}
                          placeholder="Số nhà, tên đường, quận/huyện, tỉnh/thành phố"
                          disabled={loading}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-pink-500 transition-all"
                        />
                      </div>
                    </div>

                    <div className="flex gap-4 pt-6 border-t border-gray-200">
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                      >
                        {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setProfileData({
                          fullName: user?.fullName || '',
                          email: user?.email || '',
                          phone: user?.phone || '',
                          address: user?.address || '',
                        })}
                        disabled={loading}
                        className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all"
                      >
                        Hủy
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Password Tab */}
              {activeTab === 'password' && (
                <div>
                  <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-200">
                    <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <span className="text-2xl">🔒</span>
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-gray-900">Đổi Mật Khẩu</h2>
                      <p className="text-sm text-gray-500">Cập nhật mật khẩu của bạn</p>
                    </div>
                  </div>

                  <form onSubmit={handlePasswordSubmit} className="space-y-6 max-w-md">
                    {/* Old Password */}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Mật khẩu hiện tại
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword.old ? 'text' : 'password'}
                          name="oldPassword"
                          value={passwordData.oldPassword}
                          onChange={handlePasswordChange}
                          placeholder="••••••••"
                          disabled={loading}
                          className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-pink-500 transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(prev => ({ ...prev, old: !prev.old }))}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword.old ? '👁️' : '👁️‍🗨️'}
                        </button>
                      </div>
                      {errors.oldPassword && (
                        <p className="mt-2 text-sm text-red-600">{errors.oldPassword}</p>
                      )}
                    </div>

                    {/* New Password */}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Mật khẩu mới
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword.new ? 'text' : 'password'}
                          name="newPassword"
                          value={passwordData.newPassword}
                          onChange={handlePasswordChange}
                          placeholder="••••••••"
                          disabled={loading}
                          className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-pink-500 transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(prev => ({ ...prev, new: !prev.new }))}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword.new ? '👁️' : '👁️‍🗨️'}
                        </button>
                      </div>
                      {errors.newPassword && (
                        <p className="mt-2 text-sm text-red-600">{errors.newPassword}</p>
                      )}
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Xác nhận mật khẩu mới
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword.confirm ? 'text' : 'password'}
                          name="confirmPassword"
                          value={passwordData.confirmPassword}
                          onChange={handlePasswordChange}
                          placeholder="••••••••"
                          disabled={loading}
                          className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-pink-500 transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(prev => ({ ...prev, confirm: !prev.confirm }))}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword.confirm ? '👁️' : '👁️‍🗨️'}
                        </button>
                      </div>
                      {errors.confirmPassword && (
                        <p className="mt-2 text-sm text-red-600">{errors.confirmPassword}</p>
                      )}
                    </div>

                    <div className="pt-6 border-t border-gray-200">
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                      >
                        {loading ? 'Đang xử lý...' : 'Đổi mật khẩu'}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Orders Tab */}
              {activeTab === 'orders' && (
                <div>
                  <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-200">
                    <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <span className="text-2xl">📦</span>
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-gray-900">Đơn Hàng Của Tôi</h2>
                      <p className="text-sm text-gray-500">Theo dõi đơn hàng của bạn</p>
                    </div>
                  </div>

                  {loadingOrders ? (
                    <div className="text-center py-12">
                      <Loading size="lg" text="Đang tải đơn hàng..." />
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-32 h-32 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-6xl">📦</span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Chưa có đơn hàng nào</h3>
                      <p className="text-gray-600 mb-6">Hãy bắt đầu mua sắm để xem đơn hàng tại đây</p>
                      <button
                        onClick={() => navigate('/products')}
                        className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                      >
                        Mua sắm ngay
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => {
                        const statusInfo = getOrderStatusText(order.status);
                        const paymentStatusInfo = getPaymentStatusText(order.paymentStatus);
                        const canCancel = order.status === 'pending' && order.paymentStatus === 'unpaid';
                        const needPayment = order.paymentMethod === 'QRCODE' && order.paymentStatus === 'unpaid' && order.status !== 'cancelled';

                        return (
                          <div key={order.id} className="border-2 border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all hover:border-pink-300">
                            {/* Order Header */}
                            <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
                              <div>
                                <p className="text-sm text-gray-500 mb-1">Mã đơn hàng</p>
                                <p className="font-bold text-gray-900 text-lg">#{order.id}</p>
                                {order.paymentMethod && (
                                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                    <span>{order.paymentMethod === 'QRCODE' ? '💳' : '💵'}</span>
                                    {order.paymentMethod === 'QRCODE' ? 'QR Code' : 'COD'}
                                  </p>
                                )}
                              </div>
                              <div className="text-right space-y-2">
                                <span className={`inline-flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-bold ${statusInfo.color}`}>
                                  <span>{statusInfo.icon}</span>
                                  {statusInfo.text}
                                </span>
                                {order.paymentStatus && (
                                  <div>
                                    <span className={`inline-flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-bold ${paymentStatusInfo.color}`}>
                                      <span>{paymentStatusInfo.icon}</span>
                                      {paymentStatusInfo.text}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Order Items */}
                            <div className="space-y-3 mb-4">
                              {(order.items || order.orderItems || []).map((item, index) => {
                                const productData = item.product || item;

                                return (
                                  <div key={item.id || index} className="flex gap-4 p-3 bg-gray-50 rounded-xl">
                                    <img
                                      src={getImageUrl(productData.imageUrl)}
                                      alt={productData.name || 'Sản phẩm'}
                                      className="w-20 h-20 object-cover rounded-lg shadow-md"
                                      onError={(e) => {
                                        e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="80" height="80"%3E%3Crect fill="%23f0f0f0" width="80" height="80"/%3E%3Ctext fill="%23999" font-family="sans-serif" font-size="12" dy="4" font-weight="400" x="50%25" y="50%25" text-anchor="middle"%3ENo Image%3C/text%3E%3C/svg%3E';
                                      }}
                                    />
                                    <div className="flex-1">
                                      <p className="font-bold text-gray-900 mb-1">{productData.name || 'Sản phẩm'}</p>
                                      <p className="text-sm text-gray-500">Số lượng: {item.quantity || 1}</p>
                                      <p className="text-sm font-bold text-pink-600 mt-1">
                                        {formatCurrency(item.price || 0)}
                                      </p>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>

                            {/* Order Footer */}
                            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                              <div className="text-sm text-gray-500">
                                <p className="flex items-center gap-1">
                                  <span>📅</span>
                                  {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm text-gray-500 mb-1">Tổng tiền</p>
                                <p className="text-2xl font-black text-pink-600">
                                  {formatCurrency(order.totalAmount)}
                                </p>
                              </div>
                            </div>

                            {/* Action Buttons */}
                            {(needPayment || canCancel) && (
                              <div className="flex gap-3 mt-4 pt-4 border-t border-gray-200">
                                {needPayment && (
                                  <button
                                    onClick={() => handlePayment(order)}
                                    className="flex-1 px-4 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2"
                                  >
                                    <span>💳</span>
                                    Thanh toán ngay
                                  </button>
                                )}
                                {canCancel && (
                                  <button
                                    onClick={() => handleCancelOrder(order.id)}
                                    className="flex-1 px-4 py-3 border-2 border-red-300 text-red-600 font-bold rounded-xl hover:bg-red-50 transition-all flex items-center justify-center gap-2"
                                  >
                                    <span>❌</span>
                                    Hủy đơn
                                  </button>
                                )}
                              </div>
                            )}
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

      {/* Cancel Modal */}
      {cancelModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-2xl font-black text-gray-900 mb-4">Xác nhận hủy đơn hàng</h3>
            <p className="text-gray-600 mb-4">
              Bạn có chắc chắn muốn hủy đơn hàng #{selectedOrderId}?
            </p>
            <p className="text-sm text-red-600 mb-6 flex items-center gap-2">
              <span>⚠️</span>
              Lưu ý: Hành động này không thể hoàn tác!
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setCancelModalOpen(false)}
                disabled={loading}
                className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all"
              >
                Đóng
              </button>
              <button
                onClick={confirmCancelOrder}
                disabled={loading}
                className="flex-1 px-4 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-all disabled:opacity-50"
              >
                {loading ? 'Đang xử lý...' : 'Xác nhận hủy'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}