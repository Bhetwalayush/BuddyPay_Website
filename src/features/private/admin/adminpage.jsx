import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa"; // Import missing FaTrash icon
import { useNavigate } from "react-router-dom";

const menuItems = ["Dashboard", "Admins", "Users", "Recharge", "Statements", "Settings"];

const AdminPage = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activePage, setActivePage] = useState("Admins");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:3000/api/admin", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const adminList = response.data.users.filter((user) => user.isAdmin);
        setAdmins(adminList);
      } catch (error) {
        setError("Error fetching admin data.");
        console.error("Error fetching admin data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdmins();
  }, []);

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

  const handleDelete = async (adminId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this admin?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3000/api/admin/${adminId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setAdmins(admins.filter((admin) => admin._id !== adminId));
    } catch (error) {
      console.error("Error deleting admin:", error);
      alert("Failed to delete admin.");
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
                className={`cursor-pointer p-3 rounded-md mb-2 ${
                  activePage === item ? "bg-teal-500" : "hover:bg-[#33314D]"
                }`}
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
        <h1 className="text-2xl font-bold text-white mb-6">Admin List</h1>

        {loading ? (
          <div className="text-white">Loading...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          <div className="bg-[#2A2747] p-6 rounded-md">
            <table className="w-full table-auto text-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">ID</th>
                  <th className="py-2 px-4 border-b">Full Name</th>
                  <th className="py-2 px-4 border-b">Phone</th>
                  <th className="py-2 px-4 border-b">Is Admin</th>
                  <th className="py-2 px-4 border-b">Created At</th>
                  <th className="py-2 px-4 border-b">Action</th>
                </tr>
              </thead>
              <tbody>
                {admins.map((admin) => (
                  <tr key={admin._id} className="hover:bg-[#33314D]">
                    <td className="py-2 px-4 border-b text-center">{admin._id}</td>
                    <td className="py-2 px-4 border-b text-center">{admin.fullname}</td>
                    <td className="py-2 px-4 border-b text-center">{admin.phone}</td>
                    <td className="py-2 px-4 border-b text-center">{admin.isAdmin ? "Yes" : "No"}</td>
                    <td className="py-2 px-4 border-b text-center">
                      {new Date(admin.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-2 px-4 border-b text-center">
                      <button
                        onClick={() => handleDelete(admin._id)}
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

export default AdminPage;
