import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '../../utils/formatters';
import useCart from '../../hooks/useCart';
import useAuth from '../../hooks/useAuth';
import orderService from '../../services/orderService';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';
import Loading from '../../components/common/Loading';
import { getImageUrl } from '../../utils/helpers';

export default function Checkout() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, isEmpty, totalItems, totalPrice, formattedTotalPrice, clearCart } = useCart();

  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    district: '',
    ward: '',
    notes: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  // Redirect nếu giỏ hàng trống
  if (isEmpty) {
    navigate('/cart');
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
    } else if (!/^[0-9]{10}$/.test(formData.phone)) {
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
      setAlert({ type: 'error', message:  'Vui lòng điền đầy đủ thông tin' });
      return;
    }

    setLoading(true);
    setAlert(null);

    try {
      // Tạo địa chỉ đầy đủ
      const fullAddress = [
        formData.address,
        formData.ward,
        formData.district,
        formData.city,
      ].filter(Boolean).join(', ');

      // Gọi API tạo đơn hàng
      const orderData = {
        cartItems: items.map(item => ({
          productId: item. id,
          quantity: item. quantity,
          price: item. price,
        })),
        shippingAddress: fullAddress,
        customerNotes: formData.notes || '',
        phone: formData.phone,
        fullName: formData.fullName,
      };

      console.log('📦 Creating order:', orderData);

      const response = await orderService.createOrder(orderData);

      console.log('✅ Order created:', response);

      // Xóa giỏ hàng
      clearCart();

      // Redirect sang trang thành công
      navigate('/order-success', { 
        state: { 
          orderId: response.orderId,
          totalAmount: response.totalAmount 
        } 
      });

    } catch (error) {
      console.error('❌ Order creation failed:', error);
      setAlert({ 
        type: 'error', 
        message: error.message || 'Đặt hàng thất bại.  Vui lòng thử lại.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg: px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Thanh toán
          </h1>
          <p className="text-gray-600">
            Vui lòng điền đầy đủ thông tin giao hàng
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

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Thông tin người nhận */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Thông tin người nhận
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Họ và tên"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    error={errors.fullName}
                    required
                    disabled={loading}
                  />

                  <Input
                    label="Số điện thoại"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    error={errors.phone}
                    placeholder="0123456789"
                    required
                    disabled={loading}
                  />

                  <div className="md:col-span-2">
                    <Input
                      label="Email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      disabled
                    />
                  </div>
                </div>
              </div>

              {/* Địa chỉ giao hàng */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Địa chỉ giao hàng
                </h2>

                <div className="space-y-4">
                  <Input
                    label="Địa chỉ"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    error={errors.address}
                    placeholder="Số nhà, tên đường..."
                    required
                    disabled={loading}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input
                      label="Tỉnh/Thành phố"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      error={errors.city}
                      placeholder="TP. Hồ Chí Minh"
                      required
                      disabled={loading}
                    />

                    <Input
                      label="Quận/Huyện"
                      name="district"
                      value={formData.district}
                      onChange={handleChange}
                      error={errors.district}
                      placeholder="Quận 1"
                      required
                      disabled={loading}
                    />

                    <Input
                      label="Phường/Xã"
                      name="ward"
                      value={formData. ward}
                      onChange={handleChange}
                      placeholder="Phường Bến Nghé"
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>

              {/* Ghi chú */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Ghi chú đơn hàng
                </h2>

                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Ghi chú về đơn hàng, ví dụ: thời gian hay chỉ dẫn địa điểm giao hàng chi tiết hơn."
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  disabled={loading}
                />
              </div>

              {/* Phương thức thanh toán */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Phương thức thanh toán
                </h2>

                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-4 border-2 border-primary-600 rounded-lg cursor-pointer bg-primary-50">
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      defaultChecked
                      className="w-5 h-5 text-primary-600"
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">Thanh toán khi nhận hàng (COD)</p>
                      <p className="text-sm text-gray-600">Thanh toán bằng tiền mặt khi nhận hàng</p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-4 border-2 border-gray-300 rounded-lg cursor-pointer opacity-50">
                    <input
                      type="radio"
                      name="payment"
                      value="bank"
                      disabled
                      className="w-5 h-5"
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">Chuyển khoản ngân hàng</p>
                      <p className="text-sm text-gray-600">Chức năng đang phát triển</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow p-6 sticky top-20">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Đơn hàng ({totalItems} sản phẩm)
                </h2>

                {/* Products */}
                <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                        <img
                          src={getImageUrl(item.imageUrl)}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {item.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {formatCurrency(item.price)} x {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-gray-900">
                          {formatCurrency(item. price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Summary */}
                <div className="space-y-3 border-t pt-4">
                  <div className="flex justify-between text-gray-600">
                    <span>Tạm tính: </span>
                    <span className="font-semibold">{formattedTotalPrice}</span>
                  </div>

                  <div className="flex justify-between text-gray-600">
                    <span>Phí vận chuyển:</span>
                    <span className="font-semibold">Miễn phí</span>
                  </div>

                  <div className="flex justify-between text-lg font-bold text-gray-900 border-t pt-3">
                    <span>Tổng cộng:</span>
                    <span className="text-2xl text-primary-600">{formattedTotalPrice}</span>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  loading={loading}
                  disabled={loading}
                  className="mt-6"
                >
                  {loading ? 'Đang xử lý...' : 'Đặt hàng'}
                </Button>

                {/* Security */}
                <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-600">
                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2. 166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11. 65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Giao dịch an toàn & bảo mật</span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Loading Overlay */}
      {loading && <Loading fullScreen text="Đang xử lý đơn hàng..." />}
    </div>
  );
}