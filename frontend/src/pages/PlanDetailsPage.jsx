import React, { useState, useEffect } from 'react';
import StepList from '../components/StepList';
import { useParams } from 'react-router-dom';

const PlanDetailsPage = () => {
  const { planId } = useParams();
  const [plan, setPlan] = useState(null);

  useEffect(() => {
    // Fetch plan details from an API or data source using planId
    const fetchedPlan = {
      id: planId,
      title: 'Learn JavaScript',
      description: 'Beginner to Advanced',
      steps: [
        { id: 1, title: 'Introduction to JavaScript', completed: false },
        { id: 2, title: 'Advanced Functions', completed: false },
        { id: 3, title: 'Asynchronous JavaScript', completed: false },
        { id: 4, title: 'JavaScript in the Browser', completed: false },
        { id: 5, title: 'JavaScript Frameworks', completed: false },
        { id: 6, title: 'Project: Build a Web App', completed: false },
      ],
    };
    setPlan(fetchedPlan);
  }, [planId]);

  if (!plan) return <div>Loading...</div>;

  return (
    <div>
      <h1>{plan.title}</h1>
      <p>{plan.description}</p>
      <StepList steps={plan.steps} />
        <button onClick={() => alert('Edit Plan')}>Edit Plan</button>
        <button onClick={() => alert('Delete Plan')}>Delete Plan</button>
        <button onClick={() => alert('Share Plan')}>Share Plan</button>
        <button onClick={() => alert('Export Plan')}>Export Plan</button>
        <button onClick={() => alert('Import Plan')}>Import Plan</button>
        <button onClick={() => alert('Duplicate Plan')}>Duplicate Plan</button>
        <button onClick={() => alert('View Plan Details')}>View Plan Details</button>
        <button onClick={() => alert('Print Plan')}>Print Plan</button>
        <button onClick={() => alert('Archive Plan')}>Archive Plan</button>
        <button onClick={() => alert('Complete Plan')}>Complete Plan</button>
        <button onClick={() => alert('Unarchive Plan')}>Unarchive Plan</button>
        <button onClick={() => alert('Uncomplete Plan')}>Uncomplete Plan</button>
        <button onClick={() => alert('Reset Plan')}>Reset Plan</button>
        <button onClick={() => alert('New Action')}>New Action</button>
        <button onClick={() => alert('Another New Action')}>Another New Action</button>
        <button onClick={() => alert('Yet Another New Action')}>Yet Another New Action</button>
        <button onClick={() => alert('Final New Action')}>Final New Action</button>
        <button onClick={() => alert('Next New Action')}>Next New Action</button>
        <button onClick={() => alert('New Final Action')}>New Final Action</button>
    </div>
  );
};

export default PlanDetailsPage;
