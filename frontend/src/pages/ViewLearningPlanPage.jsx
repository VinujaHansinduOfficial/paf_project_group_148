import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/ViewLearningPlanPage.css';

const ViewLearningPlanPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [learningPlan, setLearningPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    const fetchData = () => {
      const allPlans = JSON.parse(localStorage.getItem('learningPlans') || '{}');
      const plan = allPlans[id];
      setLearningPlan(plan || null);
      setLoading(false);
    };

    fetchData();
  }, [id]);

  const handleBack = () => navigate('/learning-plans');

  if (loading) return <div className="status-message">Loading...</div>;
  if (!learningPlan) return <div className="status-message">No data available for this plan.</div>;

  return (
    <div className="learning-plan-container">
      <button className="back-button" onClick={handleBack}>
        ← Back to Learning Plans
      </button>

      <div className="learning-plan-details">
        <div className="header">
          <h1>{learningPlan.title}</h1>
        </div>

        <p className="description">{learningPlan.description}</p>

        <h3>Skills to Learn</h3>
        <ul className="skills-list">
          {learningPlan.skills.map((skill, idx) => (
            <li key={idx}>{skill}</li>
          ))}
        </ul>

        <h3>Progress</h3>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${learningPlan.progress || 0}%` }}>
            {learningPlan.progress || 0}%
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewLearningPlanPage;
