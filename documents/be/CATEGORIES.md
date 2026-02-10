# 📂 QUẢN LÝ DANH MỤC - CATEGORIES DOCUMENTATION

## 📋 Tổng Quan

Module quản lý danh mục sản phẩm bao gồm:
- Xem danh sách danh mục (Public)
- Tạo danh mục mới (Admin)
- Cập nhật danh mục (Admin)
- Xóa danh mục (Admin)

---

## 📋 1. LẤY TẤT CẢ DANH MỤC - GET ALL CATEGORIES

### Endpoint:
```
GET /api/categories
```

### Authentication:
```
Không yêu cầu (Public endpoint)
```

### Response Success (200):
```json
[
  {
    "id": 1,
    "name": "Giường",
    "description": "Giường ngủ các loại",
    "productCount": 15,
    "createdAt": "2025-01-10T10:00:00.000Z",
    "updatedAt": "2025-01-10T10:00:00.000Z"
  },
  {
    "id": 2,
    "name": "Sofa",
    "description": "Sofa phòng khách",
    "productCount": 8,
    "createdAt": "2025-01-10T10:00:00.000Z",
    "updatedAt": "2025-01-10T10:00:00.000Z"
  },
  {
    "id": 3,
    "name": "Tủ quần áo",
    "description": "Tủ quần áo các loại",
    "productCount": 12,
    "createdAt": "2025-01-10T10:00:00.000Z",
    "updatedAt": "2025-01-10T10:00:00.000Z"
  },
  {
    "id": 4,
    "name": "Bàn trang điểm",
    "description": "Bàn trang điểm hiện đại",
    "productCount": 5,
    "createdAt": "2025-01-10T10:00:00.000Z",
    "updatedAt": "2025-01-10T10:00:00.000Z"
  }
]
```

### Tính năng:
- ✅ Public endpoint (không cần authentication)
- ✅ Include số lượng sản phẩm trong mỗi danh mục
- ✅ Sắp xếp theo thời gian tạo

### SQL Query:
```sql
SELECT 
  categories.*,
  COUNT(products.id) as productCount
FROM categories
LEFT JOIN products ON categories.id = products.categoryId
GROUP BY categories.id
```

### Sử dụng:
- Hiển thị menu danh mục trên website
- Filter sản phẩm theo danh mục
- Dropdown chọn danh mục khi tạo/sửa sản phẩm

---

## ➕ 2. TẠO DANH MỤC MỚI - CREATE CATEGORY

### Endpoint:
```
POST /api/categories
```

### Authentication:
```
Authorization: Bearer {JWT_TOKEN}
Role: admin
```

### Request Body:
```json
{
  "name": "Bàn làm việc",
  "description": "Bàn làm việc văn phòng và tại nhà"
}
```

### Response Success (201):
```json
{
  "message": "Tạo danh mục thành công!",
  "data": {
    "id": 5,
    "name": "Bàn làm việc",
    "description": "Bàn làm việc văn phòng và tại nhà",
    "createdAt": "2025-02-09T10:00:00.000Z",
    "updatedAt": "2025-02-09T10:00:00.000Z"
  }
}
```

### Response Error:
```json
// Tên danh mục trống (400)
{
  "message": "Tên danh mục không được để trống."
}

// Tên danh mục đã tồn tại (409)
{
  "message": "Tên danh mục này đã tồn tại."
}
```

### Xử lý:
1. Kiểm tra authentication và quyền admin
2. Validate tên danh mục:
   ```javascript
   if (!name) {
     return res.status(400).send({ message: "Tên danh mục không được để trống." });
   }
   ```
3. Tạo danh mục mới:
   ```javascript
   const category = await Category.create({
     name,
     description
   });
   ```
4. Bắt lỗi unique constraint (tên trùng)

### Bảo mật:
- ✅ Yêu cầu authentication
- ✅ Yêu cầu role admin
- ✅ Validate tên danh mục
- ✅ Unique constraint cho tên

---

## ✏️ 3. CẬP NHẬT DANH MỤC - UPDATE CATEGORY

### Endpoint:
```
PUT /api/categories/:id
```

### Authentication:
```
Authorization: Bearer {JWT_TOKEN}
Role: admin
```

### Request Body:
```json
{
  "name": "Bàn làm việc (Updated)",
  "description": "Mô tả mới..."
}
```

### Response Success (200):
```json
{
  "message": "Cập nhật danh mục thành công.",
  "data": {
    "id": 5,
    "name": "Bàn làm việc (Updated)",
    "description": "Mô tả mới...",
    "createdAt": "2025-02-09T10:00:00.000Z",
    "updatedAt": "2025-02-09T11:00:00.000Z"
  }
}
```

### Response Error:
```json
// Danh mục không tồn tại (404)
{
  "message": "Không tìm thấy danh mục với id=5."
}

// Tên danh mục đã tồn tại (500)
{
  "message": "Lỗi khi cập nhật danh mục: ..."
}
```

### Xử lý:
1. Tìm danh mục theo ID
2. Cập nhật thông tin:
   ```javascript
   await category.update({ name, description });
   ```
3. Trả về danh mục đã cập nhật

### Bảo mật:
- ✅ Yêu cầu authentication
- ✅ Yêu cầu role admin
- ✅ Validate ID tồn tại

---

## 🗑️ 4. XÓA DANH MỤC - DELETE CATEGORY

### Endpoint:
```
DELETE /api/categories/:id
```

### Authentication:
```
Authorization: Bearer {JWT_TOKEN}
Role: admin
```

### Response Success (200):
```json
{
  "message": "Xóa danh mục thành công!"
}
```

### Response Error:
```json
// Danh mục không tồn tại (404)
{
  "message": "Không tìm thấy danh mục với id=5 để xóa."
}
```

### Xử lý:
1. Kiểm tra authentication và quyền admin
2. Xóa danh mục theo ID:
   ```javascript
   const num = await Category.destroy({
     where: { id: id }
   });
   ```
3. Kiểm tra số lượng bản ghi đã xóa

### Lưu ý:
- ⚠️ Nếu danh mục có sản phẩm, cần xử lý:
  - Option 1: Không cho xóa (kiểm tra trước)
  - Option 2: Set `categoryId = null` cho các sản phẩm
  - Option 3: Cascade delete (xóa cả sản phẩm)
- ✅ Hiện tại: Set `categoryId = null` (foreign key nullable)

### Bảo mật:
- ✅ Yêu cầu authentication
- ✅ Yêu cầu role admin

---

## 📊 5. DATABASE SCHEMA

### Bảng `categories`:
```sql
CREATE TABLE categories (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  createdAt DATETIME,
  updatedAt DATETIME
);
```

### Indexes:
```sql
CREATE UNIQUE INDEX idx_categories_name ON categories(name);
```

### Constraints:
- `name`: UNIQUE (không trùng tên)
- `name`: NOT NULL (bắt buộc)

---

## 🔗 6. RELATIONSHIPS

### Category → Product (One-to-Many):
```javascript
Category.hasMany(models.Product, {
  foreignKey: 'categoryId',
  as: 'products'
});
```

### Product → Category (Many-to-One):
```javascript
Product.belongsTo(models.Category, {
  foreignKey: 'categoryId',
  as: 'category'
});
```

---

## 📈 7. THỐNG KÊ SẢN PHẨM THEO DANH MỤC

### Trong response `GET /api/categories`:
```json
{
  "id": 1,
  "name": "Giường",
  "productCount": 15  // Số lượng sản phẩm trong danh mục
}
```

### SQL Query:
```javascript
const categories = await db.Category.findAll({
  include: [{
    model: db.Product,
    as: 'products',
    attributes: ['id']  // Chỉ lấy ID để đếm
  }]
});

const formattedCategories = categories.map(category => ({
  ...category.toJSON(),
  productCount: category.products ? category.products.length : 0
}));
```

---

## 🔍 8. LỌC SẢN PHẨM THEO DANH MỤC

### Endpoint:
```
GET /api/products?categoryId=1
```

### Ví dụ:
```javascript
// Lấy tất cả sản phẩm trong danh mục "Giường"
GET /api/products?categoryId=1

// Tìm kiếm sản phẩm "giường" trong danh mục "Giường"
GET /api/products?categoryId=1&search=giường
```

### SQL Query:
```sql
SELECT * FROM products
WHERE categoryId = 1
AND (name LIKE '%giường%' OR description LIKE '%giường%')
```

---

## 📝 9. DANH SÁCH DANH MỤC MẪU

### Danh mục trong database:
1. **Giường** - Giường ngủ các loại
2. **Sofa** - Sofa phòng khách
3. **Tủ quần áo** - Tủ quần áo các loại
4. **Bàn trang điểm** - Bàn trang điểm hiện đại
5. **Bàn làm việc** - Bàn làm việc văn phòng
6. **Ghế** - Ghế ngồi các loại
7. **Kệ sách** - Kệ sách và tủ sách
8. **Bàn ăn** - Bàn ăn gia đình

### SQL Insert:
```sql
INSERT INTO categories (name, description, createdAt, updatedAt) VALUES
('Giường', 'Giường ngủ các loại', NOW(), NOW()),
('Sofa', 'Sofa phòng khách', NOW(), NOW()),
('Tủ quần áo', 'Tủ quần áo các loại', NOW(), NOW()),
('Bàn trang điểm', 'Bàn trang điểm hiện đại', NOW(), NOW());
```

---

## ✅ SUMMARY

### Các tính năng:
1. ✅ Xem danh sách danh mục (Public)
2. ✅ Tạo danh mục mới (Admin)
3. ✅ Cập nhật danh mục (Admin)
4. ✅ Xóa danh mục (Admin)
5. ✅ Đếm số sản phẩm trong mỗi danh mục
6. ✅ Lọc sản phẩm theo danh mục

### Bảo mật:
- ✅ Public endpoint cho xem danh mục
- ✅ Admin-only cho tạo/sửa/xóa
- ✅ Unique constraint cho tên danh mục
- ✅ Validate dữ liệu đầu vào

### Database:
- ✅ Relationship với Product (One-to-Many)
- ✅ Unique constraint cho tên
- ✅ Nullable foreign key (categoryId)

### Lưu ý:
- ⚠️ Cần xử lý khi xóa danh mục có sản phẩm
- ✅ Hiện tại: Set `categoryId = null` cho sản phẩm

---

**Date**: February 9, 2026  
**Version**: 1.0.0  
**Status**: ✅ Production Ready
