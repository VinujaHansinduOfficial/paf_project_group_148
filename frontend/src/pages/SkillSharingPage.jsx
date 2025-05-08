import React, { useState, useEffect } from 'react';
import SkillCard from '../components/SkillCard';
import SearchBar from '../components/SearchBar';
import '../../src/styles/skillSharing.css'; // Adjust the path as necessary
import { Link } from 'react-router-dom';

const SkillSharingPage = () => {
  const [skills, setSkills] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Fetch skills from an API or data source
    const fetchedSkills = [
      { id: 1, title: 'JavaScript', user: 'John', tags: ['Programming', 'Web Development'] },
      { id: 2, title: 'React', user: 'Alice', tags: ['Frontend', 'JavaScript'] },
    ];
    setSkills(fetchedSkills);
  }, []);

  const filteredSkills = skills.filter(skill =>
    skill.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h1>Skill Sharing</h1>
      <SearchBar value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
      <Link to="/add-skill">Add a New Skill</Link>
      <div className="skill-list">
        {filteredSkills.map(skill => (
          <SkillCard key={skill.id} skill={skill} />
        ))}
      </div>
    </div>
  );
};

export default SkillSharingPage;
