import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css'; // Assuming you have a CSS file for styling

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/">Skill Sharing Platform</Link>
      </div>
      <div className="nav-links">
        <Link to="/skills">Skills</Link>
        <Link to="/learning-plans">Learning Plans</Link>
        <Link to="/projects">Projects</Link>
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
      </div>
    </nav>
  );
};

export default Navbar;