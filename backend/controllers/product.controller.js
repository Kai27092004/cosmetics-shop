const db = require('../models');
const Product = db.Product;
const Category = db.Category;
const { Op } = require('sequelize');

// Lấy tất cả sản phẩm (có thể kèm theo lọc và phân trang sau này)
exports.getAllProducts = async (req, res) => {
    const { categoryId, search } = req.query;
    const whereCondition = {};

    if (categoryId) {
        whereCondition.categoryId = categoryId;
    }

    // Thêm điều kiện tìm kiếm theo tên hoặc mô tả
    if (search) {
        whereCondition[Op.or] = [
            { name: { [Op.like]: `%${search}%` } },
            { description: { [Op.like]: `%${search}%` } }
        ];
    }

    try {
        const products = await Product.findAll({
            where: whereCondition, // Thêm điều kiện lọc vào đây
            include: [
                {
                    model: Category,
                    as: 'category',
                    attributes: ['id', 'name'] // Chỉ lấy id và name của category
                },
                {
                    model: db.ProductImage,
                    as: 'images',
                    attributes: ['id', 'imageUrl']
                }
            ]
        });
        res.status(200).send(products);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

// Lấy một sản phẩm theo ID
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id, {
            include: [
                {
                    model: db.Category, // Đảm bảo biến db.Category hoạt động
                    as: 'category'
                },
                // --- THÊM PHẦN LẤY ẢNH PHỤ ---
                {
                    model: db.ProductImage,
                    as: 'images', // Phải khớp với 'as' trong product.model.js
                    attributes: ['id', 'imageUrl'] // Chỉ lấy id và link ảnh cho gọn
                }
            ]
        });
        if (product) {
            res.status(200).send(product);
        } else {
            res.status(404).send({ message: "Không tìm thấy sản phẩm." });
        }
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

// Tạo sản phẩm mới (chỉ Admin)
exports.createProduct = async (req, res) => {
    const t = await db.sequelize.transaction();
    try {
        const {
            name,
            description,
            price,
            stockQuantity,
            imageUrl,    // Ảnh chính
            subImages,   // Mảng chứa các link ảnh phụ. VD: ["link1.jpg", "link2.jpg"]
            sku,
            dimensions,
            material,
            categoryId
        } = req.body;

        // Chuẩn hóa đường dẫn ảnh về dạng "/upload/ten-anh.jpg"
        let normalizedImageUrl = imageUrl || '';
        if (normalizedImageUrl && !normalizedImageUrl.startsWith('/upload/')) {
            // Logic này tùy thuộc vào cách Frontend gửi lên, giữ nguyên logic cũ của bạn nếu cần
            // Hoặc nếu bạn gửi full path thì có thể bỏ qua bước check này
        }

        // 1. Tạo Sản phẩm chính
        const product = await Product.create({
            name,
            description,
            price: Number(price),
            stockQuantity: Number(stockQuantity) || 0,
            imageUrl: normalizedImageUrl,
            sku: sku || null,
            dimensions: dimensions || null,
            material: material || null,
            categoryId: categoryId ? Number(categoryId) : null
        }, { transaction: t });
        // 2. Lưu danh sách ảnh phụ (nếu có)
        if (subImages && Array.isArray(subImages) && subImages.length > 0) {
            const imageRecords = subImages.map(imgUrl => ({
                productId: product.id,
                imageUrl: imgUrl
            }));

            // Dùng bulkCreate để thêm nhiều dòng cùng lúc cho nhanh
            await db.ProductImage.bulkCreate(imageRecords, { transaction: t });
        }

        // Nếu mọi thứ OK, lưu vào DB
        await t.commit();
        // Trả về kết quả
        res.status(201).send({
            message: "Tạo sản phẩm thành công!",
            data: product
        });

    } catch (error) {
        // Nếu có lỗi, hủy bỏ mọi thao tác
        await t.rollback();
        res.status(500).send({ message: "Lỗi khi tạo sản phẩm: " + error.message });
    }
};

exports.updateProduct = async (req, res) => {
    const id = req.params.id;
    const t = await db.sequelize.transaction();

    try {
        const product = await Product.findByPk(id);

        if (product) {
            const {
                name,
                description,
                price,
                stockQuantity,
                imageUrl,
                subImages,   // Mảng ảnh phụ mới
                sku,
                dimensions,
                material,
                categoryId
            } = req.body;

            let normalizedImageUrl = imageUrl;
            if (typeof imageUrl === 'string' && imageUrl.length > 0) {
                const parts = imageUrl.split('/');
                const filename = parts[parts.length - 1];
                normalizedImageUrl = `/upload/${filename}`;
            }

            // 1. Cập nhật thông tin sản phẩm
            await product.update({
                name,
                description,
                price: price !== undefined ? Number(price) : product.price,
                stockQuantity: stockQuantity !== undefined ? Number(stockQuantity) : product.stockQuantity,
                imageUrl: normalizedImageUrl !== undefined ? normalizedImageUrl : product.imageUrl,
                sku: sku !== undefined ? sku : product.sku,
                dimensions: dimensions !== undefined ? dimensions : product.dimensions,
                material: material !== undefined ? material : product.material,
                categoryId: categoryId !== undefined ? (categoryId ? Number(categoryId) : null) : product.categoryId
            }, { transaction: t });

            // 2. Xử lý ảnh phụ (chỉ khi có subImages trong request)
            if (subImages !== undefined && Array.isArray(subImages)) {
                // Xóa tất cả ảnh phụ cũ
                await db.ProductImage.destroy({
                    where: { productId: id },
                    transaction: t
                });

                // Thêm ảnh phụ mới (chỉ những ảnh không rỗng)
                if (subImages.length > 0) {
                    const validImages = subImages.filter(url => url && url.trim() !== '');
                    if (validImages.length > 0) {
                        const imageRecords = validImages.map(imgUrl => ({
                            productId: product.id,
                            imageUrl: imgUrl
                        }));
                        await db.ProductImage.bulkCreate(imageRecords, { transaction: t });
                    }
                }
            }

            await t.commit();

            res.status(200).send({
                message: "Cập nhật sản phẩm thành công.",
                data: product
            });
        } else {
            await t.rollback();
            res.status(404).send({
                message: `Không tìm thấy sản phẩm với id=${id}.`
            });
        }
    } catch (error) {
        await t.rollback();
        res.status(500).send({ message: "Lỗi khi cập nhật sản phẩm: " + error.message });
    }
};

exports.deleteProduct = async (req, res) => {
    // Lấy id của sản phẩm từ URL
    const id = req.params.id;
    try {
        // Dùng hàm destroy của Sequelize để xóa sản phẩm
        // Hàm này sẽ xóa tất cả các bản ghi khớp với điều kiện trong 'where'
        const num = await Product.destroy({
            where: { id: id }
        });

        // Hàm destroy trả về số lượng bản ghi đã được xóa.
        // Nếu số lượng là 1, có nghĩa là đã xóa thành công.
        if (num == 1) {
            res.status(200).send({
                message: "Xóa sản phẩm thành công!"
            });
        } else {
            // Nếu số lượng là 0, tức là không tìm thấy sản phẩm để xóa.
            res.status(404).send({
                message: `Không tìm thấy sản phẩm với id=${id} để xóa.`
            });
        }
    } catch (error) {
        res.status(500).send({ message: "Lỗi khi xóa sản phẩm: " + error.message });
    }
};