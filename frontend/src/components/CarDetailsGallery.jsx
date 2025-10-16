import React from "react";

const CarDetailsGallery = ({ car }) => {
  const imageUrl = car.image
    ? `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${car.image}`
    : '/assets/img/default-car.png';

  return (
    <div className="car-gallery mb-6">
      <div className="relative rounded-2xl overflow-hidden shadow-2xl group">
        <img
          src={imageUrl}
          alt={`${car.brand} ${car.model}`}
          className="w-full h-[400px] md:h-[500px] object-cover transform transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Image Badge */}
        {car.image && (
          <div className="absolute top-4 right-4 bg-red-600 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
            <i className="fas fa-camera"></i>
            <span className="font-semibold">Custom Photo</span>
          </div>
        )}

        {/* Year Badge */}
        {car.year && (
          <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm text-gray-900 px-5 py-3 rounded-xl shadow-lg">
            <div className="text-sm text-gray-600 font-medium">Year</div>
            <div className="text-2xl font-bold text-red-600">{car.year}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CarDetailsGallery;
