import React from 'react';

const ModernSparePartsPicker = ({ spareParts, selectedParts, onChange, error }) => {
  const togglePart = (partId) => {
    const newSelection = selectedParts.includes(partId)
      ? selectedParts.filter(id => id !== partId)
      : [...selectedParts, partId];
    onChange(newSelection);
  };

  const isSelected = (partId) => selectedParts.includes(partId);

  return (
    <div className="modern-spare-parts-picker">
      <div className={`parts-grid ${error ? 'error' : ''}`}>
        {spareParts.length === 0 ? (
          <div className="no-parts">
            <i className="fas fa-box-open"></i>
            <p>No spare parts available</p>
          </div>
        ) : (
          spareParts.map((part) => (
            <div
              key={part._id}
              className={`part-card ${isSelected(part._id) ? 'selected' : ''}`}
              onClick={() => togglePart(part._id)}
            >
              <div className="part-checkbox">
                {isSelected(part._id) && <i className="fas fa-check"></i>}
              </div>
              <div className="part-info">
                <h5>{part.name}</h5>
                <div className="part-details">
                  <span className="price">${part.price}</span>
                  {part.category && (
                    <span className="category">{part.category}</span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      {selectedParts.length > 0 && (
        <div className="selection-summary">
          <i className="fas fa-check-circle"></i>
          <span>{selectedParts.length} part{selectedParts.length !== 1 ? 's' : ''} selected</span>
        </div>
      )}

      {error && <div className="picker-error">{error}</div>}

      <style jsx>{`
        .modern-spare-parts-picker {
          width: 100%;
        }

        .parts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 12px;
          max-height: 400px;
          overflow-y: auto;
          padding: 4px;
          border: 2px solid #e0e0e0;
          border-radius: 12px;
          background: #fafafa;
        }

        .parts-grid.error {
          border-color: #dc3545;
          background: #fff5f5;
        }

        .parts-grid::-webkit-scrollbar {
          width: 8px;
        }

        .parts-grid::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }

        .parts-grid::-webkit-scrollbar-thumb {
          background: #dc3545;
          border-radius: 10px;
        }

        .parts-grid::-webkit-scrollbar-thumb:hover {
          background: #c82333;
        }

        .no-parts {
          grid-column: 1 / -1;
          text-align: center;
          padding: 40px 20px;
          color: #999;
        }

        .no-parts i {
          font-size: 48px;
          margin-bottom: 10px;
          display: block;
        }

        .part-card {
          background: white;
          border: 2px solid #e0e0e0;
          border-radius: 10px;
          padding: 15px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          gap: 12px;
          align-items: flex-start;
        }

        .part-card:hover {
          border-color: #dc3545;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(220, 53, 69, 0.15);
        }

        .part-card.selected {
          border-color: #dc3545;
          background: linear-gradient(135deg, #fff5f5 0%, #ffe5e5 100%);
          box-shadow: 0 2px 8px rgba(220, 53, 69, 0.2);
        }

        .part-checkbox {
          width: 24px;
          height: 24px;
          border: 2px solid #dc3545;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: all 0.3s ease;
          background: white;
        }

        .part-card.selected .part-checkbox {
          background: #dc3545;
          color: white;
        }

        .part-checkbox i {
          font-size: 14px;
        }

        .part-info {
          flex: 1;
          min-width: 0;
        }

        .part-info h5 {
          margin: 0 0 8px 0;
          font-size: 14px;
          font-weight: 600;
          color: #333;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .part-details {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          align-items: center;
        }

        .price {
          font-size: 14px;
          font-weight: 700;
          color: #dc3545;
        }

        .category {
          font-size: 11px;
          padding: 2px 8px;
          background: #f0f0f0;
          border-radius: 12px;
          color: #666;
          font-weight: 500;
        }

        .selection-summary {
          margin-top: 12px;
          padding: 12px 16px;
          background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%);
          border: 1px solid #28a745;
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 10px;
          color: #155724;
          font-weight: 600;
          font-size: 14px;
        }

        .selection-summary i {
          color: #28a745;
          font-size: 18px;
        }

        .picker-error {
          color: #dc3545;
          font-size: 13px;
          margin-top: 8px;
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .picker-error::before {
          content: '⚠';
          font-size: 16px;
        }
      `}</style>
    </div>
  );
};

export default ModernSparePartsPicker;
