import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import orderService from '../../../services/orderService';
import useSocket from '../../../hooks/useSocket';
import OrderTable from './components/OrderTable';
import OrderFilters from './components/OrderFilters';
import OrderStats from './components/OrderStats';
import Alert from '../../../components/common/Alert';
import Loading from '../../../components/common/Loading';

export default function OrderList() {
  const navigate = useNavigate();
  const { on } = useSocket();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    search: '',
    sortBy: 'createdAt',
  });

  useEffect(() => {
    fetchOrders();
  }, [filters]);

  // WebSocket: Lắng nghe đơn hàng mới
  useEffect(() => {
    const unsubscribe = on('order:new', (data) => {
      console.log('🔔 [OrderList] New order received:', data);
      setAlert({ 
        type: 'success', 
        message: `Đơn hàng mới #${data.orderId} từ ${data.customerName}!` 
      });
      fetchOrders(); // Refresh danh sách
    });

    return unsubscribe;
  }, [on]);

  // WebSocket: Lắng nghe cập nhật đơn hàng
  useEffect(() => {
    const unsubscribe = on('order:updated', (data) => {
      console.log('🔔 [OrderList] Order updated:', data);
      fetchOrders(); // Refresh danh sách
    });

    return unsubscribe;
  }, [on]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await orderService.getAllOrders(filters);
      setOrders(data);
    } catch (error) {
      setAlert({ type: 'error', message: error.message || 'Không thể tải đơn hàng' });
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = (orderId) => {
    navigate(`/admin/orders/${orderId}`);
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await orderService.updateOrderStatus(orderId, newStatus);
      setAlert({ type: 'success', message: 'Cập nhật trạng thái thành công!' });
      fetchOrders();
    } catch (error) {
      setAlert({ type: 'error', message: error.message || 'Cập nhật thất bại' });
    }
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

      {/* Alert */}
      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      {/* Stats */}
      <OrderStats orders={orders} />

      {/* Filters */}
      <OrderFilters
        filters={filters}
        onFilterChange={handleFilterChange}
      />

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loading size="lg" text="Đang tải đơn hàng..." />
        </div>
      ) : (
        <OrderTable
          orders={orders}
          onViewDetail={handleViewDetail}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
}