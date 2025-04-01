import React, { useEffect, useState } from "react";
import axiosInstance from "../../config/axios.js";
import { Link } from "react-router-dom";
import {
  HiOutlineBriefcase,
  HiOutlineLocationMarker,
  HiOutlineCurrencyDollar,
} from "react-icons/hi";

const JobCard = ({ image, title, company, location, salary, id }) => {
  return (
    <Link to={`/showjob/${id}`} className="block hover:bg-gray-100 transition">
      <div className="bg-white border border-gray-200 shadow-md rounded-lg p-6 w-64 h-50 flex items-start space-x-4 overflow-hidden">
        {/* Company Logo */}
        <img
          src={image}
          alt="Company Logo"
          className="w-14 h-14 object-contain"
        />

        {/* Job Details */}
        <div className="flex-1 overflow-hidden">
          <h2 className="text-blue-600 font-semibold truncate">{title}</h2>
          <div className="flex items-center">
            <HiOutlineBriefcase className="w-5 h-5 text-gray-500 mr-1" />
            <p className="text-gray-700 truncate">{company}</p>
          </div>
          <div className="flex items-center">
            <HiOutlineLocationMarker className="w-5 h-5 text-gray-500 mr-1" />
            <p className="text-gray-500 truncate">{location}</p>
          </div>
          <div className="flex items-center">
            <span className="text-gray-500 mr-1">₹</span>
            <p className="text-gray-700 font-medium truncate">{salary}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

const JobCardGrid = () => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    // Fetch jobs from the backend
    axiosInstance
      .get("/job/showactive")
      .then((response) => {
        if (response.data.success) {
          setJobs(response.data.jobs); // Access the jobs array within response data
        } else {
          console.error("Failed to fetch jobs.");
        }
      })
      .catch((error) => {
        console.error("Error fetching jobs:", error);
      });
  }, []);

  return (
    <div className="container mx-auto p-4 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {jobs.map((job) => (
        <JobCard
          key={job._id} // assuming each job has a unique _id
          image={job.image || "https://via.placeholder.com/50"} // Fallback to placeholder if image is not provided
          title={job.jobTitle}
          company={job.company}
          location={job.location}
          salary={job.salary}
          id={job._id}
        />
      ))}
    </div>
  );
};

export default JobCardGrid;
