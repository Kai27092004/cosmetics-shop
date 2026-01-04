const express = require('express');
const router = express.Router();
const emailController = require('../controllers/email.controller');
const { authenticateToken, requireAdmin } = require('../middleware/auth.middleware');

// Tất cả các route email đều yêu cầu quyền admin
router.use(authenticateToken, requireAdmin);

// ==================== EMAIL TEMPLATES ====================
// Lấy tất cả mẫu email
router.get('/templates', emailController.getAllTemplates);

// Lấy một mẫu email theo ID
router.get('/templates/:id', emailController.getTemplateById);

// Tạo mẫu email mới
router.post('/templates', emailController.createTemplate);

// Cập nhật mẫu email
router.put('/templates/:id', emailController.updateTemplate);

// Xóa mẫu email
router.delete('/templates/:id', emailController.deleteTemplate);

// ==================== GỬI EMAIL ====================
// Gửi email cho một hoặc nhiều người nhận
router.post('/send', emailController.sendEmail);

// Gửi email cho tất cả khách hàng
router.post('/send-to-all-customers', emailController.sendEmailToAllCustomers);

// ==================== LỊCH SỬ EMAIL ====================
// Lấy lịch sử gửi email
router.get('/logs', emailController.getEmailLogs);

// Lấy thống kê email
router.get('/stats', emailController.getEmailStats);

module.exports = router;
