module.exports = (sequelize, DataTypes) => {
    const OrderItem = sequelize.define('OrderItem', {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        orderId: { type: DataTypes.INTEGER, allowNull: false },
        productId: { type: DataTypes.INTEGER, allowNull: true },
        quantity: { type: DataTypes.INTEGER, allowNull: false },
        price: { type: DataTypes.DECIMAL(10, 2), allowNull: false }
    }, {
        tableName: 'orderitems', // SỬA: chữ thường, viết liền (khớp với Aiven)
        timestamps: false
    });

    OrderItem.associate = (models) => {
        OrderItem.belongsTo(models.Order, {
            foreignKey: 'orderId',
            as: 'order'
        });
        OrderItem.belongsTo(models.Product, {
            foreignKey: 'productId',
            as: 'product'
        });
    };

    return OrderItem;
};