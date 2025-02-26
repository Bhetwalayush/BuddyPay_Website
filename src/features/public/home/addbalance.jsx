import axios from "axios";
import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import logo from '../../../assets/icons/logo.png';

const AddBalance = () => {
    const { state } = useLocation(); // Access the state passed from the previous page
  const userId = state?.userId; // Retrieve userId from state

  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleRecharge = async () => {
    try {
      const response = await axios.post("http://localhost:3000/api/recharge/validate", {
        code,
        userId
      });
  
      console.log(response); // Log the full response for debugging
  
      if (response.data.message === "Recharge code validated and balance updated successfully.") {
        // localStorage.setItem("balance", response.data.newBalance);
  
        // Ensure userId is sent correctly
        const statementPayload = {
          amount: response.data.amount, // Ensure this value exists
          statement: "Balance Recharge",
          to: "Self Recharge", 
          userId: userId // Ensure this is passed correctly
        };
        console.log("Sending Statement Payload:", statementPayload);
  
        const statementResponse = await axios.post("http://localhost:3000/api/statements/createStatement", statementPayload);
  
        console.log("Statement Response:", statementResponse.data);
  
        if (statementResponse.data.success) {
          setMessage(<span className="text-green-500">Balance updated and statement recorded successfully!</span>);
        } else {
          setMessage("Balance updated, but statement could not be recorded.");
        }
  
        setTimeout(() => navigate("/homepage"), 2000);
      } else {
        setMessage("Invalid or expired code. Please try again.");
      }
    } catch (error) {
      setMessage("An error occurred. Please try again later.");
      console.error(error); // Log the error for more details
    }
  };

  return (
    <div className="flex h-screen w-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <aside className="w-1/5 bg-gray-800 p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center mb-8">
                      <img src={logo} alt="BuddyPay Logo" className="w-10 h-10 mr-2" />
                      <h1 className="text-sm font-bold" style={{ fontSize: '2rem' }}>BuddyPay</h1>
                    </div>
          <nav>
            <ul className="space-y-4">
              <li className="hover:text-gray-300 cursor-pointer" onClick={() => navigate("/homepage")}>Overview</li>
              <li className="hover:text-gray-300 cursor-pointer">Statement</li>
              <li className="hover:text-gray-300 cursor-pointer">Favourite</li>
              <li className="hover:text-gray-300 cursor-pointer">Payments</li>
            </ul>
          </nav>
        </div>
        <div>
          <p className="text-gray-400 cursor-pointer hover:text-white">Account</p>
          <p className="text-gray-400 cursor-pointer hover:text-white">Settings</p>
          <p className="text-gray-400 cursor-pointer hover:text-white">Log Out</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-900 p-8 flex flex-col items-center justify-center">
        <h2 className="text-3xl font-bold mb-6">Add Balance</h2>
        <div className="bg-gray-800 shadow-md rounded-lg p-6 w-96">
          <input
            type="text"
            placeholder="Enter Recharge Code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="p-2 border border-gray-600 rounded-lg w-full focus:outline-none bg-gray-700 text-white"
          />
          <button 
            onClick={handleRecharge} 
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded flex items-center justify-center w-full">
            <FaPlus className="mr-2" /> Add Balance
          </button>
          {message && <p className="mt-4 text-center text-red-400">{message}</p>}
        </div>
      </main>
    </div>
  );
};

export default AddBalance;
