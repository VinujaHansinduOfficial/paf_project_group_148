import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../components/AuthContext"; // Import AuthContext to get logged-in user

const sampleProfile = "https://i.pravatar.cc/150?img=3"; // Placeholder profile image
const samplePostImage = "https://i.pinimg.com/736x/16/aa/a9/16aaa95719d4858e0544481bd28316fe.jpg"; // Placeholder post image

const Post = ({ postid, likecount, commentcount }) => {
  const { user: loggedInUser } = useAuth(); // Get logged-in user
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([]);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentContent, setEditingCommentContent] = useState("");
  const [isLiked, setIsLiked] = useState(false); // Track if the post is liked by the user

  useEffect(() => {
    if (loggedInUser) {
      checkIfLiked();
    }
  }, [loggedInUser]);

  const checkIfLiked = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/likes/check?userId=${loggedInUser.id}&postId=${postid}`
      );
      setIsLiked(response.data.liked); // Update the like status based on the database
    } catch (error) {
      console.error("Error checking like status:", error);
    }
  };

  const handleToggleLike = async () => {
    if (!loggedInUser) return;

    const likeData = {
      userId: loggedInUser.id,
      postId: postid,
    };

    try {
      const response = await axios.post("http://localhost:8080/api/likes/toggle", likeData);
      if (response.status === 200) {
        setIsLiked((prev) => !prev); // Toggle the like status
      } else {
        console.error("Unexpected response status:", response.status);
        alert("Failed to toggle like. Please try again.");
      }
    } catch (error) {
      console.error("Error toggling like status:", error.message || error);
      alert("An error occurred while toggling the like. Please check your network or try again later.");
    }
  };

  useEffect(() => {
    if (showCommentInput) {
      fetchComments();
    }
  }, [showCommentInput]);

  const fetchComments = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/comments/post/${postid}`);
      if (response.status === 200) {
        const commentsWithUsernames = await Promise.all(
          response.data.map(async (comment) => {
            const userResponse = await axios.get(`http://localhost:8080/users/uid/${comment.userId}`);
            return { ...comment, username: userResponse.data.name };
          })
        );
        setComments(commentsWithUsernames);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const handleCommentButtonClick = () => {
    setShowCommentInput((prev) => !prev);
  };

  const handleAddComment = async () => {
    if (newComment.trim() && loggedInUser) {
      const newCommentObj = {
        content: newComment,
        userId: loggedInUser.id,
        postId: postid,
      };

      try {
        const response = await axios.post("http://localhost:8080/api/comments", newCommentObj);
        if (response.status === 200) {
          setNewComment("");
          alert("Comment sent successfully!"); // Display success message
          setTimeout(fetchComments, 100); // Reload comments after 0.1 seconds
        }
      } catch (error) {
        console.error("Error adding comment:", error);
      }
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(`http://localhost:8080/api/comments/${commentId}`);
      setComments((prev) => prev.filter((comment) => comment.id !== commentId));
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const handleEditComment = (commentId, content) => {
    setEditingCommentId(commentId);
    setEditingCommentContent(content);
    setNewComment(""); // Clear the new comment input
    setShowCommentInput(true); // Ensure the comment input section is visible
  };

  const handleUpdateComment = async () => {
    if (editingCommentContent.trim() && loggedInUser) {
      try {
        const response = await axios.put(`http://localhost:8080/api/comments/${editingCommentId}`, {
          content: editingCommentContent,
        });
        if (response.status === 200) {
          alert("Comment updated successfully!");
          setEditingCommentId(null);
          setEditingCommentContent("");
          fetchComments(); // Reload comments
        }
      } catch (error) {
        console.error("Error updating comment:", error);
      }
    }
  };

  return (
    <div className="post-container" id={`post-${postid}`}>
      <div className="post-header">
        <img src={sampleProfile} alt="Profile" className="profile-img" />
        <div>
          <div className="username">Roshan Deshapriya</div>
          <div className="timestamp">1h ago</div>
        </div>
      </div>
      <div className="post-text">
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
      </div>
      <div className="post-image">
        <img src={samplePostImage} alt="Post" />
      </div>
      <div className="post-reactions">
        <span>👍 {isLiked ? likecount + 1 : likecount}</span>
        <span>{commentcount} comments</span>
        <span>{isLiked ? "You liked this post" : "You haven't liked this post yet"}</span> {/* Display like status */}
      </div>
      <div className="post-actions">
        <button onClick={handleToggleLike}>
          {isLiked ? "Unlike" : "Like"} {/* Display "Unlike" if the user already liked */}
        </button>
        <button onClick={handleCommentButtonClick}>Comment</button>
        <button>Share</button>
      </div>
      {showCommentInput && (
        <>
          <div className="comments-container">
            {comments.map((comment) => (
              <div key={comment.id} className="comment">
                <strong>{comment.username}:</strong> <span>{comment.content}</span>
                {loggedInUser?.id === comment.userId && (
                  <button
                    onClick={() => handleEditComment(comment.id, comment.content)}
                    className="edit-comment-btn"
                  >
                    Edit
                  </button>
                )}
                <button
                  onClick={() => handleDeleteComment(comment.id)}
                  className="delete-comment-btn"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
          <div className="comment-input-container">
            {editingCommentId ? (
              <>
                <input
                  type="text"
                  value={editingCommentContent}
                  onChange={(e) => setEditingCommentContent(e.target.value)}
                  placeholder="Edit your comment..."
                  className="comment-input"
                />
                <button onClick={handleUpdateComment} className="update-comment-btn">
                  Update Comment
                </button>
              </>
            ) : (
              <>
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write a comment..."
                  className="comment-input"
                />
                <button onClick={handleAddComment} className="add-comment-btn">
                  Add Comment
                </button>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Post;
