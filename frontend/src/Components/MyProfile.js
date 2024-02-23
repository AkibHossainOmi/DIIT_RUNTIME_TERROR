import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { isLoggedIn } from "./Status";
import Navbar from "./Navbar";

const MyProfile = () => {
  const isAuthenticated = isLoggedIn();
  const [userData, setUserData] = useState({});
  const history = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Assume your API endpoint returns the user data directly
        const response = await fetch("http://localhost:8000/api/user");
        const result = await response.json();
        setUserData(result);
      } catch (error) {
        console.error(error);
        // Handle error fetching user data
      }
    };

    if (isAuthenticated) {
      fetchUserData();
    } else {
      // Redirect to login if not authenticated
      history('/login');
    }
  }, [isAuthenticated, history]);

  return (
    <div>
      <Navbar />
      <div className="flex flex-col items-center min-h-screen pt-6 sm:justify-center sm:pt-0 bg-gray-50">
        
        {isAuthenticated && (
          <div className="w-full px-6 py-4 mt-6 overflow-hidden bg-white shadow-md sm:max-w-md sm:rounded-lg">
            {/* Display user information */}
            <p>Name: {userData.name}</p>
            <p>Email: {userData.email}</p>
            {/* Add more user information fields as needed */}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProfile;
