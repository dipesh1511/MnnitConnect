import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import axiosInstance from "../../config/axios.js";

const UpdateProfilePage = () => {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    profilePicture: "",
    coverPhoto: "",
    skills: "",
    experience: [{ title: "", company: "", startDate: "", endDate: "", description: "" }],
    project: [{ title: "", startDate: "", endDate: "", description: "" }],
    education: [{ instituteName: "", fieldOfStudy: "", startYear: "", endYear: "" }],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setFormData({
          name: user.name || "",
          bio: user.bio || "",
          profilePicture: user.profilePicture || "",
          coverPhoto: user.coverPhoto || "",
          skills: user.skills ? user.skills.join(", ") : "",
          experience: user.experience || [{ title: "", company: "", startDate: "", endDate: "", description: "" }],
          project: user.project || [{ title: "", startDate: "", endDate: "", description: "" }],
          education: user.education || [{ instituteName: "", fieldOfStudy: "", startYear: "", endYear: "" }],
        });
      } catch (error) {
        console.error("Error fetching profile data", error);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prevData) => ({
          ...prevData,
          [field]: reader.result, // Set as Base64 string
        }));
      };
      reader.readAsDataURL(file); // Convert file to Base64
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [field]: "", // Clear field if no file is selected
      }));
    }
  };

  const handleArrayChange = (e, arrayName, index) => {
    const { name, value } = e.target;
    setFormData((prevData) => {
      const updatedArray = [...prevData[arrayName]];
      updatedArray[index] = {
        ...updatedArray[index],
        [name]: value,
      };
      return { ...prevData, [arrayName]: updatedArray };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const transformedData = {
        ...formData,
        skills: formData.skills.split(",").map((skill) => skill.trim()),
      };
      await axiosInstance.put("/user/updateprofile", transformedData);
      toast.success("Profile updated successfully!");
      navigate(`/explore/${user.username}`);
    } catch (error) {
      console.error("Error updating profile", error.message);
      toast.error("Error updating profile");
    }
  };

  return (
    <div className="bg-white min-h-screen text-gray-900">
      <div className="max-w-4xl mx-auto py-10 px-6 lg:px-12">
        <ToastContainer />
        <h2 className="text-3xl font-semibold text-center mb-8 text-gray-800">Update Profile</h2>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Name Field */}
          <div className="border border-gray-300 rounded-lg p-5 shadow-md">
            <label className="block text-gray-700 text-lg font-medium mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Profile Picture Upload */}
          <div className="border border-gray-300 rounded-lg p-5 shadow-md">
            <label className="block text-gray-700 text-lg font-medium mb-2">Profile Picture</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, "profilePicture")}
              className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900"
            />
            {formData.profilePicture && (
              <img
                src={formData.profilePicture}
                alt="Profile Preview"
                className="mt-4 w-32 h-32 object-cover rounded-full shadow-lg"
              />
            )}
          </div>

          {/* Cover Photo Upload */}
          <div className="border border-gray-300 rounded-lg p-5 shadow-md">
            <label className="block text-gray-700 text-lg font-medium mb-2">Cover Photo</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, "coverPhoto")}
              className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900"
            />
            {formData.coverPhoto && (
              <img
                src={formData.coverPhoto}
                alt="Cover Preview"
                className="mt-4 w-full h-48 object-cover rounded-lg shadow-lg"
              />
            )}
          </div>

          {/* Bio Field */}
          <div className="border border-gray-300 rounded-lg p-5 shadow-md">
            <label className="block text-gray-700 text-lg font-medium mb-2">Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Skills Field */}
          <div className="border border-gray-300 rounded-lg p-5 shadow-md">
            <label className="block text-gray-700 text-lg font-medium mb-2">Skills</label>
            <input
              type="text"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="comma-separated"
              className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-200 ease-in-out"
            >
              Update Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfilePage;
