import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import useAuth from '../../hooks/useAuth';
import useCart from '../../hooks/useCart';

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Chuyển đến trang sản phẩm với query tìm kiếm
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery(''); // Clear search input sau khi tìm kiếm
    }
  };

  return (
    <header className="bg-gradient-to-r from-pink-100 via-pink-50 to-rose-100 shadow-md sticky top-0 z-50">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        {/* Desktop Layout - Single Row */}
        <div className="hidden lg:block">
          <div className="relative flex items-center justify-between h-16">
            {/* LEFT: Logo + Brand Name */}
            <div className="flex items-center flex-shrink-0">
              <Link to="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
                <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
                  <span className="text-white font-bold text-xl">💄</span>
                </div>
                <span className="text-xl font-black bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent whitespace-nowrap">
                  Cosmetics Shop
                </span>
              </Link>
            </div>

            {/* CENTER: Navigation Links */}
            <nav className="flex absolute left-[40%] transform -translate-x-1/2 items-center gap-8 pointer-events-none z-10">
              <Link
                to="/"
                className="text-lg font-semibold text-gray-800 hover:text-pink-600 transition-colors whitespace-nowrap pointer-events-auto"
              >
                Trang chủ
              </Link>
              <Link
                to="/products"
                className="text-lg font-semibold text-gray-800 hover:text-pink-600 transition-colors whitespace-nowrap pointer-events-auto"
              >
                Sản phẩm
              </Link>
              <Link
                to="/about"
                className="text-lg font-semibold text-gray-800 hover:text-pink-600 transition-colors whitespace-nowrap pointer-events-auto"
              >
                Giới thiệu
              </Link>
              <Link
                to="/contact"
                className="text-lg font-semibold text-gray-800 hover:text-pink-600 transition-colors whitespace-nowrap pointer-events-auto"
              >
                Liên hệ
              </Link>
            </nav>

            {/* RIGHT: Search + Cart + Auth */}
            <div className="flex items-center gap-3 flex-shrink-0">
              {/* Search Bar */}
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tìm kiếm..."
                    className="w-44 pl-9 pr-3 py-2 border-2 border-pink-200 rounded-lg focus:outline-none focus:border-pink-500 transition-all text-sm"
                  />
                  <svg
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </form>

              {/* Cart Icon */}
              <Link
                to="/cart"
                className="relative p-2 text-gray-800 hover:text-pink-600 transition-all group"
              >
                <svg
                  className="w-6 h-6 group-hover:scale-110 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                    {totalItems}
                  </span>
                )}
              </Link>

              {/* Auth Section */}
              {isAuthenticated ? (
                <div className="flex items-center gap-3">
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 text-gray-800 hover:text-pink-600 transition-colors"
                  >
                    <div className="w-9 h-9 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center shadow-md">
                      <span className="text-white font-bold text-sm">
                        {user?.fullName?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="font-semibold text-sm whitespace-nowrap max-w-[100px] truncate">{user?.fullName}</span>
                  </Link>
                  <button
                    onClick={logout}
                    className="flex items-center gap-1.5 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-semibold text-sm shadow-md hover:shadow-lg transition-all whitespace-nowrap"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Đăng Xuất
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link
                    to="/login"
                    className="px-4 py-2 border-2 border-pink-500 text-pink-600 rounded-lg hover:bg-pink-50 font-semibold text-sm transition-all whitespace-nowrap"
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:shadow-lg font-semibold text-sm transition-all whitespace-nowrap"
                  >
                    Đăng ký
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Layout - Two Rows */}
        <div className="lg:hidden">
          {/* Row 1: Logo + Brand Name */}
          <div className="flex items-center justify-center h-14 border-b border-pink-200">
            <Link to="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-xl">💄</span>
              </div>
              <span className="text-xl font-black bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent whitespace-nowrap">
                Cosmetics Shop
              </span>
            </Link>
          </div>

          {/* Row 2: Search + Cart + Login/Logout + Menu Button */}
          <div className="flex items-center justify-between h-14 gap-2">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm..."
                  className="w-full pl-8 pr-3 py-1.5 border-2 border-pink-200 rounded-lg focus:outline-none focus:border-pink-500 transition-all text-xs"
                />
                <svg
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </form>

            {/* Cart Icon */}
            <Link
              to="/cart"
              className="relative p-1.5 text-gray-800 hover:text-pink-600 transition-all group"
            >
              <svg
                className="w-5 h-5 group-hover:scale-110 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center animate-pulse">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Login/Logout Button */}
            {isAuthenticated ? (
              <button
                onClick={logout}
                className="px-2.5 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 font-semibold text-xs transition-all whitespace-nowrap"
              >
                Đăng xuất
              </button>
            ) : (
              <Link
                to="/login"
                className="px-2.5 py-1.5 border-2 border-pink-500 text-pink-600 rounded-lg hover:bg-pink-50 font-semibold text-xs transition-all whitespace-nowrap"
              >
                Đăng nhập
              </Link>
            )}

            {/* Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 text-gray-800 hover:text-pink-600 transition-colors"
              aria-label="Menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-pink-200 py-4 animate-fadeIn">
            <nav className="flex flex-col space-y-3">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-semibold text-gray-800 hover:text-pink-600 transition-colors px-2 py-2 rounded-lg hover:bg-pink-50"
              >
                🏠 Trang chủ
              </Link>
              <Link
                to="/products"
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-semibold text-gray-800 hover:text-pink-600 transition-colors px-2 py-2 rounded-lg hover:bg-pink-50"
              >
                🛍️ Sản phẩm
              </Link>
              <Link
                to="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-semibold text-gray-800 hover:text-pink-600 transition-colors px-2 py-2 rounded-lg hover:bg-pink-50"
              >
                ℹ️ Giới thiệu
              </Link>
              <Link
                to="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-semibold text-gray-800 hover:text-pink-600 transition-colors px-2 py-2 rounded-lg hover:bg-pink-50"
              >
                📞 Liên hệ
              </Link>

              {/* Mobile User Menu */}
              {isAuthenticated ? (
                <>
                  <Link
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 text-gray-800 hover:text-pink-600 transition-colors px-2 py-2 rounded-lg hover:bg-pink-50"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center shadow-md">
                      <span className="text-white font-bold text-sm">
                        {user?.fullName?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="font-semibold text-base">{user?.fullName}</span>
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-semibold text-base shadow-md transition-all"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Đăng Xuất
                  </button>
                </>
              ) : (
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg font-semibold text-base shadow-md text-center"
                >
                  Đăng ký
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}