import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set, get) => ({
      // ==================== STATE ====================
      items: [], // Array of cart items:  [{ id, name, price, quantity, imageUrl, ...  }]

      // ==================== ACTIONS ====================

      /**
       * Thêm sản phẩm vào giỏ hàng
       * @param {object} product - Thông tin sản phẩm
       * @param {number} quantity - Số lượng (default: 1)
       */
      addItem: (product, quantity = 1) => {
        const items = get().items;
        const existingItem = items.find((item) => item.id === product.id);

        // ✅ Ensure imageUrl is preserved
        const productWithImage = {
          ...product,
          imageUrl: product.imageUrl || product.image || '',
        };

        if (existingItem) {
          // Nếu sản phẩm đã có trong giỏ → Tăng số lượng
          console.log(`🛒 [Cart] Updated quantity for product #${product.id}: `, existingItem.quantity, '→', existingItem.quantity + quantity);
          
          set({
            items: items.map((item) =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + quantity, imageUrl: productWithImage.imageUrl }
                :  item
            ),
          });
        } else {
          // Nếu chưa có → Thêm mới
          console.log(`🛒 [Cart] Added new product #${product.id} with quantity: `, quantity, 'imageUrl:', productWithImage.imageUrl);
          
          set({
            items: [...items, { ...productWithImage, quantity }],
          });
        }
      },

      /**
       * Xóa sản phẩm khỏi giỏ hàng
       * @param {number} productId - ID sản phẩm
       */
      removeItem: (productId) => {
        console.log(`🗑️ [Cart] Removed product #${productId}`);
        
        set({
          items: get().items.filter((item) => item.id !== productId),
        });
      },

      /**
       * Cập nhật số lượng sản phẩm
       * @param {number} productId - ID sản phẩm
       * @param {number} quantity - Số lượng mới
       */
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          // Nếu số lượng <= 0 → Xóa sản phẩm
          get().removeItem(productId);
          return;
        }

        console.log(`🔄 [Cart] Updated quantity for product #${productId}:`, quantity);

        set({
          items: get().items.map((item) =>
            item.id === productId ?  { ...item, quantity } : item
          ),
        });
      },

      /**
       * Tăng số lượng +1
       * @param {number} productId - ID sản phẩm
       */
      incrementQuantity: (productId) => {
        const item = get().items.find((item) => item.id === productId);
        if (item) {
          console.log(`➕ [Cart] Incremented quantity for product #${productId}`);
          get().updateQuantity(productId, item.quantity + 1);
        }
      },

      /**
       * Giảm số lượng -1
       * @param {number} productId - ID sản phẩm
       */
      decrementQuantity: (productId) => {
        const item = get().items.find((item) => item.id === productId);
        if (item) {
          console.log(`➖ [Cart] Decremented quantity for product #${productId}`);
          
          if (item.quantity > 1) {
            get().updateQuantity(productId, item. quantity - 1);
          } else {
            // Nếu số lượng = 1 → Xóa sản phẩm
            get().removeItem(productId);
          }
        }
      },

      /**
       * Xóa toàn bộ giỏ hàng
       */
      clearCart: () => {
        console.log('🗑️ [Cart] Cleared all items');
        set({ items: [] });
      },

      /**
       * Tính tổng số lượng sản phẩm trong giỏ
       * @returns {number}
       */
      getTotalItems: () => {
        const total = get().items.reduce((sum, item) => sum + item.quantity, 0);
        return total;
      },

      /**
       * Tính tổng tiền
       * @returns {number}
       */
      getTotalPrice:  () => {
        const total = get().items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
        return total;
      },

      /**
       * Kiểm tra sản phẩm có trong giỏ hàng không
       * @param {number} productId - ID sản phẩm
       * @returns {boolean}
       */
      isInCart: (productId) => {
        return get().items.some((item) => item.id === productId);
      },

      /**
       * Lấy số lượng của một sản phẩm
       * @param {number} productId - ID sản phẩm
       * @returns {number}
       */
      getItemQuantity: (productId) => {
        const item = get().items.find((item) => item.id === productId);
        return item ? item.quantity : 0;
      },

      /**
       * Lấy thông tin một sản phẩm trong giỏ
       * @param {number} productId - ID sản phẩm
       * @returns {object|null}
       */
      getItem: (productId) => {
        return get().items.find((item) => item.id === productId) || null;
      },
    }),
    {
      name: 'cart-storage', // localStorage key
    }
  )
);