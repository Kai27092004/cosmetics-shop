# 🗄️ Database Documentation - Cosmetics Shop

**Dự án:** Cosmetics Shop (E-commerce)
**Hệ quản trị:** MySQL
**Database Name:** `cosmetics_db`
**Người thực hiện:** Kai Dev

---

## 1. Tổng quan Kiến trúc (Schema Overview)

Database được thiết kế theo mô hình **Quan hệ (Relational Database)**, chia thành 4 nhóm nghiệp vụ chính:

### 👤 A. Nhóm Người dùng (Users)
* **Bảng:** `users`
* **Chức năng:** Quản lý thông tin đăng nhập và hồ sơ khách hàng.
* **Điểm nổi bật:**
    * **Phân quyền:** Sử dụng cột `role` kiểu `ENUM('customer', 'admin')`.
    * **Bảo mật:** Mật khẩu (`password`) lưu dưới dạng mã hóa (Hash), không lưu text thường.
    * **Đa nền tảng:** Hỗ trợ đăng nhập Google qua cột `googleId`.

### 🛍️ B. Nhóm Sản phẩm (Catalog)
* **Bảng:** `categories`, `products`, `productimages`
* **Mô hình:**
    * `categories` (1) ---- (N) `products`: Một danh mục có nhiều sản phẩm.
    * `products` (1) ---- (N) `productimages`: Một sản phẩm có nhiều hình ảnh.
* **Cơ chế an toàn:** Sử dụng `ON DELETE SET NULL` cho khóa ngoại `categoryId`. Nếu xóa danh mục, sản phẩm không bị mất mà chỉ mất phân loại.

### 💰 C. Nhóm Giao dịch (Transaction) - *Quan trọng nhất*
* **Bảng:** `orders`, `orderitems`
* **Mô hình:** `orders` (Header) và `orderitems` (Detail).
* **Lưu ý nghiệp vụ:**
    * Bảng `orderitems` lưu trữ **giá tại thời điểm mua** (`price`). Điều này đảm bảo lịch sử đơn hàng không bị sai lệch khi giá sản phẩm gốc thay đổi sau này.
    * Hỗ trợ phương thức thanh toán `COD` và `QRCODE`.

### 📧 D. Nhóm Tiện ích (Utilities)
* **Bảng:** `emailtemplates`, `emaillogs`
* **Chức năng:** Hệ thống Marketing Automation. Lưu mẫu email HTML và lịch sử gửi mail để tracking.

---

## 2. Chi tiết Cấu trúc Bảng (Table Structures)

### Bảng `orders` (Đơn hàng)
Đây là bảng trung tâm của hệ thống bán hàng.

| Cột (Column) | Kiểu dữ liệu | Ý nghĩa |
| :--- | :--- | :--- |
| `id` | INT PK | Mã đơn hàng (Tự tăng) |
| `userId` | INT FK | Khách hàng nào mua? |
| `status` | ENUM | Trạng thái: pending, processing, shipped, delivered, cancelled |
| `totalAmount` | DECIMAL | Tổng tiền đơn hàng |
| `paymentMethod` | ENUM | 'COD' hoặc 'QRCODE' |
| `paymentStatus` | ENUM | 'unpaid' hoặc 'paid' |

---

## 3. Tối ưu Hiệu năng (Performance & Indexing)

Database đã được tối ưu tốc độ truy vấn (`SELECT`) thông qua kỹ thuật **Indexing**.

| Tên Index | Bảng | Cột | Mục đích sử dụng |
| :--- | :--- | :--- | :--- |
| `idx_orders_user` | `orders` | `userId` | Giúp user xem "Lịch sử mua hàng" cực nhanh. |
| `idx_orders_status` | `orders` | `status` | Giúp Admin lọc các đơn hàng "Mới" (pending) để xử lý. |
| `idx_email_logs_user` | `emaillogs` | `userId` | Tra cứu lịch sử gửi mail cho một khách hàng cụ thể. |

> **Lưu ý:** Index giúp đọc nhanh hơn nhưng làm chậm thao tác Ghi (`INSERT/UPDATE`) một chút. Không nên lạm dụng.

---

## 4. Công cụ Hỗ trợ (Stored Procedures)

Hệ thống có tích hợp sẵn tool tạo dữ liệu giả để phục vụ Test (Seeding).

* **Tên Procedure:** `GenerateRandomOrders`
* **Cách dùng:** `CALL GenerateRandomOrders();`
* **Tác dụng:** Tự động tạo 50 đơn hàng ngẫu nhiên, bao gồm cả chi tiết sản phẩm, giúp Developer không phải nhập tay khi test tính năng phân trang hay báo cáo.

---

## 5. Cẩm nang SQL (Cheatsheet) cho Developer

Dưới đây là các câu lệnh thường dùng trong code Backend (Node.js).

### A. JOIN (Kết nối bảng)

**1. Lấy Sản phẩm kèm Tên Danh mục (INNER JOIN)**
*Dùng khi hiển thị danh sách sản phẩm.*
```sql
SELECT p.id, p.name AS TenSanPham, p.price, c.name AS DanhMuc
FROM products p
INNER JOIN categories c ON p.categoryId = c.id;

2. Tìm Khách hàng chưa từng mua gì (LEFT JOIN)
Dùng cho Marketing/CSKH.

SQL
SELECT u.fullName, u.email
FROM users u
LEFT JOIN orders o ON u.id = o.userId
WHERE o.id IS NULL;


B. Báo cáo (Aggregation)
Tính tổng doanh thu theo tháng:

SQL
SELECT 
    MONTH(createdAt) as Thang, 
    SUM(totalAmount) as DoanhThu
FROM orders
WHERE paymentStatus = 'paid'
GROUP BY MONTH(createdAt);