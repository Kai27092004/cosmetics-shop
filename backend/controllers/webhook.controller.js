const db = require('../models');
const Order = db.Order;
// 1. THÊM MỚI: Import hàm lấy IO từ file socket cấu hình
const { getIO } = require('../socket'); // <--- THÊM MỚI

exports.handleSepay = async (req, res) => {
    try {
        console.log('--- SEPAY WEBHOOK RECEIVED ---');
        
        // --- PHẦN 1: KIỂM TRA BẢO MẬT (API KEY) ---
        const authorizationHeader = req.headers['authorization']; 
        const myApiKey = process.env.SEPAY_API_KEY;

        if (!authorizationHeader || !authorizationHeader.includes(myApiKey)) {
            console.warn("⛔ Lỗi bảo mật: API Key không khớp!");
            return res.status(401).json({ success: false, message: "Unauthorized: Invalid API Key" });
        }

        // --- PHẦN 2: XỬ LÝ DỮ LIỆU ---
        const payload = req.body || {};
        const content = payload.content || payload.description || '';
        console.log('Nội dung chuyển khoản:', content);

        if (!content) {
             return res.status(200).json({ success: true, message: "No content" });
        }

        // --- PHẦN 3: TÌM MÃ ĐƠN HÀNG ---
        let orderId = null;

        // Ưu tiên 1: Tìm chữ "DH" + số
        const matchDH = content.match(/DH(\d+)/i);
        if (matchDH) {
            orderId = parseInt(matchDH[1], 10);
        } 
        // Ưu tiên 2: Lấy số cuối cùng
        else {
            const matches = content.match(/\d+/g); 
            if (matches && matches.length > 0) {
                orderId = parseInt(matches[matches.length - 1], 10);
            }
        }

        if (!orderId) {
            console.warn('❌ Không tìm thấy mã đơn trong nội dung');
            return res.status(200).json({ success: true });
        }

        console.log(`✅ Tìm thấy Order ID: ${orderId}`);

        // --- PHẦN 4: CẬP NHẬT DATABASE ---
        const order = await Order.findByPk(orderId);

        if (!order) {
            console.warn(`❌ Không tìm thấy đơn hàng #${orderId} trong DB`);
            return res.status(200).json({ success: true });
        }

        // Kiểm tra số tiền
        const transferAmount = parseFloat(payload.transferAmount || 0);
        const orderAmount = parseFloat(order.totalAmount);
        
        if (transferAmount < orderAmount) {
             console.warn(`⚠️ Chuyển thiếu tiền. Đã chuyển: ${transferAmount}, Cần: ${orderAmount}`);
        }

        // Chỉ update nếu đơn hàng chưa hoàn thành
        if (order.status === 'pending' || order.status === 'cancelled') {
            order.status = 'processing'; // Chuyển trạng thái sang Đang xử lý
            order.paymentStatus = 'paid'; // <--- THÊM MỚI: Cập nhật luôn trạng thái thanh toán
            await order.save();
            console.log(`🎉 Đã cập nhật đơn hàng #${orderId} thành công!`);

            // 2. THÊM MỚI: Bắn tín hiệu Socket.IO để Frontend tự cập nhật ---
            try {
                const io = getIO();
                
                // Gửi sự kiện cho chính User đó (Giả sử User đã join room 'user:ID')
                // Nếu chưa cấu hình room, dùng io.emit() sẽ gửi cho tất cả (tạm thời ok để test)
                io.to(`user:${order.userId}`).emit('order:payment_updated', { 
                    orderId: order.id,
                    paymentStatus: 'paid',
                    status: 'processing',
                    message: 'Thanh toán thành công! Đơn hàng đang được xử lý.'
                });

                // Gửi sự kiện cho Admin (để dashboard admin cũng nhảy số)
                io.to('role:admin').emit('order:updated', {
                    orderId: order.id,
                    paymentStatus: 'paid',
                    status: 'processing'
                });
                
                console.log(`📡 Đã gửi socket event cho đơn hàng #${orderId}`);
            } catch (socketError) {
                console.error("⚠️ Lỗi gửi socket:", socketError.message);
            }
            // -------------------------------------------------------------
        }

        return res.status(200).json({ success: true, message: "Order updated" });

    } catch (error) {
        console.error("🔥 Webhook Error:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};