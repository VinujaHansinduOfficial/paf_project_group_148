<<<<<<< HEAD
import React from "react";
import { useAuth } from "./AuthContext"; // Adjust path as needed
import { useNavigate } from "react-router-dom";

function Navbar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Clears token and user from context
    navigate("/login"); // Redirect to login page
  };

  return (
    <nav>
      <ul>
        <li>
          <a href="/profile">Profile</a>
        </li>
        <li>
          <button onClick={handleLogout}>Logout</button>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
=======
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
>>>>>>> 94203f8583da5f31b8e99a75dd73b3d96edea60e
