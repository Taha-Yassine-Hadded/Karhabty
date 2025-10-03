import React from 'react';

const StatsCards = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white rounded-lg shadow p-4 sm:p-6 hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-center">
            <div className={`p-2 sm:p-3 rounded-full ${stat.bgColor} mr-3 sm:mr-4 flex-shrink-0`}>
              <i className={`fas ${stat.icon} ${stat.textColor} text-lg sm:text-xl`}></i>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm text-gray-600 truncate">{stat.label}</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;