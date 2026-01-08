import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';

/**
 * 404 Not Found Page
 */
export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="text-center">
        {/* 404 Icon */}
        <div className="mb-8">
          <svg 
            className="w-64 h-64 mx-auto text-gray-300 dark:text-gray-700" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={0.5} 
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
            />
          </svg>
        </div>

        {/* Error Code */}
        <h1 className="text-9xl font-bold text-gray-800 dark:text-gray-200 mb-4">
          404
        </h1>

        {/* Message */}
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Trang không tồn tại
        </h2>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
          Xin lỗi, chúng tôi không thể tìm thấy trang bạn đang tìm kiếm.  
          Có thể trang đã bị xóa hoặc URL không chính xác.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/">
            <Button variant="primary" size="lg">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Về trang chủ
            </Button>
          </Link>

          <Link to="/products">
            <Button variant="secondary" size="lg">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              Xem sản phẩm
            </Button>
          </Link>
        </div>

        {/* Help Text */}
        <p className="mt-8 text-sm text-gray-500 dark:text-gray-500">
          Nếu bạn nghĩ đây là lỗi, vui lòng{' '}
          <Link to="/contact" className="text-primary-600 hover:underline">
            liên hệ với chúng tôi
          </Link>
        </p>
      </div>
    </div>
  );
}