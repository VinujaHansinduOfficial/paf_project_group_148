import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { FaHome, FaGraduationCap, FaBook, FaUsers, FaProjectDiagram, FaUser, FaSignOutAlt, FaBars, FaTimes, FaArrowLeft, FaArrowRight, FaComments } from 'react-icons/fa';
import "./Navbar.css";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className={`navbar-container ${isCollapsed ? 'collapsed' : ''}`}>
      <button 
        className="nav-collapse-btn"
        onClick={() => setIsCollapsed(!isCollapsed)}
        title={isCollapsed ? "Expand menu" : "Collapse menu"}
      >
        {isCollapsed ? <FaArrowRight size={16} /> : <FaArrowLeft size={16} />}
      </button>
      <div className="navbar-content">
        <div className="nav-brand">
          <Link to="/" className="brand-link">
            <FaGraduationCap className="brand-icon" />
            <span>EduConnect</span>
          </Link>
          <button 
            className="mobile-menu-btn"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
        <div className={`nav-links ${isOpen ? 'show' : ''}`}>
          <div className="nav-group">
            <Link to="/home" className={`nav-link primary ${location.pathname === '/home' ? 'active' : ''}`}>
              <FaHome className="nav-icon" />
              <span>Home</span>
            </Link>
            <Link to="/skills" className={`nav-link primary ${location.pathname === '/skills' ? 'active' : ''}`}>
              <FaBook className="nav-icon" />
              <span>Skills</span>
            </Link>
          </div>
          <div className="nav-group">
            <Link to="/learning-plans" className={`nav-link secondary ${location.pathname === '/learning-plans' ? 'active' : ''}`}>
              <FaGraduationCap className="nav-icon" />
              <span>Learning Plans</span>
            </Link>
            <Link to="/skill-sharing" className={`nav-link secondary ${location.pathname === '/skill-sharing' ? 'active' : ''}`}>
              <FaUsers className="nav-icon" />
              <span>Skill Sharing</span>
            </Link>
            <Link to="/chat" className={`nav-link secondary ${location.pathname === '/chat' ? 'active' : ''}`}>
              <FaComments className="nav-icon" />
              <span>Messages</span>
            </Link>
            <Link to="/projects" className={`nav-link secondary ${location.pathname === '/projects' ? 'active' : ''}`}>
              <FaProjectDiagram className="nav-icon" />
              <span>Projects</span>
            </Link>
          </div>
          <div className="nav-group auth-group">
            <Link to={user ? `/profile/${user.id}` : "#"} className="nav-link profile-link">
              <FaUser className="nav-icon" />
              <span>Profile</span>
            </Link>
            <button onClick={handleLogout} className="logout-btn">
              <FaSignOutAlt className="nav-icon" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
