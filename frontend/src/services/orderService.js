import { clientAPI, adminAPI } from './api';
import { API_ENDPOINTS } from '../utils/constants';

export const orderService = {
  // ==================== USER ORDER APIS ====================

  /**
   * Tạo đơn hàng mới
   * @param {object} orderData - {cartItems, shippingAddress, customerNotes}
   * @returns {Promise<object>} - {orderId, totalAmount, message}
   */
  createOrder: async (orderData) => {
    try {
      console. log('🛒 [Order Service] Creating order with', orderData. cartItems.length, 'items');
      
      const { data } = await clientAPI. post(API_ENDPOINTS. ORDERS, {
        cartItems: orderData. cartItems,
        shippingAddress: orderData.shippingAddress,
        customerNotes:  orderData.customerNotes || '',
        paymentMethod: orderData.paymentMethod || 'COD',
        phone: orderData.phone,
        fullName: orderData.fullName,
      });

      console.log('✅ [Order Service] Order created successfully:', data.orderId);
      
      // WebSocket sẽ tự động gửi notification từ backend
      // Frontend chỉ cần lắng nghe event 'order: created'
      
      return data;
    } catch (error) {
      console.error('❌ [Order Service] Failed to create order:', error.response?.data || error.message);
      throw error.response?.data || { message: error.message };
    }
  },

  /**
   * Lấy danh sách đơn hàng của user hiện tại
   * @returns {Promise<Array>} - Array of orders
   */
  getMyOrders: async () => {
    try {
      console. log('📋 [Order Service] Fetching my orders');
      
      const { data } = await clientAPI.get(API_ENDPOINTS.MY_ORDERS);
      
      console.log(`✅ [Order Service] Fetched ${data.length} orders`);
      return data;
    } catch (error) {
      console.error('❌ [Order Service] Failed to fetch orders:', error.response?.data || error.message);
      throw error.response?.data || { message: error.message };
    }
  },

  /**
   * Lấy chi tiết một đơn hàng
   * @param {number} orderId - Order ID
   * @returns {Promise<object>} - Order data
   */
  getOrderById: async (orderId) => {
    try {
      console.log('📋 [Order Service] Fetching order:', orderId);
      
      const { data } = await clientAPI.get(API_ENDPOINTS.ORDER_DETAIL(orderId));
      
      console.log('✅ [Order Service] Order fetched:', data);
      return data;
    } catch (error) {
      console.error('❌ [Order Service] Failed to fetch order:', error.response?.data || error.message);
      throw error.response?. data || { message: error.message };
    }
  },

  /**
   * Hủy đơn hàng (chỉ khi status = pending)
   * @param {number} orderId - Order ID
   * @returns {Promise<object>}
   */
  cancelOrder:  async (orderId) => {
    try {
      console.log('❌ [Order Service] Cancelling order:', orderId);
      
      const { data } = await clientAPI.post(API_ENDPOINTS.ORDER_CANCEL(orderId));
      
      console.log('✅ [Order Service] Order cancelled successfully');
      
      // WebSocket sẽ gửi notification 'order:cancelled'
      
      return data;
    } catch (error) {
      console.error('❌ [Order Service] Failed to cancel order:', error.response?.data || error.message);
      throw error.response?.data || { message: error.message };
    }
  },

  // ==================== ADMIN ORDER APIS ====================

  /**
   * Lấy tất cả đơn hàng (Admin only)
   * @param {object} params - {status, page, limit}
   * @returns {Promise<Array>} - Array of orders
   */
  getAllOrders: async (params = {}) => {
    try {
      console.log('📋 [Order Service] Admin fetching all orders');
      
      const { data } = await adminAPI.get(API_ENDPOINTS.ADMIN_ORDERS, { params });
      
      console.log(`✅ [Order Service] Fetched ${data.length} orders`);
      return data;
    } catch (error) {
      console.error('❌ [Order Service] Failed to fetch orders:', error.response?.data || error.message);
      throw error. response?.data || { message: error.message };
    }
  },

  /**
   * Lấy chi tiết đơn hàng (Admin)
   * @param {number} orderId - Order ID
   * @returns {Promise<object>} - Order data
   */
  getOrderByIdAdmin: async (orderId) => {
    try {
      console.log('📋 [Order Service] Admin fetching order:', orderId);
      
      const { data } = await adminAPI.get(API_ENDPOINTS.ADMIN_ORDER_DETAIL(orderId));
      
      console.log('✅ [Order Service] Order fetched');
      return data;
    } catch (error) {
      console.error('❌ [Order Service] Failed to fetch order:', error.response?.data || error.message);
      throw error.response?.data || { message: error.message };
    }
  },

  /**
   * Cập nhật trạng thái đơn hàng (Admin only)
   * @param {number} orderId - Order ID
   * @param {string} status - New status (pending, processing, shipped, delivered, cancelled)
   * @returns {Promise<object>} - Updated order
   */
  updateOrderStatus: async (orderId, status) => {
    try {
      console.log(`🔄 [Order Service] Admin updating order ${orderId} status to:`, status);
      
      const { data } = await adminAPI.put(API_ENDPOINTS.ADMIN_ORDER_UPDATE_STATUS(orderId), { status });
      
      console.log('✅ [Order Service] Order status updated successfully');
      
      // WebSocket sẽ tự động gửi notification 'order:statusChanged' đến user
      // và 'order:updated' đến admin
      
      return data;
    } catch (error) {
      console.error('❌ [Order Service] Failed to update order status:', error.response?.data || error.message);
      throw error.response?.data || { message: error.message };
    }
  },

  /**
   * Xóa đơn hàng (Admin only)
   * @param {number} orderId - Order ID
   * @returns {Promise<object>}
   */
  deleteOrder: async (orderId) => {
    try {
      console.log('🗑️ [Order Service] Admin deleting order:', orderId);
      
      const { data } = await adminAPI.delete(API_ENDPOINTS.ADMIN_ORDER_DELETE(orderId));
      
      console.log('✅ [Order Service] Order deleted successfully');
      
      // WebSocket sẽ gửi notification 'order:deleted'
      
      return data;
    } catch (error) {
      console.error('❌ [Order Service] Failed to delete order:', error.response?.data || error.message);
      throw error.response?.data || { message: error.message };
    }
  },
};

export default orderService;