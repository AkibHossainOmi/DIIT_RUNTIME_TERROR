import React, { useEffect } from "react";
import { getCurrentUserEmail, getLoggedInStatus } from "./Status";
import Navbar from "./Navbar";
import UserInfo from "./UserInfo";

const Profile = () => {
  const isAuthenticated = getLoggedInStatus();
  const userEmail = getCurrentUserEmail();
  const { userInfo, error } = UserInfo(userEmail);

  useEffect(() => {
    // You can perform additional actions when userInfo changes,
    // e.g., update state, trigger side effects, etc.
  }, [userInfo]);

  return (
    <div>
      <Navbar />
      <div className="flex flex-col items-center min-h-screen pt-6 sm:justify-center sm:pt-0 bg-gray-50">
        {isAuthenticated && (
          <div className="w-full px-6 py-4 mt-6 overflow-hidden bg-white shadow-md sm:max-w-md sm:rounded-lg">
            {error && <p>Error: {error}</p>}
            {userInfo && (
              <div>
                <p>Name: {userInfo.user_name}</p>
                <p>Email: {userInfo.email}</p>
                <p>Account Balance: {userInfo.balance}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
