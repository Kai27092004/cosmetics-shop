# 📚 BACKEND DOCUMENTATION - TỔNG HỢP

## 📋 Giới Thiệu

Đây là tài liệu đầy đủ cho Backend API của hệ thống **Cosmetics Shop** (E-commerce Platform).

Backend được xây dựng bằng:
- **Node.js** + **Express.js**
- **MySQL** + **Sequelize ORM**
- **JWT** Authentication
- **Socket.IO** Realtime
- **OpenAI GPT-3.5** Chatbot
- **Nodemailer** Email
- **Multer** File Upload

---

## 📂 Danh Sách Tài Liệu

### 1. [🔐 AUTHENTICATION.md](./AUTHENTICATION.md)
**Xác thực & Đăng nhập**
- Đăng ký tài khoản
- Đăng nhập (Email + Password)
- Đăng nhập bằng Google OAuth 2.0
- Quên mật khẩu (Reset password)
- JWT Token authentication
- Middleware xác thực

### 2. [🛍️ PRODUCTS.md](./PRODUCTS.md)
**Quản lý sản phẩm**
- Xem danh sách sản phẩm (Public)
- Xem chi tiết sản phẩm
- Tạo/Sửa/Xóa sản phẩm (Admin)
- Tìm kiếm và lọc sản phẩm
- Quản lý ảnh sản phẩm (ảnh chính + ảnh phụ)
- Quản lý tồn kho

### 3. [🛒 ORDERS.md](./ORDERS.md)
**Quản lý đơn hàng**
- Tạo đơn hàng (User)
- Hủy đơn hàng (User)
- Xem chi tiết đơn hàng
- Quản lý tất cả đơn hàng (Admin)
- Cập nhật trạng thái đơn hàng
- Webhook thanh toán SePay
- Realtime notifications (Socket.IO)

### 4. [👥 USERS.md](./USERS.md)
**Quản lý người dùng**
- Xem và cập nhật profile
- Đổi mật khẩu
- Xem lịch sử đơn hàng
- Quản lý tất cả người dùng (Admin)
- Tạo/Sửa/Xóa người dùng (Admin)
- Khóa/Mở khóa tài khoản (Admin)

### 5. [📂 CATEGORIES.md](./CATEGORIES.md)
**Quản lý danh mục**
- Xem danh sách danh mục (Public)
- Tạo/Sửa/Xóa danh mục (Admin)
- Đếm số sản phẩm trong mỗi danh mục
- Lọc sản phẩm theo danh mục

### 6. [🤖 CHATBOT.md](./CHATBOT.md)
**Chatbot AI**
- Tìm kiếm sản phẩm thông minh
- Phân tích câu hỏi bằng OpenAI GPT-3.5
- Fallback analysis (rule-based)
- Trả lời câu hỏi chung về chính sách
- Trích xuất giá tiền và từ khóa

### 7. [📧 EMAIL.md](./EMAIL.md)
**Quản lý email marketing**
- Quản lý mẫu email (Templates)
- Gửi email cho một/nhiều người
- Gửi email hàng loạt cho tất cả khách hàng
- Lịch sử gửi email (Email Logs)
- Thống kê email

### 8. [📊 DASHBOARD.md](./DASHBOARD.md)
**Dashboard & Thống kê**
- Thống kê tổng quan (users, products, orders, revenue)
- Biểu đồ doanh thu theo tháng
- Biểu đồ đơn hàng theo tháng
- Tính tăng trưởng

### 9. [📤 UPLOAD.md](./UPLOAD.md)
**Upload file**
- Upload ảnh sản phẩm
- Validate file type (chỉ ảnh)
- Giới hạn kích thước (5MB)
- Tạo tên file unique

### 10. [🛡️ SECURITY.md](./SECURITY.md)
**Bảo mật server**
- Helmet (HTTP headers protection)
- Rate Limiting (DDoS protection)
- CORS (Cross-origin protection)
- Body size limit
- API Key authentication

---

## 🚀 Quick Start

### 1. Cài đặt dependencies:
```bash
cd backend
npm install
```

### 2. Cấu hình `.env`:
```env
# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=root
DB_NAME=cosmetics_db

# JWT
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
SESSION_SECRET=your-super-secret-session-key-min-32-chars

# Server
PORT=8080
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Google OAuth
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-...
GOOGLE_CALLBACK_URL=http://localhost:8080/api/auth/google/callback

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM_NAME=Cosmetics Shop Support
EMAIL_FROM_ADDRESS=no-reply@cosmeticsshop.com

# OpenAI
OPENAI_API_KEY=sk-your-real-api-key-here

# SePay
SEPAY_API_KEY=your-sepay-api-key
```

### 3. Tạo database:
```bash
mysql -u root -p < cosmetics_db.sql
```

### 4. Chạy server:
```bash
# Development
npm run dev

# Production
npm start
```

### 5. Test API:
```bash
# Test rate limiting
npm run test:security
```

---

## 📡 API Endpoints

### Authentication (`/api/auth`)
```
POST   /register                    - Đăng ký
POST   /login                       - Đăng nhập
POST   /forgot-password             - Quên mật khẩu
POST   /reset-password/:token       - Đặt lại mật khẩu
GET    /google                      - Đăng nhập Google
GET    /google/callback             - Google callback
```

### Products (`/api/products`)
```
GET    /                            - Lấy tất cả sản phẩm
GET    /:id                         - Lấy chi tiết sản phẩm
POST   /                [Admin]     - Tạo sản phẩm
PUT    /:id             [Admin]     - Cập nhật sản phẩm
DELETE /:id             [Admin]     - Xóa sản phẩm
```

### Orders (`/api/orders`)
```
POST   /                [Auth]      - Tạo đơn hàng
POST   /:orderId/cancel [Auth]      - Hủy đơn hàng
GET    /:orderId        [Auth]      - Xem chi tiết đơn hàng
GET    /:orderId/status [Auth]      - Lấy trạng thái đơn hàng
PUT    /:orderId/status [Auth]      - Cập nhật trạng thái (User)

GET    /admin/all       [Admin]     - Lấy tất cả đơn hàng
GET    /admin/:orderId  [Admin]     - Xem chi tiết (Admin)
PUT    /admin/:orderId/status [Admin] - Cập nhật trạng thái (Admin)
DELETE /admin/:orderId  [Admin]     - Xóa đơn hàng

POST   /webhooks/sepay             - Webhook SePay
```

### Users (`/api/users`)
```
GET    /profile         [Auth]      - Xem profile
PUT    /profile         [Auth]      - Cập nhật profile
PUT    /change-password [Auth]      - Đổi mật khẩu
GET    /my-orders       [Auth]      - Lịch sử đơn hàng

GET    /admin/stats     [Admin]     - Thống kê users
GET    /admin/all       [Admin]     - Lấy tất cả users
POST   /admin/create    [Admin]     - Tạo user
PUT    /admin/:id       [Admin]     - Cập nhật user
PATCH  /admin/:id/block [Admin]     - Khóa/Mở khóa user
DELETE /admin/:id       [Admin]     - Xóa user
```

### Categories (`/api/categories`)
```
GET    /                            - Lấy tất cả danh mục
POST   /                [Admin]     - Tạo danh mục
PUT    /:id             [Admin]     - Cập nhật danh mục
DELETE /:id             [Admin]     - Xóa danh mục
```

### Chatbot (`/api/chatbot`)
```
POST   /chat                        - Gửi tin nhắn
GET    /history/:sessionId          - Lịch sử chat
```

### Email (`/api/email`)
```
GET    /templates       [Admin]     - Lấy tất cả templates
GET    /templates/:id   [Admin]     - Lấy template theo ID
POST   /templates       [Admin]     - Tạo template
PUT    /templates/:id   [Admin]     - Cập nhật template
DELETE /templates/:id   [Admin]     - Xóa template

POST   /send            [Admin]     - Gửi email
POST   /send-to-all-customers [Admin] - Gửi email hàng loạt

GET    /logs            [Admin]     - Lịch sử email
GET    /stats           [Admin]     - Thống kê email
```

### Dashboard (`/api/dashboard`)
```
GET    /stats           [Admin]     - Thống kê tổng quan
GET    /revenue-chart   [Admin]     - Biểu đồ doanh thu
GET    /order-chart     [Admin]     - Biểu đồ đơn hàng
```

### Upload (`/api/upload`)
```
POST   /image                       - Upload ảnh
```

---

## 🔐 Authentication

### JWT Token:
```javascript
{
  id: user.id,
  role: user.role,
  exp: 24h
}
```

### Header:
```
Authorization: Bearer {JWT_TOKEN}
```

### Middleware:
- `isAuthenticated`: Kiểm tra JWT token
- `isAdmin`: Kiểm tra role admin

---

## 🛡️ Security Features

### 1. Helmet
- HTTP headers protection
- XSS protection
- Clickjacking protection
- Content Security Policy

### 2. Rate Limiting
- General API: 100 requests / 15 phút
- Auth: 5 requests / 15 phút
- Orders: 10 requests / 1 giờ
- Email: 5 requests / 1 giờ
- Chatbot: 10 requests / 1 phút
- Upload: 20 requests / 1 giờ

### 3. CORS
- Allowed origins: localhost:5173, localhost:3000
- Credentials: true
- Methods: GET, POST, PUT, DELETE, OPTIONS

### 4. Body Size Limit
- Max: 10MB

### 5. Password Security
- Bcrypt hash (12 salt rounds)
- Auto hash on create/update

---

## 🔔 Realtime Features (Socket.IO)

### Events:
- `order:new` - Đơn hàng mới (Admin)
- `order:created` - Đơn hàng đã tạo (User)
- `order:statusChanged` - Trạng thái đổi (User)
- `order:payment_updated` - Thanh toán thành công (User)
- `order:cancelled` - Đơn hàng bị hủy (Admin)

### Rooms:
- `user:{userId}` - Room riêng cho user
- `role:admin` - Room cho admin
- `order:{orderId}` - Room cho đơn hàng

---

## 📊 Database Schema

### Tables:
1. `users` - Người dùng
2. `products` - Sản phẩm
3. `product_images` - Ảnh phụ sản phẩm
4. `categories` - Danh mục
5. `orders` - Đơn hàng
6. `order_items` - Chi tiết đơn hàng
7. `email_templates` - Mẫu email
8. `email_logs` - Lịch sử email

### Relationships:
```
User (1) -----> (N) Order
Product (1) -----> (N) OrderItem
Product (1) -----> (N) ProductImage
Category (1) -----> (N) Product
Order (1) -----> (N) OrderItem
```

---

## 🧪 Testing

### Test Rate Limiting:
```bash
npm run test:security
```

### Test với curl:
```bash
# Test login rate limit
for i in {1..10}; do
  curl http://localhost:8080/api/auth/login \
    -X POST \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","password":"123456"}'
  echo ""
done
```

---

## 📦 Dependencies

### Production:
```json
{
  "express": "^5.1.0",
  "sequelize": "^6.37.7",
  "mysql2": "^3.14.3",
  "bcryptjs": "^3.0.2",
  "jsonwebtoken": "^9.0.2",
  "passport": "^0.7.0",
  "passport-google-oauth20": "^2.0.0",
  "express-session": "^1.18.2",
  "helmet": "^8.1.0",
  "express-rate-limit": "^8.2.1",
  "cors": "^2.8.5",
  "socket.io": "^4.8.3",
  "openai": "^5.20.2",
  "nodemailer": "^7.0.10",
  "multer": "^2.0.2",
  "dotenv": "^17.2.1",
  "axios": "^1.12.2"
}
```

### Development:
```json
{
  "nodemon": "^3.1.10"
}
```

---

## 🚀 Deployment

### Checklist:
- [ ] Đổi `SESSION_SECRET` thành giá trị ngẫu nhiên mạnh
- [ ] Đổi `JWT_SECRET` thành giá trị ngẫu nhiên mạnh
- [ ] Set `NODE_ENV=production`
- [ ] Enable HTTPS
- [ ] Cập nhật `allowedOrigins` với domain thật
- [ ] Cập nhật `FRONTEND_URL` với domain thật
- [ ] Backup database thường xuyên
- [ ] Setup monitoring (PM2, New Relic, etc.)
- [ ] Setup firewall rules
- [ ] Enable database encryption

### Environment Variables Production:
```env
NODE_ENV=production
PORT=8080
DB_HOST=your-production-db-host
DB_USER=your-production-db-user
DB_PASSWORD=your-strong-password
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
SESSION_SECRET=your-super-secret-session-key-min-32-chars
FRONTEND_URL=https://your-domain.com
```

---

## 📞 Support

### Liên hệ:
- Email: support@cosmeticsshop.com
- Hotline: 1900-xxxx

### Tài liệu tham khảo:
- Express.js: https://expressjs.com/
- Sequelize: https://sequelize.org/
- Socket.IO: https://socket.io/
- OpenAI: https://platform.openai.com/docs
- Nodemailer: https://nodemailer.com/

---

## ✅ Summary

### Tổng số endpoints: **50+**
### Tổng số tables: **8**
### Tổng số models: **8**
### Tổng số controllers: **9**
### Tổng số routes: **10**

### Các tính năng chính:
1. ✅ Authentication (Email + Google OAuth)
2. ✅ Product Management
3. ✅ Order Management
4. ✅ User Management
5. ✅ Category Management
6. ✅ AI Chatbot (OpenAI GPT-3.5)
7. ✅ Email Marketing
8. ✅ Dashboard & Analytics
9. ✅ File Upload
10. ✅ Realtime Notifications (Socket.IO)
11. ✅ Payment Webhook (SePay)
12. ✅ Security (Helmet, Rate Limiting, CORS)

---

**Date**: February 9, 2026  
**Version**: 1.0.0  
**Status**: ✅ Production Ready  
**Author**: Backend Team  
**License**: MIT
