const jwt = require('jsonwebtoken');
const db = require('../models');

exports.isAuthenticated = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).send({ 
            message: "Vui lòng đăng nhập để truy cập.",
            code: 'NO_TOKEN'
        });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            // Xác định loại lỗi JWT
            const isExpired = err.name === 'TokenExpiredError';
            return res.status(401).send({ 
                message: isExpired ? "Phiên đăng nhập đã hết hạn." : "Token không hợp lệ.",
                code: isExpired ? 'TOKEN_EXPIRED' : 'INVALID_TOKEN'
            });
        }
        req.userId = decoded.id; // Gắn id của user vào request
        req.userRole = decoded.role; // Gắn role của user vào request
        next();
    });
};

exports.isAdmin = (req, res, next) => {
    if (req.userRole && req.userRole === 'admin') {
        next();
    } else {
        res.status(403).send({ message: "Yêu cầu quyền Admin!" });
    }
};

// Middleware để xác thực token
exports.authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ 
            success: false,
            message: "Vui lòng đăng nhập để truy cập.",
            code: 'NO_TOKEN'
        });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            const isExpired = err.name === 'TokenExpiredError';
            return res.status(401).json({ 
                success: false,
                message: isExpired ? "Phiên đăng nhập đã hết hạn." : "Token không hợp lệ.",
                code: isExpired ? 'TOKEN_EXPIRED' : 'INVALID_TOKEN'
            });
        }
        req.userId = decoded.id;
        req.userRole = decoded.role;
        req.user = { id: decoded.id, role: decoded.role }; // Thêm user object để dùng trong controller
        next();
    });
};

// Middleware để yêu cầu quyền admin
exports.requireAdmin = (req, res, next) => {
    if (req.userRole && req.userRole === 'admin') {
        next();
    } else {
        res.status(403).json({ 
            success: false,
            message: "Yêu cầu quyền Admin!" 
        });
    }
};