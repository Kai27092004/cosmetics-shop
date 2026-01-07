import { useState, useEffect } from 'react';
import { ORDER_STATUS_LABELS } from '../../../../utils/constants';
import Button from '../../../../components/common/Button';
import { debounce } from '../../../../utils/helpers';

export default function OrderFilters({ filters, onFilterChange }) {
  const [localSearch, setLocalSearch] = useState(filters.search || '');

  // Debounce search
  useEffect(() => {
    const debouncedSearch = debounce(() => {
      onFilterChange({ search: localSearch });
    }, 500);

    debouncedSearch();
  }, [localSearch]);

  const handleStatusChange = (e) => {
    onFilterChange({ status: e.target.value });
  };

  const handleSortChange = (e) => {
    onFilterChange({ sortBy: e.target.value });
  };

  const handleClearFilters = () => {
    setLocalSearch('');
    onFilterChange({
      search: '',
      status: '',
      sortBy: 'createdAt',
    });
  };

  const hasActiveFilters = filters.search || filters.status || filters.sortBy !== 'createdAt';

  const statusOptions = [
    { value: '', label: 'Tất cả trạng thái', count: 0 },
    { value: 'pending', label: ORDER_STATUS_LABELS.pending, count: 0 },
    { value: 'processing', label: ORDER_STATUS_LABELS.processing, count: 0 },
    { value: 'shipped', label: ORDER_STATUS_LABELS.shipped, count: 0 },
    { value: 'delivered', label: ORDER_STATUS_LABELS.delivered, count: 0 },
    { value: 'cancelled', label: ORDER_STATUS_LABELS.cancelled, count: 0 },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900">Bộ lọc</h3>
        {hasActiveFilters && (
          <Button
            variant="secondary"
            size="sm"
            onClick={handleClearFilters}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Xóa bộ lọc
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Tìm kiếm
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Tìm theo mã đơn, khách hàng..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Trạng thái
          </label>
          <select
            value={filters.status || ''}
            onChange={handleStatusChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Sort */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Sắp xếp theo
          </label>
          <select
            value={filters.sortBy || 'createdAt'}
            onChange={handleSortChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="createdAt">Mới nhất</option>
            <option value="createdAt-asc">Cũ nhất</option>
            <option value="totalAmount-desc">Giá trị:  Cao → Thấp</option>
            <option value="totalAmount-asc">Giá trị: Thấp → Cao</option>
          </select>
        </div>
      </div>

      {/* Quick Status Filters */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-sm font-semibold text-gray-700 mb-3">Lọc nhanh:</p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onFilterChange({ status: '' })}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              !filters.status
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Tất cả
          </button>
          <button
            onClick={() => onFilterChange({ status: 'pending' })}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filters.status === 'pending'
                ? 'bg-yellow-500 text-white'
                : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
            }`}
          >
            🕐 Chờ xử lý
          </button>
          <button
            onClick={() => onFilterChange({ status: 'processing' })}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filters.status === 'processing'
                ? 'bg-blue-500 text-white'
                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
            }`}
          >
            ⚙️ Đang xử lý
          </button>
          <button
            onClick={() => onFilterChange({ status: 'shipped' })}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filters.status === 'shipped'
                ? 'bg-purple-500 text-white'
                : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
            }`}
          >
            🚚 Đang giao
          </button>
          <button
            onClick={() => onFilterChange({ status: 'delivered' })}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filters.status === 'delivered'
                ? 'bg-green-500 text-white'
                : 'bg-green-100 text-green-700 hover:bg-green-200'
            }`}
          >
            ✅ Đã giao
          </button>
          <button
            onClick={() => onFilterChange({ status: 'cancelled' })}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filters.status === 'cancelled'
                ? 'bg-red-500 text-white'
                : 'bg-red-100 text-red-700 hover:bg-red-200'
            }`}
          >
            ❌ Đã hủy
          </button>
        </div>
      </div>
    </div>
  );
}