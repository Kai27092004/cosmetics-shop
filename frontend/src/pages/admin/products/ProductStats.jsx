import { useMemo } from 'react';
import { formatCurrency, formatNumber } from '../../../utils/formatters';

export default function ProductStats({ products }) {
  const stats = useMemo(() => {
    if (!products || products.length === 0) {
      return {
        total: 0,
        totalValue: 0,
        inStock: 0,
        outOfStock: 0,
        lowStock: 0,
      };
    }

    const total = products.length;
    const totalValue = products.reduce((sum, p) => sum + (p.price * p.stockQuantity), 0);
    const inStock = products.filter(p => p.stockQuantity > 10).length;
    const outOfStock = products.filter(p => p.stockQuantity === 0).length;
    const lowStock = products.filter(p => p.stockQuantity > 0 && p.stockQuantity <= 10).length;

    return { total, totalValue, inStock, outOfStock, lowStock };
  }, [products]);

  const statCards = [
    {
      title: 'Tổng sản phẩm',
      value: formatNumber(stats.total),
      icon: '📦',
      color: 'blue',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      iconBg: 'bg-blue-100',
    },
    {
      title: 'Giá trị kho',
      value: formatCurrency(stats.totalValue),
      icon: '💰',
      color: 'green',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
      iconBg: 'bg-green-100',
    },
    {
      title: 'Còn hàng',
      value: formatNumber(stats.inStock),
      icon: '✅',
      color: 'emerald',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-700',
      iconBg: 'bg-emerald-100',
    },
    {
      title: 'Sắp hết',
      value: formatNumber(stats.lowStock),
      icon: '⚠️',
      color:  'yellow',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-700',
      iconBg: 'bg-yellow-100',
    },
    {
      title: 'Hết hàng',
      value: formatNumber(stats.outOfStock),
      icon: '❌',
      color: 'red',
      bgColor: 'bg-red-50',
      textColor: 'text-red-700',
      iconBg: 'bg-red-100',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {statCards.map((stat, index) => (
        <div
          key={index}
          className={`${stat.bgColor} rounded-lg p-6 border border-${stat.color}-200 hover:shadow-md transition-shadow`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className={`w-12 h-12 ${stat.iconBg} rounded-lg flex items-center justify-center`}>
              <span className="text-2xl">{stat. icon}</span>
            </div>
          </div>
          <p className="text-sm font-medium text-gray-600 mb-1">
            {stat.title}
          </p>
          <p className={`text-2xl font-bold ${stat.textColor}`}>
            {stat.value}
          </p>
        </div>
      ))}
    </div>
  );
}