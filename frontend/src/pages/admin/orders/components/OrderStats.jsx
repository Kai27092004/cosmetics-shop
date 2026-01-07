import { useMemo } from 'react';
import { formatCurrency, formatNumber } from '../../../../utils/formatters';

export default function OrderStats({ orders }) {
  const stats = useMemo(() => {
    if (!orders || orders.length === 0) {
      return {
        total: 0,
        totalRevenue: 0,
        pending: 0,
        processing:  0,
        shipped: 0,
        delivered: 0,
        cancelled: 0,
      };
    }

    const total = orders.length;
    const totalRevenue = orders
      .filter(o => ['delivered', 'shipped', 'processing'].includes(o.status))
      .reduce((sum, o) => sum + o.totalAmount, 0);
    const pending = orders.filter(o => o.status === 'pending').length;
    const processing = orders.filter(o => o.status === 'processing').length;
    const shipped = orders.filter(o => o.status === 'shipped').length;
    const delivered = orders.filter(o => o.status === 'delivered').length;
    const cancelled = orders.filter(o => o.status === 'cancelled').length;

    return { total, totalRevenue, pending, processing, shipped, delivered, cancelled };
  }, [orders]);

  const statCards = [
    {
      title: 'Tổng đơn hàng',
      value: formatNumber(stats.total),
      icon: '📦',
      color: 'blue',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      borderColor: 'border-blue-200',
    },
    {
      title: 'Doanh thu',
      value: formatCurrency(stats.totalRevenue),
      icon: '💰',
      color: 'green',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
      borderColor: 'border-green-200',
    },
    {
      title: 'Chờ xử lý',
      value: formatNumber(stats.pending),
      icon: '🕐',
      color: 'yellow',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-700',
      borderColor: 'border-yellow-200',
      highlight: stats.pending > 0,
    },
    {
      title: 'Đang xử lý',
      value: formatNumber(stats.processing),
      icon: '⚙️',
      color: 'blue',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      borderColor: 'border-blue-200',
    },
    {
      title: 'Đang giao',
      value: formatNumber(stats.shipped),
      icon: '🚚',
      color: 'purple',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700',
      borderColor: 'border-purple-200',
    },
    {
      title: 'Đã giao',
      value: formatNumber(stats.delivered),
      icon: '✅',
      color: 'green',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
      borderColor: 'border-green-200',
    },
    {
      title: 'Đã hủy',
      value: formatNumber(stats.cancelled),
      icon: '❌',
      color: 'red',
      bgColor: 'bg-red-50',
      textColor: 'text-red-700',
      borderColor: 'border-red-200',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4">
      {statCards.map((stat, index) => (
        <div
          key={index}
          className={`${stat.bgColor} rounded-lg p-4 border-2 ${stat.borderColor} hover:shadow-md transition-all ${
            stat.highlight ? 'ring-2 ring-yellow-400 animate-pulse' : ''
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-3xl">{stat.icon}</span>
            {stat.highlight && (
              <span className="px-2 py-0.5 text-xs font-bold text-yellow-700 bg-yellow-200 rounded-full animate-bounce">
                Cần xử lý!
              </span>
            )}
          </div>
          <p className="text-xs font-medium text-gray-600 mb-1">
            {stat.title}
          </p>
          <p className={`text-xl font-bold ${stat.textColor}`}>
            {stat.value}
          </p>
        </div>
      ))}
    </div>
  );
}