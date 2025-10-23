import React from "react";
import { Link } from "react-router-dom";

const SparePartRecommendation = ({ sparePart, changeMonth, changeYear, kilometrage, currentCarKilometrage }) => {
  // Calculate if replacement is needed based on both time and kilometrage
  const calculateRecommendation = () => {
    if (!changeMonth || !changeYear) {
      return null;
    }

    let timeRecommendation = null;
    let kilometrageRecommendation = null;

    // Time-based recommendation
    if (sparePart.lifespanMonths) {
      const changeDate = new Date(changeYear, changeMonth - 1);
      const now = new Date();
      const monthsSinceChange = (now.getFullYear() - changeDate.getFullYear()) * 12 + 
                                (now.getMonth() - changeDate.getMonth());

      const lifespanMonths = sparePart.lifespanMonths;
      const timePercentUsed = (monthsSinceChange / lifespanMonths) * 100;

      timeRecommendation = {
        percentUsed: Math.min(Math.round(timePercentUsed), 100),
        isOverdue: monthsSinceChange >= lifespanMonths
      };
    }

    // Kilometrage-based recommendation
    if (sparePart.lifespanKm && currentCarKilometrage && kilometrage !== undefined) {
      const kmSinceChange = currentCarKilometrage - kilometrage;
      const lifespanKm = sparePart.lifespanKm;
      const kmPercentUsed = (kmSinceChange / lifespanKm) * 100;

      kilometrageRecommendation = {
        percentUsed: Math.min(Math.round(kmPercentUsed), 100),
        isOverdue: kmSinceChange >= lifespanKm,
        kmSinceChange,
        lifespanKm
      };
    }

    // Determine the most critical recommendation
    let finalRecommendation = null;
    let maxPercentUsed = 0;
    let recommendationType = '';

    if (timeRecommendation) {
      maxPercentUsed = Math.max(maxPercentUsed, timeRecommendation.percentUsed);
      if (timeRecommendation.percentUsed >= maxPercentUsed) {
        recommendationType = 'time';
      }
    }

    if (kilometrageRecommendation) {
      maxPercentUsed = Math.max(maxPercentUsed, kilometrageRecommendation.percentUsed);
      if (kilometrageRecommendation.percentUsed >= maxPercentUsed) {
        recommendationType = 'kilometrage';
      }
    }

    if (maxPercentUsed === 0) {
      return null;
    }

    // Determine status based on highest percentage
    const isOverdue = (timeRecommendation?.isOverdue) || (kilometrageRecommendation?.isOverdue);
    
    if (isOverdue || maxPercentUsed >= 100) {
      finalRecommendation = {
        status: 'critical',
        message: 'Replacement Overdue!',
        color: 'red',
        icon: 'fa-exclamation-triangle',
        percentUsed: 100
      };
    } else if (maxPercentUsed >= 80) {
      finalRecommendation = {
        status: 'warning',
        message: 'Replacement Recommended Soon',
        color: 'orange',
        icon: 'fa-exclamation-circle',
        percentUsed: Math.round(maxPercentUsed)
      };
    } else if (maxPercentUsed >= 50) {
      finalRecommendation = {
        status: 'caution',
        message: 'Monitor Condition',
        color: 'yellow',
        icon: 'fa-info-circle',
        percentUsed: Math.round(maxPercentUsed)
      };
    } else {
      finalRecommendation = {
        status: 'good',
        message: 'In Good Condition',
        color: 'green',
        icon: 'fa-check-circle',
        percentUsed: Math.round(maxPercentUsed)
      };
    }

    // Add recommendation details
    finalRecommendation.recommendationType = recommendationType;
    finalRecommendation.timeRecommendation = timeRecommendation;
    finalRecommendation.kilometrageRecommendation = kilometrageRecommendation;

    return finalRecommendation;
  };

  const recommendation = calculateRecommendation();

  if (!recommendation) {
    return null;
  }

  const getColorClasses = (color) => {
    const colors = {
      red: 'bg-red-100 border-red-300 text-red-800',
      orange: 'bg-orange-100 border-orange-300 text-orange-800',
      yellow: 'bg-yellow-100 border-yellow-300 text-yellow-800',
      green: 'bg-green-100 border-green-300 text-green-800'
    };
    return colors[color] || colors.green;
  };

  const getProgressColor = (color) => {
    const colors = {
      red: 'bg-red-600',
      orange: 'bg-orange-500',
      yellow: 'bg-yellow-500',
      green: 'bg-green-600'
    };
    return colors[color] || colors.green;
  };

  return (
    <div className={`spare-part-recommendation p-4 rounded-lg border-2 ${getColorClasses(recommendation.color)} mb-4`}>
      {/* Status Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <i className={`fas ${recommendation.icon} text-lg`}></i>
          <span className="font-bold text-sm">{recommendation.message}</span>
        </div>
        <span className="text-xs font-semibold px-2 py-1 bg-white rounded">
          {recommendation.percentUsed}% Used
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-white rounded-full h-2 mb-3">
        <div 
          className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(recommendation.color)}`}
          style={{ width: `${recommendation.percentUsed}%` }}
        ></div>
      </div>

      {/* Lifespan Info */}
      <div className="text-xs mb-3 space-y-1">
        {sparePart.lifespanMonths && (
          <div>
            <i className="fas fa-clock mr-1"></i>
            Recommended lifespan: {sparePart.lifespanMonths} months
            {recommendation.timeRecommendation && (
              <span className="ml-2 text-gray-600">
                ({recommendation.timeRecommendation.percentUsed}% time-based)
              </span>
            )}
          </div>
        )}
        {sparePart.lifespanKm && (
          <div>
            <i className="fas fa-road mr-1"></i>
            Recommended lifespan: {sparePart.lifespanKm.toLocaleString()} km
            {recommendation.kilometrageRecommendation && (
              <span className="ml-2 text-gray-600">
                ({recommendation.kilometrageRecommendation.kmSinceChange?.toLocaleString() || 0} km used, {recommendation.kilometrageRecommendation.percentUsed}% km-based)
              </span>
            )}
          </div>
        )}
        {recommendation.recommendationType && (
          <div className="text-xs text-gray-500 italic">
            Primary recommendation based on: {recommendation.recommendationType === 'time' ? 'Time usage' : 'Kilometrage usage'}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      {(recommendation.status === 'critical' || recommendation.status === 'warning') && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-3 pt-3 border-t border-current border-opacity-20">
          {/* View Store */}
          <Link
            to="/shop"
            className="flex items-center justify-center gap-2 px-3 py-2 bg-white hover:bg-gray-50 rounded-lg text-xs font-semibold transition-all shadow-sm"
          >
            <i className="fas fa-store"></i>
            <span>Browse Store</span>
          </Link>

          {/* View Suppliers */}
          {sparePart.suppliers && sparePart.suppliers.length > 0 && (
            <button
              onClick={() => {
                // This will trigger a modal or accordion to show supplier details
                const event = new CustomEvent('showSuppliers', { 
                  detail: { suppliers: sparePart.suppliers, partName: sparePart.name }
                });
                window.dispatchEvent(event);
              }}
              className="flex items-center justify-center gap-2 px-3 py-2 bg-white hover:bg-gray-50 rounded-lg text-xs font-semibold transition-all shadow-sm"
            >
              <i className="fas fa-truck"></i>
              <span>Suppliers ({sparePart.suppliers.length})</span>
            </button>
          )}

          {/* Contact Support */}
          <Link
            to="/contact"
            className="flex items-center justify-center gap-2 px-3 py-2 bg-white hover:bg-gray-50 rounded-lg text-xs font-semibold transition-all shadow-sm"
          >
            <i className="fas fa-headset"></i>
            <span>Contact Us</span>
          </Link>
        </div>
      )}
    </div>
  );
};

export default SparePartRecommendation;
