import { Link } from 'react-router-dom';
import { useState } from 'react';
import useAuth from '../../hooks/useAuth';
import useCart from '../../hooks/useCart';

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const { totalItems } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">💄</span>
            </div>
            <span className="text-xl font-bold text-gray-900">
              Cosmetics Shop
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link 
              to="/" 
              className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
            >
              Trang chủ
            </Link>
            <Link 
              to="/products" 
              className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
            >
              Sản phẩm
            </Link>
            <Link 
              to="/about" 
              className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
            >
              Giới thiệu
            </Link>
            <Link 
              to="/contact" 
              className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
            >
              Liên hệ
            </Link>
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {/* Cart Icon */}
            <Link 
              to="/cart"
              className="relative p-2 text-gray-700 hover:text-primary-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-. 184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="hidden md:flex items-center gap-3">
                <Link 
                  to="/profile"
                  className="flex items-center gap-2 text-gray-700 hover:text-primary-600"
                >
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 font-semibold text-sm">
                      {user?. fullName?. charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="font-medium">{user?.fullName}</span>
                </Link>
                <button
                  onClick={logout}
                  className="text-gray-600 hover:text-red-600 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-3">
                <Link 
                  to="/login"
                  className="px-4 py-2 text-gray-700 hover:text-primary-600 font-medium transition-colors"
                >
                  Đăng nhập
                </Link>
                <Link 
                  to="/register"
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium transition-colors"
                >
                  Đăng ký
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(! mobileMenuOpen)}
              className="md:hidden p-2 text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md: hidden py-4 border-t">
            <nav className="flex flex-col gap-3">
              <Link to="/" className="py-2 text-gray-700 hover:text-primary-600 font-medium">
                Trang chủ
              </Link>
              <Link to="/products" className="py-2 text-gray-700 hover:text-primary-600 font-medium">
                Sản phẩm
              </Link>
              <Link to="/about" className="py-2 text-gray-700 hover:text-primary-600 font-medium">
                Giới thiệu
              </Link>
              <Link to="/contact" className="py-2 text-gray-700 hover:text-primary-600 font-medium">
                Liên hệ
              </Link>
              <div className="border-t pt-3 mt-2">
                {isAuthenticated ? (
                  <>
                    <Link to="/profile" className="block py-2 text-gray-700 hover:text-primary-600 font-medium">
                      Profile
                    </Link>
                    <button
                      onClick={logout}
                      className="w-full text-left py-2 text-red-600 hover:text-red-700 font-medium"
                    >
                      Đăng xuất
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="block py-2 text-gray-700 hover:text-primary-600 font-medium">
                      Đăng nhập
                    </Link>
                    <Link to="/register" className="block py-2 text-primary-600 hover:text-primary-700 font-medium">
                      Đăng ký
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}