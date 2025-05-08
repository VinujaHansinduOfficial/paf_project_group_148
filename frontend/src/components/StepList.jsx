import React, { useState } from 'react';

const StepList = ({ steps = [], setSteps }) => {
  const [newStep, setNewStep] = useState('');

  const handleAddStep = () => {
    if (newStep.trim() === '') return;

    setSteps([
      ...steps,
      { id: steps.length + 1, title: newStep, completed: false },
    ]);
    setNewStep('');
  };

  const handleToggleStep = (id) => {
    const updatedSteps = steps.map((step) =>
      step.id === id ? { ...step, completed: !step.completed } : step
    );
    setSteps(updatedSteps);
  };

  return (
    <div>
      <ul>
        {steps.map((step) => (
          <li key={step.id}>
            <input
              type="checkbox"
              checked={step.completed}
              onChange={() => handleToggleStep(step.id)}
            />
            <span style={{ textDecoration: step.completed ? 'line-through' : 'none' }}>
              {step.title}
            </span>
          </li>
        ))}
      </ul>
      <>
  <input
    type="text"
    value={newStep}
    onChange={(e) => setNewStep(e.target.value)}
    placeholder="Add a new step"
  />
  <button
    onClick={handleAddStep}
    disabled={!newStep.trim()}
  >
    Add Step
  </button>
</>
      <div className="step-list-footer">
        <p>Total Steps: {steps.length}</p>
        <p>Completed Steps: {steps.filter((step) => step.completed).length}</p>
      </div>
      

    </div>
  );
};

export default StepList;
