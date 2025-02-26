import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const menuItems = ["Dashboard", "Admins", "Users", "Recharge", "Statements", "Settings"];

const Statements = () => {
  const [activePage, setActivePage] = useState("Statements"); // Set active page to Statements initially
  const [recharges, setRecharges] = useState([]); // To store all recharges
  const [loading, setLoading] = useState(true); // To show loading state
  const [error, setError] = useState(""); // For handling errors
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

  // Fetch all recharges when the page loads
  useEffect(() => {
    const fetchRecharges = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/recharge/all", {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setRecharges(response.data.recharges);
      } catch (error) {
        setError("Error fetching recharge data.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecharges();
  }, []);

  // Handle delete recharge
  const handleDelete = async (rechargeId) => {
    if (!window.confirm("Are you sure you want to delete this recharge?")) return;
    
    try {
      await axios.delete(`http://localhost:3000/api/recharge/${rechargeId}`, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setRecharges(recharges.filter((recharge) => recharge._id !== rechargeId));
    } catch (error) {
      console.error("Error deleting recharge:", error);
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
        <h1 className="text-2xl font-bold text-white mb-6">Recharge Statements</h1>

        {loading ? (
          <div className="text-white">Loading...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          <div className="bg-[#2A2747] p-6 rounded-md">
            <table className="w-full table-auto text-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">Balance</th>
                  <th className="py-2 px-4 border-b">Code</th>
                  <th className="py-2 px-4 border-b">Valid</th>
                  <th className="py-2 px-4 border-b">Created At</th>
                  <th className="py-2 px-4 border-b">Action</th>
                </tr>
              </thead>
              <tbody>
                {recharges.map((recharge) => (
                  <tr key={recharge._id} className="hover:bg-[#33314D]">
                    <td className="py-2 px-4 border-b text-center">{recharge.balance}</td>
                    <td className="py-2 px-4 border-b text-center">{recharge.code}</td>
                    <td className="py-2 px-4 border-b text-center">{recharge.valid ? "Yes" : "No"}</td>
                    <td className="py-2 px-4 border-b text-center">{new Date(recharge.createdAt).toLocaleDateString()}</td>
                    <td className="py-2 px-4 border-b text-center">
                      <button
                        onClick={() => handleDelete(recharge._id)}
                        className="text-white-500 hover:text-red-700"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

export default Statements;
