import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { FaUser } from "react-icons/fa"; 
import { logout } from "./redux/userSlice"; 
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./App.css";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Get user data from Redux store
  const user = useSelector((state) => state.user);

  // Logout Function
  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("token"); // Clear token
    navigate("/"); // Redirect to login
  };

  // Registration Function
  const handleRegistration = () => {
    navigate("/register");
  };
  // Login Function
  const handleLogin = () => {
    navigate("/login");
  };
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        {/* Brand Logo */}
        <Link className="navbar-brand name" to="/" style={{ color: "rgb(13, 101, 113)" }}>
          Split<span style={{ color: "red" }}>IT</span>
        </Link>

        {/* Navbar Toggle for Mobile */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar Items */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/dashboard">
                Dashboard
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/groups">
                Groups
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/Invitations">
                Invitations
              </Link>
            </li>
             <li className="nav-item">
              <Link className="nav-link" to="/expenseTracker" style={{color:"darkblue"}}>
                ExpenseTracker
              </Link>
            </li>

            {/* If user is logged in, show user name and logout */}
            {user?.id ? (
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  id="userDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <FaUser className="me-1" style={{color:"green"}} /> {user.name}
                </a>
                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                  <li>
                    <Link className="dropdown-item" to="/about">
                      About
                    </Link>
                  </li>
                  <li>
                    <button className="dropdown-item" onClick={handleLogout}>
                      Logout
                    </button>
                  </li>
                  <li>
                    <p className="text-danger dropdown-item">UserId:{user.id}</p>
                  </li>
                </ul>
              </li>
            ) : (
              <>
                {/* If no user is logged in, show Login/Register */}
               <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  id="userDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <FaUser className="me-1" /> Account
                </a>
                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                  <li>
                    <Link className="dropdown-item" to="/about">
                      About
                    </Link>
                  </li>
                  <li>
                    <button className="dropdown-item" onClick={handleRegistration}>
                      Register
                    </button>
                  </li>
                     <li>
                    <button className="dropdown-item" onClick={handleLogin}>
                      Login
                    </button>
                  </li>
                </ul>
              </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
