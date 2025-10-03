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
import { MultiSelect } from 'primereact/multiselect';

const AdminTechnician = () => {
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSpeciality, setFilterSpeciality] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingTechnician, setEditingTechnician] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    speciality: 'mechanic',
    cars: []
  });
  const [formLoading, setFormLoading] = useState(false);
  const [selectedCars, setSelectedCars] = useState([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Speciality options from model enum
  const specialityOptions = [
    { value: 'mechanic', label: 'Mechanic' },
    { value: 'electrician', label: 'Electrician' }
  ];

  // Car brands list (static list for selection)
  const carBrandOptions = [
    'Toyota', 'Honda', 'Ford', 'Chevrolet', 'Nissan', 
    'BMW', 'Mercedes-Benz', 'Audi', 'Volkswagen', 'Hyundai',
    'Kia', 'Mazda', 'Subaru', 'Lexus', 'Infiniti',
    'Acura', 'Cadillac', 'Lincoln', 'Buick', 'GMC',
    'Jeep', 'Ram', 'Dodge', 'Chrysler', 'Mitsubishi',
    'Volvo', 'Jaguar', 'Land Rover', 'Porsche', 'Mini',
    'Fiat', 'Alfa Romeo', 'Maserati', 'Ferrari', 'Lamborghini',
    'Bentley', 'Rolls-Royce', 'Aston Martin', 'McLaren',
    'Tesla', 'Rivian', 'Lucid', 'Polestar'
  ].map(brand => ({ name: brand, value: brand }));

  useEffect(() => {
    fetchTechnicians();
  }, []);

  const fetchTechnicians = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/admin/technicians');
      setTechnicians(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching technicians:', error);
      setLoading(false);
      toast.error('Failed to load technicians');
    }
  };

  const handleSubmit = async () => {
    setFormLoading(true);

    try {
      // Debug: Log the selected cars to see their structure
      console.log('Selected cars:', selectedCars);
      
      // Fix the mapping - handle both object and string formats
      const carsArray = selectedCars.map(car => {
        if (typeof car === 'string') {
          return car;
        } else if (car && car.value) {
          return car.value;
        } else if (car && car.name) {
          return car.name;
        } else {
          console.warn('Unexpected car format:', car);
          return null;
        }
      }).filter(Boolean); // Remove any null values

      const submitData = {
        ...formData,
        cars: carsArray
      };

      console.log('Submit data:', submitData);

      if (editingTechnician) {
        await api.put(`/api/admin/technicians/${editingTechnician._id}`, submitData);
        toast.success('Technician updated successfully!');
      } else {
        await api.post('/api/admin/technicians', submitData);
        toast.success('Technician created successfully!');
      }

      setShowModal(false);
      setEditingTechnician(null);
      resetFormData();
      fetchTechnicians();
    } catch (error) {
      console.error('Error saving technician:', error);
      if (error.response?.data?.msg) {
        toast.error(error.response.data.msg);
      } else {
        toast.error('Failed to save technician');
      }
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (technician) => {
    setEditingTechnician(technician);
    setFormData({
      name: technician.name || '',
      speciality: technician.speciality || 'mechanic',
      cars: technician.cars || []
    });
    
    // Set selected cars for editing
    const selected = (technician.cars || []).map(car => ({ name: car, value: car }));
    setSelectedCars(selected);
    setShowModal(true);
  };

  const handleDelete = async (technician) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete technician "${technician.name}". This action cannot be undone!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/api/admin/technicians/${technician._id}`);
        toast.success(`Technician "${technician.name}" deleted successfully!`);
        fetchTechnicians();
      } catch (error) {
        console.error('Error deleting technician:', error);
        toast.error('Failed to delete technician');
      }
    }
  };

  const resetFormData = () => {
    setFormData({
      name: '',
      speciality: 'mechanic',
      cars: []
    });
    setSelectedCars([]);
  };

  const resetForm = () => {
    setEditingTechnician(null);
    resetFormData();
    setShowModal(true);
  };

  // Frontend filtering and searching
  const filteredTechnicians = technicians.filter((technician) => {
    const matchesSearch = technician.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpeciality = filterSpeciality === 'all' || technician.speciality === filterSpeciality;
    return matchesSearch && matchesSpeciality;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredTechnicians.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTechnicians = filteredTechnicians.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterSpeciality, itemsPerPage]);

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
      label: 'Total Technicians',
      value: technicians.length,
      icon: 'fa-users-cog',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600',
    },
    {
      label: 'Mechanics',
      value: technicians.filter(tech => tech.speciality === 'mechanic').length,
      icon: 'fa-wrench',
      bgColor: 'bg-green-100',
      textColor: 'text-green-600',
    },
    {
      label: 'Electricians',
      value: technicians.filter(tech => tech.speciality === 'electrician').length,
      icon: 'fa-bolt',
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-600',
    },
    {
      label: 'Car Brands Covered',
      value: [...new Set(technicians.flatMap(tech => tech.cars || []))].length,
      icon: 'fa-car',
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-600',
    },
  ];

  // Filter options for SearchAndFilters component
  const filterOptions = [
    { value: 'all', label: `All Specialities (${technicians.length})` },
    ...specialityOptions.map((speciality) => ({
      value: speciality.value,
      label: `${speciality.label} (${technicians.filter((tech) => tech.speciality === speciality.value).length})`,
    })),
  ];

  // Column configuration for DataTable component
  const columns = [
    {
      header: 'Technician Name',
      key: 'technician',
      render: (technician) => (
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-lg">
              {technician.name.charAt(0).toUpperCase()}
            </span>
          </div>
            <div className="text-sm font-semibold text-gray-900">{technician.name}</div>
        </div>
      ),
    },
    {
      header: 'Speciality',
      key: 'speciality',
      render: (technician) => (
        <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full capitalize ${
          technician.speciality === 'mechanic' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-yellow-100 text-yellow-800'
        }`}>
          <i className={`fas ${technician.speciality === 'mechanic' ? 'fa-wrench' : 'fa-bolt'} mr-1`}></i>
          {technician.speciality}
        </span>
      ),
    },
    {
      header: 'Car Brands',
      key: 'cars',
      render: (technician) => (
        <div>
          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
            technician.cars && technician.cars.length > 0
              ? 'bg-blue-100 text-blue-800'
              : 'bg-gray-100 text-gray-800'
          }`}>
            <i className="fas fa-car mr-1"></i>
            {technician.cars?.length || 0} brands
          </span>
          {technician.cars && technician.cars.length > 0 && (
            <div className="text-xs text-gray-500 mt-1">
              {technician.cars.slice(0, 3).join(', ')}
              {technician.cars.length > 3 && ` +${technician.cars.length - 3} more`}
            </div>
          )}
        </div>
      ),
    },
    {
      header: 'Created',
      key: 'created',
      render: (technician) => (
        <span className="text-sm text-gray-500">
          {new Date(technician.createdAt).toLocaleDateString()}
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
    total: filteredTechnicians.length,
    onPageChange: handlePageChange,
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <DashboardHeader
          title="Technician Management"
          subtitle="Manage mechanics and electricians"
          buttonText="Add New Technician"
          onButtonClick={resetForm}
          gradientFrom="from-red-600"
          gradientTo="to-red-700"
          buttonTextColor="text-red-600"
        />

        <StatsCards stats={statsData} />

        <SearchAndFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filterValue={filterSpeciality}
          onFilterChange={setFilterSpeciality}
          filterOptions={filterOptions}
          itemsPerPage={itemsPerPage}
          onItemsPerPageChange={handleItemsPerPageChange}
          searchPlaceholder="Search by technician name..."
          filterLabel="Filter by Speciality"
        />

        <DataTable
          columns={columns}
          data={currentTechnicians}
          loading={loading}
          emptyMessage="No technicians found"
          emptyIcon="fa-users-cog"
          onEdit={handleEdit}
          onDelete={handleDelete}
          pagination={paginationConfig}
        />
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingTechnician ? 'Edit Technician' : 'Add New Technician'}
        onSubmit={handleSubmit}
        loading={formLoading}
        submitText={editingTechnician ? 'Update Technician' : 'Create Technician'}
        editMode={!!editingTechnician}
        maxWidth="max-w-2xl"
      >
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <i className="fas fa-user mr-2 text-blue-600"></i>Technician Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter technician name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <i className="fas fa-tools mr-2 text-blue-600"></i>Speciality *
            </label>
            <select
              required
              value={formData.speciality}
              onChange={(e) => setFormData({ ...formData, speciality: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {specialityOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <i className="fas fa-car mr-2 text-blue-600"></i>Car Brands Specialized In
            </label>
            <MultiSelect 
              value={selectedCars} 
              onChange={(e) => setSelectedCars(e.value)} 
              options={carBrandOptions} 
              optionLabel="name" 
              display="chip"
              filter 
              filterDelay={400} 
              placeholder="Select car brands the technician specializes in" 
              maxSelectedLabels={5} 
              className="w-full border border-gray-300 rounded-lg"
            />
            <p className="text-xs text-gray-500 mt-1">
              Select the car brands this technician has expertise with
            </p>
          </div>
        </div>
      </Modal>
    </AdminLayout>
  );
};

export default AdminTechnician;