import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  FaHome,
  FaUsers,
  FaBriefcase,
  FaUserCircle,
  FaEdit,
  FaSignOutAlt,
  FaSignInAlt,
  FaPlusCircle,
  FaClipboardList,
  FaEnvelope,
  FaRobot,
} from "react-icons/fa";

const NavLinks = ({ handleLogout }) => {
  const user = useSelector((state) => state.auth.user);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className="flex items-center space-x-6">
      {user && (
        <NavLink
          to="/home"
          className={({ isActive }) =>
            isActive
              ? "text-blue-600 font-medium flex items-center space-x-2"
              : "text-gray-600 hover:text-blue-500 flex items-center space-x-2 transition duration-200 ease-in-out"
          }
        >
          <FaHome className="text-xl" />
          <span>Home</span>
        </NavLink>
      )}

      {user && (
        <>
          <NavLink
            to="/connections"
            className={({ isActive }) =>
              isActive
                ? "text-blue-600 font-medium flex items-center space-x-2"
                : "text-gray-600 hover:text-blue-500 flex items-center space-x-2 transition duration-200 ease-in-out"
            }
          >
            <FaUsers className="text-xl" />
            <span>Connections</span>
          </NavLink>
          <NavLink
            to="/jobs"
            className={({ isActive }) =>
              isActive
                ? "text-blue-600 font-medium flex items-center space-x-2"
                : "text-gray-600 hover:text-blue-500 flex items-center space-x-2 transition duration-200 ease-in-out"
            }
          >
            <FaBriefcase className="text-xl" />
            <span>Jobs</span>
          </NavLink>
          <NavLink
            to="/messages"
            className={({ isActive }) =>
              isActive
                ? "text-blue-600 font-medium flex items-center space-x-2"
                : "text-gray-600 hover:text-blue-500 flex items-center space-x-2 transition duration-200 ease-in-out"
            }
          >
            <FaEnvelope className="text-xl" />
            <span>Messages</span>
          </NavLink>
          <NavLink
            to="/chat"
            className={({ isActive }) =>
              isActive
                ? "text-blue-600 font-medium flex items-center space-x-2"
                : "text-gray-600 hover:text-blue-500 flex items-center space-x-2 transition duration-200 ease-in-out"
            }
          >
            <FaRobot className="text-xl" />
            <span>Bot</span>
          </NavLink>
        </>
      )}

      <div className="relative">
        <FaUserCircle
          className="text-gray-600 hover:text-blue-500 cursor-pointer text-2xl transition duration-200 ease-in-out"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        />
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
            {user ? (
              <>
                <NavLink
                  to={`/explore/${user.username}`}
                  className="block px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-blue-500 transition duration-200 ease-in-out"
                  onClick={() => setDropdownOpen(false)}
                >
                  <FaUserCircle className="inline mr-2 text-xl" /> {user.name}
                </NavLink>
                <NavLink
                  to="/updateprofile"
                  className="block px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-blue-500 transition duration-200 ease-in-out"
                  onClick={() => setDropdownOpen(false)}
                >
                  <FaEdit className="inline mr-2 text-xl" /> Edit Profile
                </NavLink>
                <NavLink
                  to="/jobsapplied"
                  className="block px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-blue-500 transition duration-200 ease-in-out"
                  onClick={() => setDropdownOpen(false)}
                >
                  <FaClipboardList className="inline mr-2 text-xl" /> Jobs
                  Applied
                </NavLink>
                <NavLink
                  to="/createpost"
                  className="block px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-blue-500 transition duration-200 ease-in-out"
                  onClick={() => setDropdownOpen(false)}
                >
                  <FaPlusCircle className="inline mr-2 text-xl" /> Create Post
                </NavLink>
                <button
                  onClick={() => {
                    handleLogout();
                    setDropdownOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-blue-500 transition duration-200 ease-in-out"
                >
                  <FaSignOutAlt className="inline mr-2 text-xl" /> Logout
                </button>
              </>
            ) : (
              <NavLink
                to="/login"
                className="block px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-blue-500 transition duration-200 ease-in-out"
                onClick={() => setDropdownOpen(false)}
              >
                <FaSignInAlt className="inline mr-2 text-xl" /> Login
              </NavLink>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NavLinks;
