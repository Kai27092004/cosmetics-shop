import { useState, useEffect } from 'react';
import categoryService from '../../services/categoryService';
import Button from '../common/Button';

export default function ProductFilter({ 
  selectedCategory, 
  onCategoryChange, 
  onClearFilters 
}) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await categoryService. getAllCategories();
      setCategories(data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900">Danh mục</h2>
        {selectedCategory && (
          <Button
            variant="secondary"
            size="sm"
            onClick={onClearFilters}
          >
            Xóa bộ lọc
          </Button>
        )}
      </div>

      {loading ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-10 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          <button
            onClick={() => onCategoryChange('')}
            className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
              ! selectedCategory
                ? 'bg-primary-600 text-white'
                :  'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Tất cả sản phẩm
          </button>

          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                selectedCategory === category. id
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {category.name}
              {category.productCount && (
                <span className="ml-2 text-sm opacity-75">
                  ({category.productCount})
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}