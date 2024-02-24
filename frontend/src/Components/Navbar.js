import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { clearUserStatus, getLoggedInStatus, setLoggedIn } from "./Status";

export default function Navbar() {
  const isAuthenticated = getLoggedInStatus();
  const history = useNavigate();
  const dropdownRef = useRef(null);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = (event) => {
    event.preventDefault();
    setLoggedIn(false);
    clearUserStatus();
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
      <nav className="fixed flex w-full p-8 bg-purple-500 top-0 h-16 sm:h-16 md:h-16 lg:h-16 xl:h-16">
        <div className="hidden sm:block absolute top-0 right-6 m-4 space-x-4" ref={dropdownRef}>
          {isAuthenticated ? (
            <div className="relative">
              <button className="invert" onClick={toggleDropdown} >
                  <img src="user.svg" alt="user" className="w-7 h-7" />       
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-1 bg-slate-100 shadow-md rounded-md z-10">
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

        <div className="hidden sm:block absolute top-0  m-4 space-x-4">
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

        <div className="sm:hidden flex items-center w-full" ref={dropdownRef}>
          <button className="text-white" onClick={toggleDropdown}>
            ☰
          </button>
          {isDropdownOpen && (
            <div className="shadow-md rounded-md h-full top-10 absolute left-0">
              <ul className="bg-purple-500 p-0 space-y-1 py-5 w-screen flex flex-col items-center justify-center">
                <li>
                  <Link to="/" className="ml-8 text-white text-lg hover:underline">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/trains" className="ml-8 text-white text-lg hover:underline">
                    Trains
                  </Link>
                </li>
                <li>
                  <Link to="/stations" className="ml-8 text-white text-lg hover:underline">
                    Stations
                  </Link>
                </li>
                {isAuthenticated? (
                  <>
                  <li>
                    <Link to="/dashboard" className="ml-8 text-white text-lg hover:underline">
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link to="/profile" className="ml-8 text-white text-lg hover:underline">
                      Profile
                    </Link>
                  </li>
                  <li>
                    <Link to="/login" onClick={handleLogout} className="ml-8 text-white text-lg hover:underline">
                      Logout
                    </Link>
                  </li>
                  </>):( <>
                  <li>
                    <Link to="/login" className="ml-8 text-white text-lg hover:underline">
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link to="/registration" className="ml-8 text-white text-lg hover:underline">
                      Signup
                    </Link>
                  </li>
                  </>
                )}
              </ul>
            </div>
          )}

        </div>
      </nav>
    </>
  );
}
