import React from 'react';

const SearchInput = ({ value, onChange, placeholder = "Search cars..." }) => {
  const handleClear = () => {
    onChange('');
  };

  return (
    <div className="modern-search-input">
      <div className="search-input-wrapper">
        <i className="fas fa-search search-icon"></i>
        <input
          type="text"
          className="search-field"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        {value && (
          <button
            type="button"
            className="clear-btn"
            onClick={handleClear}
            title="Clear search"
          >
            <i className="fas fa-times"></i>
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchInput;
