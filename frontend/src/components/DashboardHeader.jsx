import React from 'react';

const DashboardHeader = ({ 
  title, 
  subtitle, 
  buttonText, 
  onButtonClick, 
  gradientFrom = 'from-blue-600', 
  gradientTo = 'to-blue-700',
  buttonTextColor = 'text-blue-600',
  icon = 'fa-plus'
}) => {
  return (
    <div className={`bg-gradient-to-r ${gradientFrom} ${gradientTo} rounded-xl p-4 sm:p-6 lg:p-8 text-white`}>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
        <div className="flex-1">
          <h1 className="text-white text-xl sm:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2">
            {title}
          </h1>
          <p className="text-white opacity-90 text-sm sm:text-base">
            {subtitle}
          </p>
        </div>
        <div className="flex-shrink-0">
          <button
            onClick={onButtonClick}
            className={`bg-white ${buttonTextColor} hover:bg-blue-50 px-4 py-2 sm:px-6 sm:py-3 rounded-lg flex items-center justify-center font-semibold transition-colors duration-200 shadow-lg w-full sm:w-auto text-sm sm:text-base`}
          >
            <i className={`fas ${icon} mr-2`}></i>
            <span className="hidden sm:inline">{buttonText}</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;