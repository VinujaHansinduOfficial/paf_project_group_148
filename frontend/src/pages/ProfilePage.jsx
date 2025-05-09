import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import "./Profile.css";

const Profile = () => {
  const { userId } = useParams();
  const { user: loggedInUser } = useAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("post");
  const [followers, setFollowers] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:8080/users/uid/${userId}`)
      .then((res) => setUser(res.data))
      .catch((err) => console.error("Error fetching user:", err));
  }, [userId]);

  useEffect(() => {
    if (activeTab === "followers") {
      axios
        .get(`http://localhost:8080/users/uid/${userId}`)
        .then((res) => {
          const followerIds = res.data.followers || [];
          Promise.all(
            followerIds.map((id) =>
              axios.get(`http://localhost:8080/users/uid/${id}`).then((res) => res.data)
            )
          )
            .then((followerDetails) => setFollowers(followerDetails))
            .catch((err) => console.error("Error fetching follower details:", err));
        })
        .catch((err) => console.error("Error fetching user followers:", err));
    }
  }, [activeTab, userId]);

  const handleFollow = () => {
    if (!loggedInUser?.id || !userId) {
      alert("Invalid user data.");
      return;
    }

    const targetUserId = userId;
    const followerId = loggedInUser.id;

    axios
      .post(`http://localhost:8080/users/${targetUserId}/add-follower?followerId=${followerId}`)
      .then(() => alert("Followed successfully!"))
      .catch((err) => {
        console.error("Error following user:", err.response?.data || err.message);
        alert(err.response?.data || "Failed to follow user. Please try again.");
      });
  };

  const handleMessage = () => {
    navigate(`/chat?userId=${user.id}`);
  };

  if (!user) return <div className="loading">Loading...</div>;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <img
          src={user.imageUrl || "https://i.pravatar.cc/150?img=3"}
          alt="Profile"
          className="profile-img"
        />
        <h3>{user.name}</h3>
        {loggedInUser && loggedInUser.id !== userId && (
          <div className="profile-actions">
            <button onClick={handleFollow} className="follow-btn">Follow</button>
            <button onClick={handleMessage} className="message-btn">Message</button>
          </div>
        )}
      </div>

      <div className="navbar">
        {["post", "About", "followers"].map((item, idx) => (
          <button
            key={idx}
            className={`navbar-btn ${item === activeTab ? "active" : ""}`}
            onClick={() => setActiveTab(item)}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="profile-content">
        {activeTab === "post" && (
          <div className="user-posts">
            <h2>Posts</h2>
            <p>Posts will be displayed here.</p>
          </div>
        )}
        {activeTab === "About" && (
          <div className="user-details">
            <h2>User Details</h2>
            <div className="details-grid">
              <Detail label="Email" value={user.email} />
              <Detail label="Username" value={user.username} />
              <Detail label="Status history" value="Activated" />
              <Detail label="Joined" value="13/05/2009" />
              <div className="full-width">
                <Detail label="From" value={user.from || "Unknown"} />
              </div>
            </div>
          </div>
        )}
        {activeTab === "followers" && (
          <div className="user-followers">
            <h2>Followers</h2>
            {followers.length > 0 ? (
              <div className="followers-grid">
                {followers.map((follower) => (
                  <a key={follower.id} href={`/profile/${follower.id}`} className="follower-inline" style={{ textDecoration: "none" }}>
                    <div className="follower-item">
                      <img
                        src={follower.imageUrl || "https://i.pravatar.cc/150?img=3"}
                        alt="Follower"
                        className="follower-img round small"
                      />
                      <h3 style={{ textDecoration: "none", color: "black" }}>{follower.name}</h3>
                    </div>
                  </a>
                ))}
              </div>
            ) : (
              <p>No followers found.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const Detail = ({ label, value }) => (
  <div className="detail-item">
    <label>{label}</label>
    <div className="detail-value">{value}</div>
  </div>
);

export default Profile;
