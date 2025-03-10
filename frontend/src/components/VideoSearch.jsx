import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const VideoSearch = () => {
  const [searchQuery, setSearchQuery] = useState(localStorage.getItem("searchQuery") || "");
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem("searchQuery", searchQuery);
  }, [searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/search?query=${searchQuery}`);
  };

  const clearSearch = () => {
    setSearchQuery("");
    localStorage.removeItem("searchQuery");
  };

  return (
    <form onSubmit={handleSearch} className="relative flex items-center">
      <div className="relative w-full">
        <input
          type="text"
          placeholder="Search videos..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-[600px] p-2 rounded-full bg-transparent border border-gray-700 hover:border-gray-400 text-white"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-300 hover:text-white cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>
    </form>
  );
};

export default VideoSearch;
