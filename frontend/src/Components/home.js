import React from "react";
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <>
    


    <div className="relative flex flex-col items-center justify-center h-screen bg-purple-100"> 
    

    <nav className="absolute flex  w-full p-8 bg-purple-500 top-0">
        
        <div className="absolute top-0 right-0 m-4 space-x-4">
        
        <Link to="/login" className="text-white text-lg hover:underline">
            Login
        </Link>
        <Link to="/registration" className="text-white text-lg hover:underline">
            Signup
        </Link>
        </div>

        <div className="absolute top-0  m-4 space-x-4">
          <Link to="/" className="text-white font-bold text-lg hover:underline">
            Home
          </Link>
          <Link to="/trains" className="text-white hover:underline">
            Trains
          </Link>
          
          {/* Add more links as needed */}
        </div>
        {/* You can add additional elements to the navbar, such as a logo or user profile */}
    </nav>



      <h1 className="text-5xl font-bold mb-6 text-purple-700">
        Welcome to Samurai Train Services
      </h1>
      <p className="text-2xl text-center text-purple-800">
        Experience the luxury and speed of our state-of-the-art trains. 
        Book your tickets now for an unforgettable journey!
      </p>
      {/* Add more content or features related to Samurai Train Services */}
    </div>
    </>
  );
}
