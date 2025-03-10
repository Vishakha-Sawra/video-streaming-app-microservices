import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const SearchResults = () => {
  const [videos, setVideos] = useState([]);
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("query");

  useEffect(() => {
    fetch(`http://localhost:8000/search?q=${query}`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => setVideos(data))
      .catch(error => console.error("Error fetching videos:", error));
  }, [query]);

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold text-white mb-4">Search Results for "{query}"</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {videos.map((video) => (
          <div key={video._id} className="p-4 rounded-lg"> 
            <Link to={`/video/${video.filename}`}>
              <video
                src={`http://localhost:4000/videos/${video.filename}#t=1`}
                className="w-full h-50 object-cover rounded-lg"
                controls
              />
            </Link>
            <p className="text-white mt-2">{video.username}</p>
            <p className="text-white mt-2">{video.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchResults;