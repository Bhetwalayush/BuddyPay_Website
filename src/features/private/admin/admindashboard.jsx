import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bar, BarChart, Cell, Legend, Pie, PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis
} from "recharts";

const menuItems = ["Dashboard", "Admins", "Users", "Recharge", "Statements", "Settings"];

const AdminDashboard = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [activePage, setActivePage] = useState("Dashboard");
  const [userData, setUserData] = useState([]);
  const [totalFunds, setTotalFunds] = useState(1200);
  const [totalUsers, setTotalUsers] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(true);
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

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:3000/api/admin", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.isAdmin) {
          setIsAdmin(true);
          setUserData(response.data.users);

          const nonAdminUsers = response.data.users.filter(user => !user.isAdmin);
          setTotalUsers(nonAdminUsers.length);
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error("Error fetching admin data:", error);
        setIsAdmin(false);
      }
    };

    fetchAdminData();
  }, [navigate]);

  const chartData = useMemo(() => {
    const monthlyData = userData.reduce((acc, user) => {
      const month = new Date(user.createdAt).toLocaleString('default', { month: 'short' });
      if (!acc[month]) acc[month] = { Web: 0, Mobile: 0 };
      if (user.device === "Web") acc[month].Web += 1;
      if (user.device === "mobile") acc[month].Mobile += 1;
      return acc;
    }, {});

    return Object.keys(monthlyData).map((month) => ({
      name: month,
      Web: monthlyData[month].Web,
      Mobile: monthlyData[month].Mobile,
    }));
  }, [userData]);

  const pieData = useMemo(() => {
    const mobileUsers = userData.filter(user => user.device === "mobile").length;
    const webUsers = userData.filter(user => user.device === "Web").length;
    return [
      { name: "Mobile Wallet Users", value: mobileUsers, color: "#FFD700" },
      { name: "Website Wallet Users", value: webUsers, color: "#FF1493" }
    ];
  }, [userData]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  if (!isAdmin) {
    return (
      <div className="h-screen bg-[#1E1B33] text-white flex items-center justify-center">
        <h2>You are not authorized to view this page.</h2>
      </div>
    );
  }

  return (
    <div className={`flex h-screen w-screen ${isDarkMode ? "bg-[#1E1B33]" : "bg-white text-black"}`}>
      <aside className={`w-1/5 ${isDarkMode ? "bg-[#22203E] text-white" : "bg-gray-200 text-black"} p-6 flex flex-col justify-between`}>
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
        <div>
          <label className="flex items-center cursor-pointer text-sm text-gray-300 hover:text-white">
            <input type="checkbox" className="hidden" onChange={toggleTheme} checked={!isDarkMode} />
            <span className="mr-2">Light Mode</span>
            <div className={`w-10 h-5 flex items-center bg-gray-400 rounded-full p-1 transition duration-300 ${isDarkMode ? "justify-start" : "justify-end"}`}>
              <div className="w-4 h-4 bg-white rounded-full shadow-md transform transition duration-300"></div>
            </div>
          </label>
          <button onClick={handleLogout} className="mt-4 text-left text-sm text-gray-300 hover:text-white">
            Log Out
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-auto">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-[#2A2747] p-4 rounded-md">
            <p className="text-gray-400 text-sm">Total Funds</p>
            <h2 className="text-2xl font-bold">Rs {totalFunds}</h2>
          </div>
          <div className="bg-[#2A2747] p-4 rounded-md">
            <p className="text-gray-400 text-sm">Users</p>
            <h2 className="text-2xl font-bold">{totalUsers}</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          <div className="bg-[#2A2747] p-6 rounded-md w-full">
            <h3 className="text-lg font-semibold mb-4 text-white">Active Visitors</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData}>
                <XAxis dataKey="name" stroke="#FFFFFF" />
                <YAxis stroke="#FFFFFF" />
                <Tooltip />
                <Bar dataKey="Web" fill="#00D8FF" />
                <Bar dataKey="Mobile" fill="#FF0080" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-[#2A2747] p-6 rounded-md w-full">
            <h3 className="text-lg font-semibold mb-4 text-white">Wallet Usage</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
