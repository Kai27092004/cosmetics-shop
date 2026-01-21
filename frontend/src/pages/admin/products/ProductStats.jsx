import { useMemo } from 'react';
import { FaBox, FaDollarSign, FaBoxes, FaExclamationTriangle } from 'react-icons/fa';

export default function ProductStats({ products }) {
  const stats = useMemo(() => {
    const totalProducts = products.length;
    const totalValue = products.reduce((sum, p) => sum + (p.price * p.stockQuantity), 0);
    const totalStock = products.reduce((sum, p) => sum + p.stockQuantity, 0);
    const lowStock = products.filter(p => p.stockQuantity > 0 && p.stockQuantity < 10).length;

    return [
      {
        label: 'Tổng sản phẩm',
        value: totalProducts,
        icon: FaBox,
        color: 'blue',
      },
      {
        label: 'Giá trị kho',
        value: new Intl.NumberFormat('vi-VN', {
          style: 'currency',
          currency: 'VND',
        }).format(totalValue),
        icon: FaDollarSign,
        color: 'green',
      },
      {
        label: 'Tổng tồn kho',
        value: totalStock.toLocaleString('vi-VN'),
        icon: FaBoxes,
        color: 'purple',
      },
      {
        label: 'Sắp hết hàng',
        value: lowStock,
        icon: FaExclamationTriangle,
        color: 'red',
      },
    ];
  }, [products]);

  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    red: 'bg-red-100 text-red-600',
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