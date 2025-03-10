import React from "react";
import { useParams } from "react-router-dom";

const VideoPlayer = () => {
  const { serviceIp, servicePort, video } = useParams();

  if (!serviceIp || !servicePort || !video) {
    return <p className="text-red-500 text-center">❌ Select a streaming service and a video to watch.</p>;
  }

  const videoUrl = `http://${serviceIp}:${servicePort}/video/${video}`;

  return (
    <div className="flex flex-col items-center p-6">
      <h2 className="text-2xl font-bold text-white mb-4">Now Playing</h2>
      <video controls width="800" className="rounded-lg shadow-lg">
        <source src={videoUrl} type="video/mp4" />
        Your browser does not support video playback.
      </video>
    </div>
  );
};

export default VideoPlayer;
