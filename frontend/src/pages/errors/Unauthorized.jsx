import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';

/**
 * 403 Unauthorized Page
 */
export default function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="text-center">
        {/* Lock Icon */}
        <div className="mb-8">
          <div className="w-32 h-32 mx-auto bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
            <svg 
              className="w-16 h-16 text-red-600 dark:text-red-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
              />
            </svg>
          </div>
        </div>

        {/* Error Code */}
        <h1 className="text-9xl font-bold text-gray-800 dark:text-gray-200 mb-4">
          403
        </h1>

        {/* Message */}
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Truy cập bị từ chối
        </h2>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
          Bạn không có quyền truy cập vào trang này. 
          Vui lòng đăng nhập với tài khoản có quyền phù hợp.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="primary" size="lg" onClick={() => navigate(-1)}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Quay lại
          </Button>

          <Link to="/">
            <Button variant="secondary" size="lg">
              Về trang chủ
            </Button>
          </Link>
        </div>

        {/* Login Link */}
        <div className="mt-8">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Bạn chưa đăng nhập? 
          </p>
          <Link to="/login">
            <Button variant="outline">
              Đăng nhập ngay
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}