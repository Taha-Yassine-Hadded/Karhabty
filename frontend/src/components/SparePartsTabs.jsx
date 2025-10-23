import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SparePartsHistory from "./SparePartsHistory";
import SparePartsRecommendations from "./SparePartsRecommendations";

const SparePartsTabs = ({ spareParts, recommendedTechnicians, currentCarKilometrage, carId }) => {
  const [activeTab, setActiveTab] = useState("history");
  const navigate = useNavigate();

  const handleViewAllRecommendations = () => {
    navigate(`/recommendations?carId=${carId}`);
  };

  return (
    <div className="spare-parts-tabs bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Tab Headers */}
      <div className="tab-headers flex border-b border-gray-200 bg-gray-50">
        <button
          onClick={() => setActiveTab("history")}
          className={`flex-1 px-6 py-4 font-semibold transition-all duration-300 relative ${
            activeTab === "history"
              ? "text-red-600 bg-white"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <i className="fas fa-history"></i>
            <span>Spare Parts History</span>
            <span className="ml-2 px-2 py-1 text-xs bg-red-100 text-red-600 rounded-full font-bold">
              {spareParts.length}
            </span>
          </div>
          {activeTab === "history" && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-red-600 animate-slideIn"></div>
          )}
        </button>

        <button
          onClick={() => setActiveTab("recommendations")}
          className={`flex-1 px-6 py-4 font-semibold transition-all duration-300 relative ${
            activeTab === "recommendations"
              ? "text-red-600 bg-white"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <i className="fas fa-lightbulb"></i>
            <span>Recommendations</span>
          </div>
          {activeTab === "recommendations" && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-red-600 animate-slideIn"></div>
          )}
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content relative overflow-hidden">
        {/* History Tab */}
        <div
          className={`transition-all duration-500 ease-in-out ${
            activeTab === "history"
              ? "translate-x-0 opacity-100"
              : "-translate-x-full opacity-0 absolute inset-0"
          }`}
        >
          <SparePartsHistory spareParts={spareParts} />
        </div>

        {/* Recommendations Tab */}
        <div
          className={`transition-all duration-500 ease-in-out ${
            activeTab === "recommendations"
              ? "translate-x-0 opacity-100"
              : "translate-x-full opacity-0 absolute inset-0"
          }`}
        >
          {/* View All Recommendations Button */}
          <div className="p-4 bg-gradient-to-r from-red-50 to-orange-50 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  <i className="fas fa-lightbulb text-red-600 mr-2"></i>
                  Maintenance Recommendations
                </h3>
                <p className="text-sm text-gray-600">
                  Get personalized recommendations based on your vehicle's usage patterns
                </p>
              </div>
              <button
                onClick={handleViewAllRecommendations}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 font-semibold"
              >
                <i className="fas fa-external-link-alt"></i>
                View All Recommendations
              </button>
            </div>
          </div>
          
          <SparePartsRecommendations spareParts={spareParts} recommendedTechnicians={recommendedTechnicians} currentCarKilometrage={currentCarKilometrage} />
        </div>
      </div>
    </div>
  );
};

export default SparePartsTabs;
