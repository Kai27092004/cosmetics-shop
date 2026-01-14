import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white text-gray-800 relative overflow-hidden shadow-inner">
      {/* Background Decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-pink-300 to-purple-300 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-blue-300 to-cyan-300 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-2xl">💄</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                  Cosmetics Shop
                </span>
                <span className="text-xs text-gray-500">Vẻ đẹp hoàn hảo</span>
              </div>
            </div>
            <p className="text-gray-600 leading-relaxed text-sm">
              Nơi vẻ đẹp tự nhiên gặp gỡ công nghệ hiện đại. Chúng tôi cam kết mang đến những sản phẩm mỹ phẩm chính hãng, chất lượng cao.
            </p>

            {/* Social Media */}
            <div className="flex gap-3 pt-2">
              <a
                href="#"
                className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center hover:scale-110 transition-transform shadow-md text-white"
                aria-label="Facebook"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-600 rounded-lg flex items-center justify-center hover:scale-110 transition-transform shadow-md text-white"
                aria-label="Instagram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gradient-to-br from-sky-400 to-blue-500 rounded-lg flex items-center justify-center hover:scale-110 transition-transform shadow-md text-white"
                aria-label="Twitter"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                </svg>
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-600 rounded-lg flex items-center justify-center hover:scale-110 transition-transform shadow-md text-white"
                aria-label="YouTube"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-gradient-to-b from-pink-500 to-purple-600 rounded-full"></span>
              Liên Kết Nhanh
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-gray-700 hover:text-pink-600 transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-pink-500 rounded-full group-hover:scale-150 transition-transform"></span>
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-700 hover:text-pink-600 transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-pink-500 rounded-full group-hover:scale-150 transition-transform"></span>
                  Sản phẩm
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-700 hover:text-pink-600 transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-pink-500 rounded-full group-hover:scale-150 transition-transform"></span>
                  Giới thiệu
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-700 hover:text-pink-600 transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-pink-500 rounded-full group-hover:scale-150 transition-transform"></span>
                  Liên hệ
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Support */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-gradient-to-b from-pink-500 to-purple-600 rounded-full"></span>
              Hỗ Trợ Khách Hàng
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/faq" className="text-gray-700 hover:text-pink-600 transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-purple-500 rounded-full group-hover:scale-150 transition-transform"></span>
                  Câu hỏi thường gặp
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="text-gray-700 hover:text-pink-600 transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-purple-500 rounded-full group-hover:scale-150 transition-transform"></span>
                  Chính sách vận chuyển
                </Link>
              </li>
              <li>
                <Link to="/return" className="text-gray-700 hover:text-pink-600 transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-purple-500 rounded-full group-hover:scale-150 transition-transform"></span>
                  Chính sách đổi trả
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-700 hover:text-pink-600 transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-purple-500 rounded-full group-hover:scale-150 transition-transform"></span>
                  Chính sách bảo mật
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-gradient-to-b from-pink-500 to-purple-600 rounded-full"></span>
              Thông Tin Liên Hệ
            </h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 shadow-md">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <span className="text-gray-700">123 Đường ABC, Quận 1, TP. Hồ Chí Minh</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <span className="text-gray-800 font-semibold">0123 456 789</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="text-gray-800 font-semibold">contact@cosmetics-shop.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-600 text-sm text-center md:text-left">
              &copy; {currentYear} <span className="font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">Cosmetics Shop</span>. Tất cả quyền được bảo lưu.
            </p>
            <p className="text-gray-500 text-sm flex items-center gap-2">
              Được thiết kế với <span className="text-red-500 animate-pulse">❤️</span> tại Việt Nam
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}