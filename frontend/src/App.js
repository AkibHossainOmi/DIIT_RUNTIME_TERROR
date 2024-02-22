import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Components/Login';
import Registration from './Components/Registration';
import Dashboard from './Components/Dashboard';
import { isLoggedIn } from './Components/Status';
import ForgotPassword from './ForgotPassword';
import TrainList from './Components/TrainList';
import Home from './Components/Home';
import StationList from './Components/StationList';

function App() {
  const isAuthenticated = isLoggedIn();

  return (
    <div className="font-roboto">
      <BrowserRouter>
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/trains" element={<TrainList />} />
          <Route path="/stations" element={<StationList />} />

          {isAuthenticated && (
            <>
              <Route path="/dashboard" element={<Dashboard />} />
              {/* <Route path="/login" element={<Home />} />
              <Route path="/forgot-password" element={<Home />} />
              <Route path="/registration" element={<Home />} /> */}
            </>
          )}

          {!isAuthenticated && (
            <>
              <Route path="/login" element={<Login />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/registration" element={<Registration />} />
              {/* <Route path="/dashboard" element={<Home />} /> */}
            </>
          )}

        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
