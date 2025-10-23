import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import HeaderOne from "../components/HeaderOne";
import FooterAreaOne from "../components/FooterAreaOne";
import Breadcrumb from "../components/Breadcrumb";
import SparePartsRecommendations from "../components/SparePartsRecommendations";
import Preloader from "../helper/Preloader";
import SubscribeOne from "../components/SubscribeOne";
import api from "../utils/api";
import toast from "react-hot-toast";

const RecommendationsPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [active, setActive] = useState(true);
  const [cars, setCars] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recommendationsLoading, setRecommendationsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Get car ID from URL params if navigating from car details
  const preSelectedCarId = searchParams.get('carId');

  useEffect(() => {
    setTimeout(function () {
      setActive(false);
    }, 2000);
  }, []);

  // Fetch user's cars
  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/cars');
        setCars(response.data);
        
        // If there's a pre-selected car ID, find and set it
        if (preSelectedCarId) {
          const preSelectedCar = response.data.find(car => car._id === preSelectedCarId);
          if (preSelectedCar) {
            setSelectedCar(preSelectedCar);
            setSearchTerm(`${preSelectedCar.brand} ${preSelectedCar.model} (${preSelectedCar.year})`);
          }
        }
      } catch (error) {
        console.error("Error fetching cars:", error);
        toast.error("Failed to load cars");
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, [preSelectedCarId]);

  // Filter cars based on search term
  const filteredCars = cars.filter(car => {
    const searchLower = searchTerm.toLowerCase();
    return (
      car.brand.toLowerCase().includes(searchLower) ||
      car.model.toLowerCase().includes(searchLower) ||
      car.year.toString().includes(searchLower) ||
      `${car.brand} ${car.model}`.toLowerCase().includes(searchLower) ||
      `${car.brand} ${car.model} ${car.year}`.toLowerCase().includes(searchLower)
    );
  });

  const handleCarSelect = async (car) => {
    setRecommendationsLoading(true);
    setSelectedCar(car);
    setSearchTerm(`${car.brand} ${car.model} (${car.year})`);
    setDropdownOpen(false);
    
    // Simulate loading time for better UX
    setTimeout(() => {
      setRecommendationsLoading(false);
    }, 800);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setDropdownOpen(true);
  };

  const clearSelection = () => {
    setSelectedCar(null);
    setSearchTerm("");
    setDropdownOpen(false);
  };

  return (
    <>
      {/* Preloader */}
      {active === true && <Preloader />}

      {/* Header one */}
      <HeaderOne />

      {/* Breadcrumb */}
      <Breadcrumb title={"Spare Parts Recommendations"} />

      {/* Main Content */}
      <section className="recommendations-page space-top space-extra-bottom">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xxl-10 col-xl-11">
              {/* Page Header */}
              <div className="text-center mb-5">
                <h2 className="text-4xl font-bold text-gray-900 mb-3">
                  <i className="fas fa-lightbulb text-red-600 mr-3"></i>
                  Spare Parts Recommendations
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Get personalized maintenance recommendations for your vehicles based on usage patterns and time intervals.
                </p>
              </div>

              {/* Car Search Section */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <i className="fas fa-search text-red-600 mr-2"></i>
                  Select Vehicle
                </h3>
                
                <div className="relative">
                  <div className="flex gap-3">
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        onFocus={() => setDropdownOpen(true)}
                        placeholder="Search by brand, model, or year..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                        disabled={loading}
                      />
                      <i className="fas fa-search absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                    </div>
                    
                    {selectedCar && (
                      <button
                        onClick={clearSelection}
                        className="px-4 py-3 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                        title="Clear selection"
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    )}
                  </div>

                  {/* Dropdown */}
                  {dropdownOpen && !loading && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                      {filteredCars.length > 0 ? (
                        filteredCars.map((car) => (
                          <button
                            key={car._id}
                            onClick={() => handleCarSelect(car)}
                            className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                {/* Car Image */}
                                <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                  <img 
                                    src={car.image 
                                      ? `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${car.image}` 
                                      : '/assets/img/default-car.png'
                                    } 
                                    alt={`${car.brand} ${car.model}`}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div>
                                  <div className="font-semibold text-gray-900">
                                    {car.brand} {car.model} ({car.year})
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    <i className="fas fa-road mr-1"></i>
                                    {car.kilometrage?.toLocaleString() || 0} km
                                    {car.spareParts?.length > 0 && (
                                      <span className="ml-3">
                                        <i className="fas fa-cog mr-1"></i>
                                        {car.spareParts.length} part(s)
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <i className="fas fa-chevron-right text-gray-400"></i>
                            </div>
                          </button>
                        ))
                      ) : (
                        <div className="px-4 py-3 text-gray-500 text-center">
                          No cars found matching your search
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {loading && (
                  <div className="text-center py-4">
                    <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-red-600"></div>
                    <span className="ml-2 text-gray-600">Loading your cars...</span>
                  </div>
                )}
              </div>

              {/* Recommendations Container */}
              <div className="recommendations-container">
                {recommendationsLoading ? (
                  <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-12">
                    <div className="text-center">
                      <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-4 border-red-600 mb-4"></div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">Loading Recommendations</h3>
                      <p className="text-gray-600">Analyzing your vehicle's maintenance needs...</p>
                    </div>
                  </div>
                ) : selectedCar ? (
                  <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                    {/* Selected Car Header */}
                    <div className="bg-gradient-to-r from-red-50 to-orange-50 border-b border-gray-200 p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          {/* Car Image */}
                          <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                            <img 
                              src={selectedCar.image 
                                ? `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${selectedCar.image}` 
                                : '/assets/img/default-car.png'
                              } 
                              alt={`${selectedCar.brand} ${selectedCar.model}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">
                              {selectedCar.brand} {selectedCar.model} ({selectedCar.year})
                            </h3>
                            <div className="flex items-center gap-4 text-gray-600">
                              <span>
                                <i className="fas fa-road mr-1 text-red-600"></i>
                                {selectedCar.kilometrage?.toLocaleString() || 0} km
                              </span>
                              <span>
                                <i className="fas fa-cog mr-1 text-red-600"></i>
                                {selectedCar.spareParts?.length || 0} spare part(s)
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <button
                            onClick={() => navigate(`/car-details/${selectedCar._id}`)}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                          >
                            <i className="fas fa-eye mr-2"></i>
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Recommendations Content */}
                    <div className="p-0">
                      {selectedCar.spareParts && selectedCar.spareParts.length > 0 ? (
                        <SparePartsRecommendations 
                          spareParts={selectedCar.spareParts}
                          recommendedTechnicians={selectedCar.recommendedTechnicians || []}
                          currentCarKilometrage={selectedCar.kilometrage}
                        />
                      ) : (
                        <div className="text-center py-12">
                          <i className="fas fa-info-circle text-gray-300 text-6xl mb-4"></i>
                          <h3 className="text-xl font-semibold text-gray-600 mb-2">No Spare Parts Found</h3>
                          <p className="text-gray-500 mb-4">This vehicle doesn't have any spare parts recorded yet.</p>
                          <button
                            onClick={() => navigate(`/car-details/${selectedCar._id}`)}
                            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                          >
                            <i className="fas fa-plus mr-2"></i>
                            Add Spare Parts
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-12">
                    <div className="text-center">
                      <i className="fas fa-car text-gray-300 text-6xl mb-4"></i>
                      <h3 className="text-xl font-semibold text-gray-600 mb-2">Select a Vehicle</h3>
                      <p className="text-gray-500">Choose a car from the dropdown above to view its maintenance recommendations.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Subscribe One */}
      <SubscribeOne />

      {/* Footer Area One */}
      <FooterAreaOne />
    </>
  );
};

export default RecommendationsPage;