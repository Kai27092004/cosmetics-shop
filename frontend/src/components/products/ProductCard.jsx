import { Link } from 'react-router-dom';
import { formatCurrency } from '../../utils/formatters';
import { getImageUrl } from '../../utils/helpers';
import useCart from '../../hooks/useCart';
import Button from '../common/Button';
import showToast from '../../utils/toast';

export default function ProductCard({ product }) {
  const { addToCart, isInCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault(); // Prevent navigation
    const result = addToCart(product, 1);
    if (result.success) {
      showToast.success(result.message);
    } else {
      showToast.error(result.message);
    }
  };

  return (
    <Link 
      to={`/products/${product.id}`}
      className="group bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <img
          src={getImageUrl(product.imageUrl)}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        {product.stockQuantity <= 0 && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="bg-red-500 text-white px-4 py-2 rounded-lg font-bold">
              Hết hàng
            </span>
          </div>
        )}
        {isInCart(product.id) && (
          <div className="absolute top-2 right-2 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
            ✓ Trong giỏ
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category */}
        {product.category && (
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">
            {product.category.name}
          </p>
        )}

        {/* Name */}
        <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
          {product.name}
        </h3>

        {/* Description */}
        {product.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {product.description}
          </p>
        )}

        {/* Price & Action */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xl font-bold text-primary-600">
              {formatCurrency(product.price)}
            </p>
            {product.stockQuantity > 0 && (
              <p className="text-xs text-gray-500">
                Còn {product.stockQuantity} sản phẩm
              </p>
            )}
          </div>
          
          <Button
            variant="primary"
            size="sm"
            onClick={handleAddToCart}
            disabled={product.stockQuantity <= 0}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </Button>
        </div>
      </div>
    </Link>
  );
}