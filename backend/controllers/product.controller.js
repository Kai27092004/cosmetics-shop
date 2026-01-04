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
            include: [{
                model: Category,
                as: 'category',
                attributes: ['id', 'name'] // Chỉ lấy id và name của category
            }]
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
            include: [{
                model: Category,
                as: 'category'
            }]
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
    try {
        const {
            name,
            description,
            price,
            stockQuantity,
            imageUrl,
            sku,
            dimensions,
            material,
            categoryId
        } = req.body;

        // Chuẩn hóa đường dẫn ảnh về dạng "/upload/ten-anh.jpg"
        let normalizedImageUrl = imageUrl || '';
        if (normalizedImageUrl) {
            const parts = normalizedImageUrl.split('/');
            const filename = parts[parts.length - 1];
            normalizedImageUrl = `/upload/${filename}`;
        }

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
        });
        res.status(201).send(product);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

exports.updateProduct = async (req, res) => {
    // Lấy id của sản phẩm từ URL, ví dụ: /api/products/12
    const id = req.params.id; 
    try {
        // Tìm sản phẩm trong database bằng id (Primary Key)
        const product = await Product.findByPk(id);

        // Nếu tìm thấy sản phẩm
        if (product) {
            // Dùng hàm update của Sequelize để cập nhật sản phẩm với dữ liệu mới
            // Dữ liệu mới được lấy từ body của request
            const {
                name,
                description,
                price,
                stockQuantity,
                imageUrl,
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
            });
            res.status(200).send({ 
                message: "Cập nhật sản phẩm thành công.",
                data: product 
            });
        } else {
            // Nếu không tìm thấy, trả về lỗi 404
            res.status(404).send({ 
                message: `Không tìm thấy sản phẩm với id=${id}.` 
            });
        }
    } catch (error) {
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