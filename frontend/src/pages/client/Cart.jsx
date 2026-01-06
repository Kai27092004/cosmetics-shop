import { Link, useNavigate } from 'react-router-dom';
import { getImageUrl } from '../../utils/helpers';
import { formatCurrency } from '../../utils/formatters';
import useCart from '../../hooks/useCart';
import useAuth from '../../hooks/useAuth';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';
import { useState } from 'react';

export default function Cart() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const {
    items,
    isEmpty,
    totalItems,
    totalPrice,
    formattedTotalPrice,
    removeFromCart,
    increment,
    decrement,
    updateQuantity,
    clearCart,
  } = useCart();

  const [alert, setAlert] = useState(null);

  const handleRemoveItem = (item) => {
    const result = removeFromCart(item.id);
    setAlert({ type: 'success', message:  result. message });
    setTimeout(() => setAlert(null), 3000);
  };

  const handleIncrement = (item) => {
    const result = increment(item. id);
    if (! result.success) {
      setAlert({ type: 'error', message: result.message });
      setTimeout(() => setAlert(null), 3000);
    }
  };

  const handleDecrement = (item) => {
    decrement(item.id);
  };

  const handleQuantityChange = (item, value) => {
    const newQuantity = parseInt(value) || 1;
    const result = updateQuantity(item. id, newQuantity);
    if (!result.success) {
      setAlert({ type: 'error', message: result.message });
      setTimeout(() => setAlert(null), 3000);
    }
  };

  const handleClearCart = () => {
    if (window.confirm('Bạn có chắc muốn xóa toàn bộ giỏ hàng?')) {
      clearCart();
      setAlert({ type: 'success', message: 'Đã xóa toàn bộ giỏ hàng' });
      setTimeout(() => setAlert(null), 3000);
    }
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      setAlert({ type: 'warning', message: 'Vui lòng đăng nhập để tiếp tục' });
      setTimeout(() => {
        navigate('/login? redirect=/checkout');
      }, 1500);
    } else {
      navigate('/checkout');
    }
  };

  if (isEmpty) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
        <div className="text-center">
          <svg className="w-32 h-32 mx-auto text-gray-300 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Giỏ hàng trống
          </h2>
          <p className="text-gray-600 mb-8">
            Chưa có sản phẩm nào trong giỏ hàng của bạn
          </p>
          <Link to="/products">
            <Button size="lg">
              Tiếp tục mua sắm
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Giỏ hàng
            </h1>
            <p className="text-gray-600">
              {totalItems} sản phẩm
            </p>
          </div>
          <button
            onClick={handleClearCart}
            className="text-red-600 hover:text-red-700 font-medium flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Xóa tất cả
          </button>
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

        <div className="grid grid-cols-1 lg: grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow p-6 flex gap-6"
              >
                {/* Image */}
                <Link
                  to={`/products/${item.id}`}
                  className="flex-shrink-0 w-24 h-24 bg-gray-100 rounded-lg overflow-hidden"
                >
                  <img
                    src={getImageUrl(item.imageUrl)}
                    alt={item.name}
                    className="w-full h-full object-cover hover:scale-110 transition-transform"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/100? text=No+Image';
                    }}
                  />
                </Link>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <Link
                    to={`/products/${item.id}`}
                    className="text-lg font-bold text-gray-900 hover: text-primary-600 block mb-2"
                  >
                    {item.name}
                  </Link>

                  {item.category && (
                    <p className="text-sm text-gray-500 mb-2">
                      {item.category. name}
                    </p>
                  )}

                  <p className="text-xl font-bold text-primary-600">
                    {formatCurrency(item.price)}
                  </p>

                  {item.stockQuantity <= item.quantity && (
                    <p className="text-xs text-red-600 mt-1">
                      Chỉ còn {item. stockQuantity} sản phẩm
                    </p>
                  )}
                </div>

                {/* Quantity Controls */}
                <div className="flex flex-col items-end gap-4">
                  <button
                    onClick={() => handleRemoveItem(item)}
                    className="text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDecrement(item)}
                      className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                      </svg>
                    </button>

                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(item, e.target.value)}
                      className="w-16 text-center border border-gray-300 rounded py-1 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      min="1"
                      max={item.stockQuantity}
                    />

                    <button
                      onClick={() => handleIncrement(item)}
                      disabled={item.quantity >= item.stockQuantity}
                      className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>

                  <p className="text-sm text-gray-600">
                    Tổng: <span className="font-bold text-gray-900">{formatCurrency(item.price * item.quantity)}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-20">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Tóm tắt đơn hàng
              </h2>

              <div className="space-y-4 mb-6">
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

              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={handleCheckout}
                className="mb-4"
              >
                Tiến hành thanh toán
              </Button>

              <Link to="/products">
                <Button variant="outline" size="lg" fullWidth>
                  Tiếp tục mua sắm
                </Button>
              </Link>

              {/* Security Info */}
              <div className="mt-6 pt-6 border-t">
                <div className="flex items-start gap-3 text-sm text-gray-600">
                  <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="font-semibold text-gray-900">Thanh toán an toàn</p>
                    <p>Thông tin của bạn được bảo mật 100%</p>
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