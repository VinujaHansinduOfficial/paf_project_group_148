import React, { useEffect, useState } from "react";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en"; // Import the English locale
import AddPost from "../components/post/AddPost";
import Post from "../components/post/Post";
import { toast } from "sonner";
import { getAllPost } from "../api/postApi";

// Register the locale for TimeAgo
TimeAgo.addDefaultLocale(en);

const HomePage = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    getAllPosts();
  }, []);
  const getAllPosts = async () => {
    try {
      const response = await getAllPost();
      if (response.status === 200) {
        setPosts(response.data);
      } else {
        toast.error("Error fetching posts");
      }
    } catch (error) {
      toast.error("Error fetching posts:", error);
    }
  };

  return (
    <>
      <div className="flex flex-col h-screen max-w-lg mx-auto bg-gray-50">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
          <div className="px-4 py-3">
            <h1 className="text-xl font-bold text-center text-blue-600">
              Social Feed
            </h1>
          </div>
        </div>

        {/* Feed */}

        <div className="flex-1 overflow-y-auto p-2">
          <AddPost getAllPosts={getAllPosts} />

          {posts.map((post, index) => (
            <Post key={index} post={post} getAllPosts={getAllPosts} />
          ))}
        </div>
      </div>
    </>
  );
};

export default HomePage;
