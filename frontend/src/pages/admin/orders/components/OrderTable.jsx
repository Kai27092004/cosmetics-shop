import { formatCurrency } from '../../../../utils/formatters';
import { formatDate } from '../../../../utils/formatters';
import OrderStatusBadge from './OrderStatusBadge';
import { ORDER_STATUS_LABELS } from '../../../../utils/constants';

export default function OrderTable({ orders, onViewDetail, onStatusChange, onDelete }) {
  if (!orders || orders.length === 0) {
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

                  {/* Trạng thái - Dropdown để thay đổi */}
                  <td className="px-6 py-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                    <select
                      value={order.status}
                      onChange={(e) => {
                        e.stopPropagation();
                        onStatusChange(order.id, e.target.value);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-sm font-semibold border-2 focus:outline-none focus:ring-2 focus:ring-offset-1 ${order.status === 'pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200 focus:ring-yellow-400' :
                        order.status === 'processing' ? 'bg-blue-50 text-blue-700 border-blue-200 focus:ring-blue-400' :
                          order.status === 'shipped' ? 'bg-purple-50 text-purple-700 border-purple-200 focus:ring-purple-400' :
                            order.status === 'delivered' ? 'bg-green-50 text-green-700 border-green-200 focus:ring-green-400' :
                              'bg-red-50 text-red-700 border-red-200 focus:ring-red-400'
                        }`}
                    >
                      <option value="pending">Chờ xử lý</option>
                      <option value="processing">Đang xử lý</option>
                      <option value="shipped">Đang giao</option>
                      <option value="delivered">Đã giao</option>
                      <option value="cancelled">Đã hủy</option>
                    </select>
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
                      {/* View detail */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onViewDetail(order.id);
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Xem chi tiết"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>

                      {/* Edit (navigate to detail page for editing) */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onViewDetail(order.id);
                        }}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Chỉnh sửa"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>

                      {/* Delete */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(order);
                        }}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Xóa đơn hàng"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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