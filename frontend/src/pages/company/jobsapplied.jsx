import React, { useEffect, useState } from "react";
import axiosInstance from "../../config/axios";
import { NavLink } from "react-router-dom";
import { FaBriefcase, FaBuilding, FaDollarSign } from "react-icons/fa";
import { toast } from "react-toastify"; // For error handling

const JobsApplied = () => {
  const [jobsApplied, setJobsApplied] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobsApplied = async () => {
      try {
        // Replace with actual API endpoint for fetching applied jobs
        const response = await axiosInstance.get("/user/showapplied");

        if (response.data) {
          setJobsApplied(response.data); // Assuming response contains an array of applied jobs
        } else {
          setJobsApplied([]); // In case no jobs are applied
        }
      } catch (error) {
        console.log("Error fetching applied jobs:", error);
        toast.error("Failed to load applied jobs. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobsApplied();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Jobs You Have Applied For</h1>
      {jobsApplied.length === 0 ? (
        <div className="text-center text-gray-600">
          <p>No jobs applied</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobsApplied.map((job) => (
            <div
              key={job._id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition duration-300 cursor-pointer"
            >
              <NavLink to={`/jobdetails/${job._id}`} className="block p-4">
                <div className="flex items-center mb-4">
                  <FaBuilding className="text-blue-500 mr-2" />
                  <p className="text-lg font-semibold text-gray-700">
                    {job.companyName}
                  </p>
                </div>
                <h2 className="text-xl font-medium text-gray-800 mb-2">
                  {job.title}
                </h2>
                <div className="flex items-center text-gray-600">
                  <FaDollarSign className="mr-2" />
                  <p>{job.salary}</p>
                </div>
              </NavLink>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobsApplied;
