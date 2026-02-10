# 🤖 CHATBOT AI - CHATBOT DOCUMENTATION

## 📋 Tổng Quan

Chatbot AI hỗ trợ khách hàng với các tính năng:
- Tìm kiếm sản phẩm thông minh
- Phân tích câu hỏi bằng OpenAI GPT-3.5
- Fallback analysis khi không có API key
- Trả lời câu hỏi chung về chính sách
- Lưu lịch sử chat (tùy chọn)

---

## 💬 1. GỬI TIN NHẮN - CHAT

### Endpoint:
```
POST /api/chatbot/chat
```

### Authentication:
```
Không yêu cầu (Public endpoint)
```

### Request Body:
```json
{
  "message": "Tìm giường ngủ dưới 5 triệu",
  "sessionId": "1707456789123"
}
```

### Response Success (200):
```json
{
  "success": true,
  "data": {
    "message": "Tôi tìm thấy 3 sản phẩm phù hợp:\n\n1. **Giường ngủ Diệp Mộc**\n   💰 Giá: 4,500,000 VND\n   📂 Danh mục: Giường\n   🔗 Xem chi tiết: /products/1\n\n2. **Giường đơn Kết Nối**\n   💰 Giá: 3,200,000 VND\n   📂 Danh mục: Giường\n   🔗 Xem chi tiết: /products/2\n\nBạn có muốn xem thêm thông tin về sản phẩm nào không?",
    "products": [
      {
        "id": 1,
        "name": "Giường ngủ Diệp Mộc",
        "price": 4500000,
        "image": "/upload/giuong-1.jpg",
        "category": "Giường",
        "description": "Giường ngủ cao cấp..."
      },
      {
        "id": 2,
        "name": "Giường đơn Kết Nối",
        "price": 3200000,
        "image": "/upload/giuong-2.jpg",
        "category": "Giường",
        "description": "Giường đơn hiện đại..."
      }
    ],
    "intent": "product_search",
    "sessionId": "1707456789123"
  }
}
```

### Response Error:
```json
// Tin nhắn trống (400)
{
  "success": false,
  "message": "Tin nhắn không được để trống"
}

// Lỗi server (500)
{
  "success": false,
  "message": "Có lỗi xảy ra khi xử lý tin nhắn. Vui lòng thử lại sau."
}
```

### Bảo mật:
- ✅ Rate limit: 10 requests / 1 phút
- ✅ Validate tin nhắn không trống
- ✅ Public endpoint (không cần authentication)

---

## 🧠 2. PHÂN TÍCH CÂU HỎI - QUERY ANALYSIS

### A. Phân tích bằng OpenAI GPT-3.5

#### Điều kiện:
- Có `OPENAI_API_KEY` trong `.env`
- API key hợp lệ

#### Prompt:
```javascript
const prompt = `
Phân tích câu hỏi sau và trả về JSON với format:
{
  "intent": "product_search" | "general_support" | "unclear",
  "keywords": ["từ", "khóa", "sản", "phẩm"],
  "priceRange": {"min": 0, "max": 5000000},
  "category": "tên danh mục nếu có"
}

Câu hỏi: "${message}"

Quy tắc:
- Nếu hỏi về sản phẩm cụ thể (giường, bàn, ghế, sofa, tủ...) → intent: "product_search"
- Nếu hỏi về chính sách, thanh toán, bảo hành → intent: "general_support"  
- Nếu không rõ ý → intent: "unclear"
- Trích xuất từ khóa sản phẩm từ câu hỏi
- Trích xuất giá tiền (triệu, nghìn, VND) và chuyển đổi sang VND
- Trích xuất danh mục nếu có

Chỉ trả về JSON, không có text khác.
`;
```

#### OpenAI API Call:
```javascript
const response = await openai.chat.completions.create({
  model: "gpt-3.5-turbo",
  messages: [{ role: "user", content: prompt }],
  temperature: 0.1,
  max_tokens: 200
});

const result = JSON.parse(response.choices[0].message.content);
```

#### Ví dụ Response:
```json
{
  "intent": "product_search",
  "keywords": ["giường", "ngủ"],
  "priceRange": {
    "min": 0,
    "max": 5000000
  },
  "category": "Giường"
}
```

### B. Fallback Analysis (Không có OpenAI)

#### Điều kiện:
- Không có `OPENAI_API_KEY`
- API key không hợp lệ
- OpenAI API lỗi

#### Phương pháp:
- Rule-based analysis
- Regex pattern matching
- Keyword matching

#### Từ khóa sản phẩm:
```javascript
const productKeywords = [
  'giường', 'bàn', 'ghế', 'sofa', 'tủ', 'kệ', 
  'bàn học', 'bàn làm việc', 'ghế ngồi', 'giường ngủ',
  'tủ quần áo', 'kệ sách', 'bàn ăn', 'ghế ăn',
  'giường đôi', 'giường đơn', 'sofa góc', 'sofa thẳng',
  'tủ giày', 'tủ bếp', 'trang điểm', 'diệp mộc',
  'vải nhung', 'gỗ mdf', 'cửa lùa', 'phủ sơn'
];
```

#### Từ khóa hỗ trợ chung:
```javascript
const supportKeywords = [
  'bảo hành', 'thanh toán', 'giao hàng', 'chính sách',
  'khuyến mãi', 'giảm giá', 'mở cửa', 'liên hệ',
  'hotline', 'email', 'địa chỉ', 'thời gian', 'giờ',
  'phí', 'ship', 'cod'
];
```

#### Trích xuất giá tiền:
```javascript
const pricePatterns = [
  { pattern: /dưới\s+(\d+)\s*triệu/i, multiplier: 1000000 },
  { pattern: /dưới\s+(\d+)\s*nghìn/i, multiplier: 1000 },
  { pattern: /từ\s+(\d+)\s*đến\s+(\d+)\s*triệu/i, multiplier: 1000000, range: true },
  { pattern: /từ\s+(\d+)\s*đến\s+(\d+)\s*nghìn/i, multiplier: 1000, range: true },
  { pattern: /(\d+)\s*triệu/i, multiplier: 1000000 },
  { pattern: /(\d+)\s*nghìn/i, multiplier: 1000 }
];
```

#### Ví dụ:
```javascript
// Input: "Tìm giường ngủ dưới 5 triệu"
{
  "intent": "product_search",
  "keywords": ["giường", "ngủ"],
  "priceRange": { "max": 5000000 },
  "category": "Giường"
}

// Input: "Chính sách bảo hành như thế nào?"
{
  "intent": "general_support",
  "keywords": [],
  "priceRange": null,
  "category": null
}
```

---

## 🔍 3. TÌM KIẾM SẢN PHẨM - PRODUCT SEARCH

### Hàm tìm kiếm:
```javascript
const searchProducts = async (keywords, priceRange) => {
  let whereClause = {};
  
  // Tìm kiếm theo từ khóa
  if (keywords && keywords.length > 0) {
    const searchConditions = [];
    
    // Tìm trong tên sản phẩm
    keywords.forEach(keyword => {
      searchConditions.push({
        name: { [Op.like]: `%${keyword}%` }
      });
    });
    
    // Tìm trong tên danh mục
    keywords.forEach(keyword => {
      searchConditions.push({
        '$category.name$': { [Op.like]: `%${keyword}%` }
      });
    });
    
    whereClause[Op.or] = searchConditions;
  }
  
  // Lọc theo giá
  if (priceRange) {
    if (priceRange.min !== undefined) {
      whereClause.price = { [Op.gte]: priceRange.min };
    }
    if (priceRange.max !== undefined) {
      whereClause.price = { [Op.lte]: priceRange.max };
    }
  }
  
  const products = await Product.findAll({
    where: whereClause,
    include: [{
      model: Category,
      as: 'category',
      attributes: ['name']
    }],
    limit: 10,
    order: [['createdAt', 'DESC']]
  });
  
  return products;
};
```

### SQL Query:
```sql
SELECT products.*, categories.name as category_name
FROM products
LEFT JOIN categories ON products.categoryId = categories.id
WHERE (
  products.name LIKE '%giường%' 
  OR products.name LIKE '%ngủ%'
  OR categories.name LIKE '%giường%'
  OR categories.name LIKE '%ngủ%'
)
AND products.price <= 5000000
ORDER BY products.createdAt DESC
LIMIT 10
```

---

## 💡 4. TRẢ LỜI CÂU HỎI CHUNG - GENERAL SUPPORT

### Câu trả lời mẫu:
```javascript
const generalResponses = {
  'chính sách': 'Chúng tôi có chính sách bảo hành 12 tháng cho tất cả sản phẩm nội thất. Bạn có thể xem chi tiết tại trang "Chính sách bảo hành".',
  
  'thanh toán': 'Chúng tôi hỗ trợ thanh toán qua thẻ tín dụng, chuyển khoản ngân hàng và thanh toán khi nhận hàng (COD).',
  
  'giao hàng': 'Chúng tôi giao hàng miễn phí trong nội thành TP.HCM. Phí giao hàng ngoại thành từ 50,000 - 100,000 VND.',
  
  'bảo hành': 'Tất cả sản phẩm được bảo hành 12 tháng. Chúng tôi hỗ trợ sửa chữa và thay thế linh kiện miễn phí.',
  
  'khuyến mãi': 'Hiện tại chúng tôi có chương trình giảm giá 10% cho đơn hàng trên 5 triệu và miễn phí vận chuyển cho đơn hàng trên 10 triệu.',
  
  'giờ mở cửa': 'Cửa hàng mở cửa từ 8:00 - 22:00 hàng ngày. Hotline hỗ trợ: 1900-xxxx.',
  
  'liên hệ': 'Bạn có thể liên hệ qua hotline 1900-xxxx, email support@furniture.com hoặc đến trực tiếp cửa hàng.'
};
```

### Xử lý:
```javascript
const getGeneralResponse = async (message) => {
  const lowerMessage = message.toLowerCase();
  
  for (const [key, response] of Object.entries(generalResponses)) {
    if (lowerMessage.includes(key)) {
      return response;
    }
  }
  
  return 'Xin chào! Tôi có thể giúp bạn tìm kiếm sản phẩm nội thất, tư vấn về chính sách bảo hành, thanh toán hoặc giao hàng. Bạn cần hỗ trợ gì?';
};
```

---

## 📝 5. FORMAT PHẢN HỒI - RESPONSE FORMATTING

### A. Phản hồi sản phẩm:
```javascript
const formatProductResponse = (products, query) => {
  if (products.length === 0) {
    return 'Xin lỗi, tôi không tìm thấy sản phẩm nào phù hợp với yêu cầu của bạn. Bạn có thể thử tìm kiếm với từ khóa khác hoặc liên hệ trực tiếp để được tư vấn.';
  }
  
  let response = `Tôi tìm thấy ${products.length} sản phẩm phù hợp:\n\n`;
  
  products.forEach((product, index) => {
    response += `${index + 1}. **${product.name}**\n`;
    response += `   💰 Giá: ${product.price.toLocaleString('vi-VN')} VND\n`;
    response += `   📂 Danh mục: ${product.category?.name || 'Không xác định'}\n`;
    response += `   🔗 Xem chi tiết: /products/${product.id}\n\n`;
  });
  
  response += 'Bạn có muốn xem thêm thông tin về sản phẩm nào không?';
  
  return response;
};
```

### B. Phản hồi không rõ ý:
```javascript
const unclearResponse = 'Xin lỗi, tôi chưa hiểu rõ yêu cầu của bạn. Bạn có thể diễn đạt lại không? Hoặc bạn có thể hỏi về:\n- Sản phẩm nội thất (giường, bàn, ghế, sofa, tủ...)\n- Chính sách bảo hành\n- Phương thức thanh toán\n- Thông tin giao hàng';
```

---

## 📜 6. LỊCH SỬ CHAT - CHAT HISTORY

### Endpoint:
```
GET /api/chatbot/history/:sessionId
```

### Response Success (200):
```json
{
  "success": true,
  "data": {
    "messages": []
  }
}
```

### Lưu ý:
- ⚠️ Chức năng này chưa được triển khai đầy đủ
- ✅ Hiện tại trả về empty array
- 🔜 TODO: Implement chat history storage

### Cách triển khai (tương lai):
```sql
CREATE TABLE chat_history (
  id INT PRIMARY KEY AUTO_INCREMENT,
  sessionId VARCHAR(255) NOT NULL,
  userId INT,
  message TEXT NOT NULL,
  response TEXT NOT NULL,
  intent VARCHAR(50),
  createdAt DATETIME,
  INDEX idx_session (sessionId)
);
```

---

## ⚙️ 7. CẤU HÌNH OPENAI

### Environment Variables:
```env
OPENAI_API_KEY=sk-your-real-api-key-here
```

### Khởi tạo OpenAI Client:
```javascript
let openai = null;

if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your-openai-api-key-here') {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });
  console.log('OpenAI client initialized successfully');
} else {
  console.log('OpenAI API key not configured, using fallback analysis');
}
```

### Model:
- **GPT-3.5-turbo**
- Temperature: 0.1 (deterministic)
- Max tokens: 200

---

## 🎯 8. INTENT TYPES

### A. `product_search`
- Tìm kiếm sản phẩm
- Trả về danh sách sản phẩm phù hợp
- Ví dụ: "Tìm giường ngủ dưới 5 triệu"

### B. `general_support`
- Câu hỏi về chính sách, thanh toán, giao hàng
- Trả về câu trả lời có sẵn
- Ví dụ: "Chính sách bảo hành như thế nào?"

### C. `unclear`
- Không hiểu câu hỏi
- Yêu cầu user diễn đạt lại
- Ví dụ: "abc xyz 123"

---

## 📊 9. VÍ DỤ SỬ DỤNG

### Ví dụ 1: Tìm sản phẩm theo giá
```json
// Request
{
  "message": "Tìm giường ngủ dưới 5 triệu"
}

// Response
{
  "success": true,
  "data": {
    "message": "Tôi tìm thấy 3 sản phẩm phù hợp...",
    "products": [...],
    "intent": "product_search"
  }
}
```

### Ví dụ 2: Tìm sản phẩm theo khoảng giá
```json
// Request
{
  "message": "Tìm sofa từ 3 đến 7 triệu"
}

// Analysis
{
  "intent": "product_search",
  "keywords": ["sofa"],
  "priceRange": { "min": 3000000, "max": 7000000 },
  "category": "Sofa"
}
```

### Ví dụ 3: Câu hỏi chung
```json
// Request
{
  "message": "Chính sách bảo hành như thế nào?"
}

// Response
{
  "success": true,
  "data": {
    "message": "Chúng tôi có chính sách bảo hành 12 tháng...",
    "products": [],
    "intent": "general_support"
  }
}
```

---

## ✅ SUMMARY

### Các tính năng:
1. ✅ Phân tích câu hỏi bằng OpenAI GPT-3.5
2. ✅ Fallback analysis (rule-based)
3. ✅ Tìm kiếm sản phẩm thông minh
4. ✅ Trả lời câu hỏi chung
5. ✅ Trích xuất giá tiền từ câu hỏi
6. ✅ Trích xuất từ khóa và danh mục
7. 🔜 Lưu lịch sử chat (TODO)

### Bảo mật:
- ✅ Public endpoint
- ✅ Rate limit: 10 requests / 1 phút
- ✅ Validate tin nhắn không trống
- ✅ Error handling

### AI Features:
- ✅ OpenAI GPT-3.5 integration
- ✅ Fallback khi không có API key
- ✅ Intent classification
- ✅ Entity extraction (price, keywords, category)

---

**Date**: February 9, 2026  
**Version**: 1.0.0  
**Status**: ✅ Production Ready
