import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const RegisterForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("http://localhost:8080/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Registration failed");

      setMessage("✅ Registration successful! Redirecting...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (error) {
      setMessage(`❌ ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-[#2c2c2c] text-white rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold text-center mb-6">Create an Account</h2>

      <form onSubmit={handleRegister} className="space-y-4">
        <div>
          <label className="block text-gray-400 text-sm mb-1">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 rounded-md bg-gray-700 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-300 text-white"
            placeholder="Choose a username"
            required
          />
        </div>

        <div>
          <label className="block text-gray-400 text-sm mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded-md bg-gray-700 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-300 text-white"
            placeholder="Create a strong password"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-md font-bold transition ${
            loading
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-[#59adb5] hover:bg-[#67c2cb]"
          } text-white`}
        >
          {loading ? "Registering..." : "Sign Up"}
        </button>
      </form>

      {message && <p className="mt-4 text-center text-[#59adb5]">{message}</p>}
    </div>
  );
};

export default RegisterForm;
