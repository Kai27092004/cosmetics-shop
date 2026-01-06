import { Link, useLocation } from 'react-router-dom';
import { formatCurrency } from '../../utils/formatters';
import Button from '../../components/common/Button';

export default function OrderSuccess() {
  const location = useLocation();
  const { orderId, totalAmount } = location.state || {};

  if (!orderId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Không tìm thấy thông tin đơn hàng</p>
          <Link to="/">
            <Button>Về trang chủ</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Đặt hàng thành công! 
          </h1>

          <p className="text-gray-600 mb-8">
            Cảm ơn bạn đã tin tưởng và mua sắm tại Cosmetics Shop
          </p>

          {/* Order Info */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <div className="space-y-3 text-left">
              <div className="flex justify-between">
                <span className="text-gray-600">Mã đơn hàng: </span>
                <span className="font-bold text-gray-900">#{orderId}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Tổng tiền:</span>
                <span className="font-bold text-primary-600 text-xl">
                  {formatCurrency(totalAmount)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Phương thức: </span>
                <span className="font-semibold text-gray-900">COD</span>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 text-left">
            <p className="text-sm text-blue-800">
              <strong>Thông báo:</strong> Chúng tôi đã gửi email xác nhận đơn hàng đến địa chỉ email của bạn.  Vui lòng kiểm tra hộp thư để biết thêm chi tiết.
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Link to="/orders">
              <Button variant="primary" size="lg" fullWidth>
                Xem đơn hàng của tôi
              </Button>
            </Link>

            <Link to="/products">
              <Button variant="outline" size="lg" fullWidth>
                Tiếp tục mua sắm
              </Button>
            </Link>

            <Link to="/">
              <Button variant="secondary" size="lg" fullWidth>
                Về trang chủ
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}