import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext"; // Adjust the path as needed
import "./Navbar.css"; // Assuming you have a CSS file for styling

const Navbar = () => {
  const { logout, user } = useAuth(); // Access user from AuthContext
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/">Skill Sharing Platform</Link>
      </div>
      <div className="nav-links">
        <Link to="/home">Home</Link>
        <Link to="/skills">Skills</Link>
        <Link to="/learning-plans">Learning Plans</Link>
        <Link to="/skill-sharing">Skill Sharing</Link>
        <Link to="/projects">Projects</Link>
        <Link to={user ? `/profile/${user.id}` : "#"}>Profile</Link>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
