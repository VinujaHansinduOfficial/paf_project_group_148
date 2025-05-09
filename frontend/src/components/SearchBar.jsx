import React from 'react';
import '../styles/SearchBar.css'; // Adjust the path as necessary

const SearchBar = ({ value, onChange }) => {
  return (
    <div className="search-bar">
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder="Search skills or plans"
      />
    </div>
  );
};

export default SearchBar;
