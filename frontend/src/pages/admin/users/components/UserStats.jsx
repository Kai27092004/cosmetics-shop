import { useMemo } from 'react';
import { formatNumber } from '../../../../utils/formatters';

export default function UserStats({ users }) {
  const stats = useMemo(() => {
    if (!users || users.length === 0) {
      return {
        total: 0,
        customers: 0,
        admins: 0,
        activeUsers: 0,
        blockedUsers: 0,
        newThisMonth: 0,
      };
    }

    const total = users.length;
    const customers = users.filter(u => u.role === 'customer').length;
    const admins = users.filter(u => u.role === 'admin').length;
    const activeUsers = users.filter(u => !u.isBlocked).length;
    const blockedUsers = users.filter(u => u.isBlocked).length;
    
    // Users mới trong tháng này
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const newThisMonth = users.filter(u => new Date(u.createdAt) >= firstDayOfMonth).length;

    return { total, customers, admins, activeUsers, blockedUsers, newThisMonth };
  }, [users]);

  const statCards = [
    {
      title: 'Tổng người dùng',
      value: formatNumber(stats.total),
      icon: '👥',
      color: 'blue',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      borderColor: 'border-blue-200',
    },
    {
      title: 'Customers',
      value: formatNumber(stats.customers),
      icon: '👤',
      color: 'indigo',
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-700',
      borderColor: 'border-indigo-200',
    },
    {
      title: 'Admins',
      value:  formatNumber(stats.admins),
      icon: '👑',
      color: 'purple',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700',
      borderColor: 'border-purple-200',
    },
    {
      title: 'Hoạt động',
      value: formatNumber(stats.activeUsers),
      icon: '✅',
      color: 'green',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
      borderColor:  'border-green-200',
    },
    {
      title: 'Đã chặn',
      value:  formatNumber(stats.blockedUsers),
      icon: '🚫',
      color: 'red',
      bgColor:  'bg-red-50',
      textColor: 'text-red-700',
      borderColor: 'border-red-200',
    },
    {
      title: 'Mới tháng này',
      value: formatNumber(stats.newThisMonth),
      icon: '🆕',
      color: 'yellow',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-700',
      borderColor:  'border-yellow-200',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
      {statCards.map((stat, index) => (
        <div
          key={index}
          className={`${stat.bgColor} rounded-lg p-4 border-2 ${stat.borderColor} hover:shadow-md transition-shadow`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-3xl">{stat.icon}</span>
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