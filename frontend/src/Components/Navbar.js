import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { isLoggedIn, setLoggedIn } from "./Status";
import { getFirstName } from "./Status";

export default function Navbar() {
  const isAuthenticated = isLoggedIn();
  const history = useNavigate();
  const dropdownRef = useRef(null);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = (event) => {
    event.preventDefault();
    setLoggedIn(false);
    history('/login');
    window.location.reload();
    console.log("Logged out successfully");
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", closeDropdown);

    return () => {
      document.removeEventListener("mousedown", closeDropdown);
    };
  }, []);

  return (
    <>
      <nav className="absolute flex w-full p-8 bg-purple-500 top-0">
        <div className="absolute top-0 right-0 m-4 space-x-4" ref={dropdownRef}>
          {isAuthenticated ? (
            <div className="relative">
              <button
                className="text-white text-lg hover:underline"
                onClick={toggleDropdown}
              >
                My Profile
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-1 bg-white shadow-md rounded-md z-10">
                  <ul className="space-y-1">
                    <li>
                      <Link to="/profile" className="px-4 py-2 block hover:bg-gray-200">
                        Profile
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={handleLogout}
                        className="px-4 py-2 block text-red-500 hover:bg-red-100"
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="text-white text-lg hover:underline">
                Login
              </Link>
              <Link to="/registration" className="text-white text-lg hover:underline">
                Signup
              </Link>
            </>
          )}
        </div>

        <div className="absolute top-0  m-4 space-x-4">
          <Link to="/" className="text-white text-lg hover:underline">
            Home
          </Link>
          <Link to="/trains" className="text-white text-lg hover:underline">
            Trains
          </Link>
          <Link to="/stations" className="text-white text-lg hover:underline">
            Stations
          </Link>
          {isAuthenticated && <Link to="/dashboard" className="text-white text-lg hover:underline">
            Dashboard
          </Link>}
          {/* Add more links as needed */}
        </div>
        {/* You can add additional elements to the navbar, such as a logo or user profile */}
      </nav>
    </>
  );
}
