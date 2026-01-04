const express = require('express');
const cors = require('cors'); //Giấy thông hành", cho phép frontend được quyền giao tiếp với backend.
const session = require('express-session');
const passport = require('./config/passport');
require('dotenv').config();

const app = express();
const db = require('./models'); // Import db object từ models/index.js

// Middlewares
// app.use(cors({
//     origin: process.env.FRONTEND_URL || 'http://localhost:5173',
//     credentials: true
// }));
// === CẤU HÌNH CORS CHO PHÉP CẢ LOCAL VÀ VERCEL ===
const allowedOrigins = [
    'https://phatdev.vercel.app', // Domain Vercel của bạn
    'http://localhost:5173',      // Domain khi chạy local
    'http://localhost',            // Domain khi chạy Docker (Frontend port 80)
    'https://main.d3tqdtxbh1bkio.amplifyapp.com',  // Domain AWS Amplify của bạn
    'https://phatdev.id.vn',
    'https://www.phatdev.id.vn'
];

app.use(cors({
    origin: function (origin, callback) {
        // Cho phép nếu origin nằm trong danh sách, hoặc nếu là request không có origin (ví dụ: Postman)
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Domain này không được phép bởi CORS'));
        }
    },
    credentials: true
}));
// === KẾT THÚC CẤU HÌNH CORS ===
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration (cần cho Passport)
app.use(session({
    secret: process.env.SESSION_SECRET || 'furniture-shop-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

// Phục vụ các tệp tĩnh từ thư mục 'public'
app.use(express.static('public'));

// Đồng bộ database
// db.sequelize.sync({ force: true }) // Dùng { force: true } để xóa và tạo lại bảng, chỉ dùng trong dev
db.sequelize.sync()
    .then(() => {
        console.log("Synced db.");
    })
    .catch((err) => {
        console.log("Failed to sync db: " + err.message);
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
// Thêm các routes khác ở đây...
require('./routes/payment.routes')(app);

// Xuất biến app ra để file khác (lambda.js) có thể dùng
module.exports = app;

// Chỉ chạy lệnh listen khi file này được chạy trực tiếp (bởi Docker/Node)
// Nếu file này được import bởi Lambda, đoạn này sẽ bị bỏ qua -> An toàn tuyệt đối
if (require.main === module) {
    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}