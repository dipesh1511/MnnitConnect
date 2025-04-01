import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../../config/axios.js"; 
import { FaCheck, FaTimes } from "react-icons/fa";

const ConnectionCard = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await axiosInstance.get("/connections/requests");
        setRequests(response.data);
      } catch (error) {
        setError("Error fetching connection requests.");
        console.error("Error fetching connection requests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleAccept = async (requestId) => {
    setLoading(true);
    setError("");
    try {
      await axiosInstance.put(`/connections/accept/${requestId}`);
      setRequests((prevRequests) =>
        prevRequests.filter((req) => req._id !== requestId)
      );
    } catch (error) {
      setError("Error accepting request.");
      console.error("Error accepting request:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (requestId) => {
    setLoading(true);
    setError("");
    try {
      await axiosInstance.put(`/connections/reject/${requestId}`);
      setRequests((prevRequests) =>
        prevRequests.filter((req) => req._id !== requestId)
      );
    } catch (error) {
      setError("Error rejecting request.");
      console.error("Error rejecting request:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-lg font-semibold mb-4">
        Received Invitations ({requests.length})
      </h2>
      {error && <p className="text-red-600">{error}</p>}
      {requests.length > 0 ? (
        requests.map((request) => (
          <div
            key={request._id}
            className="bg-gray-100 p-4 mb-4 rounded-lg shadow-md"
          >
            <div className="flex items-center justify-between">
              <Link
                to={`/explore/${request.sender.username}`}
                className="flex items-start space-x-4"
              >
                <img
                  src={
                    request.sender.profilePicture ||
                    "https://via.placeholder.com/50"
                  }
                  alt={request.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <p className="font-semibold text-gray-800">
                    {request.sender.name || "No title available"}
                  </p>
                  <p className="text-sm text-gray-700 mt-1">
                    {request.message || ""}
                  </p>
                  {request.sender.bio && (
                    <p className="text-gray-600 text-sm mt-2">
                      {request.sender.bio}
                    </p>
                  )}
                </div>
              </Link>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleReject(request._id)}
                  className="text-gray-500 hover:text-red-600"
                  title="Ignore"
                >
                  <FaTimes className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleAccept(request._id)}
                  className="text-blue-500 hover:text-blue-700"
                  title="Accept"
                  disabled={loading}
                >
                  {loading ? (
                    <span>Loading...</span>
                  ) : (
                    <FaCheck className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-600">No pending connection requests.</p>
      )}
    </div>
  );
};

export default ConnectionCard;
