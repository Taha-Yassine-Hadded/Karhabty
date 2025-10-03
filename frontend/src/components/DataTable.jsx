import React from 'react';

const DataTable = ({ 
  columns, 
  data, 
  loading, 
  emptyMessage = "No data found",
  emptyIcon = "fa-table",
  onEdit,
  onDelete,
  showActions = true,
  customActions = null,
  pagination
}) => {
  const getPaginationRange = () => {
    const range = [];
    const maxVisiblePages = 5;
    const { currentPage, totalPages } = pagination;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        range.push(i);
      }
    } else {
      const start = Math.max(1, currentPage - 2);
      const end = Math.min(totalPages, start + maxVisiblePages - 1);
      
      for (let i = start; i <= end; i++) {
        range.push(i);
      }
    }
    
    return range;
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* Desktop Table View - Hidden on mobile */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column, index) => (
                <th 
                  key={index}
                  className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {column.header}
                </th>
              ))}
              {showActions && (
                <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={columns.length + (showActions ? 1 : 0)} className="px-6 py-12 text-center">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-3 text-gray-500">Loading...</span>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (showActions ? 1 : 0)} className="px-6 py-12 text-center">
                  <div className="text-gray-500">
                    <i className={`fas ${emptyIcon} text-4xl mb-4 text-gray-300`}></i>
                    <p className="text-lg font-medium">{emptyMessage}</p>
                    <p className="text-sm">Try adjusting your search or filter criteria</p>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((item, rowIndex) => (
                <tr key={item._id || rowIndex} className="hover:bg-gray-50 transition-colors duration-200">
                  {columns.map((column, colIndex) => (
                    <td key={colIndex} className="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-sm">
                      {column.render ? column.render(item) : item[column.key]}
                    </td>
                  ))}
                  {showActions && (
                    <td className="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-sm font-medium">
                      {customActions ? customActions(item) : (
                        <div className="flex space-x-1 lg:space-x-2">
                          {onEdit && (
                            <button
                              onClick={() => onEdit(item)}
                              className="text-blue-600 hover:text-blue-900 hover:bg-blue-50 px-2 lg:px-3 py-1 rounded transition-all duration-200 text-xs lg:text-sm"
                              title="Edit"
                            >
                              <i className="fas fa-edit lg:mr-1"></i>
                              <span className="hidden lg:inline">Edit</span>
                            </button>
                          )}
                          {onDelete && (
                            <button
                              onClick={() => onDelete(item)}
                              className="text-red-600 hover:text-red-900 hover:bg-red-50 px-2 lg:px-3 py-1 rounded transition-all duration-200 text-xs lg:text-sm"
                              title="Delete"
                            >
                              <i className="fas fa-trash lg:mr-1"></i>
                              <span className="hidden lg:inline">Delete</span>
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View - Visible only on mobile */}
      <div className="md:hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-500">Loading...</span>
          </div>
        ) : data.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <i className={`fas ${emptyIcon} text-4xl mb-4 text-gray-300`}></i>
            <p className="text-lg font-medium">{emptyMessage}</p>
            <p className="text-sm">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {data.map((item, index) => (
              <div key={item._id || index} className="p-4 hover:bg-gray-50 transition-colors duration-200">
                <div className="space-y-3">
                  {columns.map((column, colIndex) => (
                    <div key={colIndex} className="flex justify-between items-start">
                      <span className="text-sm font-medium text-gray-500 flex-shrink-0 w-20">
                        {column.header}:
                      </span>
                      <div className="flex-1 text-right text-sm text-gray-900">
                        {column.render ? column.render(item) : item[column.key]}
                      </div>
                    </div>
                  ))}
                  {showActions && (
                    <div className="flex justify-end space-x-2 pt-2 border-t border-gray-100">
                      {customActions ? customActions(item) : (
                        <>
                          {onEdit && (
                            <button
                              onClick={() => onEdit(item)}
                              className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded text-sm font-medium transition-all duration-200"
                            >
                              <i className="fas fa-edit mr-1"></i>Edit
                            </button>
                          )}
                          {onDelete && (
                            <button
                              onClick={() => onDelete(item)}
                              className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1 rounded text-sm font-medium transition-all duration-200"
                            >
                              <i className="fas fa-trash mr-1"></i>Delete
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Responsive Pagination */}
      {pagination && !loading && data.length > 0 && (
        <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
          <div className="flex items-center justify-between">
            {/* Mobile Pagination */}
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
                className="relative inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <i className="fas fa-chevron-left mr-1"></i>
                Previous
              </button>
              <span className="text-sm text-gray-700 flex items-center">
                {pagination.currentPage} / {pagination.totalPages}
              </span>
              <button
                onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.totalPages}
                className="relative inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <i className="fas fa-chevron-right ml-1"></i>
              </button>
            </div>
            
            {/* Desktop Pagination */}
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{pagination.startIndex + 1}</span> to{' '}
                  <span className="font-medium">{Math.min(pagination.endIndex, pagination.total)}</span> of{' '}
                  <span className="font-medium">{pagination.total}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Previous</span>
                    <i className="fas fa-chevron-left h-5 w-5" aria-hidden="true"></i>
                  </button>
                  
                  {getPaginationRange().map((page) => (
                    <button
                      key={page}
                      onClick={() => pagination.onPageChange(page)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        page === pagination.currentPage
                          ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
                    disabled={pagination.currentPage === pagination.totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Next</span>
                    <i className="fas fa-chevron-right h-5 w-5" aria-hidden="true"></i>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;