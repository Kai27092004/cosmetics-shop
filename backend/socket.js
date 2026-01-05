const socketIO = require('socket.io');

let io;

/**
 * Khởi tạo Socket.IO
 * @param {http.Server} server - HTTP server từ Express
 */
const initializeSocket = (server) => {
    io = socketIO(server, {
        cors: {
            origin: [
                'http://localhost:5173',
                'https://phatdev.vercel.app',
                'https://main.d3tqdtxbh1bkio. amplifyapp.com',
                'https://phatdev.id.vn',
                'https://www.phatdev.id.vn'
            ],
            credentials: true,
            methods: ['GET', 'POST']
        }
    });

    // Middleware xác thực socket (optional - có thể verify JWT)
    io.use((socket, next) => {
        const token = socket.handshake. auth.token;
        // TODO: Verify JWT token nếu cần bảo mật cao
        next();
    });

    // Xử lý kết nối
    io.on('connection', (socket) => {
        console. log('✅ Client connected:', socket.id);

        // Join room theo userId (để gửi notification cá nhân)
        socket.on('join: user', (userId) => {
            socket.join(`user:${userId}`);
            console.log(`👤 User ${userId} joined personal room`);
        });

        // Join room theo role (admin/customer)
        socket.on('join:role', (role) => {
            socket.join(`role:${role}`);
            console.log(`👥 User joined role room: ${role}`);
        });

        // Join room theo orderId (để track đơn hàng cụ thể)
        socket.on('join:order', (orderId) => {
            socket. join(`order:${orderId}`);
            console.log(`📦 User joined order room: ${orderId}`);
        });

        // Xử lý disconnect
        socket.on('disconnect', () => {
            console.log('❌ Client disconnected:', socket.id);
        });
    });

    return io;
};

/**
 * Lấy instance Socket.IO đã khởi tạo
 * @returns {socketIO. Server}
 */
const getIO = () => {
    if (!io) {
        throw new Error('Socket.io chưa được khởi tạo!  Gọi initializeSocket() trước.');
    }
    return io;
};

module. exports = { initializeSocket, getIO };