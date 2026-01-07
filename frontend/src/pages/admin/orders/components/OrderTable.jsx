import { formatCurrency } from '../../../../utils/formatters';
import { formatDate } from '../../../../utils/formatters';
import OrderStatusBadge from './OrderStatusBadge';
import { ORDER_STATUS_LABELS } from '../../../../utils/constants';

export default function OrderTable({ orders, onViewDetail, onStatusChange }) {
  if (! orders || orders.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-12 text-center">
        <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Chưa có đơn hàng nào
        </h3>
        <p className="text-gray-600">
          Đơn hàng mới sẽ xuất hiện ở đây
        </p>
      </div>
    );
  }

  const getNextStatus = (currentStatus) => {
    const statusFlow = {
      'pending': 'processing',
      'processing': 'shipped',
      'shipped': 'delivered',
    };
    return statusFlow[currentStatus];
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b-2 border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Mã đơn
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Khách hàng
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Sản phẩm
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Tổng tiền
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Ngày đặt
              </th>
              <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order) => {
              const nextStatus = getNextStatus(order.status);
              
              return (
                <tr 
                  key={order.id} 
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => onViewDetail(order.id)}
                >
                  {/* Mã đơn */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-primary-600">
                        #{order.id}
                      </span>
                      {/* Badge "New" nếu đơn mới (< 1h) */}
                      {new Date() - new Date(order.createdAt) < 3600000 && (
                        <span className="px-2 py-0.5 text-xs font-bold text-green-700 bg-green-100 rounded-full animate-pulse">
                          MỚI
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Khách hàng */}
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-semibold text-gray-900">
                        {order.user?.fullName || 'N/A'}
                      </div>
                      <div className="text-xs text-gray-500">
                        {order.user?.email}
                      </div>
                    </div>
                  </td>

                  {/* Sản phẩm */}
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {order.orderItems?.length || 0} sản phẩm
                    </div>
                  </td>

                  {/* Tổng tiền */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-gray-900">
                      {formatCurrency(order.totalAmount)}
                    </div>
                  </td>

                  {/* Trạng thái */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <OrderStatusBadge status={order.status} />
                  </td>

                  {/* Ngày đặt */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatDate(order.createdAt, 'dd/MM/yyyy')}
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatDate(order.createdAt, 'HH:mm')}
                    </div>
                  </td>

                  {/* Thao tác */}
                  <td className="px-6 py-4 whitespace-nowrap text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-2">
                      {/* Quick status change */}
                      {nextStatus && order.status !== 'cancelled' && order.status !== 'delivered' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onStatusChange(order.id, nextStatus);
                          }}
                          className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
                          title={`Chuyển sang ${ORDER_STATUS_LABELS[nextStatus]}`}
                        >
                          → {ORDER_STATUS_LABELS[nextStatus]}
                        </button>
                      )}

                      {/* View detail */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onViewDetail(order.id);
                        }}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Xem chi tiết"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer - Pagination */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-700">
            Hiển thị <span className="font-semibold">{orders.length}</span> đơn hàng
          </p>
          {/* TODO: Add pagination */}
        </div>
      </div>
    </div>
  );
}