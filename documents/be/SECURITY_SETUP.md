# 🛡️ HƯỚNG DẪN CÀI ĐẶT BẢO MẬT

## ✅ ĐÃ CÀI ĐẶT XONG

### 1. Thư viện đã cài:
```bash
npm install express-rate-limit helmet
```

### 2. Files đã tạo:
- ✅ `backend/middleware/security.middleware.js` - Rate limiting middleware
- ✅ `backend/server.js` - Đã cập nhật với Helmet và Rate Limiting
- ✅ `backend/SECURITY.md` - Tài liệu chi tiết về bảo mật
- ✅ `backend/SECURITY_SETUP.md` - File này

---

## 🚀 CÁCH CHẠY

### Khởi động server:
```bash
cd backend
npm run dev
```

### Kết quả mong đợi:
```
🚀 Server is running on port 8080
🔌 WebSocket is ready on port 8080
🛡️ Security features enabled:
   ✅ Helmet - HTTP headers protection
   ✅ Rate Limiting - DDoS protection
   ✅ CORS - Cross-origin protection
   ✅ Body size limit - 10MB max
```

---

## 🧪 KIỂM TRA BẢO MẬT

### 1. Kiểm tra Helmet Headers:
```bash
curl -I http://localhost:8080/
```

Kết quả sẽ có các headers bảo mật:
```
X-DNS-Prefetch-Control: off
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
X-XSS-Protection: 0
```

### 2. Kiểm tra Rate Limiting (Auth):
Gửi 6 requests liên tiếp để test giới hạn 5 requests/15 phút:

```bash
# Windows PowerShell
for ($i=1; $i -le 6; $i++) {
    curl http://localhost:8080/api/auth/login `
        -Method POST `
        -Headers @{"Content-Type"="application/json"} `
        -Body '{"email":"test@test.com","password":"123456"}'
    Write-Host "Request $i completed"
}
```

Request thứ 6 sẽ trả về:
```json
{
    "error": "Quá nhiều lần thử đăng nhập",
    "message": "Tài khoản tạm thời bị khóa. Vui lòng thử lại sau 15 phút.",
    "retryAfter": "15 minutes"
}
```

### 3. Kiểm tra X-Powered-By đã bị ẩn:
```bash
curl -I http://localhost:8080/
```

**KHÔNG** được thấy header: `X-Powered-By: Express`

---

## 📊 RATE LIMITS CHI TIẾT

| Route | Giới hạn | Thời gian | Mục đích |
|-------|----------|-----------|----------|
| `/api/*` | 100 requests | 15 phút | Bảo vệ chung |
| `/api/auth/*` | 5 requests | 15 phút | Chống brute force |
| `/api/orders/*` | 10 requests | 1 giờ | Chống spam đơn hàng |
| `/api/email/*` | 5 requests | 1 giờ | Chống spam email |
| `/api/chatbot/*` | 10 requests | 1 phút | Chống spam chatbot |
| `/api/upload/*` | 20 requests | 1 giờ | Chống spam upload |

---

## 🔒 THÔNG TIN NHẠY CẢM ĐÃ ẨN

### 1. HTTP Headers:
- ✅ `X-Powered-By` đã bị ẩn
- ✅ Server version đã bị ẩn

### 2. Environment Variables:
- ✅ `.env` file KHÔNG được commit lên Git
- ✅ API keys được lưu trong `.env`
- ✅ Database credentials được lưu trong `.env`

### 3. Error Messages:
- ✅ Stack trace KHÔNG được trả về cho client
- ✅ Database errors được xử lý an toàn

---

## ⚠️ LƯU Ý QUAN TRỌNG

### 1. File .env:
```env
# KHÔNG BAO GIỜ commit file này lên Git!
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=root
DB_NAME=cosmetics_db
JWT_SECRET=sieu_bi_mat_khong_the_doan_ra
OPENAI_API_KEY=sk-your-real-api-key-here
GOOGLE_CLIENT_SECRET=GOCSPX-...
EMAIL_PASSWORD=lika vqel vino szix
```

### 2. Production:
Khi deploy lên production, nhớ:
- [ ] Đổi tất cả secrets thành giá trị mạnh hơn
- [ ] Set `NODE_ENV=production`
- [ ] Enable HTTPS
- [ ] Cập nhật CORS origins
- [ ] Setup monitoring

---

## 📚 TÀI LIỆU

Chi tiết đầy đủ xem tại: `backend/SECURITY.md`

---

## ✅ CHECKLIST

- [x] Cài đặt `helmet`
- [x] Cài đặt `express-rate-limit`
- [x] Tạo security middleware
- [x] Cập nhật server.js
- [x] Ẩn X-Powered-By header
- [x] Giới hạn body size (10MB)
- [x] Rate limiting cho Auth (5/15min)
- [x] Rate limiting cho Orders (10/1h)
- [x] Rate limiting cho Email (5/1h)
- [x] Rate limiting cho Chatbot (10/1min)
- [x] Rate limiting cho Upload (20/1h)
- [x] Rate limiting chung (100/15min)
- [x] CORS configuration
- [x] .env file excluded from Git
- [x] Documentation created

---

**Status**: ✅ HOÀN THÀNH
**Date**: February 9, 2026
