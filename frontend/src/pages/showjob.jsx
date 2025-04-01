import React, { useEffect, useState } from "react";
import axiosInstance from "../../config/axios.js";
import { useParams } from "react-router-dom";
import { FaMapMarkerAlt, FaBuilding } from "react-icons/fa";

const JobDetailsPage = () => {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);

  useEffect(() => {
    // Fetch job details from backend
    axiosInstance
      .get(`/job/show/${jobId}`)
      .then((response) => {
        if (response.data.success) {
          setJob(response.data.job);
        } else {
          console.error("Failed to fetch job details.");
        }
      })
      .catch((error) => {
        console.error("Error fetching job details:", error);
      });
  }, [jobId]);

  const handleApply = () => {
    // Submit application for the job
    axiosInstance
      .post(`/job/apply/${jobId}`)
      .then((response) => {
        if (response.data.success) {
          alert("Application submitted successfully!");
        } else {
          alert("Failed to submit application.");
        }
      })
      .catch((error) => {
        console.error("Error applying for job:", error);
        alert("An error occurred while applying for the job.");
      });
  };

  if (!job) return <div>Loading...</div>; // Show loading indicator until data is fetched

  return (
    <div className="bg-gray-50 min-h-screen p-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8">
        {/* Job Title */}
        <h1 className="text-4xl font-extrabold text-blue-800 mb-4">
          {job.jobTitle}
        </h1>

        {/* Location, Company, and Salary */}
        <div className="flex items-center text-gray-600 mb-8">
          <div className="flex items-center mr-6">
            <FaMapMarkerAlt className="mr-2 text-blue-600" />
            <p className="text-lg">{job.location}</p>
          </div>
          <div className="flex items-center mr-6">
            <FaBuilding className="mr-2 text-blue-600" />
            <p>{job.company}</p>
          </div>
          <div className="flex items-center">
            <span className="text-blue-600 mr-2">₹</span>
            <p className="text-lg">{job.salary}</p>
          </div>
        </div>

        {/* Job Details */}
        <div className="bg-gray-100 p-6 rounded-lg mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            About the Job
          </h2>
          <p className="text-gray-700 text-lg leading-relaxed mb-4">
            {job.description}
          </p>

          {/* Additional Details */}
          <div className="text-gray-700 text-lg leading-relaxed space-y-4">
            <p>
              <strong>Status:</strong> {job.status}
            </p>
            <p>
              <strong>Experience Required:</strong> {job.experience}
            </p>

            {/* Skills */}
            <div>
              <strong>Skills:</strong>
              <ul className="list-disc list-inside ml-4">
                {job.skills.map((skill, index) => (
                  <li key={index}>{skill}</li>
                ))}
              </ul>
            </div>

            {/* Qualifications */}
            <div>
              <strong>Qualifications:</strong>
              <ul className="list-disc list-inside ml-4">
                {job.qualifications.map((qualification, index) => (
                  <li key={index}>{qualification}</li>
                ))}
              </ul>
            </div>

            {/* Date Posted */}
            <p>
              <strong>Date Posted:</strong>{" "}
              {new Date(job.datePosted).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Apply Button */}
        <div className="text-center">
          <button
            onClick={handleApply}
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:from-blue-700 hover:to-blue-800 transition-transform transform hover:scale-105 focus:outline-none"
          >
            Apply Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobDetailsPage;
