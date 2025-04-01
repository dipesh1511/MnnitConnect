import React, { useEffect, useState } from "react";
import axiosInstance from "../../config/axios.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux"; // Importing Redux hooks

const UsersPost = ({ username }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch the current user data from Redux store
  const currentUser = useSelector((state) => state.auth.user); // Assuming the current user's data is stored under 'auth.user'

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await axiosInstance.get(`/posts/${username}`);
        if (response.data.success) {
          setPosts(response.data.posts);
        } else {
          // toast.error("Failed to load posts.");
        }
      } catch (error) {
        // toast.error("Error fetching posts. Please try again.");
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [username]);

  const handleDeletePost = async (postId) => {
    try {
      const response = await axiosInstance.delete(`/posts/${postId}`);
      if (response.data.success) {
        toast.success("Post deleted successfully");
        setPosts(posts.filter((post) => post._id !== postId)); // Update the state to remove deleted post
      } else {
        toast.error("Error deleting post");
      }
    } catch (error) {
      toast.error("Error deleting post. Please try again.");
      console.error("Error deleting post:", error);
    }
  };

  if (loading) {
    return <div className="text-center">Loading posts...</div>;
  }

  return (
    <div className="mt-5 bg-gray-50 p-3 rounded-lg shadow max-w-full mx-auto">
      <ToastContainer />
      <h3 className="text-lg font-semibold text-gray-800">User's Posts</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {posts.length > 0 ? (
          posts.map((post, index) => (
            <div key={index} className="mt-4 p-3 bg-white rounded-lg shadow-sm">
              <h4 className="text-md font-semibold">{post.title}</h4>
              <p className="text-gray-600 mt-2 text-sm">{post.content}</p>

              {post.image && (
                <div className="mt-3 w-1/3 h-40 overflow-hidden rounded-lg shadow-md">
                  <img
                    src={post.image}
                    alt="Post visual"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <p className="text-gray-500 text-xs mt-1">
                Posted on: {new Date(post.createdAt).toLocaleDateString()}
              </p>

              {/* Display Likes */}
              <div className="mt-1 text-gray-500 text-xs">
                <strong>Likes:</strong> {post.likes.length}
              </div>

              {/* Display Comments */}
              {/* <div className="mt-2">
              <strong>Comments:</strong>
              {post.comments.length > 0 ? (
                post.comments.map((comment, idx) => (
                  <div key={idx} className="mt-2">
                    <p className="text-gray-600">{comment.text}</p>
                    <p className="text-gray-400 text-sm">
                      By: {comment.user || "Anonymous"}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-600">No comments yet.</p>
              )} 
            </div> */}

              {currentUser && currentUser.username === username && (
                <button
                  onClick={() => handleDeletePost(post._id)}
                  className="mt-3 bg-red-500 text-white py-1 px-2 text-xs rounded-lg hover:bg-red-600"
                >
                  Delete Post
                </button>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-600">No posts from this user.</p>
        )}
      </div>
    </div>
  );
};

export default UsersPost;
