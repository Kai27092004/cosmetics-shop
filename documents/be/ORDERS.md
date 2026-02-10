# 🛒 QUẢN LÝ ĐƠN HÀNG - ORDERS DOCUMENTATION

## 📋 Tổng Quan

Hệ thống quản lý đơn hàng bao gồm:
- Tạo đơn hàng (User)
- Hủy đơn hàng (User)
- Xem chi tiết đơn hàng (User)
- Quản lý tất cả đơn hàng (Admin)
- Cập nhật trạng thái đơn hàng (Admin)
- Xóa đơn hàng (Admin)
- Realtime notification qua Socket.IO
- Webhook thanh toán SePay

---

## 🛍️ 1. TẠO ĐƠN HÀNG - CREATE ORDER

### Endpoint:
```
POST /api/orders
```

### Authentication:
```
Authorization: Bearer {JWT_TOKEN}
```

### Request Body:
```json
{
  "cartItems": [
    {
      "productId": 1,
      "quantity": 2
    },
    {
      "productId": 3,
      "quantity": 1
    }
  ],
  "shippingAddress": "123 Nguyễn Văn Linh, Quận 7, TP.HCM",
  "customerNotes": "Giao hàng buổi chiều",
  "paymentMethod": "COD",
  "phone": "0901234567",
  "fullName": "Nguyễn Văn A"
}
```

### Response Success (201):
```json
{
  "message": "Đặt hàng thành công!",
  "orderId": 1,
  "totalAmount": "10500000.00",
  "paymentMethod": "COD",
  "paymentStatus": "unpaid"
}
```

### Response Error:
```json
// Sản phẩm không tồn tại (500)
{
  "message": "Đặt hàng thất bại: Sản phẩm với ID 1 không tồn tại."
}

// Không đủ số lượng (500)
{
  "message": "Đặt hàng thất bại: Không đủ số lượng cho sản phẩm: Giường ngủ. Chỉ còn 5 sản phẩm."
}

// Phương thức thanh toán không hợp lệ (400)
{
  "message": "Phương thức thanh toán không hợp lệ. Chỉ chấp nhận COD hoặc QRCODE."
}

// Thiếu thông tin (400)
{
  "message": "Vui lòng cung cấp số điện thoại và họ tên."
}
```

### Xử lý:
1. **Validate dữ liệu đầu vào**:
   - `paymentMethod`: Chỉ chấp nhận `COD` hoặc `QRCODE`
   - `phone` và `fullName`: Bắt buộc
2. **Tính tổng tiền ở server** (không tin tưởng client):
   ```javascript
   for (const cartItem of cartItems) {
     const product = await Product.findByPk(cartItem.productId);
     totalAmount += product.price * cartItem.quantity;
   }
   ```
3. **Kiểm tra tồn kho**:
   ```javascript
   if (product.stockQuantity < cartItem.quantity) {
     throw new Error(`Không đủ số lượng...`);
   }
   ```
4. **Tạo đơn hàng** (transaction):
   - Tạo record trong bảng `orders`
   - Tạo records trong bảng `order_items`
   - Giảm `stockQuantity` của sản phẩm
5. **Gửi realtime notification**:
   - Gửi cho admin: `order:new`
   - Gửi cho user: `order:created`

### Realtime Notification:
```javascript
// Gửi cho admin
io.to('role:admin').emit('order:new', {
  orderId: order.id,
  userId,
  userName: user.fullName,
  totalAmount: order.totalAmount,
  paymentMethod: order.paymentMethod,
  itemCount: cartItems.length,
  message: `🛒 Đơn hàng mới #${order.id} từ ${user.fullName} (${paymentMethod})`
});

// Gửi cho user
io.to(`user:${userId}`).emit('order:created', {
  orderId: order.id,
  status: 'pending',
  paymentMethod: order.paymentMethod,
  totalAmount: order.totalAmount,
  message: `✅ Đơn hàng #${order.id} của bạn đã được tạo thành công!`
});
```

### Bảo mật:
- ✅ Yêu cầu authentication
- ✅ Tính tổng tiền ở server (không tin client)
- ✅ Kiểm tra tồn kho
- ✅ Transaction để đảm bảo consistency
- ✅ Rate limit: 10 requests / 1 giờ

---

## ❌ 2. HỦY ĐƠN HÀNG - CANCEL ORDER

### Endpoint:
```
POST /api/orders/:orderId/cancel
```

### Authentication:
```
Authorization: Bearer {JWT_TOKEN}
```

### Response Success (200):
```json
{
  "message": "Hủy đơn hàng thành công."
}
```

### Response Error (404):
```json
{
  "message": "Không tìm thấy đơn hàng hoặc đơn hàng không thể hủy."
}
```

### Điều kiện hủy:
- ✅ Đơn hàng phải thuộc về user đang đăng nhập
- ✅ Trạng thái phải là `pending`
- ❌ Không thể hủy đơn đã `processing`, `shipped`, `delivered`

### Xử lý:
1. Tìm đơn hàng:
   ```javascript
   const order = await Order.findOne({
     where: {
       id: orderId,
       userId: userId,
       status: 'pending'
     }
   });
   ```
2. Cập nhật trạng thái:
   ```javascript
   order.status = 'cancelled';
   await order.save({ transaction: t });
   ```
3. Hoàn lại tồn kho:
   ```javascript
   for (const item of order.orderItems) {
     await db.Product.increment('stockQuantity', {
       by: item.quantity,
       where: { id: item.productId },
       transaction: t
     });
   }
   ```
4. Gửi realtime notification:
   - Gửi cho admin: `order:cancelled`
   - Gửi cho user: `order:statusChanged`

### Bảo mật:
- ✅ Chỉ user sở hữu mới hủy được
- ✅ Chỉ hủy được đơn `pending`
- ✅ Transaction để đảm bảo hoàn kho đúng

---

## 📊 3. XEM CHI TIẾT ĐƠN HÀNG - GET ORDER DETAILS

### Endpoint:
```
GET /api/orders/:orderId
```

### Authentication:
```
Authorization: Bearer {JWT_TOKEN}
```

### Response Success (200):
```json
{
  "id": 1,
  "userId": 5,
  "totalAmount": "10500000.00",
  "status": "processing",
  "paymentMethod": "COD",
  "paymentStatus": "unpaid",
  "phone": "0901234567",
  "fullName": "Nguyễn Văn A",
  "shippingAddress": "123 Nguyễn Văn Linh, Quận 7, TP.HCM",
  "customerNotes": "Giao hàng buổi chiều",
  "createdAt": "2025-02-09T10:00:00.000Z",
  "updatedAt": "2025-02-09T10:30:00.000Z",
  "user": {
    "id": 5,
    "fullName": "Nguyễn Văn A",
    "email": "user@example.com",
    "phone": "0901234567"
  },
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
        "imageUrl": "/upload/giuong-1.jpg",
        "price": "5000000.00"
      }
    },
    {
      "id": 2,
      "orderId": 1,
      "productId": 3,
      "quantity": 1,
      "price": "500000.00",
      "product": {
        "id": 3,
        "name": "Gối ôm",
        "imageUrl": "/upload/goi-1.jpg",
        "price": "500000.00"
      }
    }
  ]
}
```

### Bảo mật:
- ✅ Chỉ user sở hữu mới xem được
- ✅ Include thông tin user và products

---

## 🔄 4. CẬP NHẬT TRẠNG THÁI ĐƠN HÀNG (USER)

### Endpoint:
```
PUT /api/orders/:orderId/status
```

### Authentication:
```
Authorization: Bearer {JWT_TOKEN}
```

### Request Body:
```json
{
  "status": "delivered"
}
```

### Trạng thái hợp lệ:
- `pending`: Chờ xử lý
- `processing`: Đang xử lý
- `shipped`: Đang giao hàng
- `delivered`: Đã giao hàng
- `cancelled`: Đã hủy

### Response Success (200):
```json
{
  "message": "Cập nhật trạng thái đơn hàng thành công.",
  "order": { ... }
}
```

### Bảo mật:
- ✅ Chỉ user sở hữu mới cập nhật được
- ✅ Validate trạng thái hợp lệ

---

## 📈 5. LẤY TRẠNG THÁI ĐƠN HÀNG - GET ORDER STATUS

### Endpoint:
```
GET /api/orders/:orderId/status
```

### Authentication:
```
Authorization: Bearer {JWT_TOKEN}
```

### Response Success (200):
```json
{
  "order": {
    "id": 1,
    "status": "processing",
    "totalAmount": "10500000.00",
    "paymentMethod": "COD",
    "paymentStatus": "unpaid",
    "updatedAt": "2025-02-09T10:30:00.000Z"
  }
}
```

### Sử dụng:
- Frontend polling để cập nhật trạng thái realtime
- Kiểm tra trạng thái thanh toán sau khi chuyển khoản

---

## 👨‍💼 6. [ADMIN] LẤY TẤT CẢ ĐƠN HÀNG

### Endpoint:
```
GET /api/orders/admin/all
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
    "id": 1,
    "userId": 5,
    "totalAmount": "10500000.00",
    "status": "processing",
    "paymentMethod": "COD",
    "paymentStatus": "unpaid",
    "phone": "0901234567",
    "fullName": "Nguyễn Văn A",
    "shippingAddress": "123 Nguyễn Văn Linh...",
    "customerNotes": "Giao hàng buổi chiều",
    "createdAt": "2025-02-09T10:00:00.000Z",
    "user": {
      "id": 5,
      "fullName": "Nguyễn Văn A",
      "email": "user@example.com"
    },
    "orderItems": [
      {
        "id": 1,
        "quantity": 2,
        "price": "5000000.00",
        "product": {
          "id": 1,
          "name": "Giường ngủ Diệp Mộc",
          "imageUrl": "/upload/giuong-1.jpg",
          "price": "5000000.00"
        }
      }
    ]
  }
]
```

### Tính năng:
- ✅ Xem tất cả đơn hàng trong hệ thống
- ✅ Sắp xếp theo thời gian mới nhất
- ✅ Include thông tin user và products

---

## 👨‍💼 7. [ADMIN] CẬP NHẬT TRẠNG THÁI ĐƠN HÀNG

### Endpoint:
```
PUT /api/orders/admin/:orderId/status
```

### Authentication:
```
Authorization: Bearer {JWT_TOKEN}
Role: admin
```

### Request Body:
```json
{
  "status": "shipped"
}
```

### Response Success (200):
```json
{
  "message": "Cập nhật trạng thái đơn hàng thành công.",
  "order": { ... }
}
```

### Xử lý:
1. Tìm đơn hàng theo ID
2. Nếu chuyển sang `cancelled`:
   - Hoàn lại tồn kho
3. Cập nhật trạng thái
4. Gửi realtime notification:
   - Gửi cho user: `order:statusChanged`
   - Gửi cho admin: `order:updated`
   - Gửi cho room order: `order:update`

### Realtime Notification:
```javascript
const statusMessages = {
  pending: 'Chờ xử lý',
  processing: 'Đang xử lý',
  shipped: 'Đang giao hàng',
  delivered: 'Đã giao hàng',
  cancelled: 'Đã hủy'
};

io.to(`user:${order.userId}`).emit('order:statusChanged', {
  orderId: order.id,
  oldStatus,
  newStatus: status,
  statusText: statusMessages[status],
  message: `📦 Đơn hàng #${order.id} đã chuyển sang trạng thái: ${statusMessages[status]}`
});
```

### Bảo mật:
- ✅ Chỉ admin mới cập nhật được
- ✅ Transaction để đảm bảo hoàn kho đúng
- ✅ Realtime notification cho user

---

## 👨‍💼 8. [ADMIN] XÓA ĐƠN HÀNG

### Endpoint:
```
DELETE /api/orders/admin/:orderId
```

### Authentication:
```
Authorization: Bearer {JWT_TOKEN}
Role: admin
```

### Response Success (200):
```json
{
  "message": "Xóa đơn hàng thành công.",
  "cancelledDuringDelete": true
}
```

### Xử lý:
1. Tìm đơn hàng theo ID
2. Nếu đơn chưa `cancelled`:
   - Hoàn lại tồn kho
   - Đổi trạng thái thành `cancelled`
3. Xóa đơn hàng
4. Gửi realtime notification

### Bảo mật:
- ✅ Chỉ admin mới xóa được
- ✅ Tự động hoàn kho nếu chưa hủy
- ✅ Transaction

---

## 💳 9. WEBHOOK THANH TOÁN SEPAY

### Endpoint:
```
POST /api/payment/sepay-webhook
POST /api/orders/webhooks/sepay
```

### Authentication:
```
Authorization: Bearer {SEPAY_API_KEY}
```

### Request Body (từ SePay):
```json
{
  "content": "Thanh toan don hang DH123",
  "transferAmount": 10500000,
  "description": "Chuyen khoan ngan hang",
  ...
}
```

### Xử lý:
1. **Kiểm tra API Key**:
   ```javascript
   const authHeader = req.headers['authorization'];
   if (!authHeader || !authHeader.includes(myApiKey)) {
     return res.status(401).json({ message: "Unauthorized" });
   }
   ```
2. **Tìm mã đơn hàng** trong `content`:
   - Ưu tiên 1: Tìm `DH` + số (VD: `DH123`)
   - Ưu tiên 2: Lấy số cuối cùng
3. **Cập nhật đơn hàng**:
   ```javascript
   order.status = 'processing';
   order.paymentStatus = 'paid';
   await order.save();
   ```
4. **Gửi realtime notification**:
   - Gửi cho user: `order:payment_updated`
   - Gửi cho admin: `order:updated`

### Realtime Notification:
```javascript
io.to(`user:${order.userId}`).emit('order:payment_updated', {
  orderId: order.id,
  paymentStatus: 'paid',
  status: 'processing',
  message: 'Thanh toán thành công! Đơn hàng đang được xử lý.'
});
```

### Bảo mật:
- ✅ Kiểm tra API Key từ SePay
- ✅ Validate số tiền chuyển khoản
- ✅ Chỉ cập nhật đơn `pending` hoặc `cancelled`

---

## 🔔 10. REALTIME NOTIFICATIONS (SOCKET.IO)

### Socket Events:

#### A. `order:new` (Admin)
```javascript
// Khi có đơn hàng mới
io.to('role:admin').emit('order:new', {
  orderId,
  userId,
  userName,
  totalAmount,
  paymentMethod,
  itemCount,
  message: `🛒 Đơn hàng mới #${orderId}`
});
```

#### B. `order:created` (User)
```javascript
// Khi user tạo đơn thành công
io.to(`user:${userId}`).emit('order:created', {
  orderId,
  status: 'pending',
  paymentMethod,
  totalAmount,
  message: `✅ Đơn hàng #${orderId} đã được tạo`
});
```

#### C. `order:statusChanged` (User)
```javascript
// Khi admin cập nhật trạng thái
io.to(`user:${userId}`).emit('order:statusChanged', {
  orderId,
  oldStatus,
  newStatus,
  statusText,
  message: `📦 Đơn hàng #${orderId} đã chuyển sang ${statusText}`
});
```

#### D. `order:payment_updated` (User)
```javascript
// Khi thanh toán thành công qua SePay
io.to(`user:${userId}`).emit('order:payment_updated', {
  orderId,
  paymentStatus: 'paid',
  status: 'processing',
  message: 'Thanh toán thành công!'
});
```

#### E. `order:cancelled` (Admin)
```javascript
// Khi user hủy đơn
io.to('role:admin').emit('order:cancelled', {
  orderId,
  userId,
  message: `❌ Đơn hàng #${orderId} đã bị hủy`
});
```

### Socket Rooms:
- `user:{userId}`: Room riêng cho từng user
- `role:admin`: Room cho tất cả admin
- `order:{orderId}`: Room cho từng đơn hàng

---

## 📊 11. DATABASE SCHEMA

### Bảng `orders`:
```sql
CREATE TABLE orders (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userId INT NOT NULL,
  totalAmount DECIMAL(10,2) NOT NULL,
  status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
  paymentMethod ENUM('COD', 'QRCODE') DEFAULT 'COD',
  paymentStatus ENUM('unpaid', 'paid') DEFAULT 'unpaid',
  phone VARCHAR(20) NOT NULL,
  fullName VARCHAR(100) NOT NULL,
  shippingAddress TEXT NOT NULL,
  customerNotes TEXT,
  createdAt DATETIME,
  updatedAt DATETIME,
  FOREIGN KEY (userId) REFERENCES users(id)
);
```

### Bảng `order_items`:
```sql
CREATE TABLE order_items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  orderId INT NOT NULL,
  productId INT NOT NULL,
  quantity INT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  createdAt DATETIME,
  updatedAt DATETIME,
  FOREIGN KEY (orderId) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (productId) REFERENCES products(id)
);
```

---

## ✅ SUMMARY

### Các tính năng:
1. ✅ Tạo đơn hàng (User)
2. ✅ Hủy đơn hàng (User - chỉ pending)
3. ✅ Xem chi tiết đơn hàng (User)
4. ✅ Cập nhật trạng thái (User)
5. ✅ Lấy tất cả đơn hàng (Admin)
6. ✅ Cập nhật trạng thái (Admin)
7. ✅ Xóa đơn hàng (Admin)
8. ✅ Webhook thanh toán SePay
9. ✅ Realtime notifications (Socket.IO)

### Bảo mật:
- ✅ Authentication cho tất cả endpoints
- ✅ Authorization (User/Admin)
- ✅ Tính tổng tiền ở server
- ✅ Transaction để đảm bảo consistency
- ✅ Webhook authentication (API Key)
- ✅ Rate limit: 10 orders / 1 giờ

### Realtime:
- ✅ Socket.IO cho notifications
- ✅ 5 loại events khác nhau
- ✅ Room-based messaging
- ✅ Admin và User notifications

---

**Date**: February 9, 2026  
**Version**: 1.0.0  
**Status**: ✅ Production Ready
