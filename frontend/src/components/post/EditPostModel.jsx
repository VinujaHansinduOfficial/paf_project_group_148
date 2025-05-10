import { SaveFilled } from "@ant-design/icons";
import { Drawer, Modal } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { BiTrash, BiUpload } from "react-icons/bi";
import { BsTrash2, BsTrash2Fill } from "react-icons/bs";
import { toast } from "sonner";
import { updatePost } from "../../api/postApi";

const EditPostModel = ({
  isEditModelOpen,
  handleOk,
  handleCancel,
  initialPostData,
}) => {
  const [post, setPost] = useState(
    initialPostData || {
      postId: null,
      description: "",
      imageUrls: [],
    }
  );

  console.log(post);

  const [newImages, setNewImages] = useState([]);
  const [imagesToRemove, setImagesToRemove] = useState([]);

  const handleDescriptionChange = (e) => {
    setPost({ ...post, description: e.target.value });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);

    const newImagePreviews = files.map((file) => ({
      id: `new-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      file,
      previewUrl: URL.createObjectURL(file),
      extension: `.${file.name.split(".").pop()}`,
      isNew: true,
    }));

    setNewImages([...newImages, ...newImagePreviews]);
  };

  const removeExistingImage = (imageId) => {
    setImagesToRemove([...imagesToRemove, imageId]);
  };

  const removeNewImage = (imageId) => {
    setNewImages(newImages.filter((img) => img.id !== imageId));
  };

  const handleSubmit = async () => {
    const uploadedFileUrls = (await uploadFiles()) || [];

    let mediaUrls = [];
    let newImageUrls = [];
    if (uploadedFileUrls.length > 0) {
      uploadedFileUrls.forEach((url) => {
        let obj = {
          url: url,
          extension: "image",
        };

        newImageUrls.push(obj);
      });
    }

    // Combine existing images with new images
    const existingImages = post.imageUrls.filter(
      (img) => !imagesToRemove.includes(img.id)
    );

    existingImages.map((img) => {
      img.url = img.imageUrl;
    });

    mediaUrls = [...newImageUrls, ...existingImages];
    const updatedPost = {
      postId: post.postId,
      description: post.description,
      imageUrls: mediaUrls,
    };

    try {
      const response = await updatePost(updatedPost.postId, updatedPost);
      if (response.status === 200) {
        toast.success("Post updated successfully!");
        window.location.reload();
      }
    } catch (error) {
      toast.error("Error updating post");
    }
  };

  useEffect(() => {
    return () => {
      newImages.forEach((img) => {
        if (img.previewUrl) URL.revokeObjectURL(img.previewUrl);
      });
    };
  }, [newImages]);

  const filteredExistingImages = post.imageUrls.filter(
    (img) => !imagesToRemove.includes(img.id)
  );

  const uploadFiles = async () => {
    if (newImages.length === 0) return [];

    const formData = new FormData();

    // Append all files to the FormData object
    newImages.forEach((media) => {
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

    if (response.status === 200) {
      return response.data.imageUrls;
    }
  };

  return (
    <>
      <Modal
        title="Edit Post"
        open={isEditModelOpen}
        onOk={handleSubmit}
        okButtonProps={{ icon: <SaveFilled /> }}
        okText="Update"
        onCancel={handleCancel}
        width={600}
        height={600}
      >
        {/* Description input */}
        <div className="mb-6">
          <label htmlFor="description" className="block mb-2 font-medium">
            Description
          </label>
          <textarea
            id="description"
            value={post.description}
            onChange={handleDescriptionChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows="4"
          />
        </div>

        {/* Existing images */}
        {filteredExistingImages.length > 0 && (
          <div className="mb-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {filteredExistingImages.map((image) => (
                <div key={image.id} className="relative group">
                  {image.extension === "video" ? (
                    <video
                      src={image.imageUrl}
                      controls
                      className="w-full h-20 object-cover rounded-md"
                    />
                  ) : (
                    <img
                      src={image.imageUrl}
                      alt="Post image"
                      className="w-full h-20 object-cover rounded-md"
                    />
                  )}

                  <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-md">
                    <button
                      onClick={() => removeExistingImage(image.id)}
                      className="p-2 bg-red-600 rounded-full text-white hover:bg-red-700"
                      title="Remove image"
                    >
                      <BiTrash size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* New images preview */}
        {newImages.length > 0 && (
          <div className="mb-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {newImages.map((image) => (
                <div key={image.id} className="relative group">
                  <img
                    src={image.previewUrl}
                    alt="New image preview"
                    className="w-full h-20 object-cover rounded-md"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-md">
                    <button
                      onClick={() => removeNewImage(image.id)}
                      className="p-2 bg-red-600 rounded-full text-white hover:bg-red-700"
                      title="Remove image"
                    >
                      <BsTrash2Fill size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upload new images button */}
        <div className="mb-6">
          <label className="block mb-2 font-medium">Add New Images</label>
          <label className="flex items-center justify-center w-full h-24 p-4 border-2 border-dashed border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <div className="flex flex-col items-center">
              <BiUpload className="h-8 w-8 text-gray-400 mb-2" />
              <span className="text-sm text-gray-500">
                Click to upload images
              </span>
            </div>
          </label>
        </div>
      </Modal>
    </>
  );
};

export default EditPostModel;
