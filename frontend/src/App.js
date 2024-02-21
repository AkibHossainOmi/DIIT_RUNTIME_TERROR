import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Components/Login';
import Registration from './Components/Registration';
import Dashboard from './Components/Dashboard';
import { isLoggedIn } from './Components/Status';
import ForgotPassword from './ForgotPassword';
import TrainList from './Components/TrainList';

function App() {
  return (
    <div className="font-roboto">
      <BrowserRouter>
        <Routes>
          <Route
            path="/dashboard"
            element={isLoggedIn() ? <Dashboard /> : <Navigate to="/login" />}
          />
          <Route
            path="/login"
            element={!isLoggedIn() ? <Login /> : <Navigate to="/dashboard" />}
          />
          <Route 
            path="/forgot-password" 
            element={!isLoggedIn() ? <ForgotPassword /> : <Navigate to="/dashboard" />} 
          />
          <Route 
            path="/trains" 
            element={isLoggedIn() ? <TrainList /> : <Navigate to="/login" />} 
          />
          <Route
            path="/"
            element={!isLoggedIn() ? <Login /> : <Navigate to="/dashboard" />}
          />
          <Route
            path="/registration"
            element={!isLoggedIn() ? <Registration /> : <Navigate to="/dashboard" />}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
