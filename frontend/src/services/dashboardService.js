import { adminAPI } from './api';

export const dashboardService = {
  /**
   * Lấy thống kê tổng quan
   * @returns {Promise<object>}
   */
  getStats: async () => {
    try {
      console.log('📊 [Dashboard Service] Fetching stats...');
      const { data } = await adminAPI.get('/dashboard/stats');
      console.log('✅ [Dashboard Service] Stats fetched:', data);
      return data.data; // Backend trả về { success: true, data: {...} }
    } catch (error) {
      console.error('❌ [Dashboard Service] Failed to fetch stats:', error);
      throw error.response?.data || { message: error.message };
    }
  },

  /**
   * Lấy dữ liệu biểu đồ doanh thu
   * @param {number} year - Năm
   * @returns {Promise<Array>}
   */
  getRevenueChart: async (year = 2025) => {
    try {
      console.log('📈 [Dashboard Service] Fetching revenue chart for year:', year);
      const { data } = await adminAPI.get('/dashboard/revenue-chart', { params: { year } });
      console.log('✅ [Dashboard Service] Revenue chart fetched:', data);
      return data.data;
    } catch (error) {
      console.error('❌ [Dashboard Service] Failed to fetch revenue chart:', error);
      throw error.response?.data || { message: error.message };
    }
  },

  /**
   * Lấy dữ liệu biểu đồ đơn hàng
   * @param {number} year - Năm
   * @returns {Promise<Array>}
   */
  getOrderChart: async (year = 2025) => {
    try {
      console.log('📊 [Dashboard Service] Fetching order chart for year:', year);
      const { data } = await adminAPI.get('/dashboard/order-chart', { params: { year } });
      console.log('✅ [Dashboard Service] Order chart fetched:', data);
      return data.data;
    } catch (error) {
      console.error('❌ [Dashboard Service] Failed to fetch order chart:', error);
      throw error.response?.data || { message: error.message };
    }
  },
};

export default dashboardService;