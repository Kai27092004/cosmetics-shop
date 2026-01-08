import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '../../utils/formatters';
import useCart from '../../hooks/useCart';
import useAuth from '../../hooks/useAuth';
import orderService from '../../services/orderService';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import showToast from '../../utils/toast';
import Loading from '../../components/common/Loading';
import { getImageUrl } from '../../utils/helpers';

export default function Checkout() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, isEmpty, totalItems, totalPrice, formattedTotalPrice, clearCart } = useCart();

  const [formData, setFormData] = useState({
    fullName: user?. fullName || '',
    email:  user?.email || '',
    phone: '',
    address: '',
    city: '',
    district: '',
    ward: '',
    notes: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // ✅ SỬA:  Dùng useEffect để redirect
  useEffect(() => {
    if (isEmpty) {
      navigate('/cart');
    }
  }, [isEmpty, navigate]);

  // ✅ THÊM: Early return nếu giỏ hàng trống
  if (isEmpty) {
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName) newErrors.fullName = 'Vui lòng nhập họ tên';
    if (! formData.phone) {
      newErrors.phone = 'Vui lòng nhập số điện thoại';
    } else if (!/^[0-9]{10}$/.test(formData. phone)) {
      newErrors.phone = 'Số điện thoại không hợp lệ';
    }
    if (!formData.address) newErrors.address = 'Vui lòng nhập địa chỉ';
    if (!formData.city) newErrors.city = 'Vui lòng nhập tỉnh/thành phố';
    if (!formData. district) newErrors.district = 'Vui lòng nhập quận/huyện';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      showToast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    setLoading(true);

    try {
      // Tạo địa chỉ đầy đủ
      const fullAddress = [
        formData.address,
        formData.ward,
        formData.district,
        formData.city,
      ].filter(Boolean).join(', ');

      // Debug: Kiểm tra items trong cart
      console.log('📦 [Checkout] Cart items:', items);

      // Gọi API tạo đơn hàng
      const orderData = {
        cartItems: items.map(item => {
          // Kiểm tra xem có productId không, nếu không thì dùng id
          const productId = item.productId || item.id;
          
          if (!productId) {
            console.error('❌ [Checkout] Item missing ID:', item);
          }
          
          return {
            productId: productId,
            quantity: item.quantity,
            price: item.price,
          };
        }),
        shippingAddress: fullAddress,
        customerNotes: formData.notes || '',
        phone: formData.phone,
        fullName: formData.fullName,
      };

      console.log('📦 Creating order:', orderData);

      const response = await orderService.createOrder(orderData);

      console.log('✅ Order created:', response);

      // Hiển thị toast thành công NGAY
      showToast.success('🎉 Đặt hàng thành công! Cảm ơn bạn đã mua sắm.');

      // Xóa giỏ hàng
      clearCart();

      // Đợi một chút để toast hiển thị rồi mới redirect
      setTimeout(() => {
        navigate('/order-success', { 
          state: { 
            orderId: response.orderId,
            totalAmount: response.totalAmount || totalPrice
          } 
        });
      }, 1000);

    } catch (error) {
      console.error('❌ Order creation failed:', error);
      showToast.error(error.message || 'Đặt hàng thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Thanh toán</h1>
          <p className="text-gray-600">Vui lòng điền đầy đủ thông tin giao hàng</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Thông tin giao hàng</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                  label="Họ và tên"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  error={errors.fullName}
                  required
                  disabled={loading}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={loading}
                  />

                  <Input
                    label="Số điện thoại"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    error={errors.phone}
                    required
                    disabled={loading}
                    placeholder="0123456789"
                  />
                </div>

                <Input
                  label="Địa chỉ"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  error={errors.address}
                  required
                  disabled={loading}
                  placeholder="Số nhà, tên đường"
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Input
                    label="Phường/Xã"
                    name="ward"
                    value={formData.ward}
                    onChange={handleChange}
                    disabled={loading}
                  />

                  <Input
                    label="Quận/Huyện"
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    error={errors.district}
                    required
                    disabled={loading}
                  />

                  <Input
                    label="Tỉnh/Thành phố"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    error={errors.city}
                    required
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ghi chú (tùy chọn)
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    disabled={loading}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Ghi chú thêm về đơn hàng..."
                  />
                </div>

                <Button type="submit" variant="primary" size="lg" fullWidth disabled={loading}>
                  {loading ? <Loading size="sm" /> : 'Đặt hàng'}
                </Button>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-20">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Đơn hàng của bạn</h2>

              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <img
                      src={getImageUrl(item.imageUrl)}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                      onError={(e) => {
                        e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="64" height="64"%3E%3Crect fill="%23f0f0f0" width="64" height="64"/%3E%3Ctext fill="%23999" font-family="sans-serif" font-size="12" dy="4" font-weight="400" x="50%25" y="50%25" text-anchor="middle"%3ENo Image%3C/text%3E%3C/svg%3E';
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                      <p className="text-xs text-gray-500">x{item.quantity}</p>
                      <p className="text-sm font-semibold text-primary-600">
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Tạm tính ({totalItems} sản phẩm):</span>
                  <span className="font-semibold">{formattedTotalPrice}</span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Phí vận chuyển:</span>
                  <span className="font-semibold">Miễn phí</span>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>Tổng cộng:</span>
                    <span className="text-2xl text-primary-600">{formattedTotalPrice}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t">
                <div className="flex items-start gap-3 text-sm text-gray-600">
                  <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="font-semibold text-gray-900">Thanh toán COD</p>
                    <p>Thanh toán khi nhận hàng</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}