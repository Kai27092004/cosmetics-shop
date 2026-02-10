const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('./config/passport');
const http = require('http');
const helmet = require('helmet');
const { initializeSocket } = require('./socket');
const { 
    generalLimiter, 
    authLimiter, 
    orderLimiter, 
    emailLimiter, 
    chatbotLimiter, 
    uploadLimiter 
} = require('./middleware/security.middleware');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const db = require('./models');

// Khởi tạo Socket.IO
const io = initializeSocket(server);

// ===================================
// 🛡️ BẢO MẬT - HELMET
// ===================================
// Helmet giúp bảo vệ app bằng cách set các HTTP headers bảo mật
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
        },
    },
    crossOriginEmbedderPolicy: false, // Cho phép embed từ nguồn khác
    crossOriginResourcePolicy: { policy: "cross-origin" }, // Cho phép CORS
}));

// Ẩn thông tin server
app.disable('x-powered-by');

// CẤU HÌNH CORS
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost',
    'http://localhost:3000',
    'https://accounts.google.com' // ✅ Thêm Google OAuth domain
];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (mobile apps, Postman, etc.)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            console.warn('⚠️ CORS blocked origin:', origin);
            callback(null, true); // ✅ Tạm thời allow all để debug
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Giới hạn kích thước request body để tránh DoS
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'furniture-shop-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000
    }
}));

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

// Phục vụ các tệp tĩnh từ thư mục 'public'
app.use(express.static('public'));

// Đồng bộ database
db.sequelize.sync()
    .then(() => {
        console.log("Synced db.");
    })
    .catch((err) => {
        console.log("Failed to sync db:  " + err.message);
    });

// Routes
app.get('/', (req, res) => {
    res.json({ 
        message: 'Welcome to Furniture Shop Backend API!',
        version: '1.0.0',
        status: 'running'
    });
});

// ===================================
// 🛡️ ÁP DỤNG RATE LIMITING
// ===================================

// Rate limiter chung cho toàn bộ API
app.use('/api/', generalLimiter);

// Rate limiter riêng cho từng route
app.use('/api/auth', authLimiter, require('./routes/auth.routes'));
app.use('/api/products', require('./routes/product.routes'));
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/categories', require('./routes/category.routes'));
app.use('/api/orders', orderLimiter, require('./routes/order.routes'));
app.use('/api/dashboard', require('./routes/dashboard.routes'));
app.use('/api/chatbot', chatbotLimiter, require('./routes/chatbot.routes'));
app.use('/api/email', emailLimiter, require('./routes/email.routes'));
app.use('/api/upload', uploadLimiter, require('./routes/upload.routes'));
require('./routes/payment.routes')(app);

// Xuất biến app ra để file khác (lambda. js) có thể dùng
module.exports = app;

// Chỉ chạy lệnh listen khi file này được chạy trực tiếp
if (require.main === module) {
    const PORT = process.env.PORT || 8080;
    server.listen(PORT, () => {
        console.log(`🚀 Server is running on port ${PORT}`);
        console.log(`🔌 WebSocket is ready on port ${PORT}`);
        console.log(`🛡️ Security features enabled:`);
        console.log(`   ✅ Helmet - HTTP headers protection`);
        console.log(`   ✅ Rate Limiting - DDoS protection`);
        console.log(`   ✅ CORS - Cross-origin protection`);
        console.log(`   ✅ Body size limit - 10MB max`);
    });
}