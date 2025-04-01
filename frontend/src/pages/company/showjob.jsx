import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../../../config/axios.js";
import { ToastContainer, toast } from "react-toastify";
import { MdLocationOn, MdAttachMoney } from "react-icons/md";
import "react-toastify/dist/ReactToastify.css";

const CompanyJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const company = await axiosInstance.get("/company/profile");
      const response = await axiosInstance.get(
        `/job/showall/${company.data._id}`
      );

      if (response.data.success) {
        setJobs(response.data.jobs);
      } else {
        toast.error("Failed to load jobs.");
      }
    } catch (error) {
      toast.error("Error loading jobs. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <ToastContainer />
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
        Your Job Posts
      </h1>

      {loading ? (
        <p className="text-center text-gray-600">Loading jobs...</p>
      ) : jobs.length === 0 ? (
        <p className="text-center text-gray-600">No jobs found.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
            <Link
              to={`/company/${job._id}`}
              key={job._id}
              className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-200"
            >
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                {job.jobTitle}
              </h2>
              <p className="text-gray-700 mb-4 line-clamp-3">
                {job.description}
              </p>
              <div className="flex items-center text-gray-500 mb-2">
                <MdLocationOn className="text-blue-500 mr-2" />
                <span>Location: {job.location}</span>
              </div>
              <div className="flex items-center text-gray-500">
                <MdAttachMoney className="text-green-500 mr-2" />
                <span>Salary: {job.salary}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default CompanyJobs;
