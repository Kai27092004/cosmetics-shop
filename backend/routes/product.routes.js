const express = require('express');
const router = express.Router();
const controller = require('../controllers/product.controller');
const { isAuthenticated, isAdmin } = require('../middleware/auth.middleware');

router.get('/', controller.getAllProducts);
router.get('/:id', controller.getProductById);

// Route này yêu cầu phải đăng nhập và là Admin
router.post('/', [isAuthenticated, isAdmin], controller.createProduct);
router.put('/:id', [isAuthenticated, isAdmin], controller.updateProduct);    
router.delete('/:id', [isAuthenticated, isAdmin], controller.deleteProduct); 

module.exports = router;