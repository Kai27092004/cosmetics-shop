import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import productService from '../../services/productService';
import categoryService from '../../services/categoryService';
import ProductCard from '../../components/products/ProductCard';
import Loading from '../../components/common/Loading';

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest');

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryService.getAllCategories();
        setCategories(data);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };

    fetchCategories();
  }, []);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = {};

        if (selectedCategory) params.categoryId = selectedCategory;
        if (searchTerm) params.search = searchTerm;

        const data = await productService.getAllProducts(params);
        setProducts(data);
      } catch (err) {
        setError(err.message || 'Không thể tải sản phẩm');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, searchTerm]);

  // Client-side sorting with proper logic
  const sortedProducts = useMemo(() => {
    const productsCopy = [...products];

    switch (sortBy) {
      case 'price-asc':
        return productsCopy.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return productsCopy.sort((a, b) => b.price - a.price);
      case 'name-asc':
        return productsCopy.sort((a, b) => a.name.localeCompare(b.name, 'vi'));
      case 'name-desc':
        return productsCopy.sort((a, b) => b.name.localeCompare(a.name, 'vi'));
      case 'newest':
      default:
        return productsCopy.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
  }, [products, sortBy]);

  // Update URL when filters change
  useEffect(() => {
    const params = {};
    if (selectedCategory) params.category = selectedCategory;
    if (searchTerm) params.search = searchTerm;
    if (sortBy !== 'newest') params.sort = sortBy;

    setSearchParams(params);
  }, [selectedCategory, searchTerm, sortBy, setSearchParams]);

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  const handleClearFilters = () => {
    setSelectedCategory('');
    setSearchTerm('');
    setSortBy('newest');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-pink-50/20 to-purple-50/20 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-5xl font-black text-gray-900 mb-3 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            Sản Phẩm
          </h1>
          <div className="flex items-center gap-2">
            <div className="w-12 h-1 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full"></div>
            <p className="text-gray-600 font-semibold">
              {sortedProducts.length} sản phẩm
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20 sticky top-24">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-black text-gray-900">Bộ Lọc</h2>
                </div>
                {(selectedCategory || searchTerm || sortBy !== 'newest') && (
                  <button
                    onClick={handleClearFilters}
                    className="text-sm text-pink-600 hover:text-pink-700 font-semibold transition-colors"
                  >
                    Xóa
                  </button>
                )}
              </div>

              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  🔍 Tìm kiếm
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Nhập tên sản phẩm..."
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-pink-500 transition-all"
                  />
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h3 className="text-sm font-bold text-gray-700 mb-3">
                  📂 Danh mục
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={() => handleCategoryChange('')}
                    className={`w-full text-left px-4 py-3 rounded-xl transition-all font-semibold ${selectedCategory === ''
                        ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg scale-105'
                        : 'text-gray-700 hover:bg-gray-100'
                      }`}
                  >
                    Tất cả
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => handleCategoryChange(category.id.toString())}
                      className={`w-full text-left px-4 py-3 rounded-xl transition-all font-semibold ${selectedCategory === category.id.toString()
                          ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg scale-105'
                          : 'text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort */}
              <div>
                <h3 className="text-sm font-bold text-gray-700 mb-3">
                  ⚡ Sắp xếp
                </h3>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-pink-500 transition-all font-semibold text-gray-700 cursor-pointer"
                >
                  <option value="newest">🆕 Mới nhất</option>
                  <option value="price-asc">💰 Giá: Thấp → Cao</option>
                  <option value="price-desc">💎 Giá: Cao → Thấp</option>
                  <option value="name-asc">🔤 Tên: A → Z</option>
                  <option value="name-desc">🔡 Tên: Z → A</option>
                </select>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="flex justify-center py-20">
                <Loading size="lg" text="Đang tải sản phẩm..." />
              </div>
            ) : error ? (
              <div className="text-center py-20 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-12">
                <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl">❌</span>
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-2">Có lỗi xảy ra</h3>
                <p className="text-red-600 mb-6">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                >
                  Thử lại
                </button>
              </div>
            ) : sortedProducts.length === 0 ? (
              <div className="text-center py-20 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-12">
                <div className="w-32 h-32 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-6xl">🔍</span>
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-3">
                  Không tìm thấy sản phẩm
                </h3>
                <p className="text-gray-600 mb-6">
                  Thử thay đổi bộ lọc hoặc tìm kiếm khác
                </p>
                <button
                  onClick={handleClearFilters}
                  className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                >
                  Xóa bộ lọc
                </button>
              </div>
            ) : (
              <div>
                {/* Sort info */}
                <div className="mb-6 flex items-center justify-between bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <p className="text-sm text-gray-600">
                    Hiển thị <span className="font-bold text-pink-600">{sortedProducts.length}</span> sản phẩm
                  </p>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>Sắp xếp:</span>
                    <span className="font-bold text-purple-600">
                      {sortBy === 'newest' && 'Mới nhất'}
                      {sortBy === 'price-asc' && 'Giá thấp → cao'}
                      {sortBy === 'price-desc' && 'Giá cao → thấp'}
                      {sortBy === 'name-asc' && 'Tên A → Z'}
                      {sortBy === 'name-desc' && 'Tên Z → A'}
                    </span>
                  </div>
                </div>

                {/* Products grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sortedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}