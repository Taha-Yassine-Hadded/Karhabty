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
    const newItem = {
      part: '',
      changeMonth: new Date().getMonth() + 1,
      changeYear: new Date().getFullYear()
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

  const months = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' }
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 26 }, (_, i) => currentYear - i + 1);

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
                      {part.name} - ${part.price}
                    </option>
                  ))}
                </select>
              </div>

              <div className="date-group">
                <label className="part-label">Change Date *</label>
                <div className="date-inputs">
                  <select
                    className="date-select month-select"
                    value={item.changeMonth}
                    onChange={(e) => handlePartChange(index, 'changeMonth', parseInt(e.target.value))}
                    required
                  >
                    {months.map((month) => (
                      <option key={month.value} value={month.value}>
                        {month.label}
                      </option>
                    ))}
                  </select>

                  <select
                    className="date-select year-select"
                    value={item.changeYear}
                    onChange={(e) => handlePartChange(index, 'changeYear', parseInt(e.target.value))}
                    required
                  >
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
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
