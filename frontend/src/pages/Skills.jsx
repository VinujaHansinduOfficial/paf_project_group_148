import React, { useState } from 'react';
import '../styles/Skills.css';

const initialSkillData = {
  Frontend: [
    { name: 'HTML', level: 90 },
    { name: 'CSS', level: 85 },
    { name: 'JavaScript', level: 80 },
    { name: 'React', level: 75 },
  ],
  Backend: [
    { name: 'Node.js', level: 80 },
    { name: 'Express.js', level: 75 },
    { name: 'MongoDB', level: 70 },
    { name: 'REST APIs', level: 85 },
  ],
  Tools: [
    { name: 'Git & GitHub', level: 80 },
    { name: 'Figma', level: 70 },
  ],
};

const Skills = () => {
  const [skillData, setSkillData] = useState(initialSkillData);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [collapsed, setCollapsed] = useState({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newSkill, setNewSkill] = useState({ name: '', level: '', category: 'Frontend' });
  const [editSkill, setEditSkill] = useState(null);
  const [error, setError] = useState('');

  const toggleCollapse = (category) => {
    setCollapsed((prev) => ({ ...prev, [category]: !prev[category] }));
  };

  const handleReset = () => {
    setSearchTerm('');
    setSelectedCategory('All');
  };

  const filterSkills = (skills) =>
    skills.filter((skill) =>
      skill.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const displayedCategories =
    selectedCategory === 'All'
      ? Object.entries(skillData)
      : [[selectedCategory, skillData[selectedCategory] || []]];

  const handleAddSkill = () => {
    const { name, level, category } = newSkill;

    if (!name || !level || !category) {
      setError('Please fill in all fields.');
      return;
    }

    if (isNaN(level) || level < 0 || level > 100) {
      setError('Level must be a number between 0 and 100.');
      return;
    }

    const existing = skillData[category]?.some(
      (skill) => skill.name.toLowerCase() === name.toLowerCase()
    );

    if (existing) {
      setError('Skill already exists in this category.');
      return;
    }

    const updated = {
      ...skillData,
      [category]: [...(skillData[category] || []), { name, level: parseInt(level) }],
    };
    setSkillData(updated);
    setNewSkill({ name: '', level: '', category: 'Frontend' });
    setShowAddModal(false);
    setError('');
  };

  const handleDeleteSkill = (category, index) => {
    const updatedCategorySkills = [...skillData[category]];
    updatedCategorySkills.splice(index, 1);
    setSkillData({
      ...skillData,
      [category]: updatedCategorySkills,
    });
  };

  const handleEditSkill = () => {
    const { name, level, category, originalCategory, index } = editSkill;

    if (!name || level === '') {
      setError('Please fill in all fields.');
      return;
    }

    if (isNaN(level) || level < 0 || level > 100) {
      setError('Level must be between 0 and 100.');
      return;
    }

    const updatedData = { ...skillData };

    // Remove from original category
    updatedData[originalCategory].splice(index, 1);

    // Add to new category
    if (!updatedData[category]) updatedData[category] = [];
    updatedData[category].push({ name, level: parseInt(level) });

    setSkillData(updatedData);
    setShowEditModal(false);
    setEditSkill(null);
    setError('');
  };

  return (
    <section className="skills-section" aria-labelledby="skills-heading">
      <h2 id="skills-heading" className="skills-title"> My Technical Skills</h2>

      <div className="skills-controls">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search skills..."
          aria-label="Search skills"
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          aria-label="Filter by category"
        >
          <option value="All">All Categories</option>
          {Object.keys(skillData).map((category) => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
        <button onClick={handleReset} className="reset-button">Reset</button>
        <button onClick={() => setShowAddModal(true)} className="add-skill-button">+ Add Skill</button>
      </div>

      {displayedCategories.map(([category, skills]) => {
        const filtered = filterSkills(skills);
        if (filtered.length === 0) return null;

        return (
          <div key={category} className="skills-category">
            <h3
              className="category-title"
              onClick={() => toggleCollapse(category)}
              aria-expanded={!collapsed[category]}
              role="button"
              tabIndex="0"
              onKeyDown={(e) => e.key === 'Enter' && toggleCollapse(category)}
            >
              {collapsed[category] ? '▶' : '▼'} {category}
            </h3>

            {!collapsed[category] && (
              <div className="skills-grid">
                {filtered.map((skill, index) => (
                  <div key={index} className="skill-card" tabIndex="0">
                    <div className="skill-header">
                      <span className="skill-badge"></span>
                      <span className="skill-name">{skill.name}</span>
                    </div>
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{ width: `${skill.level}%` }}
                      ></div>
                    </div>
                    <div className="skill-actions">
                      <button onClick={() => {
                        setEditSkill({ ...skill, category, originalCategory: category, index });
                        setShowEditModal(true);
                      }}>Edit</button>
                      <button onClick={() => handleDeleteSkill(category, index)}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}

      {/* Add Skill Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h4>Add New Skill</h4>
            <input
              type="text"
              placeholder="Skill Name"
              value={newSkill.name}
              onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
            />
            <input
              type="number"
              placeholder="Proficiency (%)"
              value={newSkill.level}
              onChange={(e) => setNewSkill({ ...newSkill, level: e.target.value })}
            />
            <select
              value={newSkill.category}
              onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
            >
              {Object.keys(skillData).map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            {error && <p className="error-message">{error}</p>}
            <div className="modal-buttons">
              <button onClick={handleAddSkill}>Add</button>
              <button onClick={() => setShowAddModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Skill Modal */}
      {showEditModal && editSkill && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h4>Edit Skill</h4>
            <input
              type="text"
              value={editSkill.name}
              onChange={(e) => setEditSkill({ ...editSkill, name: e.target.value })}
            />
            <input
              type="number"
              value={editSkill.level}
              onChange={(e) => setEditSkill({ ...editSkill, level: e.target.value })}
            />
            <select
              value={editSkill.category}
              onChange={(e) => setEditSkill({ ...editSkill, category: e.target.value })}
            >
              {Object.keys(skillData).map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            {error && <p className="error-message">{error}</p>}
            <div className="modal-buttons">
              <button onClick={handleEditSkill}>Save</button>
              <button onClick={() => {
                setShowEditModal(false);
                setEditSkill(null);
              }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Skills;
