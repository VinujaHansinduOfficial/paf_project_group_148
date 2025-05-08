import React from 'react';
import { Link } from 'react-router-dom';

const LearningPlanCard = ({ plan }) => {
  return (
    <div className="plan-card">
      <h3>{plan.title}</h3>
      <p>{plan.description}</p>
      <p>Duration: {plan.duration}</p>
      <Link to={`/plan-details/${plan.id}`}>View Plan Details</Link>
    </div>
  );
};

export default LearningPlanCard;
