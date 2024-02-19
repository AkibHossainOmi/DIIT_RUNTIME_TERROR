import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Components/Login';
import Registration from './Components/Registration';
import Dashboard from './Components/Dashboard';
import { isLoggedIn } from './Components/Status';

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
