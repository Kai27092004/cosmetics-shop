import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
// Import authService (Default import - không có dấu ngoặc nhọn)
import authService from '../../services/authService';

const ForgotPassword = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            // Gọi hàm forgotPassword từ object authService
            await authService.forgotPassword(data.email);
            toast.success('Đã gửi email khôi phục! Vui lòng kiểm tra hộp thư.');
        } catch (error) {
            const msg = error.message || error.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại.';
            toast.error(msg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Quên mật khẩu?
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Nhập email của bạn để nhận liên kết đặt lại mật khẩu.
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <label htmlFor="email" className="sr-only">Email</label>
                        <input
                            id="email"
                            type="email"
                            {...register("email", {
                                required: "Vui lòng nhập email",
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: "Email không hợp lệ"
                                }
                            })}
                            className={`appearance-none rounded relative block w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm`}
                            placeholder="Nhập địa chỉ Email"
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:bg-pink-300"
                        >
                            {isLoading ? 'Đang gửi...' : 'Gửi yêu cầu'}
                        </button>
                    </div>

                    <div className="flex items-center justify-center">
                        <Link to="/login" className="font-medium text-pink-600 hover:text-pink-500">
                            ← Quay lại đăng nhập
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;