import { useCallback } from 'react';
import { useCartStore } from '../store/cartStore';
import { formatCurrency } from '../utils/formatters';

/**
 * Custom hook để xử lý shopping cart
 * @returns {object} - Cart methods và state
 */
export function useCart() {
  const {
    items,
    addItem:  addItemToStore,
    removeItem: removeItemFromStore,
    updateQuantity: updateQuantityInStore,
    incrementQuantity: incrementQty,
    decrementQuantity: decrementQty,
    clearCart: clearCartInStore,
    getTotalItems,
    getTotalPrice,
    isInCart:  checkIsInCart,
    getItemQuantity:  getQty,
    getItem,
  } = useCartStore();

  /**
   * Thêm sản phẩm vào giỏ hàng
   */
  const addToCart = useCallback((product, quantity = 1) => {
    console.log(`🛒 [useCart] Adding ${product.name} (x${quantity}) to cart`);
    
    addItemToStore(product, quantity);
    
    return {
      success: true,
      message: `Đã thêm "${product.name}" vào giỏ hàng`,
    };
  }, [addItemToStore]);

  /**
   * Xóa sản phẩm khỏi giỏ hàng
   */
  const removeFromCart = useCallback((productId) => {
    const item = getItem(productId);
    
    if (! item) {
      return {
        success: false,
        message: 'Sản phẩm không có trong giỏ hàng',
      };
    }
    
    console.log(`🗑️ [useCart] Removing ${item.name} from cart`);
    
    removeItemFromStore(productId);
    
    return {
      success:  true,
      message: `Đã xóa "${item.name}" khỏi giỏ hàng`,
    };
  }, [removeItemFromStore, getItem]);

  /**
   * Cập nhật số lượng
   */
  const updateQuantity = useCallback((productId, quantity) => {
    const item = getItem(productId);
    
    if (!item) {
      return {
        success: false,
        message: 'Sản phẩm không có trong giỏ hàng',
      };
    }
    
    if (quantity <= 0) {
      return removeFromCart(productId);
    }
    
    // Kiểm tra số lượng tồn kho
    if (quantity > item.stockQuantity) {
      return {
        success: false,
        message: `Chỉ còn ${item.stockQuantity} sản phẩm trong kho`,
      };
    }
    
    console.log(`🔄 [useCart] Updating ${item.name} quantity to ${quantity}`);
    
    updateQuantityInStore(productId, quantity);
    
    return {
      success: true,
      message: 'Đã cập nhật số lượng',
    };
  }, [updateQuantityInStore, removeFromCart, getItem]);

  /**
   * Tăng số lượng
   */
  const increment = useCallback((productId) => {
    const item = getItem(productId);
    
    if (!item) {
      return {
        success: false,
        message: 'Sản phẩm không có trong giỏ hàng',
      };
    }
    
    // Kiểm tra số lượng tồn kho
    if (item.quantity >= item.stockQuantity) {
      return {
        success:  false,
        message: `Chỉ còn ${item.stockQuantity} sản phẩm trong kho`,
      };
    }
    
    console.log(`➕ [useCart] Incrementing ${item.name}`);
    
    incrementQty(productId);
    
    return {
      success: true,
      message: 'Đã tăng số lượng',
    };
  }, [incrementQty, getItem]);

  /**
   * Giảm số lượng
   */
  const decrement = useCallback((productId) => {
    const item = getItem(productId);
    
    if (!item) {
      return {
        success: false,
        message:  'Sản phẩm không có trong giỏ hàng',
      };
    }
    
    console.log(`➖ [useCart] Decrementing ${item.name}`);
    
    decrementQty(productId);
    
    return {
      success: true,
      message:  item.quantity > 1 ? 'Đã giảm số lượng' : 'Đã xóa sản phẩm',
    };
  }, [decrementQty, getItem]);

  /**
   * Xóa toàn bộ giỏ hàng
   */
  const clearCart = useCallback(() => {
    console.log('🗑️ [useCart] Clearing cart');
    
    clearCartInStore();
    
    return {
      success: true,
      message: 'Đã xóa toàn bộ giỏ hàng',
    };
  }, [clearCartInStore]);

  /**
   * Kiểm tra giỏ hàng có rỗng không
   */
  const isEmpty = items.length === 0;

  /**
   * Tính tổng số lượng
   */
  const totalItems = getTotalItems();

  /**
   * Tính tổng tiền
   */
  const totalPrice = getTotalPrice();

  /**
   * Format tổng tiền
   */
  const formattedTotalPrice = formatCurrency(totalPrice);

  /**
   * Kiểm tra sản phẩm có trong giỏ không
   */
  const isInCart = useCallback((productId) => {
    return checkIsInCart(productId);
  }, [checkIsInCart]);

  /**
   * Lấy số lượng của sản phẩm
   */
  const getItemQuantity = useCallback((productId) => {
    return getQty(productId);
  }, [getQty]);

  /**
   * Validate giỏ hàng trước khi checkout
   */
  const validateCart = useCallback(() => {
    if (isEmpty) {
      return {
        valid: false,
        message: 'Giỏ hàng trống',
      };
    }

    // Kiểm tra số lượng tồn kho
    for (const item of items) {
      if (item.quantity > item.stockQuantity) {
        return {
          valid: false,
          message: `Sản phẩm "${item. name}" chỉ còn ${item. stockQuantity} trong kho`,
        };
      }
    }

    return {
      valid: true,
      message: 'Giỏ hàng hợp lệ',
    };
  }, [items, isEmpty]);

  return {
    // State
    items,
    isEmpty,
    totalItems,
    totalPrice,
    formattedTotalPrice,
    
    // Methods
    addToCart,
    removeFromCart,
    updateQuantity,
    increment,
    decrement,
    clearCart,
    isInCart,
    getItemQuantity,
    getItem,
    validateCart,
  };
}

export default useCart;