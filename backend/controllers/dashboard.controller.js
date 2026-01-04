const { User, Product, Order, OrderItem, Category, sequelize } = require('../models');
const { Op } = require('sequelize');

// Lấy thống kê tổng quan
const getDashboardStats = async (req, res) => {
    try {
        // Đếm tổng số người dùng
        const totalUsers = await User.count();
        
        // Đếm tổng số sản phẩm
        const totalProducts = await Product.count();
        
        // Đếm tổng số đơn hàng
        const totalOrders = await Order.count();
        
        // Tính tổng doanh thu
        const revenueResult = await Order.findOne({
            attributes: [
                [Order.sequelize.fn('SUM', Order.sequelize.col('totalAmount')), 'totalRevenue']
            ],
            where: {
                status: ['delivered', 'shipped', 'processing']
            }
        });
        
        const totalRevenue = revenueResult ? parseFloat(revenueResult.dataValues.totalRevenue) || 0 : 0;

        res.json({
            success: true,
            data: {
                totalUsers,
                totalProducts,
                totalOrders,
                totalRevenue
            }
        });
    } catch (error) {
        console.error('Error getting dashboard stats:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy thống kê dashboard',
            error: error.message
        });
    }
};

// Lấy dữ liệu biểu đồ doanh thu theo tháng
const getRevenueChartData = async (req, res) => {
    try {
        const { year = 2025 } = req.query;
        
        // Tạo dữ liệu mẫu cho 12 tháng
        const months = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'];
        const chartData = [];
        
        for (let i = 0; i < 12; i++) {
            const month = i + 1;
            const startDate = new Date(year, month - 1, 1);
            const endDate = new Date(year, month, 0);
            
            // Lấy doanh thu thực tế từ database
            const revenueResult = await Order.findOne({
                attributes: [
                    [Order.sequelize.fn('SUM', Order.sequelize.col('totalAmount')), 'revenue']
                ],
                where: {
                    status: ['delivered', 'shipped', 'processing'],
                    createdAt: {
                        [Op.between]: [startDate, endDate]
                    }
                }
            });
            
            const revenue = revenueResult ? parseFloat(revenueResult.dataValues.revenue) || 0 : 0;
            
            // Tính tăng trưởng (so với tháng trước)
            let growth = 0;
            if (i > 0) {
                const prevRevenue = chartData[i - 1].revenue;
                if (prevRevenue > 0) {
                    growth = ((revenue - prevRevenue) / prevRevenue) * 100;
                }
            }
            
            chartData.push({
                month: months[i],
                revenue: Math.round(revenue),
                growth: Math.round(growth)
            });
        }
        
        res.json({
            success: true,
            data: chartData
        });
    } catch (error) {
        console.error('Error getting revenue chart data:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy dữ liệu biểu đồ doanh thu',
            error: error.message
        });
    }
};

// Lấy dữ liệu biểu đồ đơn hàng theo tháng
const getOrderChartData = async (req, res) => {
    try {
        const { year = 2025 } = req.query;
        
        // Tạo dữ liệu mẫu cho các tháng chẵn
        const months = ['Tháng 2', 'Tháng 4', 'Tháng 6', 'Tháng 8', 'Tháng 10', 'Tháng 12'];
        const chartData = [];
        
        for (let i = 0; i < 6; i++) {
            const month = (i + 1) * 2; // 2, 4, 6, 8, 10, 12
            const startDate = new Date(year, month - 1, 1);
            const endDate = new Date(year, month, 0);
            
            // Đếm số đơn hàng thực tế từ database
            const orderCount = await Order.count({
                where: {
                    createdAt: {
                        [Op.between]: [startDate, endDate]
                    }
                }
            });
            
            chartData.push({
                month: months[i],
                orders: orderCount
            });
        }
        
        res.json({
            success: true,
            data: chartData
        });
    } catch (error) {
        console.error('Error getting order chart data:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy dữ liệu biểu đồ đơn hàng',
            error: error.message
        });
    }
};

module.exports = {
    getDashboardStats,
    getRevenueChartData,
    getOrderChartData
};
