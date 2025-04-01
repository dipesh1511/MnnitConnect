import React, { useEffect, useState } from "react";
import axiosInstance from "../../config/axios";
import { NavLink } from "react-router-dom";
import { FaBriefcase, FaBuilding } from "react-icons/fa";
import { toast } from "react-toastify";

const JobsApplied = () => {
  const [jobsApplied, setJobsApplied] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobsApplied = async () => {
      try {
        const response = await axiosInstance.get("/job/showapplied");
        console.log(response);
        if (response.data && response.data.appliedJobs) {
          setJobsApplied(response.data.appliedJobs);
        } else {
          setJobsApplied([]);
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
      <h1 className="text-3xl font-bold mb-6 text-center">
        Jobs You Have Applied For
      </h1>
      {jobsApplied.length === 0 ? (
        <div className="text-center text-gray-600">
          <p>No jobs applied</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {jobsApplied.map((job) => (
            <div
              key={job._id}
              className="bg-white rounded-lg shadow-lg hover:shadow-xl transition duration-300 cursor-pointer border border-gray-200"
            >
              <NavLink to={`/showjob/${job._id}`} className="block p-6">
                <div className="flex items-center mb-4">
                  <FaBuilding className="text-blue-600 mr-2 text-lg" />
                  <p className="text-lg font-semibold text-gray-800">
                    {job.company}
                  </p>
                </div>
                <h2 className="text-2xl font-medium text-gray-900 mb-2">
                  {job.jobTitle}
                </h2>
                <div className="flex items-center text-gray-600 mb-2">
                  <FaBriefcase className="mr-2 text-gray-500" />
                  <p>{job.location}</p>
                </div>
                <div className="flex items-center text-gray-600 text-lg font-semibold">
                  <span className="mr-2 text-green-500">₹</span>
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
