import { useState, useEffect } from 'react';
import Button from '../../../../components/common/Button';
import { debounce } from '../../../../utils/helpers';

export default function UserFilters({ filters, onFilterChange }) {
  const [localSearch, setLocalSearch] = useState(filters.search || '');

  // Debounce search
  useEffect(() => {
    const debouncedSearch = debounce(() => {
      onFilterChange({ search: localSearch });
    }, 500);

    debouncedSearch();
  }, [localSearch]);

  const handleRoleChange = (e) => {
    onFilterChange({ role: e.target.value });
  };

  const handleSortChange = (e) => {
    onFilterChange({ sortBy: e.target.value });
  };

  const handleClearFilters = () => {
    setLocalSearch('');
    onFilterChange({
      search: '',
      role: '',
      sortBy: 'createdAt',
    });
  };

  const hasActiveFilters = filters.search || filters.role || filters.sortBy !== 'createdAt';

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
            Xóa bộ l���c
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
              onChange={(e) => setLocalSearch(e. target.value)}
              placeholder="Tìm theo tên, email..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        {/* Role Filter */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Vai trò
          </label>
          <select
            value={filters.role || ''}
            onChange={handleRoleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">Tất cả vai trò</option>
            <option value="customer">Customer</option>
            <option value="admin">Admin</option>
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
            <option value="fullName">Tên A-Z</option>
            <option value="fullName-desc">Tên Z-A</option>
          </select>
        </div>
      </div>

      {/* Quick Filters */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-sm font-semibold text-gray-700 mb-3">Lọc nhanh: </p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onFilterChange({ role: '' })}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              ! filters.role
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Tất cả
          </button>
          <button
            onClick={() => onFilterChange({ role: 'customer' })}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filters. role === 'customer'
                ? 'bg-blue-500 text-white'
                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
            }`}
          >
            👤 Customers
          </button>
          <button
            onClick={() => onFilterChange({ role: 'admin' })}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filters. role === 'admin'
                ? 'bg-purple-500 text-white'
                : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
            }`}
          >
            👑 Admins
          </button>
        </div>
      </div>
    </div>
  );
}