import React from 'react';

const SkillForm = ({ skill, setSkill, onSubmit }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSkill({ ...skill, [name]: value });
  };

  return (
    <form onSubmit={onSubmit}>
      <label>
        Skill Title:
        <input
          type="text"
          name="title"
          value={skill.title}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        Description:
        <textarea
          name="description"
          value={skill.description}
          onChange={handleChange}
        />
      </label>
      <label>
        Tags:
        <input
          type="text"
          name="tags"
          value={skill.tags.join(', ')}
          onChange={(e) => setSkill({ ...skill, tags: e.target.value.split(', ') })}
        />
      </label>
      <button type="submit">Submit</button>
    </form>
  );
};

export default SkillForm;
