const db = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto'); // Thư viện có sẵn để tạo token ngẫu nhiên
const nodemailer = require('nodemailer'); // Thư viện gửi mail
const { Op } = require('sequelize'); // Để so sánh thời gian (lớn hơn, nhỏ hơn)
const User = db.User;

// Cấu hình gửi email (Nên dùng biến môi trường trong thực tế)
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
        user: process.env.EMAIL_USER, // Email của bạn (cấu hình trong .env)
        pass: process.env.EMAIL_PASSWORD  // App Password của Gmail (cấu hình trong .env)
    }
});

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
        if (user.isBlocked) {
            return res.status(403).send({ 
                message: "Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên." 
            });
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

        // ✅ Kiểm tra tài khoản có bị chặn không
        if (user.isBlocked) {
            return res.redirect(`${process.env.FRONTEND_URL}/login?error=account_blocked`);
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
// --- THÊM MỚI: 1. Gửi yêu cầu quên mật khẩu ---
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).send({ message: "Email không tồn tại trong hệ thống." });
        }

        // Nếu tài khoản Google (không có password) thì không cho reset
        if (!user.password && user.googleId) {
            return res.status(400).send({ message: "Tài khoản này đăng nhập bằng Google, không thể đổi mật khẩu." });
        }

        // Tạo token ngẫu nhiên
        const token = crypto.randomBytes(20).toString('hex');

        // Lưu token vào DB, hết hạn sau 1 giờ (3600000 ms)
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000;
        await user.save();

        // Link reset gửi qua mail (Trỏ về Frontend)
        const frontendURL = process.env.FRONTEND_URL || 'http://localhost:5173';
        const resetUrl = `${frontendURL}/reset-password/${token}`;

        // Nội dung email
        const mailOptions = {
            from: '"Cosmetics Shop Support" <no-reply@cosmeticsshop.com>',
            to: user.email,
            subject: 'Yêu cầu đặt lại mật khẩu',
            html: `
                <h3>Xin chào ${user.fullName},</h3>
                <p>Bạn nhận được email này vì đã yêu cầu đặt lại mật khẩu cho tài khoản của mình.</p>
                <p>Vui lòng click vào link bên dưới để đặt lại mật khẩu (Link có hiệu lực trong 1 giờ):</p>
                <a href="${resetUrl}" style="background-color: #db2777; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Đặt lại mật khẩu</a>
                <p>Hoặc copy link này: ${resetUrl}</p>
                <p>Nếu bạn không yêu cầu, vui lòng bỏ qua email này.</p>
            `
        };

        // Gửi mail
        await transporter.sendMail(mailOptions);

        res.status(200).send({ message: "Email hướng dẫn đặt lại mật khẩu đã được gửi." });

    } catch (error) {
        console.error("Forgot Password Error:", error);
        res.status(500).send({ message: "Lỗi server khi gửi email." });
    }
};

// --- THÊM MỚI: 2. Đặt lại mật khẩu mới ---
exports.resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        // Tìm user có token khớp VÀ thời gian chưa hết hạn
        const user = await User.findOne({
            where: {
                resetPasswordToken: token,
                resetPasswordExpires: { [Op.gt]: Date.now() } // Op.gt = greater than (lớn hơn hiện tại)
            }
        });

        if (!user) {
            return res.status(400).send({ message: "Token không hợp lệ hoặc đã hết hạn." });
        }

        // Cập nhật mật khẩu mới
        // Lưu ý: Hook 'beforeUpdate' trong model sẽ tự động mã hóa password này
        user.password = password;

        // Xóa token sau khi dùng xong
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;

        await user.save();

        res.status(200).send({ message: "Đổi mật khẩu thành công! Vui lòng đăng nhập lại." });

    } catch (error) {
        console.error("Reset Password Error:", error);
        res.status(500).send({ message: "Lỗi server khi đặt lại mật khẩu." });
    }
};