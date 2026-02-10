# 👥 QUẢN LÝ NGƯỜI DÙNG - USERS DOCUMENTATION

## 📋 Tổng Quan

Module quản lý người dùng bao gồm:
- Xem và cập nhật profile (User)
- Đổi mật khẩu (User)
- Xem lịch sử đơn hàng (User)
- Quản lý tất cả người dùng (Admin)
- Tạo/Sửa/Xóa người dùng (Admin)
- Khóa/Mở khóa tài khoản (Admin)

---

## 👤 1. XEM PROFILE - GET PROFILE

### Endpoint:
```
GET /api/users/profile
```

### Authentication:
```
Authorization: Bearer {JWT_TOKEN}
```

### Response Success (200):
```json
{
  "id": 5,
  "fullName": "Nguyễn Văn A",
  "email": "user@example.com",
  "googleId": null,
  "avatar": "https://lh3.googleusercontent.com/...",
  "phone": "0901234567",
  "address": "123 Nguyễn Văn Linh, Quận 7, TP.HCM",
  "role": "customer",
  "isBlocked": false,
  "createdAt": "2025-01-15T10:00:00.000Z",
  "updatedAt": "2025-02-09T10:00:00.000Z"
}
```

### Bảo mật:
- ✅ Yêu cầu authentication
- ✅ Không trả về password
- ✅ Chỉ xem được profile của chính mình

---

## ✏️ 2. CẬP NHẬT PROFILE - UPDATE PROFILE

### Endpoint:
```
PUT /api/users/profile
```

### Authentication:
```
Authorization: Bearer {JWT_TOKEN}
```

### Request Body:
```json
{
  "fullName": "Nguyễn Văn A (Updated)",
  "phone": "0909999999",
  "address": "456 Lê Văn Việt, Quận 9, TP.HCM"
}
```

### Response Success (200):
```json
{
  "id": 5,
  "fullName": "Nguyễn Văn A (Updated)",
  "email": "user@example.com",
  "phone": "0909999999",
  "address": "456 Lê Văn Việt, Quận 9, TP.HCM",
  "role": "customer",
  ...
}
```

### Trường có thể cập nhật:
- ✅ `fullName`: Họ tên
- ✅ `phone`: Số điện thoại
- ✅ `address`: Địa chỉ
- ❌ `email`: Không thể đổi
- ❌ `role`: Không thể tự đổi
- ❌ `password`: Dùng endpoint riêng

### Bảo mật:
- ✅ Chỉ cập nhật được profile của chính mình
- ✅ Không trả về password

---

## 🔐 3. ĐỔI MẬT KHẨU - CHANGE PASSWORD

### Endpoint:
```
PUT /api/users/change-password
```

### Authentication:
```
Authorization: Bearer {JWT_TOKEN}
```

### Request Body:
```json
{
  "oldPassword": "matkhaucu123",
  "newPassword": "matkhaumoi456"
}
```

### Response Success (200):
```json
{
  "message": "Đổi mật khẩu thành công!"
}
```

### Response Error:
```json
// Mật khẩu cũ không đúng (400)
{
  "message": "Mật khẩu cũ không đúng."
}

// User không tồn tại (404)
{
  "message": "Không tìm thấy người dùng."
}
```

### Xử lý:
1. Tìm user theo `userId` từ JWT
2. So sánh `oldPassword` với password trong DB:
   ```javascript
   const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
   ```
3. Nếu đúng, cập nhật password mới:
   ```javascript
   user.password = newPassword; // Tự động hash qua beforeUpdate hook
   await user.save();
   ```

### Bảo mật:
- ✅ Yêu cầu mật khẩu cũ
- ✅ Password mới được hash tự động
- ✅ Không thể đổi password của user khác

---

## 📦 4. XEM LỊCH SỬ ĐƠN HÀNG - GET MY ORDERS

### Endpoint:
```
GET /api/users/my-orders
```

### Authentication:
```
Authorization: Bearer {JWT_TOKEN}
```

### Response Success (200):
```json
[
  {
    "id": 1,
    "userId": 5,
    "totalAmount": "10500000.00",
    "status": "delivered",
    "paymentMethod": "COD",
    "paymentStatus": "paid",
    "shippingAddress": "123 Nguyễn Văn Linh...",
    "customerNotes": "Giao hàng buổi chiều",
    "createdAt": "2025-02-01T10:00:00.000Z",
    "updatedAt": "2025-02-05T15:00:00.000Z",
    "orderItems": [
      {
        "id": 1,
        "orderId": 1,
        "productId": 1,
        "quantity": 2,
        "price": "5000000.00",
        "product": {
          "id": 1,
          "name": "Giường ngủ Diệp Mộc",
          "imageUrl": "/upload/giuong-1.jpg"
        }
      }
    ]
  },
  {
    "id": 2,
    "userId": 5,
    "totalAmount": "2500000.00",
    "status": "processing",
    ...
  }
]
```

### Tính năng:
- ✅ Chỉ xem đơn hàng của chính mình
- ✅ Sắp xếp theo thời gian mới nhất
- ✅ Include thông tin sản phẩm
- ✅ Include ảnh sản phẩm

---

## 👨‍💼 5. [ADMIN] THỐNG KÊ NGƯỜI DÙNG - GET USER STATS

### Endpoint:
```
GET /api/users/admin/stats
```

### Authentication:
```
Authorization: Bearer {JWT_TOKEN}
Role: admin
```

### Response Success (200):
```json
{
  "totalUsers": 150,
  "adminUsers": 3,
  "customerUsers": 147
}
```

### Sử dụng:
- Dashboard admin
- Thống kê tổng quan

---

## 👨‍💼 6. [ADMIN] LẤY TẤT CẢ NGƯỜI DÙNG - GET ALL USERS

### Endpoint:
```
GET /api/users/admin/all
```

### Query Parameters:
```
?search=nguyen          // Tìm kiếm theo tên hoặc email
&role=customer          // Lọc theo role (customer/admin/all)
```

### Authentication:
```
Authorization: Bearer {JWT_TOKEN}
Role: admin
```

### Response Success (200):
```json
[
  {
    "id": 5,
    "fullName": "Nguyễn Văn A",
    "email": "user@example.com",
    "googleId": null,
    "avatar": null,
    "phone": "0901234567",
    "address": "123 Nguyễn Văn Linh...",
    "role": "customer",
    "isBlocked": false,
    "createdAt": "2025-01-15T10:00:00.000Z",
    "updatedAt": "2025-02-09T10:00:00.000Z",
    "orders": [
      {
        "id": 1,
        "totalAmount": "10500000.00",
        "status": "delivered"
      },
      {
        "id": 2,
        "totalAmount": "2500000.00",
        "status": "processing"
      }
    ],
    "stats": {
      "totalOrders": 2,
      "totalSpent": 13000000
    }
  }
]
```

### Tính năng:
- ✅ Tìm kiếm theo tên hoặc email
- ✅ Lọc theo role
- ✅ Include lịch sử đơn hàng
- ✅ Tính toán thống kê (tổng đơn, tổng chi tiêu)
- ✅ Không trả về password

### SQL Query:
```sql
SELECT users.*, orders.*
FROM users
LEFT JOIN orders ON users.id = orders.userId
WHERE (fullName LIKE '%search%' OR email LIKE '%search%')
AND role = ?
ORDER BY users.id ASC
```

---

## 👨‍💼 7. [ADMIN] TẠO NGƯỜI DÙNG MỚI - CREATE USER

### Endpoint:
```
POST /api/users/admin/create
```

### Authentication:
```
Authorization: Bearer {JWT_TOKEN}
Role: admin
```

### Request Body:
```json
{
  "fullName": "Nguyễn Văn B",
  "email": "userb@example.com",
  "password": "password123",
  "phone": "0902222222",
  "address": "789 Võ Văn Ngân, Thủ Đức, TP.HCM",
  "role": "customer"
}
```

### Response Success (201):
```json
{
  "id": 10,
  "fullName": "Nguyễn Văn B",
  "email": "userb@example.com",
  "phone": "0902222222",
  "address": "789 Võ Văn Ngân...",
  "role": "customer",
  "isBlocked": false,
  ...
}
```

### Response Error:
```json
// Email đã tồn tại (400)
{
  "message": "Email đã tồn tại trong hệ thống"
}
```

### Xử lý:
1. Kiểm tra email đã tồn tại chưa
2. Tạo user mới:
   ```javascript
   const newUser = await User.create({
     fullName,
     email,
     password, // Tự động hash qua beforeCreate hook
     phone,
     address,
     role: role || 'customer'
   });
   ```
3. Trả về user (không có password)

### Bảo mật:
- ✅ Chỉ admin mới tạo được
- ✅ Password được hash tự động
- ✅ Kiểm tra email trùng lặp

---

## 👨‍💼 8. [ADMIN] CẬP NHẬT NGƯỜI DÙNG - UPDATE USER

### Endpoint:
```
PUT /api/users/admin/:id
```

### Authentication:
```
Authorization: Bearer {JWT_TOKEN}
Role: admin
```

### Request Body:
```json
{
  "fullName": "Nguyễn Văn B (Updated)",
  "email": "userb_new@example.com",
  "phone": "0903333333",
  "address": "New address...",
  "role": "admin"
}
```

### Response Success (200):
```json
{
  "id": 10,
  "fullName": "Nguyễn Văn B (Updated)",
  "email": "userb_new@example.com",
  "phone": "0903333333",
  "role": "admin",
  ...
}
```

### Response Error:
```json
// User không tồn tại (404)
{
  "message": "Không tìm thấy người dùng"
}

// Email đã tồn tại (400)
{
  "message": "Email đã tồn tại trong hệ thống"
}
```

### Xử lý:
1. Tìm user theo ID
2. Kiểm tra email mới có trùng không (nếu đổi email)
3. Cập nhật thông tin:
   ```javascript
   await user.update({
     fullName: fullName || user.fullName,
     email: email || user.email,
     phone: phone || user.phone,
     address: address || user.address,
     role: role || user.role
   });
   ```

### Trường có thể cập nhật:
- ✅ `fullName`
- ✅ `email`
- ✅ `phone`
- ✅ `address`
- ✅ `role`
- ❌ `password` (không đổi qua endpoint này)

---

## 👨‍💼 9. [ADMIN] KHÓA/MỞ KHÓA TÀI KHOẢN - TOGGLE BLOCK STATUS

### Endpoint:
```
PATCH /api/users/admin/:id/block
```

### Authentication:
```
Authorization: Bearer {JWT_TOKEN}
Role: admin
```

### Response Success (200):
```json
{
  "message": "Đã khóa tài khoản thành công",
  "isBlocked": true
}
```

hoặc

```json
{
  "message": "Đã mở khóa tài khoản thành công",
  "isBlocked": false
}
```

### Response Error:
```json
// User không tồn tại (404)
{
  "message": "Người dùng không tồn tại"
}

// Không thể khóa admin (400)
{
  "message": "Không thể chặn tài khoản Quản trị viên"
}
```

### Xử lý:
1. Tìm user theo ID
2. Kiểm tra user có phải admin không:
   ```javascript
   if (user.role === 'admin') {
     return res.status(400).json({ message: 'Không thể chặn tài khoản Quản trị viên' });
   }
   ```
3. Đảo ngược trạng thái:
   ```javascript
   user.isBlocked = !user.isBlocked;
   await user.save();
   ```

### Tính năng:
- ✅ Toggle (đảo ngược) trạng thái
- ✅ Không thể khóa admin
- ✅ User bị khóa không thể đăng nhập

---

## 👨‍💼 10. [ADMIN] XÓA NGƯỜI DÙNG - DELETE USER

### Endpoint:
```
DELETE /api/users/admin/:id
```

### Authentication:
```
Authorization: Bearer {JWT_TOKEN}
Role: admin
```

### Response Success (200):
```json
{
  "message": "Xóa người dùng thành công"
}
```

### Response Error:
```json
// User không tồn tại (404)
{
  "message": "Không tìm thấy người dùng"
}

// Không thể xóa admin cuối cùng (400)
{
  "message": "Không thể xóa admin cuối cùng trong hệ thống"
}
```

### Xử lý:
1. Tìm user theo ID
2. Nếu user là admin:
   - Đếm số admin trong hệ thống
   - Nếu chỉ còn 1 admin → Không cho xóa
3. Xóa user:
   ```javascript
   await user.destroy();
   ```

### Bảo mật:
- ✅ Không thể xóa admin cuối cùng
- ✅ Cascade delete (đơn hàng của user sẽ bị ảnh hưởng)

### Lưu ý:
- ⚠️ Nên soft delete thay vì hard delete
- ⚠️ Cần xử lý đơn hàng của user trước khi xóa

---

## 📊 11. DATABASE SCHEMA

### Bảng `users`:
```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  fullName VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255),
  googleId VARCHAR(255) UNIQUE,
  avatar VARCHAR(255),
  phone VARCHAR(20),
  address TEXT,
  role ENUM('customer', 'admin') DEFAULT 'customer',
  resetPasswordToken VARCHAR(255),
  resetPasswordExpires DATETIME,
  isBlocked BOOLEAN DEFAULT FALSE,
  createdAt DATETIME,
  updatedAt DATETIME
);
```

### Indexes:
```sql
CREATE UNIQUE INDEX idx_users_email ON users(email);
CREATE UNIQUE INDEX idx_users_google_id ON users(googleId);
CREATE INDEX idx_users_role ON users(role);
```

---

## 🔐 12. BẢO MẬT PASSWORD

### Hash Algorithm:
- **Bcrypt** với 12 salt rounds

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

### Lưu ý:
- ✅ Password luôn được hash tự động
- ✅ Không bao giờ trả về password trong response
- ✅ Google users có `password = null`

---

## 🔗 13. RELATIONSHIPS

### User → Order (One-to-Many):
```javascript
User.hasMany(models.Order, {
  foreignKey: 'userId',
  as: 'orders'
});
```

### User → EmailLog (One-to-Many):
```javascript
User.hasMany(models.EmailLog, {
  foreignKey: 'userId',
  as: 'emailLogs'
});
```

---

## ✅ SUMMARY

### Các tính năng User:
1. ✅ Xem profile
2. ✅ Cập nhật profile
3. ✅ Đổi mật khẩu
4. ✅ Xem lịch sử đơn hàng

### Các tính năng Admin:
1. ✅ Thống kê người dùng
2. ✅ Xem tất cả người dùng
3. ✅ Tìm kiếm và lọc
4. ✅ Tạo người dùng mới
5. ✅ Cập nhật thông tin user
6. ✅ Khóa/Mở khóa tài khoản
7. ✅ Xóa người dùng

### Bảo mật:
- ✅ Authentication cho tất cả endpoints
- ✅ Authorization (User/Admin)
- ✅ Password hash với bcrypt
- ✅ Không trả về password
- ✅ Không thể khóa/xóa admin cuối cùng
- ✅ Kiểm tra email trùng lặp

### Thống kê:
- ✅ Tổng số đơn hàng
- ✅ Tổng chi tiêu
- ✅ Lịch sử đơn hàng

---

**Date**: February 9, 2026  
**Version**: 1.0.0  
**Status**: ✅ Production Ready
