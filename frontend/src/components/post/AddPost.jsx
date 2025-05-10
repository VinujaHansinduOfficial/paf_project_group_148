import { Modal } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { CiImageOn, CiVideoOn } from "react-icons/ci";
import { FaTimes } from "react-icons/fa";
import { IoSend } from "react-icons/io5";
import { toast } from "sonner";
import { savePost } from "../../api/postApi";

const AddPost = ({ getAllPosts }) => {
  const [description, setDescription] = useState("");
  const [mediaFiles, setMediaFiles] = useState([]);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setUserId(user.id);
    }
  }, [userId]);

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  // Handle media file selection
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const newMediaFiles = files.map((file) => ({
      id: Math.random().toString(36).substring(2),
      file,
      type: file.type.startsWith("image/") ? "image" : "video",
      preview: URL.createObjectURL(file),
    }));

    setMediaFiles([...mediaFiles, ...newMediaFiles]);
  };

  // Remove a media file
  const removeMedia = (id) => {
    const updatedFiles = mediaFiles.filter((media) => media.id !== id);
    setMediaFiles(updatedFiles);
  };

  // Handle post submission
  const handleSubmit = async () => {
    if (!description && mediaFiles.length === 0) return;

    const uploadedFileUrls = (await uploadFiles()) || [];

    let mediaUrls = [];
    if (uploadedFileUrls.length > 0) {
      uploadedFileUrls.forEach((url) => {
        // extension should be image or video
        let imgExtension = url.split(".").pop();
        const imageExtensions = [
          "jpg",
          "jpeg",
          "png",
          "gif",
          "bmp",
          "webp",
          "tiff",
          "svg",
        ];
        const videoExtensions = [
          "mp4",
          "mov",
          "avi",
          "wmv",
          "flv",
          "webm",
          "mkv",
          "3gp",
          "mpeg",
        ];

        let extension = "";

        if (imageExtensions.includes(imgExtension.toLowerCase())) {
          extension = "image";
        } else if (videoExtensions.includes(imgExtension.toLowerCase())) {
          extension = "video";
        } else {
          extension = "unknown";
        }

        let obj = {
          url: url,
          extension: extension,
        };

        mediaUrls.push(obj);
      });
    }

    const postData = {
      userId: userId,
      description,
      imageUrls: mediaUrls || [],
    };

    try {
      // Send the post data to your API endpoint
      let response = await savePost(postData);
      debugger;
      if (response.status === 200) {
        toast.success("Post created successfully!");
      }

      // Simulate API call

      setDescription("");
      setMediaFiles([]);
      getAllPosts();
    } catch (error) {
      toast.error("Failed to create post!");
    }
  };

  const uploadFiles = async () => {
    if (mediaFiles.length === 0) return [];

    const formData = new FormData();

    // Append all files to the FormData object
    mediaFiles.forEach((media) => {
      formData.append("files", media.file);
    });

    // Upload files to your API endpoint
    const response = await axios.post(
      "http://localhost:8080/store/multiple",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    // Return the array of file URLs from the response
    return response.data.imageUrls;
  };
  return (
    <>
      <div className=" mx-auto bg-white rounded-lg shadow-md p-2 w-full mb-4">
        <div className="mb-4">
          <textarea
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            placeholder="What's on your mind?"
            rows={4}
            value={description}
            onChange={handleDescriptionChange}
          />
        </div>

        {/* Media Preview Section */}
        {mediaFiles.length > 0 && (
          <div className="mb-4">
            <div className="grid grid-cols-2 gap-2">
              {mediaFiles.map((media) => (
                <div
                  key={media.id}
                  className="relative rounded-lg overflow-hidden bg-gray-100 aspect-square"
                >
                  {media.type === "image" ? (
                    <img
                      src={media.preview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <video
                      src={media.preview}
                      controls
                      className="w-full h-full object-cover"
                    />
                  )}
                  <button
                    onClick={() => removeMedia(media.id)}
                    className="absolute top-1 right-1 bg-gray-800 bg-opacity-70 text-white rounded-full p-1"
                  >
                    <FaTimes size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions Section */}
        <div className="flex items-center justify-between border-t border-gray-200 pt-3">
          <div className="flex space-x-2">
            <label className="cursor-pointer p-2 rounded-full hover:bg-gray-100 transition-colors">
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleFileSelect}
              />
              <CiImageOn size={20} className="text-blue-500" />
            </label>

            <label className="cursor-pointer p-2 rounded-full hover:bg-gray-100 transition-colors">
              <input
                type="file"
                accept="video/*"
                multiple
                className="hidden"
                onChange={handleFileSelect}
              />
              <CiVideoOn size={20} className="text-green-500" />
            </label>
          </div>

          <button
            className={`px-2 py-2 rounded-xl flex items-center space-x-1 ${
              !description
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
            onClick={handleSubmit}
            disabled={!description}
          >
            <IoSend size={20} />
          </button>
        </div>
      </div>
    </>
  );
};

export default AddPost;
