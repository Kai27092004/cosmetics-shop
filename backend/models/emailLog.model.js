module.exports = (sequelize, DataTypes) => {
    const EmailLog = sequelize.define('EmailLog', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        recipientEmail: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        recipientName: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        subject: {
            type: DataTypes.STRING(500),
            allowNull: false
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM('sent', 'failed'),
            allowNull: false,
            defaultValue: 'sent'
        },
        errorMessage: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        sentBy: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        sentAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }
    }, {
        tableName: 'emaillogs', // SỬA: chữ thường, viết liền
        timestamps: false 
    });

    EmailLog.associate = (models) => {
        EmailLog.belongsTo(models.User, {
            foreignKey: 'userId',
            as: 'recipient'
        });
        EmailLog.belongsTo(models.User, {
            foreignKey: 'sentBy',
            as: 'sender'
        });
    };

    return EmailLog;
};