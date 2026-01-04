const controller = require("../controllers/webhook.controller"); // Trỏ đúng vào file bạn vừa tạo

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    // Đường dẫn này phải khớp với cái bạn điền trên trang SePay
    app.post("/api/payment/sepay-webhook", controller.handleSepay);
};