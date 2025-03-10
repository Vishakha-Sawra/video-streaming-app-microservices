import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import VideoSearch from "./VideoSearch";

const Navbar = ({ isAuthenticated, profilePicture, username, handleLogout }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }

    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  return (
    <nav className="shadow-lg px-4 py-1">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">
          <Link to="/">
            <img src="/usLogo.png" alt="US Logo" className="w-14 h-14" />
          </Link>
        </h1>

        <VideoSearch />

        <ul className="flex space-x-4 items-center">
          {isAuthenticated && (
            <li>
              <Link to="/upload" className="hover:text-[#59adb5]">Upload</Link>
            </li>
          )}

          {isAuthenticated ? (
            <li className="relative" ref={dropdownRef}>
              {/* Profile Picture (Click to Toggle Dropdown) */}
              <button
                className="flex items-center focus:outline-none"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <img src={profilePicture} alt="Profile" className="w-10 h-10 rounded-full border border-white" />
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-50 bg-[#222222] rounded-lg shadow-lg py-2">
                  <p className="px-4 py-2 text-white">Username: {username}</p>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-red-400 hover:bg-gray-700"
                  >
                    Logout
                  </button>
                </div>
              )}
            </li>
          ) : (
            <>
              <li><Link to="/login" className="hover:text-[#59adb5]">Login</Link></li>
              <li><Link to="/register" className="hover:text-[#59adb5]">Register</Link></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
