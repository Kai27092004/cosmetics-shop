import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { formatCurrency } from '../../utils/formatters';
import Loading from '../../components/common/Loading';
import Button from '../../components/common/Button';
import showToast from '../../utils/toast';

export default function Payment() {
  const { orderId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [orderData, setOrderData] = useState(null);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const stateData = location.state;
    
    if (stateData && stateData.orderId && stateData.totalAmount) {
      setOrderData({
        orderId: stateData.orderId,
        totalAmount: stateData.totalAmount,
      });
      
      generateQRCode(stateData.orderId, stateData.totalAmount);
      setLoading(false);
    } else {
      showToast.error('Không tìm thấy thông tin đơn hàng');
      navigate('/');
    }
  }, [orderId, location.state, navigate]);

  const generateQRCode = (orderId, amount) => {
    const bankInfo = {
      bank: 'MB',
      accountNumber: '00876807798',
      accountName: 'NGUYEN HOANG TAN PHAT',
      amount: amount,
      description: `DH${orderId}`,
    };

    // VietQR API cho MBBank
    const qrUrl = `https://img.vietqr.io/image/${bankInfo.bank}-${bankInfo.accountNumber}-compact2.png?amount=${bankInfo.amount}&addInfo=${encodeURIComponent(bankInfo.description)}&accountName=${encodeURIComponent(bankInfo.accountName)}`;
    
    setQrCodeUrl(qrUrl);
  };

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      showToast.success(`Đã copy ${label}!`);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  const handleViewOrders = () => {
    navigate('/profile', { state: { activeTab: 'orders' } });
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header với Animation */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-tr from-purple-500 via-pink-500 to-orange-500 rounded-full mb-6 shadow-2xl animate-pulse">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 mb-3">
            Thanh toán đơn hàng
          </h1>
          <p className="text-gray-600 text-lg font-medium">Quét mã QR để hoàn tất thanh toán</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Card 1: QR Code */}
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden transform hover:scale-105 transition-all duration-300">
            <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 p-6 text-white">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold uppercase tracking-wider opacity-90">
                  Mã đơn hàng
                </span>
                <button
                  onClick={() => copyToClipboard(orderData?.orderId, 'mã đơn hàng')}
                  className="hover:bg-white/20 p-2 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
              <p className="text-3xl font-black mb-6">#{orderData?.orderId}</p>
              
              <div className="border-t border-white/30 pt-4">
                <p className="text-sm font-semibold opacity-90 mb-2">Tổng thanh toán</p>
                <p className="text-5xl font-black tracking-tight">
                  {formatCurrency(orderData?.totalAmount)}
                </p>
              </div>
            </div>

            <div className="p-8">
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 rounded-2xl blur-2xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
                <div className="relative bg-white p-6 rounded-2xl shadow-xl border-4 border-gray-100">
                  {qrCodeUrl ? (
                    <img
                      src={qrCodeUrl}
                      alt="QR Code Thanh toán"
                      className="w-full h-auto"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="300"%3E%3Crect fill="%23f0f0f0" width="300" height="300"/%3E%3Ctext fill="%23999" font-family="sans-serif" font-size="18" dy="10" font-weight="400" x="50%25" y="50%25" text-anchor="middle"%3EQR Code%3C/text%3E%3C/svg%3E';
                      }}
                    />
                  ) : (
                    <div className="w-full aspect-square bg-gray-100 flex items-center justify-center rounded-lg">
                      <Loading />
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600 mb-2">
                  <span className="inline-flex items-center">
                    <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Mở ứng dụng ngân hàng
                  </span>
                </p>
                <p className="text-sm text-gray-600">
                  <span className="inline-flex items-center">
                    <svg className="w-4 h-4 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                    </svg>
                    Quét mã để thanh toán
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Card 2: Bank Info */}
          <div className="space-y-6">
            {/* Thông tin ngân hàng */}
            <div className="bg-white rounded-3xl shadow-2xl p-8 transform hover:scale-105 transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                    <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <h2 className="text-2xl font-black text-gray-900">Thông tin chuyển khoản</h2>
              </div>

              <div className="space-y-4">
                {/* Bank */}
                <div className="group">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">
                    Ngân hàng
                  </label>
                  <div className="flex items-center justify-between bg-gradient-to-r from-red-50 to-pink-50 p-4 rounded-xl border-2 border-red-100 group-hover:border-red-300 transition-colors">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center mr-3">
                        <span className="text-white font-black text-sm">MB</span>
                      </div>
                      <span className="font-bold text-gray-900 text-lg">MBBank</span>
                    </div>
                    <button
                      onClick={() => copyToClipboard('MBBank', 'tên ngân hàng')}
                      className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                    >
                      <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Account Number */}
                <div className="group">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">
                    Số tài khoản
                  </label>
                  <div className="flex items-center justify-between bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-xl border-2 border-purple-100 group-hover:border-purple-300 transition-colors">
                    <span className="font-mono font-bold text-gray-900 text-xl tracking-wider">
                      00876807798
                    </span>
                    <button
                      onClick={() => copyToClipboard('00876807798', 'số tài khoản')}
                      className="p-2 hover:bg-purple-100 rounded-lg transition-colors"
                    >
                      <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Account Name */}
                <div className="group">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">
                    Chủ tài khoản
                  </label>
                  <div className="flex items-center justify-between bg-gradient-to-r from-orange-50 to-yellow-50 p-4 rounded-xl border-2 border-orange-100 group-hover:border-orange-300 transition-colors">
                    <span className="font-bold text-gray-900 text-lg">
                      NGUYEN HOANG TAN PHAT
                    </span>
                    <button
                      onClick={() => copyToClipboard('NGUYEN HOANG TAN PHAT', 'tên chủ tài khoản')}
                      className="p-2 hover:bg-orange-100 rounded-lg transition-colors"
                    >
                      <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Amount */}
                <div className="group">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">
                    Số tiền
                  </label>
                  <div className="flex items-center justify-between bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border-2 border-green-100 group-hover:border-green-300 transition-colors">
                    <span className="font-black text-green-600 text-2xl">
                      {formatCurrency(orderData?.totalAmount)}
                    </span>
                    <button
                      onClick={() => copyToClipboard(orderData?.totalAmount.toString(), 'số tiền')}
                      className="p-2 hover:bg-green-100 rounded-lg transition-colors"
                    >
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="group">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">
                    Nội dung chuyển khoản
                  </label>
                  <div className="flex items-center justify-between bg-gradient-to-r from-pink-50 to-rose-50 p-4 rounded-xl border-2 border-pink-100 group-hover:border-pink-300 transition-colors">
                    <span className="font-mono font-bold text-gray-900 text-lg">
                      DH{orderData?.orderId}
                    </span>
                    <button
                      onClick={() => copyToClipboard(`DH${orderData?.orderId}`, 'nội dung')}
                      className="p-2 hover:bg-pink-100 rounded-lg transition-colors"
                    >
                      <svg className="w-5 h-5 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Alert Box */}
            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-3xl shadow-2xl p-6 text-white">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="font-bold text-lg mb-2">Lưu ý quan trọng</p>
                  <ul className="space-y-1 text-sm text-blue-50">
                    <li>✓ Chuyển khoản đúng số tiền</li>
                    <li>✓ Nhập đúng nội dung: <span className="font-mono font-bold">DH{orderData?.orderId}</span></li>
                    <li>✓ Hệ thống cập nhật sau 1-5 phút</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                onClick={handleBackToHome}
                className="w-full py-4 text-lg font-bold border-2 hover:scale-105 transition-transform"
              >
                🏠 Trang chủ
              </Button>
              <Button
                variant="primary"
                onClick={handleViewOrders}
                className="w-full py-4 text-lg font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 hover:scale-105 transition-transform shadow-xl"
              >
                📦 Đơn hàng
              </Button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-10 text-gray-600">
          <p className="text-sm">
            Cần hỗ trợ?{' '}
            <button
              onClick={() => navigate('/contact')}
              className="text-purple-600 hover:text-purple-700 font-bold underline"
            >
              Liên hệ ngay
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
