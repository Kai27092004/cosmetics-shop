# 🛍️ QUẢN LÝ SẢN PHẨM - PRODUCTS DOCUMENTATION

## 📋 Tổng Quan

Module quản lý sản phẩm bao gồm:
- Xem danh sách sản phẩm (Public)
- Xem chi tiết sản phẩm (Public)
- Tạo/Sửa/Xóa sản phẩm (Admin only)
- Tìm kiếm và lọc sản phẩm
- Quản lý ảnh sản phẩm (ảnh chính + ảnh phụ)

---

## 📦 1. LẤY TẤT CẢ SẢN PHẨM - GET ALL PRODUCTS

### Endpoint:
```
GET /api/products
```

### Query Parameters:
```
?categoryId=1          // Lọc theo danh mục
&search=giường         // Tìm kiếm theo tên hoặc mô tả
```

### Response Success (200):
```json
[
  {
    "id": 1,
    "name": "Giường ngủ Diệp Mộc",
    "description": "Giường ngủ cao cấp...",
    "price": "5000000.00",
    "stockQuantity": 10,
    "imageUrl": "/upload/giuong-1.jpg",
    "sku": "GN001",
    "dimensions": "180x200cm",
    "material": "Gỗ MDF",
    "categoryId": 1,
    "createdAt": "2025-01-15T10:00:00.000Z",
    "updatedAt": "2025-01-15T10:00:00.000Z",
    "category": {
      "id": 1,
      "name": "Giường"
    },
    "images": [
      {
        "id": 1,
        "imageUrl": "/upload/giuong-1-1.jpg"
      },
      {
        "id": 2,
        "imageUrl": "/upload/giuong-1-2.jpg"
      }
    ]
  }
]
```

### Tính năng:
- ✅ Lọc theo `categoryId`
- ✅ Tìm kiếm theo `name` hoặc `description` (LIKE query)
- ✅ Include thông tin `category`
- ✅ Include danh sách `images` (ảnh phụ)
- ✅ Public endpoint (không cần authentication)

### SQL Query:
```sql
SELECT * FROM products
LEFT JOIN categories ON products.categoryId = categories.id
LEFT JOIN product_images ON products.id = product_images.productId
WHERE (name LIKE '%search%' OR description LIKE '%search%')
AND categoryId = ?
```

---

## 🔍 2. LẤY CHI TIẾT SẢN PHẨM - GET PRODUCT BY ID

### Endpoint:
```
GET /api/products/:id
```

### Response Success (200):
```json
{
  "id": 1,
  "name": "Giường ngủ Diệp Mộc",
  "description": "Giường ngủ cao cấp với chất liệu gỗ MDF...",
  "price": "5000000.00",
  "stockQuantity": 10,
  "imageUrl": "/upload/giuong-1.jpg",
  "sku": "GN001",
  "dimensions": "180x200cm",
  "material": "Gỗ MDF",
  "categoryId": 1,
  "createdAt": "2025-01-15T10:00:00.000Z",
  "updatedAt": "2025-01-15T10:00:00.000Z",
  "category": {
    "id": 1,
    "name": "Giường",
    "description": "Giường ngủ các loại"
  },
  "images": [
    {
      "id": 1,
      "imageUrl": "/upload/giuong-1-1.jpg"
    },
    {
      "id": 2,
      "imageUrl": "/upload/giuong-1-2.jpg"
    },
    {
      "id": 3,
      "imageUrl": "/upload/giuong-1-3.jpg"
    }
  ]
}
```

### Response Error (404):
```json
{
  "message": "Không tìm thấy sản phẩm."
}
```

### Tính năng:
- ✅ Lấy đầy đủ thông tin sản phẩm
- ✅ Include thông tin category
- ✅ Include tất cả ảnh phụ
- ✅ Public endpoint

---

## ➕ 3. TẠO SẢN PHẨM MỚI - CREATE PRODUCT

### Endpoint:
```
POST /api/products
```

### Authentication:
```
Authorization: Bearer {JWT_TOKEN}
Role: admin
```

### Request Body:
```json
{
  "name": "Giường ngủ Diệp Mộc",
  "description": "Giường ngủ cao cấp với chất liệu gỗ MDF phủ sơn",
  "price": 5000000,
  "stockQuantity": 10,
  "imageUrl": "/upload/giuong-1.jpg",
  "subImages": [
    "/upload/giuong-1-1.jpg",
    "/upload/giuong-1-2.jpg",
    "/upload/giuong-1-3.jpg"
  ],
  "sku": "GN001",
  "dimensions": "180x200cm",
  "material": "Gỗ MDF",
  "categoryId": 1
}
```

### Response Success (201):
```json
{
  "message": "Tạo sản phẩm thành công!",
  "data": {
    "id": 1,
    "name": "Giường ngủ Diệp Mộc",
    "price": "5000000.00",
    ...
  }
}
```

### Xử lý:
1. Kiểm tra authentication (JWT token)
2. Kiểm tra quyền admin
3. Chuẩn hóa `imageUrl` (đảm bảo format `/upload/...`)
4. Tạo sản phẩm trong database (transaction)
5. Tạo các ảnh phụ trong bảng `product_images`
6. Commit transaction
7. Trả về sản phẩm đã tạo

### Transaction:
```javascript
const t = await db.sequelize.transaction();
try {
  // 1. Tạo sản phẩm
  const product = await Product.create({...}, { transaction: t });
  
  // 2. Tạo ảnh phụ
  if (subImages && subImages.length > 0) {
    await db.ProductImage.bulkCreate(imageRecords, { transaction: t });
  }
  
  await t.commit();
} catch (error) {
  await t.rollback();
}
```

### Bảo mật:
- ✅ Yêu cầu authentication
- ✅ Yêu cầu role admin
- ✅ Sử dụng transaction để đảm bảo data integrity
- ✅ Validate dữ liệu đầu vào

---

## ✏️ 4. CẬP NHẬT SẢN PHẨM - UPDATE PRODUCT

### Endpoint:
```
PUT /api/products/:id
```

### Authentication:
```
Authorization: Bearer {JWT_TOKEN}
Role: admin
```

### Request Body:
```json
{
  "name": "Giường ngủ Diệp Mộc (Updated)",
  "description": "Mô tả mới...",
  "price": 5500000,
  "stockQuantity": 15,
  "imageUrl": "/upload/giuong-1-new.jpg",
  "subImages": [
    "/upload/giuong-1-1.jpg",
    "/upload/giuong-1-2.jpg"
  ],
  "sku": "GN001",
  "dimensions": "180x200cm",
  "material": "Gỗ MDF",
  "categoryId": 1
}
```

### Response Success (200):
```json
{
  "message": "Cập nhật sản phẩm thành công.",
  "data": {
    "id": 1,
    "name": "Giường ngủ Diệp Mộc (Updated)",
    ...
  }
}
```

### Response Error (404):
```json
{
  "message": "Không tìm thấy sản phẩm với id=1."
}
```

### Xử lý:
1. Tìm sản phẩm theo ID
2. Cập nhật thông tin sản phẩm
3. Nếu có `subImages`:
   - Xóa tất cả ảnh phụ cũ
   - Thêm ảnh phụ mới
4. Commit transaction

### Logic cập nhật ảnh phụ:
```javascript
if (subImages !== undefined && Array.isArray(subImages)) {
  // Xóa ảnh cũ
  await db.ProductImage.destroy({
    where: { productId: id },
    transaction: t
  });
  
  // Thêm ảnh mới
  if (subImages.length > 0) {
    const validImages = subImages.filter(url => url && url.trim() !== '');
    await db.ProductImage.bulkCreate(imageRecords, { transaction: t });
  }
}
```

### Bảo mật:
- ✅ Yêu cầu authentication
- ✅ Yêu cầu role admin
- ✅ Transaction để đảm bảo consistency
- ✅ Validate dữ liệu

---

## 🗑️ 5. XÓA SẢN PHẨM - DELETE PRODUCT

### Endpoint:
```
DELETE /api/products/:id
```

### Authentication:
```
Authorization: Bearer {JWT_TOKEN}
Role: admin
```

### Response Success (200):
```json
{
  "message": "Xóa sản phẩm thành công!"
}
```

### Response Error (404):
```json
{
  "message": "Không tìm thấy sản phẩm với id=1 để xóa."
}
```

### Xử lý:
1. Kiểm tra authentication và quyền admin
2. Xóa sản phẩm theo ID
3. Cascade delete:
   - Ảnh phụ trong `product_images` tự động xóa (foreign key constraint)
   - OrderItems liên quan cần xử lý riêng

### SQL:
```sql
DELETE FROM products WHERE id = ?
```

### Lưu ý:
- ⚠️ Không nên xóa sản phẩm đã có trong đơn hàng
- ✅ Nên soft delete (thêm field `isDeleted`) thay vì hard delete
- ✅ Hoặc kiểm tra xem sản phẩm có trong OrderItems không

### Bảo mật:
- ✅ Yêu cầu authentication
- ✅ Yêu cầu role admin

---

## 🖼️ 6. QUẢN LÝ ẢNH SẢN PHẨM

### Cấu trúc:
```
Product (1) -----> (N) ProductImage
```

### Bảng `products`:
- `imageUrl`: Ảnh chính (hiển thị trong danh sách)

### Bảng `product_images`:
- `id`: Primary key
- `productId`: Foreign key → products.id
- `imageUrl`: Đường dẫn ảnh phụ

### Ví dụ:
```json
{
  "id": 1,
  "name": "Giường ngủ",
  "imageUrl": "/upload/giuong-1.jpg",  // Ảnh chính
  "images": [                           // Ảnh phụ
    { "id": 1, "imageUrl": "/upload/giuong-1-1.jpg" },
    { "id": 2, "imageUrl": "/upload/giuong-1-2.jpg" },
    { "id": 3, "imageUrl": "/upload/giuong-1-3.jpg" }
  ]
}
```

### Upload ảnh:
- Sử dụng endpoint `/api/upload/image` (xem UPLOAD.md)
- Trả về URL: `/upload/filename.jpg`
- Lưu URL vào database

---

## 📊 7. DATABASE SCHEMA

### Bảng `products`:
```sql
CREATE TABLE products (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  stockQuantity INT NOT NULL DEFAULT 0,
  imageUrl VARCHAR(255) NOT NULL,
  sku VARCHAR(100) UNIQUE,
  dimensions VARCHAR(100),
  material VARCHAR(100),
  categoryId INT,
  createdAt DATETIME,
  updatedAt DATETIME,
  FOREIGN KEY (categoryId) REFERENCES categories(id)
);
```

### Bảng `product_images`:
```sql
CREATE TABLE product_images (
  id INT PRIMARY KEY AUTO_INCREMENT,
  productId INT NOT NULL,
  imageUrl VARCHAR(255) NOT NULL,
  createdAt DATETIME,
  updatedAt DATETIME,
  FOREIGN KEY (productId) REFERENCES products(id) ON DELETE CASCADE
);
```

### Indexes:
```sql
CREATE INDEX idx_products_category ON products(categoryId);
CREATE INDEX idx_products_name ON products(name);
CREATE INDEX idx_product_images_product ON product_images(productId);
```

---

## 🔗 8. RELATIONSHIPS

### Product → Category (Many-to-One):
```javascript
Product.belongsTo(models.Category, {
  foreignKey: 'categoryId',
  as: 'category'
});
```

### Product → ProductImage (One-to-Many):
```javascript
Product.hasMany(models.ProductImage, {
  foreignKey: 'productId',
  as: 'images'
});
```

### Product → OrderItem (One-to-Many):
```javascript
Product.hasMany(models.OrderItem, {
  foreignKey: 'productId',
  as: 'orderItems'
});
```

---

## 🔍 9. TÌM KIẾM VÀ LỌC

### Tìm kiếm theo tên:
```javascript
const { Op } = require('sequelize');

whereCondition[Op.or] = [
  { name: { [Op.like]: `%${search}%` } },
  { description: { [Op.like]: `%${search}%` } }
];
```

### Lọc theo danh mục:
```javascript
if (categoryId) {
  whereCondition.categoryId = categoryId;
}
```

### Ví dụ query:
```
GET /api/products?search=giường&categoryId=1
```

### SQL tương đương:
```sql
SELECT * FROM products
WHERE (name LIKE '%giường%' OR description LIKE '%giường%')
AND categoryId = 1
```

---

## 📦 10. QUẢN LÝ KHO

### Trường `stockQuantity`:
- Số lượng sản phẩm còn trong kho
- Giảm khi tạo đơn hàng
- Tăng khi hủy đơn hàng

### Cập nhật kho khi đặt hàng:
```javascript
product.stockQuantity -= cartItem.quantity;
await product.save({ transaction: t });
```

### Cập nhật kho khi hủy đơn:
```javascript
await db.Product.increment('stockQuantity', {
  by: item.quantity,
  where: { id: item.productId },
  transaction: t
});
```

### Kiểm tra tồn kho:
```javascript
if (product.stockQuantity < cartItem.quantity) {
  throw new Error(`Không đủ số lượng cho sản phẩm: ${product.name}`);
}
```

---

## ✅ SUMMARY

### Các tính năng:
1. ✅ Xem danh sách sản phẩm (Public)
2. ✅ Xem chi tiết sản phẩm (Public)
3. ✅ Tạo sản phẩm mới (Admin)
4. ✅ Cập nhật sản phẩm (Admin)
5. ✅ Xóa sản phẩm (Admin)
6. ✅ Tìm kiếm theo tên/mô tả
7. ✅ Lọc theo danh mục
8. ✅ Quản lý ảnh phụ
9. ✅ Quản lý tồn kho

### Bảo mật:
- ✅ Public endpoints cho xem sản phẩm
- ✅ Admin-only cho tạo/sửa/xóa
- ✅ Transaction để đảm bảo data integrity
- ✅ Validate dữ liệu đầu vào

### Database:
- ✅ Relationship với Category
- ✅ Relationship với ProductImage
- ✅ Relationship với OrderItem
- ✅ Cascade delete cho ảnh phụ
- ✅ Indexes cho performance

---

**Date**: February 9, 2026  
**Version**: 1.0.0  
**Status**: ✅ Production Ready
