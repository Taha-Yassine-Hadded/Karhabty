import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import toast from "react-hot-toast";
import CarDetailsHeader from "./CarDetailsHeader";
import CarDetailsInfo from "./CarDetailsInfo";
import CarDetailsSpareParts from "./CarDetailsSpareParts";
import CarDetailsGallery from "./CarDetailsGallery";
import SuppliersModal from "./SuppliersModal";

const CarDetailsMain = ({ carId }) => {
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchCarDetails = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/cars/${carId}`);
      setCar(response.data);
    } catch (error) {
      console.error("Error fetching car details:", error);
      toast.error("Failed to load car details");
      navigate("/my-cars");
    } finally {
      setLoading(false);
    }
  }, [carId, navigate]);

  useEffect(() => {
    fetchCarDetails();
  }, [fetchCarDetails]);

  if (loading) {
    return (
      <section className="car-details-area space-top space-extra-bottom">
        <div className="container">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-red-600"></div>
              <p className="mt-4 text-gray-600 text-lg">Loading car details...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!car) {
    return null;
  }

  return (
    <section className="car-details-area space-top space-extra-bottom">
      <div className="container">
        <div className="row gx-5">
          {/* Main Content - Left Side */}
          <div className="col-xxl-8 col-lg-8">
            <div className="car-details-card">
              {/* Car Image/Gallery */}
              <CarDetailsGallery car={car} />

              {/* Car Header with Title and Actions */}
              <CarDetailsHeader car={car} onUpdate={fetchCarDetails} />

              {/* Car Information */}
              <CarDetailsInfo car={car} />

              {/* Spare Parts Section */}
              {car.spareParts && car.spareParts.length > 0 && (
                <CarDetailsSpareParts 
                  spareParts={car.spareParts} 
                  recommendedTechnicians={car.recommendedTechnicians || []} 
                  currentCarKilometrage={car.kilometrage}
                  carId={car._id}
                />
              )}
            </div>
          </div>

          {/* Sidebar - Right Side */}
          <div className="col-xxl-4 col-lg-4">
            <aside className="car-details-sidebar">
              {/* Vehicle Information Card */}
              <div className="sidebar-card bg-red-50 border-2 border-red-200 rounded-xl p-6 mb-4">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <i className="fas fa-info-circle text-red-600 mr-2"></i>
                  Vehicle Information
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-red-100">
                    <span className="text-gray-600">
                      <i className="fas fa-car mr-2 text-red-600"></i>Brand
                    </span>
                    <span className="font-semibold text-gray-900">{car.brand}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-red-100">
                    <span className="text-gray-600">
                      <i className="fas fa-car-side mr-2 text-red-600"></i>Model
                    </span>
                    <span className="font-semibold text-gray-900">{car.model}</span>
                  </div>
                  {car.year && (
                    <div className="flex justify-between items-center py-2 border-b border-red-100">
                      <span className="text-gray-600">
                        <i className="fas fa-calendar-alt mr-2 text-red-600"></i>Year
                      </span>
                      <span className="font-semibold text-gray-900">{car.year}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center py-2 border-b border-red-100">
                    <span className="text-gray-600">
                      <i className="fas fa-tachometer-alt mr-2 text-red-600"></i>Mileage
                    </span>
                    <span className="font-semibold text-gray-900">
                      {car.kilometrage?.toLocaleString()} km
                    </span>
                  </div>
                  {car.fuelType && (
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-600">
                        <i className="fas fa-gas-pump mr-2 text-red-600"></i>Fuel Type
                      </span>
                      <span className="font-semibold text-gray-900 capitalize">{car.fuelType}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Additional Info Card */}
              <div className="sidebar-card bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <i className="fas fa-clock text-red-600 mr-2"></i>
                  Additional Info
                </h3>
                <div className="space-y-3">
                  <div className="py-2">
                    <span className="text-gray-600 block mb-1">Added on</span>
                    <span className="font-semibold text-gray-900">
                      {new Date(car.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  {car.updatedAt && car.updatedAt !== car.createdAt && (
                    <div className="py-2 border-t border-gray-200">
                      <span className="text-gray-600 block mb-1">Last Updated</span>
                      <span className="font-semibold text-gray-900">
                        {new Date(car.updatedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  )}
                  <div className="py-2 border-t border-gray-200">
                    <span className="text-gray-600 block mb-1">Spare Parts</span>
                    <span className="font-semibold text-red-600">
                      {car.spareParts?.length || 0} part(s) changed
                    </span>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>

      {/* Suppliers Modal */}
      <SuppliersModal />
    </section>
  );
};

export default CarDetailsMain;
