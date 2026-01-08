import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { getImageUrl } from '../../utils/helpers';
import { formatCurrency } from '../../utils/formatters';
import useCart from '../../hooks/useCart';
import useAuth from '../../hooks/useAuth';
import Button from '../../components/common/Button';
import showToast from '../../utils/toast';

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

  const [showClearModal, setShowClearModal] = useState(false);

  const handleRemoveItem = (item) => {
    const result = removeFromCart(item.id);
    showToast.success(result.message);
  };

  const handleIncrement = (item) => {
    const result = increment(item.id);
    if (!result.success) {
      showToast.error(result.message);
    }
  };

  const handleDecrement = (item) => {
    decrement(item.id);
  };

  const handleQuantityChange = (item, value) => {
    const newQuantity = parseInt(value) || 1;
    const result = updateQuantity(item.id, newQuantity);
    if (!result.success) {
      showToast.error(result.message);
    }
  };

  const handleClearCart = () => {
    setShowClearModal(true);
  };

  const confirmClearCart = () => {
    clearCart();
    showToast.success('Đã xóa toàn bộ giỏ hàng');
    setShowClearModal(false);
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      showToast.warning('Vui lòng đăng nhập để tiếp tục');
      setTimeout(() => {
        navigate('/login?redirect=/checkout');
      }, 1500);
    } else {
      navigate('/checkout');
    }
  };

  if (isEmpty) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center py-12 px-4">
        <div className="text-center max-w-lg mx-auto">
          {/* Animated Icon */}
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-pink-400 rounded-full blur-3xl opacity-20 animate-pulse"></div>
            <div className="relative">
              <svg 
                className="w-40 h-40 mx-auto text-gray-300 dark:text-gray-600 animate-bounce" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={1.5} 
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" 
                />
              </svg>
              {/* Sparkles */}
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-400 rounded-full animate-ping"></div>
              <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-pink-400 rounded-full animate-ping" style={{ animationDelay: '0.3s' }}></div>
            </div>
          </div>

          {/* Title with gradient */}
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
            <span className="bg-gradient-to-r from-primary-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
              Giỏ hàng trống
            </span>
          </h2>
          
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
            Hãy khám phá bộ sưu tập sản phẩm tuyệt vời của chúng tôi!<br/>
            💄 Nhiều ưu đãi đang chờ bạn 💄
          </p>

          {/* CTA Button */}
          <Link to="/products">
            <Button 
              size="lg" 
              className="shadow-2xl hover:shadow-pink-500/50 transition-all duration-300 transform hover:scale-105 bg-gradient-to-r from-primary-600 to-pink-600 hover:from-primary-700 hover:to-pink-700 text-white font-bold px-8 py-4 rounded-xl flex items-center justify-center mx-auto"
            >
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Khám phá ngay
            </Button>
          </Link>

          {/* Features */}
          <div className="grid grid-cols-3 gap-4 mt-12 text-sm">
            <div className="flex flex-col items-center p-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-2">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="font-semibold text-gray-700 dark:text-gray-300">Miễn phí ship</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-2">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="font-semibold text-gray-700 dark:text-gray-300">Chính hãng</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-2">
                <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                  <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
                </svg>
              </div>
              <span className="font-semibold text-gray-700 dark:text-gray-300">Giao nhanh</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-pink-600 bg-clip-text text-transparent mb-2">
                Giỏ hàng của bạn
              </h1>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                  </svg>
                  {totalItems} sản phẩm
                </span>
                <span className="text-gray-600 dark:text-gray-400">•</span>
                <span className="text-gray-600 dark:text-gray-400 font-semibold">
                  {formattedTotalPrice}
                </span>
              </div>
            </div>
            <button
              onClick={handleClearCart}
              className="px-4 py-2 text-red-600 hover:text-white hover:bg-red-600 dark:text-red-400 dark:hover:bg-red-500 border-2 border-red-600 dark:border-red-400 rounded-lg font-medium flex items-center gap-2 transition-all duration-200 hover:shadow-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Xóa tất cả
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 flex gap-6 border border-gray-100 dark:border-gray-700"
              >
                {/* Image */}
                <Link
                  to={`/products/${item.id}`}
                  className="flex-shrink-0 w-28 h-28 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-xl overflow-hidden group"
                >
                  <img
                    src={getImageUrl(item.imageUrl)}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23f0f0f0" width="100" height="100"/%3E%3Ctext fill="%23999" font-family="sans-serif" font-size="14" dy="5" font-weight="400" x="50%25" y="50%25" text-anchor="middle"%3ENo Image%3C/text%3E%3C/svg%3E';
                    }}
                  />
                </Link>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <Link
                    to={`/products/${item.id}`}
                    className="text-lg font-bold text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 block mb-2 line-clamp-2 transition-colors"
                  >
                    {item.name}
                  </Link>

                  {item.category && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 mb-3">
                      {item.category.name}
                    </span>
                  )}

                  <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                    {formatCurrency(item.price)}
                  </p>

                  {item.stockQuantity <= item.quantity && (
                    <div className="flex items-center gap-1 mt-2">
                      <svg className="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <span className="text-xs text-orange-600 dark:text-orange-400 font-medium">
                        Chỉ còn {item.stockQuantity} sản phẩm
                      </span>
                    </div>
                  )}
                </div>

                {/* Quantity Controls */}
                <div className="flex flex-col items-end gap-4">
                  <button
                    onClick={() => handleRemoveItem(item)}
                    className="text-gray-400 hover:text-red-600 dark:text-gray-500 dark:hover:text-red-400 transition-colors p-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                    title="Xóa sản phẩm"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>

                  <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700 rounded-lg p-1">
                    <button
                      onClick={() => handleDecrement(item)}
                      className="w-9 h-9 flex items-center justify-center bg-white dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded-lg hover:bg-primary-50 hover:border-primary-500 dark:hover:bg-primary-900/30 transition-colors"
                      title="Giảm số lượng"
                    >
                      <svg className="w-4 h-4 text-gray-700 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                      </svg>
                    </button>

                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(item, e.target.value)}
                      className="w-16 text-center bg-white dark:bg-gray-600 dark:text-white border border-gray-200 dark:border-gray-500 rounded-lg py-2 font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
                      min="1"
                      max={item.stockQuantity}
                    />

                    <button
                      onClick={() => handleIncrement(item)}
                      disabled={item.quantity >= item.stockQuantity}
                      className="w-9 h-9 flex items-center justify-center bg-white dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded-lg hover:bg-primary-50 hover:border-primary-500 dark:hover:bg-primary-900/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white dark:disabled:hover:bg-gray-600 transition-colors"
                      title="Tăng số lượng"
                    >
                      <svg className="w-4 h-4 text-gray-700 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>

                  <div className="text-right">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Thành tiền</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">{formatCurrency(item.price * item.quantity)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 sticky top-24">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Tóm tắt đơn hàng
                </h2>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Tạm tính ({totalItems} sản phẩm):</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{formattedTotalPrice}</span>
                </div>

                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Phí vận chuyển:</span>
                  <span className="font-semibold text-green-600 dark:text-green-400 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Miễn phí
                  </span>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <div className="bg-gradient-to-r from-primary-50 to-pink-50 dark:from-primary-900/20 dark:to-pink-900/20 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-900 dark:text-white">Tổng cộng:</span>
                      <span className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-pink-600 bg-clip-text text-transparent">{formattedTotalPrice}</span>
                    </div>
                  </div>
                </div>
              </div>

              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={handleCheckout}
                className="mb-4 shadow-lg hover:shadow-xl transition-shadow"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                Tiến hành thanh toán
              </Button>

              <Link to="/products">
                <Button variant="outline" size="lg" fullWidth>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Tiếp tục mua sắm
                </Button>
              </Link>

              {/* Security Info */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-start gap-3 text-sm">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white mb-1">Thanh toán an toàn</p>
                    <p className="text-gray-600 dark:text-gray-400">Thông tin của bạn được bảo mật 100%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Clear Cart Modal */}
        {showClearModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={() => setShowClearModal(false)}>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Xóa tất cả sản phẩm?
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Bạn có chắc chắn muốn xóa tất cả <span className="font-bold text-primary-600">{totalItems} sản phẩm</span> khỏi giỏ hàng? Hành động này không thể hoàn tác.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowClearModal(false)}
                    className="flex-1 px-4 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 font-medium transition-colors"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={confirmClearCart}
                    className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors shadow-lg hover:shadow-xl"
                  >
                    Xóa tất cả
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}