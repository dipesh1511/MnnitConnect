
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa"; 

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({  fullName: "",  username: "",  email: "",  password: "",  confirmPassword: "",  dob: "",  verificationCode: "",  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [showVerificationInput, setShowVerificationInput] = useState(false);
  const [generatedCode, setGeneratedCode] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const newErrors = {};
    const { fullName, username, email, password, confirmPassword, dob } =
      formData;

    if (!fullName) newErrors.fullName = "Full Name is required";
    if (!username) newErrors.username = "Username is required";
    if (!email) newErrors.email = "Email is required";
    if (!password) newErrors.password = "Password is required";
    if (password !== confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    if (!dob || new Date().getFullYear() - new Date(dob).getFullYear() < 16) {
      newErrors.dob = "You must be at least 16 years old to create an account";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendCode = async () => {
    const { email } = formData;

    // Check if email ends with @mnnit.ac.in
    if (email.endsWith('@mnnit.ac.in')) {
      const code = Math.floor(1000 + Math.random() * 9000);
      setGeneratedCode(code);

      try {
        console.log('Sending verification code:', code);
        console.log('Email:', email);
        await axios.post('http://localhost:8000/send/verification-code', { email, code });
        setShowVerificationInput(true);
        setIsCodeSent(true);
        alert('Verification code sent to your email');
      } catch (error) {
        alert('Error sending verification code');
      }
    } else {
      setErrors({ email: 'Email must end with @mnnit.ac.in' });
    }
  };

  const handleVerifyCode = () => {
    if (formData.verificationCode === String(generatedCode)) {
      setIsVerified(true);
      alert("Email successfully verified");
    } 
    else {
      alert("Incorrect verification code");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      if (!isVerified) 
        {
        alert("Please verify your email before signing up");
        return;
      }
      const { fullName, dob, email, username, password } = formData;
      const userData = {  name: fullName,  dob,  email,  username,  password,  };

      try 
      {
        const response = await axios.post("http://localhost:8000/api/user/signup", userData);
        if (response.data.success) {
          navigate("/login");
        } else {
          setErrors({ general: response.data.message || "Signup failed" });
        }
      } catch (error) {
        setErrors({ general: "An error occurred. Please try again." });
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800">   Create an Account </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">  Full Name</label>
            <input  type="text"  name="fullName"  value={formData.fullName}  onChange={handleChange}  className={`w-full px-4 py-2 mt-1 bg-gray-100 border ${    errors.fullName ? "border-red-500" : "border-gray-300"  } rounded-md focus:ring-2 focus:ring-blue-500`}  placeholder="Enter your full name"/>
            {errors.fullName && (  <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>   )}
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700">    Username  </label>
            <input  type="text"  name="username"  value={formData.username}  onChange={handleChange}  className={`w-full px-4 py-2 mt-1 bg-gray-100 border ${    errors.username ? "border-red-500" : "border-gray-300"  } rounded-md focus:ring-2 focus:ring-blue-500`}  placeholder="Enter a username"/>
            {errors.username && (    <p className="mt-1 text-sm text-red-500">{errors.username}</p>  )}
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-sm font-medium text-gray-700">  Date of Birth  </label>
            <input  type="date"  name="dob"  value={formData.dob}  onChange={handleChange}  className={`w-full px-4 py-2 mt-1 bg-gray-100 border ${    errors.dob ? "border-red-500" : "border-gray-300"  } rounded-md focus:ring-2 focus:ring-blue-500`}  />
            {errors.dob && (  <p className="mt-1 text-sm text-red-500">{errors.dob}</p>  )}
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">  Email <span className="text-red-500 ml-1">*</span></label>
            <input  type="email"  name="email"  value={formData.email}  onChange={handleChange}  className={`w-full px-4 py-2 mt-1 bg-gray-100 border ${    errors.email ? "border-red-500" : "border-gray-300"  } rounded-md focus:ring-2 focus:ring-blue-500`}  placeholder="Enter your email"/>
            {errors.email && (  <p className="mt-1 text-sm text-red-500">{errors.email}</p>)}

            {!isVerified && !isCodeSent && (
              <button  type="button"  onClick={handleSendCode}  className="w-full px-4 py-2 mt-2 text-white bg-blue-500 rounded-md hover:bg-blue-600">  Send Verification Code</button>
            )}
          </div>

          {/* Verification Code */}
          {showVerificationInput && (
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-1">  Verification Code</label>
              <input  type="text"  name="verificationCode"  value={formData.verificationCode}  onChange={handleChange}  className="w-full px-4 py-2 mt-1 bg-gray-100 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"  placeholder="Enter the verification code"/>
              <button  type="button"  onClick={handleVerifyCode}  className="w-full px-4 py-2 mt-2 text-white bg-blue-500 rounded-md hover:bg-blue-600">  Verify Code</button>
            </div>
          )}

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <input  type={showPassword ? "text" : "password"}  name="password"  value={formData.password}  onChange={handleChange}  className={`w-full px-4 py-2 mt-1 bg-gray-100 border ${    errors.password ? "border-red-500" : "border-gray-300"  } rounded-md focus:ring-2 focus:ring-blue-500`}  placeholder="Enter your password"/>
              <button  type="button"  onClick={() => setShowPassword(!showPassword)}  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">  {showPassword ? <FaEyeSlash /> : <FaEye />}</button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700">   Confirm Password </label>
            <div className="relative">
              <input  type={showConfirmPassword ? "text" : "password"}  name="confirmPassword"  value={formData.confirmPassword}  onChange={handleChange}  className={`w-full px-4 py-2 mt-1 bg-gray-100 border ${    errors.confirmPassword ? "border-red-500" : "border-gray-300"  } rounded-md focus:ring-2 focus:ring-blue-500`}  placeholder="Confirm your password"/>
              <button  type="button"  onClick={() => setShowConfirmPassword(!showConfirmPassword)}  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}  </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-500">  {errors.confirmPassword}   </p>
            )}
          </div>

          {/* Submit Button */}
          <button  type="submit"  className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
          >   Sign Up </button> 
          {errors.general && (  <p className="mt-2 text-sm text-red-500">{errors.general}</p>  )}
        </form>
      </div>
    </div>
  );
};

export default Signup;
