import React, { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import Logo from "./logo.jsx";
import SearchBar from "./searchbar.jsx";
import NavLinks from "./navlink.jsx";
import MobileMenu from "./mobilemenu.jsx";
import axiosInstance from "../../config/axios.js";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearUser } from "../slices/authSlice.js";


const NavBar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate(); // Initialize the navigate function

  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/user/logout");
      dispatch(clearUser());
      
      console.log("User logged out successfully.");
      
      navigate("/login");
    } catch (error) {
      console.log("Logout error:", error);
    }
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4 py-2 flex justify-between items-center">
        <Logo />
        <SearchBar />

        {/* Links for Desktop */}
        <div className="hidden md:flex space-x-6 items-center">  <NavLinks handleLogout={handleLogout} />   </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? (   <FaTimes className="text-2xl text-gray-600" />  ) : (  <FaBars className="text-2xl text-gray-600" />  )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && <MobileMenu handleLogout={handleLogout} />}
    </nav>
  );
};

export default NavBar;
