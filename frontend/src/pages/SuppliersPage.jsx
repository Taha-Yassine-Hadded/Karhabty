import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../utils/api';
import Preloader from "../helper/Preloader";
import HeaderOne from '../components/HeaderOne';
import Breadcrumb from '../components/Breadcrumb';
import SubscribeOne from '../components/SubscribeOne';
import FooterAreaOne from '../components/FooterAreaOne';

const SuppliersPage = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [expandedItems, setExpandedItems] = useState({});

  let [active, setActive] = useState(true);
  useEffect(() => {
    setTimeout(function () {
      setActive(false);
    }, 2000);
  }, []);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  useEffect(() => {
    filterSuppliers();
  }, [suppliers, searchTerm]);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/public/suppliers');
      setSuppliers(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      setLoading(false);
      toast.error('Failed to load suppliers');
    }
  };

  const filterSuppliers = () => {
    if (!searchTerm.trim()) {
      setFilteredSuppliers(suppliers);
    } else {
      const filtered = suppliers.filter(supplier =>
        supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (supplier.email && supplier.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (supplier.phone && supplier.phone.includes(searchTerm)) ||
        (supplier.address && supplier.address.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredSuppliers(filtered);
    }
  };

  const toggleExpanded = (supplierId) => {
    setExpandedItems(prev => ({
      ...prev,
      [supplierId]: !prev[supplierId]
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading suppliers...</p>
        </div>
      </div>
    );
  }

  return (
    <>
    {/* Preloader */}
      {active === true && <Preloader />}
    
    {/* Header one */}
      <HeaderOne />

    {/* Breadcrumb */}
    <Breadcrumb title={"Suppliers"} />

    <div className="min-h-screen bg-gray-50">

      {/* Search Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                <i className="fas fa-search text-gray-400 text-sm"></i>
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg text-sm bg-white placeholder-gray-400 focus:outline-none focus:placeholder-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
                placeholder="Search suppliers by name, email, phone, or address..."
              />
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-2">
                <i className="fas fa-building text-red-600"></i>
                {filteredSuppliers.length} suppliers found
              </span>
            </div>
          </div>
        </div>

        {/* Suppliers List */}
        <div className="space-y-4">
          {filteredSuppliers.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <i className="fas fa-search text-gray-300 text-5xl mb-4"></i>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No suppliers found</h3>
              <p className="text-gray-500">
                {searchTerm ? 'Try adjusting your search terms' : 'No suppliers available at the moment'}
              </p>
            </div>
          ) : (
            filteredSuppliers.map((supplier) => (
              <div key={supplier._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {/* Collapsible Header */}
                <div
                  className="p-6 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
                  onClick={() => toggleExpanded(supplier._id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                        <i className="fas fa-building text-red-600 text-lg"></i>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{supplier.name}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                          {supplier.email && (
                            <span className="flex items-center">
                              <i className="fas fa-envelope mr-1"></i>
                              {supplier.email}
                            </span>
                          )}
                          {supplier.phone && (
                            <span className="flex items-center">
                              <i className="fas fa-phone mr-1"></i>
                              {supplier.phone}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      {supplier.spareParts && (
                        <span className="inline-flex px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                          <i className="fas fa-cogs mr-1"></i>
                          {supplier.spareParts.length} parts
                        </span>
                      )}
                      <i className={`fas fa-chevron-${expandedItems[supplier._id] ? 'up' : 'down'} text-gray-400 transition-transform duration-200`}></i>
                    </div>
                  </div>
                </div>

                {/* Collapsible Content */}
                {expandedItems[supplier._id] && (
                  <div className="border-t border-gray-200 bg-gray-50">
                    <div className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Contact Information */}
                        <div>
                          <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                            <i className="fas fa-address-card mr-2 text-red-600"></i>
                            Contact Information
                          </h4>
                          <div className="space-y-3">
                            {supplier.email && (
                              <div className="flex items-center space-x-3">
                                <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                                  <i className="fas fa-envelope text-red-600 text-sm"></i>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-900">Email</p>
                                  <a 
                                    href={`mailto:${supplier.email}`}
                                    className="text-sm text-red-600 hover:text-red-700 hover:underline"
                                  >
                                    {supplier.email}
                                  </a>
                                </div>
                              </div>
                            )}
                            {supplier.phone && (
                              <div className="flex items-center space-x-3">
                                <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                                  <i className="fas fa-phone text-red-600 text-sm"></i>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-900">Phone</p>
                                  <a 
                                    href={`tel:${supplier.phone}`}
                                    className="text-sm text-red-600 hover:text-red-700 hover:underline"
                                  >
                                    {supplier.phone}
                                  </a>
                                </div>
                              </div>
                            )}
                            {supplier.address && (
                              <div className="flex items-start space-x-3">
                                <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                                  <i className="fas fa-map-marker-alt text-red-600 text-sm"></i>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-900">Address</p>
                                  <p className="text-sm text-gray-600">{supplier.address}</p>
                                </div>
                              </div>
                            )}
                            {supplier.website && (
                              <div className="flex items-center space-x-3">
                                <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                                  <i className="fas fa-globe text-red-600 text-sm"></i>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-900">Website</p>
                                  <a 
                                    href={supplier.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-red-600 hover:text-red-700 hover:underline"
                                  >
                                    Visit Website
                                  </a>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Spare Parts */}
                        <div>
                          <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                            <i className="fas fa-cogs mr-2 text-red-600"></i>
                            Spare Parts ({supplier.spareParts?.length || 0})
                          </h4>
                          {supplier.spareParts && supplier.spareParts.length > 0 ? (
                            <div className="space-y-2 max-h-48 overflow-y-auto">
                              {supplier.spareParts.map((part, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                                  <div className="flex items-center space-x-3">
                                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                      <i className="fas fa-cog text-blue-600 text-sm"></i>
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium text-gray-900">{part.name}</p>
                                      {part.category && (
                                        <p className="text-xs text-gray-500">{part.category}</p>
                                      )}
                                    </div>
                                  </div>
                                  {part.price && (
                                    <span className="text-sm font-semibold text-green-600">
                                      ${part.price}
                                    </span>
                                  )}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-6 text-gray-500">
                              <i className="fas fa-box-open text-gray-300 text-3xl mb-2"></i>
                              <p className="text-sm">No spare parts listed</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="mt-6 pt-4 border-t border-gray-200">
                        <div className="flex flex-wrap gap-3">
                          {supplier.email && (
                            <a
                              href={`mailto:${supplier.email}`}
                              className="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors duration-200"
                            >
                              <i className="fas fa-envelope mr-2"></i>
                              Send Email
                            </a>
                          )}
                          {supplier.phone && (
                            <a
                              href={`tel:${supplier.phone}`}
                              className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors duration-200"
                            >
                              <i className="fas fa-phone mr-2"></i>
                              Call Now
                            </a>
                          )}
                          {supplier.website && (
                            <a
                              href={supplier.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
                            >
                              <i className="fas fa-external-link-alt mr-2"></i>
                              Visit Website
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>

    <SubscribeOne />

      {/* Footer Area One */}
      <FooterAreaOne />
  </>
  );
};

export default SuppliersPage;