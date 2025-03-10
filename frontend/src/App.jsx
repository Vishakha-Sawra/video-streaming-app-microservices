import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";  // Import Navbar
import VideoList from "./components/VideoList";
import VideoPlayer from "./components/VideoPlayer";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import UploadForm from "./components/UploadForm";
import VideoDetail from "./components/VideoDetail";
import SearchResults from "./components/SearchResults";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const username = localStorage.getItem("username");
  const profilePicture = localStorage.getItem("profilePicture") || "https://via.placeholder.com/40"; // Default image

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:8080/logout", {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      localStorage.removeItem("token");
      localStorage.removeItem("username");
      localStorage.removeItem("profilePicture");
      setIsAuthenticated(false);
      window.location.reload();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    // Check authentication status
    const checkAuthStatus = async () => {
      try {
        const response = await fetch("http://localhost:8080/check-auth", {
          method: "GET",
          credentials: "include",
        });
        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        setIsAuthenticated(false);
      }
    };

    checkAuthStatus();
  }, []);

  useEffect(() => {
    // Refresh token periodically
    const interval = setInterval(async () => {
      try {
        const response = await fetch("http://localhost:8080/refresh-token", {
          method: "POST",
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          console.log("Token refreshed:", data.accessToken);
        } else {
          console.error("Failed to refresh token");
        }
      } catch (error) {
        console.error("Error refreshing token:", error);
      }
    }, 14 * 60 * 1000); // Refresh token every 14 minutes

    return () => clearInterval(interval);
  }, []);

  return (
    <Router>
      <div className="min-h-screen min-w-full bg-[#151515] text-white">
        {/* Navbar Component */}
        <Navbar
          isAuthenticated={isAuthenticated}
          profilePicture={profilePicture}
          username={username}
          handleLogout={handleLogout}
        />

        {/* Main Content */}
        <div className="container mx-auto p-6">
          <Routes>
            <Route path="/" element={<VideoList />} />
            <Route path="/videos" element={<VideoList />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/player/:serviceIp/:servicePort/:video" element={<VideoPlayer />} />
            <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <LoginForm setIsAuthenticated={setIsAuthenticated} />} />
            <Route path="/register" element={isAuthenticated ? <Navigate to="/" /> : <RegisterForm />} />
            <Route path="/upload" element={isAuthenticated ? <UploadForm /> : <Navigate to="/login" />} />
            <Route path="/video/:videoName" element={<VideoDetail />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
