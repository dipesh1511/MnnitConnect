import React from "react";
import { Link } from "react-router-dom";
import logo from "../assests/logo.jpeg";

const Logo = () => (
  <Link to="/home" className="flex items-center space-x-2">
    <img src={logo} alt="Logo" className="w-20 h-16" />
  
  </Link>
);

export default Logo;
