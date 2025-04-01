import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axiosInstance from "../../config/axios.js";
import UsersPost from "../components/userposts.jsx";

const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

const ProfilePage = () => {
  const { user: loggedInUser } = useSelector((state) => state.auth);
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [connectionStatus, setConnectionStatus] = useState(null);
  const navigate = useNavigate();

  const { username } = useParams();

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await axiosInstance.get(`/explore/${username}`);
        if (response.status === 200) {
          setUser(response.data);
          if (loggedInUser) {
            fetchConnectionStatus(response.data._id);
          }
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setError("User not found.");
        } else {
          setError("Error fetching user profile.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [username, loggedInUser]);

  const fetchConnectionStatus = async (userId) => {
    try {
      const response = await axiosInstance.get(`/connections/status/${userId}`);
      setConnectionStatus(response.data);
    } catch (error) {
      console.error("Error fetching connection status:", error);
    }
  };

  const handleConnect = async () => {
    try {
      await axiosInstance.post(`/connections/request/${user._id}`);
      fetchConnectionStatus(user._id); // Refresh connection status after connect
    } catch (error) {
      console.error("Error sending connection request:", error);
    }
  };

  const handleRemoveConnection = async () => {
    try {
      await axiosInstance.delete(`/connections/${user._id}`);
      fetchConnectionStatus(user._id);
    } catch (error) {
      console.error("Error removing connection:", error);
    }
  };

  const renderConnectionButton = () => {
    if (!connectionStatus) return null;

    switch (connectionStatus.val) {
      case 0:
        return (
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-lg ml-4"
            onClick={() => navigate("/updateprofile")}
          >
            Edit Profile
          </button>
        );
      case 1:
        return (
          <button
            className="px-4 py-2 bg-red-500 text-white rounded-lg ml-4"
            onClick={handleRemoveConnection}
          >
            Remove Connection
          </button>
        );
      case 2:
        return (
          <button
            className="px-4 py-2 bg-gray-500 text-white rounded-lg ml-4"
            disabled
          >
            Pending
          </button>
        );
      case 3:
        return (
          <button
            className="px-4 py-2 bg-yellow-500 text-white rounded-lg ml-4"
            onClick={() => navigate("/connections")}
          >
            Pending
          </button>
        );
      case 4:
        return (
          <button
            className="px-4 py-2 bg-green-500 text-white rounded-lg ml-4"
            onClick={handleConnect}
          >
            Connect
          </button>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Cover and Profile Image */}
      <div className="relative">
        <img
          src={user.coverPhoto || "https://via.placeholder.com/640x256"}
          alt="Cover"
          className="w-full h-64 object-cover rounded-lg"
        />
        <div className="absolute left-4 -bottom-12 w-24 h-24 sm:w-20 sm:h-20 md:w-16 md:h-16 lg:w-24 lg:h-24 rounded-full border-4 border-white overflow-hidden shadow-lg">
          <img
            src={user.profilePicture || "https://via.placeholder.com/100"}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* User Info */}
      <div className="mt-16 text-center flex justify-center items-center">
        <div>
          <h2 className="text-2xl font-semibold">{user.name}</h2>
          <p className="text-gray-600 mt-2">{user.bio || "No bio available"}</p>
        </div>
        <div className="ml-4">
          {loggedInUser && renderConnectionButton()}
        </div>
      </div>

      {/* Skills */}
      <div className="mt-8 bg-gray-50 p-4 rounded-lg shadow">
        <h3 className="text-xl font-semibold text-gray-800">Skills</h3>
        <ul className="flex flex-wrap gap-2 mt-2">
          {user.skills && user.skills.length > 0 ? (
            user.skills.map((skill, index) => (
              <li
                key={index}
                className="bg-gray-200 px-3 py-1 rounded-full text-gray-700"
              >
                {skill}
              </li>
            ))
          ) : (
            <li className="text-gray-600 px-3 py-1 rounded-full bg-gray-200">
              No skills listed.
            </li>
          )}
        </ul>
      </div>

      {/* Experience */}
      <hr className="my-8 border-gray-300" />
      <div className="mt-8 bg-gray-50 p-4 rounded-lg shadow">
        <h3 className="text-xl font-semibold text-gray-800">Experience</h3>
        {user.experience && user.experience.length > 0 ? (
          user.experience
            .sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
            .map((exp, index) => (
              <div key={index} className="mt-4">
                <h4 className="text-lg font-semibold">
                  {exp.title} at {exp.company}
                </h4>
                <p className="text-gray-500">
                  {formatDate(exp.startDate)} -{" "}
                  {formatDate(exp.endDate) || "Present"}
                </p>
                <p className="text-gray-600 mt-1">{exp.description}</p>
              </div>
            ))
        ) : (
          <p className="text-gray-600">No experience listed.</p>
        )}
      </div>

      {/* Project */}
      <hr className="my-8 border-gray-300" />
      <div className="mt-8 bg-gray-50 p-4 rounded-lg shadow">
        <h3 className="text-xl font-semibold text-gray-800">Project</h3>
        {user.project && user.project.length > 0 ? (
          user.project
            .sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
            .map((project, index) => (
              <div key={index} className="mt-4">
                <h4 className="text-lg font-semibold">{project.title}</h4>
                <p className="text-gray-500">
                  {formatDate(project.startDate)} -{" "}
                  {formatDate(project.endDate) || "Present"}
                </p>
                <p className="text-gray-600 mt-1">{project.description}</p>
              </div>
            ))
        ) : (
          <p className="text-gray-600">No project listed.</p>
        )}
      </div>

      {/* Education */}
      <hr className="my-8 border-gray-300" />
      <div className="mt-8 bg-gray-50 p-4 rounded-lg shadow">
        <h3 className="text-xl font-semibold text-gray-800">Education</h3>
        {user.education && user.education.length > 0 ? (
          user.education
            .sort((a, b) => new Date(b.startYear) - new Date(a.startYear))
            .map((edu, index) => (
              <div key={index} className="mt-4">
                <h4 className="text-lg font-semibold">{edu.instituteName}</h4>
                <p className="text-gray-500">
                  {edu.fieldOfStudy} ({edu.startYear} -{" "}
                  {edu.endYear || "Present"})
                </p>
              </div>
            ))
        ) : (
          <p className="text-gray-600">No education listed.</p>
        )}
      </div>

      {/* User's Posts Section */}
      {!error && (
        <>
          <hr className="my-8 border-gray-300" />
          <UsersPost username={username} />
        </>
      )}

    </div>
  );
};

export default ProfilePage;
