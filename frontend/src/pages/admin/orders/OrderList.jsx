import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import orderService from '../../../services/orderService';
import useSocket from '../../../hooks/useSocket';
import OrderTable from './components/OrderTable';
import OrderFilters from './components/OrderFilters';
import OrderStats from './components/OrderStats';
import Modal from '../../../components/common/Modal';
import Button from '../../../components/common/Button';
import OrderStatusBadge from './components/OrderStatusBadge';
import showToast from '../../../utils/toast';
import Loading from '../../../components/common/Loading';

export default function OrderList() {
  const navigate = useNavigate();
  const { on } = useSocket();
  const [orders, setOrders] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    search: '',
    sortBy: 'createdAt',
  });

  // Delete confirmation modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);

  // View detail modal
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  // WebSocket: Lắng nghe đơn hàng mới
  useEffect(() => {
    const unsubscribe = on('order:new', (data) => {
      console.log('🔔 [OrderList] New order received:', data);
      showToast.success(`Đơn hàng mới #${data.orderId} từ ${data.customerName}!`);
      fetchOrders();
    });

    return unsubscribe;
  }, [on]);

  // WebSocket: Lắng nghe cập nhật đơn hàng
  useEffect(() => {
    const unsubscribe = on('order:updated', (data) => {
      console.log('🔔 [OrderList] Order updated:', data);
      fetchOrders();
    });

    return unsubscribe;
  }, [on]);

  const fetchOrders = async () => {
    try {
      setSearching(true);
      const data = await orderService.getAllOrders();

      // Apply client-side filtering
      let filteredData = [...data];

      // Filter by search (order ID or customer name)
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filteredData = filteredData.filter(order =>
          order.id.toString().includes(searchLower) ||
          order.user?.fullName?.toLowerCase().includes(searchLower) ||
          order.fullName?.toLowerCase().includes(searchLower)
        );
      }

      // Filter by status
      if (filters.status) {
        filteredData = filteredData.filter(order => order.status === filters.status);
      }

      // Apply sorting
      switch (filters.sortBy) {
        case 'createdAt':
          filteredData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          break;
        case 'createdAt-asc':
          filteredData.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
          break;
        case 'totalAmount-desc':
          filteredData.sort((a, b) => b.totalAmount - a.totalAmount);
          break;
        case 'totalAmount-asc':
          filteredData.sort((a, b) => a.totalAmount - b.totalAmount);
          break;
        default:
          filteredData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          break;
      }

      setOrders(filteredData);
      setInitialLoading(false);
    } catch (error) {
      showToast.error(error.message || 'Không thể tải đơn hàng');
      setInitialLoading(false);
    } finally {
      setSearching(false);
    }
  };

  // Refetch when filters change
  useEffect(() => {
    fetchOrders();
  }, [filters]);

  const handleViewDetail = async (orderId) => {
    try {
      const orderDetail = await orderService.getOrderByIdAdmin(orderId);
      setSelectedOrder(orderDetail);
      setViewModalOpen(true);
    } catch (error) {
      showToast.error('Không thể tải chi tiết đơn hàng');
    }
  };

  const handleCloseViewModal = () => {
    setViewModalOpen(false);
    setSelectedOrder(null);
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await orderService.updateOrderStatus(orderId, newStatus);
      showToast.success('Cập nhật trạng thái thành công!');
      fetchOrders();
    } catch (error) {
      showToast.error(error.message || 'Cập nhật thất bại');
    }
  };

  const handleDelete = (order) => {
    setOrderToDelete(order);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!orderToDelete) return;

    try {
      await orderService.deleteOrder(orderToDelete.id);
      showToast.success('Xóa đơn hàng thành công!');
      setDeleteModalOpen(false);
      setOrderToDelete(null);
      fetchOrders();
    } catch (error) {
      showToast.error(error.message || 'Xóa thất bại');
    }
  };

  const cancelDelete = () => {
    setDeleteModalOpen(false);
    setOrderToDelete(null);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Quản lý đơn hàng</h1>
        <p className="text-gray-600 mt-1">
          Theo dõi và xử lý đơn hàng realtime
        </p>
      </div>

      {/* Stats */}
      <OrderStats orders={orders} />

      {/* Filters with searching indicator */}
      <div className="relative">
        {searching && (
          <div className="absolute top-4 right-4 z-10 flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-full text-sm font-medium shadow-sm">
            <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Đang tìm kiếm...
          </div>
        )}
        <OrderFilters
          filters={filters}
          onFilterChange={handleFilterChange}
        />
      </div>

      {/* Table */}
      {initialLoading ? (
        <div className="flex justify-center py-12">
          <Loading size="lg" text="Đang tải đơn hàng..." />
        </div>
      ) : (
        <OrderTable
          orders={orders}
          onViewDetail={handleViewDetail}
          onStatusChange={handleStatusChange}
          onDelete={handleDelete}
        />
      )}

      {/* Delete Confirmation Modal - Modern Design */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={cancelDelete}
        title=""
        size="md"
      >
        <div className="relative overflow-hidden">
          {/* Gradient Header */}
          <div className="bg-gradient-to-r from-red-500 to-pink-500 px-6 py-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-4 animate-bounce">
              <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">
              Xác nhận xóa đơn hàng
            </h3>
            <p className="text-red-100">
              Hành động này không thể hoàn tác
            </p>
          </div>

          {/* Content */}
          <div className="p-6">
            {orderToDelete && (
              <div className="space-y-4 mb-6">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 font-medium">Mã đơn hàng</p>
                      <p className="text-lg font-bold text-gray-900">#{orderToDelete.id}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white rounded-lg p-3">
                      <p className="text-xs text-gray-500 mb-1">Khách hàng</p>
                      <p className="font-semibold text-gray-900 text-sm">{orderToDelete.fullName || orderToDelete.user?.fullName}</p>
                    </div>
                    <div className="bg-white rounded-lg p-3">
                      <p className="text-xs text-gray-500 mb-1">Tổng tiền</p>
                      <p className="font-bold text-red-600 text-sm">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(orderToDelete.totalAmount)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="font-semibold text-yellow-800 text-sm">Lưu ý quan trọng</p>
                      <p className="text-yellow-700 text-xs mt-1">
                        Đơn hàng sẽ bị xóa vĩnh viễn khỏi hệ thống và không thể khôi phục.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={cancelDelete}
                className="flex-1 py-3"
              >
                <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Hủy bỏ
              </Button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-3 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold rounded-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Xác nhận xóa
              </button>
            </div>
          </div>
        </div>
      </Modal>

      {/* View Order Detail Modal - Modern Design */}
      <Modal
        isOpen={viewModalOpen}
        onClose={handleCloseViewModal}
        title=""
        size="3xl"
      >
        {selectedOrder && (
          <div className="relative">
            {/* Gradient Header */}
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-6">
              <div className="flex items-center justify-between text-white">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-blue-100">Mã đơn hàng</p>
                      <h2 className="text-2xl font-bold">#{selectedOrder.id}</h2>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <OrderStatusBadge status={selectedOrder.status} />
                  <p className="text-sm text-blue-100 mt-2">
                    {new Date(selectedOrder.createdAt).toLocaleDateString('vi-VN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Customer Info */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 border border-gray-200">
                <div className="flex items-center gap-2 mb-4">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <h3 className="font-bold text-gray-900">Thông tin khách hàng</h3>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">Họ tên</p>
                    <p className="font-semibold text-gray-900">{selectedOrder.fullName || selectedOrder.user?.fullName}</p>
                  </div>
                  <div className="bg-white rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">Số điện thoại</p>
                    <p className="font-semibold text-gray-900">{selectedOrder.phone || selectedOrder.user?.phone}</p>
                  </div>
                  <div className="bg-white rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">Email</p>
                    <p className="font-semibold text-gray-900 text-sm truncate">{selectedOrder.user?.email}</p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <h3 className="font-bold text-gray-900">Sản phẩm đã đặt</h3>
                  <span className="ml-auto bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                    {selectedOrder.orderItems?.length} sản phẩm
                  </span>
                </div>
                <div className="space-y-3">
                  {selectedOrder.orderItems?.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 bg-white rounded-xl p-4 border border-gray-200 hover:shadow-md transition-shadow">
                      <img
                        src={`http://localhost:5000${item.product?.imageUrl}`}
                        alt={item.product?.name}
                        className="w-20 h-20 object-cover rounded-lg"
                        onError={(e) => e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="80" height="80"%3E%3Crect fill="%23f0f0f0" width="80" height="80"/%3E%3C/svg%3E'}
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{item.product?.name}</p>
                        <p className="text-sm text-gray-600 mt-1">
                          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)} × {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Thành tiền</p>
                        <p className="text-lg font-bold text-blue-600">
                          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment & Shipping */}
              <div className="grid grid-cols-2 gap-4">
                {/* Payment */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border border-green-200">
                  <div className="flex items-center gap-2 mb-4">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <h3 className="font-bold text-gray-900">Thanh toán</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Phương thức</span>
                      <span className="font-semibold text-gray-900">
                        {selectedOrder.paymentMethod === 'COD' ? '💵 COD' : '📱 QR Code'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Trạng thái</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${selectedOrder.paymentStatus === 'paid'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                        }`}>
                        {selectedOrder.paymentStatus === 'paid' ? '✓ Đã thanh toán' : '⏳ Chưa thanh toán'}
                      </span>
                    </div>
                    <div className="pt-3 border-t border-green-200">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-gray-900">Tổng tiền</span>
                        <span className="text-2xl font-bold text-green-600">
                          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(selectedOrder.totalAmount)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Shipping */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-5 border border-purple-200">
                  <div className="flex items-center gap-2 mb-4">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                    </svg>
                    <h3 className="font-bold text-gray-900">Giao hàng</h3>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Địa chỉ giao hàng</p>
                      <p className="font-semibold text-gray-900">{selectedOrder.shippingAddress}</p>
                    </div>
                    {selectedOrder.customerNotes && (
                      <div className="pt-3 border-t border-purple-200">
                        <p className="text-sm text-gray-600 mb-1">Ghi chú</p>
                        <p className="text-gray-900 italic">"{selectedOrder.customerNotes}"</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button variant="secondary" onClick={handleCloseViewModal} className="px-6">
                  Đóng
                </Button>
                <button
                  onClick={() => {
                    handleCloseViewModal();
                    // TODO: Open edit modal
                  }}
                  className="px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold rounded-lg transition-all transform hover:scale-105 flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Chỉnh sửa
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}