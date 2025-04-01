import React, { useState } from "react";
import axiosInstance from "../../../config/axios.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PostJob = () => {
  const [formData, setFormData] = useState({
    jobTitle: "",
    description: "",
    location: "",
    salary: "",
    skills: [],
    experience: "",
    qualifications: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleArrayChange = (e, field) => {
    const values = e.target.value.split(",").map((val) => val.trim());
    setFormData({ ...formData, [field]: values });
  };

  const validateForm = () => {
    const { jobTitle, description, location, salary } = formData;
    if (!jobTitle || !description || !location || !salary) {
      toast.error("Please fill in all required fields.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        // Send form data without datePosted to backend
        const response = await axiosInstance.post("/job/add", formData);
        if (response.data.success) {
          toast.success("Job posted successfully!");
          setFormData({
            jobTitle: "",
            description: "",
            location: "",
            salary: "",
            skills: [],
            experience: "",
            qualifications: [],
          });
        } else {
          toast.error(response.data.message || "Failed to post job.");
        }
      } catch (error) {
        toast.error("An error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <ToastContainer />
      <div className="w-full max-w-lg p-8 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
          Post a Job
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Job Title */}
          <div>
            <label
              htmlFor="jobTitle"
              className="block text-gray-700 font-semibold"
            >
              Job Title<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 text-gray-900 bg-gray-100 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-gray-700 font-semibold"
            >
              Description<span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 text-gray-900 bg-gray-100 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="4"
              required
            />
          </div>

          {/* Location */}
          <div>
            <label
              htmlFor="location"
              className="block text-gray-700 font-semibold"
            >
              Location<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 text-gray-900 bg-gray-100 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Salary */}
          <div>
            <label
              htmlFor="salary"
              className="block text-gray-700 font-semibold"
            >
              Salary<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 text-gray-900 bg-gray-100 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Skills */}
          <div>
            <label
              htmlFor="skills"
              className="block text-gray-700 font-semibold"
            >
              Skills (comma-separated)
            </label>
            <input
              type="text"
              name="skills"
              value={formData.skills.join(", ")}
              onChange={(e) => handleArrayChange(e, "skills")}
              className="w-full px-4 py-2 mt-1 text-gray-900 bg-gray-100 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="E.g., JavaScript, React, Node.js"
            />
          </div>

          {/* Experience */}
          <div>
            <label
              htmlFor="experience"
              className="block text-gray-700 font-semibold"
            >
              Experience (optional)
            </label>
            <input
              type="text"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 text-gray-900 bg-gray-100 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Qualifications */}
          <div>
            <label
              htmlFor="qualifications"
              className="block text-gray-700 font-semibold"
            >
              Qualifications (comma-separated)
            </label>
            <input
              type="text"
              name="qualifications"
              value={formData.qualifications.join(", ")}
              onChange={(e) => handleArrayChange(e, "qualifications")}
              className="w-full px-4 py-2 mt-1 text-gray-900 bg-gray-100 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="E.g., Bachelor's Degree, Certification"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Post Job
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostJob;
