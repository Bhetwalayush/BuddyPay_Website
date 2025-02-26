import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { default as logo, default as walletIcon } from '../../../assets/icons/logo.png';

const Signup = () => {
  const [formData, setFormData] = useState({
    fullname: '',
    phone: '',
    password: '',
    confirmPassword: '',
    pin: '',
    device: 'Web', 
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match!');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/user/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullname: formData.fullname,
          phone: formData.phone,
          password: formData.password,
          pin: formData.pin,
          device: formData.device,
        }),
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message);
      }

      setSuccess('Signup successful! Redirecting...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.message || 'Signup failed. Please try again.');
    }
  };

  return (
    <div className="flex h-screen w-full flex-col md:flex-row">
      <div className="md:w-1/3 w-full bg-[#2e2a5a] text-white flex flex-col justify-center items-center p-10">
        <h1 className="text-3xl font-bold mb-6 text-center md:text-left leading-snug">
          All Your Finances <br /> Inside a Fancy App
        </h1>
        <img src={walletIcon} alt="Wallet Icon" className="w-24 h-24" />
      </div>

      <div className="w-2/3 flex bg-white p-10 rounded-lg shadow-md w-[1200px]">
        <div className="flex items-start mb-6">
          <img src={logo} alt="BuddyPay Logo" className="w-8 h-8 mr-2" />
          <h2 className="text-lg font-bold text-black">BuddyPay</h2>
        </div>

        <div className="bg-white p-10 rounded-lg shadow-lg w-full w-[600px] mt-6 relative">
          <h2 className="text-2xl font-semibold text-black text-start mb-12">
            Join the world of digital money
          </h2>

          {error && <p className="text-red-500 text-center">{error}</p>}
          {success && <p className="text-green-500 text-center">{success}</p>}

          <form className="flex flex-col" onSubmit={handleSubmit}>
            <input
              type="text"
              name="fullname"
              placeholder="Full Name"
              className="w-full p-3 border border-gray-300 rounded-lg mb-4 text-black"
              onChange={handleChange}
              required
            />
            <input
              type="number"
              name="phone"
              placeholder="Phone Number"
              className="w-full p-3 border border-gray-300 rounded-lg mb-4 text-black"
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="email"
              placeholder="E-mail (Optional)"
              className="w-full p-3 border border-gray-300 rounded-lg mb-4 text-black"
              onChange={handleChange}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="w-full p-3 border border-gray-300 rounded-lg mb-4 text-black"
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              className="w-full p-3 border border-gray-300 rounded-lg mb-4 text-black"
              onChange={handleChange}
              required
            />
            <input
              type="number"
              name="pin"
              placeholder="Pin"
              className="w-full p-3 border border-gray-300 rounded-lg mb-4 text-black"
              onChange={handleChange}
              required
            />
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold p-3 rounded-lg"
            >
              Join
            </button>
          </form>

          <p className="text-sm text-center text-gray-600 mt-4">
            Already in BuddyPay?{' '}
            <a href="/login" className="text-indigo-600 font-semibold">
              Login Here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
