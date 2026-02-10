# 🔐 XÁC THỰC & ĐĂNG NHẬP - AUTHENTICATION DOCUMENTATION

## 📋 Tổng Quan

Hệ thống hỗ trợ 2 phương thức xác thực:
1. **Đăng ký/Đăng nhập thông thường** (Email + Password)
2. **Google OAuth 2.0** (Đăng nhập bằng tài khoản Google)

---

## 🔑 1. ĐĂNG KÝ TÀI KHOẢN - REGISTER

### Endpoint:
```
POST /api/auth/register
```

### Request Body:
```json
{
  "fullName": "Nguyễn Văn A",
  "email": "user@example.com",
  "password": "matkhau123"
}
```

### Response Success (201):
```json
{
  "message": "Đăng ký tài khoản thành công!"
}
```

### Xử lý:
1. Kiểm tra email đã tồn tại chưa (unique constraint)
2. Hash password bằng bcrypt (12 salt rounds)
3. Tạo user mới với role mặc định là `customer`
4. Lưu vào database

### Bảo mật:
- ✅ Password được hash tự động qua `beforeCreate` hook
- ✅ Email phải unique
- ✅ Rate limit: 5 requests / 15 phút

---

## 🔓 2. ĐĂNG NHẬP - LOGIN

### Endpoint:
```
POST /api/auth/login
```

### Request Body:
```json
{
  "email": "user@example.com",
  "password": "matkhau123"
}
```

### Response Success (200):
```json
{
  "id": 1,
  "fullName": "Nguyễn Văn A",
  "email": "user@example.com",
  "role": "customer",
  "avatar": "https://...",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Response Error:
```json
// Email không tồn tại (404)
{ "message": "Email không tồn tại." }

// Sai mật khẩu (401)
{ "message": "Sai mật khẩu." }

// Tài khoản bị khóa (403)
{ "message": "Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên." }

// Tài khoản Google (400)
{ "message": "Tài khoản này được đăng ký bằng Google. Vui lòng đăng nhập bằng Google." }
```

### Xử lý:
1. Tìm user theo email
2. Kiểm tra tài khoản có bị khóa không (`isBlocked`)
3. Kiểm tra user có password không (phân biệt Google login)
4. So sánh password bằng bcrypt
5. Tạo JWT token (expires: 24h)
6. Trả về thông tin user + token

### JWT Token:
```javascript
{
  id: user.id,
  role: user.role,
  exp: 24h
}
```

### Bảo mật:
- ✅ Password được hash và so sánh an toàn
- ✅ Kiểm tra tài khoản bị khóa
- ✅ JWT có thời gian hết hạn
- ✅ Rate limit: 5 requests / 15 phút
- ✅ Không đếm request thành công

---

## 🔵 3. GOOGLE OAUTH 2.0

### A. Khởi tạo đăng nhập Google

#### Endpoint:
```
GET /api/auth/google
```

### Xử lý:
- Redirect đến Google OAuth consent screen
- Scope: `profile`, `email`
- Access type: `offline`
- Prompt: `consent`

### B. Google Callback

#### Endpoint:
```
GET /api/auth/google/callback
```

### Xử lý:
1. Google trả về user profile
2. Tìm hoặc tạo user trong database:
   - Nếu `googleId` đã tồn tại → Đăng nhập
   - Nếu chưa → Tạo user mới với:
     - `googleId`: ID từ Google
     - `email`: Email từ Google
     - `fullName`: Tên từ Google
     - `avatar`: Ảnh đại diện từ Google
     - `password`: `null` (không cần password)
     - `role`: `customer`
3. Kiểm tra tài khoản có bị khóa không
4. Tạo JWT token
5. Redirect về frontend với token

### Redirect URL:
```
http://localhost:5173/auth/google/callback?token=JWT_TOKEN&userId=1&name=Nguyen+Van+A&email=user@gmail.com&role=customer&avatar=https://...
```

### C. Google Failure

#### Endpoint:
```
GET /api/auth/google/failure
```

### Xử lý:
- Redirect về login page với error parameter
- URL: `http://localhost:5173/login?error=google_auth_failed`

### Cấu hình Google OAuth:
```env
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-...
GOOGLE_CALLBACK_URL=http://localhost:8080/api/auth/google/callback
```

### Bảo mật:
- ✅ Sử dụng Passport.js strategy
- ✅ Kiểm tra tài khoản bị khóa
- ✅ Session được bật để lưu user
- ✅ CORS cho phép Google domain

---

## 🔄 4. QUÊN MẬT KHẨU - FORGOT PASSWORD

### Endpoint:
```
POST /api/auth/forgot-password
```

### Request Body:
```json
{
  "email": "user@example.com"
}
```

### Response Success (200):
```json
{
  "message": "Email hướng dẫn đặt lại mật khẩu đã được gửi."
}
```

### Xử lý:
1. Tìm user theo email
2. Kiểm tra user có phải Google account không
3. Tạo random token (20 bytes hex)
4. Lưu token vào database:
   - `resetPasswordToken`: token
   - `resetPasswordExpires`: Date.now() + 1 giờ
5. Gửi email với link reset password

### Email Template:
```html
<h3>Xin chào {fullName},</h3>
<p>Bạn nhận được email này vì đã yêu cầu đặt lại mật khẩu.</p>
<a href="http://localhost:5173/reset-password/{token}">Đặt lại mật khẩu</a>
<p>Link có hiệu lực trong 1 giờ.</p>
```

### Bảo mật:
- ✅ Token ngẫu nhiên 20 bytes
- ✅ Token hết hạn sau 1 giờ
- ✅ Không cho phép reset password cho Google account
- ✅ Rate limit: 5 requests / 1 giờ

---

## 🔐 5. ĐẶT LẠI MẬT KHẨU - RESET PASSWORD

### Endpoint:
```
POST /api/auth/reset-password/:token
```

### Request Body:
```json
{
  "password": "matkhaumoi123"
}
```

### Response Success (200):
```json
{
  "message": "Đổi mật khẩu thành công! Vui lòng đăng nhập lại."
}
```

### Response Error (400):
```json
{
  "message": "Token không hợp lệ hoặc đã hết hạn."
}
```

### Xử lý:
1. Tìm user có `resetPasswordToken` khớp
2. Kiểm tra `resetPasswordExpires > Date.now()`
3. Cập nhật password mới (tự động hash qua `beforeUpdate` hook)
4. Xóa token:
   - `resetPasswordToken`: null
   - `resetPasswordExpires`: null
5. Lưu vào database

### Bảo mật:
- ✅ Token chỉ dùng được 1 lần
- ✅ Token hết hạn sau 1 giờ
- ✅ Password mới được hash tự động
- ✅ Token bị xóa sau khi dùng

---

## 🛡️ 6. MIDDLEWARE XÁC THỰC

### A. isAuthenticated

#### Chức năng:
- Kiểm tra JWT token trong header
- Giải mã token và lấy user info
- Gắn `userId` và `userRole` vào request

#### Sử dụng:
```javascript
router.get('/profile', isAuthenticated, controller.getProfile);
```

#### Response Error:
```json
// Không có token (401)
{
  "message": "Vui lòng đăng nhập để truy cập.",
  "code": "NO_TOKEN"
}

// Token hết hạn (401)
{
  "message": "Phiên đăng nhập đã hết hạn.",
  "code": "TOKEN_EXPIRED"
}

// Token không hợp lệ (401)
{
  "message": "Token không hợp lệ.",
  "code": "INVALID_TOKEN"
}
```

### B. isAdmin

#### Chức năng:
- Kiểm tra user có role `admin` không
- Phải dùng sau `isAuthenticated`

#### Sử dụng:
```javascript
router.post('/products', [isAuthenticated, isAdmin], controller.createProduct);
```

#### Response Error (403):
```json
{
  "message": "Yêu cầu quyền Admin!"
}
```

---

## 📊 7. PASSPORT.JS CONFIGURATION

### File: `config/passport.js`

### Google Strategy:
```javascript
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
  },
  async (accessToken, refreshToken, profile, done) => {
    // Tìm hoặc tạo user
    const [user, created] = await User.findOrCreate({
      where: { googleId: profile.id },
      defaults: {
        email: profile.emails[0].value,
        fullName: profile.displayName,
        avatar: profile.photos[0].value,
        role: 'customer'
      }
    });
    return done(null, user);
  }
));
```

### Serialize/Deserialize:
```javascript
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findByPk(id);
  done(null, user);
});
```

---

## 🔒 8. BẢO MẬT PASSWORD

### Hash Algorithm:
- **Bcrypt** với 12 salt rounds
- Hash tự động qua Sequelize hooks

### Hooks:
```javascript
// Khi tạo user mới
User.beforeCreate(async (user) => {
  if (user.password) {
    user.password = await bcrypt.hash(user.password, 12);
  }
});

// Khi cập nhật password
User.beforeUpdate(async (user) => {
  if (user.changed('password') && user.password) {
    user.password = await bcrypt.hash(user.password, 12);
  }
});
```

### So sánh password:
```javascript
const isPasswordValid = await bcrypt.compare(password, user.password);
```

---

## 📧 9. EMAIL CONFIGURATION

### Nodemailer Setup:
```javascript
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT) || 587,
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});
```

### Environment Variables:
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM_NAME=Cosmetics Shop Support
EMAIL_FROM_ADDRESS=no-reply@cosmeticsshop.com
```

---

## ✅ SUMMARY

### Các tính năng đã triển khai:
1. ✅ Đăng ký tài khoản (Email + Password)
2. ✅ Đăng nhập thông thường
3. ✅ Đăng nhập bằng Google OAuth 2.0
4. ✅ Quên mật khẩu (gửi email)
5. ✅ Đặt lại mật khẩu (reset token)
6. ✅ JWT authentication
7. ✅ Role-based authorization (customer/admin)
8. ✅ Kiểm tra tài khoản bị khóa

### Bảo mật:
- ✅ Password hash với bcrypt (12 rounds)
- ✅ JWT token expires sau 24h
- ✅ Rate limiting cho auth endpoints
- ✅ Reset token hết hạn sau 1 giờ
- ✅ Kiểm tra tài khoản bị khóa
- ✅ CORS protection
- ✅ Session security

### Rate Limits:
- Auth endpoints: 5 requests / 15 phút
- Email endpoints: 5 requests / 1 giờ
- Không đếm request thành công

---

**Date**: February 9, 2026  
**Version**: 1.0.0  
**Status**: ✅ Production Ready
