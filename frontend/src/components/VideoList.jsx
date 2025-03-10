import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const VideoList = () => {
  const [videos, setVideos] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("newest"); // Default: Newest first

  useEffect(() => {
    fetch(`http://localhost:4000/videos?search=${searchQuery}&sort=${sortOrder}`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => setVideos(data))
      .catch(error => console.error("Error fetching videos:", error));
  }, [searchQuery, sortOrder]); // Fetch updates on search or sort change

  return (
    <div className="container mx-auto p-6">
      {/* Video Grid */}
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
            <p className="text-white mt-2">{video.title}</p>
            <p className="text-white mt-2">{video.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoList;