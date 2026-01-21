import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FaBox,
  FaShoppingCart,
  FaUsers,
  FaMoneyBillWave,
  FaTags,
  FaChartLine,
  FaChartBar
} from 'react-icons/fa';
import {
  ComposedChart,
  BarChart,
  Bar,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
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

  // Separate year states for each chart
  const [revenueYear, setRevenueYear] = useState(2026);
  const [ordersYear, setOrdersYear] = useState(2026);
  const [revenueYearDropdownOpen, setRevenueYearDropdownOpen] = useState(false);
  const [ordersYearDropdownOpen, setOrdersYearDropdownOpen] = useState(false);

  const availableYears = [2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030];

  // Initial data fetch
  useEffect(() => {
    fetchInitialData();
  }, []);

  // Fetch revenue data when revenue year changes
  useEffect(() => {
    if (!loading) { // Only fetch if initial load is complete
      fetchRevenueData();
    }
  }, [revenueYear]);

  // Fetch orders data when orders year changes
  useEffect(() => {
    if (!loading) { // Only fetch if initial load is complete
      fetchOrdersData();
    }
  }, [ordersYear]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all data in parallel on initial load
      const [statsData, revenueData, orderData] = await Promise.all([
        dashboardService.getStats(),
        dashboardService.getRevenueChart(revenueYear),
        dashboardService.getOrderChart(ordersYear),
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

  const fetchRevenueData = async () => {
    try {
      const revenueData = await dashboardService.getRevenueChart(revenueYear);
      setRevenueChartData(revenueData);
    } catch (err) {
      console.error('Error fetching revenue data:', err);
      showToast.error('Không thể tải dữ liệu doanh thu');
    }
  };

  const fetchOrdersData = async () => {
    try {
      const orderData = await dashboardService.getOrderChart(ordersYear);
      setOrderChartData(orderData);
    } catch (err) {
      console.error('Error fetching orders data:', err);
      showToast.error('Không thể tải dữ liệu đơn hàng');
    }
  };

  // Revenue chart year navigation
  const handleRevenuePreviousYear = () => {
    const currentIndex = availableYears.indexOf(revenueYear);
    if (currentIndex > 0) {
      setRevenueYear(availableYears[currentIndex - 1]);
    }
  };

  const handleRevenueNextYear = () => {
    const currentIndex = availableYears.indexOf(revenueYear);
    if (currentIndex < availableYears.length - 1) {
      setRevenueYear(availableYears[currentIndex + 1]);
    }
  };

  const handleRevenueYearSelect = (year) => {
    setRevenueYear(year);
    setRevenueYearDropdownOpen(false);
  };

  // Orders chart year navigation
  const handleOrdersPreviousYear = () => {
    const currentIndex = availableYears.indexOf(ordersYear);
    if (currentIndex > 0) {
      setOrdersYear(availableYears[currentIndex - 1]);
    }
  };

  const handleOrdersNextYear = () => {
    const currentIndex = availableYears.indexOf(ordersYear);
    if (currentIndex < availableYears.length - 1) {
      setOrdersYear(availableYears[currentIndex + 1]);
    }
  };

  const handleOrdersYearSelect = (year) => {
    setOrdersYear(year);
    setOrdersYearDropdownOpen(false);
  };

  const statCards = [
    {
      title: 'Tổng sản phẩm',
      value: stats.totalProducts,
      icon: FaBox,
      bgColor: 'bg-blue-500',
      textColor: 'text-blue-600',
      bgLight: 'bg-blue-50',
      link: '/admin/products',
    },
    {
      title: 'Tổng đơn hàng',
      value: stats.totalOrders,
      icon: FaShoppingCart,
      bgColor: 'bg-green-500',
      textColor: 'text-green-600',
      bgLight: 'bg-green-50',
      link: '/admin/orders',
    },
    {
      title: 'Người dùng',
      value: stats.totalUsers,
      icon: FaUsers,
      bgColor: 'bg-purple-500',
      textColor: 'text-purple-600',
      bgLight: 'bg-purple-50',
      link: '/admin/users',
    },
    {
      title: 'Doanh thu',
      value: formatCurrency(stats.totalRevenue),
      icon: FaMoneyBillWave,
      bgColor: 'bg-yellow-500',
      textColor: 'text-yellow-600',
      bgLight: 'bg-yellow-50',
    },
  ];

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
        {statCards.map((card, index) => {
          const IconComponent = card.icon;
          return (
            <Link
              key={index}
              to={card.link || '#'}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-all transform hover:-translate-y-1"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-14 h-14 ${card.bgLight} rounded-xl flex items-center justify-center`}>
                  <IconComponent className={`text-3xl ${card.textColor}`} />
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
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Doanh thu theo tháng</h2>
              <p className="text-sm text-gray-500">Năm {revenueYear}</p>
            </div>
            <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold flex items-center gap-1">
              <FaChartLine /> Tăng trưởng
            </div>
          </div>

          {/* Year Selector */}
          <div className="flex items-center justify-center gap-3 mb-4">
            {/* Previous Year Button */}
            <button
              onClick={handleRevenuePreviousYear}
              disabled={availableYears.indexOf(revenueYear) === 0}
              className={`p-2 rounded-lg transition-all ${availableYears.indexOf(revenueYear) === 0
                ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                : 'bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:shadow-lg hover:scale-105'
                }`}
              title="Năm trước"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Year Dropdown */}
            <div className="relative">
              <button
                onClick={() => setRevenueYearDropdownOpen(!revenueYearDropdownOpen)}
                className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg font-bold text-lg shadow-md hover:shadow-lg transition-all flex items-center gap-2"
              >
                {revenueYear}
                <svg className={`w-4 h-4 transition-transform ${revenueYearDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {revenueYearDropdownOpen && (
                <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-xl border border-pink-200 py-2 z-10 max-h-60 overflow-y-auto">
                  {availableYears.map((year) => (
                    <button
                      key={year}
                      onClick={() => handleRevenueYearSelect(year)}
                      className={`w-full px-6 py-2 text-left transition-all ${year === revenueYear
                        ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold'
                        : 'text-gray-700 hover:bg-pink-50'
                        }`}
                    >
                      {year}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Next Year Button */}
            <button
              onClick={handleRevenueNextYear}
              disabled={availableYears.indexOf(revenueYear) === availableYears.length - 1}
              className={`p-2 rounded-lg transition-all ${availableYears.indexOf(revenueYear) === availableYears.length - 1
                ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                : 'bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:shadow-lg hover:scale-105'
                }`}
              title="Năm sau"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {revenueChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart
                data={revenueChartData}
                margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12 }}
                  stroke="#9ca3af"
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  stroke="#9ca3af"
                  tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                  formatter={(value) => [formatCurrency(value), 'Doanh thu']}
                />
                <Legend
                  wrapperStyle={{ paddingTop: '20px' }}
                  iconType="circle"
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  fill="url(#colorRevenue)"
                  stroke="none"
                  name="Xu hướng"
                />
                <Bar
                  dataKey="revenue"
                  fill="#10b981"
                  radius={[8, 8, 0, 0]}
                  name="Doanh thu"
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#059669"
                  strokeWidth={2}
                  dot={{ fill: '#059669', r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Đường xu hướng"
                />
              </ComposedChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-12 text-gray-500">
              Chưa có dữ liệu doanh thu
            </div>
          )}
        </div>

        {/* Order Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Đơn hàng theo tháng</h2>
              <p className="text-sm text-gray-500">Năm {ordersYear} (Các tháng chẵn)</p>
            </div>
            <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold flex items-center gap-1">
              <FaChartBar /> Số lượng
            </div>
          </div>

          {/* Year Selector */}
          <div className="flex items-center justify-center gap-3 mb-4">
            {/* Previous Year Button */}
            <button
              onClick={handleOrdersPreviousYear}
              disabled={availableYears.indexOf(ordersYear) === 0}
              className={`p-2 rounded-lg transition-all ${availableYears.indexOf(ordersYear) === 0
                ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                : 'bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:shadow-lg hover:scale-105'
                }`}
              title="Năm trước"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Year Dropdown */}
            <div className="relative">
              <button
                onClick={() => setOrdersYearDropdownOpen(!ordersYearDropdownOpen)}
                className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg font-bold text-lg shadow-md hover:shadow-lg transition-all flex items-center gap-2"
              >
                {ordersYear}
                <svg className={`w-4 h-4 transition-transform ${ordersYearDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {ordersYearDropdownOpen && (
                <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-xl border border-pink-200 py-2 z-10 max-h-60 overflow-y-auto">
                  {availableYears.map((year) => (
                    <button
                      key={year}
                      onClick={() => handleOrdersYearSelect(year)}
                      className={`w-full px-6 py-2 text-left transition-all ${year === ordersYear
                        ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold'
                        : 'text-gray-700 hover:bg-pink-50'
                        }`}
                    >
                      {year}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Next Year Button */}
            <button
              onClick={handleOrdersNextYear}
              disabled={availableYears.indexOf(ordersYear) === availableYears.length - 1}
              className={`p-2 rounded-lg transition-all ${availableYears.indexOf(ordersYear) === availableYears.length - 1
                ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                : 'bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:shadow-lg hover:scale-105'
                }`}
              title="Năm sau"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {orderChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={orderChartData}
                margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.8} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12 }}
                  stroke="#9ca3af"
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  stroke="#9ca3af"
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                  formatter={(value) => [value, 'Đơn hàng']}
                  cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
                />
                <Legend
                  wrapperStyle={{ paddingTop: '20px' }}
                  iconType="rect"
                />
                <Bar
                  dataKey="orders"
                  fill="url(#colorOrders)"
                  radius={[8, 8, 0, 0]}
                  name="Số đơn hàng"
                  label={{ position: 'top', fontSize: 12, fill: '#6b7280' }}
                />
              </BarChart>
            </ResponsiveContainer>
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
            <FaBox className="text-3xl text-indigo-600" />
            <span className="text-sm font-medium text-gray-700">Quản lý sản phẩm</span>
          </Link>

          <Link
            to="/admin/orders"
            className="flex flex-col items-center gap-2 p-4 border-2 border-gray-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-all"
          >
            <FaShoppingCart className="text-3xl text-indigo-600" />
            <span className="text-sm font-medium text-gray-700">Quản lý đơn hàng</span>
          </Link>

          <Link
            to="/admin/categories"
            className="flex flex-col items-center gap-2 p-4 border-2 border-gray-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-all"
          >
            <FaTags className="text-3xl text-indigo-600" />
            <span className="text-sm font-medium text-gray-700">Quản lý danh mục</span>
          </Link>

          <Link
            to="/admin/users"
            className="flex flex-col items-center gap-2 p-4 border-2 border-gray-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-all"
          >
            <FaUsers className="text-3xl text-indigo-600" />
            <span className="text-sm font-medium text-gray-700">Quản lý người dùng</span>
          </Link>
        </div>
      </div>
    </div>
  );
}