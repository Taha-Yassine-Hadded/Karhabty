import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../utils/api';
import Preloader from "../helper/Preloader";
import HeaderOne from '../components/HeaderOne';
import Breadcrumb from '../components/Breadcrumb';
import SubscribeOne from '../components/SubscribeOne';
import FooterAreaOne from '../components/FooterAreaOne';


const TechniciansPage = () => {
  const [technicians, setTechnicians] = useState([]);
  const [filteredTechnicians, setFilteredTechnicians] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [specialityFilter, setSpecialityFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [expandedItems, setExpandedItems] = useState({});

  let [active, setActive] = useState(true);
  useEffect(() => {
    setTimeout(function () {
      setActive(false);
    }, 2000);
  }, []);

  useEffect(() => {
    fetchTechnicians();
  }, []);

  useEffect(() => {
    filterTechnicians();
  }, [technicians, searchTerm, specialityFilter]);

  const fetchTechnicians = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/public/technicians');
      setTechnicians(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching technicians:', error);
      setLoading(false);
      toast.error('Failed to load technicians');
    }
  };

  const filterTechnicians = () => {
    let filtered = technicians;

    // Filter by search term
    if (searchTerm.trim()) {
      filtered = filtered.filter(technician =>
        technician.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (technician.email && technician.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (technician.phone && technician.phone.includes(searchTerm)) ||
        (technician.address && technician.address.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (technician.cars && technician.cars.some(car => car.toLowerCase().includes(searchTerm.toLowerCase())))
      );
    }

    // Filter by speciality
    if (specialityFilter !== 'all') {
      filtered = filtered.filter(technician => technician.speciality === specialityFilter);
    }

    setFilteredTechnicians(filtered);
  };

  const toggleExpanded = (technicianId) => {
    setExpandedItems(prev => ({
      ...prev,
      [technicianId]: !prev[technicianId]
    }));
  };

  const getSpecialityIcon = (speciality) => {
    return speciality === 'mechanic' ? 'fa-wrench' : 'fa-bolt';
  };

  const getSpecialityColor = (speciality) => {
    return speciality === 'mechanic' 
      ? { bg: 'bg-green-100', text: 'text-green-800', icon: 'text-green-600' }
      : { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: 'text-yellow-600' };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading technicians...</p>
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
    <Breadcrumb title={"Technicians"} />
    
    <div className="min-h-screen bg-gray-50">

      {/* Search and Filter Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                <i className="fas fa-search text-gray-400 text-sm"></i>
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg text-sm bg-white placeholder-gray-400 focus:outline-none focus:placeholder-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
                placeholder="Search technicians by name, email, phone, address, or car brands..."
              />
            </div>
            <div className="flex items-center gap-4">
              <select
                value={specialityFilter}
                onChange={(e) => setSpecialityFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 flex items-center"
              >
                <option value="all">All Specialities</option>
                <option value="mechanic">Mechanics</option>
                <option value="electrician">Electricians</option>
              </select>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-2">
                  <i className="fas fa-users-cog text-red-600"></i>
                  {filteredTechnicians.length} technicians found
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Technicians List */}
        <div className="space-y-4">
          {filteredTechnicians.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <i className="fas fa-search text-gray-300 text-5xl mb-4"></i>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No technicians found</h3>
              <p className="text-gray-500">
                {searchTerm || specialityFilter !== 'all' ? 'Try adjusting your search terms or filters' : 'No technicians available at the moment'}
              </p>
            </div>
          ) : (
            filteredTechnicians.map((technician) => {
              const specialityColors = getSpecialityColor(technician.speciality);
              return (
                <div key={technician._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  {/* Collapsible Header */}
                  <div
                    className="p-6 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
                    onClick={() => toggleExpanded(technician._id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`flex-shrink-0 w-12 h-12 ${specialityColors.bg} rounded-full flex items-center justify-center`}>
                          <i className={`fas ${getSpecialityIcon(technician.speciality)} ${specialityColors.icon} text-lg`}></i>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{technician.name}</h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full capitalize ${specialityColors.bg} ${specialityColors.text}`}>
                              <i className={`fas ${getSpecialityIcon(technician.speciality)} mr-1`}></i>
                              {technician.speciality}
                            </span>
                            {technician.email && (
                              <span className="flex items-center">
                                <i className="fas fa-envelope mr-1"></i>
                                {technician.email}
                              </span>
                            )}
                            {technician.phone && (
                              <span className="flex items-center">
                                <i className="fas fa-phone mr-1"></i>
                                {technician.phone}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        {technician.cars && technician.cars.length > 0 && (
                          <span className="inline-flex px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                            <i className="fas fa-car mr-1"></i>
                            {technician.cars.length} car brands
                          </span>
                        )}
                        <i className={`fas fa-chevron-${expandedItems[technician._id] ? 'up' : 'down'} text-gray-400 transition-transform duration-200`}></i>
                      </div>
                    </div>
                  </div>

                  {/* Collapsible Content */}
                  {expandedItems[technician._id] && (
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
                              <div className="flex items-center space-x-3">
                                <div className={`flex-shrink-0 w-8 h-8 ${specialityColors.bg} rounded-full flex items-center justify-center`}>
                                  <i className={`fas ${getSpecialityIcon(technician.speciality)} ${specialityColors.icon} text-sm`}></i>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-900">Speciality</p>
                                  <p className={`text-sm capitalize ${specialityColors.text} font-medium`}>
                                    {technician.speciality}
                                  </p>
                                </div>
                              </div>
                              {technician.email && (
                                <div className="flex items-center space-x-3">
                                  <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                                    <i className="fas fa-envelope text-red-600 text-sm"></i>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-gray-900">Email</p>
                                    <a 
                                      href={`mailto:${technician.email}`}
                                      className="text-sm text-red-600 hover:text-red-700 hover:underline"
                                    >
                                      {technician.email}
                                    </a>
                                  </div>
                                </div>
                              )}
                              {technician.phone && (
                                <div className="flex items-center space-x-3">
                                  <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                                    <i className="fas fa-phone text-red-600 text-sm"></i>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-gray-900">Phone</p>
                                    <a 
                                      href={`tel:${technician.phone}`}
                                      className="text-sm text-red-600 hover:text-red-700 hover:underline"
                                    >
                                      {technician.phone}
                                    </a>
                                  </div>
                                </div>
                              )}
                              {technician.address && (
                                <div className="flex items-start space-x-3">
                                  <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                                    <i className="fas fa-map-marker-alt text-red-600 text-sm"></i>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-gray-900">Address</p>
                                    <p className="text-sm text-gray-600">{technician.address}</p>
                                  </div>
                                </div>
                              )}
                              {technician.website && (
                                <div className="flex items-center space-x-3">
                                  <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                                    <i className="fas fa-globe text-red-600 text-sm"></i>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-gray-900">Website</p>
                                    <a 
                                      href={technician.website}
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

                          {/* Car Brands Expertise */}
                          <div>
                            <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                              <i className="fas fa-car mr-2 text-red-600"></i>
                              Car Brands Expertise ({technician.cars?.length || 0})
                            </h4>
                            {technician.cars && technician.cars.length > 0 ? (
                              <div className="space-y-2 max-h-48 overflow-y-auto">
                                <div className="grid grid-cols-2 gap-2">
                                  {technician.cars.map((carBrand, index) => (
                                    <div key={index} className="flex items-center p-2 bg-white rounded-lg border border-gray-200">
                                      <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                                        <i className="fas fa-car text-blue-600 text-xs"></i>
                                      </div>
                                      <span className="text-sm font-medium text-gray-900 truncate">{carBrand}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ) : (
                              <div className="text-center py-6 text-gray-500">
                                <i className="fas fa-car text-gray-300 text-3xl mb-2"></i>
                                <p className="text-sm">No car brands specified</p>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-6 pt-4 border-t border-gray-200">
                          <div className="flex flex-wrap gap-3">
                            {technician.email && (
                              <a
                                href={`mailto:${technician.email}`}
                                className="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors duration-200"
                              >
                                <i className="fas fa-envelope mr-2"></i>
                                Send Email
                              </a>
                            )}
                            {technician.phone && (
                              <a
                                href={`tel:${technician.phone}`}
                                className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors duration-200"
                              >
                                <i className="fas fa-phone mr-2"></i>
                                Call Now
                              </a>
                            )}
                            {technician.website && (
                              <a
                                href={technician.website}
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
              );
            })
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

export default TechniciansPage;