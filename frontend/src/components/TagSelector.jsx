import React from 'react';

const TagSelector = ({ tags, setTags }) => {
  const handleTagChange = (e) => {
    const selectedTags = Array.from(e.target.selectedOptions, (option) => option.value);
    setTags(selectedTags);
  };

  return (
    <select multiple onChange={handleTagChange}>
      {tags.map((tag, index) => (
        <option key={index} value={tag}>
          {tag}
        </option>
      ))}
    </select>
  );
};

export default TagSelector;
