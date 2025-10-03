import React from 'react';

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  onSubmit, 
  loading = false, 
  submitText = "Save", 
  editMode = false,
  maxWidth = "max-w-md"
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className={`bg-white rounded-xl shadow-2xl w-full ${maxWidth} max-h-screen flex flex-col mx-2 sm:mx-4`}>
        {/* Modal Header - Fixed */}
        <div className="px-4 py-3 sm:px-6 sm:py-4 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center">
              <i className={`fas ${editMode ? 'fa-edit' : 'fa-plus'} mr-2 text-blue-600`}></i>
              <span className="truncate">{title}</span>
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0 ml-2"
              disabled={loading}
            >
              <i className="fas fa-times text-lg sm:text-xl"></i>
            </button>
          </div>
        </div>
        
        {/* Modal Body - Scrollable */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {children}
        </div>

        {/* Modal Footer - Fixed */}
        <div className="px-4 py-3 sm:px-6 sm:py-4 border-t border-gray-200 flex-shrink-0">
          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2 sm:px-6 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200 text-sm sm:text-base"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={onSubmit}
              disabled={loading}
              className="w-full sm:w-auto px-4 py-2 sm:px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center text-sm sm:text-base"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {editMode ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>
                  <i className={`fas ${editMode ? 'fa-save' : 'fa-plus'} mr-2`}></i>
                  {submitText}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;