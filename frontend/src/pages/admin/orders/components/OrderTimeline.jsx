import { formatDate } from '../../../../utils/formatters';
import { ORDER_STATUS_LABELS } from '../../../../utils/constants';

export default function OrderTimeline({ order }) {
  const timelineSteps = [
    {
      status: 'pending',
      label: ORDER_STATUS_LABELS.pending,
      icon: '🕐',
      colors: {
        bg: 'bg-yellow-100',
        border: 'border-yellow-500',
        line: 'bg-yellow-500',
        ring: 'ring-yellow-200',
        text: 'text-yellow-600'
      },
      date: order.createdAt,
    },
    {
      status: 'processing',
      label: ORDER_STATUS_LABELS.processing,
      icon: '⚙️',
      colors: {
        bg: 'bg-blue-100',
        border: 'border-blue-500',
        line: 'bg-blue-500',
        ring: 'ring-blue-200',
        text: 'text-blue-600'
      },
      date: order.processingAt || null,
    },
    {
      status: 'shipped',
      label: ORDER_STATUS_LABELS.shipped,
      icon: '🚚',
      colors: {
        bg: 'bg-purple-100',
        border: 'border-purple-500',
        line: 'bg-purple-500',
        ring: 'ring-purple-200',
        text: 'text-purple-600'
      },
      date: order.shippedAt || null,
    },
    {
      status: 'delivered',
      label: ORDER_STATUS_LABELS.delivered,
      icon: '✅',
      colors: {
        bg: 'bg-green-100',
        border: 'border-green-500',
        line: 'bg-green-500',
        ring: 'ring-green-200',
        text: 'text-green-600'
      },
      date: order.deliveredAt || null,
    },
  ];

  // Nếu đơn bị hủy, thay thế timeline
  if (order.status === 'cancelled') {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          Lịch sử đơn hàng
        </h2>
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                <span className="text-lg">🕐</span>
              </div>
              <div className="flex-1 w-0.5 bg-gray-300 mt-2"></div>
            </div>
            <div className="flex-1 pb-8">
              <p className="font-semibold text-gray-900">Đơn hàng đã tạo</p>
              <p className="text-sm text-gray-500">
                {formatDate(order.createdAt, 'dd/MM/yyyy HH:mm')}
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-lg">❌</span>
              </div>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-red-600">Đơn hàng đã bị hủy</p>
              <p className="text-sm text-gray-500">
                {formatDate(order.cancelledAt || order.updatedAt, 'dd/MM/yyyy HH:mm')}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentIndex = timelineSteps.findIndex(step => step.status === order.status);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-bold text-gray-900 mb-4">
        Lịch sử đơn hàng
      </h2>

      <div className="space-y-4">
        {timelineSteps.map((step, index) => {
          const isCompleted = index <= currentIndex;
          const isCurrent = index === currentIndex;
          const isLast = index === timelineSteps.length - 1;

          return (
            <div key={step.status} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                    isCompleted
                      ? `${step.colors.bg} ${step.colors.border}`
                      : 'bg-gray-100 border-gray-300'
                  } ${isCurrent ? `ring-4 ${step.colors.ring}` : ''}`}
                >
                  <span className={`text-lg ${isCompleted ? '' : 'opacity-30'}`}>
                    {step.icon}
                  </span>
                </div>
                {!isLast && (
                  <div
                    className={`flex-1 w-0.5 mt-2 ${
                      isCompleted ? step.colors.line : 'bg-gray-300'
                    }`}
                    style={{ minHeight: '2rem' }}
                  ></div>
                )}
              </div>

              <div className={`flex-1 pb-8 ${isLast ? 'pb-0' : ''}`}>
                <p
                  className={`font-semibold ${
                    isCompleted ? 'text-gray-900' : 'text-gray-400'
                  } ${isCurrent ? step.colors.text : ''}`}
                >
                  {step.label}
                </p>
                {step.date ? (
                  <p className="text-sm text-gray-500">
                    {formatDate(step.date, 'dd/MM/yyyy HH:mm')}
                  </p>
                ) : (
                  <p className="text-sm text-gray-400 italic">Chưa thực hiện</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}