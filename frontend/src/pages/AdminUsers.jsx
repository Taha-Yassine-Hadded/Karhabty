import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import DashboardHeader from '../components/DashboardHeader';
import StatsCards from '../components/StatsCards';
import SearchAndFilters from '../components/SearchAndFilters';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import api from '../utils/api';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
    entrepriseName: '',
    address: ''
  });
  const [formLoading, setFormLoading] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/admin/users');
      setUsers(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setLoading(false);
      toast.error('Failed to load users');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      const submitData = { ...formData };
      if (editingUser && !submitData.password) {
        delete submitData.password;
      }

      if (editingUser) {
        await api.put(`/api/admin/users/${editingUser._id}`, submitData);
        toast.success('User updated successfully!');
      } else {
        if (!submitData.password) {
          toast.error('Password is required for new users');
          setFormLoading(false);
          return;
        }
        await api.post('/api/admin/users', submitData);
        toast.success('User created successfully!');
      }

      setShowModal(false);
      setEditingUser(null);
      setFormData({ name: '', email: '', password: '', role: 'user', entrepriseName: '', address: '' });
      fetchUsers();
    } catch (error) {
      console.error('Error saving user:', error);
      if (error.response?.data?.msg) {
        toast.error(error.response.data.msg);
      } else {
        toast.error('Failed to save user');
      }
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role,
      entrepriseName: user.entrepriseName || '',
      address: user.address || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (user) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete user "${user.name}". This action cannot be undone!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete user!',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
      customClass: {
        popup: 'rounded-lg',
        confirmButton: 'rounded-lg px-4 py-2',
        cancelButton: 'rounded-lg px-4 py-2'
      }
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/api/admin/users/${user._id}`);
        
        toast.success(`User "${user.name}" deleted successfully!`);
        fetchUsers();
        
        Swal.fire({
          title: 'Deleted!',
          text: `User "${user.name}" has been deleted.`,
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
          customClass: {
            popup: 'rounded-lg'
          }
        });
      } catch (error) {
        console.error('Error deleting user:', error);
        if (error.response?.data?.msg) {
          toast.error(error.response.data.msg);
        } else {
          toast.error('Failed to delete user');
        }
        
        Swal.fire({
          title: 'Error!',
          text: 'Failed to delete user. Please try again.',
          icon: 'error',
          customClass: {
            popup: 'rounded-lg'
          }
        });
      }
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterRole, itemsPerPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const getRoleBadge = (role) => {
    const colors = {
      admin: 'bg-red-100 text-red-800 border-red-200',
      entreprise: 'bg-blue-100 text-blue-800 border-blue-200',
      user: 'bg-green-100 text-green-800 border-green-200'
    };
    return colors[role] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const resetForm = () => {
    setEditingUser(null);
    setFormData({ name: '', email: '', password: '', role: 'user', entrepriseName: '', address: '' });
    setShowModal(true);
  };

  // Stats data for StatsCards component
  const statsData = [
    {
      label: 'Total Users',
      value: users.length,
      icon: 'fa-users',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600'
    },
    {
      label: 'Admins',
      value: users.filter(u => u.role === 'admin').length,
      icon: 'fa-user-shield',
      bgColor: 'bg-red-100',
      textColor: 'text-red-600'
    },
    {
      label: 'Entreprises',
      value: users.filter(u => u.role === 'entreprise').length,
      icon: 'fa-building',
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-600'
    },
    {
      label: 'Regular Users',
      value: users.filter(u => u.role === 'user').length,
      icon: 'fa-user',
      bgColor: 'bg-green-100',
      textColor: 'text-green-600'
    }
  ];

  // Filter options for SearchAndFilters component
  const filterOptions = [
    { value: 'all', label: `All Roles (${users.length})` },
    { value: 'admin', label: `Admin (${users.filter(u => u.role === 'admin').length})` },
    { value: 'entreprise', label: `Entreprise (${users.filter(u => u.role === 'entreprise').length})` },
    { value: 'user', label: `User (${users.filter(u => u.role === 'user').length})` }
  ];

  // Column configuration for DataTable component
  const columns = [
    {
      header: 'User',
      key: 'user',
      render: (user) => (
        <div className="flex items-center">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-white text-lg font-bold">
              {user.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="ml-4">
            <div className="text-sm font-semibold text-gray-900">{user.name}</div>
            <div className="text-sm text-gray-500">{user.email}</div>
          </div>
        </div>
      )
    },
    {
      header: 'Role',
      key: 'role',
      render: (user) => (
        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${getRoleBadge(user.role)}`}>
          <i className={`fas ${user.role === 'admin' ? 'fa-user-shield' : user.role === 'entreprise' ? 'fa-building' : 'fa-user'} mr-1`}></i>
          {user.role}
        </span>
      )
    },
    {
      header: 'Company',
      key: 'entrepriseName',
      render: (user) => (
        <span className="text-sm text-gray-900">{user.entrepriseName || '-'}</span>
      )
    },
    {
      header: 'Joined',
      key: 'createdAt',
      render: (user) => (
        <span className="text-sm text-gray-500">{new Date(user.createdAt).toLocaleDateString()}</span>
      )
    }
  ];

  // Pagination configuration for DataTable component
  const paginationConfig = {
    currentPage,
    totalPages,
    startIndex,
    endIndex,
    total: filteredUsers.length,
    onPageChange: handlePageChange
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <DashboardHeader
          title="Users Management"
          subtitle="Manage all system users and their roles"
          buttonText="Add New User"
          onButtonClick={resetForm}
          gradientFrom="from-red-600"
          gradientTo="to-red-700"
          buttonTextColor="text-red-600"
        />

        <StatsCards stats={statsData} />

        <SearchAndFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filterValue={filterRole}
          onFilterChange={setFilterRole}
          filterOptions={filterOptions}
          itemsPerPage={itemsPerPage}
          onItemsPerPageChange={handleItemsPerPageChange}
          searchPlaceholder="Search by name or email..."
          filterLabel="Filter by Role"
        />

        <DataTable
          columns={columns}
          data={currentUsers}
          loading={loading}
          emptyMessage="No users found"
          emptyIcon="fa-users"
          onEdit={handleEdit}
          onDelete={handleDelete}
          pagination={paginationConfig}
        />
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingUser ? 'Edit User' : 'Add New User'}
        onSubmit={handleSubmit}
        loading={formLoading}
        submitText={editingUser ? 'Update User' : 'Create User'}
        editMode={!!editingUser}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <i className="fas fa-user mr-2"></i>Full Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <i className="fas fa-envelope mr-2"></i>Email Address *
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter email address"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <i className="fas fa-lock mr-2"></i>Password {editingUser ? '(leave blank to keep current)' : '*'}
            </label>
            <input
              type="password"
              required={!editingUser}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={editingUser ? "Leave blank to keep current password" : "Enter password"}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <i className="fas fa-user-tag mr-2"></i>Role *
            </label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="user">User</option>
              <option value="entreprise">Entreprise</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {formData.role === 'entreprise' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <i className="fas fa-building mr-2"></i>Company Name
                </label>
                <input
                  type="text"
                  value={formData.entrepriseName}
                  onChange={(e) => setFormData({ ...formData, entrepriseName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter company name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <i className="fas fa-map-marker-alt mr-2"></i>Address
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter company address"
                  rows="3"
                />
              </div>
            </>
          )}
        </form>
      </Modal>
    </AdminLayout>
  );
};

export default AdminUsers;