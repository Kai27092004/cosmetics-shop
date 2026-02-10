const rateLimit = require('express-rate-limit');

// ===================================
// 1. RATE LIMITING - Giới hạn request
// ===================================

// Rate limiter chung cho toàn bộ API
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 phút
    max: 100, // Giới hạn 100 requests mỗi 15 phút
    message: {
        error: 'Quá nhiều yêu cầu từ IP này, vui lòng thử lại sau 15 phút.',
        retryAfter: '15 minutes'
    },
    standardHeaders: true, // Trả về rate limit info trong `RateLimit-*` headers
    legacyHeaders: false, // Tắt `X-RateLimit-*` headers
    handler: (req, res) => {
        console.warn(`⚠️ Rate limit exceeded for IP: ${req.ip}`);
        res.status(429).json({
            error: 'Quá nhiều yêu cầu từ IP này',
            message: 'Vui lòng thử lại sau 15 phút',
            retryAfter: '15 minutes'
        });
    }
});

// Rate limiter nghiêm ngặt cho Auth (đăng nhập, đăng ký)
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 phút
    max: 5, // Chỉ cho phép 5 lần thử đăng nhập mỗi 15 phút
    skipSuccessfulRequests: true, // Không đếm request thành công
    message: {
        error: 'Quá nhiều lần thử đăng nhập, vui lòng thử lại sau 15 phút.',
        retryAfter: '15 minutes'
    },
    handler: (req, res) => {
        console.warn(`🚨 Auth rate limit exceeded for IP: ${req.ip}`);
        res.status(429).json({
            error: 'Quá nhiều lần thử đăng nhập',
            message: 'Tài khoản tạm thời bị khóa. Vui lòng thử lại sau 15 phút.',
            retryAfter: '15 minutes'
        });
    }
});

// Rate limiter cho API tạo đơn hàng
const orderLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 giờ
    max: 10, // Tối đa 10 đơn hàng mỗi giờ
    message: {
        error: 'Quá nhiều đơn hàng được tạo, vui lòng thử lại sau 1 giờ.',
        retryAfter: '1 hour'
    },
    handler: (req, res) => {
        console.warn(`🛒 Order rate limit exceeded for IP: ${req.ip}`);
        res.status(429).json({
            error: 'Quá nhiều đơn hàng',
            message: 'Bạn đã tạo quá nhiều đơn hàng. Vui lòng thử lại sau 1 giờ.',
            retryAfter: '1 hour'
        });
    }
});

// Rate limiter cho API gửi email
const emailLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 giờ
    max: 5, // Tối đa 5 email mỗi giờ
    message: {
        error: 'Quá nhiều email được gửi, vui lòng thử lại sau 1 giờ.',
        retryAfter: '1 hour'
    },
    handler: (req, res) => {
        console.warn(`📧 Email rate limit exceeded for IP: ${req.ip}`);
        res.status(429).json({
            error: 'Quá nhiều email',
            message: 'Bạn đã gửi quá nhiều email. Vui lòng thử lại sau 1 giờ.',
            retryAfter: '1 hour'
        });
    }
});

// Rate limiter cho Chatbot API
const chatbotLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 phút
    max: 10, // Tối đa 10 tin nhắn mỗi phút
    message: {
        error: 'Quá nhiều tin nhắn, vui lòng chậm lại.',
        retryAfter: '1 minute'
    },
    handler: (req, res) => {
        console.warn(`🤖 Chatbot rate limit exceeded for IP: ${req.ip}`);
        res.status(429).json({
            error: 'Quá nhiều tin nhắn',
            message: 'Vui lòng chậm lại và thử lại sau 1 phút.',
            retryAfter: '1 minute'
        });
    }
});

// Rate limiter cho Upload API
const uploadLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 giờ
    max: 20, // Tối đa 20 uploads mỗi giờ
    message: {
        error: 'Quá nhiều file upload, vui lòng thử lại sau 1 giờ.',
        retryAfter: '1 hour'
    },
    handler: (req, res) => {
        console.warn(`📤 Upload rate limit exceeded for IP: ${req.ip}`);
        res.status(429).json({
            error: 'Quá nhiều file upload',
            message: 'Bạn đã upload quá nhiều file. Vui lòng thử lại sau 1 giờ.',
            retryAfter: '1 hour'
        });
    }
});

module.exports = {
    generalLimiter,
    authLimiter,
    orderLimiter,
    emailLimiter,
    chatbotLimiter,
    uploadLimiter
};
