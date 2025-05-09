import React, { useState } from 'react';
import '../styles/Projects.css';

const initialProjectData = [
  {
    title: 'Skill Sharing Module',
    description:
      'A feature that allows users to share and showcase their skills, connect with others, and collaborate on learning paths.',
    technologies: ['React', 'Node.js', 'MongoDB', 'JWT Auth'],
    teamMembers: ['Alice', 'Bob'],
  },
  {
    title: 'Learning Plans Builder',
    description:
      'An interactive tool for creating, managing, and tracking personalized learning plans based on selected skills or goals.',
    technologies: ['Spring Boot', 'MySQL', 'Thymeleaf', 'REST APIs'],
    teamMembers: ['Charlie', 'David'],
  },
  {
    title: 'Course Recommendation Engine',
    description:
      'AI-powered system that suggests courses based on users’ learning behavior and shared skills.',
    technologies: ['Python', 'Machine Learning', 'Flask', 'OpenAI API'],
    teamMembers: ['Eve'],
  },
];

const Projects = () => {
  const [projects, setProjects] = useState(initialProjectData);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newTech, setNewTech] = useState('');
  const [newTeamMembers, setNewTeamMembers] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [editIndex, setEditIndex] = useState(null); // Track the project being edited

  const handleAddProject = (e) => {
    e.preventDefault();

    if (!newTitle.trim() || !newDescription.trim() || !newTech.trim() || !newTeamMembers.trim()) {
      setMessage('Please fill in all fields.');
      return;
    }

    const techArray = newTech.split(',').map((tech) => tech.trim()).filter(Boolean);
    const teamArray = newTeamMembers.split(',').map((member) => member.trim()).filter(Boolean);

    if (techArray.length === 0 || teamArray.length === 0) {
      setMessage('Please provide valid technologies and team members.');
      return;
    }

    setLoading(true);
    setMessage('');

    const newProject = {
      title: newTitle.trim(),
      description: newDescription.trim(),
      technologies: techArray,
      teamMembers: teamArray,
    };

    if (editIndex !== null) {
      const updatedProjects = [...projects];
      updatedProjects[editIndex] = newProject;
      setProjects(updatedProjects);
      setEditIndex(null);
    } else {
      setProjects((prevProjects) => [...prevProjects, newProject]);
    }

    setNewTitle('');
    setNewDescription('');
    setNewTech('');
    setNewTeamMembers('');

    setTimeout(() => {
      setLoading(false);
      setMessage(editIndex === null ? 'Project added successfully!' : 'Project updated successfully!');
    }, 500);
  };

  const handleEditProject = (index) => {
    const project = projects[index];
    setNewTitle(project.title);
    setNewDescription(project.description);
    setNewTech(project.technologies.join(', '));
    setNewTeamMembers(project.teamMembers.join(', '));
    setEditIndex(index); // Set the index of the project to be edited
  };

  return (
    <section className="projects" aria-labelledby="projects-heading">
      <h2 id="projects-heading">My Projects</h2>

      <form className="project-form" onSubmit={handleAddProject}>
        <div className="form-field">
          <label htmlFor="project-title">Project Title:</label>
          <input
            id="project-title"
            type="text"
            placeholder="Project Title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div className="form-field">
          <label htmlFor="project-description">Project Description:</label>
          <textarea
            id="project-description"
            placeholder="Project Description"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div className="form-field">
          <label htmlFor="project-tech">Technologies:</label>
          <input
            id="project-tech"
            type="text"
            placeholder="Technologies (comma-separated)"
            value={newTech}
            onChange={(e) => setNewTech(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div className="form-field">
          <label htmlFor="project-team">Team Members:</label>
          <input
            id="project-team"
            type="text"
            placeholder="Team Members (comma-separated)"
            value={newTeamMembers}
            onChange={(e) => setNewTeamMembers(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Adding...' : editIndex === null ? 'Add Project' : 'Save Changes'}
        </button>

        {message && <p className="project-message">{message}</p>}
      </form>

      <div className="projects-grid" role="list">
        {projects.map((project, index) => (
          <article key={index} className="project-card" role="listitem">
            <h3>{project.title}</h3>
            <p>{project.description}</p>
            <div className="tech-stack">
              {project.technologies.map((tech, idx) => (
                <span key={idx} className="tech-badge">{tech}</span>
              ))}
            </div>
            <div className="team-members">
              <h5>Team Members:</h5>
              {project.teamMembers.length > 0 ? (
                project.teamMembers.map((member, idx) => (
                  <span key={idx} className="team-member">{member}</span>
                ))
              ) : (
                <p>No team members assigned.</p>
              )}
            </div>
            <div className="project-actions">
              <button className="view-btn">View</button>
              <button className="edit-btn" onClick={() => handleEditProject(index)}>
                Edit
              </button>
              <button className="delete-btn" onClick={() => setProjects((prev) => prev.filter((_, i) => i !== index))}>
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default Projects;
