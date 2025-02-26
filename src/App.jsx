import { Suspense, lazy, useState } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
// import ForgotPassword from "./features/public/auth/forgotpassword";
// import HomePage from "./features/home/homepage";


// Lazy load the Login and Signup components from the correct paths
const LandingPage = lazy(() => import("./features/public/landing_page/landing_page"));
const Login = lazy(() => import("./features/public/auth/login"));
const Signup = lazy(() => import("./features/public/auth/signup"));
const ForgotPassword = lazy(() => import("./features/public/auth/forgotpassword"));
const HomePage = lazy(() => import("./features/public/home/homepage"));
const AddBalance = lazy(() => import("./features/public/home/addbalance"));
const SendCredit = lazy(() => import("./features/public/home/sendcedits"));
const AdminDashboard  = lazy(() => import("./features/private/admin/admindashboard"));
const AdminPage  = lazy(() => import("./features/private/admin/adminpage"));
const UserPage  = lazy(() => import("./features/private/admin/userpage"));
const Recharge  = lazy(() => import("./features/private/admin/recharge"));
const Statement  = lazy(() => import("./features/private/admin/statement"));

function App() {
  const [count, setCount] = useState(0);

  return (
    <Router>
      {/* <div>
        <a href="https://vite.dev" target="_blank" rel="noopener noreferrer">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noopener noreferrer">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p> */}

      {/* React Router Setup */}
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<LandingPage/>} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/homepage" element={<HomePage />} />
          <Route path="/addbalance" element={<AddBalance />} />
          <Route path="/sendcredits" element={<SendCredit />} />
          <Route path="/admindashboard" element={<AdminDashboard />} />
          <Route path="/adminpage" element={<AdminPage />} />
          <Route path="/userpage" element={<UserPage />} />
          <Route path="/recharge" element={<Recharge />} />
          <Route path="/statements" element={<Statement />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
