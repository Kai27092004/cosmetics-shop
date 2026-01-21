import { useMemo } from 'react';
import { FaShoppingCart, FaDollarSign, FaClock, FaCheckCircle } from 'react-icons/fa';

export default function OrderStats({ orders }) {
  const stats = useMemo(() => {
    const totalOrders = orders.length;

    // Calculate revenue from delivered orders only
    const deliveredOrders = orders.filter(o => o.status === 'delivered');
    const totalRevenue = deliveredOrders.length > 0
      ? deliveredOrders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0)
      : 0;

    const pendingOrders = orders.filter(o => o.status === 'pending' || o.status === 'processing').length;
    const completedOrders = deliveredOrders.length;

    return [
      {
        label: 'Tổng đơn hàng',
        value: totalOrders,
        icon: FaShoppingCart,
        color: 'blue',
      },
      {
        label: 'Tổng doanh thu',
        value: new Intl.NumberFormat('vi-VN', {
          style: 'currency',
          currency: 'VND',
        }).format(totalRevenue),
        icon: FaDollarSign,
        color: 'green',
      },
      {
        label: 'Đang xử lý',
        value: pendingOrders,
        icon: FaClock,
        color: 'yellow',
      },
      {
        label: 'Hoàn thành',
        value: completedOrders,
        icon: FaCheckCircle,
        color: 'emerald',
      },
    ];
  }, [orders]);

  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    emerald: 'bg-emerald-100 text-emerald-600',
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-full ${colorClasses[stat.color]}`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}