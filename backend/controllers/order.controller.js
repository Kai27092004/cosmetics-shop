const db = require('../models');

// --- HÀM 1: TẠO ĐƠN HÀNG MỚI ---
exports.createOrder = async (req, res) => {
    const userId = req.userId; // Lấy từ middleware xác thực
    const { cartItems, shippingAddress, customerNotes } = req.body;

    // Bắt đầu một transaction để đảm bảo toàn vẹn dữ liệu
    const t = await db.sequelize.transaction();

    try {
        // BƯỚC 1: TÍNH TỔNG TIỀN Ở SERVER ĐỂ ĐẢM BẢO AN TOÀN
        let totalAmount = 0;
        const productIds = cartItems.map(item => item.id);
        const products = await db.Product.findAll({ where: { id: productIds } });
        
        for (const cartItem of cartItems) {
            const product = products.find(p => p.id === cartItem.id);
            if (!product) {
                throw new Error(`Sản phẩm với ID ${cartItem.id} không tồn tại.`);
            }
            if (product.stockQuantity < cartItem.quantity) {
                throw new Error(`Không đủ số lượng cho sản phẩm: ${product.name}. Chỉ còn ${product.stockQuantity} sản phẩm.`);
            }
            totalAmount += product.price * cartItem.quantity;
        }

        // BƯỚC 2: TẠO ĐƠN HÀNG (ORDER)
        const order = await db.Order.create({
            userId,
            totalAmount,
            shippingAddress,
            customerNotes // Thêm ghi chú của khách hàng
        }, { transaction: t });

        // BƯỚC 3: TẠO CHI TIẾT ĐƠN HÀNG (ORDER ITEMS) VÀ CẬP NHẬT KHO
        for (const cartItem of cartItems) {
            const product = products.find(p => p.id === cartItem.id);
            // Tạo chi tiết đơn hàng
            await db.OrderItem.create({
                orderId: order.id,
                productId: product.id,
                quantity: cartItem.quantity,
                price: product.price // Lấy giá từ database, không tin tưởng giá từ client
            }, { transaction: t });

            // Cập nhật số lượng tồn kho
            product.stockQuantity -= cartItem.quantity;
            await product.save({ transaction: t });
        }

        // Nếu mọi thứ thành công, commit transaction
        await t.commit();
        
        res.status(201).send({ 
            message: "Đặt hàng thành công!", 
            orderId: order.id,
            totalAmount: order.totalAmount
        });

    } catch (error) {
        // Nếu có lỗi, rollback tất cả thay đổi trong transaction
        await t.rollback();
        res.status(500).send({ message: "Đặt hàng thất bại: " + error.message });
    }
};

// --- HÀM 2: HỦY ĐƠN HÀNG (USER TỰ HỦY) ---
exports.cancelOrder = async (req, res) => {
    const userId = req.userId; 
    const { orderId } = req.params;
    const t = await db.sequelize.transaction();

    try {
        const order = await db.Order.findOne({
            where: {
                id: orderId,
                userId: userId,
                status: 'pending'
            },
            include: [{ model: db.OrderItem, as: 'items' }],
            transaction: t
        });

        if (!order) {
            await t.rollback();
            return res.status(404).send({ message: "Không tìm thấy đơn hàng hoặc đơn hàng không thể hủy." });
        }

        order.status = 'cancelled';
        await order.save({ transaction: t });

        for (const item of order.items) {
            await db.Product.increment('stockQuantity', {
                by: item.quantity,
                where: { id: item.productId },
                transaction: t
            });
        }

        await t.commit();
        res.status(200).send({ message: "Hủy đơn hàng thành công." });

    } catch (error) {
        await t.rollback();
        res.status(500).send({ message: "Lỗi khi hủy đơn hàng: " + error.message });
    }
};


// --- HÀM 3: CẬP NHẬT TRẠNG THÁI ĐƠN HÀNG (USER) ---
exports.updateOrderStatus = async (req, res) => {
    const userId = req.userId;
    const { orderId } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
        return res.status(400).send({ message: "Trạng thái không hợp lệ." });
    }

    try {
        const order = await db.Order.findOne({
            where: {
                id: orderId,
                userId: userId,
            }
        });

        if (!order) {
            return res.status(404).send({ message: "Không tìm thấy đơn hàng." });
        }
        
        order.status = status;
        await order.save();

        res.status(200).send({ message: `Cập nhật trạng thái đơn hàng thành công.`, order });

    } catch (error) {
        res.status(500).send({ message: "Lỗi khi cập nhật trạng thái đơn hàng: " + error.message });
    }
};

// --- HÀM 4: [ADMIN] LẤY TẤT CẢ ĐƠN HÀNG ---
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await db.Order.findAll({
            order: [['createdAt', 'DESC']],
            include: [{ model: db.User, as: 'user', attributes: ['id', 'fullName', 'email'] }]
        });
        res.status(200).send(orders);
    } catch (error) {
        res.status(500).send({ message: "Lỗi khi lấy danh sách đơn hàng: " + error.message });
    }
};

// --- HÀM 5: [ADMIN] CẬP NHẬT TRẠNG THÁI ĐƠN HÀNG ---
exports.adminUpdateOrderStatus = async (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!status || !validStatuses.includes(status)) {
        return res.status(400).send({ message: "Trạng thái không hợp lệ." });
    }

    const t = await db.sequelize.transaction();

    try {
        const order = await db.Order.findByPk(orderId, {
            include: [{ model: db.OrderItem, as: 'items' }],
            transaction: t
        });

        if (!order) {
            await t.rollback();
            return res.status(404).send({ message: "Không tìm thấy đơn hàng." });
        }

        if (order.status !== 'cancelled' && status === 'cancelled') {
            for (const item of order.items) {
                if (item.productId) {
                    await db.Product.increment('stockQuantity', {
                        by: item.quantity,
                        where: { id: item.productId },
                        transaction: t
                    });
                }
            }
        }

        order.status = status;
        await order.save({ transaction: t });

        await t.commit();
        
        const updatedOrder = await db.Order.findByPk(orderId, {
            include: [{ model: db.User, as: 'user', attributes: ['id', 'fullName', 'email'] }]
        });

        res.status(200).send({ message: `Cập nhật trạng thái đơn hàng thành công.`, order: updatedOrder });

    } catch (error) {
        await t.rollback();
        res.status(500).send({ message: "Lỗi khi cập nhật trạng thái đơn hàng: " + error.message });
    }
};

// --- HÀM 6: [ADMIN] LẤY CHI TIẾT MỘT ĐƠN HÀNG ---
exports.getAdminOrderDetails = async (req, res) => {
    try {
        const { orderId } = req.params;

        const order = await db.Order.findByPk(orderId, {
            include: [
                {
                    model: db.User,
                    as: 'user',
                    attributes: ['id', 'fullName', 'email', 'phone', 'address']
                },
                {
                    model: db.OrderItem,
                    as: 'items',
                    include: [{
                        model: db.Product,
                        as: 'product',
                        attributes: ['id', 'name', 'imageUrl']
                    }]
                }
            ]
        });

        if (!order) {
            return res.status(404).send({ message: 'Không tìm thấy đơn hàng.' });
        }

        res.status(200).send(order);
    } catch (error) {
        res.status(500).send({ message: 'Lỗi khi lấy chi tiết đơn hàng: ' + error.message });
    }
};

// --- HÀM 7: [ADMIN] XÓA ĐƠN HÀNG (CHỈ KHI ĐÃ HỦY) ---
exports.adminDeleteOrder = async (req, res) => {
    const { orderId } = req.params;

    const t = await db.sequelize.transaction();

    try {
        const order = await db.Order.findByPk(orderId, {
            include: [{ model: db.OrderItem, as: 'items' }],
            transaction: t
        });

        if (!order) {
            await t.rollback();
            return res.status(404).send({ message: 'Không tìm thấy đơn hàng.' });
        }

        let cancelledDuringDelete = false;

        // Nếu đơn chưa ở trạng thái cancelled, tự động hủy và hoàn kho trước khi xóa
        if (order.status !== 'cancelled') {
            for (const item of order.items) {
                if (item.productId) {
                    await db.Product.increment('stockQuantity', {
                        by: item.quantity,
                        where: { id: item.productId },
                        transaction: t
                    });
                }
            }
            order.status = 'cancelled';
            await order.save({ transaction: t });
            cancelledDuringDelete = true;
        }

        await order.destroy({ transaction: t });

        await t.commit();

        return res.status(200).send({ 
            message: 'Xóa đơn hàng thành công.',
            cancelledDuringDelete
        });
    } catch (error) {
        await t.rollback();
        return res.status(500).send({ message: 'Lỗi khi xóa đơn hàng: ' + error.message });
    }
};

// Public (authenticated) endpoint to get order status only (for frontend polling)
exports.getOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const userId = req.userId;

        const order = await db.Order.findOne({
            where: {
                id: orderId,
                userId: userId
            },
            attributes: ['id', 'status', 'totalAmount', 'updatedAt']
        });

        if (!order) {
            return res.status(404).send({ message: 'Order not found' });
        }

        return res.status(200).send({ order });
    } catch (err) {
        console.error('Error fetching order status', err);
        return res.status(500).send({ message: 'Server error' });
    }
};