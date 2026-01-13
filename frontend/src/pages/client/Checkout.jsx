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
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    district: '',
    ward: '',
    notes: '',
  });

  // ✅ THÊM STATE CHO PAYMENT METHOD
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);

  useEffect(() => {
    if (isEmpty && !isProcessingOrder) {
      navigate('/cart');
    }
  }, [isEmpty, isProcessingOrder, navigate]);

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
    if (!formData.phone) {
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
      showToast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    setLoading(true);
    setIsProcessingOrder(true);

    try {
      const fullAddress = [
        formData. address,
        formData.ward,
        formData.district,
        formData.city,
      ].filter(Boolean).join(', ');

      const orderData = {
        cartItems: items. map(item => ({
          productId: item.productId || item.id,
          quantity: item.quantity,
          price: item.price,
        })),
        shippingAddress: fullAddress,
        customerNotes:  formData.notes || '',
        phone: formData.phone,
        fullName: formData.fullName,
        paymentMethod, // ✅ GỬI PAYMENT METHOD
      };

      console.log('📦 Creating order:', orderData);

      const response = await orderService.createOrder(orderData);

      console.log('✅ Order created:', response);

      // ✅ XỬ LÝ THEO PAYMENT METHOD
      if (paymentMethod === 'QRCODE') {
        // QR CODE → Redirect sang trang thanh toán
        showToast.success('Đơn hàng đã tạo! Vui lòng thanh toán.');
        
        // Navigate ngay lập tức, clear cart sau khi đã chuyển trang
        navigate(`/payment/${response.orderId}`, {
          state: {
            orderId: response.orderId,
            totalAmount: response.totalAmount,
          },
          replace: true,
        });
        
        // Clear cart sau khi đã navigate
        setTimeout(() => clearCart(), 100);
      } else {
        // COD → Redirect sang order success
        showToast.success('🎉 Đặt hàng thành công!');
        
        // Navigate ngay lập tức, clear cart sau khi đã chuyển trang
        navigate('/order-success', {
          state: {
            orderId: response.orderId,
            totalAmount: response.totalAmount,
          },
          replace: true,
        });
        
        // Clear cart sau khi đã navigate
        setTimeout(() => clearCart(), 100);
      }

    } catch (error) {
      console.error('❌ Order creation failed:', error);
      showToast.error(error.message || 'Đặt hàng thất bại. Vui lòng thử lại.');
      setIsProcessingOrder(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Thanh toán</h1>
          <p className="text-gray-600">Vui lòng điền đầy đủ thông tin giao hàng</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Forms */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Info */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Thông tin giao hàng</h2>

                <div className="space-y-6">
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
                    error={errors. address}
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
                </div>
              </div>

              {/* ✅ PAYMENT METHOD SELECTION */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Phương thức thanh toán</h2>

                <div className="space-y-4">
                  {/* COD */}
                  <label
                    className={`flex items-start gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      paymentMethod === 'COD'
                        ? 'border-primary-600 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="COD"
                      checked={paymentMethod === 'COD'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      disabled={loading}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <svg
                          className="w-6 h-6 text-green-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="font-bold text-gray-900">
                          Thanh toán khi nhận hàng (COD)
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        Thanh toán bằng tiền mặt khi nhận hàng.  Phù hợp với mọi đơn hàng.
                      </p>
                    </div>
                  </label>

                  {/* QR CODE */}
                  <label
                    className={`flex items-start gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      paymentMethod === 'QRCODE'
                        ? 'border-primary-600 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="QRCODE"
                      checked={paymentMethod === 'QRCODE'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      disabled={loading}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <svg
                          className="w-6 h-6 text-blue-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M3 4a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm2 2V5h1v1H5zM3 13a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1v-3zm2 2v-1h1v1H5zM13 3a1 1 0 00-1 1v3a1 1 0 001 1h3a1 1 0 001-1V4a1 1 0 00-1-1h-3zm1 2v1h1V5h-1z"
                            clipRule="evenodd"
                          />
                          <path d="M11 4a1 1 0 10-2 0v1a1 1 0 002 0V4zM10 7a1 1 0 011 1v1h2a1 1 0 110 2h-3a1 1 0 01-1-1V8a1 1 0 011-1zM16 9a1 1 0 100 2 1 1 0 000-2zM9 13a1 1 0 011-1h1a1 1 0 110 2v2a1 1 0 11-2 0v-3zM7 11a1 1 0 100-2H4a1 1 0 100 2h3zM17 13a1 1 0 01-1 1h-2a1 1 0 110-2h2a1 1 0 011 1zM16 17a1 1 0 100-2h-3a1 1 0 100 2h3z" />
                        </svg>
                        <span className="font-bold text-gray-900">Chuyển khoản QR Code</span>
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-semibold">
                          Nhanh
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        Quét mã QR để thanh toán ngay.  Đơn hàng được xử lý nhanh hơn.
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <Button type="submit" variant="primary" size="lg" fullWidth disabled={loading} loading={loading}>
                {paymentMethod === 'QRCODE' ? 'Tiếp tục thanh toán' : 'Đặt hàng'}
              </Button>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow p-6 sticky top-20">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Đơn hàng của bạn</h2>

                <div className="space-y-4 mb-6">
                  {items.map((item) => (
                    <div key={item. id} className="flex gap-4">
                      <img
                        src={getImageUrl(item.imageUrl)}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded"
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
                    <span className="font-semibold text-green-600">Miễn phí</span>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between text-lg font-bold text-gray-900">
                      <span>Tổng cộng:</span>
                      <span className="text-2xl text-primary-600">{formattedTotalPrice}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}