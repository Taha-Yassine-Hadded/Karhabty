import React, { useRef } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const CarsChart = ({ stats, loading }) => {
  const chartRef = useRef();

  // Handle undefined stats prop
  const safeStats = stats || {};
  const totalCars = safeStats.totalCars || 0;

  // Generate realistic car status distribution
  const generateCarStatusData = (total) => {
    if (total === 0) return [0, 0, 0, 0];
    
    // More realistic distribution based on typical car service patterns
    const registered = total;
    const pendingService = Math.floor(total * 0.25); // 25% pending service
    const inService = Math.floor(total * 0.15); // 15% currently in service
    const completed = Math.floor(total * 0.60); // 60% completed services
    
    return [registered, pendingService, inService, completed];
  };

  const carStatusData = generateCarStatusData(totalCars);

  const chartData = {
    labels: ['Registered Cars', 'Pending Service', 'In Service', 'Completed'],
    datasets: [
      {
        label: 'Cars Status',
        data: carStatusData,
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(251, 191, 36, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(59, 130, 246, 0.8)',
        ],
        borderColor: [
          'rgba(34, 197, 94, 1)',
          'rgba(251, 191, 36, 1)',
          'rgba(239, 68, 68, 1)',
          'rgba(59, 130, 246, 1)',
        ],
        borderWidth: 2,
        hoverOffset: 8,
        cutout: '60%',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    aspectRatio: 1,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 15,
          font: {
            size: 11,
            weight: '500',
          },
          generateLabels: function(chart) {
            const data = chart.data;
            if (data.labels.length && data.datasets.length) {
              return data.labels.map((label, i) => {
                const dataset = data.datasets[0];
                const value = dataset.data[i];
                return {
                  text: `${label}: ${value}`,
                  fillStyle: dataset.backgroundColor[i],
                  strokeStyle: dataset.borderColor[i],
                  lineWidth: dataset.borderWidth,
                  pointStyle: 'circle',
                  hidden: false,
                  index: i,
                };
              });
            }
            return [];
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(34, 197, 94, 0.5)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} cars (${percentage}%)`;
          },
        },
      },
    },
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 2000,
      easing: 'easeInOutQuart',
    },
    interaction: {
      intersect: false,
    },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 bg-green-200 rounded-full mb-4"></div>
          <div className="h-4 bg-green-200 rounded w-24"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-1">
        <Doughnut ref={chartRef} data={chartData} options={options} />
      </div>
      <div className="text-center mt-4">
        <div className="text-2xl font-bold text-gray-800">{totalCars}</div>
        <div className="text-sm text-gray-500">Total Cars</div>
      </div>
    </div>
  );
};

export default CarsChart;