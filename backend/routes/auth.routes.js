const express = require('express');
const router = express.Router();
const controller = require('../controllers/auth.controller');
const passport = require('../config/passport');

// Đăng ký và đăng nhập thông thường
router.post('/register', controller.register);
router.post('/login', controller.login);

// Google OAuth Routes
router.get('/google',
    passport.authenticate('google', { 
        scope: ['profile', 'email'] 
    })
);

router.get('/google/callback',
    passport.authenticate('google', { 
        failureRedirect: '/api/auth/google/failure',
        session: false 
    }),
    controller.googleCallback
);

router.get('/google/failure', controller.googleFailure);

module.exports = router;