import React from 'react';
import { Link } from 'react-router-dom';

const SkillCard = ({ skill }) => {
  return (
    <div className="skill-card">
      <h3>{skill.title}</h3>
      <p>Shared by: {skill.user}</p>
      <div className="tags">
        {skill.tags.map((tag, index) => (
          <span key={index} className="tag">
            {tag}
          </span>
        ))}
      </div>
      <Link to={`/skill-details/${skill.id}`}>View Details</Link>
    </div>
  );
};

export default SkillCard;
