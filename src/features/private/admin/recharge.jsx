import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const menuItems = ["Dashboard", "Admins", "Users", "Recharge", "Statements", "Settings"];

const Recharge = () => {
  const [activePage, setActivePage] = useState("Recharge"); // Set active page to Recharge initially
  const [selectedOption, setSelectedOption] = useState(""); // To track the selected option
  const [rechargeCode, setRechargeCode] = useState(""); // To store the generated recharge code
  const [loading, setLoading] = useState(false); // To track loading state
  const [error, setError] = useState(""); // To track errors
  const navigate = useNavigate();

  const handleMenuItemClick = (item) => {
    setActivePage(item);
    if (item === "Dashboard") {
        navigate("/admindashboard");
      } else if (item === "Admins") {
        navigate("/adminpage");
      } else if (item === "Users") {
        navigate("/userpage");
      } else if (item === "Recharge") {
        navigate("/recharge");
      } else if (item === "Statements") {
        navigate("/statements");
      }
  };

  const generateRechargeCode = async () => {
    if (!selectedOption) {
      alert("Please select an option");
      return;
    }

    try {
      setLoading(true);
      setError(""); // Reset any previous errors

      // Send request to backend to generate recharge code
      const response = await axios.post("http://localhost:3000/api/recharge/generate", {
        amount: selectedOption,
      });

      // Assuming the response contains the generated code
      if (response.data.code) {
        setRechargeCode(response.data.code);
      } else {
        setError("Failed to generate recharge code.");
      }
    } catch (error) {
      console.error("Error generating recharge code:", error);
      setError("An error occurred while generating the recharge code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-screen">
      {/* Sidebar */}
      <aside className="w-1/5 bg-[#22203E] text-white p-6 flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-bold mb-6">BuddyPay</h2>
          <ul>
            {menuItems.map((item) => (
              <li
                key={item}
                onClick={() => handleMenuItemClick(item)}
                className={`cursor-pointer p-3 rounded-md mb-2 ${activePage === item ? "bg-teal-500" : "hover:bg-[#33314D]"}`}
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
        <button
          onClick={() => navigate("/login")}
          className="mt-8 text-left text-sm text-gray-300 hover:text-white"
        >
          Log Out
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-[#1E1B33] p-8 overflow-auto">
        <h1 className="text-2xl font-bold text-white mb-6">Generate Recharge Code</h1>

        <div className="bg-[#2A2747] p-6 rounded-md">
          {/* Dropdown and button */}
          <div className="flex items-center mb-4">
            <select
              value={selectedOption}
              onChange={(e) => setSelectedOption(e.target.value)}
              className="p-2 rounded-md bg-[#33314D] text-white mr-4"
            >
              <option value="">Select Recharge Option</option>
              <option value="E-100">E-100</option>
              <option value="E-500">E-500</option>
              <option value="E-1000">E-1000</option>
            </select>
            <button
              onClick={generateRechargeCode}
              className="bg-teal-500 text-white p-2 rounded-md"
              disabled={loading}
            >
              {loading ? "Generating..." : "Generate"}
            </button>
          </div>

          {/* Display generated recharge code */}
          {error && <div className="text-red-500">{error}</div>}

          {rechargeCode && (
            <div className="mt-4">
              <label className="block text-white">Generated Recharge Code</label>
              <input
                type="text"
                value={rechargeCode}
                readOnly
                className="w-full p-3 mt-2 rounded-md bg-[#33314D] text-white"
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Recharge;
