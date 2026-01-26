const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('./config/passport');
const http = require('http');
const { initializeSocket } = require('./socket');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const db = require('./models');

// Khởi tạo Socket.IO
const io = initializeSocket(server);

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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
    res.json({ message: 'Welcome to Furniture Shop Backend API!' });
});

// Sử dụng các routes đã định nghĩa
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/products', require('./routes/product.routes'));
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/categories', require('./routes/category.routes'));
app.use('/api/orders', require('./routes/order.routes'));
app.use('/api/dashboard', require('./routes/dashboard.routes'));
app.use('/api/chatbot', require('./routes/chatbot.routes'));
app.use('/api/email', require('./routes/email.routes'));
app.use('/api/upload', require('./routes/upload.routes'));
require('./routes/payment.routes')(app);

// Xuất biến app ra để file khác (lambda. js) có thể dùng
module.exports = app;

// Chỉ chạy lệnh listen khi file này được chạy trực tiếp
if (require.main === module) {
    const PORT = process.env.PORT || 8080;
    server.listen(PORT, () => {
        console.log(`🚀 Server is running on port ${PORT}`);
        console.log(`🔌 WebSocket is ready on port ${PORT}`);
    });
}