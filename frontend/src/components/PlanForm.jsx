import React from 'react';
import StepList from './StepList';


const PlanForm = ({ plan, setPlan, onSubmit }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPlan({ ...plan, [name]: value });
  };

  return (
    <form onSubmit={onSubmit}>
      <label>
        Plan Title:
        <input
          type="text"
          name="title"
          value={plan.title}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        Description:
        <textarea
          name="description"
          value={plan.description}
          onChange={handleChange}
        />
      </label>
      <label>
        Duration:
        <input
          type="text"
          name="duration"
          value={plan.duration}
          onChange={handleChange}
        />
      </label>
      <label>
        Steps:
        <StepList steps={plan.steps} setSteps={(steps) => setPlan({ ...plan, steps })} />
      </label>
      <button type="submit">Create Plan</button>
    </form>
  );
};

export default PlanForm;
