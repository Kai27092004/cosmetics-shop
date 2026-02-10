# 📧 QUẢN LÝ EMAIL - EMAIL DOCUMENTATION

## 📋 Tổng Quan

Hệ thống quản lý email marketing bao gồm:
- Quản lý mẫu email (Templates)
- Gửi email cho một hoặc nhiều người
- Gửi email hàng loạt cho tất cả khách hàng
- Lịch sử gửi email (Email Logs)
- Thống kê email

**Lưu ý**: Tất cả endpoints yêu cầu quyền **Admin**.

---

## 📝 1. QUẢN LÝ MẪU EMAIL - EMAIL TEMPLATES

### A. Lấy tất cả mẫu email

#### Endpoint:
```
GET /api/email/templates
```

#### Authentication:
```
Authorization: Bearer {JWT_TOKEN}
Role: admin
```

#### Response Success (200):
```json
[
  {
    "id": 1,
    "name": "Chào mừng khách hàng mới",
    "subject": "Chào mừng bạn đến với Cosmetics Shop",
    "content": "<h1>Xin chào {{customerName}}</h1><p>Cảm ơn bạn đã đăng ký...</p>",
    "description": "Email gửi cho khách hàng mới đăng ký",
    "createdAt": "2025-01-10T10:00:00.000Z",
    "updatedAt": "2025-01-10T10:00:00.000Z"
  },
  {
    "id": 2,
    "name": "Khuyến mãi tháng 2",
    "subject": "🎉 Giảm giá 20% tất cả sản phẩm",
    "content": "<h1>Khuyến mãi đặc biệt</h1><p>Giảm giá 20% cho tất cả sản phẩm...</p>",
    "description": "Email khuyến mãi",
    "createdAt": "2025-02-01T10:00:00.000Z",
    "updatedAt": "2025-02-01T10:00:00.000Z"
  }
]
```

### B. Lấy một mẫu email theo ID

#### Endpoint:
```
GET /api/email/templates/:id
```

#### Response Success (200):
```json
{
  "id": 1,
  "name": "Chào mừng khách hàng mới",
  "subject": "Chào mừng bạn đến với Cosmetics Shop",
  "content": "<h1>Xin chào {{customerName}}</h1><p>Email: {{email}}</p>",
  "description": "Email gửi cho khách hàng mới đăng ký",
  "createdAt": "2025-01-10T10:00:00.000Z",
  "updatedAt": "2025-01-10T10:00:00.000Z"
}
```

#### Response Error (404):
```json
{
  "message": "Không tìm thấy mẫu email"
}
```

### C. Tạo mẫu email mới

#### Endpoint:
```
POST /api/email/templates
```

#### Request Body:
```json
{
  "name": "Thông báo đơn hàng",
  "subject": "Đơn hàng #{{orderId}} đã được xác nhận",
  "content": "<h1>Xin chào {{customerName}}</h1><p>Đơn hàng của bạn đã được xác nhận...</p>",
  "description": "Email thông báo đơn hàng"
}
```

#### Response Success (201):
```json
{
  "message": "Tạo mẫu email thành công",
  "template": {
    "id": 3,
    "name": "Thông báo đơn hàng",
    "subject": "Đơn hàng #{{orderId}} đã được xác nhận",
    "content": "<h1>Xin chào {{customerName}}</h1>...",
    "description": "Email thông báo đơn hàng",
    "createdAt": "2025-02-09T10:00:00.000Z",
    "updatedAt": "2025-02-09T10:00:00.000Z"
  }
}
```

#### Response Error:
```json
// Thiếu thông tin (400)
{
  "message": "Vui lòng điền đầy đủ thông tin (tên, tiêu đề, nội dung)"
}

// Tên trùng (400)
{
  "message": "Tên mẫu email đã tồn tại"
}
```

### D. Cập nhật mẫu email

#### Endpoint:
```
PUT /api/email/templates/:id
```

#### Request Body:
```json
{
  "name": "Thông báo đơn hàng (Updated)",
  "subject": "Đơn hàng #{{orderId}} - Cập nhật trạng thái",
  "content": "<h1>Cập nhật đơn hàng</h1>...",
  "description": "Email thông báo cập nhật đơn hàng"
}
```

#### Response Success (200):
```json
{
  "message": "Cập nhật mẫu email thành công",
  "template": { ... }
}
```

### E. Xóa mẫu email

#### Endpoint:
```
DELETE /api/email/templates/:id
```

#### Response Success (200):
```json
{
  "message": "Xóa mẫu email thành công"
}
```

---

## 📤 2. GỬI EMAIL

### A. Gửi email cho một hoặc nhiều người

#### Endpoint:
```
POST /api/email/send
```

#### Authentication:
```
Authorization: Bearer {JWT_TOKEN}
Role: admin
```

#### Request Body (Không dùng template):
```json
{
  "recipients": [
    {
      "email": "user1@example.com",
      "name": "Nguyễn Văn A"
    },
    {
      "userId": 5
    }
  ],
  "subject": "Thông báo khuyến mãi",
  "content": "<h1>Giảm giá 20%</h1><p>Áp dụng cho tất cả sản phẩm...</p>"
}
```

#### Request Body (Dùng template):
```json
{
  "recipients": [
    {
      "email": "user1@example.com",
      "name": "Nguyễn Văn A"
    }
  ],
  "templateId": 1
}
```

#### Response Success (200):
```json
{
  "message": "Đã gửi 2 email thành công, 0 email thất bại",
  "results": {
    "success": 2,
    "failed": 0,
    "errors": []
  }
}
```

#### Response Error:
```json
// Không có người nhận (400)
{
  "message": "Vui lòng chọn người nhận"
}

// Template không tồn tại (404)
{
  "message": "Không tìm thấy mẫu email"
}

// Thiếu tiêu đề/nội dung (400)
{
  "message": "Vui lòng nhập tiêu đề và nội dung email"
}
```

#### Xử lý:
1. Validate dữ liệu đầu vào
2. Nếu có `templateId`, lấy template từ DB
3. Với mỗi recipient:
   - Lấy thông tin user (nếu có `userId`)
   - Thay thế biến trong template
   - Gửi email qua Nodemailer
   - Ghi log vào database
4. Trả về kết quả (success/failed)

### B. Gửi email cho tất cả khách hàng

#### Endpoint:
```
POST /api/email/send-to-all-customers
```

#### Authentication:
```
Authorization: Bearer {JWT_TOKEN}
Role: admin
```

#### Request Body:
```json
{
  "subject": "Thông báo khuyến mãi tháng 2",
  "content": "<h1>Giảm giá 20%</h1><p>Áp dụng cho tất cả sản phẩm...</p>",
  "templateId": 2
}
```

#### Response Success (200):
```json
{
  "message": "Đã gửi 150 email thành công, 3 email thất bại",
  "results": {
    "success": 150,
    "failed": 3,
    "errors": [
      {
        "email": "invalid@example.com",
        "error": "Invalid email address"
      }
    ]
  }
}
```

#### Xử lý:
1. Lấy tất cả user có `role = 'customer'`
2. Chuyển đổi thành format `recipients`
3. Gọi hàm `sendEmail` với danh sách recipients

---

## 🔄 3. THAY THẾ BIẾN TRONG TEMPLATE

### Biến hỗ trợ:
```javascript
const variables = {
  customerName: 'Nguyễn Văn A',
  email: 'user@example.com',
  orderId: '123',
  totalAmount: '10,500,000 VND',
  // ... thêm biến tùy chỉnh
};
```

### Hàm thay thế:
```javascript
const replaceTemplateVariables = (content, variables) => {
  let result = content;
  Object.keys(variables).forEach(key => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    result = result.replace(regex, variables[key] || '');
  });
  return result;
};
```

### Ví dụ:
```html
<!-- Template -->
<h1>Xin chào {{customerName}}</h1>
<p>Email: {{email}}</p>
<p>Đơn hàng #{{orderId}} của bạn đã được xác nhận.</p>

<!-- Sau khi thay thế -->
<h1>Xin chào Nguyễn Văn A</h1>
<p>Email: user@example.com</p>
<p>Đơn hàng #123 của bạn đã được xác nhận.</p>
```

---

## 📜 4. LỊCH SỬ EMAIL - EMAIL LOGS

### A. Lấy lịch sử gửi email

#### Endpoint:
```
GET /api/email/logs
```

#### Query Parameters:
```
?status=sent           // Lọc theo trạng thái (sent/failed)
&limit=50              // Số lượng records
&offset=0              // Offset cho pagination
```

#### Authentication:
```
Authorization: Bearer {JWT_TOKEN}
Role: admin
```

#### Response Success (200):
```json
{
  "logs": [
    {
      "id": 1,
      "userId": 5,
      "recipientEmail": "user@example.com",
      "recipientName": "Nguyễn Văn A",
      "subject": "Chào mừng bạn đến với Cosmetics Shop",
      "content": "<h1>Xin chào Nguyễn Văn A</h1>...",
      "status": "sent",
      "errorMessage": null,
      "sentBy": 1,
      "sentAt": "2025-02-09T10:00:00.000Z",
      "recipient": {
        "id": 5,
        "fullName": "Nguyễn Văn A",
        "email": "user@example.com"
      },
      "sender": {
        "id": 1,
        "fullName": "Admin",
        "email": "admin@example.com"
      }
    }
  ],
  "total": 150,
  "limit": 50,
  "offset": 0
}
```

### B. Lấy thống kê email

#### Endpoint:
```
GET /api/email/stats
```

#### Authentication:
```
Authorization: Bearer {JWT_TOKEN}
Role: admin
```

#### Response Success (200):
```json
{
  "totalSent": 150,
  "totalFailed": 3,
  "totalTemplates": 5,
  "recentLogs": [
    {
      "id": 1,
      "recipientEmail": "user@example.com",
      "subject": "Chào mừng...",
      "status": "sent",
      "sentAt": "2025-02-09T10:00:00.000Z",
      "sender": {
        "id": 1,
        "fullName": "Admin"
      }
    }
  ]
}
```

---

## ⚙️ 5. CẤU HÌNH NODEMAILER

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

### Tạo Transporter:
```javascript
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT),
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
};
```

### Gửi email:
```javascript
await transporter.sendMail({
  from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM_ADDRESS}>`,
  to: recipientEmail,
  subject: emailSubject,
  html: finalContent
});
```

---

## 📊 6. DATABASE SCHEMA

### Bảng `email_templates`:
```sql
CREATE TABLE email_templates (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL UNIQUE,
  subject VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  description TEXT,
  createdAt DATETIME,
  updatedAt DATETIME
);
```

### Bảng `email_logs`:
```sql
CREATE TABLE email_logs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userId INT,
  recipientEmail VARCHAR(255) NOT NULL,
  recipientName VARCHAR(255),
  subject VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  status ENUM('sent', 'failed') NOT NULL,
  errorMessage TEXT,
  sentBy INT NOT NULL,
  sentAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id),
  FOREIGN KEY (sentBy) REFERENCES users(id)
);
```

### Indexes:
```sql
CREATE INDEX idx_email_logs_status ON email_logs(status);
CREATE INDEX idx_email_logs_sent_at ON email_logs(sentAt);
CREATE INDEX idx_email_logs_user ON email_logs(userId);
```

---

## 🔗 7. RELATIONSHIPS

### EmailLog → User (Many-to-One):
```javascript
EmailLog.belongsTo(models.User, {
  foreignKey: 'userId',
  as: 'recipient'
});

EmailLog.belongsTo(models.User, {
  foreignKey: 'sentBy',
  as: 'sender'
});
```

---

## 🔐 8. BẢO MẬT

### Gmail App Password:
1. Bật 2-Step Verification
2. Tạo App Password tại: https://myaccount.google.com/apppasswords
3. Sử dụng App Password thay vì password thật

### Rate Limiting:
- ✅ Email endpoints: 5 requests / 1 giờ
- ✅ Ngăn chặn spam

### Authorization:
- ✅ Tất cả endpoints yêu cầu quyền admin
- ✅ Không cho phép user thường gửi email

---

## 📧 9. VÍ DỤ MẪU EMAIL

### A. Email chào mừng:
```html
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #db2777; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; }
    .button { background-color: #db2777; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Chào mừng đến với Cosmetics Shop</h1>
    </div>
    <div class="content">
      <h2>Xin chào {{customerName}},</h2>
      <p>Cảm ơn bạn đã đăng ký tài khoản tại Cosmetics Shop!</p>
      <p>Email của bạn: {{email}}</p>
      <p>Chúng tôi rất vui được phục vụ bạn.</p>
      <a href="https://example.com/products" class="button">Xem sản phẩm</a>
    </div>
  </div>
</body>
</html>
```

### B. Email khuyến mãi:
```html
<div style="max-width: 600px; margin: 0 auto;">
  <h1 style="color: #db2777;">🎉 Khuyến mãi đặc biệt</h1>
  <p>Xin chào {{customerName}},</p>
  <p>Giảm giá <strong>20%</strong> cho tất cả sản phẩm!</p>
  <p>Áp dụng từ ngày 01/02 đến 28/02/2025</p>
  <a href="https://example.com/products" style="background-color: #db2777; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Mua ngay</a>
</div>
```

---

## ✅ SUMMARY

### Các tính năng:
1. ✅ Quản lý mẫu email (CRUD)
2. ✅ Gửi email cho một/nhiều người
3. ✅ Gửi email hàng loạt cho tất cả khách hàng
4. ✅ Thay thế biến trong template
5. ✅ Lịch sử gửi email
6. ✅ Thống kê email
7. ✅ Error handling và logging

### Bảo mật:
- ✅ Tất cả endpoints yêu cầu quyền admin
- ✅ Rate limit: 5 requests / 1 giờ
- ✅ Gmail App Password
- ✅ Error logging

### Email Features:
- ✅ HTML email support
- ✅ Template variables
- ✅ Bulk sending
- ✅ Success/failure tracking
- ✅ Nodemailer integration

---

**Date**: February 9, 2026  
**Version**: 1.0.0  
**Status**: ✅ Production Ready
