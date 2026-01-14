import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import socketService from '../../services/socketService';
import showToast from '../../utils/toast';

export default function GoogleCallback() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { loginUser } = useAuthStore();

    useEffect(() => {
        const handleGoogleCallback = async () => {
            try {
                const token = searchParams.get('token');
                const userId = searchParams.get('userId');
                const name = searchParams.get('name');
                const email = searchParams.get('email');
                const role = searchParams.get('role');
                const avatar = searchParams.get('avatar');
                const error = searchParams.get('error');

                if (error) {
                    let errorMessage = 'Đăng nhập Google thất bại';

                    switch (error) {
                        case 'authentication_failed':
                            errorMessage = 'Xác thực Google thất bại';
                            break;
                        case 'server_error':
                            errorMessage = 'Lỗi server, vui lòng thử lại';
                            break;
                        case 'google_auth_failed':
                            errorMessage = 'Đăng nhập Google thất bại';
                            break;
                        default:
                            errorMessage = 'Đã có lỗi xảy ra';
                    }

                    showToast.error(errorMessage);
                    navigate('/login');
                    return;
                }

                if (!token || !userId) {
                    showToast.error('Thiếu thông tin xác thực');
                    navigate('/login');
                    return;
                }

                // Tạo user object
                const userData = {
                    id: parseInt(userId),
                    fullName: decodeURIComponent(name || ''),
                    email: decodeURIComponent(email || ''),
                    role: role || 'customer',
                    avatar: avatar ? decodeURIComponent(avatar) : null,
                };

                // Lưu vào store
                loginUser(userData, token);

                // Kết nối WebSocket
                socketService.connect(token);
                socketService.joinUserRoom(userData.id);
                socketService.joinRoleRoom('customer');

                showToast.success('Đăng nhập Google thành công!');

                // Redirect về trang chủ
                setTimeout(() => {
                    navigate('/', { replace: true });
                }, 500);

            } catch (error) {
                console.error('Google callback error:', error);
                showToast.error('Đã có lỗi xảy ra');
                navigate('/login');
            }
        };

        handleGoogleCallback();
    }, [searchParams, navigate, loginUser]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center">
            <div className="text-center">
                <div className="inline-block">
                    <svg className="animate-spin h-12 w-12 text-pink-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                </div>
                <h2 className="mt-4 text-xl font-semibold text-gray-700">
                    Đang xử lý đăng nhập Google...
                </h2>
                <p className="mt-2 text-gray-500">
                    Vui lòng đợi trong giây lát
                </p>
            </div>
        </div>
    );
}
