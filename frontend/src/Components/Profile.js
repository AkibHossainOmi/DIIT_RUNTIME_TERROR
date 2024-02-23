import { getCurrentUserEmail, getLoggedInStatus } from "./Status";
import Navbar from "./Navbar";

const MyProfile = () => {
  const isAuthenticated = getLoggedInStatus();
  const userEmail = getCurrentUserEmail();
  return (
    <div>
      <Navbar />
      <div className="flex flex-col items-center min-h-screen pt-6 sm:justify-center sm:pt-0 bg-gray-50">
        
        {isAuthenticated && (
          <div className="w-full px-6 py-4 mt-6 overflow-hidden bg-white shadow-md sm:max-w-md sm:rounded-lg">
            {/* Display user information */}
            <p>Name: {}</p>
            <p>Email: {userEmail}</p>
            {/* Add more user information fields as needed */}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProfile;
