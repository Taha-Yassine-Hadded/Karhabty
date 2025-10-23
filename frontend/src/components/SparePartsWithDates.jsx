import React, { useState, useEffect } from 'react';

const SparePartsWithDates = ({ spareParts, selectedParts, onChange }) => {
  const [selectedItems, setSelectedItems] = useState([]);

  // Initialize selected items from props
  useEffect(() => {
    if (selectedParts && selectedParts.length > 0) {
      setSelectedItems(selectedParts);
    }
  }, [selectedParts]);

  const handleAddPart = () => {
    const currentDate = new Date();
    const newItem = {
      part: '',
      changeMonth: currentDate.getMonth() + 1,
      changeYear: currentDate.getFullYear(),
      kilometrage: 0 // Initialize spare part kilometrage to 0
    };
    const updated = [...selectedItems, newItem];
    setSelectedItems(updated);
    onChange(updated);
  };

  const handleRemovePart = (index) => {
    const updated = selectedItems.filter((_, i) => i !== index);
    setSelectedItems(updated);
    onChange(updated);
  };

  const handlePartChange = (index, field, value) => {
    const updated = [...selectedItems];
    updated[index][field] = value;
    setSelectedItems(updated);
    onChange(updated);
  };



  return (
    <div className="spare-parts-with-dates">
      <div className="spare-parts-list">
        {selectedItems.map((item, index) => (
          <div key={index} className="spare-part-item">
            <div className="part-row">
              <div className="part-select-group">
                <label className="part-label">Spare Part *</label>
                <select
                  className="part-select"
                  value={item.part}
                  onChange={(e) => handlePartChange(index, 'part', e.target.value)}
                  required
                >
                  <option value="">Select spare part...</option>
                  {spareParts.map((part) => (
                    <option key={part._id} value={part._id}>
                      {part.name}
                    </option>
                  ))}
                </select>
              </div>



              <button
                type="button"
                className="remove-part-btn"
                onClick={() => handleRemovePart(index)}
                title="Remove"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        className="add-part-btn"
        onClick={handleAddPart}
      >
        <i className="fas fa-plus-circle"></i> Add Spare Part
      </button>
    </div>
  );
};

export default SparePartsWithDates;
