const db = require('../models');
const Category = db.Category;

// Chức năng: Lấy tất cả danh mục (dùng cho cả User và Admin).
exports.getAllCategories = async (req, res) => {
    try {
        const categories = await db.Category.findAll({
            include: [{
                model: db.Product,
                as: 'products',
                attributes: ['id']
            }]
        });
        
        // Format data để trả về
        const formattedCategories = categories.map(category => ({
            id: category.id,
            name: category.name,
            description: category.description,
            productCount: category.products ? category.products.length : 0,
            createdAt: category.createdAt,
            updatedAt: category.updatedAt
        }));
        
        res.status(200).send(formattedCategories);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};


// <-- THÊM MỚI: Hàm để Admin tạo một danh mục mới.
exports.createCategory = async (req, res) => {
    try {
        // Lấy thông tin từ body request (gửi lên từ form của Admin)
        const { name, description } = req.body; // Bỏ imageUrl ra khỏi đây

        // Kiểm tra xem tên danh mục đã được cung cấp chưa
        if (!name) {
            return res.status(400).send({ message: "Tên danh mục không được để trống." });
        }

        // Tạo danh mục mới trong database
        const category = await Category.create({
            name,
            description
            // Bỏ imageUrl ra khỏi đây
        });

        res.status(201).send({ message: "Tạo danh mục thành công!", data: category });
    } catch (error) {
        // Bắt lỗi nếu tên danh mục bị trùng (do constraint UNIQUE trong DB)
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).send({ message: "Tên danh mục này đã tồn tại." });
        }
        res.status(500).send({ message: "Lỗi khi tạo danh mục: " + error.message });
    }
};

// <-- THÊM MỚI: Hàm để Admin cập nhật (sửa) một danh mục.
exports.updateCategory = async (req, res) => {
    const id = req.params.id; // Lấy ID từ URL
    try {
        const category = await Category.findByPk(id);
        if (category) {
            // Chỉ cho phép cập nhật 'name' và 'description' để đảm bảo an toàn
            const { name, description } = req.body;
            await category.update({ name, description });
            res.status(200).send({ message: "Cập nhật danh mục thành công.", data: category });
        } else {
            res.status(404).send({ message: `Không tìm thấy danh mục với id=${id}.` });
        }
    } catch (error) {
        res.status(500).send({ message: "Lỗi khi cập nhật danh mục: " + error.message });
    }
};

// <-- THÊM MỚI: Hàm để Admin xóa một danh mục.
exports.deleteCategory = async (req, res) => {
    const id = req.params.id; // Lấy ID từ URL
    try {
        const num = await Category.destroy({
            where: { id: id }
        });

        if (num == 1) {
            res.status(200).send({ message: "Xóa danh mục thành công!" });
        } else {
            res.status(404).send({ message: `Không tìm thấy danh mục với id=${id} để xóa.` });
        }
    } catch (error) {
        res.status(500).send({ message: "Lỗi khi xóa danh mục: " + error.message });
    }
};