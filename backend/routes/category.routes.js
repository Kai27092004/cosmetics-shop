const router = require('express').Router();
const controller = require('../controllers/category.controller');
const auth = require('../middleware/auth.middleware');

// Public routes
router.get('/', controller.getAllCategories);

// Admin routes (cần authentication)
router.post('/', auth.isAuthenticated, auth.isAdmin, controller.createCategory);
router.put('/:id', auth.isAuthenticated, auth.isAdmin, controller.updateCategory);
router.delete('/:id', auth.isAuthenticated, auth.isAdmin, controller.deleteCategory);

module.exports = router;