module.exports = (sequelize, DataTypes) => {
    const EmailTemplate = sequelize.define('EmailTemplate', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true
        },
        subject: {
            type: DataTypes.STRING(500),
            allowNull: false
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    }, {
        tableName: 'emailtemplates', // SỬA: chữ thường, viết liền
        timestamps: true
    });

    return EmailTemplate;
};