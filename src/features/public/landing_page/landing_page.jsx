import React, { useRef } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom
import icon from "../../../assets/icons/logo.png";
import phoneImage from "../../../assets/image/images.png";

const LandingPage = () => {
  const homeRef = useRef(null);
  const featuresRef = useRef(null);
  const aboutRef = useRef(null);
  const blogRef = useRef(null);
  const navigate = useNavigate(); // Initialize useNavigate

  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Function to handle Login redirection
  const handleLoginClick = () => {
    navigate("/login"); // Redirect to login page
  };

  // Function to handle Sign Up redirection
  const handleSignUpClick = () => {
    navigate("/signup"); // Redirect to signup page
  };

  return (
    <div className="min-h-screen w-full bg-gray-900 text-white overflow-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full bg-gray-800 p-4 flex justify-between items-center shadow-md z-10">
        <div className="flex items-center">
          <img src={icon} alt="BuddyPay Icon" className="w-10 h-10 mr-2" />
          <h1 className="text-lg font-bold">BuddyPay</h1>
        </div>
        <ul className="flex space-x-6">
          <li className="cursor-pointer" onClick={() => scrollToSection(homeRef)}>Home</li>
          <li className="cursor-pointer" onClick={() => scrollToSection(featuresRef)}>Features</li>
          <li className="cursor-pointer" onClick={() => scrollToSection(aboutRef)}>About Us</li>
          <li className="cursor-pointer" onClick={() => scrollToSection(blogRef)}>FAQ</li>
        </ul>
        <button className="bg-black text-white px-4 py-2 rounded-lg" onClick={handleLoginClick}>
          Login
        </button>
      </nav>
      
      {/* Hero Section */}
      <section ref={homeRef} className="w-full h-screen flex items-center justify-center px-20 relative">
        <div className="w-1/2 text-left">
          <span className="bg-gray-700 px-4 py-2 rounded-full text-sm inline-block mb-4">
            Welcome to a Modern Financial Experience
          </span>
          <h2 className="text-5xl font-bold leading-tight">Managing Your Personal Finances Made Easier</h2>
          <p className="mt-4 text-gray-300 text-lg">
            Elevate your financial experience with BuddyPay. We simplify how you pay, transfer money, and manage your finances, giving you full control over your money.
          </p>
          <button 
            className="mt-6 text-white border-2 border-white px-6 py-3 rounded-lg"
            style={{ backgroundColor: '#14B8A6' }}
            onClick={handleSignUpClick} // Redirect to signup page
          >
            Get Started
          </button>
        </div>
        
        <div className="w-1/2 flex justify-end relative">
          <img src={phoneImage} alt="BuddyPay App" className="max-w-lg object-contain" />
        </div>
      </section>
      
      {/* Features Section */}
      <section ref={featuresRef} className="h-screen w-full flex flex-col items-center justify-center text-center bg-gray-800 px-6">
        <h2 className="text-4xl font-bold">Why Choose Us</h2>
        <p className="mt-4 text-gray-300 text-lg max-w-3xl">Fast transactions, 24/7 support, exclusive promos, and easy financial management.</p>
      </section>
      
      {/* About Us Section */}
      <section ref={aboutRef} className="h-screen w-full flex flex-col items-center justify-center text-center px-6">
        <h2 className="text-4xl font-bold">What Our Happy Users Say</h2>
        <p className="mt-4 text-gray-300 text-lg max-w-3xl">See what our customers love about BuddyPay.</p>
      </section>
      
      {/* FAQ Section */}
      <section ref={blogRef} className="h-screen w-full flex flex-col items-center justify-center text-center bg-gray-800 px-6">
        <h2 className="text-4xl font-bold">Frequently Asked Questions</h2>
        <p className="mt-4 text-gray-300 text-lg max-w-3xl">Find answers to common queries.</p>
      </section>
    </div>
  );
};

export default LandingPage;
