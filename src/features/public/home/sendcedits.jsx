import axios from "axios";
import React, { useState } from "react";
import { FaArrowRight } from "react-icons/fa"; // Import icon for "Send"
import { useLocation, useNavigate } from "react-router-dom";
import logo from '../../../assets/icons/logo.png';

const SendCredits = () => {
    const { state } = useLocation(); // Access the state passed from the previous page
    const userId = state?.userId; // Retrieve userId from state

    const [recipientNumber, setRecipientNumber] = useState("");
    const [amount, setAmount] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleSendCredits = async () => {
        try {
            // Send the data to backend API for processing
            const response = await axios.post(
                "http://localhost:3000/api/user/sendcredit",
                {
                    senderId: userId,  // Send senderId
                    recipientNumber,
                    amount,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`, // Include JWT token for authentication
                    },
                }
            );

            if (response.data.success) {
                // Prepare the statement payload
                const statementPayload = {
                    amount: amount, // Use the amount sent
                    statement: `Sent Rs ${amount} to ${recipientNumber}`, // Create a proper statement message
                    to: recipientNumber, // Set the recipient's phone number or fullname
                    userId: userId // Ensure this is passed correctly
                };
    
                // Create statement
                const statementResponse = await axios.post("http://localhost:3000/api/statements/createStatement", statementPayload, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}` // Include JWT token for authentication
                    },
                });
    
                console.log("Statement Response:", statementResponse.data);
    
                // Update UI message based on response
                setMessage(<span className="text-green-500">{response.data.message}</span>);
                setTimeout(() => navigate("/homepage"), 2000); // Navigate back to homepage after 2 seconds
            } else {
                setMessage(<span className="text-red-500">{response.data.message}</span>);
            }
        } catch (error) {
            setMessage("An error occurred. Please try again later.");
            console.error(error); // Log the error for debugging
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
                <h2 className="text-3xl font-bold mb-6">Send Credits</h2>
                <div className="bg-gray-800 shadow-md rounded-lg p-6 w-96">
                    <input
                        type="text"
                        placeholder="Enter Recipient's Phone Number"
                        value={recipientNumber}
                        onChange={(e) => setRecipientNumber(e.target.value)}
                        className="p-2 border border-gray-600 rounded-lg w-full focus:outline-none bg-gray-700 text-white"
                    />
                    <input
                        type="number"
                        placeholder="Enter Amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="p-2 border border-gray-600 rounded-lg w-full focus:outline-none bg-gray-700 text-white mt-4"
                    />
                    <button 
                        onClick={handleSendCredits} 
                        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded flex items-center justify-center w-full">
                        <FaArrowRight className="mr-2" /> Send Credits
                    </button>
                    {message && <p className="mt-4 text-center">{message}</p>}
                </div>
            </main>
        </div>
    );
};

export default SendCredits;
