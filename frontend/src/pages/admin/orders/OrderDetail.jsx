import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import orderService from '../../../services/orderService';
import useSocket from '../../../hooks/useSocket';
import { formatCurrency } from '../../../utils/formatters';
import { formatDate } from '../../../utils/formatters';
import { getImageUrl } from '../../../utils/helpers';
import { ORDER_STATUS_LABELS } from '../../../utils/constants';
import OrderStatusBadge from './components/OrderStatusBadge';
import OrderTimeline from './components/OrderTimeline';
import Button from '../../../components/common/Button';
import showToast from '../../../utils/toast';
import Loading from '../../../components/common/Loading';

export default function OrderDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { on, joinOrderRoom } = useSocket();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchOrder();
    joinOrderRoom(id); // Join room để nhận realtime updates
  }, [id]);

  // WebSocket: Lắng nghe cập nhật đơn hàng này
  useEffect(() => {
    const unsubscribe = on('order:statusChanged', (data) => {
      if (data.orderId === parseInt(id)) {
        console.log('🔔 [OrderDetail] Status changed:', data);
        showToast.info(`Trạng thái đã thay đổi: ${ORDER_STATUS_LABELS[data.newStatus]}`);
        fetchOrder(); // Refresh
      }
    });

    return unsubscribe;
  }, [id, on]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const data = await orderService.getOrderByIdAdmin(id);
      setOrder(data);
    } catch (error) {
      showToast.error('Không thể tải thông tin đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    if (!window.confirm(`Bạn có chắc muốn chuyển trạng thái sang "${ORDER_STATUS_LABELS[newStatus]}"?`)) {
      return;
    }

    try {
      setUpdating(true);
      await orderService.updateOrderStatus(id, newStatus);
      showToast.success('Cập nhật trạng thái thành công!');
      fetchOrder();
    } catch (error) {
      showToast.error(error.message || 'Cập nhật thất bại');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <Loading fullScreen text="Đang tải đơn hàng..." />;
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">Không tìm thấy đơn hàng</p>
        <Button onClick={() => navigate('/admin/orders')}>
          Quay lại danh sách
        </Button>
      </div>
    );
  }

  const statusFlow = ['pending', 'processing', 'shipped', 'delivered'];
  const currentIndex = statusFlow.indexOf(order.status);
  const nextStatus = statusFlow[currentIndex + 1];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="secondary"
            onClick={() => navigate('/admin/orders')}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Quay lại
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Đơn hàng #{order.id}
            </h1>
            <p className="text-gray-600 mt-1">
              Đặt ngày {formatDate(order.createdAt, 'dd/MM/yyyy HH:mm')}
            </p>
          </div>
        </div>

        <OrderStatusBadge status={order.status} size="lg" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left:  Order Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Products */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Sản phẩm ({order.orderItems?.length})
            </h2>
            <div className="space-y-4">
              {order.orderItems?.map((item) => (
                <div key={item.id} className="flex gap-4 pb-4 border-b last:border-b-0">
                  <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={getImageUrl(item.product?.imageUrl)}
                      alt={item.product?.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{item.product?.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {formatCurrency(item.price)} x {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="mt-6 pt-6 border-t">
              <div className="flex justify-between text-lg font-bold">
                <span>Tổng cộng: </span>
                <span className="text-2xl text-primary-600">
                  {formatCurrency(order.totalAmount)}
                </span>
              </div>
            </div>
          </div>

          {/* Customer Info */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Thông tin khách hàng
            </h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <div>
                  <p className="text-sm text-gray-600">Họ tên</p>
                  <p className="font-semibold text-gray-900">{order.user?.fullName}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-semibold text-gray-900">{order.user?.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17. 657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div>
                  <p className="text-sm text-gray-600">Địa chỉ giao hàng</p>
                  <p className="font-semibold text-gray-900">{order.shippingAddress}</p>
                </div>
              </div>

              {order.customerNotes && (
                <div className="flex items-start gap-3 mt-4 pt-4 border-t">
                  <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                  <div>
                    <p className="text-sm text-gray-600">Ghi chú</p>
                    <p className="text-gray-900 italic">"{order.customerNotes}"</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Actions & Timeline */}
        <div className="lg:col-span-1 space-y-6">
          {/* Actions */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Thao tác
            </h2>

            {order.status !== 'cancelled' && order.status !== 'delivered' && (
              <div className="space-y-3">
                {nextStatus && (
                  <Button
                    variant="primary"
                    fullWidth
                    onClick={() => handleStatusChange(nextStatus)}
                    loading={updating}
                    disabled={updating}
                  >
                    Chuyển sang: {ORDER_STATUS_LABELS[nextStatus]}
                  </Button>
                )}

                {order.status === 'pending' && (
                  <Button
                    variant="danger"
                    fullWidth
                    onClick={() => handleStatusChange('cancelled')}
                    loading={updating}
                    disabled={updating}
                  >
                    Hủy đơn hàng
                  </Button>
                )}
              </div>
            )}

            {order.status === 'delivered' && (
              <p className="text-center text-green-600 font-semibold py-4">
                ✅ Đơn hàng đã hoàn thành
              </p>
            )}

            {order.status === 'cancelled' && (
              <p className="text-center text-red-600 font-semibold py-4">
                ❌ Đơn hàng đã bị hủy
              </p>
            )}
          </div>

          {/* Timeline */}
          <OrderTimeline order={order} />
        </div>
      </div>
    </div>
  );
}