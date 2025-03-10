import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

const VideoDetail = () => {
  const { videoName } = useParams();
  const [video, setVideo] = useState(null);
  const [userVideos, setUserVideos] = useState([]);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    // Fetch the selected video details
    fetch(`http://localhost:4000/videos/${videoName}/details`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => setVideo(data))
      .catch((error) => console.error("Error fetching video details:", error));
  }, [videoName]);

  useEffect(() => {
    if (video) {
      // Fetch other videos from the same user
      fetch(`http://localhost:4000/user-videos?username=${video.username}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => setUserVideos(data))
        .catch((error) => console.error("Error fetching user videos:", error));
    }
  }, [video]);

  useEffect(() => {
    // Fetch comments for the video
    fetch(`http://localhost:5050/comments/${videoName}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => setComments(data))
      .catch((error) => console.error("Error fetching comments:", error));
  }, [videoName]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    const commentData = {
      videoName,
      username: localStorage.getItem("username"),
      comment: newComment,
    };

    try {
      const response = await fetch("http://localhost:5050/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(commentData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error adding comment");
      }

      setNewComment("");
      setComments((prevComments) => [...prevComments, commentData]);
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  if (!video) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-6">
      <div className="flex">
        <div className="flex-1">
          <video
            src={`http://localhost:4000/videos/${video.filename}`}
            className="w-full h-96 object-cover rounded-lg"
            controls
          />

          <h1 className="text-white mt-2">{video.title}</h1>
          <p className="text-gray-400">{video.description}</p>

          {/* Comments Section */}
          <div className="mt-4">
            <h2 className="text-white font-bold mb-2">Comments</h2>
            <ul>
              {comments.map((comment, index) => (
                <li key={index} className="mb-2">
                  <p className="text-gray-100">
                    <strong className="text-[#FF6363]">{comment.username}:</strong> {comment.comment}
                  </p>
                </li>
              ))}
            </ul>
            <form onSubmit={handleCommentSubmit}>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="w-full p-2 border border-gray-300 rounded-md text-gray-300"
              />
              <button
                type="submit"
                className="mt-2 py-2 px-4 bg-[#59adb5] hover:bg-[#62bac2] hover:cursor-pointer text-white rounded-md"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
        <div className="w-1/4 ml-4 border- min-h-min p-4 rounded">
          <h2 className="text-white font-bold mb-2">
            More from {video.username}
          </h2>
          <ul>
            {userVideos.map((userVideo) => (
              <li key={userVideo.filename} className="mb-2">
                <Link
                  to={`/video/${userVideo.filename}`}
                  className="text-blue-400 hover:underline"
                >
                  <div className="flex items-center">
                    <div className="ml-2">
                      <video
                        src={`http://localhost:4000/videos/${userVideo.filename}`}
                        className="w-full h-30 object-cover rounded-lg"
                        controls
                      />
                      <p className="text-gray-400">{userVideo.username}</p>
                      <p className="text-white">{userVideo.title}</p>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default VideoDetail;