const express = require('express');
const router = express.Router();
const controller = require('../controllers/order.controller');
const { isAuthenticated, isAdmin } = require('../middleware/auth.middleware');
const webhookController = require('../controllers/webhook.controller');

// Webhook endpoint for SePay (public, SePay will POST here)
router.post('/webhooks/sepay', express.json(), webhookController.handleSepay);

// === USER ROUTES ===

// Tạo đơn hàng mới
router.post(
    '/', 
    [isAuthenticated], 
    controller.createOrder
);

// Người dùng tự hủy đơn hàng (khi đang ở trạng thái "pending")
router.post(
    '/:orderId/cancel', 
    [isAuthenticated], 
    controller.cancelOrder
);

// Người dùng cập nhật trạng thái đơn hàng của chính họ
router.put(
    '/:orderId/status', 
    [isAuthenticated], 
    controller.updateOrderStatus
);

// Endpoint for frontend to poll order status
router.get('/:orderId/status', [isAuthenticated], controller.getOrderStatus);


// === ADMIN ROUTES ===

// [ADMIN] Lấy tất cả đơn hàng trong hệ thống
router.get(
    '/admin/all', 
    [isAuthenticated, isAdmin], 
    controller.getAllOrders
);

// [ADMIN] Lấy chi tiết một đơn hàng
router.get(
    '/admin/:orderId',
    [isAuthenticated, isAdmin],
    controller.getAdminOrderDetails
);

// [ADMIN] Cập nhật trạng thái của một đơn hàng bất kỳ
router.put(
    '/admin/:orderId/status',
    [isAuthenticated, isAdmin],
    controller.adminUpdateOrderStatus
);

// [ADMIN] Xóa đơn hàng (chỉ khi đã cancelled)
router.delete(
    '/admin/:orderId',
    [isAuthenticated, isAdmin],
    controller.adminDeleteOrder
);


module.exports = router;