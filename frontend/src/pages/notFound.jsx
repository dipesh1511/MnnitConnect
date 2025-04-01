// src/pages/NotFound.js
import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => (
  <div className="text-center mt-20">
    <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
    <p className="mb-6">The page you're looking for doesn't exist.</p>
    <Link to="/home" className="text-blue-500 hover:underline">
      Go back to Home
    </Link>
  </div>
);

export default NotFound;
