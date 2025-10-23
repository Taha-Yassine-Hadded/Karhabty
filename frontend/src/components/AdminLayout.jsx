import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const handleGoHome = () => {
    navigate('/');
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-container')) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  const menuItems = [
    { path: '/admin', icon: 'fas fa-chart-pie', label: 'Dashboard', exact: true },
    { path: '/admin/users', icon: 'fas fa-users', label: 'Users' },
    { path: '/admin/cars', icon: 'fas fa-car', label: 'Cars' },
    { path: '/admin/spare-parts', icon: 'fas fa-cogs', label: 'Spare Parts' },
    { path: '/admin/suppliers', icon: 'fas fa-building', label: 'Suppliers' },
    { path: '/admin/technicians', icon: 'fas fa-user-cog', label: 'Technicians' }
  ];

  const isActiveRoute = (path, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-red-600 to-red-700 shadow-2xl transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:relative lg:flex lg:flex-col overflow-y-auto`}>
        {/* Logo/Brand */}
        <div className="flex items-center justify-between h-20 px-4 bg-red-800 shadow-lg flex-shrink-0">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center mr-3">
              <i className="fas fa-tools text-red-600 text-xl"></i>
            </div>
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-white">Karhabty Admin</h1>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 text-red-100 hover:bg-red-500 hover:text-white rounded-lg transition-all duration-200 lg:hidden"
          >
            <i className="fas fa-times text-lg"></i>
          </button>
        </div>
        
        {/* Navigation Menu */}
        <nav className="flex-1 mt-8 px-4">
          <div className="space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-3 text-red-100 hover:bg-red-500 hover:text-white rounded-lg transition-all duration-200 group ${
                  isActiveRoute(item.path, item.exact) 
                    ? 'bg-red-500 text-white shadow-lg border-r-4 border-red-300' 
                    : 'hover:shadow-md'
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <i className={`${item.icon} mr-4 text-lg w-5 text-center group-hover:scale-110 transition-transform duration-200`}></i>
                <span className="font-medium">{item.label}</span>
                {isActiveRoute(item.path, item.exact) && (
                  <div className="ml-auto">
                    <div className="w-2 h-2 bg-red-200 rounded-full"></div>
                  </div>
                )}
              </Link>
            ))}
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 text-red-100 hover:bg-red-500 hover:text-white rounded-lg transition-all duration-200 group"
            >
              <i className="fas fa-sign-out-alt mr-4 text-lg w-5 text-center group-hover:scale-110 transition-transform duration-200"></i>
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between px-6 py-4">
            {/* Mobile Menu Button */}
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 lg:hidden transition-colors duration-200"
              >
                <i className="fas fa-bars text-xl"></i>
              </button>
              
              {/* Breadcrumb */}
              <div className="ml-4 lg:ml-0">
                <div className="flex items-center text-sm text-gray-600">
                  <i className="fas fa-home mr-2"></i>
                  <span>Admin</span>
                  {location.pathname !== '/admin' && (
                    <>
                      <i className="fas fa-chevron-right mx-2 text-xs"></i>
                      <span className="text-gray-900 font-medium">
                        {menuItems.find(item => location.pathname.startsWith(item.path))?.label || 'Page'}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            {/* Right Side */}
            <div className="flex items-center space-x-4">
              
              {/* User Profile with Dropdown */}
              <div className="flex items-center pl-4 border-l border-gray-200">
                <div className="relative dropdown-container">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center space-x-2 focus:outline-none"
                  >
                    <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow duration-200">
                      <span className="text-white text-sm font-bold">
                        {user.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <i className={`fas fa-chevron-down text-gray-400 transition-transform duration-200 ${dropdownOpen ? 'transform rotate-180' : ''}`}></i>
                  </button>
                  
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      </div>
                      <button
                        onClick={() => {
                          handleGoHome();
                          setDropdownOpen(false);
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-red-200 transition-colors duration-200"
                      >
                        <i className="fas fa-home mr-3 text-red-700"></i>
                        Home
                      </button>
                      <button
                        onClick={() => {
                          handleLogout();
                          setDropdownOpen(false);
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-red-200 transition-colors duration-200"
                      >
                        <i className="fas fa-sign-out-alt mr-3 text-red-700"></i>
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminLayout;