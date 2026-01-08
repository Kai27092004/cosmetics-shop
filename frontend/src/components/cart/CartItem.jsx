import { getImageUrl } from '../../utils/helpers';
import { formatCurrency } from '../../utils/formatters';
import Button from '../common/Button';

export default function CartItem({ item, onIncrease, onDecrease, onRemove, onUpdateQuantity }) {
  const handleQuantityChange = (e) => {
    const value = parseInt(e.target. value) || 1;
    onUpdateQuantity(item, value);
  };

  return (
    <div className="flex gap-4 p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
      {/* Image */}
      <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
        <img
          src={getImageUrl(item.imageUrl)}
          alt={item. name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="96" height="96"%3E%3Crect fill="%23f0f0f0" width="96" height="96"/%3E%3Ctext fill="%23999" font-family="sans-serif" font-size="14" dy="5" font-weight="400" x="50%25" y="50%25" text-anchor="middle"%3ENo Image%3C/text%3E%3C/svg%3E';
          }}
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h3 className="text-lg font-bold text-gray-900 mb-1 truncate">
          {item.name}
        </h3>
        <p className="text-sm text-gray-500 mb-2">
          {item.category?. name || 'Mỹ phẩm'}
        </p>
        <p className="text-xl font-bold text-primary-600">
          {formatCurrency(item.price)}
        </p>
      </div>

      {/* Quantity Controls */}
      <div className="flex flex-col items-end gap-2">
        <button
          onClick={() => onRemove(item)}
          className="text-red-600 hover:text-red-700 p-1"
          title="Xóa"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onDecrease(item)}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-100"
          >
            -
          </button>
          <input
            type="number"
            value={item.quantity}
            onChange={handleQuantityChange}
            min="1"
            max={item.stockQuantity}
            className="w-16 px-2 py-1 text-center border border-gray-300 rounded-lg"
          />
          <button
            onClick={() => onIncrease(item)}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-100"
          >
            +
          </button>
        </div>

        <p className="text-sm text-gray-500">
          Tồn kho: {item.stockQuantity}
        </p>
      </div>
    </div>
  );
}