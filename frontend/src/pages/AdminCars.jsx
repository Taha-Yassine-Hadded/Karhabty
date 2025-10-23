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

const AdminCars = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBrand, setFilterBrand] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/admin/cars');
      setCars(response.data);
    } catch (error) {
      console.error('Error fetching cars:', error);
      toast.error('Failed to fetch cars');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCar = async (car) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete car!',
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
        await api.delete(`/api/admin/cars/${car._id}`);
        
        toast.success(`Car "${car.brand} ${car.model}" deleted successfully!`);
        fetchCars();
        
        Swal.fire({
          title: 'Deleted!',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
          customClass: {
            popup: 'rounded-lg'
          }
        });
      } catch (error) {
        console.error('Error deleting car:', error);
        if (error.response?.data?.msg) {
          toast.error(error.response.data.msg);
        } else {
          toast.error('Failed to delete car');
        }
        
        Swal.fire({
          title: 'Error!',
          icon: 'error',
          customClass: {
            popup: 'rounded-lg'
          }
        });
      }
    }
  };



  // Filter cars based on search and filters
  const filteredCars = cars.filter(car => {
    const matchesSearch = car.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         car.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         car.owner?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         car.owner?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesBrand = filterBrand === '' || car.brand.toLowerCase().includes(filterBrand.toLowerCase());
    
    return matchesSearch && matchesBrand;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCars = filteredCars.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredCars.length / itemsPerPage);

  // Pagination helpers
  const startIndex = indexOfFirstItem + 1;
  const endIndex = Math.min(indexOfLastItem, filteredCars.length);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  // Get unique brands for filters
  const uniqueBrands = [...new Set(cars.map(car => car.brand))];

  // Stats data
  const statsData = [
    {
      label: 'Total Cars',
      value: cars.length,
      icon: 'fa-car',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600'
    },
    {
      label: 'Active Owners',
      value: new Set(cars.map(car => car.owner?._id).filter(Boolean)).size,
      icon: 'fa-users',
      bgColor: 'bg-green-100',
      textColor: 'text-green-600'
    },
    {
      label: 'Car Brands',
      value: uniqueBrands.length,
      icon: 'fa-tags',
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-600'
    },
    {
      label: 'Avg Spare Parts',
      value: cars.length > 0 ? Math.round(cars.reduce((sum, car) => sum + (car.spareParts?.length || 0), 0) / cars.length) : 0,
      icon: 'fa-cogs',
      bgColor: 'bg-orange-100',
      textColor: 'text-orange-600'
    }
  ];

  // Table columns
  const columns = [
    {
      header: 'Car',
      key: 'car',
      render: (car) => (
        <div className="flex items-center">
          <div className="w-12 h-12 rounded-lg overflow-hidden shadow-md">
            <img 
              src={car.image ? `http://localhost:5000${car.image}` : '/assets/img/car-placeholder.png'} 
              alt={`${car.brand} ${car.model}`}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="ml-4">
            <div className="font-semibold text-gray-900">{car.brand} {car.model}</div>
            <div className="text-sm text-gray-500">{car.year}</div>
          </div>
        </div>
      )
    },
    {
      header: 'Kilometrage',
      key: 'kilometrage',
      render: (car) => (
        <span className="text-gray-900 font-medium">
          {car.kilometrage?.toLocaleString() || 0} km
        </span>
      )
    },
    {
      header: 'Owner',
      key: 'owner',
      render: (car) => (
        <div>
          <div className="font-semibold text-gray-900">{car.owner?.name || 'N/A'}</div>
          <div className="text-sm text-gray-500">{car.owner?.email || 'N/A'}</div>
        </div>
      )
    },
    {
      header: 'Spare Parts',
      key: 'spareParts',
      render: (car) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {car.spareParts?.length || 0} parts
        </span>
      )
    },
    {
      header: 'Added Date',
      key: 'createdAt',
      render: (car) => (
        <span className="text-gray-900">
          {new Date(car.createdAt).toLocaleDateString()}
        </span>
      )
    }
  ];

  // Search and filter options
  const searchAndFilterProps = {
    searchTerm,
    onSearchChange: setSearchTerm,
    filterValue: filterBrand,
    onFilterChange: setFilterBrand,
    filterOptions: [
      { value: '', label: 'All Brands' },
      ...uniqueBrands.map(brand => ({ value: brand, label: brand }))
    ],
    itemsPerPage,
    onItemsPerPageChange: handleItemsPerPageChange,
    searchPlaceholder: "Search cars by brand, model, or owner...",
    filterLabel: 'Brand'
  };

  // Pagination configuration for DataTable component
  const paginationConfig = {
    currentPage,
    totalPages,
    startIndex,
    endIndex,
    total: filteredCars.length,
    onPageChange: handlePageChange
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <DashboardHeader 
          title="Cars Management" 
          subtitle="Manage platform cars and their details"
          gradientFrom="from-red-600"
          gradientTo="to-red-700"
        />
        
        <StatsCards stats={statsData} />
        
        <SearchAndFilters {...searchAndFilterProps} />
        
        <DataTable
          columns={columns}
          data={currentCars}
          loading={loading}
          emptyMessage="No cars found"
          emptyIcon="fa-car"
          onDelete={handleDeleteCar}
          pagination={paginationConfig}
        />
      </div>

      {/* Car Details Modal */}
      {showModal && selectedCar && (
        <Modal
          show={showModal}
          onHide={() => setShowModal(false)}
          title={`${selectedCar.brand} ${selectedCar.model} Details`}
          size="lg"
        >
          <div className="car-details-modal">
            <div className="row">
              <div className="col-md-4">
                <img 
                  src={selectedCar.image ? `http://localhost:5000${selectedCar.image}` : '/assets/img/car-placeholder.png'} 
                  alt={`${selectedCar.brand} ${selectedCar.model}`}
                  className="img-fluid rounded"
                  style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                />
              </div>
              <div className="col-md-8">
                <div className="car-info">
                  <h4>{selectedCar.brand} {selectedCar.model}</h4>
                  <div className="info-grid">
                    <div className="info-item">
                      <strong>Year:</strong> {selectedCar.year}
                    </div>
                    <div className="info-item">
                      <strong>Kilometrage:</strong> {selectedCar.kilometrage?.toLocaleString() || 0} km
                    </div>
                    <div className="info-item">
                      <strong>Owner:</strong> {selectedCar.owner?.name || 'N/A'}
                    </div>
                    <div className="info-item">
                      <strong>Owner Email:</strong> {selectedCar.owner?.email || 'N/A'}
                    </div>
                    <div className="info-item">
                      <strong>Added Date:</strong> {new Date(selectedCar.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {selectedCar.spareParts && selectedCar.spareParts.length > 0 && (
              <div className="spare-parts-section mt-4">
                <h5>Spare Parts ({selectedCar.spareParts.length})</h5>
                <div className="table-responsive">
                  <table className="table table-sm">
                    <thead>
                      <tr>
                        <th>Part Name</th>
                        <th>Category</th>
                        <th>Brand</th>
                        <th>Price</th>
                        <th>Installation Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedCar.spareParts.map((sparePart, index) => (
                        <tr key={index}>
                          <td>{sparePart.part?.name || 'N/A'}</td>
                          <td>{sparePart.part?.category || 'N/A'}</td>
                          <td>{sparePart.part?.brand || 'N/A'}</td>
                          <td>${sparePart.part?.price || 0}</td>
                          <td>{sparePart.installationDate ? new Date(sparePart.installationDate).toLocaleDateString() : 'N/A'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}
    </AdminLayout>
  );
};

export default AdminCars;