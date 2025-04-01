import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "../../config/axios";

const CreatePostPage = () => {
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleTextChange = (e) => setText(e.target.value);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedImage = e.target.files[0];
      setImage(selectedImage);
      setImagePreview(URL.createObjectURL(selectedImage)); // Show preview of the image
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate that either text or image is provided
    if (!text && !image) {
      toast.error("Please add either text or an image to the post.", {
        progress: undefined,
      });
      return;
    }
    if (!text) {
      toast.error("Text is Necessary", {
        progress: undefined,
      });
      return;
    }

    const formData = new FormData();
    formData.append("content", text);
    if (image) formData.append("image", image);

    try {
      await axiosInstance.post("/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Post created successfully!");
      setText("");
      setImage(null);
      setImagePreview(null);
    } catch (error) {
      toast.error("Error creating post. Please try again.", {
        progress: undefined,
      });
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="bg-gray-50 shadow-lg rounded-lg w-full max-w-lg p-8 space-y-6 transition duration-300 transform hover:scale-105">
        <h2 className="text-2xl font-bold text-blue-700 text-center mb-4">
          Create a New Post
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Post Text */}
          <textarea
            value={text}
            onChange={handleTextChange}
            placeholder="Share your thoughts..."
            rows="5"
            className="w-full border border-gray-300 rounded-lg p-4 resize-none focus:outline-none focus:ring-2 focus:ring-blue-600"
          ></textarea>

          {/* Image Upload with Preview */}
          <div>
            <label className="block text-gray-600 mb-2">
              Upload Image (optional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-gray-500 border border-gray-300 rounded-lg p-2 cursor-pointer bg-white hover:bg-gray-100 transition"
            />
            {imagePreview && (
              <div className="mt-4 relative">
                <img
                  src={imagePreview}
                  alt="Selected Preview"
                  className="w-full h-48 object-cover rounded-lg shadow-md"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImage(null);
                    setImagePreview(null);
                  }}
                  className="absolute top-2 right-2 text-white bg-red-500 p-1 rounded-full hover:bg-red-600"
                >
                  X
                </button>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg shadow-md hover:bg-blue-700 transition"
          >
            Post
          </button>
        </form>
      </div>

      {/* Toastify Notifications */}
      <ToastContainer position="top-center" autoClose={3000} progressBar />
    </div>
  );
};

export default CreatePostPage;
