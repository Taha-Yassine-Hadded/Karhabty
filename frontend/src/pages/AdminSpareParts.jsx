import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import DashboardHeader from '../components/DashboardHeader';
import StatsCards from '../components/StatsCards';
import SearchAndFilters from '../components/SearchAndFilters';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import ImageUpload from '../components/ImageUpload';
import api from '../utils/api';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';
import { MultiSelect } from 'primereact/multiselect';

const AdminSpareParts = () => {
  const [spareParts, setSpareParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingPart, setEditingPart] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'engine',
    brand: '',
    price: '',
    stock: '',
    lifespanKm: '',
    lifespanMonths: '',
    suppliers: [],
    img: ''
  });
  const [formLoading, setFormLoading] = useState(false);
  const [allSuppliers, setAllSuppliers] = useState([]);
  const [selectedSuppliers, setSelectedSuppliers] = useState([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Category options from model enum
  const categoryOptions = [
    { value: 'engine', label: 'Engine' },
    { value: 'electrical', label: 'Electrical' },
    { value: 'brakes', label: 'Brakes' },
    { value: 'body', label: 'Body' },
    { value: 'other', label: 'Other' },
  ];

  useEffect(() => {
    fetchSpareParts();
    fetchSuppliers();
  }, []);

  const fetchSpareParts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/admin/spare-parts');
      setSpareParts(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching spare parts:', error);
      setLoading(false);
      toast.error('Failed to load spare parts');
    }
  };

  const fetchSuppliers = async () => {
    try {
      const response = await api.get('/api/admin/suppliers');
      const suppliers = response.data.map(supplier => ({
        _id: supplier._id,
        name: supplier.name,
        email: supplier.email || 'No email',
        phone: supplier.phone || 'No phone',
        address: supplier.address || 'No address'
      }));
      setAllSuppliers(suppliers);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      toast.error('Failed to load suppliers');
    }
  };

  const handleSubmit = async () => {
    setFormLoading(true);

    try {
      const submitData = {
        ...formData,
        price: parseFloat(formData.price) || 0,
        stock: parseInt(formData.stock) || 0,
        lifespanKm: formData.lifespanKm ? parseInt(formData.lifespanKm) : undefined,
        lifespanMonths: formData.lifespanMonths ? parseInt(formData.lifespanMonths) : undefined,
        suppliers: selectedSuppliers.map((supplier) => supplier._id),
      };

      if (editingPart) {
        await api.put(`/api/admin/spare-parts/${editingPart._id}`, submitData);
        toast.success('Spare part updated successfully!');
      } else {
        await api.post('/api/admin/spare-parts', submitData);
        toast.success('Spare part created successfully!');
      }

      setShowModal(false);
      setEditingPart(null);
      resetFormData();
      fetchSpareParts();
    } catch (error) {
      console.error('Error saving spare part:', error);
      if (error.response?.data?.msg) {
        toast.error(error.response.data.msg);
      } else {
        toast.error('Failed to save spare part');
      }
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (part) => {
    setEditingPart(part);
    setFormData({
      name: part.name || '',
      category: part.category || 'engine',
      brand: part.brand || '',
      price: part.price?.toString() || '',
      stock: part.stock?.toString() || '',
      lifespanKm: part.lifespanKm?.toString() || '',
      lifespanMonths: part.lifespanMonths?.toString() || '',
      suppliers: part.suppliers || [],
      img: part.img || ''
    });
    
    // Set selected suppliers for editing
    const partSupplierIds = part.suppliers?.map(s => s._id || s) || [];
    const selected = allSuppliers.filter((supplier) =>
      partSupplierIds.includes(supplier._id)
    );
    setSelectedSuppliers(selected);
    setShowModal(true);
  };

  const handleDelete = async (part) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete "${part.name}". This action cannot be undone!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/api/admin/spare-parts/${part._id}`);
        toast.success(`"${part.name}" deleted successfully!`);
        fetchSpareParts();
      } catch (error) {
        console.error('Error deleting spare part:', error);
        toast.error('Failed to delete spare part');
      }
    }
  };

  const resetFormData = () => {
    setFormData({
      name: '',
      category: 'engine',
      brand: '',
      price: '',
      stock: '',
      lifespanKm: '',
      lifespanMonths: '',
      suppliers: [],
      img: ''
    });
    setSelectedSuppliers([]);
  };

  const resetForm = () => {
    setEditingPart(null);
    resetFormData();
    setShowModal(true);
  };

  // Frontend filtering and searching
  const filteredParts = spareParts.filter((part) => {
    const matchesSearch =
      part.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      part.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || part.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredParts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentParts = filteredParts.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterCategory, itemsPerPage]);

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
      label: 'Total Parts',
      value: spareParts.length,
      icon: 'fa-cogs',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600',
    },
    {
      label: 'Categories',
      value: categoryOptions.length,
      icon: 'fa-tags',
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-600',
    },
    {
      label: 'Total Stock',
      value: spareParts.reduce((sum, part) => sum + part.stock, 0),
      icon: 'fa-boxes',
      bgColor: 'bg-green-100',
      textColor: 'text-green-600',
    },
    {
      label: 'Total Value',
      value: `$${spareParts
        .reduce((sum, part) => sum + part.price * part.stock, 0)
        .toFixed(2)}`,
      icon: 'fa-dollar-sign',
      bgColor: 'bg-orange-100',
      textColor: 'text-orange-600',
    },
  ];

  // Filter options for SearchAndFilters component
  const filterOptions = [
    { value: 'all', label: `All Categories (${spareParts.length})` },
    ...categoryOptions.map((category) => ({
      value: category.value,
      label: `${category.label} (${spareParts.filter((part) => part.category === category.value).length})`,
    })),
  ];

  // Column configuration for DataTable component
  const columns = [
    {
      header: 'Part Details',
      key: 'part',
      render: (part) => (
        <div className="flex items-center space-x-3">
          {part.img ? (
            <img
              src={part.img.startsWith('http') ? part.img : `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${part.img}`}
              alt={part.name}
              className="w-12 h-12 object-cover rounded-lg border"
            />
          ) : (
            <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
              <i className="fas fa-image text-gray-400"></i>
            </div>
          )}
          <div>
            <div className="text-sm font-semibold text-gray-900">{part.name}</div>
            <div className="text-xs text-gray-500">{part.brand}</div>
          </div>
        </div>
      ),
    },
    {
      header: 'Category',
      key: 'category',
      render: (part) => (
        <span className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full capitalize">
          {part.category}
        </span>
      ),
    },
    {
      header: 'Price & Lifespan',
      key: 'price',
      render: (part) => (
        <div>
          <span className="text-sm font-medium text-gray-900">${part.price}</span>
          {part.lifespanKm && (
            <div className="text-xs text-gray-500">{part.lifespanKm} km</div>
          )}
          {part.lifespanMonths && (
            <div className="text-xs text-gray-500">{part.lifespanMonths} months</div>
          )}
        </div>
      ),
    },
    {
      header: 'Stock',
      key: 'stock',
      render: (part) => (
        <span className="inline-flex px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
          {part.stock} units
        </span>
      ),
    },
    {
      header: 'Suppliers',
      key: 'suppliers',
      render: (part) => (
        <div>
          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
            part.suppliers && part.suppliers.length > 0
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-800'
          }`}>
            {part.suppliers?.length || 0} suppliers
          </span>
          {part.suppliers && part.suppliers.length > 0 && (
            <div className="text-xs text-gray-500 mt-1">
              {part.suppliers.slice(0, 2).map(supplier => supplier.name).join(', ')}
              {part.suppliers.length > 2 && ` +${part.suppliers.length - 2} more`}
            </div>
          )}
        </div>
      ),
    },
    {
      header: 'Created',
      key: 'created',
      render: (part) => (
        <span className="text-sm text-gray-500">
          {new Date(part.createdAt).toLocaleDateString()}
        </span>
      ),
    },
  ];

  // Pagination configuration for DataTable component
  const paginationConfig = {
    currentPage,
    totalPages,
    startIndex,
    endIndex,
    total: filteredParts.length,
    onPageChange: handlePageChange,
  };

  // Handle image upload
  const handleImageUpload = (imageUrl) => {
    setFormData({ ...formData, img: imageUrl });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <DashboardHeader
          title="Spare Parts Management"
          subtitle="Manage inventory and spare parts catalog"
          buttonText="Add New Part"
          onButtonClick={resetForm}
          gradientFrom="from-red-600"
          gradientTo="to-red-700"
          buttonTextColor="text-red-600"
        />

        <StatsCards stats={statsData} />

        <SearchAndFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filterValue={filterCategory}
          onFilterChange={setFilterCategory}
          filterOptions={filterOptions}
          itemsPerPage={itemsPerPage}
          onItemsPerPageChange={handleItemsPerPageChange}
          searchPlaceholder="Search by name or brand..."
          filterLabel="Filter by Category"
        />

        <DataTable
          columns={columns}
          data={currentParts}
          loading={loading}
          emptyMessage="No spare parts found"
          emptyIcon="fa-cogs"
          onEdit={handleEdit}
          onDelete={handleDelete}
          pagination={paginationConfig}
        />
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingPart ? 'Edit Spare Part' : 'Add New Spare Part'}
        onSubmit={handleSubmit}
        loading={formLoading}
        submitText={editingPart ? 'Update Part' : 'Create Part'}
        editMode={!!editingPart}
        maxWidth="max-w-4xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <i className="fas fa-image mr-2 text-blue-600"></i>Part Image
            </label>
            <ImageUpload
              onImageUpload={handleImageUpload}
              currentImage={formData.img ? (formData.img.startsWith('http') ? formData.img : `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${formData.img}`) : null}
              className="mb-4"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <i className="fas fa-cog mr-2 text-blue-600"></i>Part Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter part name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <i className="fas fa-tags mr-2 text-blue-600"></i>Category *
            </label>
            <select
              required
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categoryOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <i className="fas fa-trademark mr-2 text-blue-600"></i>Brand *
            </label>
            <input
              type="text"
              required
              value={formData.brand}
              onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter brand name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <i className="fas fa-dollar-sign mr-2 text-blue-600"></i>Price *
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              required
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <i className="fas fa-boxes mr-2 text-blue-600"></i>Stock Quantity *
            </label>
            <input
              type="number"
              min="0"
              required
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <i className="fas fa-road mr-2 text-blue-600"></i>Lifespan (KM)
            </label>
            <input
              type="number"
              min="0"
              value={formData.lifespanKm}
              onChange={(e) => setFormData({ ...formData, lifespanKm: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., 50000"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <i className="fas fa-calendar mr-2 text-blue-600"></i>Lifespan (Months)
            </label>
            <input
              type="number"
              min="0"
              value={formData.lifespanMonths}
              onChange={(e) => setFormData({ ...formData, lifespanMonths: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., 12"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <i className="fas fa-users mr-2 text-blue-600"></i>Suppliers
            </label>
            <MultiSelect 
              value={selectedSuppliers} 
              onChange={(e) => setSelectedSuppliers(e.value)} 
              options={allSuppliers} 
              optionLabel="name" 
              display="chip"
              filter 
              filterDelay={400} 
              placeholder="Select Suppliers" 
              maxSelectedLabels={3} 
              className="w-full border border-gray-300 rounded-lg"
            />
          </div>
        </div>
      </Modal>
    </AdminLayout>
  );
};

export default AdminSpareParts;