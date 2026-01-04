const db = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = db.User;

// Hàm tạo JWT token
const generateToken = (user) => {
    return jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
    );
};

// Đăng ký
exports.register = async (req, res) => {
    try {
        const { fullName, email, password } = req.body;

        const user = await User.create({
            fullName,
            email,
            password
        });

        res.status(201).send({ message: "Đăng ký tài khoản thành công!" });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

// Đăng nhập
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).send({ message: "Email không tồn tại." });
        }

        // Kiểm tra nếu user đăng nhập bằng Google (không có password)
        if (!user.password) {
            return res.status(400).send({ 
                message: "Tài khoản này được đăng ký bằng Google. Vui lòng đăng nhập bằng Google." 
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).send({ accessToken: null, message: "Sai mật khẩu." });
        }

        // Tạo JWT
        const token = generateToken(user);

        res.status(200).send({
            id: user.id,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
            accessToken: token
        });

    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

// Google OAuth Success Callback
exports.googleCallback = async (req, res) => {
    try {
        const user = req.user;
        
        if (!user) {
            return res.redirect(`${process.env.FRONTEND_URL}/login?error=authentication_failed`);
        }

        // Tạo JWT token
        const token = generateToken(user);

        // Chuyển hướng về frontend với token
        res.redirect(`${process.env.FRONTEND_URL}/auth/google/callback?token=${token}&userId=${user.id}&name=${encodeURIComponent(user.fullName)}&email=${encodeURIComponent(user.email)}&role=${user.role}&avatar=${encodeURIComponent(user.avatar || '')}`);

    } catch (error) {
        console.error('Google callback error:', error);
        res.redirect(`${process.env.FRONTEND_URL}/login?error=server_error`);
    }
};

// Google OAuth Failure
exports.googleFailure = (req, res) => {
    res.redirect(`${process.env.FRONTEND_URL}/login?error=google_auth_failed`);
};