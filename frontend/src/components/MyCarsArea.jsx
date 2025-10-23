import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Modal from "./Modal";
import CarImageUpload from "./CarImageUpload";
import SparePartsWithDates from "./SparePartsWithDates";
import SearchInput from "./SearchInput";
import api from "../utils/api";
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

const MyCarsArea = () => {
  const [cars, setCars] = useState([]);
  const [spareParts, setSpareParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCar, setEditingCar] = useState(null);
  const [showSparePartsSelection, setShowSparePartsSelection] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const carsPerPage = 4;
  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    year: new Date().getFullYear(),
    kilometrage: "",
    fuelType: "gasoline",
    image: null,
    spareParts: []
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [imageDeleted, setImageDeleted] = useState(false);

  // Car brands list (comprehensive list of 100+ brands)
  const carBrandOptions = [
    // American Brands
    'Ford', 'Chevrolet', 'GMC', 'Dodge', 'Ram', 'Jeep', 
    'Chrysler', 'Cadillac', 'Lincoln', 'Buick', 'Tesla',
    'Rivian', 'Lucid', 'Fisker', 'Canoo', 'Lordstown',
    
    // Japanese Brands
    'Toyota', 'Honda', 'Nissan', 'Mazda', 'Subaru', 
    'Mitsubishi', 'Suzuki', 'Lexus', 'Infiniti', 'Acura',
    'Isuzu', 'Daihatsu', 'Hino',
    
    // German Brands
    'BMW', 'Mercedes-Benz', 'Audi', 'Volkswagen', 'Porsche',
    'Mini', 'Opel', 'Smart', 'Maybach', 'Alpina',
    
    // Korean Brands
    'Hyundai', 'Kia', 'Genesis', 'SsangYong', 'Daewoo',
    
    // British Brands
    'Jaguar', 'Land Rover', 'Bentley', 'Rolls-Royce', 
    'Aston Martin', 'McLaren', 'Lotus', 'Morgan', 'TVR',
    'Vauxhall', 'MG', 'Caterham',
    
    // Italian Brands
    'Ferrari', 'Lamborghini', 'Maserati', 'Alfa Romeo', 
    'Fiat', 'Lancia', 'Pagani', 'Bugatti',
    
    // French Brands
    'Peugeot', 'Renault', 'Citroën', 'DS Automobiles',
    'Alpine', 'Venturi',
    
    // Swedish Brands
    'Volvo', 'Saab', 'Polestar', 'Koenigsegg',
    
    // Chinese Brands
    'BYD', 'Geely', 'Great Wall', 'Chery', 'NIO',
    'Xpeng', 'Li Auto', 'Lynk & Co', 'MG Motor', 'GAC',
    'Hongqi', 'Haval', 'Zeekr', 'Aiways', 'Voyah',
    
    // Spanish Brands
    'SEAT', 'Cupra',
    
    // Czech Brands
    'Škoda',
    
    // Romanian Brands
    'Dacia',
    
    // Indian Brands
    'Tata', 'Mahindra', 'Maruti Suzuki', 'Bajaj',
    
    // Malaysian Brands
    'Proton', 'Perodua',
    
    // Australian Brands
    'Holden',
    
    // Russian Brands
    'Lada', 'UAZ', 'GAZ',
    
    // Luxury/Supercar Brands
    'Koenigsegg', 'Rimac', 'Pagani', 'Spyker', 'W Motors',
    'Hennessey', 'SSC North America', 'Zenvo',
    
    // Electric/New Energy Brands
    'Faraday Future', 'Byton', 'Lightyear', 'Arrival',
    'Nikola', 'Lordstown', 'Bollinger', 'Karma',
    
    // Commercial/Truck Brands
    'Freightliner', 'Peterbilt', 'Kenworth', 'Mack',
    'International', 'Western Star', 'Hino', 'UD Trucks',
    
    // Other Notable Brands
    'Pontiac', 'Oldsmobile', 'Saturn', 'Mercury', 'Plymouth',
    'Scion', 'Maybach', 'Datsun', 'AMC', 'DeLorean'
  ].sort();

  // Fetch user's cars and spare parts
  useEffect(() => {
    fetchCurrentUser();
    fetchCars();
    fetchSpareParts();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await api.get('/api/auth/me');
        setCurrentUser(response.data);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  const fetchCars = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/cars");
      setCars(response.data);
    } catch (error) {
      console.error("Error fetching cars:", error);
      toast.error("Failed to load cars");
    } finally {
      setLoading(false);
    }
  };

  const fetchSpareParts = async () => {
    try {
      const response = await api.get("/api/cars/spare-parts/all");
      setSpareParts(response.data);
    } catch (error) {
      console.error("Error fetching spare parts:", error);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.brand.trim()) {
      newErrors.brand = "Brand is required";
    } else if (formData.brand.length < 2) {
      newErrors.brand = "Brand must be at least 2 characters";
    }

    if (!formData.model.trim()) {
      newErrors.model = "Model is required";
    } else if (formData.model.length < 2) {
      newErrors.model = "Model must be at least 2 characters";
    }

    if (!formData.year) {
      newErrors.year = "Year is required";
    } else if (formData.year < 1900 || formData.year > new Date().getFullYear()) {
      newErrors.year = `Year must be between 1900 and ${new Date().getFullYear()}`;
    }

    if (!formData.kilometrage) {
      newErrors.kilometrage = "Kilometrage is required";
    } else if (formData.kilometrage < 0) {
      newErrors.kilometrage = "Kilometrage cannot be negative";
    } else if (editingCar && parseInt(formData.kilometrage) < editingCar.kilometrage) {
      newErrors.kilometrage = `Kilometrage must be greater than or equal to current value (${editingCar.kilometrage} km)`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Clear error for this field
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  const handleImageSelect = (file) => {
    setFormData({
      ...formData,
      image: file
    });
    
    // If file is null, it means the user removed the image
    if (file === null) {
      setImageDeleted(true);
      setImagePreview(null);
    } else if (file) {
      setImageDeleted(false);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSparePartsChange = (selectedParts) => {
    setFormData({
      ...formData,
      spareParts: selectedParts
    });
  };

  const openAddModal = () => {
    // Check car limit for regular users
    if (currentUser?.role === 'user' && cars.length >= 2) {
      Swal.fire({
        title: 'Car Limit Reached',
        icon: 'warning',
        confirmButtonColor: '#dc3545',
        confirmButtonText: 'Got it',
        width: '500px'
      });
      return;
    }

    setEditingCar(null);
    setShowSparePartsSelection(false);
    setImagePreview(null);
    setImageDeleted(false);
    setFormData({
      brand: "",
      model: "",
      year: new Date().getFullYear(),
      kilometrage: "",
      fuelType: "gasoline",
      image: null,
      spareParts: []
    });
    setErrors({});
    setIsModalOpen(true);
  };

  const openEditModal = (car) => {
    setEditingCar(car);
    setShowSparePartsSelection(car.spareParts && car.spareParts.length > 0);
    setImagePreview(car.image ? `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${car.image}` : null);
    setImageDeleted(false);
    
    // Map spare parts to the new structure
    const mappedSpareParts = car.spareParts && car.spareParts.length > 0
      ? car.spareParts.map(sp => ({
          part: sp.part?._id || sp.part,
          changeMonth: sp.changeMonth,
          changeYear: sp.changeYear,
          kilometrage: sp.kilometrage || 0 // Include existing kilometrage or default to 0
        }))
      : [];
    
    setFormData({
      brand: car.brand,
      model: car.model,
      year: car.year || new Date().getFullYear(),
      kilometrage: car.kilometrage,
      fuelType: car.fuelType || "gasoline",
      image: null,
      spareParts: mappedSpareParts
    });
    setErrors({});
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setSubmitLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('brand', formData.brand);
      formDataToSend.append('model', formData.model);
      formDataToSend.append('year', formData.year);
      formDataToSend.append('kilometrage', formData.kilometrage);
      formDataToSend.append('fuelType', formData.fuelType);
      
      // Handle spare parts - send array if enabled, empty array if disabled
      if (showSparePartsSelection) {
        formDataToSend.append('spareParts', JSON.stringify(formData.spareParts));
      } else {
        // Send empty array to clear spare parts when checkbox is turned off
        formDataToSend.append('spareParts', JSON.stringify([]));
      }

      // Handle image upload
      if (formData.image instanceof File) {
        formDataToSend.append('image', formData.image);
      }

      // Handle image deletion - only send this flag when editing and image was deleted
      if (editingCar && imageDeleted) {
        formDataToSend.append('deleteImage', 'true');
      }

      if (editingCar) {
        await api.put(`/api/cars/${editingCar._id}`, formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Car updated successfully');
      } else {
        await api.post("/api/cars", formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Car added successfully');
      }
      
      setIsModalOpen(false);
      fetchCars();
    } catch (error) {
      console.error("Error saving car:", error);
      toast.error(error.response?.data?.message || "Failed to save car");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async (carId, carName) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      width: '500px'
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/api/cars/${carId}`);
        toast.success('Car deleted successfully');
        fetchCars();
      } catch (error) {
        console.error("Error deleting car:", error);
        toast.error("Failed to delete car");
      }
    }
  };

  const getFuelTypeLabel = (fuelType) => {
    const labels = {
      gasoline: "Gasoline",
      diesel: "Diesel",
      electric: "Electric",
      hybrid: "Hybrid"
    };
    return labels[fuelType] || fuelType;
  };

  // Search and filter logic
  const filteredCars = cars.filter((car) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      car.brand.toLowerCase().includes(searchLower) ||
      car.model.toLowerCase().includes(searchLower) ||
      car.year?.toString().includes(searchLower) ||
      car.fuelType?.toLowerCase().includes(searchLower) ||
      car.kilometrage?.toString().includes(searchLower)
    );
  });

  // Pagination logic - only for enterprise users
  const indexOfLastCar = currentPage * carsPerPage;
  const indexOfFirstCar = indexOfLastCar - carsPerPage;
  const shouldPaginate = currentUser?.role === 'entreprise' && filteredCars.length > carsPerPage;
  const displayedCars = shouldPaginate ? filteredCars.slice(indexOfFirstCar, indexOfLastCar) : filteredCars;
  const totalPages = shouldPaginate ? Math.ceil(filteredCars.length / carsPerPage) : 1;

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchChange = (query) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page when searching
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner-red"></div>
        <p>Loading your cars...</p>
      </div>
    );
  }

  return (
    <section className="my-cars-area">
      <div className="container">
        <div className="row mb-4">
          <div className="col-12">
            <div className="section-header">
              <h2 className="sec-title-red">
                <i className="fas fa-car"></i> My Cars
              </h2>
              <button onClick={openAddModal} className="btn-add-car">
                <i className="fas fa-plus-circle"></i> Add New Car
              </button>
            </div>
          </div>
        </div>

        {cars.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <i className="fas fa-car"></i>
            </div>
            <h3>No cars yet</h3>
            <p>Start building your garage by adding your first car</p>
            <button onClick={openAddModal} className="btn-add-first">
              <i className="fas fa-plus-circle"></i> Add Your First Car
            </button>
          </div>
        ) : (
          <>
            {/* Search Input */}
            <div className="row mb-3">
              <div className="col-12">
                <SearchInput
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Search by brand, model, year, fuel type..."
                />
              </div>
            </div>

            {/* Search Results Info */}
            {searchQuery && (
              <div className="row mb-3">
                <div className="col-12">
                  <div className="search-results-info">
                    <i className="fas fa-info-circle"></i>
                    Found {filteredCars.length} car{filteredCars.length !== 1 ? 's' : ''} matching "{searchQuery}"
                    {filteredCars.length === 0 && (
                      <span className="no-results"> - Try a different search term</span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {filteredCars.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">
                  <i className="fas fa-search"></i>
                </div>
                <h3>No cars found</h3>
                <p>No cars match your search criteria</p>
                <button onClick={() => setSearchQuery('')} className="btn-add-first">
                  <i className="fas fa-times-circle"></i> Clear Search
                </button>
              </div>
            ) : (
              <>
              <div className="row">
              {displayedCars.map((car) => (
                <div key={car._id} className="col-lg-6 col-md-6 mb-4">
                <div className="car-card">
                  <Link to={`/car-details/${car._id}`} className="car-image-link">
                    <div className="car-image">
                      <img 
                        src={car.image 
                          ? `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${car.image}` 
                          : '/assets/img/default-car.png'
                        } 
                        alt={`${car.brand} ${car.model}`}
                      />
                      {car.image && (
                        <div className="image-badge">
                          <i className="fas fa-camera"></i>
                        </div>
                      )}
                    </div>
                  </Link>
                  <div className="car-content">
                    <div className="car-header">
                      <Link to={`/car-details/${car._id}`} className="car-title-link">
                        <h3 className="car-title">
                          {car.brand} {car.model}
                        </h3>
                      </Link>
                      <div className="car-actions">
                        <button
                          className="action-btn edit"
                          onClick={() => openEditModal(car)}
                          title="Edit"
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button
                          className="action-btn delete"
                          onClick={() => handleDelete(car._id, `${car.brand} ${car.model}`)}
                          title="Delete"
                        >
                          <i className="fas fa-trash-alt"></i>
                        </button>
                      </div>
                    </div>

                    <div className="car-details">
                      {car.year && (
                        <div className="detail-item">
                          <i className="fas fa-calendar-alt"></i>
                          <span>{car.year}</span>
                        </div>
                      )}
                      <div className="detail-item">
                        <i className="fas fa-tachometer-alt"></i>
                        <span>{car.kilometrage.toLocaleString()} km</span>
                      </div>
                      {car.fuelType && (
                        <div className="detail-item">
                          <i className="fas fa-gas-pump"></i>
                          <span>{getFuelTypeLabel(car.fuelType)}</span>
                        </div>
                      )}
                    </div>

                    {car.spareParts && car.spareParts.length > 0 ? (
                      <div className="spare-parts-info">
                        <i className="fas fa-cog"></i>
                        <span className="parts-count">{car.spareParts.length} Spare Part{car.spareParts.length !== 1 ? 's' : ''}</span>
                        <div className="parts-list">
                          {car.spareParts.slice(0, 2).map((sp, idx) => {
                            const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                            const partName = sp.part?.name || 'Unknown';
                            const changeDate = sp.changeMonth && sp.changeYear 
                              ? `${monthNames[sp.changeMonth - 1]} ${sp.changeYear}`
                              : '';
                            return (
                              <span key={idx} className="part-tag" title={changeDate}>
                                {partName} {changeDate && `(${changeDate})`}
                              </span>
                            );
                          })}
                          {car.spareParts.length > 2 && (
                            <span className="part-tag more">+{car.spareParts.length - 2} more</span>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="spare-parts-info no-parts">
                        <i className="fas fa-tools"></i>
                        <span className="no-parts-message">No spare parts added yet</span>
                      </div>
                    )}

                    <div className="car-footer">
                      <small className="added-date">
                        <i className="fas fa-clock"></i>
                        Added {new Date(car.createdAt).toLocaleDateString()}
                      </small>
                      <Link to={`/car-details/${car._id}`} className="details-btn">
                        Details <i className="fas fa-arrow-right"></i>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
              </div>

              {/* Pagination - Only for Enterprise users */}
              {shouldPaginate && totalPages > 1 && (
                <div className="row">
                  <div className="col-12">
                    <div className="pagination-wrapper">
                      <button 
                        className="pagination-btn"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        <i className="fas fa-chevron-left"></i> Previous
                      </button>
                      
                      <div className="pagination-numbers">
                        {[...Array(totalPages)].map((_, index) => (
                          <button
                            key={index + 1}
                            className={`pagination-number ${currentPage === index + 1 ? 'active' : ''}`}
                            onClick={() => handlePageChange(index + 1)}
                          >
                            {index + 1}
                          </button>
                        ))}
                      </div>

                      <button 
                        className="pagination-btn"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        Next <i className="fas fa-chevron-right"></i>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
          </>
        )}
      </div>

      {/* Add/Edit Car Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCar ? "Edit Car" : "Add New Car"}
        onSubmit={handleSubmit}
        loading={submitLoading}
        editMode={!!editingCar}
        submitText={editingCar ? "Update Car" : "Add Car"}
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSubmit} className="modern-car-form">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label-red">
                Brand <span className="required">*</span>
              </label>
              <div className="input-wrapper">
                <i className="fas fa-car input-icon"></i>
                <select
                  name="brand"
                  className={`form-input ${errors.brand ? 'error' : ''}`}
                  value={formData.brand}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select a brand...</option>
                  {carBrandOptions.map((brand) => (
                    <option key={brand} value={brand}>
                      {brand}
                    </option>
                  ))}
                </select>
              </div>
              {errors.brand && <div className="error-message">{errors.brand}</div>}
            </div>

            <div className="form-group">
              <label className="form-label-red">
                Model <span className="required">*</span>
              </label>
              <div className="input-wrapper">
                <i className="fas fa-car-side input-icon"></i>
                <input
                  type="text"
                  name="model"
                  className={`form-input ${errors.model ? 'error' : ''}`}
                  value={formData.model}
                  onChange={handleInputChange}
                  placeholder="e.g., Camry, X5, E-Class"
                />
              </div>
              {errors.model && <div className="error-message">{errors.model}</div>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label-red">
                Year <span className="required">*</span>
              </label>
              <div className="input-wrapper">
                <i className="fas fa-calendar input-icon"></i>
                <input
                  type="number"
                  name="year"
                  className={`form-input ${errors.year ? 'error' : ''}`}
                  value={formData.year}
                  onChange={handleInputChange}
                  min="1900"
                  max={new Date().getFullYear()}
                />
              </div>
              {errors.year && <div className="error-message">{errors.year}</div>}
            </div>

            <div className="form-group">
              <label className="form-label-red">
                Kilometrage <span className="required">*</span>
              </label>
              <div className="input-wrapper">
                <i className="fas fa-tachometer-alt input-icon"></i>
                <input
                  type="number"
                  name="kilometrage"
                  className={`form-input ${errors.kilometrage ? 'error' : ''}`}
                  value={formData.kilometrage}
                  onChange={handleInputChange}
                  min="0"
                  placeholder="50000"
                />
              </div>
              {errors.kilometrage && <div className="error-message">{errors.kilometrage}</div>}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label-red">Fuel Type</label>
            <div className="input-wrapper">
              <i className="fas fa-gas-pump input-icon"></i>
              <select
                name="fuelType"
                className="form-input"
                value={formData.fuelType}
                onChange={handleInputChange}
              >
                <option value="gasoline">Gasoline</option>
                <option value="diesel">Diesel</option>
                <option value="electric">Electric</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label-red">Car Image</label>
            <CarImageUpload
              onImageSelect={handleImageSelect}
              currentImage={imagePreview}
              error={errors.image}
            />
          </div>

          <div className="form-group">
            <div className="spare-parts-toggle">
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={showSparePartsSelection}
                  onChange={(e) => {
                    setShowSparePartsSelection(e.target.checked);
                    if (!e.target.checked) {
                      setFormData({ ...formData, spareParts: [] });
                    }
                  }}
                />
                <span className="slider"></span>
              </label>
              <span className="toggle-label">
                <i className="fas fa-cog"></i>
                Has spare parts changed?
              </span>
            </div>

            {showSparePartsSelection && (
              <div className="spare-parts-section">
                <label className="form-label-red">Select Spare Parts & Change Dates</label>
                <SparePartsWithDates
                  spareParts={spareParts}
                  selectedParts={formData.spareParts}
                  onChange={handleSparePartsChange}
                />
              </div>
            )}
          </div>
        </form>
      </Modal>
    </section>
  );
};

export default MyCarsArea;
