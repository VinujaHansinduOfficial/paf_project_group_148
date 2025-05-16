import React, { useState, useEffect } from "react";
import { Avatar, Button, Dropdown, Menu, Popconfirm } from "antd";
import {
  HeartOutlined,
  MessageOutlined,
  SearchOutlined,
  ShareAltOutlined,
  UserOutlined,
} from "@ant-design/icons";
import MediaGallery from "./MediaGallery";
import { CiMenuKebab } from "react-icons/ci";
import { FiEdit, FiTrash2 } from "react-icons/fi";
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
        toast.success("Like toggled!");
        getAllPosts();
        window.location.reload(); // Refresh the page
      } else {
        toast.error("Failed to toggle like.");
      }
    } catch (err) {
      toast.error("Error toggling like.");
    }
  };

  // Unlike button handler (for Unlike button only)
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
        toast.success("Like removed!");
        setLikedByCurrentUser(false);
        setLikeId(null);
        getAllPosts();
        window.location.reload(); // Refresh the page
      } else {
        toast.error("Failed to remove like.");
      }
    } catch (err) {
      toast.error("Error removing like.");
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
    <Menu>
      <Menu.Item
        key="edit"
        icon={<FiEdit />}
        onClick={() => {
          setisEditModelOpen(true);
        }}
      >
        Edit
      </Menu.Item>
      <Popconfirm
        title="Are you sure you want to delete this post?"
        onConfirm={handleDelete}
        okText="Yes"
        cancelText="No"
      >
        <Menu.Item key="delete" icon={<FiTrash2 />} danger>
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
        toast.success("Comment updated!");
        setEditingCommentId(null);
        setEditingCommentText("");
        setIsPostingComment(false);
        getAllPosts();
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
        toast.success("Comment deleted!");
        getAllPosts();
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
                className="rotate-90"
                icon={<CiMenuKebab />}
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
          <span>10 likes</span>
          <span>20comments • 5 shares</span>
        </div>

        {/* Post Actions */}
        <div className="flex justify-between pt-3 border-t border-gray-200">
          {likedByCurrentUser ? (
            <button
              className="flex items-center gap-1 text-gray-600 hover:bg-gray-100 px-2 py-1 rounded-md transition-colors"
              onClick={handleUnlike}
            >
              <HeartOutlined /> Unlike
            </button>
          ) : (
            <button
              className="flex items-center gap-1 text-gray-600 hover:bg-gray-100 px-2 py-1 rounded-md transition-colors"
              onClick={handleLike}
            >
              <HeartOutlined /> Like
            </button>
          )}
          <button
            className="flex items-center gap-1 text-gray-600 hover:bg-gray-100 px-2 py-1 rounded-md transition-colors"
            onClick={() => setShowCommentInput(true)}
          >
            <MessageOutlined /> Comment
          </button>

          <button className="flex items-center gap-1 text-gray-600 hover:bg-gray-100 px-2 py-1 rounded-md transition-colors">
            <ShareAltOutlined /> Share
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
                        className="ml-1 text-green-600 hover:underline text-xs"
                        onClick={() => handleSaveEditComment(comment)}
                        disabled={isPostingComment}
                      >
                        Save
                      </button>
                      <button
                        className="ml-1 text-gray-500 hover:underline text-xs"
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
                        className="ml-2 text-blue-500 hover:underline text-xs"
                        onClick={() => handleEditComment(comment)}
                      >
                        Edit
                      </button>
                      <button
                        className="ml-1 text-red-500 hover:underline text-xs"
                        onClick={() => handleDeleteComment(comment)}
                      >
                        Delete
                      </button>
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
                className="bg-blue-500 text-white px-3 py-1 rounded"
                onClick={handleAddComment}
                disabled={isPostingComment}
              >
                {isPostingComment ? "Posting..." : "Post Comment"}
              </button>
              <button
                className="bg-gray-300 px-3 py-1 rounded"
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
