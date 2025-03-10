import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useNavigate } from "react-router-dom";
import customFetch from "../utils/customFetch";

const UploadForm = () => {
  const [file, setFile] = useState(null);
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    maxSize: 1024 * 1024 * 1024, // 1GB limit
    accept: {
      "video/mp4": [".mp4"],
      "video/webm": [".webm"],
      "video/ogg": [".ogg"],
    },
  });

  const handleUpload = async (event) => {
    event.preventDefault();

    if (!file) {
      setMessage("❌ No file selected for upload.");
      return;
    }

    const formData = new FormData();
    formData.append("video", file);
    formData.append("name", name);
    formData.append("title", title);
    formData.append("description", description);

    try {
      const response = await customFetch("http://localhost:6969/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Upload failed");
      }

      const data = await response.json();
      setMessage("✅ Upload successful! Redirecting...");
      setTimeout(() => {
        navigate(`/video/${data.video.filename}`); // Redirect to the uploaded video's detail page
      }, 2000); // Redirect after 2 seconds
    } catch (error) {
      console.error("❌ Upload error:", error);
      setMessage(`❌ ${error.message}`);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-[#2c2c2c] rounded-lg shadow-md text-white">
      <h2 className="text-2xl font-bold text-center mb-4">Upload Video</h2>

      {/* Drag & Drop Area */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed p-6 text-center rounded-lg cursor-pointer transition-all ${
          file ? "bg-green-700 border-green-500" : "bg-gray-700 border-gray-500"
        } hover:bg-gray-600`}
      >
        <input {...getInputProps()} />
        {file ? (
          <p className="text-green-300 font-semibold">✅ {file.name} selected</p>
        ) : isDragActive ? (
          <p className="text-blue-300">Drop the file here...</p>
        ) : (
          <p className="text-gray-300">Drag & Drop a video file here</p>
        )}
      </div>

      <div className="text-center my-3 text-gray-400">OR</div>

      {/* File Picker Button */}
      <div className="text-center">
        <button
          onClick={() => document.getElementById("fileInput").click()}
          className="bg-[#59adb5] hover:bg-[#67c2cb] text-white px-4 py-2 rounded-lg"
        >
          Choose a video file
        </button>
        <input
          id="fileInput"
          type="file"
          accept="video/*"
          onChange={(e) => setFile(e.target.files[0])}
          className="hidden"
        />
        {file ? (
          <p className="mt-2 text-green-300 font-semibold">Selected: {file.name}</p>
        ) : (
          <p className="mt-2 text-gray-400">No file chosen yet</p>
        )}
      </div>

      {/* Input Fields */}
      <div className="mt-4 space-y-3">
        <input
          type="text"
          placeholder="Video Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
        />
        <input
          type="text"
          placeholder="Video Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
        />
        <textarea
          placeholder="Video Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white h-24"
        />
      </div>

      {/* Upload Button */}
      <button
        onClick={handleUpload}
        disabled={!file}
        className={`w-full mt-4 p-2 rounded-lg font-semibold ${
          file
            ? "bg-green-600 hover:bg-green-700 text-white cursor-pointer"
            : "bg-gray-600 text-gray-400 cursor-not-allowed"
        }`}
      >
        Upload
      </button>

      {/* Upload Progress (Future Implementation) */}
      {progress > 0 && (
        <div className="mt-3 bg-gray-600 rounded-lg overflow-hidden">
          <div
            style={{ width: `${progress}%` }}
            className="bg-blue-500 text-xs text-center text-white py-1"
          >
            {progress}%
          </div>
        </div>
      )}

      {/* Upload Message */}
      {message && (
        <p
          className={`mt-3 text-center font-semibold ${
            message.includes("❌") ? "text-red-400" : "text-green-400"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default UploadForm;