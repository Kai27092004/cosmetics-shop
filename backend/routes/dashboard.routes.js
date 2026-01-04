const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Tất cả routes đều yêu cầu xác thực admin
router.use(authMiddleware.authenticateToken);
router.use(authMiddleware.requireAdmin);

// Lấy thống kê tổng quan dashboard
router.get('/stats', dashboardController.getDashboardStats);

// Lấy dữ liệu biểu đồ doanh thu
router.get('/revenue-chart', dashboardController.getRevenueChartData);

// Lấy dữ liệu biểu đồ đơn hàng
router.get('/order-chart', dashboardController.getOrderChartData);

module.exports = router;
