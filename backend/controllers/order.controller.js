const db = require('../models');
const { getIO } = require('../socket'); // ✅ THÊM MỚI: Import Socket.IO

// --- HÀM 1: TẠO ĐƠN HÀNG MỚI ---
exports.createOrder = async (req, res) => {
    const userId = req.userId;
    const { cartItems, shippingAddress, customerNotes } = req.body;

    const t = await db.sequelize. transaction();

    try {
        // BƯỚC 1: TÍNH TỔNG TIỀN Ở SERVER
        let totalAmount = 0;
        const productIds = cartItems.map(item => item.productId);
        const products = await db.Product.findAll({ where: { id: productIds } });
        
        for (const cartItem of cartItems) {
            const product = products.find(p => p.id === cartItem.productId);
            if (!product) {
                throw new Error(`Sản phẩm với ID ${cartItem.productId} không tồn tại.`);
            }
            if (product.stockQuantity < cartItem.quantity) {
                throw new Error(`Không đủ số lượng cho sản phẩm: ${product.name}. Chỉ còn ${product.stockQuantity} sản phẩm.`);
            }
            totalAmount += product.price * cartItem.quantity;
        }

        // BƯỚC 2: TẠO ĐƠN HÀNG
        const order = await db.Order.create({
            userId,
            totalAmount,
            shippingAddress,
            customerNotes
        }, { transaction: t });

        // BƯỚC 3: TẠO CHI TIẾT ĐƠN HÀNG VÀ CẬP NHẬT KHO
        for (const cartItem of cartItems) {
            const product = products.find(p => p.id === cartItem.productId);
            
            await db.OrderItem.create({
                orderId: order.id,
                productId: product.id,
                quantity: cartItem.quantity,
                price: product.price
            }, { transaction: t });

            product.stockQuantity -= cartItem.quantity;
            await product.save({ transaction: t });
        }

        await t.commit();

        // ✅ THÊM MỚI: GỬI REALTIME NOTIFICATION
        try {
            const io = getIO();
            
            // Lấy thông tin user để gửi notification
            const user = await db.User.findByPk(userId, {
                attributes: ['id', 'fullName', 'email']
            });

            // Gửi cho tất cả admin
            io.to('role:admin').emit('order:new', {
                orderId: order. id,
                userId,
                userName: user.fullName,
                userEmail: user.email,
                totalAmount:  order.totalAmount,
                itemCount: cartItems.length,
                timestamp: new Date(),
                message: `🛒 Đơn hàng mới #${order.id} từ ${user.fullName}`
            });

            // Gửi cho user vừa đặt hàng
            io. to(`user:${userId}`).emit('order:created', {
                orderId: order.id,
                status: 'pending',
                totalAmount: order.totalAmount,
                message: `✅ Đơn hàng #${order.id} của bạn đã được tạo thành công!`
            });

            console.log(`📡 Realtime notification sent for order #${order.id}`);
        } catch (socketError) {
            console.error('❌ Socket. IO error:', socketError. message);
            // Không throw error để không ảnh hưởng đến việc tạo đơn hàng
        }
        
        res.status(201).send({ 
            message: "Đặt hàng thành công!", 
            orderId: order. id,
            totalAmount: order.totalAmount
        });

    } catch (error) {
        await t.rollback();
        res.status(500).send({ message: "Đặt hàng thất bại:  " + error.message });
    }
};

// --- HÀM 2: HỦY ĐƠN HÀNG (USER TỰ HỦY) ---
exports.cancelOrder = async (req, res) => {
    const userId = req. userId; 
    const { orderId } = req.params;
    const t = await db.sequelize.transaction();

    try {
        const order = await db. Order.findOne({
            where: {
                id: orderId,
                userId: userId,
                status: 'pending'
            },
            include: [{ model: db.OrderItem, as: 'orderItems' }],
            transaction: t
        });

        if (!order) {
            await t.rollback();
            return res.status(404).send({ message: "Không tìm thấy đơn hàng hoặc đơn hàng không thể hủy." });
        }

        order.status = 'cancelled';
        await order.save({ transaction: t });

        for (const item of order.orderItems) {
            await db.Product.increment('stockQuantity', {
                by: item.quantity,
                where: { id: item.productId },
                transaction: t
            });
        }

        await t. commit();

        // ✅ THÊM MỚI: GỬI REALTIME NOTIFICATION
        try {
            const io = getIO();
            
            // Gửi cho admin
            io.to('role:admin').emit('order:cancelled', {
                orderId: order.id,
                userId,
                timestamp: new Date(),
                message:  `❌ Đơn hàng #${order.id} đã bị hủy bởi khách hàng`
            });

            // Gửi cho user
            io. to(`user:${userId}`).emit('order:statusChanged', {
                orderId: order.id,
                status: 'cancelled',
                message: `Đơn hàng #${order.id} đã được hủy thành công`
            });
        } catch (socketError) {
            console.error('❌ Socket.IO error:', socketError. message);
        }

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
        return res. status(400).send({ message: "Trạng thái không hợp lệ." });
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

        res.status(200).send({ message: `Cập nhật trạng thái đơn hàng thành công. `, order });

    } catch (error) {
        res.status(500).send({ message: "Lỗi khi cập nhật trạng thái đơn hàng: " + error.message });
    }
};

// --- HÀM 4: [ADMIN] LẤY TẤT CẢ ĐƠN HÀNG ---
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await db.Order.findAll({
            order: [['createdAt', 'DESC']],
            include: [
                { 
                    model: db.User, 
                    as: 'user', 
                    attributes: ['id', 'fullName', 'email'] 
                },
                {
                    model: db.OrderItem,
                    as: 'orderItems',
                    include: [{
                        model: db.Product,
                        as: 'product',
                        attributes: ['id', 'name', 'imageUrl', 'price']
                    }]
                }
            ]
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
        return res. status(400).send({ message: "Trạng thái không hợp lệ." });
    }

    const t = await db.sequelize. transaction();

    try {
        const order = await db.Order. findByPk(orderId, {
            include: [{ model: db.OrderItem, as: 'orderItems' }],
            transaction: t
        });

        if (!order) {
            await t.rollback();
            return res.status(404).send({ message: "Không tìm thấy đơn hàng." });
        }

        if (order.status !== 'cancelled' && status === 'cancelled') {
            for (const item of order.orderItems) {
                if (item.productId) {
                    await db.Product.increment('stockQuantity', {
                        by: item.quantity,
                        where: { id: item.productId },
                        transaction: t
                    });
                }
            }
        }

        const oldStatus = order.status;
        order.status = status;
        await order.save({ transaction: t });

        await t.commit();
        
        const updatedOrder = await db.Order. findByPk(orderId, {
            include: [{ model: db.User, as: 'user', attributes: ['id', 'fullName', 'email'] }]
        });

        // ✅ THÊM MỚI: GỬI REALTIME NOTIFICATION
        try {
            const io = getIO();

            const statusMessages = {
                pending: 'Chờ xử lý',
                processing: 'Đang xử lý',
                shipped: 'Đang giao hàng',
                delivered: 'Đã giao hàng',
                cancelled: 'Đã hủy'
            };

            // Gửi cho user sở hữu đơn hàng
            io.to(`user:${order.userId}`).emit('order:statusChanged', {
                orderId: order.id,
                oldStatus,
                newStatus: status,
                statusText: statusMessages[status],
                timestamp: new Date(),
                message: `📦 Đơn hàng #${order.id} đã chuyển sang trạng thái:  ${statusMessages[status]}`
            });

            // Gửi cho tất cả admin (để đồng bộ UI)
            io.to('role:admin').emit('order:updated', {
                orderId: order.id,
                status,
                userId: order.userId,
                timestamp: new Date()
            });

            // Gửi cho room tracking đơn hàng cụ thể
            io. to(`order:${orderId}`).emit('order:update', {
                orderId: order.id,
                status,
                statusText: statusMessages[status],
                timestamp: new Date()
            });

            console.log(`📡 Realtime notification sent for order #${order.id} status change:  ${oldStatus} → ${status}`);
        } catch (socketError) {
            console.error('❌ Socket.IO error:', socketError.message);
        }

        res.status(200).send({ message: `Cập nhật trạng thái đơn hàng thành công.`, order: updatedOrder });

    } catch (error) {
        await t.rollback();
        res.status(500).send({ message: "Lỗi khi cập nhật trạng thái đơn hàng:  " + error.message });
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
                    as: 'orderItems',
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

        res. status(200).send(order);
    } catch (error) {
        res.status(500).send({ message: 'Lỗi khi lấy chi tiết đơn hàng: ' + error.message });
    }
};

// --- HÀM 7: [ADMIN] XÓA ĐƠN HÀNG ---
exports.adminDeleteOrder = async (req, res) => {
    const { orderId } = req.params;
    const t = await db.sequelize.transaction();

    try {
        const order = await db.Order.findByPk(orderId, {
            include: [{ model: db.OrderItem, as: 'orderItems' }],
            transaction: t
        });

        if (!order) {
            await t.rollback();
            return res.status(404).send({ message: 'Không tìm thấy đơn hàng.' });
        }

        let cancelledDuringDelete = false;

        if (order.status !== 'cancelled') {
            for (const item of order.orderItems) {
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

        // ✅ THÊM MỚI: GỬI REALTIME NOTIFICATION
        try {
            const io = getIO();
            
            // Gửi cho admin
            io.to('role:admin').emit('order:deleted', {
                orderId:  order.id,
                timestamp: new Date(),
                message: `🗑️ Đơn hàng #${order.id} đã bị xóa`
            });
        } catch (socketError) {
            console.error('❌ Socket.IO error:', socketError. message);
        }

        return res.status(200).send({ 
            message: 'Xóa đơn hàng thành công.',
            cancelledDuringDelete
        });
    } catch (error) {
        await t.rollback();
        return res.status(500).send({ message: 'Lỗi khi xóa đơn hàng: ' + error.message });
    }
};

// --- HÀM 8: LẤY TRẠNG THÁI ĐƠN HÀNG (PUBLIC) ---
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