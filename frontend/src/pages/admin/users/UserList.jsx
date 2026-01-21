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

    // Set loading to prevent multiple clicks
    setLoading(true);

    try {
      const response = await userService.updateUser(userId, { isBlocked: !isBlocked });
      console.log('✅ Block/Unblock response:', response);

      showToast.success(`Đã ${action} người dùng thành công!`);

      // Force refresh to get updated data
      await fetchUsers();
    } catch (error) {
      console.error('❌ Block/Unblock error:', error);
      showToast.error(error.message || 'Thao tác thất bại');
    } finally {
      setLoading(false);
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
    </div>
  );
}