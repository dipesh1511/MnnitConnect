import React from "react";
import { Route, Routes, useLocation, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

// Navigation components
import NavBar from "./components/navBar";
import CompanyNavbar from "./components/company/companyNavBar";

// User pages
import Home from "./pages/home";
import Signup from "./pages/signup";
import Login from "./pages/login";
import Messages from "./pages/messages";
import Profile from "./pages/profile";
import Jobs from "./pages/jobs";
import Connections from "./pages/connections";
import Notifications from "./pages/notifications";
import UpdateProfile from "./pages/updateprofile";
import JobDetailsPage from "./pages/showjob";
import CreatePostPage from "./pages/createpost";



// Company pages
import CompanyHome from "./pages/company/home";
import CompanyJobs from "./pages/company/showjob";
import CompanyPostJob from "./pages/company/postjob";
import CompanyLogin from "./pages/company/login";
import CompanyRegistration from "./pages/company/registercompany";
import UpdateCompanyDetails from "./pages/company/updateprofile";
import CompanyProfile from "./pages/company/profile";
import CompanyJobDetailsPage from "./pages/company/JobDetails";
import SearchBar from "./components/searchbar";

// Page Not Found
import NotFound from "./pages/notFound"; // You can create a simple 404 component
import JobsApplied from "./pages/jobsapplied";
import Chatbot from "./components/chatbot";

const App = () => {
  const location = useLocation();
  const { user } = useSelector((state) => state.auth); // Get user from Redux state

  // Check if the user is an authenticated company user
 
  const isUserCompany = user?.role === "user"; // Assuming role is set in user object
 const isCompanyRoute = location.pathname.startsWith("/company");
  const companyRoutes = [
    "/company/home",
    "/company/showjobs",
    "/company/postjob",
    "/company/updateprofile",
    "/company/login",
    "/company/signup",
    "/company/profile",
    "/company/:jobId",
  ];

  return (
    <>
      {/* Display appropriate NavBar based on route */}

      {isCompanyRoute ? <CompanyNavbar /> : <NavBar />}

      <Routes>
        {/* Public Routes (Available to all users) */}
        <Route path="/explore/:username" element={<Profile />} />
        {!user ? (
          <>
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
          </>
        ) : (
          <>
            <Route path="/signup" element={<Navigate to="/home" replace />} />
            <Route path="/login" element={<Navigate to="/home" replace />} />
          </>
        )}

        {/* Protected Routes */}
        {/* Redirect unauthenticated users to login */}
        <Route
          path="/home"
          element={user ? <Home /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/"
          element={user ? <Home /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/messages"
          element={user ? <Messages /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/notifications"
          element={user ? <Notifications /> : <Navigate to="/login" replace />}
        />

        <Route
          path="/jobs"
          element={user ? <Jobs /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/updateprofile"
          element={user ? <UpdateProfile /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/jobsapplied"
          element={user ? <JobsApplied /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/search"
          element={user ? <SearchBar /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/connections"
          element={user ? <Connections /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/showjob/:jobId"
          element={user ? <JobDetailsPage /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/createpost"
          element={user ? <CreatePostPage /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/chat"
          element={user ? <Chatbot /> : <Navigate to="/login" replace />}
        />

        {/* Restrict company routes based on user role */}
        {user?.role !== "user" ? (
          <>
            <Route path="/company/home" element={<CompanyHome />} />
            <Route path="/company/showjobs" element={<CompanyJobs />} />
            <Route path="/company/postjob" element={<CompanyPostJob />} />
            <Route path="/company/login" element={<CompanyLogin />} />
            <Route path="/company/signup" element={<CompanyRegistration />} />
            <Route
              path="/company/updateprofile"
              element={<UpdateCompanyDetails />}
            />
            <Route path="/company/profile" element={<CompanyProfile />} />
            <Route path="/company/:jobId" element={<CompanyJobDetailsPage />} />
          </>
        ) : (
          <Route path="/company/*" element={<Navigate to="/home" replace />} />
        )}

        {/* 404 Page for non-existent routes */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default App;
