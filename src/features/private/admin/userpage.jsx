import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const menuItems = ["Dashboard", "Admins", "Users", "Recharge", "Statements", "Settings"];

const UserPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activePage, setActivePage] = useState("Users");
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Token is missing.");
        return;
      }

      const response = await axios.get("http://localhost:3000/api/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data && response.data.users) {
        const regularUsers = response.data.users.filter((user) => !user.isAdmin);
        setUsers(regularUsers);
      } else {
        setError("No users found.");
      }
    } catch (error) {
      setError(`Error fetching users: ${error.response ? error.response.data.message : error.message}`);
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  // Delete User Function
  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3000/api/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Remove deleted user from state
      setUsers(users.filter((user) => user._id !== userId));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

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
        <h1 className="text-2xl font-bold text-white mb-6">User List</h1>

        {loading ? (
          <div className="text-white">Loading...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          <div className="bg-[#2A2747] p-6 rounded-md">
            <table className="w-full table-auto text-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">Full Name</th>
                  <th className="py-2 px-4 border-b">Phone</th>
                  <th className="py-2 px-4 border-b">Is Admin</th>
                  <th className="py-2 px-4 border-b">Balance</th>
                  <th className="py-2 px-4 border-b">Created At</th>
                  <th className="py-2 px-4 border-b">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.length > 0 ? (
                  users.map((user) => (
                    <tr key={user._id} className="hover:bg-[#33314D]">
                      <td className="py-2 px-4 border-b text-center">{user.fullname}</td>
                      <td className="py-2 px-4 border-b text-center">{user.phone}</td>
                      <td className="py-2 px-4 border-b text-center">{user.isAdmin ? "Yes" : "No"}</td>
                      <td className="py-2 px-4 border-b text-center">Rs {user.balance}</td>
                      <td className="py-2 px-4 border-b text-center">{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td className="py-2 px-4 border-b text-center">
                        <button
                          onClick={() => handleDelete(user._id)}
                          className="text-white-500 hover:text-red-700"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="py-4 text-center text-gray-400">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

export default UserPage;
