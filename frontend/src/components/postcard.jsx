import React, { useState, useEffect } from "react";
import { FaHeart, FaBookmark, FaComment } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import axiosInstance from "../../config/axios";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
const PostCard = ({
  profilePicture,
  name,
  bio,
  description,
  postImage,
  initialLikes,
  initialComments,
  initialSaves,
  postId,
  commentsData,
  username,
}) => {
  const [likes, setLikes] = useState(initialLikes || 0);
  const [comments, setComments] = useState(initialComments || 0);
  const [saves, setSaves] = useState(initialSaves || 0);
  const [hasLiked, setHasLiked] = useState(false);
  const [hasSaved, setHasSaved] = useState(false);
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [commentList, setCommentList] = useState(commentsData);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axiosInstance.get(`/posts`);
        setHasLiked(response.data.hasLiked);
        setHasSaved(response.data.hasSaved);
        if (!commentsData || commentsData.length === 0) {
          setCommentList(response.data.comment);
        }
      } catch (error) {
        toast.error("Error fetching post data");
      }
    }
    fetchData();
  }, [postId]);

  const handleLike = async () => {
    if (hasLiked) return;
    setLikes((prev) => prev + 1);
    setHasLiked(true);
    try {
      await axiosInstance.post(`/posts/${postId}`);
    } catch (error) {
      setLikes((prev) => prev - 1);
      setHasLiked(false);
      toast.error("Error updating like");
    }
  };

  const handleSave = async () => {
    if (hasSaved) return;
    setSaves((prev) => prev + 1);
    setHasSaved(true);
    try {
      await axiosInstance.post(`/posts/${postId}/save`);
    } catch (error) {
      setSaves((prev) => prev - 1);
      setHasSaved(false);
      toast.error("Error saving post");
    }
  };

  const handleCommentClick = () => {
    //console.log(commentsData);
    //console.log(commentList?.length);
    setShowCommentBox(!showCommentBox);
  };

  const handleAddComment = async () => {
    if (newComment.trim() === "") return;
    setLoading(true);
    try {
      const response = await axiosInstance.post(`/posts/${postId}/comment`, {
        text: newComment,
      });
      setCommentList([...commentList, response.data.comment]);
      setNewComment("");
      setComments((prev) => prev + 1);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 shadow-lg rounded-2xl p-6 max-w-lg mx-auto hover:shadow-2xl transition-shadow duration-300">
      <ToastContainer />
      <div className="flex items-center mb-4">
        <img
          src={profilePicture}
          alt="Profile"
          className="w-14 h-14 rounded-full object-cover mr-4 shadow-sm border border-gray-300"
        />
        <div>
          <Link
            to={`/explore/${username}`}
            className="font-semibold text-gray-900 text-lg"
          >
            {name || "Unknown User"}
          </Link>
          <p className="text-sm text-gray-500">{bio || "No bio provided"}</p>
        </div>
      </div>
      <p className="text-gray-700 mb-4 leading-relaxed">
        {description || "No description provided."}
      </p>
      {postImage && (
        <img
          src={postImage}
          alt="Post Image"
          className="w-full h-64 object-cover rounded-lg mb-4 border border-gray-200 shadow-sm"
        />
      )}
      <div className="flex justify-between items-center text-gray-500 border-t border-gray-200 pt-4">
        <button
          className={`flex items-center space-x-2 ${
            hasLiked ? "text-blue-600" : "text-gray-600"
          } hover:text-blue-600 transition-colors duration-200`}
          onClick={handleLike}
        >
          <FaHeart className="text-xl" />
          <span className="text-sm font-medium">{likes}</span>
        </button>
        <button
          className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors duration-200"
          onClick={handleCommentClick}
        >
          <FaComment className="text-xl" />
          <span className="text-sm font-medium">
            {showCommentBox ? "Hide comments" : `(${comments})`}
          </span>
        </button>
        <button
          className={`flex items-center space-x-2 ${
            hasSaved ? "text-blue-600" : "text-gray-600"
          } hover:text-blue-600 transition-colors duration-200`}
          onClick={handleSave}
        >
          <FaBookmark className="text-xl" />
        </button>
      </div>
      {showCommentBox && (
        <div className="mt-4">
          <div className="mb-4">
            {commentList?.length > 0 ? (
              commentList.map((comment, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-2 mb-2 p-2 rounded-md border border-gray-200 bg-gray-50"
                >
                  <img
                    src={comment.user.profilePicture}
                    alt="User Profile"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-900 text-sm">
                      {comment.user.name}
                    </span>
                    <span className="text-gray-700 text-sm">
                      {comment.text}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No comments yet.</p>
            )}
          </div>

          {/* New comment input */}
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="w-full p-2 border rounded-lg mb-2"
          />
          <button
            onClick={handleAddComment}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Add Comment
          </button>
        </div>
      )}
    </div>
  );
};

export default PostCard;
