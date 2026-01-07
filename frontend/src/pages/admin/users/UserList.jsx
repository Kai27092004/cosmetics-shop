import { useState, useEffect } from 'react';
import userService from '../../../services/userService';
import UserTable from './components/UserTable';
import UserFilters from './components/UserFilters';
import UserStats from './components/UserStats';
import Alert from '../../../components/common/Alert';
import Loading from '../../../components/common/Loading';

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    role: '',
    sortBy: 'createdAt',
  });

  useEffect(() => {
    fetchUsers();
  }, [filters]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.getAllUsers(filters);
      setUsers(data);
    } catch (error) {
      setAlert({ type: 'error', message: error.message || 'Không thể tải danh sách người dùng' });
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleBlockUser = async (userId, isBlocked) => {
    const action = isBlocked ? 'bỏ chặn' : 'chặn';
    if (!window.confirm(`Bạn có chắc muốn ${action} người dùng này?`)) {
      return;
    }

    try {
      await userService.updateUser(userId, { isBlocked: !isBlocked });
      setAlert({ type: 'success', message: `Đã ${action} người dùng thành công!` });
      fetchUsers();
    } catch (error) {
      setAlert({ type: 'error', message: error.message || 'Thao tác thất bại' });
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

      {/* Alert */}
      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

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
        />
      )}
    </div>
  );
}