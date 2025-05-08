import React, { useState } from 'react';
import '../styles/AddSkill.css';

const AddSkill = () => {
  const [skill, setSkill] = useState('');
  const [skills, setSkills] = useState([]);
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedSkill = skill.trim();

    if (!trimmedSkill) {
      setMessage('⚠️ Please enter a skill.');
    } else if (skills.includes(trimmedSkill)) {
      setMessage(`⚠️ "${trimmedSkill}" is already added.`);
    } else {
      setSkills([...skills, trimmedSkill]);
      setMessage(`✅ "${trimmedSkill}" added.`);
    }

    setSkill('');
  };

  const handleRemove = (skillToRemove) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
    setMessage(`❌ "${skillToRemove}" removed.`);
  };

  return (
    <div className="add-skill-container">
      <h2>Add a New Skill</h2>
      <form className="add-skill-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={skill}
          onChange={(e) => setSkill(e.target.value)}
          placeholder="Enter a skill (e.g., TypeScript)"
          className="skill-input"
        />
        <button type="submit" className="add-skill-button">Add Skill</button>
      </form>

      {message && <p className="skill-message">{message}</p>}

      {skills.length > 0 && (
        <div className="added-skills">
          <h3>Added Skills</h3>
          <ul className="skills-list">
            {skills.map((s, index) => (
              <li key={index} className="skill-badge">
                {s}
                <button
                  className="remove-button"
                  onClick={() => handleRemove(s)}
                  aria-label={`Remove ${s}`}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AddSkill;
