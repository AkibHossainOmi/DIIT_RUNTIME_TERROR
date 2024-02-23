import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Components/Login';
import Registration from './Components/Registration';
import Dashboard from './Components/Dashboard';
import { getLoggedInStatus } from './Components/Status';
import ForgotPassword from './ForgotPassword';
import TrainList from './Components/TrainList';
import Home from './Components/Home';
import StationList from './Components/StationList';
import Navbar from './Components/Navbar';
import MyProfile from './Components/Profile';

function App() {
  const isAuthenticated = getLoggedInStatus();

  return (
    <div className="font-roboto">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/trains" element={<TrainList />} />
          <Route path="/stations" element={<StationList />} />

          {isAuthenticated ? (
            <>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<MyProfile />} />
            </>
          ) : (
            <>
              <Route path="/login" element={<Login />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/registration" element={<Registration />} />
            </>
          )}
          <Route path="/*" element={<Navbar />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
