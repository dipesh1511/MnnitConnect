import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaUserCircle,
  FaClipboardList,
  FaPlusSquare,
  FaSignOutAlt,
  FaSignInAlt,
  FaBars,
  FaTimes,
  FaEdit,
} from "react-icons/fa";
import axiosInstance from "../../../config/axios.js";
import logo from "../../assests/logo.png";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error("Error checking login status:", error);
      }
    };
    checkLoginStatus();
  }, []);

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/company/logout");
      localStorage.removeItem("token");
      setIsLoggedIn(false);
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <nav className="shadow-lg bg-white">
      <div className="container mx-auto flex items-center justify-between p-4">
        {/* Logo Section */}
        <Link to="/company/profile" className="flex items-center">
          <img src={logo} alt="Company Logo" className="w-25 h-12 " />
          <span className="text-xl font-semibold text-gray-800"></span>
        </Link>

        {/* Menu Icon (only visible on small screens) */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="text-gray-800 text-2xl md:hidden"
        >
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Navigation Links */}
        <div
          className={`${
            isMenuOpen ? "flex flex-col" : "hidden"
          } md:flex flex-col md:flex-row items-center md:space-x-8 absolute md:relative top-16 md:top-auto left-0 md:left-auto w-full md:w-auto bg-white md:bg-transparent z-10 shadow-lg md:shadow-none border-t md:border-0`}
        >
          <Link
            to="/company/showjobs"
            className="flex items-center justify-center space-x-2 text-gray-800 hover:text-blue-600 py-3 md:py-0 border-b md:border-0 w-full md:w-auto"
            onClick={() => setIsMenuOpen(false)}
          >
            <FaClipboardList />
            <span>Show All Jobs</span>
          </Link>
          <Link
            to="/company/postjob"
            className="flex items-center justify-center space-x-2 text-gray-800 hover:text-blue-600 py-3 md:py-0 border-b md:border-0 w-full md:w-auto"
            onClick={() => setIsMenuOpen(false)}
          >
            <FaPlusSquare />
            <span>Post Job</span>
          </Link>
          <Link
            to="/company/updateprofile"
            className="flex items-center justify-center space-x-2 text-gray-800 hover:text-blue-600 py-3 md:py-0 border-b md:border-0 w-full md:w-auto"
            onClick={() => setIsMenuOpen(false)}
          >
            <FaEdit />
            <span>Update Profile</span>
          </Link>

          <Link
            to="/company/profile"
            className="flex items-center justify-center space-x-2 text-gray-800 hover:text-blue-600 py-3 md:py-0 border-b md:border-0 w-full md:w-auto"
            onClick={() => setIsMenuOpen(false)}
          >
            <FaUserCircle />
            <span>Profile</span>
          </Link>

          {isLoggedIn ? (
            <button
              onClick={() => {
                handleLogout();
                setIsMenuOpen(false);
              }}
              className="flex items-center justify-center space-x-2 text-gray-800 hover:text-blue-600 py-3 md:py-0 w-full md:w-auto"
            >
              <FaSignOutAlt />
              <span>Logout</span>
            </button>
          ) : (
            <Link
              to="/company/login"
              className="flex items-center justify-center space-x-2 text-gray-800 hover:text-blue-600 py-3 md:py-0 w-full md:w-auto"
              onClick={() => setIsMenuOpen(false)}
            >
              <FaSignInAlt />
              <span>Login</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
