import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import "./Profile.css";
//import Post from "../components/Post"; // Adjust the import path as necessary
import Post from "../components/post/Post";
import { toast } from "sonner";
import { getPostById } from "../api/postApi"; // changed import

const Profile = () => {
  const { userId } = useParams();
  const { user: loggedInUser } = useAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("post");
  const [followers, setFollowers] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [posts, setPosts] = useState([]);

  const checkIfFollowing = async (loggedInUserId, targetUserId) => {
    try {
      const response = await axios.get(`http://localhost:8080/users/uid/${loggedInUserId}`);
      const followerIds = response.data.followers || []; // Extract followers array
      return followerIds.includes(Number(targetUserId)); // Ensure type consistency for comparison
    } catch (err) {
      console.error("Error checking follow status:", err);
      return false;
    }
  };

  useEffect(() => {
    axios
      .get(`http://localhost:8080/users/uid/${userId}`)
      .then((res) => setUser(res.data))
      .catch((err) => console.error("Error fetching user:", err));
  }, [userId]);

  useEffect(() => {
    if (loggedInUser?.id && userId) {
      checkIfFollowing(userId, loggedInUser.id).then((isFollowing) => {
        console.log(`Is logged-in user following user ${userId}?`, isFollowing); // Log the output
        setIsFollowing(isFollowing); // Update the button state based on follow status
      });
    }
  }, [loggedInUser, userId]);

  useEffect(() => {
    getUserPosts();
  }, [userId]);
  const getUserPosts = async () => {
    try {
      const response = await getPostById(userId); // fetch posts by userId
      if (response.status === 200) {
        // Ensure posts is always an array
        const data = response.data;
        setPosts(Array.isArray(data) ? data : data ? [data] : []);
      } else {
        toast.error("Error fetching posts");
        setPosts([]);
      }
    } catch (error) {
      toast.error("Error fetching posts:", error);
      setPosts([]);
    }
  };

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

  useEffect(() => {
    if (loggedInUser?.id) {
      axios
        .get(`http://localhost:8080/users/uid/${loggedInUser.id}`)
        .then((res) => {
          const followerIds = res.data.followers || [];
          setIsFollowing(followerIds.includes(userId)); // Check if the profile user is followed
        })
        .catch((err) => console.error("Error fetching logged-in user's followers:", err));
    }
  }, [loggedInUser, userId]);

  const handleFollow = () => {
    if (!loggedInUser?.id || !userId) {
      alert("Invalid user data.");
      return;
    }

    const targetUserId = userId;
    const followerId = loggedInUser.id;

    const url = isFollowing
      ? `http://localhost:8080/users/${targetUserId}/remove-follower?followerId=${followerId}`
      : `http://localhost:8080/users/${targetUserId}/add-follower?followerId=${followerId}`;

    axios
      .post(url)
      .then(() => {
        setIsFollowing((prev) => !prev); // Toggle follow state
      })
      .catch((err) => {
        console.error("Error updating follow status:", err.response?.data || err.message);
        alert(err.response?.data || "Failed to update follow status. Please try again.");
      });
  };

  const handleUnfollow = () => {
    if (!loggedInUser?.id || !userId) {
      alert("Invalid user data.");
      return;
    }

    const targetUserId = userId;
    const followerId = loggedInUser.id;

    const url = `http://localhost:8080/users/${targetUserId}/unfollow/${followerId}`;

    axios
      .post(url)
      .then(() => {
        setIsFollowing(false); // Update state to reflect unfollow
        alert("Unfollowed successfully!");
      })
      .catch((err) => {
        console.error("Error unfollowing user:", err.response?.data || err.message);
        alert(err.response?.data || "Failed to unfollow. Please try again.");
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
        {loggedInUser && loggedInUser.id !== Number(userId) && ( // Hide buttons for logged-in user's profile
          <div className="profile-actions">
            {isFollowing ? (
              <button
                onClick={handleUnfollow} // Attach the unfollow function
                className="unfollow-btn"
                style={{
                  backgroundColor: "grey", // Grey for "Unfollow"
                  color: "white",
                }}
              >
                Unfollow
              </button>
            ) : (
              <button
                onClick={handleFollow}
                className="follow-btn"
                style={{
                  backgroundColor: "blue", // Blue for "Follow"
                  color: "white",
                }}
              >
                Follow
              </button>
            )}
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
            {(Array.isArray(posts) ? posts : []).map((post, index) => (
              <Post key={index} post={post} getAllPosts={getUserPosts} />
            ))}
          </div>
        )}
        {activeTab === "About" && (
          <div className="user-details">
            <h2>User Details</h2>
            <div className="details-grid">
              <Detail label="Name" value={user.name} />
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
