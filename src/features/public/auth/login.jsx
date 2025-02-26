import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { default as logo, default as walletIcon } from "../../../assets/icons/logo.png";

const Login = () => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // For navigation after login

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post("http://localhost:3000/api/user/login", {
        phone,
        password,
      });

      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("id", response.data.userData.id);
        localStorage.setItem("fullname", response.data.userData.fullname);
        localStorage.setItem("balance", response.data.userData.balance);
        localStorage.setItem("isAdmin", response.data.userData.isAdmin); 

        // Redirect based on isAdmin value
        if (response.data.userData.isAdmin) {
          navigate("/admindashboard");
        } else {
          navigate("/homepage");
        }
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full flex-col md:flex-row">
      {/* Left Side */}
      <div className="md:w-1/3 w-full bg-[#2e2a5a] text-white flex flex-col justify-center items-center p-10">
        <h1 className="text-3xl font-bold mb-6 text-center md:text-left leading-snug">
          All Your Finances <br /> Inside a Fancy App
        </h1>
        <img src={walletIcon} alt="Wallet Icon" className="w-24 h-24" />
      </div>

      {/* Right Side */}
      <div className="w-2/3 flex bg-white p-10 rounded-lg shadow-md w-[1200px]">
        <div className="flex items-start mb-6">
          <img src={logo} alt="BuddyPay Logo" className="w-8 h-8 mr-2" />
          <h2 className="text-lg font-bold text-black">BuddyPay</h2>
        </div>

        <div className="bg-white p-10 rounded-lg shadow-lg w-full w-[600px] mt-6 relative">
          <h2 className="text-2xl font-semibold text-black text-start mb-12">
            Login to BuddyPay
          </h2>

          {/* Error Message */}
          {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

          {/* Login Form */}
          <form className="flex flex-col" onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg mb-8 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
            />
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold p-3 rounded-lg ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
          <p className="text-sm text-center text-gray-600 mt-4">
            {" "}
            <a href="/forgotpassword" className="text-indigo-600 font-semibold">
              Forgot Password?
            </a>
          </p>
          <p className="text-sm text-center text-gray-600 mt-4">
            Haven't created an account?{" "}
            <a href="/signup" className="text-indigo-600 font-semibold">
              Signup Here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
