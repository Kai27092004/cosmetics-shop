const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    logging: false,

    // Đảm bảo kết nối MySQL luôn dùng UTF-8 đầy đủ (hỗ trợ tiếng Việt, emoji, ...)
    dialectOptions: {
      charset: 'utf8mb4',
      // SSL chỉ bật ở production nếu cần
      ...(process.env.NODE_ENV === 'production'
        ? {
            ssl: {
              require: true,
              rejectUnauthorized: false,
            },
          }
        : {}),
    },

    // Mặc định cho tất cả table/model tạo bằng Sequelize
    define: {
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci',
    },
  }
);

module.exports = sequelize;