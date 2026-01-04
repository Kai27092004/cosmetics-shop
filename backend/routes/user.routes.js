const express = require('express');
const router = express.Router();
const controller = require('../controllers/user.controller');
const { isAuthenticated } = require('../middleware/auth.middleware');
const { isAdmin } = require('../middleware/auth.middleware');

// Các route này yêu cầu người dùng phải đăng nhập
router.use(isAuthenticated);

router.get('/profile', controller.getProfile);
router.get('/my-orders', controller.getMyOrders);

// Routes cho admin
router.get('/admin/stats', isAdmin, controller.getUserStats);
router.get('/admin/all', isAdmin, controller.getAllUsers);
router.post('/admin/create', isAdmin, controller.createUser);
router.put('/admin/:id', isAdmin, controller.updateUser);
router.delete('/admin/:id', isAdmin, controller.deleteUser);

module.exports = router;