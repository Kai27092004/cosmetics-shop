module.exports = (sequelize, DataTypes) => {
    const Order = sequelize.define('Order', {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        userId: { type: DataTypes.INTEGER, allowNull: false },
        totalAmount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
        status: {
            type: DataTypes.ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled'),
            allowNull: false,
            defaultValue: 'pending'
        },
                // ✅ THÊM
        paymentMethod: {
        type: DataTypes.ENUM('COD', 'QRCODE'),
        defaultValue: 'COD',
        allowNull: false,
        },
        // ✅ THÊM
        paymentStatus: {
        type: DataTypes.ENUM('unpaid', 'paid'),
        defaultValue: 'unpaid',
        allowNull: false,
        },
        // ✅ THÊM THÔNG TIN LIÊN HỆ
        phone: {
        type: DataTypes.STRING(20),
        allowNull: false,
        },
        fullName: {
        type: DataTypes.STRING(100),
        allowNull: false,
        },
        shippingAddress: { type: DataTypes.TEXT, allowNull: false },
        customerNotes: { type: DataTypes.TEXT, allowNull: true }
    }, {
        tableName: 'orders', // SỬA: chữ thường
        timestamps: true
    });

    Order.associate = (models) => {
        Order.belongsTo(models.User, {
            foreignKey: 'userId',
            as: 'user'
        });
        Order.hasMany(models.OrderItem, {
            foreignKey: 'orderId',
            as: 'orderItems'
        });
    };

    return Order;
};