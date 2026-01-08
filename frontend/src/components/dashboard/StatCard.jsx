import { Link } from 'react-router-dom';

/**
 * StatCard - Card hiển thị thống kê số liệu
 */
export default function StatCard({ 
  title, 
  value, 
  icon, 
  trend, 
  trendValue, 
  color = 'blue',
  link 
}) {
  const colorClasses = {
    blue: {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      iconBg: 'bg-blue-100 dark:bg-blue-900',
      text: 'text-blue-700 dark:text-blue-400',
      border: 'border-blue-200 dark:border-blue-800',
    },
    green: {
      bg: 'bg-green-50 dark:bg-green-900/20',
      iconBg: 'bg-green-100 dark:bg-green-900',
      text:  'text-green-700 dark:text-green-400',
      border: 'border-green-200 dark:border-green-800',
    },
    yellow: {
      bg:  'bg-yellow-50 dark:bg-yellow-900/20',
      iconBg:  'bg-yellow-100 dark:bg-yellow-900',
      text: 'text-yellow-700 dark:text-yellow-400',
      border:  'border-yellow-200 dark:border-yellow-800',
    },
    red: {
      bg: 'bg-red-50 dark:bg-red-900/20',
      iconBg: 'bg-red-100 dark:bg-red-900',
      text:  'text-red-700 dark:text-red-400',
      border: 'border-red-200 dark:border-red-800',
    },
    purple: {
      bg: 'bg-purple-50 dark:bg-purple-900/20',
      iconBg: 'bg-purple-100 dark:bg-purple-900',
      text: 'text-purple-700 dark:text-purple-400',
      border: 'border-purple-200 dark:border-purple-800',
    },
  };

  const classes = colorClasses[color] || colorClasses.blue;

  const CardContent = () => (
    <div className={`${classes.bg} rounded-lg p-6 border-2 ${classes.border} hover:shadow-md transition-all`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 ${classes.iconBg} rounded-lg flex items-center justify-center`}>
          {icon}
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-sm font-semibold ${
            trend === 'up' ? 'text-green-600' : 'text-red-600'
          }`}>
            {trend === 'up' ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
              </svg>
            )}
            {trendValue}
          </div>
        )}
      </div>
      <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
        {title}
      </p>
      <p className={`text-3xl font-bold ${classes.text}`}>
        {value}
      </p>
    </div>
  );

  if (link) {
    return (
      <Link to={link}>
        <CardContent />
      </Link>
    );
  }

  return <CardContent />;
}