import React from "react";

const SparePartsHistory = ({ spareParts }) => {
  const getMonthName = (monthNumber) => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[monthNumber - 1] || 'Unknown';
  };

  const getTimeAgo = (changeMonth, changeYear) => {
    const changeDate = new Date(changeYear, changeMonth - 1);
    const now = new Date();
    const monthsDiff = (now.getFullYear() - changeDate.getFullYear()) * 12 + 
                     (now.getMonth() - changeDate.getMonth());
    
    if (monthsDiff === 0) return 'This month';
    if (monthsDiff === 1) return '1 month ago';
    if (monthsDiff < 12) return `${monthsDiff} months ago`;
    
    const years = Math.floor(monthsDiff / 12);
    const months = monthsDiff % 12;
    
    if (months === 0) return `${years} year${years > 1 ? 's' : ''} ago`;
    return `${years} year${years > 1 ? 's' : ''}, ${months} month${months > 1 ? 's' : ''} ago`;
  };

  return (
    <div className="p-6">
      {spareParts.length === 0 ? (
        <div className="text-center py-12">
          <i className="fas fa-tools text-gray-300 text-6xl mb-4"></i>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No Spare Parts Changed</h3>
          <p className="text-gray-500">All original parts are still in place</p>
        </div>
      ) : (
        <div className="space-y-4">
          {spareParts.map((sp, index) => {
            const partName = sp.part?.name || 'Unknown Part';
            const changeMonth = sp.changeMonth;
            const changeYear = sp.changeYear;

            return (
              <div
                key={index}
                className="history-card group hover:shadow-lg transition-all duration-300 border-l-4 border-red-600"
              >
                <div className="bg-gradient-to-r from-red-50 to-white p-5 rounded-r-lg border border-l-0 border-gray-200 group-hover:border-red-300">
                  <div className="flex items-center gap-4">
                    {/* Icon */}
                    <div className="flex-shrink-0 w-14 h-14 bg-red-600 rounded-full flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                      <i className="fas fa-tools text-white text-xl"></i>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      {/* Part Name */}
                      <h4 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-red-600 transition-colors">
                        {partName}
                      </h4>

                      {/* Details Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                        {/* Change Date */}
                        {changeMonth && changeYear && (
                          <>
                            <div className="flex items-center gap-2 text-gray-600">
                              <i className="fas fa-calendar-check text-red-600 w-4"></i>
                              <span className="font-medium">
                                {getMonthName(changeMonth)} {changeYear}
                              </span>
                            </div>

                            {/* Time Ago */}
                            <div className="flex items-center gap-2 text-gray-600">
                              <i className="fas fa-clock text-red-600 w-4"></i>
                              <span>{getTimeAgo(changeMonth, changeYear)}</span>
                            </div>
                          </>
                        )}

                        {/* Brand */}
                        {sp.part?.brand && (
                          <div className="flex items-center gap-2 text-gray-600">
                            <i className="fas fa-tag text-red-600 w-4"></i>
                            <span>{sp.part.brand}</span>
                          </div>
                        )}

                        {/* Category */}
                        {sp.part?.category && (
                          <div className="flex items-center gap-2 text-gray-600">
                            <i className="fas fa-layer-group text-red-600 w-4"></i>
                            <span className="capitalize">{sp.part.category}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Index Badge */}
                    <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-600 group-hover:bg-red-100 group-hover:text-red-600 transition-colors">
                      #{index + 1}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Summary Footer */}
      {spareParts.length > 0 && (
        <div className="mt-6 p-4 bg-gradient-to-r from-gray-50 to-red-50 rounded-lg border border-gray-200">
          <div className="flex items-center gap-3">
            <i className="fas fa-info-circle text-red-600 text-xl"></i>
            <div>
              <p className="text-sm font-semibold text-gray-900">Maintenance Summary</p>
              <p className="text-xs text-gray-600 mt-1">
                {spareParts.length} spare part{spareParts.length > 1 ? 's have' : ' has'} been replaced 
                to maintain optimal vehicle performance and reliability.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SparePartsHistory;
