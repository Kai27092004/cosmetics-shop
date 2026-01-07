import { useState, useEffect } from 'react';
import categoryService from '../../../services/categoryService';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';
import { debounce } from '../../../utils/helpers';

export default function ProductFilters({ filters, onFilterChange }) {
  const [categories, setCategories] = useState([]);
  const [localSearch, setLocalSearch] = useState(filters.search || '');

  useEffect(() => {
    fetchCategories();
  }, []);

  // Debounce search để tránh gọi API liên tục khi user gõ
  useEffect(() => {
    const debouncedSearch = debounce(() => {
      onFilterChange({ search: localSearch });
    }, 500);

    debouncedSearch();
  }, [localSearch]);

  const fetchCategories = async () => {
    try {
      const data = await categoryService.getAllCategories();
      setCategories(data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const handleCategoryChange = (e) => {
    onFilterChange({ categoryId: e.target.value });
  };

  const handleSortChange = (e) => {
    onFilterChange({ sortBy: e.target.value });
  };

  const handleClearFilters = () => {
    setLocalSearch('');
    onFilterChange({
      search: '',
      categoryId: '',
      sortBy: 'createdAt',
    });
  };

  const hasActiveFilters = filters.search || filters.categoryId || filters. sortBy !== 'createdAt';

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
              placeholder="Tìm theo tên sản phẩm..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus: outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Danh mục
          </label>
          <select
            value={filters.categoryId || ''}
            onChange={handleCategoryChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">Tất cả danh mục</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat. name}
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
            <option value="name">Tên A-Z</option>
            <option value="price-asc">Giá:  Thấp → Cao</option>
            <option value="price-desc">Giá: Cao → Thấp</option>
            <option value="stock-asc">Tồn kho:  Ít → Nhiều</option>
            <option value="stock-desc">Tồn kho:  Nhiều → Ít</option>
          </select>
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-2">Đang lọc:</p>
          <div className="flex flex-wrap gap-2">
            {filters.search && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">
                Tìm kiếm: "{filters.search}"
                <button
                  onClick={() => {
                    setLocalSearch('');
                    onFilterChange({ search: '' });
                  }}
                  className="hover:bg-primary-200 rounded-full p-0.5"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            )}
            {filters.categoryId && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">
                Danh mục: {categories.find(c => c.id === parseInt(filters.categoryId))?.name}
                <button
                  onClick={() => onFilterChange({ categoryId: '' })}
                  className="hover:bg-indigo-200 rounded-full p-0.5"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}