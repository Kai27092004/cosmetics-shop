const db = require('../models');
const User = db.User;
const Order = db.Order;
const OrderItem = db.OrderItem;
const Product = db.Product;

// Chức năng: Lấy thông tin hồ sơ của người dùng đang đăng nhập.
exports.getProfile = async (req, res) => {
    try {
        // req.userId được lấy từ token sau khi đi qua middleware `isAuthenticated`.
        const user = await User.findByPk(req.userId, {
            // Luôn luôn không trả về mật khẩu để đảm bảo an toàn.
            attributes: { exclude: ['password'] }
        });

        if (!user) {
            return res.status(404).send({ message: "Không tìm thấy người dùng." });
        }
        res.status(200).send(user);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

// Chức năng: Lấy lịch sử đơn hàng của người dùng đang đăng nhập.
exports.getMyOrders = async (req, res) => {
    try {
        const orders = await Order.findAll({
            // Lọc các đơn hàng chỉ thuộc về user này.
            where: { userId: req.userId },
            // Sắp xếp đơn hàng mới nhất lên đầu.
            order: [['createdAt', 'DESC']],
            // Lấy kèm dữ liệu từ các bảng liên quan để hiển thị chi tiết.
            include: [{
                model: OrderItem,
                as: 'items', // Bao gồm các sản phẩm trong đơn hàng.
                include: [{
                    model: Product,
                    as: 'product', // Trong mỗi sản phẩm, lấy thông tin cơ bản.
                    attributes: ['id', 'name', 'imageUrl']
                }]
            }]
        });
        res.status(200).send(orders);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

// Chức năng: [ADMIN] Lấy thống kê tổng quan về người dùng
exports.getUserStats = async (req, res) => {
    try {
        const totalUsers = await User.count();
        const adminUsers = await User.count({ where: { role: 'admin' } });
        const customerUsers = await User.count({ where: { role: 'customer' } });

        res.status(200).send({
            totalUsers,
            adminUsers,
            customerUsers
        });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

// Chức năng: [ADMIN] Lấy danh sách tất cả người dùng trong hệ thống với thống kê đơn hàng.
exports.getAllUsers = async (req, res) => {
    try {
        const { search, role } = req.query;
        
        // Tạo điều kiện where
        let whereClause = {};
        if (search) {
            whereClause = {
                [db.Sequelize.Op.or]: [
                    { fullName: { [db.Sequelize.Op.like]: `%${search}%` } },
                    { email: { [db.Sequelize.Op.like]: `%${search}%` } }
                ]
            };
        }
        if (role && role !== 'all') {
            whereClause.role = role;
        }

        const users = await User.findAll({
            where: whereClause,
            order: [['id', 'ASC']],
            attributes: { exclude: ['password'] },
            include: [{
                model: Order,
                as: 'orders',
                attributes: ['id', 'totalAmount', 'status'],
                required: false
            }]
        });

        // Tính toán thống kê cho mỗi user
        const usersWithStats = users.map(user => {
            const orders = user.orders || [];
            const totalOrders = orders.length;
            const totalSpent = orders.reduce((sum, order) => sum + parseFloat(order.totalAmount || 0), 0);
            
            return {
                ...user.toJSON(),
                stats: {
                    totalOrders,
                    totalSpent
                }
            };
        });

        res.status(200).send(usersWithStats);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

// Chức năng: [ADMIN] Tạo người dùng mới
exports.createUser = async (req, res) => {
    try {
        const { fullName, email, password, phone, address, role } = req.body;
        
        // Kiểm tra email đã tồn tại chưa
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).send({ message: "Email đã tồn tại trong hệ thống" });
        }

        // Tạo user mới
        const newUser = await User.create({
            fullName,
            email,
            password, // Password sẽ được hash trong model
            phone,
            address,
            role: role || 'customer'
        });

        // Trả về user không có password
        const userResponse = await User.findByPk(newUser.id, {
            attributes: { exclude: ['password'] }
        });

        res.status(201).send(userResponse);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

// Chức năng: [ADMIN] Cập nhật thông tin người dùng
exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { fullName, email, phone, address, role } = req.body;

        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).send({ message: "Không tìm thấy người dùng" });
        }

        // Kiểm tra email trùng lặp (nếu thay đổi email)
        if (email && email !== user.email) {
            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                return res.status(400).send({ message: "Email đã tồn tại trong hệ thống" });
            }
        }

        // Cập nhật thông tin
        await user.update({
            fullName: fullName || user.fullName,
            email: email || user.email,
            phone: phone || user.phone,
            address: address || user.address,
            role: role || user.role
        });

        // Trả về user đã cập nhật
        const updatedUser = await User.findByPk(id, {
            attributes: { exclude: ['password'] }
        });

        res.status(200).send(updatedUser);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

// Chức năng: [ADMIN] Xóa người dùng
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).send({ message: "Không tìm thấy người dùng" });
        }

        // Không cho phép xóa admin cuối cùng
        if (user.role === 'admin') {
            const adminCount = await User.count({ where: { role: 'admin' } });
            if (adminCount <= 1) {
                return res.status(400).send({ message: "Không thể xóa admin cuối cùng trong hệ thống" });
            }
        }

        await user.destroy();
        res.status(200).send({ message: "Xóa người dùng thành công" });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};