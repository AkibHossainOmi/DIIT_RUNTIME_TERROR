import React from "react";
import { Link, useNavigate } from 'react-router-dom';
import { isLoggedIn, setLoggedIn } from "./Status";

export default function Navbar() {
    const isAuthenticated = isLoggedIn();
    const history = useNavigate();
    const handleLogout = (event) => {
        event.preventDefault();
        setLoggedIn();
        history('/login');
        window.location.reload();
        console.log("Logged out successfully");
    };
    return (
        <>
            <nav className="absolute flex w-full p-8 bg-purple-500 top-0">
            <div className="absolute top-0 right-0 m-4 space-x-4">
                {isAuthenticated ? (
                    <>
                    <Link to="/login" onClick={handleLogout} className="text-white text-lg hover:underline">
                    Logout
                    </Link>
                    </>
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