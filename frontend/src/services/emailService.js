import { adminAPI } from './api';

export const emailService = {
  // ==================== EMAIL TEMPLATES ====================

  /**
   * Lấy tất cả mẫu email
   * @returns {Promise<Array>}
   */
  getAllTemplates: async () => {
    try {
      console.log('📧 [Email Service] Fetching all templates');
      const { data } = await adminAPI.get('/email/templates');
      console.log(`✅ [Email Service] Fetched ${data.length} templates`);
      return data;
    } catch (error) {
      console.error('❌ [Email Service] Failed to fetch templates:', error.response?.data || error.message);
      throw error.response?.data || { message: error.message };
    }
  },

  /**
   * Lấy một mẫu email theo ID
   * @param {number} id
   * @returns {Promise<object>}
   */
  getTemplateById: async (id) => {
    try {
      console.log('📧 [Email Service] Fetching template:', id);
      const { data } = await adminAPI.get(`/email/templates/${id}`);
      console.log('✅ [Email Service] Template fetched');
      return data;
    } catch (error) {
      console.error('❌ [Email Service] Failed to fetch template:', error.response?.data || error.message);
      throw error.response?.data || { message: error.message };
    }
  },

  /**
   * Tạo mẫu email mới
   * @param {object} templateData - {name, subject, content, description}
   * @returns {Promise<object>}
   */
  createTemplate: async (templateData) => {
    try {
      console.log('📧 [Email Service] Creating template:', templateData.name);
      const { data } = await adminAPI.post('/email/templates', templateData);
      console.log('✅ [Email Service] Template created');
      return data;
    } catch (error) {
      console.error('❌ [Email Service] Failed to create template:', error.response?.data || error.message);
      throw error.response?.data || { message: error.message };
    }
  },

  /**
   * Cập nhật mẫu email
   * @param {number} id
   * @param {object} templateData
   * @returns {Promise<object>}
   */
  updateTemplate: async (id, templateData) => {
    try {
      console.log('📧 [Email Service] Updating template:', id);
      const { data } = await adminAPI.put(`/email/templates/${id}`, templateData);
      console.log('✅ [Email Service] Template updated');
      return data;
    } catch (error) {
      console.error('❌ [Email Service] Failed to update template:', error.response?.data || error.message);
      throw error.response?.data || { message: error.message };
    }
  },

  /**
   * Xóa mẫu email
   * @param {number} id
   * @returns {Promise<object>}
   */
  deleteTemplate: async (id) => {
    try {
      console.log('📧 [Email Service] Deleting template:', id);
      const { data } = await adminAPI.delete(`/email/templates/${id}`);
      console.log('✅ [Email Service] Template deleted');
      return data;
    } catch (error) {
      console.error('❌ [Email Service] Failed to delete template:', error.response?.data || error.message);
      throw error.response?.data || { message: error.message };
    }
  },

  // ==================== GỬI EMAIL ====================

  /**
   * Gửi email cho một hoặc nhiều người nhận
   * @param {object} emailData - {recipients, subject, content, templateId}
   * @returns {Promise<object>}
   */
  sendEmail: async (emailData) => {
    try {
      console.log('📧 [Email Service] Sending email to', emailData.recipients?.length, 'recipients');
      const { data } = await adminAPI.post('/email/send', emailData);
      console.log('✅ [Email Service] Email sent');
      return data;
    } catch (error) {
      console.error('❌ [Email Service] Failed to send email:', error.response?.data || error.message);
      throw error.response?.data || { message: error.message };
    }
  },

  /**
   * Gửi email cho tất cả khách hàng
   * @param {object} emailData - {subject, content, templateId}
   * @returns {Promise<object>}
   */
  sendEmailToAllCustomers: async (emailData) => {
    try {
      console.log('📧 [Email Service] Sending email to all customers');
      const { data } = await adminAPI.post('/email/send-to-all-customers', emailData);
      console.log('✅ [Email Service] Email sent to all customers');
      return data;
    } catch (error) {
      console.error('❌ [Email Service] Failed to send email:', error.response?.data || error.message);
      throw error.response?.data || { message: error.message };
    }
  },

  // ==================== LỊCH SỬ EMAIL ====================

  /**
   * Lấy lịch sử gửi email
   * @param {object} params - {status, limit, offset}
   * @returns {Promise<object>}
   */
  getEmailLogs: async (params = {}) => {
    try {
      console.log('📧 [Email Service] Fetching email logs');
      const { data } = await adminAPI.get('/email/logs', { params });
      console.log(`✅ [Email Service] Fetched ${data.logs?.length} logs`);
      return data;
    } catch (error) {
      console.error('❌ [Email Service] Failed to fetch logs:', error.response?.data || error.message);
      throw error.response?.data || { message: error.message };
    }
  },

  /**
   * Lấy thống kê email
   * @returns {Promise<object>}
   */
  getEmailStats: async () => {
    try {
      console.log('📧 [Email Service] Fetching email stats');
      const { data } = await adminAPI.get('/email/stats');
      console.log('✅ [Email Service] Stats fetched');
      return data;
    } catch (error) {
      console.error('❌ [Email Service] Failed to fetch stats:', error.response?.data || error.message);
      throw error.response?.data || { message: error.message };
    }
  },
};

export default emailService;
