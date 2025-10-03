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

const AdminSuppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: ''
  });
  const [formLoading, setFormLoading] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/admin/suppliers');
      setSuppliers(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      setLoading(false);
      toast.error('Failed to load suppliers');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      if (editingSupplier) {
        await api.put(`/api/admin/suppliers/${editingSupplier._id}`, formData);
        toast.success('Supplier updated successfully!');
      } else {
        await api.post('/api/admin/suppliers', formData);
        toast.success('Supplier created successfully!');
      }

      setShowModal(false);
      setEditingSupplier(null);
      resetFormData();
      fetchSuppliers();
    } catch (error) {
      console.error('Error saving supplier:', error);
      if (error.response?.data?.msg) {
        toast.error(error.response.data.msg);
      } else {
        toast.error('Failed to save supplier');
      }
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (supplier) => {
    setEditingSupplier(supplier);
    setFormData({
      name: supplier.name || '',
      phone: supplier.phone || '',
      email: supplier.email || '',
      address: supplier.address || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (supplier) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete "${supplier.name}". This action cannot be undone!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/api/admin/suppliers/${supplier._id}`);
        toast.success(`"${supplier.name}" deleted successfully!`);
        fetchSuppliers();
      } catch (error) {
        console.error('Error deleting supplier:', error);
        toast.error('Failed to delete supplier');
      }
    }
  };

  const resetFormData = () => {
    setFormData({
      name: '',
      phone: '',
      email: '',
      address: ''
    });
  };

  const resetForm = () => {
    setEditingSupplier(null);
    resetFormData();
    setShowModal(true);
  };

  // Frontend filtering and searching
  const filteredSuppliers = suppliers.filter(supplier => {
    const matchesSearch = supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         supplier.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         supplier.phone?.includes(searchTerm);
    
    let matchesFilter = true;
    if (filterType === 'withParts') {
      matchesFilter = supplier.spareParts && supplier.spareParts.length > 0;
    } else if (filterType === 'withoutParts') {
      matchesFilter = !supplier.spareParts || supplier.spareParts.length === 0;
    }
    
    return matchesSearch && matchesFilter;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredSuppliers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentSuppliers = filteredSuppliers.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterType, itemsPerPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  // Stats data for StatsCards component
  const statsData = [
    {
      label: 'Total Suppliers',
      value: suppliers.length,
      icon: 'fa-building',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600'
    },
    {
      label: 'With Parts',
      value: suppliers.filter(supplier => supplier.spareParts && supplier.spareParts.length > 0).length,
      icon: 'fa-link',
      bgColor: 'bg-green-100',
      textColor: 'text-green-600'
    },
    {
      label: 'Without Parts',
      value: suppliers.filter(supplier => !supplier.spareParts || supplier.spareParts.length === 0).length,
      icon: 'fa-unlink',
      bgColor: 'bg-orange-100',
      textColor: 'text-orange-600'
    },
    {
      label: 'Total Parts Supplied',
      value: suppliers.reduce((sum, supplier) => sum + (supplier.spareParts?.length || 0), 0),
      icon: 'fa-cogs',
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-600'
    }
  ];

  // Filter options for SearchAndFilters component
  const filterOptions = [
    { value: 'all', label: `All Suppliers (${suppliers.length})` },
    { value: 'withParts', label: `With Parts (${suppliers.filter(s => s.spareParts && s.spareParts.length > 0).length})` },
    { value: 'withoutParts', label: `Without Parts (${suppliers.filter(s => !s.spareParts || s.spareParts.length === 0).length})` }
  ];

  // Column configuration for DataTable component
  const columns = [
    {
      header: 'Supplier Name',
      key: 'supplier',
      render: (supplier) => (
        <div>
          <div className="text-sm font-semibold text-gray-900">{supplier.name}</div>
        </div>
      )
    },
    {
      header: 'Contact Info',
      key: 'contact',
      render: (supplier) => (
        <div className="space-y-1">
          {supplier.email && (
            <div className="flex items-center text-sm text-gray-700">
              <i className="fas fa-envelope text-red-600 mr-2 w-4"></i>
              {supplier.email}
            </div>
          )}
          {supplier.phone && (
            <div className="flex items-center text-sm text-gray-700">
              <i className="fas fa-phone text-red-600 mr-2 w-4"></i>
              {supplier.phone}
            </div>
          )}
          {supplier.address && (
            <div className="flex items-start text-sm text-gray-700">
              <i className="fas fa-map-marker-alt text-red-600 mr-2 w-4 mt-0.5"></i>
              <span className="break-words">{supplier.address}</span>
            </div>
          )}
          {!supplier.email && !supplier.phone && !supplier.address && (
            <div className="text-sm text-gray-400 italic">No contact info</div>
          )}
        </div>
      )
    },
    {
      header: 'Parts Supplied',
      key: 'parts',
      render: (supplier) => (
        <div>
          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
            supplier.spareParts && supplier.spareParts.length > 0
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-800'
          }`}>
            {supplier.spareParts?.length || 0} parts
          </span>
          {supplier.spareParts && supplier.spareParts.length > 0 && (
            <div className="text-xs text-gray-500 mt-1">
              {supplier.spareParts.slice(0, 2).map(part => part.name).join(', ')}
              {supplier.spareParts.length > 2 && ` +${supplier.spareParts.length - 2} more`}
            </div>
          )}
        </div>
      )
    },
    {
      header: 'Created',
      key: 'created',
      render: (supplier) => (
        <span className="text-sm text-gray-500">
          {new Date(supplier.createdAt).toLocaleDateString()}
        </span>
      )
    }
  ];

  // Pagination configuration for DataTable component
  const paginationConfig = {
    currentPage,
    totalPages,
    startIndex,
    endIndex,
    total: filteredSuppliers.length,
    onPageChange: handlePageChange
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <DashboardHeader
          title="Suppliers Management"
          subtitle="Manage suppliers and their parts catalog"
          buttonText="Add New Supplier"
          onButtonClick={resetForm}
          gradientFrom="from-red-600"
          gradientTo="to-red-700"
          buttonTextColor="text-red-600"
        />

        <StatsCards stats={statsData} />

        <SearchAndFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filterValue={filterType}
          onFilterChange={setFilterType}
          filterOptions={filterOptions}
          itemsPerPage={itemsPerPage}
          onItemsPerPageChange={handleItemsPerPageChange}
          searchPlaceholder="Search by name, email, or phone..."
          filterLabel="Filter by Type"
        />

        <DataTable
          columns={columns}
          data={currentSuppliers}
          loading={loading}
          emptyMessage="No suppliers found"
          emptyIcon="fa-building"
          onEdit={handleEdit}
          onDelete={handleDelete}
          pagination={paginationConfig}
        />
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingSupplier ? 'Edit Supplier' : 'Add New Supplier'}
        onSubmit={handleSubmit}
        loading={formLoading}
        submitText={editingSupplier ? 'Update Supplier' : 'Create Supplier'}
        editMode={!!editingSupplier}
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <i className="fas fa-building mr-2"></i>Supplier Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter supplier name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <i className="fas fa-phone mr-2"></i>Phone
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter phone number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <i className="fas fa-envelope mr-2"></i>Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter email address"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <i className="fas fa-map-marker-alt mr-2"></i>Address
            </label>
            <textarea
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter address"
              rows="2"
            />
          </div>
        </form>
      </Modal>
    </AdminLayout>
  );
};

export default AdminSuppliers;