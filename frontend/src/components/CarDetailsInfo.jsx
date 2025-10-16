import React from "react";

const CarDetailsInfo = ({ car }) => {
  const getFuelTypeIcon = (fuelType) => {
    const icons = {
      gasoline: "fa-gas-pump",
      diesel: "fa-burn",
      electric: "fa-bolt",
      hybrid: "fa-leaf"
    };
    return icons[fuelType] || "fa-gas-pump";
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

  return (
    <div className="car-details-info bg-white rounded-xl shadow-lg p-6 md:p-8 mb-6 border border-gray-100">
      <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center border-b border-gray-200 pb-4">
        <i className="fas fa-file-alt text-red-600 mr-3"></i>
        Vehicle Summary
      </h3>

      {/* Description Section */}
      <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-gray-700 leading-relaxed text-lg">
          This {car.brand} {car.model} {car.year && `(${car.year})`} is equipped with a {car.fuelType && getFuelTypeLabel(car.fuelType).toLowerCase()} engine 
          and has {car.kilometrage?.toLocaleString()} kilometers on the odometer. 
          {car.spareParts && car.spareParts.length > 0 
            ? ` ${car.spareParts.length} spare part${car.spareParts.length > 1 ? 's have' : ' has'} been replaced to ensure optimal performance.`
            : ' All original parts are in place.'}
        </p>
      </div>
    </div>
  );
};

export default CarDetailsInfo;
