const jwt = require('jsonwebtoken');
const db = require('../models');

exports.isAuthenticated = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).send({ message: "Vui lòng đăng nhập để truy cập." });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).send({ message: "Token không hợp lệ hoặc đã hết hạn." });
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
            message: "Vui lòng đăng nhập để truy cập." 
        });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ 
                success: false,
                message: "Token không hợp lệ hoặc đã hết hạn." 
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