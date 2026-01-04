const nodemailer = require('nodemailer');
const db = require('../models');
const EmailTemplate = db.EmailTemplate;
const EmailLog = db.EmailLog;
const User = db.User;

// Cấu hình email transporter
const createTransporter = () => {
    return nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT),
        secure: process.env.EMAIL_SECURE === 'true',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });
};

// Hàm thay thế các biến trong template ({{customerName}}, {{email}}, etc.)
const replaceTemplateVariables = (content, variables) => {
    let result = content;
    Object.keys(variables).forEach(key => {
        const regex = new RegExp(`{{${key}}}`, 'g');
        result = result.replace(regex, variables[key] || '');
    });
    return result;
};

// ==================== EMAIL TEMPLATES ====================

// Lấy tất cả mẫu email
exports.getAllTemplates = async (req, res) => {
    try {
        const templates = await EmailTemplate.findAll({
            order: [['createdAt', 'DESC']]
        });
        res.json(templates);
    } catch (error) {
        console.error('Error fetching email templates:', error);
        res.status(500).json({ message: 'Lỗi khi lấy danh sách mẫu email', error: error.message });
    }
};

// Lấy một mẫu email theo ID
exports.getTemplateById = async (req, res) => {
    try {
        const { id } = req.params;
        const template = await EmailTemplate.findByPk(id);
        
        if (!template) {
            return res.status(404).json({ message: 'Không tìm thấy mẫu email' });
        }
        
        res.json(template);
    } catch (error) {
        console.error('Error fetching email template:', error);
        res.status(500).json({ message: 'Lỗi khi lấy mẫu email', error: error.message });
    }
};

// Tạo mẫu email mới
exports.createTemplate = async (req, res) => {
    try {
        const { name, subject, content, description } = req.body;
        
        // Kiểm tra dữ liệu đầu vào
        if (!name || !subject || !content) {
            return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin (tên, tiêu đề, nội dung)' });
        }
        
        const template = await EmailTemplate.create({
            name,
            subject,
            content,
            description
        });
        
        res.status(201).json({ message: 'Tạo mẫu email thành công', template });
    } catch (error) {
        console.error('Error creating email template:', error);
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ message: 'Tên mẫu email đã tồn tại' });
        }
        res.status(500).json({ message: 'Lỗi khi tạo mẫu email', error: error.message });
    }
};

// Cập nhật mẫu email
exports.updateTemplate = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, subject, content, description } = req.body;
        
        const template = await EmailTemplate.findByPk(id);
        
        if (!template) {
            return res.status(404).json({ message: 'Không tìm thấy mẫu email' });
        }
        
        await template.update({
            name: name || template.name,
            subject: subject || template.subject,
            content: content || template.content,
            description: description !== undefined ? description : template.description
        });
        
        res.json({ message: 'Cập nhật mẫu email thành công', template });
    } catch (error) {
        console.error('Error updating email template:', error);
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ message: 'Tên mẫu email đã tồn tại' });
        }
        res.status(500).json({ message: 'Lỗi khi cập nhật mẫu email', error: error.message });
    }
};

// Xóa mẫu email
exports.deleteTemplate = async (req, res) => {
    try {
        const { id } = req.params;
        const template = await EmailTemplate.findByPk(id);
        
        if (!template) {
            return res.status(404).json({ message: 'Không tìm thấy mẫu email' });
        }
        
        await template.destroy();
        res.json({ message: 'Xóa mẫu email thành công' });
    } catch (error) {
        console.error('Error deleting email template:', error);
        res.status(500).json({ message: 'Lỗi khi xóa mẫu email', error: error.message });
    }
};

// ==================== GỬI EMAIL ====================

// Gửi email cho một hoặc nhiều người nhận
exports.sendEmail = async (req, res) => {
    try {
        const { recipients, subject, content, templateId } = req.body;
        const adminId = req.user.id; // Lấy ID của admin đang đăng nhập
        
        // Kiểm tra dữ liệu đầu vào
        if (!recipients || recipients.length === 0) {
            return res.status(400).json({ message: 'Vui lòng chọn người nhận' });
        }
        
        let emailSubject = subject;
        let emailContent = content;
        
        // Nếu sử dụng template
        if (templateId) {
            const template = await EmailTemplate.findByPk(templateId);
            if (!template) {
                return res.status(404).json({ message: 'Không tìm thấy mẫu email' });
            }
            emailSubject = template.subject;
            emailContent = template.content;
        }
        
        if (!emailSubject || !emailContent) {
            return res.status(400).json({ message: 'Vui lòng nhập tiêu đề và nội dung email' });
        }
        
        const transporter = createTransporter();
        const results = { success: 0, failed: 0, errors: [] };
        
        // Gửi email cho từng người nhận
        for (const recipient of recipients) {
            try {
                // Lấy thông tin người nhận nếu là userId
                let recipientEmail = recipient.email;
                let recipientName = recipient.name;
                let userId = recipient.userId || null;
                
                if (recipient.userId) {
                    const user = await User.findByPk(recipient.userId);
                    if (user) {
                        recipientEmail = user.email;
                        recipientName = user.fullName;
                    }
                }
                
                // Thay thế các biến trong template
                const variables = {
                    customerName: recipientName || 'Khách hàng',
                    email: recipientEmail
                };
                const finalContent = replaceTemplateVariables(emailContent, variables);
                
                // Gửi email
                await transporter.sendMail({
                    from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM_ADDRESS}>`,
                    to: recipientEmail,
                    subject: emailSubject,
                    html: finalContent
                });
                
                // Ghi log thành công
                await EmailLog.create({
                    userId: userId,
                    recipientEmail: recipientEmail,
                    recipientName: recipientName,
                    subject: emailSubject,
                    content: finalContent,
                    status: 'sent',
                    sentBy: adminId
                });
                
                results.success++;
            } catch (error) {
                console.error(`Error sending email to ${recipient.email}:`, error);
                
                // Ghi log thất bại
                await EmailLog.create({
                    userId: recipient.userId || null,
                    recipientEmail: recipient.email,
                    recipientName: recipient.name,
                    subject: emailSubject,
                    content: emailContent,
                    status: 'failed',
                    errorMessage: error.message,
                    sentBy: adminId
                });
                
                results.failed++;
                results.errors.push({
                    email: recipient.email,
                    error: error.message
                });
            }
        }
        
        res.json({
            message: `Đã gửi ${results.success} email thành công, ${results.failed} email thất bại`,
            results
        });
    } catch (error) {
        console.error('Error sending emails:', error);
        res.status(500).json({ message: 'Lỗi khi gửi email', error: error.message });
    }
};

// Gửi email cho tất cả khách hàng
exports.sendEmailToAllCustomers = async (req, res) => {
    try {
        const { subject, content, templateId } = req.body;
        const adminId = req.user.id;
        
        // Lấy tất cả khách hàng
        const customers = await User.findAll({
            where: { role: 'customer' }
        });
        
        if (customers.length === 0) {
            return res.status(404).json({ message: 'Không có khách hàng nào trong hệ thống' });
        }
        
        // Chuyển đổi thành format recipients
        const recipients = customers.map(customer => ({
            userId: customer.id,
            email: customer.email,
            name: customer.fullName
        }));
        
        // Gọi lại hàm sendEmail với danh sách recipients
        req.body.recipients = recipients;
        await exports.sendEmail(req, res);
    } catch (error) {
        console.error('Error sending emails to all customers:', error);
        res.status(500).json({ message: 'Lỗi khi gửi email', error: error.message });
    }
};

// ==================== LỊCH SỬ EMAIL ====================

// Lấy lịch sử gửi email
exports.getEmailLogs = async (req, res) => {
    try {
        const { status, limit = 50, offset = 0 } = req.query;
        
        const where = {};
        if (status) {
            where.status = status;
        }
        
        const logs = await EmailLog.findAll({
            where,
            include: [
                {
                    model: User,
                    as: 'recipient',
                    attributes: ['id', 'fullName', 'email']
                },
                {
                    model: User,
                    as: 'sender',
                    attributes: ['id', 'fullName', 'email']
                }
            ],
            order: [['sentAt', 'DESC']],
            limit: parseInt(limit),
            offset: parseInt(offset)
        });
        
        const total = await EmailLog.count({ where });
        
        res.json({
            logs,
            total,
            limit: parseInt(limit),
            offset: parseInt(offset)
        });
    } catch (error) {
        console.error('Error fetching email logs:', error);
        res.status(500).json({ message: 'Lỗi khi lấy lịch sử email', error: error.message });
    }
};

// Lấy thống kê email
exports.getEmailStats = async (req, res) => {
    try {
        const totalSent = await EmailLog.count({ where: { status: 'sent' } });
        const totalFailed = await EmailLog.count({ where: { status: 'failed' } });
        const totalTemplates = await EmailTemplate.count();
        
        // Lấy email logs gần đây
        const recentLogs = await EmailLog.findAll({
            include: [
                {
                    model: User,
                    as: 'sender',
                    attributes: ['id', 'fullName']
                }
            ],
            order: [['sentAt', 'DESC']],
            limit: 5
        });
        
        res.json({
            totalSent,
            totalFailed,
            totalTemplates,
            recentLogs
        });
    } catch (error) {
        console.error('Error fetching email stats:', error);
        res.status(500).json({ message: 'Lỗi khi lấy thống kê email', error: error.message });
    }
};
