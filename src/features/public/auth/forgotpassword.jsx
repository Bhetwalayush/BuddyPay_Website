import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { default as logo } from "../../../assets/icons/logo.png";

const ForgotPassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleConfirmPasswordChange = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Check if new password and confirm password match
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match!");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token"); // Get token from localStorage

      // Send the request to change the password
      const response = await axios.post(
        "http://localhost:3000/api/user/forgot-password",
        { oldPassword, newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        // Navigate to login page after successful password change
        navigate("/login");
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetEmail = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Send a request to reset the password via email
      const response = await axios.post("http://localhost:3000/api/user/reset-password-email", {
        email,
      });

      if (response.data.success) {
        alert("Password reset link has been sent to your email.");
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send reset link.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full flex-col md:flex-row">
      {/* Left Side */}
      <div className="md:w-1/3 w-full bg-[#2e2a5a] text-white flex flex-col justify-center items-center p-10">
        <h1 className="text-3xl font-bold mb-6 text-center md:text-left leading-snug">
          Reset Your Password
        </h1>
        <img src={logo} alt="Wallet Icon" className="w-24 h-24" />
      </div>

      {/* Right Side */}
      <div className="w-2/3 flex bg-white p-10 rounded-lg shadow-md w-[1200px]">
        <div className="flex items-start mb-6">
             <img src={logo} alt="BuddyPay Logo" className="w-8 h-8 mr-2" />
          <h2 className="text-lg font-bold text-black">BuddyPay</h2>
        </div>

        <div className="bg-white p-10 rounded-lg shadow-lg w-full w-[600px] mt-6 relative">
          <h2 className="text-2xl font-semibold text-black text-start mb-12">
            Reset Password
          </h2>

          {/* Error Message */}
          {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

          {/* Old Password, New Password, Confirm Password Form */}
          <form className="flex flex-col" onSubmit={handleConfirmPasswordChange}>
            <input
              type="password"
              placeholder="Old Password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
            />
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg mb-8 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
            />
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold p-3 rounded-lg ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Confirming..." : "Confirm"}
            </button>
          </form>

          <div className="my-6 text-center">
            <span className="text-gray-600">OR</span>
          </div>

          {/* Reset via Email Form */}
          <form className="flex flex-col" onSubmit={handleResetEmail}>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
            />
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold p-3 rounded-lg ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
