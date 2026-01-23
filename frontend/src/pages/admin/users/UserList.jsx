import { useState, useEffect } from 'react';
import userService from '../../../services/userService';
import UserTable from './components/UserTable';
import UserFilters from './components/UserFilters';
import UserStats from './components/UserStats';
import showToast from '../../../utils/toast';
import Loading from '../../../components/common/Loading';
import Modal from '../../../components/common/Modal';
import Button from '../../../components/common/Button';
import { formatDate } from '../../../utils/formatters';

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    role: '',
    sortBy: 'createdAt',
  });

  // View modal
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [userToView, setUserToView] = useState(null);

  // Delete confirmation modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, [filters]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      // Fetch all users without filters (backend doesn't support filtering)
      const data = await userService.getAllUsers({});

      // Apply client-side filtering and sorting
      let filteredUsers = [...data];

      // Filter by search
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filteredUsers = filteredUsers.filter(user =>
          user.fullName?.toLowerCase().includes(searchLower) ||
          user.email?.toLowerCase().includes(searchLower)
        );
      }

      // Filter by role
      if (filters.role) {
        filteredUsers = filteredUsers.filter(user => user.role === filters.role);
      }

      // Sort
      filteredUsers.sort((a, b) => {
        switch (filters.sortBy) {
          case 'createdAt': // Mới nhất
            return new Date(b.createdAt) - new Date(a.createdAt);
          case 'createdAt-asc': // Cũ nhất
            return new Date(a.createdAt) - new Date(b.createdAt);
          case 'fullName': // A-Z
            return (a.fullName || '').localeCompare(b.fullName || '');
          case 'fullName-desc': // Z-A
            return (b.fullName || '').localeCompare(a.fullName || '');
          default:
            return 0;
        }
      });

      setUsers(filteredUsers);
    } catch (error) {
      showToast.error(error.message || 'Không thể tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleView = (user) => {
    setUserToView(user);
    setViewModalOpen(true);
  };

  const handleCloseViewModal = () => {
    setViewModalOpen(false);
    setUserToView(null);
  };

  const handleBlockUser = async (userId, isBlocked) => {
    const action = isBlocked ? 'bỏ chặn' : 'chặn';

    try {
      // ✅ SỬA: Gọi đúng API toggleBlockUser
      const response = await userService.toggleBlockUser(userId);
      console.log('✅ Block/Unblock response:', response);

      showToast.success(response.message || `Đã ${action} người dùng thành công!`);

      // Refresh to get updated data
      await fetchUsers();
    } catch (error) {
      console.error('❌ Block/Unblock error:', error);
      showToast.error(error.message || 'Thao tác thất bại');
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    // Get current admin info from localStorage
    const currentAdmin = JSON.parse(localStorage.getItem('admin') || '{}');

    // Prevent admin from demoting themselves
    if (currentAdmin.id === userId && currentAdmin.role === 'admin' && newRole === 'customer') {
      showToast.error('Bạn không thể tự hạ quyền của mình!');
      fetchUsers(); // Refresh to reset dropdown
      return;
    }

    try {
      await userService.updateUser(userId, { role: newRole });
      showToast.success('Cập nhật vai trò thành công!');
      fetchUsers();
    } catch (error) {
      showToast.error(error.message || 'Cập nhật vai trò thất bại');
      fetchUsers(); // Refresh to reset dropdown on error
    }
  };

  const handleDeleteUser = (user) => {
    setUserToDelete(user);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;

    try {
      await userService.deleteUser(userToDelete.id);
      showToast.success('Xóa người dùng thành công!');
      setDeleteModalOpen(false);
      setUserToDelete(null);
      fetchUsers();
    } catch (error) {
      showToast.error(error.message || 'Xóa người dùng thất bại');
    }
  };

  const cancelDelete = () => {
    setDeleteModalOpen(false);
    setUserToDelete(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Quản lý người dùng</h1>
        <p className="text-gray-600 mt-1">
          Quản lý tài khoản và quyền truy cập
        </p>
      </div>

      {/* Stats */}
      <UserStats users={users} />

      {/* Filters */}
      <UserFilters
        filters={filters}
        onFilterChange={handleFilterChange}
      />

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loading size="lg" text="Đang tải người dùng..." />
        </div>
      ) : (
        <UserTable
          users={users}
          onBlockUser={handleBlockUser}
          onDeleteUser={handleDeleteUser}
          onView={handleView}
          onRoleChange={handleRoleChange}
        />
      )}

      {/* View User Detail Modal */}
      <Modal
        isOpen={viewModalOpen}
        onClose={handleCloseViewModal}
        title=""
        size="lg"
      >
        {userToView && (
          <div className="relative">
            {/* Gradient Header */}
            <div className="bg-gradient-to-r from-pink-500 to-purple-600 px-6 py-6">
              <div className="flex items-center gap-4 text-white">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <span className="text-3xl font-bold">
                    {userToView.fullName?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-pink-100">Người dùng</p>
                  <h2 className="text-2xl font-bold">{userToView.fullName}</h2>
                </div>
                <div className={`px-4 py-2 rounded-full font-semibold ${userToView.isBlocked
                  ? 'bg-red-100 text-red-700'
                  : 'bg-green-100 text-green-700'
                  }`}>
                  {userToView.isBlocked ? '✗ Đã chặn' : '✓ Hoạt động'}
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* User Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <h3 className="font-bold text-gray-900">Email</h3>
                  </div>
                  <p className="text-blue-700 font-semibold break-all">{userToView.email}</p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-5 border border-purple-200">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <h3 className="font-bold text-gray-900">Vai trò</h3>
                  </div>
                  <p className="text-purple-700 font-semibold">{userToView.role === 'admin' ? '👑 Admin' : '👤 Customer'}</p>
                </div>
              </div>

              {/* Contact Info */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border border-green-200">
                <div className="flex items-center gap-2 mb-3">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <h3 className="font-bold text-gray-900">Thông tin liên hệ</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Số điện thoại</p>
                    <p className="font-semibold text-gray-900">{userToView.phone || 'Chưa cập nhật'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Địa chỉ</p>
                    <p className="font-semibold text-gray-900">{userToView.address || 'Chưa cập nhật'}</p>
                  </div>
                </div>
              </div>

              {/* Join Date */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <h3 className="font-bold text-gray-900">Ngày tham gia</h3>
                </div>
                <p className="text-lg font-semibold text-gray-700">
                  {formatDate(userToView.createdAt, 'dd/MM/yyyy HH:mm')}
                </p>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button variant="secondary" onClick={handleCloseViewModal} className="px-6">
                  Đóng
                </Button>
                {userToView.role !== 'admin' && (
                  <button
                    onClick={() => {
                      handleCloseViewModal();
                      handleBlockUser(userToView.id, userToView.isBlocked);
                    }}
                    className={`px-6 py-2 ${userToView.isBlocked
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600'
                      : 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600'
                      } text-white font-semibold rounded-lg transition-all transform hover:scale-105 flex items-center gap-2`}
                  >
                    {userToView.isBlocked ? 'Bỏ chặn' : 'Chặn người dùng'}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={cancelDelete}
        title=""
        size="md"
      >
        <div className="relative overflow-hidden">
          {/* Gradient Header */}
          <div className="bg-gradient-to-r from-red-500 to-pink-500 px-6 py-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-4 animate-bounce">
              <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">
              Xác nhận xóa người dùng
            </h3>
            <p className="text-red-100">
              Hành động này không thể hoàn tác
            </p>
          </div>

          {/* Content */}
          <div className="p-6">
            {userToDelete && (
              <div className="space-y-4 mb-6">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-lg">
                        {userToDelete.fullName?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 font-medium">Người dùng</p>
                      <p className="text-lg font-bold text-gray-900">{userToDelete.fullName}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white rounded-lg p-3">
                      <p className="text-xs text-gray-500 mb-1">Email</p>
                      <p className="font-semibold text-gray-900 text-sm truncate">{userToDelete.email}</p>
                    </div>
                    <div className="bg-white rounded-lg p-3">
                      <p className="text-xs text-gray-500 mb-1">Vai trò</p>
                      <p className="font-semibold text-gray-900 text-sm">
                        {userToDelete.role === 'admin' ? '👑 Admin' : '👤 Customer'}
                      </p>
                    </div>
                  </div>

                  {userToDelete.stats && (
                    <div className="mt-3 bg-yellow-50 rounded-lg p-3 border border-yellow-200">
                      <p className="text-xs text-yellow-800 font-semibold mb-1">Thống kê</p>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-yellow-700">Tổng đơn hàng:</span>
                        <span className="font-bold text-yellow-900">{userToDelete.stats.totalOrders}</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="font-semibold text-yellow-800 text-sm">Lưu ý quan trọng</p>
                      <p className="text-yellow-700 text-xs mt-1">
                        Người dùng sẽ bị xóa vĩnh viễn khỏi hệ thống. Tất cả dữ liệu liên quan sẽ bị mất.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={cancelDelete}
                className="flex-1 py-3"
              >
                <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Hủy bỏ
              </Button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-3 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold rounded-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Xác nhận xóa
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}