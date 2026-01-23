import { useState, useEffect } from 'react';
import emailService from '../../../../services/emailService';
import Modal from '../../../../components/common/Modal';
import showToast from '../../../../utils/toast';
import { formatDate } from '../../../../utils/formatters';

export default function LogsModal({ isOpen, onClose }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true); // Bắt đầu với true
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (isOpen) {
      setLoading(true); // Reset loading khi mở modal
      fetchLogs();
    }
  }, [isOpen, filter]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const params = filter !== 'all' ? { status: filter } : {};
      const data = await emailService.getEmailLogs(params);
      setLogs(data.logs || []);
    } catch (error) {
      showToast.error('Không thể tải lịch sử email');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    if (status === 'sent') {
      return (
        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
          ✓ Đã gửi
        </span>
      );
    }
    return (
      <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
        ✗ Thất bại
      </span>
    );
  };

  const stats = {
    total: logs.length,
    sent: logs.filter(l => l.status === 'sent').length,
    failed: logs.filter(l => l.status === 'failed').length
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="" size="2xl" noPadding={true} showCloseButton={false}>
      <div className="relative">
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-6">
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-3xl">
                📊
              </div>
              <div>
                <h2 className="text-2xl font-bold">Lịch Sử Email</h2>
                <p className="text-green-100">Xem lịch sử gửi email cho khách hàng</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-green-200 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6 max-h-[700px] overflow-y-auto">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-xl">
                  📧
                </div>
                <div>
                  <p className="text-xs text-gray-600">Tổng email</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-xl">
                  ✅
                </div>
                <div>
                  <p className="text-xs text-gray-600">Đã gửi</p>
                  <p className="text-2xl font-bold text-green-600">{stats.sent}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-xl p-4 border border-red-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center text-xl">
                  ❌
                </div>
                <div>
                  <p className="text-xs text-gray-600">Thất bại</p>
                  <p className="text-2xl font-bold text-red-600">{stats.failed}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                filter === 'all'
                  ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => setFilter('sent')}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                filter === 'sent'
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Đã gửi
            </button>
            <button
              onClick={() => setFilter('failed')}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                filter === 'failed'
                  ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Thất bại
            </button>
          </div>

          {/* Logs */}
          <div className="relative">
            {/* Loading Overlay */}
            {loading && (
              <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-10 rounded-lg">
                <div className="text-center">
                  <div className="animate-spin w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full mx-auto"></div>
                  <p className="text-gray-600 mt-4 font-semibold">Đang tải...</p>
                </div>
              </div>
            )}

            {logs.length === 0 && !loading ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📭</div>
                <p className="text-gray-600">Chưa có lịch sử email nào</p>
              </div>
            ) : (
              <div className="space-y-3">
                {logs.map((log) => (
                <div
                  key={log.id}
                  className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {getStatusBadge(log.status)}
                        <span className="text-xs text-gray-500">
                          {formatDate(log.sentAt, 'dd/MM/yyyy HH:mm')}
                        </span>
                      </div>
                      <h4 className="font-bold text-gray-900 mb-1">{log.subject}</h4>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span>{log.recipientName || 'N/A'}</span>
                        <span className="text-gray-400">•</span>
                        <span>{log.recipientEmail}</span>
                      </div>
                      {log.status === 'failed' && log.errorMessage && (
                        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-lg">
                          <p className="text-xs text-red-700">
                            <span className="font-semibold">Lỗi:</span> {log.errorMessage}
                          </p>
                        </div>
                      )}
                    </div>
                    {log.sender && (
                      <div className="text-right text-xs text-gray-500">
                        <p>Gửi bởi</p>
                        <p className="font-semibold text-gray-700">{log.sender.fullName}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
