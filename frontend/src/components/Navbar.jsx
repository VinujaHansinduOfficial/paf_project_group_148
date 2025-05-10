import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext"; // Adjust the path as needed
import "../styles/Navbar.css"; // Assuming you have a CSS file for styling

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
        <Link to="/skills">Skills</Link>
        <Link to="/learning-plans">Learning Plans</Link>
        <Link to="/projects">Projects</Link>
        <Link to={`/profile/${user?.id}`}>Profile</Link> {/* Dynamic user ID */}
        <button onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
