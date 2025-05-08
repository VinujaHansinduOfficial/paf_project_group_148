import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css'; // Optional: if you want custom styles

const Home = () => {
  return (
    <div className="home-container">
      <h1>Welcome to the Open Learning Platform</h1>
      <p>Discover, share, and personalize your learning journey through skills and structured plans.</p>

      {/* Add Image */}
      <img 
        src="../../assets/images/home.jpg"  
        alt=""
        className="home-image"
        style={{ width: '100%', height: 'auto', borderRadius: '8px', transition: 'transform 0.3s ease, box-shadow 0.3s ease' }} // Optional: inline styles for the image
      />

      <div className="home-buttons">
        <Link to="/skills" className="home-btn">
          Explore Skills
        </Link>
        <Link to="/learning-plans" className="home-btn">
          View Learning Plans
        </Link>
        <Link to="/create-learning-plan" className="home-btn">
          Create Your Plan
        </Link>
        <Link to="/add-skill" className="home-btn">
          Share a Skill
        </Link>
      </div>

      <div className="home-description">
        <p>Ready to take the next step in your learning? Choose an option above to get started!</p>
      </div>
    </div>
  );
};

export default Home;
