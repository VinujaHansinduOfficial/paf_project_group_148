import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PlanForm from '../components/PlanForm';
import '../styles/CreateLearningPlanPage.css';

const CreateLearningPlanPage = () => {
  const [learningPlan, setLearningPlan] = useState({
    title: '',
    description: '',
    skills: [], // renamed steps → skills to match ViewLearningPlanPage
    progress: 0,
  });

  const navigate = useNavigate();

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const newId = Math.floor(Math.random() * 10000).toString();

    const newPlan = {
      id: newId,
      ...learningPlan,
    };

    // Save to localStorage
    const existingPlans = JSON.parse(localStorage.getItem('learningPlans') || '{}');
    existingPlans[newId] = newPlan;
    localStorage.setItem('learningPlans', JSON.stringify(existingPlans));

    alert('Learning Plan created successfully!');
    setLearningPlan({ title: '', description: '', skills: [], progress: 0 });

    navigate(`/view-learning-plan/${newId}`);
  };

  return (
    <div className="create-plan-container">
      <h1>Create a New Learning Plan</h1>
      <p>Define your plan by adding a title, description, and step-by-step actions.</p>
      <PlanForm 
        plan={learningPlan} 
        setPlan={setLearningPlan} 
        onSubmit={handleFormSubmit} 
      />
    </div>
  );
};

export default CreateLearningPlanPage;
