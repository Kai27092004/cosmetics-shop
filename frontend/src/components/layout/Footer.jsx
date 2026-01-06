import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">💄</span>
              </div>
              <span className="text-xl font-bold text-white">
                Cosmetics Shop
              </span>
            </div>
            <p className="text-sm text-gray-400">
              Cửa hàng mỹ phẩm uy tín, chất lượng cao, giá tốt nhất thị trường. 
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold mb-4">Liên kết</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm hover:text-white transition-colors">
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-sm hover:text-white transition-colors">
                  Sản phẩm
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm hover:text-white transition-colors">
                  Giới thiệu
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm hover: text-white transition-colors">
                  Liên hệ
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Support */}
          <div>
            <h3 className="text-white font-bold mb-4">Hỗ trợ</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/faq" className="text-sm hover:text-white transition-colors">
                  Câu hỏi thường gặp
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="text-sm hover: text-white transition-colors">
                  Chính sách vận chuyển
                </Link>
              </li>
              <li>
                <Link to="/return" className="text-sm hover: text-white transition-colors">
                  Chính sách đổi trả
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-sm hover: text-white transition-colors">
                  Chính sách bảo mật
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold mb-4">Liên hệ</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17. 657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>123 Đường ABC, Quận 1, TP. HCM</span>
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-5 h-5 text-primary-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>0123 456 789</span>
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-5 h-5 text-primary-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>contact@cosmetics-shop.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2026 Cosmetics Shop. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}