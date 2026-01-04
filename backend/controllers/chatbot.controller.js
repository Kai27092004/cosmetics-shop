const { Product, Category } = require('../models');
const OpenAI = require('openai');

// Khởi tạo OpenAI client (chỉ khi có API key)
let openai = null;
if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your-openai-api-key-here') {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });
  console.log('OpenAI client initialized successfully');
} else {
  console.log('OpenAI API key not configured, using fallback analysis');
}

// Hàm tìm kiếm sản phẩm theo từ khóa và giá
const searchProducts = async (keywords, priceRange) => {
  try {
    let whereClause = {};
    
    // Tìm kiếm theo tên sản phẩm và danh mục - cải thiện để tìm kiếm từng từ riêng lẻ
    if (keywords && keywords.length > 0) {
      const searchConditions = [];
      
      // Tìm kiếm trong tên sản phẩm
      keywords.forEach(keyword => {
        searchConditions.push({
          name: {
            [require('sequelize').Op.like]: `%${keyword}%`
          }
        });
      });
      
      // Tìm kiếm trong tên danh mục
      keywords.forEach(keyword => {
        searchConditions.push({
          '$category.name$': {
            [require('sequelize').Op.like]: `%${keyword}%`
          }
        });
      });
      
      whereClause[require('sequelize').Op.or] = searchConditions;
    }
    
    // Lọc theo giá
    if (priceRange) {
      if (priceRange.min !== undefined) {
        whereClause.price = {
          ...whereClause.price,
          [require('sequelize').Op.gte]: priceRange.min
        };
      }
      if (priceRange.max !== undefined) {
        whereClause.price = {
          ...whereClause.price,
          [require('sequelize').Op.lte]: priceRange.max
        };
      }
    }
    
    const products = await Product.findAll({
      where: whereClause,
      include: [{
        model: Category,
        as: 'category',
        attributes: ['name'],
        required: false // LEFT JOIN để không bỏ qua sản phẩm không có category
      }],
      limit: 10,
      order: [['createdAt', 'DESC']]
    });
    
    return products;
  } catch (error) {
    console.error('Error searching products:', error);
    return [];
  }
};

// Hàm phân tích câu hỏi bằng AI hoặc fallback
const analyzeQuery = async (message) => {
  // Kiểm tra xem có OpenAI client không
  if (!openai) {
    console.log('OpenAI client not available, using fallback analysis');
    return analyzeQueryFallback(message);
  }

  try {
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
    
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.1,
      max_tokens: 200
    });
    
    const result = JSON.parse(response.choices[0].message.content);
    return result;
  } catch (error) {
    console.error('Error analyzing query with OpenAI:', error);
    console.log('Falling back to rule-based analysis');
    return analyzeQueryFallback(message);
  }
};

// Fallback analysis khi không có OpenAI API
const analyzeQueryFallback = (message) => {
  const lowerMessage = message.toLowerCase();
  
  // Từ khóa sản phẩm - cập nhật theo database thực tế
  const productKeywords = [
    'giường', 'bàn', 'ghế', 'sofa', 'tủ', 'kệ', 'bàn học', 'bàn làm việc',
    'ghế ngồi', 'giường ngủ', 'tủ quần áo', 'kệ sách', 'bàn ăn', 'ghế ăn',
    'giường đôi', 'giường đơn', 'sofa góc', 'sofa thẳng', 'tủ giày', 'tủ bếp',
    'trang điểm', 'diệp mộc', 'vải nhung', 'gỗ mdf', 'cửa lùa', 'phủ sơn',
    'ngọc ngà', 'kết nối', 'ôm dịu', 'diệp nhiên'
  ];
  
  // Từ khóa hỗ trợ chung
  const supportKeywords = [
    'bảo hành', 'thanh toán', 'giao hàng', 'chính sách', 'khuyến mãi',
    'giảm giá', 'mở cửa', 'liên hệ', 'hotline', 'email', 'địa chỉ',
    'thời gian', 'giờ', 'phí', 'ship', 'cod'
  ];
  
  // Kiểm tra intent
  let intent = "unclear";
  let keywords = [];
  let priceRange = null;
  let category = null;
  
  // Kiểm tra sản phẩm
  const foundProducts = productKeywords.filter(keyword => 
    lowerMessage.includes(keyword)
  );
  
  if (foundProducts.length > 0) {
    intent = "product_search";
    keywords = foundProducts;
  }
  
  // Kiểm tra hỗ trợ chung
  const foundSupport = supportKeywords.filter(keyword => 
    lowerMessage.includes(keyword)
  );
  
  if (foundSupport.length > 0 && foundProducts.length === 0) {
    intent = "general_support";
  }
  
  // Trích xuất giá tiền
  const pricePatterns = [
    { pattern: /dưới\s+(\d+)\s*triệu/i, multiplier: 1000000 },
    { pattern: /dưới\s+(\d+)\s*nghìn/i, multiplier: 1000 },
    { pattern: /từ\s+(\d+)\s*đến\s+(\d+)\s*triệu/i, multiplier: 1000000, range: true },
    { pattern: /từ\s+(\d+)\s*đến\s+(\d+)\s*nghìn/i, multiplier: 1000, range: true },
    { pattern: /(\d+)\s*triệu/i, multiplier: 1000000 },
    { pattern: /(\d+)\s*nghìn/i, multiplier: 1000 }
  ];
  
  for (const pricePattern of pricePatterns) {
    const match = lowerMessage.match(pricePattern.pattern);
    if (match) {
      if (pricePattern.range && match[2]) {
        priceRange = {
          min: parseInt(match[1]) * pricePattern.multiplier,
          max: parseInt(match[2]) * pricePattern.multiplier
        };
      } else {
        const value = parseInt(match[1]) * pricePattern.multiplier;
        if (lowerMessage.includes('dưới')) {
          priceRange = { max: value };
        } else if (lowerMessage.includes('trên')) {
          priceRange = { min: value };
        } else {
          priceRange = { max: value };
        }
      }
      break;
    }
  }
  
  // Xác định danh mục theo database thực tế
  if (lowerMessage.includes('phòng ngủ') || lowerMessage.includes('giường')) {
    category = 'Giường';
  } else if (lowerMessage.includes('phòng khách') || lowerMessage.includes('sofa')) {
    category = 'Sofa';
  } else if (lowerMessage.includes('tủ') || lowerMessage.includes('quần áo')) {
    category = 'Tủ quần áo';
  } else if (lowerMessage.includes('trang điểm') || lowerMessage.includes('bàn trang')) {
    category = 'Bàn trang điểm';
  }
  
  return {
    intent,
    keywords,
    priceRange,
    category
  };
};

// Hàm tạo phản hồi cho câu hỏi chung
const getGeneralResponse = async (message) => {
  const generalResponses = {
    'chính sách': 'Chúng tôi có chính sách bảo hành 12 tháng cho tất cả sản phẩm nội thất. Bạn có thể xem chi tiết tại trang "Chính sách bảo hành".',
    'thanh toán': 'Chúng tôi hỗ trợ thanh toán qua thẻ tín dụng, chuyển khoản ngân hàng và thanh toán khi nhận hàng (COD).',
    'giao hàng': 'Chúng tôi giao hàng miễn phí trong nội thành TP.HCM. Phí giao hàng ngoại thành từ 50,000 - 100,000 VND.',
    'bảo hành': 'Tất cả sản phẩm được bảo hành 12 tháng. Chúng tôi hỗ trợ sửa chữa và thay thế linh kiện miễn phí.',
    'khuyến mãi': 'Hiện tại chúng tôi có chương trình giảm giá 10% cho đơn hàng trên 5 triệu và miễn phí vận chuyển cho đơn hàng trên 10 triệu.',
    'giờ mở cửa': 'Cửa hàng mở cửa từ 8:00 - 22:00 hàng ngày. Hotline hỗ trợ: 1900-xxxx.',
    'liên hệ': 'Bạn có thể liên hệ qua hotline 1900-xxxx, email support@furniture.com hoặc đến trực tiếp cửa hàng.'
  };
  
  const lowerMessage = message.toLowerCase();
  for (const [key, response] of Object.entries(generalResponses)) {
    if (lowerMessage.includes(key)) {
      return response;
    }
  }
  
  return 'Xin chào! Tôi có thể giúp bạn tìm kiếm sản phẩm nội thất, tư vấn về chính sách bảo hành, thanh toán hoặc giao hàng. Bạn cần hỗ trợ gì?';
};

// Hàm tạo phản hồi cho sản phẩm
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

// Controller chính
const chat = async (req, res) => {
  try {
    const { message, sessionId } = req.body;
    
    if (!message || message.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Tin nhắn không được để trống'
      });
    }
    
    // Phân tích câu hỏi bằng AI
    const analysis = await analyzeQuery(message);
    
    let response = '';
    let products = [];
    
    if (analysis.intent === 'product_search') {
      // Tìm kiếm sản phẩm
      products = await searchProducts(analysis.keywords, analysis.priceRange);
      response = formatProductResponse(products, message);
    } else if (analysis.intent === 'general_support') {
      // Trả lời câu hỏi chung
      response = await getGeneralResponse(message);
    } else {
      // Không hiểu câu hỏi
      response = 'Xin lỗi, tôi chưa hiểu rõ yêu cầu của bạn. Bạn có thể diễn đạt lại không? Hoặc bạn có thể hỏi về:\n- Sản phẩm nội thất (giường, bàn, ghế, sofa, tủ...)\n- Chính sách bảo hành\n- Phương thức thanh toán\n- Thông tin giao hàng';
    }
    
    // Lưu lịch sử chat (có thể mở rộng sau)
    // TODO: Implement chat history storage
    
    res.json({
      success: true,
      data: {
        message: response,
        products: products.map(p => ({
          id: p.id,
          name: p.name,
          price: p.price,
          image: p.imageUrl,
          category: p.category?.name,
          description: p.description
        })),
        intent: analysis.intent,
        sessionId: sessionId || Date.now().toString()
      }
    });
    
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({
      success: false,
      message: 'Có lỗi xảy ra khi xử lý tin nhắn. Vui lòng thử lại sau.'
    });
  }
};

// Lấy lịch sử chat (tùy chọn)
const getChatHistory = async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    // TODO: Implement chat history retrieval
    // Hiện tại trả về empty array
    res.json({
      success: true,
      data: {
        messages: []
      }
    });
  } catch (error) {
    console.error('Get chat history error:', error);
    res.status(500).json({
      success: false,
      message: 'Có lỗi xảy ra khi lấy lịch sử chat'
    });
  }
};

module.exports = {
  chat,
  getChatHistory
};
