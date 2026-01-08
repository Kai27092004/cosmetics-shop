import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import dashboardService from '../../services/dashboardService';
import { formatCurrency } from '../../utils/formatters';
import Loading from '../../components/common/Loading';
import showToast from '../../utils/toast';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
  });

  const [revenueChartData, setRevenueChartData] = useState([]);
  const [orderChartData, setOrderChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all data in parallel
      const [statsData, revenueData, orderData] = await Promise.all([
        dashboardService.getStats(),
        dashboardService.getRevenueChart(2026), // Đổi năm theo nhu cầu
        dashboardService.getOrderChart(2026),
      ]);

      setStats(statsData);
      setRevenueChartData(revenueData);
      setOrderChartData(orderData);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      showToast.error(err.message || 'Không thể tải dữ liệu dashboard');
      setError(err.message || 'Không thể tải dữ liệu dashboard');
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Tổng sản phẩm',
      value: stats.totalProducts,
      icon: '📦',
      bgColor: 'bg-blue-500',
      textColor: 'text-blue-600',
      bgLight: 'bg-blue-50',
      link: '/admin/products',
    },
    {
      title: 'Tổng đơn hàng',
      value: stats. totalOrders,
      icon:  '🛒',
      bgColor:  'bg-green-500',
      textColor: 'text-green-600',
      bgLight: 'bg-green-50',
      link: '/admin/orders',
    },
    {
      title: 'Người dùng',
      value:  stats.totalUsers,
      icon: '👥',
      bgColor: 'bg-purple-500',
      textColor: 'text-purple-600',
      bgLight: 'bg-purple-50',
      link:  '/admin/users',
    },
    {
      title: 'Doanh thu',
      value: formatCurrency(stats.totalRevenue),
      icon: '💰',
      bgColor: 'bg-yellow-500',
      textColor:  'text-yellow-600',
      bgLight: 'bg-yellow-50',
    },
  ];

  // Tính max value cho chart scaling
  const maxRevenue = Math.max(...revenueChartData.map(d => d.revenue), 1);
  const maxOrders = Math.max(...orderChartData.map(d => d.orders), 1);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loading size="lg" text="Đang tải dashboard..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Tổng quan hệ thống quản lý Cosmetics Shop</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <Link
            key={index}
            to={card.link || '#'}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-all transform hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-14 h-14 ${card.bgLight} rounded-xl flex items-center justify-center`}>
                <span className="text-3xl">{card.icon}</span>
              </div>
              <div className={`px-3 py-1 ${card.bgLight} rounded-full`}>
                <svg className={`w-5 h-5 ${card.textColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
            <h3 className="text-gray-500 text-sm font-medium mb-2">{card.title}</h3>
            <p className="text-3xl font-bold text-gray-900">{card.value}</p>
          </Link>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Doanh thu theo tháng</h2>
              <p className="text-sm text-gray-500">Năm 2026</p>
            </div>
            <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
              📈 Tăng trưởng
            </div>
          </div>

          {revenueChartData.length > 0 ? (
            <div className="space-y-3">
              {revenueChartData.map((item, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-700">{item.month}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900">
                        {formatCurrency(item.revenue)}
                      </span>
                      {item.growth !== 0 && (
                        <span
                          className={`text-xs px-2 py-0.5 rounded ${
                            item.growth > 0
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {item.growth > 0 ? '+' : ''}{item.growth}%
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-500"
                      style={{ width:  `${(item.revenue / maxRevenue) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              Chưa có dữ liệu doanh thu
            </div>
          )}
        </div>

        {/* Order Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Đơn hàng theo tháng</h2>
              <p className="text-sm text-gray-500">Năm 2026 (Các tháng chẵn)</p>
            </div>
            <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
              📊 Số lượng
            </div>
          </div>

          {orderChartData.length > 0 ? (
            <div className="space-y-3">
              {orderChartData.map((item, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-700">{item.month}</span>
                    <span className="font-bold text-gray-900">{item.orders} đơn</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-400 to-indigo-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(item.orders / maxOrders) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              Chưa có dữ liệu đơn hàng
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Thao tác nhanh</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            to="/admin/products"
            className="flex flex-col items-center gap-2 p-4 border-2 border-gray-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-all"
          >
            <span className="text-3xl">📦</span>
            <span className="text-sm font-medium text-gray-700">Quản lý sản phẩm</span>
          </Link>

          <Link
            to="/admin/orders"
            className="flex flex-col items-center gap-2 p-4 border-2 border-gray-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-all"
          >
            <span className="text-3xl">🛒</span>
            <span className="text-sm font-medium text-gray-700">Quản lý đơn hàng</span>
          </Link>

          <Link
            to="/admin/categories"
            className="flex flex-col items-center gap-2 p-4 border-2 border-gray-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-all"
          >
            <span className="text-3xl">🏷️</span>
            <span className="text-sm font-medium text-gray-700">Quản lý danh mục</span>
          </Link>

          <Link
            to="/admin/users"
            className="flex flex-col items-center gap-2 p-4 border-2 border-gray-200 rounded-lg hover:border-indigo-500 hover: bg-indigo-50 transition-all"
          >
            <span className="text-3xl">👥</span>
            <span className="text-sm font-medium text-gray-700">Quản lý người dùng</span>
          </Link>
        </div>
      </div>
    </div>
  );
}