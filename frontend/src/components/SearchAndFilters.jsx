import React from 'react';

const SearchAndFilters = ({ 
  searchTerm, 
  onSearchChange, 
  filterValue, 
  onFilterChange, 
  filterOptions, 
  itemsPerPage, 
  onItemsPerPageChange,
  searchPlaceholder = "Search...",
  filterLabel = "Filter",
  showItemsPerPage = true
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-4 sm:p-6">
      <div className={`grid grid-cols-1 ${showItemsPerPage ? 'sm:grid-cols-2 lg:grid-cols-3' : 'sm:grid-cols-2'} gap-4`}>
        <div className={showItemsPerPage ? 'sm:col-span-2 lg:col-span-1' : ''}>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
            <i className="fas fa-search mr-2"></i>Search
          </label>
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full px-3 py-2 sm:px-4 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
            <i className="fas fa-filter mr-2"></i>{filterLabel}
          </label>
          <select
            value={filterValue}
            onChange={(e) => onFilterChange(e.target.value)}
            className="w-full px-3 py-2 sm:px-4 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {filterOptions.map((option, index) => (
              <option key={index} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        {showItemsPerPage && (
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
              <i className="fas fa-list mr-2"></i>Show per page
            </label>
            <select
              value={itemsPerPage}
              onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
              className="w-full px-3 py-2 sm:px-4 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={5}>5 per page</option>
              <option value={10}>10 per page</option>
              <option value={15}>15 per page</option>
            </select>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchAndFilters;