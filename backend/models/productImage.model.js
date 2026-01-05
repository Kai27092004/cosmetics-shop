module.exports = (sequelize, DataTypes) => {
    const ProductImage = sequelize.define('ProductImage', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        productId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        imageUrl: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        tableName: 'productimages', // Phải khớp với tên bảng trong SQL
        timestamps: true // Vì trong SQL bạn có để createdAt, updatedAt
    });

    ProductImage.associate = (models) => {
        // Một ảnh phụ thuộc về một sản phẩm
        ProductImage.belongsTo(models.Product, {
            foreignKey: 'productId',
            as: 'product'
        });
    };

    return ProductImage;
};