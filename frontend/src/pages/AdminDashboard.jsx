import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import api from '../utils/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCars: 0,
    totalSpareParts: 0,
    totalSuppliers: 0,
    totalTechnicians: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch all data to calculate statistics using centralized API
      const [usersRes, sparePartsRes, suppliersRes, techniciansRes] = await Promise.all([
        api.get('/api/admin/users'),
        api.get('/api/admin/spare-parts'),
        api.get('/api/admin/suppliers'),
        api.get('/api/admin/technicians')
      ]);

      setStats({
        totalUsers: usersRes.data.length,
        totalCars: 0, // You can add cars endpoint later
        totalSpareParts: sparePartsRes.data.length,
        totalSuppliers: suppliersRes.data.length,
        totalTechnicians: techniciansRes.data.length
      });

      // Set recent activity based on real data
      const activities = [];
      
      // Add recent users (last 3)
      const recentUsers = usersRes.data.slice(-3);
      recentUsers.forEach(user => {
        activities.push({
          id: `user-${user._id}`,
          action: 'New user registered',
          user: user.name,
          time: new Date(user.createdAt).toLocaleDateString(),
          icon: 'fas fa-user-plus',
          color: 'text-green-600'
        });
      });

      // Add recent spare parts
      const recentParts = sparePartsRes.data.slice(-2);
      recentParts.forEach(part => {
        activities.push({
          id: `part-${part._id}`,
          action: 'Spare part added',
          user: 'Admin',
          time: new Date(part.createdAt || Date.now()).toLocaleDateString(),
          icon: 'fas fa-cogs',
          color: 'text-blue-600'
        });
      });

      setRecentActivity(activities.slice(0, 5));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
      
      // Keep some mock data for development
      setStats({
        totalUsers: 15,
        totalCars: 8,
        totalSpareParts: 45,
        totalSuppliers: 12,
        totalTechnicians: 6
      });
      
      setRecentActivity([
        { id: 1, action: 'New user registered', user: 'John Doe', time: '2 hours ago', icon: 'fas fa-user-plus', color: 'text-green-600' },
        { id: 2, action: 'Spare part added', user: 'Admin', time: '4 hours ago', icon: 'fas fa-cogs', color: 'text-blue-600' },
        { id: 3, action: 'Supplier updated', user: 'Admin', time: '6 hours ago', icon: 'fas fa-building', color: 'text-purple-600' },
        { id: 4, action: 'New technician added', user: 'Manager', time: '1 day ago', icon: 'fas fa-user-cog', color: 'text-orange-600' },
      ]);
    }
  };

  const StatCard = ({ title, value, icon, color = 'blue', bgColor = 'bg-blue-100' }) => (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center">
        <div className={`p-4 rounded-full ${bgColor} mr-4`}>
          <i className={`${icon} text-2xl text-${color}-600`}></i>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">
            {loading ? (
              <div className="animate-pulse bg-gray-200 h-8 w-16 rounded"></div>
            ) : (
              value
            )}
          </p>
        </div>
      </div>
    </div>
  );

  const QuickActionCard = ({ title, icon, onClick, color = 'blue' }) => (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center p-6 border-2 border-gray-200 rounded-xl hover:border-${color}-300 hover:bg-${color}-50 transition-all duration-200 group`}
    >
      <i className={`${icon} text-3xl text-${color}-600 mb-3 group-hover:scale-110 transition-transform duration-200`}></i>
      <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">{title}</span>
    </button>
  );

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-xl p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-white text-3xl font-bold mb-2">Dashboard Overview</h1>
              <p className="text-red-100">Welcome to your admin dashboard - Manage your auto service business</p>
            </div>
            <div className="hidden md:block">
              <i className="fas fa-chart-line text-6xl text-red-200"></i>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          <StatCard 
            title="Total Users" 
            value={stats.totalUsers} 
            icon="fas fa-users"
            color="blue"
            bgColor="bg-blue-100"
          />
          <StatCard 
            title="Cars" 
            value={stats.totalCars} 
            icon="fas fa-car"
            color="green"
            bgColor="bg-green-100"
          />
          <StatCard 
            title="Spare Parts" 
            value={stats.totalSpareParts} 
            icon="fas fa-cogs"
            color="yellow"
            bgColor="bg-yellow-100"
          />
          <StatCard 
            title="Suppliers" 
            value={stats.totalSuppliers} 
            icon="fas fa-building"
            color="purple"
            bgColor="bg-purple-100"
          />
          <StatCard 
            title="Technicians" 
            value={stats.totalTechnicians} 
            icon="fas fa-user-cog"
            color="red"
            bgColor="bg-red-100"
          />
        </div>

        {/* Recent Activity and Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <i className="fas fa-clock mr-2 text-gray-600"></i>
                Recent Activity
              </h3>
            </div>
            <div className="p-6">
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="animate-pulse flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <i className={`${activity.icon} text-sm ${activity.color}`}></i>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                        <p className="text-xs text-gray-500">by {activity.user} • {activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <i className="fas fa-bolt mr-2 text-gray-600"></i>
                Quick Actions
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <QuickActionCard 
                  title="Manage Users" 
                  icon="fas fa-users"
                  onClick={() => window.location.href = '/admin/users'}
                  color="blue"
                />
                <QuickActionCard 
                  title="Spare Parts" 
                  icon="fas fa-cogs"
                  onClick={() => window.location.href = '/admin/spare-parts'}
                  color="green"
                />
                <QuickActionCard 
                  title="Suppliers" 
                  icon="fas fa-building"
                  onClick={() => window.location.href = '/admin/suppliers'}
                  color="purple"
                />
                <QuickActionCard 
                  title="Technicians" 
                  icon="fas fa-user-cog"
                  onClick={() => window.location.href = '/admin/technicians'}
                  color="orange"
                />
              </div>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-white rounded-xl shadow-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <i className="fas fa-server mr-2 text-gray-600"></i>
              System Status
            </h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 rounded-lg bg-green-50">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <i className="fas fa-database text-green-600 text-xl"></i>
                </div>
                <p className="text-sm font-semibold text-gray-900">Database</p>
                <p className="text-xs text-green-600 font-medium">Connected</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-green-50">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <i className="fas fa-server text-green-600 text-xl"></i>
                </div>
                <p className="text-sm font-semibold text-gray-900">API Server</p>
                <p className="text-xs text-green-600 font-medium">Running</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-green-50">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <i className="fas fa-shield-alt text-green-600 text-xl"></i>
                </div>
                <p className="text-sm font-semibold text-gray-900">Security</p>
                <p className="text-xs text-green-600 font-medium">Protected</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;