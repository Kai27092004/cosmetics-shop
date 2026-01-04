module.exports = (sequelize, DataTypes) => {
    const Category = sequelize.define('Category', {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        name: { type: DataTypes.STRING, allowNull: false, unique: true },
        description: { type: DataTypes.TEXT, allowNull: true }
    }, {
        tableName: 'categories', // SỬA LẠI: Dùng chữ thường để khớp với database
        timestamps: true
    });

    Category.associate = (models) => {
        // Một Category có thể có nhiều Product
        Category.hasMany(models.Product, {
            foreignKey: 'categoryId',
            as: 'products'
        });
    };

    return Category;
};