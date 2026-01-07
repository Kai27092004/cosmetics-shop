import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '../../../../utils/constants';

export default function OrderStatusBadge({ status, size = 'md' }) {
  const statusConfig = {
    pending: {
      icon: '🕐',
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-800',
      borderColor: 'border-yellow-300',
    },
    processing: {
      icon: '⚙️',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-800',
      borderColor: 'border-blue-300',
    },
    shipped: {
      icon: '🚚',
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-800',
      borderColor: 'border-purple-300',
    },
    delivered: {
      icon: '✅',
      bgColor: 'bg-green-100',
      textColor: 'text-green-800',
      borderColor: 'border-green-300',
    },
    cancelled: {
      icon: '❌',
      bgColor: 'bg-red-100',
      textColor: 'text-red-800',
      borderColor: 'border-red-300',
    },
  };

  const config = statusConfig[status] || statusConfig.pending;
  
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 ${sizeClasses[size]} font-semibold ${config.bgColor} ${config.textColor} border ${config.borderColor} rounded-full`}
    >
      <span>{config.icon}</span>
      <span>{ORDER_STATUS_LABELS[status] || status}</span>
    </span>
  );
}