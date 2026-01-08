import { formatCurrency } from '../../utils/formatters';
import Button from '../common/Button';

export default function CartSummary({ totalItems, totalPrice, onCheckout, onClearCart }) {
  const shippingFee = totalPrice >= 500000 ? 0 : 30000;
  const finalTotal = totalPrice + shippingFee;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 sticky top-20">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Tổng đơn hàng
      </h2>

      <div className="space-y-4 mb-6">
        <div className="flex justify-between text-gray-700">
          <span>Tổng sản phẩm:</span>
          <span className="font-semibold">{totalItems}</span>
        </div>

        <div className="flex justify-between text-gray-700">
          <span>Tạm tính:</span>
          <span className="font-semibold">{formatCurrency(totalPrice)}</span>
        </div>

        <div className="flex justify-between text-gray-700">
          <span>Phí vận chuyển:</span>
          <span className="font-semibold">
            {shippingFee === 0 ? (
              <span className="text-green-600">Miễn phí</span>
            ) : (
              formatCurrency(shippingFee)
            )}
          </span>
        </div>

        {totalPrice < 500000 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              💡 Mua thêm {formatCurrency(500000 - totalPrice)} để được <strong>miễn phí vận chuyển</strong>
            </p>
          </div>
        )}

        <div className="pt-4 border-t border-gray-200">
          <div className="flex justify-between text-xl font-bold">
            <span>Tổng cộng:</span>
            <span className="text-primary-600">{formatCurrency(finalTotal)}</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={onCheckout}
        >
          Thanh toán
        </Button>

        <Button
          variant="secondary"
          size="lg"
          fullWidth
          onClick={onClearCart}
        >
          Xóa giỏ hàng
        </Button>
      </div>
    </div>
  );
}