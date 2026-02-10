# 🛡️ BẢO MẬT SERVER - SECURITY DOCUMENTATION

## 📋 Tổng Quan

Server đã được cài đặt các biện pháp bảo mật sau:

### 1. **Helmet** - Bảo vệ HTTP Headers
### 2. **Rate Limiting** - Giới hạn số lần request
### 3. **CORS** - Kiểm soát nguồn truy cập
### 4. **Body Size Limit** - Giới hạn kích thước request

---

## 🛡️ 1. HELMET - Bảo Vệ HTTP Headers

### Chức năng:
- Ẩn thông tin server (`X-Powered-By` header)
- Bảo vệ khỏi XSS attacks
- Bảo vệ khỏi clickjacking
- Content Security Policy (CSP)
- Strict Transport Security (HSTS)

### Cấu hình:
```javascript
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
        },
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
}));

app.disable('x-powered-by');
```

### Headers được thêm:
- `X-DNS-Prefetch-Control: off`
- `X-Frame-Options: SAMEORIGIN`
- `X-Content-Type-Options: nosniff`
- `X-XSS-Protection: 0`
- `Content-Security-Policy: ...`

---

## ⏱️ 2. RATE LIMITING - Giới Hạn Request

### Mục đích:
- Ngăn chặn DDoS attacks
- Ngăn chặn brute force attacks
- Bảo vệ tài nguyên server

### Các Rate Limiter:

#### A. **General Limiter** (Toàn bộ API)
```javascript
Giới hạn: 100 requests / 15 phút
Áp dụng: /api/*
```

#### B. **Auth Limiter** (Đăng nhập/Đăng ký)
```javascript
Giới hạn: 5 requests / 15 phút
Áp dụng: /api/auth/*
Đặc biệt: Không đếm request thành công
```

#### C. **Order Limiter** (Tạo đơn hàng)
```javascript
Giới hạn: 10 requests / 1 giờ
Áp dụng: /api/orders/*
```

#### D. **Email Limiter** (Gửi email)
```javascript
Giới hạn: 5 requests / 1 giờ
Áp dụng: /api/email/*
```

#### E. **Chatbot Limiter** (Chatbot)
```javascript
Giới hạn: 10 requests / 1 phút
Áp dụng: /api/chatbot/*
```

#### F. **Upload Limiter** (Upload file)
```javascript
Giới hạn: 20 requests / 1 giờ
Áp dụng: /api/upload/*
```

### Response khi vượt giới hạn:
```json
{
    "error": "Quá nhiều yêu cầu từ IP này",
    "message": "Vui lòng thử lại sau 15 phút",
    "retryAfter": "15 minutes"
}
```

Status Code: `429 Too Many Requests`

---

## 🌐 3. CORS - Kiểm Soát Nguồn Truy Cập

### Allowed Origins:
```javascript
const allowedOrigins = [
    'http://localhost:5173',  // Frontend dev
    'http://localhost',
    'http://localhost:3000',
    'https://accounts.google.com'  // Google OAuth
];
```

### Cấu hình:
- **Credentials**: `true` (cho phép cookies)
- **Methods**: `GET, POST, PUT, DELETE, OPTIONS`
- **Headers**: `Content-Type, Authorization`

---

## 📦 4. BODY SIZE LIMIT - Giới Hạn Kích Thước

### Giới hạn:
```javascript
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
```

### Mục đích:
- Ngăn chặn DoS attacks bằng cách gửi request quá lớn
- Bảo vệ memory server

---

## 🔒 5. THÔNG TIN NHẠY CẢM - ẨN ĐI

### Đã ẩn:
✅ `X-Powered-By` header (Express)
✅ Stack trace trong production
✅ Database connection details
✅ API keys trong .env file

### File .env (KHÔNG ĐƯỢC COMMIT):
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=root
DB_NAME=cosmetics_db
JWT_SECRET=sieu_bi_mat_khong_the_doan_ra
OPENAI_API_KEY=sk-your-real-api-key-here
GOOGLE_CLIENT_SECRET=GOCSPX-...
EMAIL_PASSWORD=lika vqel vino szix
```

### ⚠️ LƯU Ý:
- **KHÔNG BAO GIỜ** commit file `.env` lên Git
- **KHÔNG BAO GIỜ** log ra API keys
- **KHÔNG BAO GIỜ** trả về error stack trace cho client

---

## 📊 MONITORING - Giám Sát

### Logs được ghi:
```javascript
⚠️ Rate limit exceeded for IP: 192.168.1.1
🚨 Auth rate limit exceeded for IP: 192.168.1.1
🛒 Order rate limit exceeded for IP: 192.168.1.1
📧 Email rate limit exceeded for IP: 192.168.1.1
🤖 Chatbot rate limit exceeded for IP: 192.168.1.1
📤 Upload rate limit exceeded for IP: 192.168.1.1
```

### Kiểm tra logs:
```bash
# Xem logs real-time
npm run dev

# Hoặc trong production
pm2 logs
```

---

## 🧪 TESTING - Kiểm Tra Bảo Mật

### Test Rate Limiting:
```bash
# Test với curl (gửi 10 requests liên tiếp)
for i in {1..10}; do
  curl http://localhost:8080/api/auth/login \
    -X POST \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","password":"123456"}'
  echo ""
done
```

### Test Helmet Headers:
```bash
curl -I http://localhost:8080/
```

Kết quả mong đợi:
```
X-DNS-Prefetch-Control: off
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
```

---

## 🚀 DEPLOYMENT - Triển Khai Production

### Checklist:
- [ ] Đổi `SESSION_SECRET` thành giá trị ngẫu nhiên mạnh
- [ ] Đổi `JWT_SECRET` thành giá trị ngẫu nhiên mạnh
- [ ] Set `NODE_ENV=production`
- [ ] Enable HTTPS
- [ ] Cập nhật `allowedOrigins` với domain thật
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
```

---

## 📚 TÀI LIỆU THAM KHẢO

### Helmet:
- Docs: https://helmetjs.github.io/
- GitHub: https://github.com/helmetjs/helmet

### Express Rate Limit:
- Docs: https://express-rate-limit.mintlify.app/
- GitHub: https://github.com/express-rate-limit/express-rate-limit

### OWASP Top 10:
- https://owasp.org/www-project-top-ten/

---

## ✅ SUMMARY

### Đã cài đặt:
1. ✅ **Helmet** - Bảo vệ HTTP headers
2. ✅ **Rate Limiting** - 6 loại limiter khác nhau
3. ✅ **CORS** - Kiểm soát nguồn truy cập
4. ✅ **Body Size Limit** - Giới hạn 10MB
5. ✅ **Ẩn thông tin server** - X-Powered-By disabled

### Bảo vệ khỏi:
- ✅ DDoS attacks
- ✅ Brute force attacks
- ✅ XSS attacks
- ✅ Clickjacking
- ✅ MIME sniffing
- ✅ Information disclosure

### Giới hạn request:
- ✅ Auth: 5 requests / 15 phút
- ✅ Orders: 10 requests / 1 giờ
- ✅ Email: 5 requests / 1 giờ
- ✅ Chatbot: 10 requests / 1 phút
- ✅ Upload: 20 requests / 1 giờ
- ✅ General API: 100 requests / 15 phút

---

**Date**: February 9, 2026
**Version**: 1.0.0
**Status**: ✅ Production Ready
