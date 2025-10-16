import React, { useState } from "react";
import { Link } from "react-router-dom";

const SparePartsRecommendations = ({ spareParts, recommendedTechnicians = [] }) => {
  const [expandedPart, setExpandedPart] = useState(null);

  const calculateRecommendation = (sparePart, changeMonth, changeYear) => {
    if (!changeMonth || !changeYear || !sparePart?.lifespanMonths) {
      return null;
    }

    const changeDate = new Date(changeYear, changeMonth - 1);
    const now = new Date();
    const monthsSinceChange = (now.getFullYear() - changeDate.getFullYear()) * 12 + 
                              (now.getMonth() - changeDate.getMonth());

    const lifespanMonths = sparePart.lifespanMonths;
    const percentUsed = (monthsSinceChange / lifespanMonths) * 100;

    // Determine status
    if (monthsSinceChange >= lifespanMonths) {
      return {
        status: 'critical',
        message: 'Replacement Overdue!',
        description: 'This part has exceeded its recommended lifespan. Immediate replacement is advised.',
        color: 'red',
        icon: 'fa-exclamation-triangle',
        percentUsed: 100,
        monthsSinceChange,
        lifespanMonths
      };
    } else if (percentUsed >= 80) {
      return {
        status: 'warning',
        message: 'Replacement Recommended Soon',
        description: 'This part is approaching the end of its lifespan. Plan for replacement.',
        color: 'orange',
        icon: 'fa-exclamation-circle',
        percentUsed: Math.round(percentUsed),
        monthsSinceChange,
        lifespanMonths
      };
    } else if (percentUsed >= 50) {
      return {
        status: 'caution',
        message: 'Monitor Condition',
        description: 'This part is in the middle of its lifespan. Regular monitoring recommended.',
        color: 'yellow',
        icon: 'fa-info-circle',
        percentUsed: Math.round(percentUsed),
        monthsSinceChange,
        lifespanMonths
      };
    } else {
      return {
        status: 'good',
        message: 'In Good Condition',
        description: 'This part is still within its optimal lifespan. No action needed.',
        color: 'green',
        icon: 'fa-check-circle',
        percentUsed: Math.round(percentUsed),
        monthsSinceChange,
        lifespanMonths
      };
    }
  };

  const getColorClasses = (color) => {
    const colors = {
      red: {
        bg: 'bg-red-50',
        border: 'border-red-300',
        text: 'text-red-800',
        badge: 'bg-red-600',
        progress: 'bg-red-600',
        icon: 'text-red-600'
      },
      orange: {
        bg: 'bg-orange-50',
        border: 'border-orange-300',
        text: 'text-orange-800',
        badge: 'bg-orange-500',
        progress: 'bg-orange-500',
        icon: 'text-orange-600'
      },
      yellow: {
        bg: 'bg-yellow-50',
        border: 'border-yellow-300',
        text: 'text-yellow-800',
        badge: 'bg-yellow-500',
        progress: 'bg-yellow-500',
        icon: 'text-yellow-600'
      },
      green: {
        bg: 'bg-green-50',
        border: 'border-green-300',
        text: 'text-green-800',
        badge: 'bg-green-600',
        progress: 'bg-green-600',
        icon: 'text-green-600'
      }
    };
    return colors[color] || colors.green;
  };

  const partsWithRecommendations = spareParts
    .map((sp, index) => ({
      ...sp,
      index,
      recommendation: calculateRecommendation(sp.part, sp.changeMonth, sp.changeYear)
    }))
    .filter(sp => sp.recommendation !== null);

  const criticalParts = partsWithRecommendations.filter(sp => 
    sp.recommendation.status === 'critical' || sp.recommendation.status === 'warning'
  );

  const toggleExpand = (index) => {
    setExpandedPart(expandedPart === index ? null : index);
  };

  return (
    <div className="p-6">
      {partsWithRecommendations.length === 0 ? (
        <div className="text-center py-12">
          <i className="fas fa-lightbulb text-gray-300 text-6xl mb-4"></i>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No Recommendations Available</h3>
          <p className="text-gray-500">Add lifespan information to spare parts to see recommendations</p>
        </div>
      ) : (
        <>
          {/* Summary Alert */}
          {criticalParts.length > 0 && (
            <div className="mb-6 p-5 bg-gradient-to-r from-red-100 to-orange-100 border-2 border-red-300 rounded-xl shadow-md animate-pulse">
              <div className="flex items-center gap-3">
                <i className="fas fa-bell text-red-600 text-2xl"></i>
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-red-900">Attention Required!</h4>
                  <p className="text-sm text-red-700 mt-1">
                    {criticalParts.length} part{criticalParts.length > 1 ? 's need' : ' needs'} your attention. 
                    Review recommendations below.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Recommendations List */}
          <div className="space-y-4">
            {partsWithRecommendations.map((sp) => {
              const rec = sp.recommendation;
              const colors = getColorClasses(rec.color);
              const isExpanded = expandedPart === sp.index;
              const partName = sp.part?.name || 'Unknown Part';

              return (
                <div
                  key={sp.index}
                  className={`recommendation-card border-2 rounded-xl overflow-hidden transition-all duration-300 ${colors.border} ${colors.bg}`}
                >
                  {/* Card Header - Always Visible */}
                  <div className="p-5">
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className={`flex-shrink-0 w-12 h-12 ${colors.badge} rounded-full flex items-center justify-center`}>
                        <i className={`fas ${rec.icon} text-white text-lg`}></i>
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-gray-900 mb-1">{partName}</h4>
                        <p className={`text-sm font-semibold ${colors.text} mb-3`}>
                          <i className={`fas ${rec.icon} mr-1`}></i>
                          {rec.message}
                        </p>

                        {/* Progress Bar */}
                        <div className="mb-3">
                          <div className="flex justify-between items-center mb-1 text-xs text-gray-600">
                            <span>Lifespan Used</span>
                            <span className="font-bold">{rec.percentUsed}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div 
                              className={`h-2.5 rounded-full transition-all duration-1000 ${colors.progress}`}
                              style={{ width: `${rec.percentUsed}%` }}
                            ></div>
                          </div>
                          <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>{rec.monthsSinceChange} months used</span>
                            <span>{rec.lifespanMonths} months total</span>
                          </div>
                        </div>

                        {/* Expand Button */}
                        <button
                          onClick={() => toggleExpand(sp.index)}
                          className="text-sm font-semibold text-red-600 hover:text-red-700 flex items-center gap-1 transition-colors"
                        >
                          {isExpanded ? (
                            <>
                              <span>Hide Details</span>
                              <i className="fas fa-chevron-up"></i>
                            </>
                          ) : (
                            <>
                              <span>View Options</span>
                              <i className="fas fa-chevron-down"></i>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Section - Actions */}
                  <div
                    className={`transition-all duration-500 ease-in-out overflow-hidden ${
                      isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                    }`}
                    style={{ transitionProperty: 'max-height, opacity', maxHeight: isExpanded ? '2000px' : '0', opacity: isExpanded ? 1 : 0 }}
                  >
                    <div className="px-5 pb-5 pt-2 border-t border-current border-opacity-20">
                      {/* Description */}
                      <p className="text-sm text-gray-700 mb-4">{rec.description}</p>

                      {/* Action Buttons */}
                      <div className="space-y-3">
                        {/* Shop Button - Primary */}
                        <Link
                          to="/shop"
                          className="block w-full px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-all shadow-md hover:shadow-lg text-center"
                        >
                          <i className="fas fa-store mr-2"></i>
                          Browse Spare Parts Store
                        </Link>

                        {/* Suppliers Section */}
                        {sp.part?.suppliers && sp.part.suppliers.length > 0 && (
                          <div className="bg-red-50 rounded-2xl p-6 border-2 border-red-300 shadow-md mb-2">
                            <h5 className="text-lg font-extrabold text-red-700 mb-4 flex items-center gap-3">
                              <i className="fas fa-truck text-red-600 text-2xl"></i>
                              Suppliers <span className="text-base font-semibold">({sp.part.suppliers.length})</span>
                            </h5>
                            <div className="space-y-4">
                              {sp.part.suppliers.map((supplier, idx) => (
                                <div key={idx} className="pl-4 py-2 border-l-4 border-red-600 bg-white rounded-lg flex flex-col gap-1">
                                  <span className="font-bold text-lg text-red-800 flex items-center gap-2">
                                    <i className="fas fa-industry"></i> {supplier.name || 'Unknown Supplier'}
                                  </span>
                                  {supplier.phone && (
                                    <a href={`tel:${supplier.phone}`} className="text-base text-red-700 hover:text-red-900 flex items-center gap-2">
                                      <i className="fas fa-phone"></i>
                                      {supplier.phone}
                                    </a>
                                  )}
                                  {supplier.email && (
                                    <a href={`mailto:${supplier.email}`} className="text-base text-red-700 hover:text-red-900 flex items-center gap-2">
                                      <i className="fas fa-envelope"></i>
                                      {supplier.email}
                                    </a>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Technician Recommendations */}
                        {recommendedTechnicians && recommendedTechnicians.length > 0 && (
                          <div className="bg-red-50 rounded-2xl p-6 border-2 border-red-300 shadow-md mt-4">
                            <h5 className="text-lg font-extrabold text-red-700 mb-4 flex items-center gap-3">
                              <i className="fas fa-user-cog text-red-600 text-2xl"></i>
                              Technicians <span className="text-base font-semibold">({recommendedTechnicians.length})</span>
                            </h5>
                            <div className="space-y-4">
                              {recommendedTechnicians.map((tech, idx) => (
                                <div key={idx} className="pl-4 py-2 border-l-4 border-red-600 bg-white rounded-lg flex flex-col gap-1">
                                  <span className="font-bold text-lg text-red-800 flex items-center gap-2">
                                    <i className="fas fa-user"></i> {tech.name || 'Unknown Technician'}
                                    <span className="ml-2 text-base font-semibold text-red-600">({tech.speciality})</span>
                                  </span>
                                  {tech.phone && (
                                    <a href={`tel:${tech.phone}`} className="text-base text-red-700 hover:text-red-900 flex items-center gap-2">
                                      <i className="fas fa-phone"></i>
                                      {tech.phone}
                                    </a>
                                  )}
                                  {tech.email && (
                                    <a href={`mailto:${tech.email}`} className="text-base text-red-700 hover:text-red-900 flex items-center gap-2">
                                      <i className="fas fa-envelope"></i>
                                      {tech.email}
                                    </a>
                                  )}
                                  {tech.address && (
                                    <span className="text-base text-gray-700 flex items-center gap-2">
                                      <i className="fas fa-map-marker-alt"></i>
                                      {tech.address}
                                    </span>
                                  )}
                                  {tech.website && (
                                    <a href={tech.website} target="_blank" rel="noopener noreferrer" className="text-base text-red-700 hover:underline flex items-center gap-2">
                                      <i className="fas fa-globe"></i>
                                      Website
                                    </a>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Contact Support */}
                        <Link
                          to="/contact"
                          className="block w-full px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition-all text-center text-sm"
                        >
                          <i className="fas fa-headset mr-2"></i>
                          Contact Support
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default SparePartsRecommendations;
