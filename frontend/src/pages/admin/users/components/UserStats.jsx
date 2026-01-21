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
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      color: 'blue',
      bgColor: 'bg-gradient-to-br from-blue-50 to-blue-100',
      textColor: 'text-blue-700',
      iconColor: 'text-blue-600',
    },
    {
      title: 'Customers',
      value: formatNumber(stats.customers),
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      color: 'indigo',
      bgColor: 'bg-gradient-to-br from-indigo-50 to-indigo-100',
      textColor: 'text-indigo-700',
      iconColor: 'text-indigo-600',
    },
    {
      title: 'Admins',
      value: formatNumber(stats.admins),
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      color: 'purple',
      bgColor: 'bg-gradient-to-br from-purple-50 to-purple-100',
      textColor: 'text-purple-700',
      iconColor: 'text-purple-600',
    },
    {
      title: 'Hoạt động',
      value: formatNumber(stats.activeUsers),
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'green',
      bgColor: 'bg-gradient-to-br from-green-50 to-green-100',
      textColor: 'text-green-700',
      iconColor: 'text-green-600',
    },
    {
      title: 'Đã chặn',
      value: formatNumber(stats.blockedUsers),
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
        </svg>
      ),
      color: 'red',
      bgColor: 'bg-gradient-to-br from-red-50 to-red-100',
      textColor: 'text-red-700',
      iconColor: 'text-red-600',
    },
    {
      title: 'Mới tháng này',
      value: formatNumber(stats.newThisMonth),
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
        </svg>
      ),
      color: 'amber',
      bgColor: 'bg-gradient-to-br from-amber-50 to-amber-100',
      textColor: 'text-amber-700',
      iconColor: 'text-amber-600',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
      {statCards.map((stat, index) => (
        <div
          key={index}
          className={`${stat.bgColor} rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className={`${stat.iconColor}`}>
              {stat.icon}
            </div>
          </div>
          <p className="text-xs font-medium text-gray-600 mb-1">
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