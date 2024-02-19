import React from "react";
import { isLoggedIn, setLoggedIn } from "./Status";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const history = useNavigate();
  const handleLogout = (event) => {
    event.preventDefault();
    setLoggedIn();
    history('/login');
    window.location.reload();
    console.log("Logged out successfully");
  };

  return (
    <div className="flex items-center justify-end mt-4 mr-4">
      <button onClick={handleLogout}
        type="submit"
        className="inline-flex items-center px-4 py-2 ml-4 text-xs font-semibold tracking-widest text-white uppercase transition duration-150 ease-in-out bg-gray-900 border border-transparent rounded-md active:bg-gray-900"
      >
        {/* <a href="login" > */}
          Log Out
        {/* </a> */}
      </button>
    </div>
  );
}
