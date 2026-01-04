const db = require('../models');
const Order = db.Order;

exports.handleSepay = async (req, res) => {
    try {
        console.log('--- SEPAY WEBHOOK RECEIVED ---');
        
        // --- PHẦN 1: KIỂM TRA BẢO MẬT (API KEY) ---
        // (Khớp với cấu hình bạn vừa làm trên SePay và file .env)
        const authorizationHeader = req.headers['authorization']; 
        const myApiKey = process.env.SEPAY_API_KEY;

        // Nếu SePay gửi key không khớp với key trong .env thì chặn luôn
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

        // --- PHẦN 3: TÌM MÃ ĐƠN HÀNG (Logic thông minh của bạn) ---
        let orderId = null;

        // Ưu tiên 1: Tìm chữ "DH" + số (Ví dụ: DH109)
        const matchDH = content.match(/DH(\d+)/i);
        if (matchDH) {
            orderId = parseInt(matchDH[1], 10);
        } 
        // Ưu tiên 2: Lấy số cuối cùng tìm thấy (Ví dụ: "thanh toan 109")
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

        // Kiểm tra số tiền (Cho phép sai số nhỏ hoặc bỏ qua nếu muốn)
        const transferAmount = parseFloat(payload.transferAmount || 0);
        const orderAmount = parseFloat(order.totalAmount);
        
        if (transferAmount < orderAmount) {
             console.warn(`⚠️ Chuyển thiếu tiền. Đã chuyển: ${transferAmount}, Cần: ${orderAmount}`);
             // Tùy bạn: có thể return luôn hoặc vẫn cho update
        }

        // Chỉ update nếu đơn hàng chưa hoàn thành
        if (order.status === 'pending' || order.status === 'cancelled') {
            order.status = 'processing'; // Đã thanh toán
            await order.save();
            console.log(`🎉 Đã cập nhật đơn hàng #${orderId} thành công!`);
        }

        return res.status(200).json({ success: true, message: "Order updated" });

    } catch (error) {
        console.error("🔥 Webhook Error:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};