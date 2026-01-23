import { formatDate } from '../../../../utils/formatters';

export default function UserTable({ users, onBlockUser, onDeleteUser, onView, onRoleChange }) {
  if (!users || users.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-12 text-center">
        <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Không có người dùng nào
        </h3>
        <p className="text-gray-600">
          Danh sách người dùng trống
        </p>
      </div>
    );
  }

  const getRoleBadge = (role) => {
    if (role === 'admin') {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-bold text-purple-700 bg-purple-100 rounded-full border border-purple-300">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
          </svg>
          Admin
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold text-blue-700 bg-blue-100 rounded-full">
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
        </svg>
        Customer
      </span>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b-2 border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Người dùng
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Vai trò
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Số điện thoại
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Ngày tham gia
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                {/* Người dùng */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        {user.fullName?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className="text-sm font-bold text-gray-900">
                        {user.fullName}
                      </div>
                      <div className="text-xs text-gray-500">
                        ID: #{user.id}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Email */}
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{user.email}</div>
                </td>

                {/* Vai trò */}
                <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                  <select
                    value={user.role}
                    onChange={(e) => {
                      e.stopPropagation();
                      onRoleChange(user.id, e.target.value);
                    }}
                    disabled={(() => {
                      const currentAdmin = JSON.parse(localStorage.getItem('admin') || '{}');
                      return currentAdmin.id === user.id && currentAdmin.role === 'admin';
                    })()}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border-2 focus:outline-none focus:ring-2 focus:ring-offset-1 ${user.role === 'admin'
                      ? 'bg-purple-50 text-purple-700 border-purple-200 focus:ring-purple-400'
                      : 'bg-blue-50 text-blue-700 border-blue-200 focus:ring-blue-400'
                      } ${(() => {
                        const currentAdmin = JSON.parse(localStorage.getItem('admin') || '{}');
                        return currentAdmin.id === user.id && currentAdmin.role === 'admin' ? 'opacity-60 cursor-not-allowed' : '';
                      })()}`}
                    title={(() => {
                      const currentAdmin = JSON.parse(localStorage.getItem('admin') || '{}');
                      return currentAdmin.id === user.id && currentAdmin.role === 'admin' ? 'Bạn không thể thay đổi vai trò của chính mình' : 'Thay đổi vai trò';
                    })()}
                  >
                    <option value="customer">👤 Customer</option>
                    <option value="admin">👑 Admin</option>
                  </select>
                </td>

                {/* Số điện thoại */}
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">
                    {user.phone || <span className="text-gray-400 italic">Chưa cập nhật</span>}
                  </div>
                </td>

                {/* Ngày tham gia */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {formatDate(user.createdAt, 'dd/MM/yyyy')}
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatDate(user.createdAt, 'HH:mm')}
                  </div>
                </td>

                {/* Trạng thái */}
                <td className="px-6 py-4 whitespace-nowrap">
                  {user.isBlocked ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold text-red-700 bg-red-100 rounded-full">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" />
                      </svg>
                      Đã chặn
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded-full">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Hoạt động
                    </span>
                  )}
                </td>

                {/* Thao tác */}
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="flex items-center justify-end gap-2">
                    {/* View */}
                    <button
                      onClick={() => onView(user)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Xem chi tiết"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>

                    {/* Block/Unblock - Inline Toggle */}
                    {user.role !== 'admin' && (
                      <button
                        onClick={() => onBlockUser(user.id, user.isBlocked)}
                        className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all transform hover:scale-105 flex items-center gap-1 shadow-md ${user.isBlocked
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white'
                          : 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white'
                          }`}
                        title={user.isBlocked ? 'Bỏ chặn người dùng' : 'Chặn người dùng'}
                      >
                        {user.isBlocked ? (
                          <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Bỏ chặn
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                            </svg>
                            Chặn
                          </>
                        )}
                      </button>
                    )}

                    {/* Delete - Only for non-admin users */}
                    {user.role !== 'admin' && (
                      <button
                        onClick={() => onDeleteUser(user)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Xóa người dùng"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-700">
            Hiển thị <span className="font-semibold">{users.length}</span> người dùng
          </p>
        </div>
      </div>
    </div>
  );
}