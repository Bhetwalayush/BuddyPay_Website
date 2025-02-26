import React from "react";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="container">
        <div className="logo">
          <img src="/logo.png" alt="BuddyPay" className="logo-img" />
          <span>BuddyPay</span>
        </div>
        <ul className="nav-links">
          <li><a href="#">Home</a></li>
          <li><a href="#">Features</a></li>
          <li><a href="#">About Us</a></li>
          <li><a href="#">Blog</a></li>
        </ul>
        <button className="login-btn">Login</button>
      </div>
    </nav>
  );
};

export default Navbar;
