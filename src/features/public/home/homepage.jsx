import axios from "axios"; // Import axios for API requests
import React, { useEffect, useState } from "react";
import { FaChartLine, FaCreditCard, FaHistory, FaPaperPlane, FaPlus, FaQrcode } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import logo from "../../../assets/icons/logo.png";

const HomePage = () => {
  const navigate = useNavigate(); // Initialize navigate function
  const userId = localStorage.getItem("id");
  const fullName = localStorage.getItem("fullname"); // Retrieve full name from localStorage
  const [balance, setBalance] = useState(null); // State to store the balance
  const [statements, setStatements] = useState([]); // State to store transaction statements

  useEffect(() => {
    // Fetch balance from the backend when the component mounts
    const fetchBalance = async () => {
      try {
        const token = localStorage.getItem("token"); // Assuming the token is stored in localStorage
        const response = await axios.get("http://localhost:3000/api/user/balance", {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in the Authorization header
          },
        });

        setBalance(response.data.balance); // Set the balance state
      } catch (error) {
        console.error("Error fetching balance:", error);
      }
    };

    // Fetch user statements from the backend
    const fetchStatements = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`http://localhost:3000/api/statements/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (response.data.statements.length === 0) {
          setStatements([]); // No transactions
        } else {
          setStatements(response.data.statements);
        }
      } catch (error) {
        console.error("Error fetching statements:", error);
        setStatements([]); // Show "No transaction statements yet"
      }
    };

    fetchBalance();
    fetchStatements();
  }, [userId]);

  return (
    <div className="flex h-screen w-screen">
      {/* Sidebar */}
      <aside className="w-1/5 bg-gray-800 text-white p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center mb-8">
            <img src={logo} alt="BuddyPay Logo" className="w-10 h-10 mr-2" />
            <h1 className="text-sm font-bold" style={{ fontSize: '2rem' }}>BuddyPay</h1>
          </div>
          <nav>
            <ul className="space-y-4">
              <li className="hover:text-gray-300 cursor-pointer">Overview</li>
              <li className="hover:text-gray-300 cursor-pointer">Statement</li>
              <li className="hover:text-gray-300 cursor-pointer">Favourite</li>
              <li className="hover:text-gray-300 cursor-pointer">Payments</li>
            </ul>
          </nav>
        </div>
        <div>
          <p className="text-gray-400 cursor-pointer hover:text-white">Account</p>
          <p className="text-gray-400 cursor-pointer hover:text-white">Settings</p>
          <p
  className="text-gray-400 cursor-pointer hover:text-white"
  onClick={() => {
    setTimeout(() => {
      localStorage.clear(); // Clear user data from localStorage
      navigate("/login"); // Redirect to login after 2 seconds
    }, 2000);
  }}
>
  Log Out
</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-100 p-8 flex flex-col">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold text-black">Dashboard</h2>
          {fullName && (
            <div className="mt-4 p-4 bg-gray-200 rounded-lg">
              <h3 className="text-xl font-semibold text-black">Welcome, {fullName}!</h3>
            </div>
          )}
        </div>

        {/* Balance Section */}
        <div className="bg-teal-500 text-white shadow-md rounded-lg p-6 mt-6 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold">Balance</h3>
            <p className="text-3xl font-bold cursor-pointer">
              Rs {balance !== null ? balance : "Loading..."} {/* Display balance or "Loading..." */}
            </p> {/* Navigate when balance is clicked */}
          </div>
          <div className="flex space-x-4">
            <button
              className="bg-green-600 text-white px-4 py-2 rounded flex items-center"
              onClick={() => navigate("/addbalance", { state: { userId } })}
            >
              <FaPlus className="mr-2" /> Recharge
            </button>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded flex items-center"
              onClick={() => navigate("/sendcredits", { state: { userId } })} // Navigate to SendCredit page
            >
              <FaPaperPlane className="mr-2" /> Send
            </button>
            <button className="bg-gray-600 text-white px-4 py-2 rounded flex items-center">
              <FaCreditCard className="mr-2" /> Request
            </button>
          </div>
        </div>

        {/* Dashboard Widgets */}
        <div className="grid grid-cols-3 gap-4 mt-8">
          <div className="bg-black p-6 shadow-md rounded-lg flex items-center justify-center cursor-pointer hover:shadow-lg transition">
            <FaHistory className="text-3xl text-white" />
          </div>
          <div className="bg-black p-6 shadow-md rounded-lg flex items-center justify-center cursor-pointer hover:shadow-lg transition">
            <FaQrcode className="text-3xl text-white" />
          </div>
          <div className="bg-black p-6 shadow-md rounded-lg flex items-center justify-center cursor-pointer hover:shadow-lg transition">
            <FaChartLine className="text-3xl text-white" />
          </div>
        </div>

        {/* Transaction Statements Section */}
        <div className="mt-8">
          <h3 className="text-2xl font-semibold text-black mb-4">Transaction Statements</h3>

          {/* Scrollable Table Container */}
          <div className="bg-white shadow-md rounded-lg p-4 max-h-80 overflow-y-auto">
            {statements.length > 0 ? (
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                    <th className="py-3 px-6 text-left">Date</th>
                    <th className="py-3 px-6 text-left">Statement</th>
                    <th className="py-3 px-6 text-left">Amount (Rs)</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 text-sm font-light">
                  {statements.map((statement) => (
                    <tr key={statement._id} className="border-b border-gray-200 hover:bg-gray-100">
                      <td className="py-3 px-6">{new Date(statement.createdAt).toLocaleDateString()}</td>
                      <td className="py-3 px-6">{statement.statement}</td>
                      <td className="py-3 px-6 font-bold">{statement.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-center text-gray-500">No transaction statements yet.</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
