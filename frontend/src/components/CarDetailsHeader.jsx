import React from "react";
import { Link } from "react-router-dom";

const CarDetailsHeader = ({ car, onUpdate }) => {
  return (
    <div className="car-details-header bg-gradient-to-r from-red-50 to-white p-6 rounded-xl mb-6 border-l-4 border-red-600">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            {car.brand} {car.model}
          </h2>
          {car.year && (
            <p className="text-lg text-gray-600">
              <i className="fas fa-calendar-alt text-red-600 mr-2"></i>
              {car.year} Model
            </p>
          )}
        </div>
        <div className="flex gap-3">
          <Link
            to="/my-cars"
            className="inline-flex items-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <i className="fas fa-arrow-left mr-2"></i>
            Back to Cars
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CarDetailsHeader;
