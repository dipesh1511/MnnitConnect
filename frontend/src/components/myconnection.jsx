
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../config/axios.js";

const MyConnections = () => {
  const [connections, setConnections] = useState([]);
  const [displayedConnections, setDisplayedConnections] = useState(10); // Start with 10
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchConnections = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get("/connections");
        setConnections(response.data);
      } catch (error) {
        setError("Error fetching connections.");
        console.error("Error fetching connections:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchConnections();
  }, []);

  const handleLoadMore = () => {
    setDisplayedConnections((prev) => prev + 10); 
  };

  const handleConnectionClick = (connectionUsername) => {
    navigate(`/explore/${connectionUsername}`); // Navigate to the user's profile
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4">
        My Connections ({connections.length})
      </h2>
      {error && <p className="text-red-600">{error}</p>}
      {loading ? (
        <p>Loading...</p>
      ) : (
        connections.slice(0, displayedConnections).map((connection) => (
          <div
            key={connection._id}
            className="flex items-center mb-4 cursor-pointer"
            onClick={() => handleConnectionClick(connection.username)} // Clickable profile
          >
            {/* Profile Picture */}
            <img
              src={
                connection.profilePicture || "https://via.placeholder.com/50"
              }
              alt={connection.name}
              className="w-12 h-12 rounded-full mr-4"
            />
            {/* Name and Bio */}
            <div>
              <p className="font-semibold text-gray-800">{connection.name}</p>
              <p className="text-sm text-gray-600">{connection.bio}</p>
            </div>
          </div>
        ))
      )}
      {displayedConnections < connections.length && (
        <button
          onClick={handleLoadMore}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Load More
        </button>
      )}
    </div>
  );
};

export default MyConnections;
