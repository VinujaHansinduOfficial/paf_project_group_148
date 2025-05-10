import React, { useState } from "react";
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

  const user = JSON.parse(localStorage.getItem("user"));

  const userId = user ? user.id : null;

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
  return (
    <>
      <div className="bg-white rounded-lg shadow mb-4 border border-gray-200 p-4 max-w-xl mx-auto">
        {/* Post Header */}

        <div className="flex justify-between">
          <div className="flex items-center mb-3 gap-2">
            <Avatar size="large" icon={<UserOutlined />} />

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
          <button className="flex items-center gap-1 text-gray-600 hover:bg-gray-100 px-2 py-1 rounded-md transition-colors">
            <HeartOutlined size={50} /> Like
          </button>
          <button className="flex items-center gap-1 text-gray-600 hover:bg-gray-100 px-2 py-1 rounded-md transition-colors">
            <MessageOutlined /> Comment
          </button>

          <button className="flex items-center gap-1 text-gray-600 hover:bg-gray-100 px-2 py-1 rounded-md transition-colors">
            <ShareAltOutlined /> Share
          </button>
        </div>
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
