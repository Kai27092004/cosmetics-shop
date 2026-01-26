const express = require('express');
const router = express.Router();
const controller = require('../controllers/auth.controller');
const passport = require('../config/passport');

// Đăng ký và đăng nhập thông thường
router.post('/register', controller.register);
router.post('/login', controller.login);
router.post('/forgot-password', controller.forgotPassword);
router.post('/reset-password/:token', controller.resetPassword);

// Google OAuth Routes
router.get('/google',
    passport.authenticate('google', {
        scope: ['profile', 'email'],
        accessType: 'offline',
        prompt: 'consent'
    })
);

router.get('/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/api/auth/google/failure',
        session: true // ✅ Bật session để passport lưu user
    }),
    controller.googleCallback
);

router.get('/google/failure', controller.googleFailure);

module.exports = router;