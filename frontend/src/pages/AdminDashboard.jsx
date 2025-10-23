import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import DashboardHeader from '../components/DashboardHeader';
import StatsCards from '../components/StatsCards';
import UsersChart from '../components/charts/UsersChart';
import CarsChart from '../components/charts/CarsChart';
import SparePartsChart from '../components/charts/SparePartsChart';
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
  const [sparePartsUsage, setSparePartsUsage] = useState([]);

  // Remove unused state and functions
  // const [recentActivity, setRecentActivity] = useState([]);

  // Remove QuickActionCard component as it's no longer needed

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch all required data
      const [usersRes, carsRes, sparePartsRes, suppliersRes, techniciansRes] = await Promise.all([
        api.get('/api/admin/users'),
        api.get('/api/admin/cars'),
        api.get('/api/admin/spare-parts'),
        api.get('/api/admin/suppliers'),
        api.get('/api/admin/technicians')
      ]);

      // Calculate spare parts usage from cars
      const sparePartsUsageData = {};
      carsRes.data.forEach(car => {
        if (car.spareParts && car.spareParts.length > 0) {
          car.spareParts.forEach(sp => {
            const partName = sp.part?.name || 'Unknown Part';
            sparePartsUsageData[partName] = (sparePartsUsageData[partName] || 0) + 1;
          });
        }
      });

      setStats({
        totalUsers: usersRes.data.length,
        totalCars: carsRes.data.length,
        totalSpareParts: sparePartsRes.data.length,
        totalSuppliers: suppliersRes.data.length,
        totalTechnicians: techniciansRes.data.length
      });

      setSparePartsUsage(Object.entries(sparePartsUsageData).map(([name, count]) => ({
        name,
        count
      })));

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Stats data for StatsCards component
  const statsData = [
    {
      label: 'Total Users',
      value: stats.totalUsers,
      icon: 'fa-users',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600'
    },
    {
      label: 'Total Cars',
      value: stats.totalCars,
      icon: 'fa-car',
      bgColor: 'bg-green-100',
      textColor: 'text-green-600'
    },
    {
      label: 'Spare Parts',
      value: stats.totalSpareParts,
      icon: 'fa-cogs',
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-600'
    },
    {
      label: 'Suppliers',
      value: stats.totalSuppliers,
      icon: 'fa-building',
      bgColor: 'bg-orange-100',
      textColor: 'text-orange-600'
    }
  ];

  // Remove QuickActionCard component since we removed Quick Actions section
  
  return (
    <AdminLayout>
      <div className="space-y-6">
        <DashboardHeader 
          title="Dashboard" 
          subtitle="Welcome to your admin dashboard"
          gradientFrom="from-red-600"
          gradientTo="to-red-700"
        />

        {/* Statistics Cards */}
        <div className="mb-8">
          <StatsCards stats={statsData} />
        </div>

        {/* Analytics Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {/* Users Chart */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Users Analytics</h3>
            <div className="h-80">
              <UsersChart stats={stats} loading={loading} />
            </div>
          </div>

          {/* Cars Chart */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Cars Overview</h3>
            <div className="h-80">
              <CarsChart stats={stats} loading={loading} />
            </div>
          </div>

          {/* Spare Parts Chart */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Spare Parts Usage</h3>
            <div className="h-80">
              <SparePartsChart sparePartsUsage={sparePartsUsage} loading={loading} />
            </div>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;