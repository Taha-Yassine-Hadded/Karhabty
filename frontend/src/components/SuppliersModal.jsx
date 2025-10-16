import React, { useEffect, useState } from "react";

const SuppliersModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [suppliers, setSuppliers] = useState([]);
  const [partName, setPartName] = useState('');

  useEffect(() => {
    const handleShowSuppliers = (event) => {
      setSuppliers(event.detail.suppliers || []);
      setPartName(event.detail.partName || 'Spare Part');
      setIsOpen(true);
    };

    window.addEventListener('showSuppliers', handleShowSuppliers);

    return () => {
      window.removeEventListener('showSuppliers', handleShowSuppliers);
    };
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900 flex items-center">
              <i className="fas fa-truck text-red-600 mr-3"></i>
              Suppliers for {partName}
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <i className="fas fa-times text-xl"></i>
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {suppliers.length === 0 ? (
            <div className="text-center py-8">
              <i className="fas fa-box-open text-gray-300 text-5xl mb-4"></i>
              <p className="text-gray-500">No suppliers available for this part</p>
            </div>
          ) : (
            <div className="space-y-4">
              {suppliers.map((supplier, index) => (
                <div
                  key={supplier._id || index}
                  className="border border-gray-200 rounded-lg p-4 hover:border-red-300 hover:shadow-md transition-all"
                >
                  <div className="flex items-start gap-4">
                    {/* Supplier Icon */}
                    <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                      <i className="fas fa-building text-red-600 text-lg"></i>
                    </div>

                    {/* Supplier Info */}
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-gray-900 mb-2">
                        {supplier.name || 'Unknown Supplier'}
                      </h4>

                      {/* Contact Info */}
                      <div className="space-y-2">
                        {supplier.email && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <i className="fas fa-envelope text-red-600 w-4"></i>
                            <a 
                              href={`mailto:${supplier.email}`}
                              className="hover:text-red-600 hover:underline"
                            >
                              {supplier.email}
                            </a>
                          </div>
                        )}

                        {supplier.phone && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <i className="fas fa-phone text-red-600 w-4"></i>
                            <a 
                              href={`tel:${supplier.phone}`}
                              className="hover:text-red-600 hover:underline"
                            >
                              {supplier.phone}
                            </a>
                          </div>
                        )}

                        {supplier.address && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <i className="fas fa-map-marker-alt text-red-600 w-4"></i>
                            <span>{supplier.address}</span>
                          </div>
                        )}

                        {supplier.website && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <i className="fas fa-globe text-red-600 w-4"></i>
                            <a 
                              href={supplier.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:text-red-600 hover:underline"
                            >
                              Visit Website
                            </a>
                          </div>
                        )}
                      </div>

                      {/* Contact Button */}
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <a
                          href={`mailto:${supplier.email || ''}?subject=Inquiry about ${partName}`}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-semibold"
                        >
                          <i className="fas fa-paper-plane"></i>
                          Send Inquiry
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex-shrink-0">
          <button
            onClick={() => setIsOpen(false)}
            className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuppliersModal;
