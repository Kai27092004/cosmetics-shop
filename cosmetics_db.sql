SET NAMES utf8mb4;
CREATE DATABASE IF NOT EXISTS cosmetics_db 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE cosmetics_db;

-- =====================================================================
-- BƯỚC 1: TẠO CẤU TRÚC BẢNG (SCHEMA)
-- =====================================================================

-- 1. Bảng users
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fullName VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NULL,
    resetPasswordToken VARCHAR(255) NULL,
    resetPasswordExpires DATETIME NULL,
    googleId VARCHAR(255) NULL UNIQUE,
    avatar VARCHAR(500) NULL,
    phone VARCHAR(20) NULL,
    address TEXT NULL,
    role ENUM('customer', 'admin') NOT NULL DEFAULT 'customer',
    isBlocked BOOLEAN DEFAULT FALSE,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 2. Bảng categories
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT NULL,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 3. Bảng products
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    stockQuantity INT NOT NULL DEFAULT 0,
    imageUrl VARCHAR(255) NOT NULL,
    sku VARCHAR(100) UNIQUE NULL, 
    dimensions VARCHAR(255) NULL,
    material VARCHAR(255) NULL,
    categoryId INT NULL,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (categoryId) REFERENCES categories(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 4. Bảng productimages
CREATE TABLE productimages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    productId INT NOT NULL,
    imageUrl VARCHAR(255) NOT NULL,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (productId) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 5. Bảng orders
-- ✅ THÊM MỚI:  paymentMethod và paymentStatus
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    totalAmount DECIMAL(10, 2) NOT NULL,
    status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') NOT NULL DEFAULT 'pending',
    
    -- ✅ THÊM:  Phương thức thanh toán
    paymentMethod ENUM('COD', 'QRCODE') NOT NULL DEFAULT 'COD',
    
    -- ✅ THÊM: Trạng thái thanh toán
    paymentStatus ENUM('unpaid', 'paid') NOT NULL DEFAULT 'unpaid',
    
    shippingAddress TEXT NOT NULL,
    customerNotes TEXT NULL,
    
    -- ✅ THÊM: Thông tin giao hàng chi tiết
    phone VARCHAR(20) NOT NULL,
    fullName VARCHAR(255) NOT NULL,
    
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 6. Bảng orderitems
CREATE TABLE orderitems (
    id INT AUTO_INCREMENT PRIMARY KEY,
    orderId INT NOT NULL,
    productId INT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (orderId) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (productId) REFERENCES products(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 7. Bảng emailtemplates
CREATE TABLE IF NOT EXISTS emailtemplates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE, 
    subject VARCHAR(500) NOT NULL, 
    content TEXT NOT NULL,
    description TEXT NULL, 
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 8. Bảng emaillogs
CREATE TABLE IF NOT EXISTS emaillogs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NULL,
    recipientEmail VARCHAR(255) NOT NULL, 
    recipientName VARCHAR(255) NULL, 
    subject VARCHAR(500) NOT NULL, 
    content TEXT NOT NULL, 
    status ENUM('sent', 'failed') NOT NULL DEFAULT 'sent', 
    errorMessage TEXT NULL, 
    sentBy INT NOT NULL,
    sentAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (sentBy) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ✅ THÊM:  Indexes cho tối ưu query
CREATE INDEX idx_email_logs_user ON emaillogs(userId);
CREATE INDEX idx_email_logs_sent_at ON emaillogs(sentAt);
-- CREATE INDEX idx_email_logs_status ON emaillogs(status); Vấn đề: 99% email sẽ là sent. Đánh index cho sent là lãng phí.

-- ✅ THÊM: Indexes cho orders (để query nhanh hơn)
-- CREATE INDEX idx_orders_payment_method ON orders(paymentMethod); Vấn đề: Nếu 80% đơn là COD, MySQL thấy phải lấy tận 80% dữ liệu. -> chậm hơn.
-- CREATE INDEX idx_orders_payment_status ON orders(paymentStatus);  tương tự ở trên.
CREATE INDEX idx_orders_user ON orders(userId);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_products_price ON products(price); -- Cho chức năng lọc giá.

-- =====================================================================
-- BƯỚC 2: THÊM DỮ LIỆU MẪU (SEED DATA)
-- =====================================================================

-- 1. users
INSERT INTO `users` (`fullName`, `email`, `password`, `phone`, `address`, `role`) VALUES
('Quản Trị Viên', 'admin@email.com', '$2a$12$78cga50NK6qxk35cpjwlKetU9VJvTUpI0UhfinwAQdSUH/QyO3itO', '0987654321', '123 Đường Admin, Quận 1, TP.HCM', 'admin'),
('Nguyễn Văn An', 'nguyen.an@email.com', '$2a$12$9NpdokzqzT5hBOCKYsfUNeCraPB.qJAM/SnC1iUhNb5WU.1tyX2Aq', '0912345678', '111 Nguyễn Trãi, Quận Thanh Xuân, Hà Nội', 'customer'),
('Trần Thị Bích', 'tran.bich@email.com', '$2a$12$9NpdokzqzT5hBOCKYsfUNeCraPB.qJAM/SnC1iUhNb5WU.1tyX2Aq', '0923456789', '222 Lê Lợi, Quận Hải Châu, Đà Nẵng', 'customer'),
('Lê Minh Cường', 'le.cuong@email.com', '$2a$12$9NpdokzqzT5hBOCKYsfUNeCraPB.qJAM/SnC1iUhNb5WU.1tyX2Aq', '0934567890', '333 Trần Hưng Đạo, Quận 5, TP.HCM', 'customer'),
('Phạm Thị Dung', 'pham.dung@email.com', '$2a$12$9NpdokzqzT5hBOCKYsfUNeCraPB.qJAM/SnC1iUhNb5WU.1tyX2Aq', '0945678901', '444 Võ Văn Tần, Quận 3, TP.HCM', 'customer'),
('Hoàng Văn Em', 'hoang.em@email.com', '$2a$12$9NpdokzqzT5hBOCKYsfUNeCraPB.qJAM/SnC1iUhNb5WU.1tyX2Aq', '0956789012', '555 Cầu Giấy, Quận Cầu Giấy, Hà Nội', 'customer'),
('Võ Thị Giang', 'vo.giang@email.com', '$2a$12$9NpdokzqzT5hBOCKYsfUNeCraPB.qJAM/SnC1iUhNb5WU.1tyX2Aq', '0967890123', '666 Nguyễn Thị Minh Khai, Quận 1, TP.HCM', 'customer'),
('Đỗ Minh Hải', 'do.hai@email.com', '$2a$12$9NpdokzqzT5hBOCKYsfUNeCraPB.qJAM/SnC1iUhNb5WU.1tyX2Aq', '0978901234', '777 Lý Thường Kiệt, Quận Tân Bình, TP.HCM', 'customer'),
('Bùi Thị Hạnh', 'bui.hanh@email.com', '$2a$12$9NpdokzqzT5hBOCKYsfUNeCraPB.qJAM/SnC1iUhNb5WU.1tyX2Aq', '0989012345', '888 Hùng Vương, Quận 6, TP.HCM', 'customer'),
('Phan Văn Kiên', 'phan.kien@email.com', '$2a$12$9NpdokzqzT5hBOCKYsfUNeCraPB.qJAM/SnC1iUhNb5WU.1tyX2Aq', '0901234567', '999 Quang Trung, Quận Gò Vấp, TP.HCM', 'customer');

-- 2. categories
INSERT INTO `categories` (`id`, `name`, `description`) VALUES
(1, 'Kem dưỡng da', 'Kem dưỡng da mang lại làn da mềm mịn, cấp ẩm sâu và giúp nuôi dưỡng vẻ rạng ngời từ sâu bên trong. '),
(2, 'Sữa rửa mặt', 'Làm sạch sâu bụi bẩn và bã nhờn nhẹ nhàng, giúp lỗ chân lông thông thoáng mà vẫn giữ độ ẩm tự nhiên cho da.'),
(3, 'Dầu gội', 'Chăm sóc mái tóc chắc khỏe từ gốc đến ngọn, phục hồi hư tổn và lưu lại hương thơm quyến rũ suốt ngày dài.'),
(4, 'Sữa tắm', 'Nuôi dưỡng làn da cơ thể m��n màng, trắng sáng với chiết xuất thiên nhiên, mang lại cảm giác thư giãn sảng khoái.');

-- 3. products (16 sản phẩm)
INSERT INTO `products` (`id`, `name`, `description`, `price`, `stockQuantity`, `imageUrl`, `sku`, `dimensions`, `material`, `categoryId`) VALUES
(1, 'Kem Dưỡng Goodal Làm Sáng Da', 'Cung cấp độ ẩm sâu, giúp da mềm mại và mịn màng suốt 24h, bảo vệ da khỏi tác hại của môi trường. ', 150000.00, 50, '/upload/kem-duong-da-1.jpg', 'KEM-DUONG-001', '50ml', 'Vitamin E, Nha đam', 1),
(2, 'Kem Dưỡng Ẩm', 'Kem Dưỡng Ẩm, Làm Dịu Da Beyond Angel Aqua Moisture Cream 150ml.', 320000.00, 30, '/upload/kem-duong-am-2.jpg', 'KEM-DUONG-002', '30g', 'Bột ngọc trai', 1),
(3, 'Kem Chống Lão Hóa Collagen', 'Bổ sung Collagen thủy phân giúp da săn chắc, giảm nếp nhăn và ngăn ngừa các dấu hiệu lão hóa sớm.', 450000.00, 25, '/upload/kem-duong-tre-hoa-da-3.jpg', 'KEM-DUONG-003', '50ml', 'Collagen, Peptide', 1),
(4, 'Gel Dưỡng Mắt Mờ Thâm', 'Kem Dưỡng Mắt Mờ Thâm, Sáng Da CNP Propolis Essential Eye Cream 50ml', 120000.00, 100, '/upload/kem-duong-mat-mo-tham-4.jpg', 'KEM-DUONG-004', '300ml', 'Lô hội tự nhiên', 1),
(5, 'Sữa Rửa Cerave', 'Làm sạch sâu lỗ chân lông, kiểm soát bã nhờn và ngăn ngừa mụn với tinh chất trà xanh kháng khuẩn.', 95000.00, 80, '/upload/sua-rua-mat-1.jpg', 'SRM-001', '100ml', 'Trà xanh Nhật Bản', 2),
(6, 'Sữa Rửa Mặt Dịu Nhẹ pH 5.5', 'Công thức cân bằng độ pH lý tưởng, phù hợp cho da nhạy cảm, làm sạch mà không gây khô căng. ', 180000.00, 60, '/upload/sua-rua-mat-2.jpg', 'SRM-002', '150ml', 'Ceramide, Glycerin', 2),
(7, 'Sữa Rửa Mặt Than Tre', 'Hút sạch độc tố, bụi bẩn và dầu thừa, giúp da sáng khỏe và lỗ chân lông thông thoáng.', 110000.00, 45, '/upload/sua-rua-mat-3.jpg', 'SRM-003', '100g', 'Than tre hoạt tính', 2),
(8, 'Gel Rửa Mặt Tẩy Tế Bào Chết', 'Chứa các hạt massage nhỏ giúp loại bỏ tế bào chết nhẹ nhàng trong quá trình rửa mặt hàng ngày.', 135000.00, 50, '/upload/sua-rua-mat-4.jpg', 'SRM-004', '120ml', 'Hạt Jojoba', 2),
(9, 'Dầu Gội Bưởi Kích Thích Mọc Tóc', 'Tinh dầu vỏ bưởi đậm đặc giúp ngăn rụng tóc, nuôi dưỡng nang tóc và kích thích mọc tóc con.', 250000.00, 40, '/upload/dau-goi-1.jpg', 'DAU-GOI-001', '300ml', 'Tinh dầu bưởi', 3),
(10, 'Dầu Gội Thảo Dược Bồ Kết', 'Nấu từ bồ kết truyền thống kết hợp hương nhu, giúp tóc đen mượt, sạch gàu và giảm ngứa da đầu.', 180000.00, 55, '/upload/dau-goi-2.jpg', 'DAU-GOI-002', '500ml', 'Bồ kết, Hương nhu', 3),
(11, 'Dầu Gội Phục Hồi Keratin', 'Bổ sung Keratin giúp tái tạo cấu trúc tóc, phục hồi mái tóc hư tổn do uốn, duỗi, nhuộm. ', 350000.00, 30, '/upload/dau-goi-3.jpg', 'DAU-GOI-003', '450ml', 'Keratin, Dầu Argan', 3),
(12, 'Dầu Gội Bạc Hà Mát Lạnh', 'Mang lại cảm giác mát lạnh sảng khoái, đánh bay gàu và bụi bẩn, giúp da đầu thư giãn.', 120000.00, 70, '/upload/dau-goi-4.jpg', 'DAU-GOI-004', '650ml', 'Tinh chất bạc hà', 3),
(13, 'Sữa Tắm Lifebuoy', 'Sữa Tắm Dưỡng Da Lifebuoy Gel.', 150000.00, 60, '/upload/sua-tam-1.jpg', 'SUA-TAM-001', '1000ml', 'Sữa dê nguyên chất', 4),
(14, 'Sữa Tắm Hương Nước Hoa', 'Sữa Tắm 92% Hữu Cơ Le Petit Marseillais 650ml.', 280000.00, 35, '/upload/sua-tam-2.jpg', 'SUA-TAM-002', '500ml', 'Tinh dầu nước hoa', 4),
(15, 'Sữa Tắm Hương Nước Hoa', 'Sữa Tắm Nước Hoa Mine Perfumed Shower Gel 470ML.', 160000.00, 40, '/upload/sua-tam-3.jpg', 'SUA-TAM-003', '400ml', 'Hạt mơ, Vitamin C', 4),
(16, 'Sữa Tắm M.O.I', '(Phiên bản giới hạn) Sữa Tắm M.O.I Hương Nước Hoa Limited Edition Destiny Body Wash 250ml', 190000.00, 25, '/upload/sua-tam-4.jpg', 'SUA-TAM-004', '300ml', 'Gừng, Nghệ', 4);

-- 4. productimages (5 ảnh phụ cho mỗi sản phẩm)
INSERT INTO `productimages` (`productId`, `imageUrl`) VALUES
-- Sản phẩm 1
(1, '/upload/kem-duong-da-1-1.jpg'), (1, '/upload/kem-duong-da-1-2.jpg'), (1, '/upload/kem-duong-da-1-3.jpg'), (1, '/upload/kem-duong-da-1-4.jpg'), (1, '/upload/kem-duong-da-1-5.jpg'),
-- Sản phẩm 2
(2, '/upload/kem-duong-am-2-1.jpg'), (2, '/upload/kem-duong-am-2-1.jpg'), (2, '/upload/kem-duong-am-2-2.jpg'), (2, '/upload/kem-duong-am-2-3.jpg'), (2, '/upload/kem-duong-am-2.jpg'),
-- Sản phẩm 3
(3, '/upload/kem-duong-tre-hoa-da-3-1.jpg'), (3, '/upload/kem-duong-tre-hoa-da-3-1.jpg'), (3, '/upload/kem-duong-tre-hoa-da-3-2.jpg'), (3, '/upload/kem-duong-tre-hoa-da-3.jpg'), (3, '/upload/kem-duong-tre-hoa-da-3-1.jpg'),
-- Sản phẩm 4
(4, '/upload/kem-duong-mat-mo-tham-4-1.jpg'), (4, '/upload/kem-duong-mat-mo-tham-4-2.jpg'), (4, '/upload/kem-duong-mat-mo-tham-4-3.jpg'), (4, '/upload/kem-duong-mat-mo-tham-4-4.jpg'), (4, '/upload/kem-duong-mat-mo-tham-4.jpg'),
-- Sản phẩm 5
(5, '/upload/sua-rua-mat-1-1.jpg'), (5, '/upload/sua-rua-mat-1-2.jpg'), (5, '/upload/sua-rua-mat-1-3.jpg'), (5, '/upload/sua-rua-mat-1-4.jpg'), (5, '/upload/sua-rua-mat-1-5.jpg'),
-- Sản phẩm 6
(6, '/upload/sua-rua-mat-2-1.jpg'), (6, '/upload/sua-rua-mat-2-2.jpg'), (6, '/upload/sua-rua-mat-2-3.jpg'), (6, '/upload/sua-rua-mat-2-4.jpg'), (6, '/upload/sua-rua-mat-2-5.jpg'),
-- Sản phẩm 7
(7, '/upload/sua-rua-mat-3-1.jpg'), (7, '/upload/sua-rua-mat-3-2.jpg'), (7, '/upload/sua-rua-mat-3-3.jpg'), (7, '/upload/sua-rua-mat-3-4.jpg'), (7, '/upload/sua-rua-mat-3.jpg'),
-- Sản phẩm 8
(8, '/upload/sua-rua-mat-4-1.jpg'), (8, '/upload/sua-rua-mat-4-2.jpg'), (8, '/upload/sua-rua-mat-4-3.jpg'), (8, '/upload/sua-rua-mat-4-4.jpg'), (8, '/upload/sua-rua-mat-4.jpg'),
-- Sản phẩm 9
(9, '/upload/dau-goi-1-1.jpg'), (9, '/upload/dau-goi-1-2.jpg'), (9, '/upload/dau-goi-1-3.jpg'), (9, '/upload/dau-goi-1.jpg'), (9, '/upload/dau-goi-1-3.jpg'),
-- Sản phẩm 10
(10, '/upload/dau-goi-2-1.jpg'), (10, '/upload/dau-goi-2-2.jpg'), (10, '/upload/dau-goi-2-3.jpg'), (10, '/upload/dau-goi-2-4.jpg'), (10, '/upload/dau-goi-2.jpg'),
-- Sản phẩm 11
(11, '/upload/dau-goi-3-1.jpg'), (11, '/upload/dau-goi-3-2.jpg'), (11, '/upload/dau-goi-3-3.jpg'), (11, '/upload/dau-goi-3-4.jpg'), (11, '/upload/dau-goi-3-5.jpg'),
-- Sản phẩm 12
(12, '/upload/dau-goi-4-1.jpg'), (12, '/upload/dau-goi-4-2.jpg'), (12, '/upload/dau-goi-4-3.jpg'), (12, '/upload/dau-goi-4-4.jpg'), (12, '/upload/dau-goi-4-5.jpg'),
-- Sản phẩm 13
(13, '/upload/sua-tam-1-1.jpg'), (13, '/upload/sua-tam-1-2.jpg'), (13, '/upload/sua-tam-1-3.jpg'), (13, '/upload/sua-tam-1-4.jpg'), (13, '/upload/sua-tam-1-5.jpg'),
-- Sản phẩm 14
(14, '/upload/sua-tam-2-1.jpg'), (14, '/upload/sua-tam-2-2.jpg'), (14, '/upload/sua-tam-2-3.jpg'), (14, '/upload/sua-tam-2-4.jpg'), (14, '/upload/sua-tam-2-5.jpg'),
-- Sản phẩm 15
(15, '/upload/sua-tam-3-1.jpg'), (15, '/upload/sua-tam-3-2.jpg'), (15, '/upload/sua-tam-3-3.jpg'), (15, '/upload/sua-tam-3-4.jpg'), (15, '/upload/sua-tam-3-5.jpg'),
-- Sản phẩm 16
(16, '/upload/sua-tam-4-1.jpg'), (16, '/upload/sua-tam-4-2.jpg'), (16, '/upload/sua-tam-4-3.jpg'), (16, '/upload/sua-tam-4-4.jpg'), (16, '/upload/sua-tam-4-1.jpg');

-- 5. emailtemplates
INSERT INTO emailtemplates (name, subject, content, description) VALUES
('Chào mừng khách hàng mới', 'Chào mừng bạn đến với Cosmetics Shop! ', 
'<h2>Xin chào {{customerName}}!</h2>
<p>Chúng tôi rất vui mừng chào đón bạn đến với <strong>Cosmetics Shop</strong> - thiên đường mỹ phẩm chính hãng. </p>
<p>Hãy khám phá bộ sưu tập sản phẩm chăm sóc da và làm đẹp đa dạng của chúng tôi.</p>
<p>Trân trọng,<br/>Đội ngũ Cosmetics Shop</p>',
'Mẫu email chào mừng khách hàng mới đăng ký'),

('Khuyến mãi đặc biệt', 'Ưu đãi đặc biệt dành cho bạn!', 
'<h2>Chào {{customerName}}!</h2>
<p>Chúng tôi có tin vui dành cho bạn!  🎉</p>
<p><strong>GIẢM GIÁ LÊN ĐẾN 30%</strong> cho các dòng sản phẩm Kem dưỡng và Sữa rửa mặt trong tháng này. </p>
<p>Đừng bỏ lỡ cơ hội chăm sóc làn da với giá ưu đãi!</p>
<p>Trân trọng,<br/>Đội ngũ Cosmetics Shop</p>',
'Mẫu email thông báo khuyến mãi'),

('Cảm ơn đơn hàng', 'Cảm ơn bạn đã đặt hàng!', 
'<h2>Xin chào {{customerName}}!</h2>
<p>Cảm ơn bạn đã tin tưởng và mua sắm tại <strong>Cosmetics Shop</strong>.</p>
<p>Đơn hàng của bạn đang được xử lý và sẽ sớm được giao đến tận tay bạn.</p>
<p>Trân trọng,<br/>Đội ngũ Cosmetics Shop</p>',
'Mẫu email cảm ơn sau khi khách hàng đặt hàng');

-- =====================================================================
-- BƯỚC 3:  STORED PROCEDURE (Tạo đơn hàng mẫu)
-- ✅ CẬP NHẬT:  Thêm paymentMethod và paymentStatus ngẫu nhiên
-- =====================================================================
DELIMITER $$

CREATE PROCEDURE GenerateRandomOrders()
BEGIN
    DECLARE i INT DEFAULT 0;
    DECLARE j INT;
    DECLARE randomUserId INT;
    DECLARE randomProductId INT;
    DECLARE randomQuantity INT;
    DECLARE productPrice DECIMAL(10, 2);
    DECLARE totalOrderAmount DECIMAL(10, 2);
    DECLARE newOrderId INT;
    DECLARE itemsPerOrder INT;
    DECLARE userAddress TEXT;
    DECLARE userName VARCHAR(255);
    DECLARE userPhone VARCHAR(20);
    DECLARE orderStatus ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled');
    DECLARE randomDate DATETIME;
    
    -- ✅ THÊM:  Biến cho payment
    DECLARE randomPaymentMethod ENUM('COD', 'QRCODE');
    DECLARE randomPaymentStatus ENUM('unpaid', 'paid');

    -- Lặp 50 lần để tạo 50 đơn hàng mẫu
    WHILE i < 50 DO
        SET i = i + 1;
        SET totalOrderAmount = 0;
        
        -- Random userId từ 2 đến 5 (customer, không lấy admin)
        SET randomUserId = FLOOR(2 + (RAND() * 4));
        
        -- Lấy thông tin user
        SELECT address, fullName, phone INTO userAddress, userName, userPhone 
        FROM users WHERE id = randomUserId;
        
        -- Chỉ tạo đơn nếu tìm thấy user
        IF userAddress IS NOT NULL THEN
            SET orderStatus = ELT(FLOOR(1 + RAND() * 5), 'pending', 'processing', 'shipped', 'delivered', 'cancelled');
            SET randomDate = NOW() - INTERVAL FLOOR(RAND() * 180) DAY;
            
            -- ✅ THÊM:  Random payment method (70% COD, 30% QRCODE)
            SET randomPaymentMethod = IF(RAND() < 0.7, 'COD', 'QRCODE');
            
            -- ✅ THÊM:  Quyết định payment status dựa vào payment method
            -- - Nếu COD → luôn unpaid (chưa nhận hàng)
            -- - Nếu QRCODE → 80% paid, 20% unpaid
            IF randomPaymentMethod = 'COD' THEN
                SET randomPaymentStatus = 'unpaid';
            ELSE
                SET randomPaymentStatus = IF(RAND() < 0.8, 'paid', 'unpaid');
            END IF;

            -- ✅ CẬP NHẬT: INSERT với paymentMethod, paymentStatus, phone, fullName
            INSERT INTO orders (
                userId, 
                totalAmount, 
                status, 
                paymentMethod, 
                paymentStatus, 
                shippingAddress, 
                phone, 
                fullName, 
                customerNotes, 
                createdAt
            )
            VALUES (
                randomUserId, 
                0, 
                orderStatus, 
                randomPaymentMethod, 
                randomPaymentStatus, 
                userAddress, 
                userPhone, 
                userName, 
                CONCAT('Đơn hàng mỹ phẩm mẫu #', i), 
                randomDate
            );
            
            SET newOrderId = LAST_INSERT_ID();
            
            -- Mỗi đơn có 1-3 sản phẩm
            SET itemsPerOrder = FLOOR(1 + (RAND() * 3));
            SET j = 0;
            
            WHILE j < itemsPerOrder DO
                SET j = j + 1;
                
                -- Chọn sản phẩm ngẫu nhiên (id 1-16)
                SET randomProductId = FLOOR(1 + (RAND() * 16));
                
                SELECT price INTO productPrice FROM products WHERE id = randomProductId;
                
                SET randomQuantity = FLOOR(1 + (RAND() * 2));
                
                INSERT INTO orderitems (orderId, productId, quantity, price)
                VALUES (newOrderId, randomProductId, randomQuantity, productPrice);
                
                SET totalOrderAmount = totalOrderAmount + (productPrice * randomQuantity);
            END WHILE;
            
            UPDATE orders SET totalAmount = totalOrderAmount WHERE id = newOrderId;
        END IF;
        
    END WHILE;
END$$

DELIMITER ;

-- Chạy procedure để tạo data mẫu
CALL GenerateRandomOrders();

-- Xóa Procedure sau khi dùng xong
DROP PROCEDURE IF EXISTS GenerateRandomOrders;

COMMIT;