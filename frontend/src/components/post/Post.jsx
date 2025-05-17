import React, { useState, useEffect } from "react";
import { Avatar, Button, Dropdown, Menu, Popconfirm } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { FiEdit2, FiTrash2, FiShare2 } from "react-icons/fi";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { BiCommentDetail } from "react-icons/bi";
import { BsThreeDotsVertical } from "react-icons/bs";
import MediaGallery from "./MediaGallery";
import { deletePost } from "../../api/postApi";
import { toast } from "sonner";
import EditPostModel from "./EditPostModel";
import ReactTimeAgo from "react-time-ago";

const Post = ({ post, getAllPosts }) => {
  const [isEditModelOpen, setisEditModelOpen] = useState(false);
  const [likedByCurrentUser, setLikedByCurrentUser] = useState(false);
  const [likeId, setLikeId] = useState(null);
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [isPostingComment, setIsPostingComment] = useState(false);
  const [comments, setComments] = useState([]);
  const [likesCount, setLikesCount] = useState(0);

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user ? user.id : null;

  // Fetch comments for the post
  useEffect(() => {
    const fetchComments = async () => {
      if (!post?.postId) {
        setComments([]);
        return;
      }
      try {
        const res = await fetch(
          `http://localhost:8080/api/comments/post/${post.postId}`,
          { method: "GET" }
        );
        const data = await res.json();
        setComments(Array.isArray(data) ? data : []);
      } catch {
        setComments([]);
      }
    };
    fetchComments();
  }, [post?.postId, isPostingComment]);

  // Check if user liked the post
  useEffect(() => {
    const checkLikeStatus = async () => {
      if (!userId || !post?.postId) {
        setLikedByCurrentUser(false);
        setLikeId(null);
        return;
      }
      try {
        // Backend returns a boolean directly, not { liked: true }
        const res = await fetch(
          `http://localhost:8080/api/likes/check?userId=${userId}&postId=${post.postId}`,
          { method: "GET" }
        );
        const data = await res.json();
        console.log("Post like status:", data); // Display like status in console
        // If backend returns {liked: true, likeId: 5} or just likeId, adjust accordingly
        if (typeof data === "object" && data !== null) {
          setLikedByCurrentUser(data.liked === true || data === true);
          setLikeId(data.likeId || null);
        } else {
          setLikedByCurrentUser(data === true);
          setLikeId(null);
        }
      } catch {
        setLikedByCurrentUser(false);
        setLikeId(null);
      }
    };
    checkLikeStatus();
  }, [userId, post?.postId]);

  // Update useEffect for fetching likes count
  useEffect(() => {
    const fetchLikesCount = async () => {
      if (!post?.postId) return;
      try {
        const res = await fetch(
          `http://localhost:8080/api/likes/count/${post.postId}`
        );
        const count = await res.json();
        setLikesCount(Math.max(0, count)); // Ensure count is never negative
      } catch (err) {
        console.error("Error fetching likes count:", err);
        setLikesCount(0); // Default to 0 on error
      }
    };
    fetchLikesCount();
  }, [post?.postId]);

  const handleDelete = async () => {
    try {
      let response = await deletePost(post.postId);

      if (response.status === 200) {
        toast.success("Post deleted successfully!");
      }
      getAllPosts();
    } catch (err) {
      console.error("Failed to delete post", err);
    }
  };

  //   Edit post modal
  const handleOk = () => {
    setisEditModelOpen(false);
    getAllPosts();
  };

  const handleCancel = () => {
    setisEditModelOpen(false);
  };

  // Like button handler (for Like button only)
  const handleLike = async () => {
    if (!userId) {
      toast.error("You must be logged in to like posts.");
      return;
    }
    try {
      const response = await fetch("http://localhost:8080/api/likes/toggle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          postId: post.postId,
        }),
      });
      if (response.ok) {
        setLikedByCurrentUser(true);
        setLikesCount((prev) => prev + 1);
        toast.success("Post liked!");
      } else {
        toast.error("Failed to like post.");
      }
    } catch (err) {
      toast.error("Error liking post.");
    }
  };

  // Update unlike handler
  const handleUnlike = async () => {
    if (!userId) {
      toast.error("You must be logged in to unlike posts.");
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:8080/api/likes?userId=${userId}&postId=${post.postId}`,
        { method: "DELETE" }
      );
      if (response.ok) {
        setLikedByCurrentUser(false);
        setLikesCount((prev) => Math.max(0, prev - 1)); // Prevent negative counts
        setLikeId(null);
        toast.success("Post unliked!");
      } else {
        toast.error("Failed to unlike post.");
      }
    } catch (err) {
      toast.error("Error unliking post.");
    }
  };

  // Add comment handler
  const handleAddComment = async () => {
    if (!userId) {
      toast.error("You must be logged in to comment.");
      return;
    }
    if (!commentText.trim()) {
      toast.error("Comment cannot be empty.");
      return;
    }
    setIsPostingComment(true);
    try {
      const response = await fetch("http://localhost:8080/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: commentText,
          userId: userId,
          postId: post.postId,
        }),
      });
      if (response.ok) {
        toast.success("Comment posted!");
        setCommentText("");
        setShowCommentInput(false);
        getAllPosts();
      } else {
        toast.error("Failed to post comment.");
      }
    } catch (err) {
      toast.error("Error posting comment.");
    } finally {
      setIsPostingComment(false);
    }
  };

  const menu = (
    <Menu className="rounded-lg shadow-lg">
      <Menu.Item
        key="edit"
        icon={<FiEdit2 className="text-blue-500" />}
        className="hover:bg-gray-50"
        onClick={() => setisEditModelOpen(true)}
      >
        Edit
      </Menu.Item>
      <Popconfirm
        title="Are you sure you want to delete this post?"
        onConfirm={handleDelete}
        okText="Yes"
        cancelText="No"
      >
        <Menu.Item
          key="delete"
          icon={<FiTrash2 className="text-red-500" />}
          danger
        >
          <span>Delete</span>
        </Menu.Item>
      </Popconfirm>
    </Menu>
  );

  // Add this hook to store usernames for comments
  const [commentUsernames, setCommentUsernames] = useState({});

  // Fetch usernames for comments if not present
  useEffect(() => {
    const fetchUsernames = async () => {
      const missingUserIds = comments
        .map((comment) => comment.user?.id)
        .filter(
          (id) =>
            id &&
            (!commentUsernames[id] || commentUsernames[id] === "User")
        );
      // Remove duplicates
      const uniqueIds = [...new Set(missingUserIds)];
      for (const userId of uniqueIds) {
        try {
            const res = await fetch(`http://localhost:8080/api/users/${userId}`);
          const data = await res.json();
          if (data && data.username) {
            setCommentUsernames((prev) => ({
              ...prev,
              [userId]: data.username,
            }));
          }
        } catch {
          // ignore error
        }
      }
    };
    if (comments.length > 0) {
      fetchUsernames();
    }
    // eslint-disable-next-line
  }, [comments]);

  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentText, setEditingCommentText] = useState("");

  // Edit comment handler
  const handleEditComment = (comment) => {
    setEditingCommentId(comment.id);
    setEditingCommentText(comment.content);
  };

  // Save edited comment
  const handleSaveEditComment = async (comment) => {
    if (!editingCommentText.trim()) {
      toast.error("Comment cannot be empty.");
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:8080/api/comments/${comment.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: editingCommentText,
            userId: comment.user?.id,
            postId: comment.postId,
          }),
        }
      );
      if (response.ok) {
        // Update comment locally
        setComments(comments.map(c => 
          c.id === comment.id 
            ? { ...c, content: editingCommentText }
            : c
        ));
        toast.success("Comment updated!");
        setEditingCommentId(null);
        setEditingCommentText("");
        setIsPostingComment(false);
      } else {
        toast.error("Failed to update comment.");
      }
    } catch (err) {
      toast.error("Error updating comment.");
    }
  };

  // Cancel edit
  const handleCancelEditComment = () => {
    setEditingCommentId(null);
    setEditingCommentText("");
  };

  // Delete comment handler
  const handleDeleteComment = async (comment) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/comments/${comment.id}`,
        { method: "DELETE" }
      );
      if (response.ok) {
        // Remove comment locally
        setComments(comments.filter(c => c.id !== comment.id));
        toast.success("Comment deleted!");
      } else {
        toast.error("Failed to delete comment.");
      }
    } catch (err) {
      toast.error("Error deleting comment.");
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow mb-4 border border-gray-200 p-4 max-w-xl mx-auto">
        {/* Post Header */}
        <div className="flex justify-between">
          <div className="flex items-center mb-3 gap-2">
            {/* User profile avatar */}
            {post?.user?.profileImageUrl ? (
              <Avatar size="large" src={post.user.profileImageUrl} />
            ) : (
              <Avatar size="large" icon={<UserOutlined />} />
            )}
            <div>
              <h3 className="font-semibold">{post?.user?.username}</h3>
              <p className="text-xs text-gray-500">
                <ReactTimeAgo date={post?.updatedAt} />
              </p>
            </div>
          </div>
          {userId === post?.user?.id && (
            <Dropdown overlay={menu} trigger={["click"]}>
              <Button
                shape="circle"
                className="hover:bg-gray-100 transition-colors border-none shadow-none"
                icon={<BsThreeDotsVertical className="text-gray-500" />}
              />
            </Dropdown>
          )}
        </div>

        {/* Post Content */}
        <p className="mb-4">{post.description}</p>

        {post?.imageUrls?.length > 0 && (
          <MediaGallery imageUrls={post?.imageUrls || []} post={post} />
        )}

        {/* Post Stats */}
        <div className="flex justify-between text-xs text-gray-500 mb-3">
          <span>{likesCount} {likesCount === 1 ? 'like' : 'likes'}</span>
          <span>{comments.length} comments • 5 shares</span>
        </div>

        {/* Post Actions */}
        <div className="flex justify-between pt-3 border-t border-gray-200">
          {likedByCurrentUser ? (
            <button
              className="flex items-center gap-2 text-red-500 bg-white border border-black px-4 py-2 rounded-full transition-all duration-200 ease-in-out hover:bg-red-50"
              onClick={handleUnlike}
            >
              <AiFillHeart className="text-xl" /> 
              <span className="font-medium">Unlike</span>
            </button>
          ) : (
            <button
              className="flex items-center gap-2 text-gray-600 bg-white border border-black px-4 py-2 rounded-full transition-all duration-200 ease-in-out hover:bg-gray-50 hover:text-red-500"
              onClick={handleLike}
            >
              <AiOutlineHeart className="text-xl" />
              <span className="font-medium">Like</span>
            </button>
          )}
          
          <button
            className="flex items-center gap-2 text-gray-600 bg-white border border-black px-4 py-2 rounded-full transition-all duration-200 ease-in-out hover:bg-gray-50 hover:text-blue-500"
            onClick={() => setShowCommentInput(true)}
          >
            <BiCommentDetail className="text-xl" />
            <span className="font-medium">Comment</span>
          </button>

          <button 
            className="flex items-center gap-2 text-gray-600 bg-white border border-black px-4 py-2 rounded-full transition-all duration-200 ease-in-out hover:bg-gray-50 hover:text-green-500"
          >
            <FiShare2 className="text-xl" />
            <span className="font-medium">Share</span>
          </button>
        </div>

        {/* Comments List */}
        <div className="mb-2">
          {comments.length > 0 && (
            <div className="bg-gray-50 rounded p-2 mb-2">
              <div className="font-semibold text-sm mb-1">Comments:</div>
              {comments.map((comment, idx) => (
                <div key={comment.id || idx} className="border-b last:border-b-0 py-1 flex items-center gap-2">
                  {/* User profile avatar for comment */}
                  {comment.user?.profileImageUrl ? (
                    <Avatar size="small" src={comment.user.profileImageUrl} />
                  ) : (
                    <Avatar size="small" icon={<UserOutlined />} />
                  )}
                  <span className="font-medium">
                    {commentUsernames[comment.user?.id]}:
                  </span>
                  {editingCommentId === comment.id ? (
                    <>
                      <input
                        className="border rounded px-1 py-0.5 text-xs"
                        value={editingCommentText}
                        onChange={e => setEditingCommentText(e.target.value)}
                        style={{ minWidth: 100 }}
                      />
                      <button
                        className="ml-1 bg-white border border-black text-black px-2 py-1 rounded text-xs hover:bg-gray-50 transition-colors"
                        onClick={() => handleSaveEditComment(comment)}
                        disabled={isPostingComment}
                      >
                        Save
                      </button>
                      <button
                        className="ml-1 bg-white border border-black text-black px-2 py-1 rounded text-xs hover:bg-gray-50 transition-colors"
                        onClick={handleCancelEditComment}
                        disabled={isPostingComment}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <span>{comment.content}</span>
                      {/* Edit and Delete buttons for comment */}
                      <button
                        className="ml-2 border border-black text-black px-2 py-1 rounded text-xs hover:bg-gray-50 transition-colors"
                        onClick={() => handleEditComment(comment)}
                      >
                        Edit
                      </button>
                      <Popconfirm
                        title="Are you sure you want to delete this comment?"
                        onConfirm={() => handleDeleteComment(comment)}
                        okText="Yes"
                        cancelText="No"
                      >
                        <button
                          className="ml-1 border border-black text-black px-2 py-1 rounded text-xs hover:bg-gray-50 transition-colors"
                        >
                          Delete
                        </button>
                      </Popconfirm>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Comment Input Tab */}
        {showCommentInput && (
          <div className="mt-3">
            <textarea
              className="w-full border rounded p-2 mb-2"
              rows={2}
              placeholder="Enter your comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <div className="flex gap-2">
              <button
                className="bg-white border border-black text-black px-4 py-2 rounded hover:bg-gray-50 transition-colors"
                onClick={handleAddComment}
                disabled={isPostingComment}
              >
                {isPostingComment ? "Posting..." : "Post Comment"}
              </button>
              <button
                className="bg-white border border-black text-black px-4 py-2 rounded hover:bg-gray-50 transition-colors"
                onClick={() => setShowCommentInput(false)}
                disabled={isPostingComment}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Edit Post Modal */}
      <EditPostModel
        isEditModelOpen={isEditModelOpen}
        handleOk={handleOk}
        handleCancel={handleCancel}
        initialPostData={post}
      />
    </>
  );
};

export default Post;
