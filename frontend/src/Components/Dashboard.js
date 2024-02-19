import React from "react";
import { setLoggedIn } from "./Status";
export default function Dashboard() {
    return (
        <div className="flex items-center justify-end mt-4 mr-4">
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 ml-4 text-xs font-semibold tracking-widest text-white uppercase transition duration-150 ease-in-out bg-gray-900 border border-transparent rounded-md active:bg-gray-900"
              >
                <a href="login" onClick={setLoggedIn()}>Log Out</a>
              </button>
        </div>
    );
}