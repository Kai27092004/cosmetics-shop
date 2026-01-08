import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';

/**
 * 500 Server Error Page
 */
export default function ServerError() {
  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="text-center">
        {/* Server Error Icon */}
        <div className="mb-8">
          <div className="w-32 h-32 mx-auto bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center animate-pulse">
            <svg 
              className="w-16 h-16 text-yellow-600 dark:text-yellow-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 9v2m0 4h. 01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-. 77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
              />
            </svg>
          </div>
        </div>

        {/* Error Code */}
        <h1 className="text-9xl font-bold text-gray-800 dark:text-gray-200 mb-4">
          500
        </h1>

        {/* Message */}
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Lỗi máy chủ
        </h2>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
          Xin lỗi, đã có lỗi xảy ra với máy chủ của chúng tôi. 
          Vui lòng thử lại sau hoặc liên hệ hỗ trợ nếu vấn đề vẫn tiếp diễn.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="primary" size="lg" onClick={handleReload}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Thử lại
          </Button>

          <Link to="/">
            <Button variant="secondary" size="lg">
              Về trang chủ
            </Button>
          </Link>
        </div>

        {/* Support Info */}
        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg max-w-md mx-auto">
          <p className="text-sm text-blue-800 dark:text-blue-400">
            <strong>Cần trợ giúp?</strong>
          </p>
          <p className="text-sm text-blue-600 dark:text-blue-500 mt-2">
            Email: support@cosmeticsshop.com<br />
            Hotline: 0123 456 789
          </p>
        </div>

        {/* Error ID (for debugging) */}
        <p className="mt-8 text-xs text-gray-400 dark:text-gray-600 font-mono">
          Error ID: {Date.now().toString(36).toUpperCase()}
        </p>
      </div>
    </div>
  );
}