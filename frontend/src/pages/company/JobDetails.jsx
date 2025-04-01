import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../../config/axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const JobDetails = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [showApplicants, setShowApplicants] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await axiosInstance.get(`/job/show/${jobId}`);
        if (response.data.success) {
          setJob(response.data.job);
        } else {
          toast.error("Failed to load job details.");
        }
      } catch (error) {
        toast.error("Error loading job details.");
      } finally {
        setLoading(false);
      }
    };
    fetchJobDetails();
  }, [jobId]);

  const fetchApplicants = async () => {
    try {
      const response = await axiosInstance.get(`/job/showapplicant/${jobId}`);
      if (response.data.success) {
        setApplicants(response.data.applicants);
      } else {
        toast.error("Failed to load applicants.");
      }
    } catch (error) {
      toast.error("Error loading applicants.");
    }
  };

  const handleDelete = async () => {
    try {
      const response = await axiosInstance.post(`/job/remove/${jobId}`);
      if (response.data.success) {
        toast.success("Job deleted successfully.");
        navigate("/company/showjobs");
      } else {
        toast.error("Failed to delete job.");
      }
    } catch (error) {
      toast.error("Error deleting job.");
    }
  };

  const handleStatusToggle = async () => {
    try {
      const response = await axiosInstance.post(`/job/changestatus/${jobId}`);
      if (response.data.success) {
        setJob({ ...job, status: response.data.newStatus });
        toast.success(response.data.message);
      } else {
        toast.error("Failed to update job status.");
      }
    } catch (error) {
      toast.error("Error updating job status.");
    }
  };

  if (loading)
    return <p className="text-center text-gray-700">Loading job details...</p>;

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <ToastContainer />
      {job ? (
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl mx-auto space-y-8">
          <section className="space-y-3">
            <h1 className="text-3xl font-bold text-gray-900">{job.jobTitle}</h1>
            <div className="text-gray-700 text-lg">
              <p>
                <strong>Company:</strong> {job.company}
              </p>
              <p>
                <strong>Location:</strong> {job.location}
              </p>
              <p>
                <strong>Salary:</strong> {job.salary}
              </p>
              <p>
                <strong>Experience Required:</strong> {job.experience}
              </p>
              <p>
                <strong>Date Posted:</strong>{" "}
                {new Date(job.datePosted).toLocaleDateString()}
              </p>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-800">
              Job Description:
            </h3>
            <p className="text-gray-600 leading-relaxed">{job.description}</p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-800">
              Skills Required:
            </h3>
            <ul className="list-disc pl-6 space-y-1 text-gray-600">
              {job.skills.map((skill, index) => (
                <li key={index}>{skill}</li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-800">
              Qualifications:
            </h3>
            <ul className="list-disc pl-6 space-y-1 text-gray-600">
              {job.qualifications.map((qualification, index) => (
                <li key={index}>{qualification}</li>
              ))}
            </ul>
          </section>

          <section className="space-x-3">
            <button
              onClick={handleDelete}
              className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none transition"
            >
              Delete Job
            </button>
            <button
              onClick={handleStatusToggle}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none transition"
            >
              {job.status === "active" ? "Mark as Inactive" : "Mark as Active"}
            </button>
            <button
              onClick={() => {
                setShowApplicants(!showApplicants);
                if (!showApplicants) fetchApplicants();
              }}
              className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none transition"
            >
              {showApplicants ? "Hide Applicants" : "Show All Applicants"}
            </button>
          </section>

          {showApplicants && (
            <section className="mt-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Applicants:
              </h3>
              {applicants.length > 0 ? (
                <div className="space-y-3">
                  {applicants.map((applicant) => (
                    <div
                      key={applicant._id}
                      className="p-4 bg-gray-50 rounded-lg shadow-md flex items-center justify-between"
                    >
                      <div>
                        <p className="text-gray-900 font-medium">
                          {applicant.name}
                        </p>
                        <p className="text-gray-600 text-sm">
                          {applicant.email}
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          navigate(`/explore/${applicant.username}`)
                        }
                        className="text-blue-500 hover:underline focus:outline-none text-sm"
                      >
                        View Profile
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No applicants for this job yet.</p>
              )}
            </section>
          )}
        </div>
      ) : (
        <p className="text-center text-gray-700">Job not found.</p>
      )}
    </div>
  );
};

export default JobDetails;
