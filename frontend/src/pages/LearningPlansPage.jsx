import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LearningPlansPage.css';
import { FaLightbulb, FaRocket, FaComments, FaBookOpen } from 'react-icons/fa';

const LearningPlansPage = () => {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate('/create-learning-plan');
  };

  const footerMessages = [
    { icon: <FaLightbulb />, text: "Explore and create your own learning paths!" },
    { icon: <FaRocket />, text: "Stay updated with our latest offerings!" },
    { icon: <FaComments />, text: "Join our community for more insights!" },
    { icon: <FaBookOpen />, text: "Check out our latest blog posts for more info!" },
    { icon: <FaRocket />, text: "Subscribe to our newsletter for the latest news!" },
    { icon: <FaLightbulb />, text: "Join our webinars for in-depth learning!" },
    { icon: <FaComments />, text: "Participate in forums for peer discussions!" },
    { icon: <FaBookOpen />, text: "Discover upcoming workshops for hands-on experience!" },
    { icon: <FaRocket />, text: "Follow us for exclusive updates!" },
    { icon: <FaLightbulb />, text: "Connect on social media for announcements!" },
    { icon: <FaComments />, text: "Stay tuned for our newest events!" },
  ];

  return (
    <div className="learning-plans-container">
      <h1>Learning Plans</h1>
      <p className="intro-text">Browse through a variety of learning plans to help you grow your skills.</p>

      <button className="create-button" onClick={handleButtonClick}>
        + Create New Learning Plan
      </button>

      <section className="featured-section">
        <h2>Why Join Our Learning Hub?</h2>
        <div className="footer-cards">
          {footerMessages.map((item, index) => (
            <div key={index} className="footer-card">
              <div className="icon">{item.icon}</div>
              <p>{item.text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default LearningPlansPage;
