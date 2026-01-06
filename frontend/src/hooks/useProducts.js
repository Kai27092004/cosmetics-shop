import { useState, useEffect, useCallback } from 'react';
import productService from '../services/productService';

/**
 * Custom hook để fetch và quản lý products
 * @param {object} filters - {categoryId, search, page, limit}
 * @returns {object} - Products data và methods
 */
export function useProducts(filters = {}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch products
   */
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      console.log('📦 [useProducts] Fetching products with filters:', filters);
      
      const data = await productService.getAllProducts(filters);
      
      setProducts(data);
      console.log(`✅ [useProducts] Fetched ${data.length} products`);
    } catch (err) {
      console.error('❌ [useProducts] Failed to fetch products:', err);
      setError(err.message || 'Không thể tải sản phẩm');
    } finally {
      setLoading(false);
    }
  }, [filters. categoryId, filters.search, filters.page, filters.limit]);

  /**
   * Fetch products khi filters thay đổi
   */
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  /**
   * Refresh products
   */
  const refresh = useCallback(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    loading,
    error,
    refresh,
  };
}

export default useProducts;