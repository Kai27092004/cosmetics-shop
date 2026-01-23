import { useState, useEffect } from 'react';
import emailService from '../../../services/emailService';
import Loading from '../../../components/common/Loading';
import showToast from '../../../utils/toast';
import { formatDate } from '../../../utils/formatters';
import TemplatesModal from './components/TemplatesModal';
import SendEmailModal from './components/SendEmailModal';
import LogsModal from './components/LogsModal';

export default function EmailDashboard() {
  const [stats, setStats] = useState({
    totalSent: 0,
    totalFailed: 0,
    totalTemplates: 0,
    recentLogs: []
  });
  const [loading, setLoading] = useState(true);

  // Modal states
  const [templatesModalOpen, setTemplatesModalOpen] = useState(false);
  const [sendEmailModalOpen, setSendEmailModalOpen] = useState(false);
  const [logsModalOpen, setLogsModalOpen] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await emailService.getEmailStats();
      setStats(data);
    } catch (error) {
      showToast.error(error.message || 'Không thể tải thống kê email');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loading size="lg" text="Đang tải thống kê..." />
      </div>
    );
  }

  const statCards = [
    {
      title: 'Email đã gửi',
      value: stats.totalSent,
      icon: (
        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      bgLight: 'bg-green-50',
      gradient: 'from-green-500 to-emerald-600',
    },
    {
      title: 'Email thất bại',
      value: stats.totalFailed,
      icon: (
        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      bgLight: 'bg-red-50',
      gradient: 'from-red-500 to-pink-600',
    },
    {
      title: 'Mẫu email',
      value: stats.totalTemplates,
      icon: (
        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      bgLight: 'bg-blue-50',
      gradient: 'from-blue-500 to-indigo-600',
    },
    {
      title: 'Tỷ lệ thành công',
      value: stats.totalSent + stats.totalFailed > 0 
        ? `${Math.round((stats.totalSent / (stats.totalSent + stats.totalFailed)) * 100)}%`
        : '0%',
      icon: (
        <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      bgLight: 'bg-purple-50',
      gradient: 'from-purple-500 to-pink-600',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Email Marketing</h1>
          <p className="text-gray-600 mt-1">Quản lý email và gửi thông báo cho khách hàng</p>
        </div>
        <button
          onClick={() => setSendEmailModalOpen(true)}
          className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-shadow flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          Gửi Email
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-14 h-14 ${card.bgLight} rounded-xl flex items-center justify-center`}>
                {card.icon}
              </div>
              <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${card.gradient}`}></div>
            </div>
            <h3 className="text-gray-500 text-sm font-medium mb-2">{card.title}</h3>
            <p className="text-3xl font-bold text-gray-900">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button
          onClick={() => setSendEmailModalOpen(true)}
          className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-shadow text-left"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-2xl">
              📧
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg">Gửi Email</h3>
              <p className="text-sm text-gray-600">Gửi email cho khách hàng</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => setTemplatesModalOpen(true)}
          className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-shadow text-left"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white text-2xl">
              📝
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg">Mẫu Email</h3>
              <p className="text-sm text-gray-600">Quản lý mẫu email</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => setLogsModalOpen(true)}
          className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-shadow text-left"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-white text-2xl">
              📊
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg">Lịch Sử</h3>
              <p className="text-sm text-gray-600">Xem lịch sử gửi email</p>
            </div>
          </div>
        </button>
      </div>

      {/* Recent Logs */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Email gần đây</h2>
          <button
            onClick={() => setLogsModalOpen(true)}
            className="text-sm text-pink-600 hover:text-pink-700 font-semibold transition-colors"
          >
            Xem tất cả →
          </button>
        </div>

        {stats.recentLogs && stats.recentLogs.length > 0 ? (
          <div className="space-y-4">
            {stats.recentLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    log.status === 'sent' ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    <span className="text-xl">{log.status === 'sent' ? '✅' : '❌'}</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{log.subject}</p>
                    <p className="text-sm text-gray-600">
                      Gửi đến: {log.recipientEmail}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">
                    {formatDate(log.sentAt, 'dd/MM/yyyy')}
                  </p>
                  <p className="text-xs text-gray-400">
                    {formatDate(log.sentAt, 'HH:mm')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-gray-600">Chưa có email nào được gửi</p>
          </div>
        )}
      </div>

      {/* Modals */}
      <TemplatesModal
        isOpen={templatesModalOpen}
        onClose={() => setTemplatesModalOpen(false)}
        onSuccess={fetchStats}
      />

      <SendEmailModal
        isOpen={sendEmailModalOpen}
        onClose={() => setSendEmailModalOpen(false)}
        onSuccess={fetchStats}
      />

      <LogsModal
        isOpen={logsModalOpen}
        onClose={() => setLogsModalOpen(false)}
      />
    </div>
  );
}
