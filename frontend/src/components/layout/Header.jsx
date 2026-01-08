import { Link } from 'react-router-dom';
import { useState } from 'react';
import useAuth from '../../hooks/useAuth';
import useCart from '../../hooks/useCart';
import ThemeToggle from '../common/ThemeToggle'; // ✅ IMPORT

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const { totalItems } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white dark:bg-gray-900 shadow-md sticky top-0 z-40 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">💄</span>
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              Cosmetics Shop
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link 
              to="/" 
              className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors"
            >
              Trang chủ
            </Link>
            <Link 
              to="/products" 
              className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors"
            >
              Sản phẩm
            </Link>
            <Link 
              to="/about" 
              className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors"
            >
              Giới thiệu
            </Link>
            <Link 
              to="/contact" 
              className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors"
            >
              Liên hệ
            </Link>
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <ThemeToggle /> {/* ✅ THÊM */}

            {/* Cart Icon */}
            <Link 
              to="/cart"
              className="relative p-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
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
                  className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
                >
                  <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 dark:text-primary-400 font-bold text-sm">
                      {user?. fullName?. charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="font-medium">{user?.fullName}</span>
                </Link>
                <button
                  onClick={logout}
                  className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium"
                >
                  Đăng xuất
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-3">
                <Link 
                  to="/login"
                  className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium"
                >
                  Đăng nhập
                </Link>
                <Link 
                  to="/register"
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium"
                >
                  Đăng ký
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}