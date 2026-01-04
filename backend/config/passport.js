require('dotenv').config(); // ✅ THÊM DÒNG NÀY ĐỂ ĐỌC .env TRƯỚC

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const db = require('../models');
const User = db.User;

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findByPk(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

// Google OAuth Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:8080/api/auth/google/callback'
},
async (accessToken, refreshToken, profile, done) => {
    try {
        // Kiểm tra xem user đã tồn tại chưa
        let user = await User.findOne({ where: { googleId: profile.id } });

        if (user) {
            // User đã tồn tại, cập nhật thông tin
            user.fullName = profile.displayName;
            user.avatar = profile.photos && profile.photos.length > 0 ? profile.photos[0].value : null;
            await user.save();
            return done(null, user);
        }

        // Kiểm tra xem email đã được đăng ký chưa
        user = await User.findOne({ where: { email: profile.emails[0].value } });

        if (user) {
            // Email đã tồn tại, liên kết với Google
            user.googleId = profile.id;
            user.avatar = profile.photos && profile.photos.length > 0 ? profile.photos[0].value : null;
            await user.save();
            return done(null, user);
        }

        // Tạo user mới
        const newUser = await User.create({
            googleId: profile.id,
            fullName: profile.displayName,
            email: profile.emails[0].value,
            avatar: profile.photos && profile.photos.length > 0 ? profile.photos[0].value : null,
            role: 'customer'
        });

        return done(null, newUser);

    } catch (error) {
        console.error('Google OAuth Error:', error);
        return done(error, null);
    }
}));

module.exports = passport;
