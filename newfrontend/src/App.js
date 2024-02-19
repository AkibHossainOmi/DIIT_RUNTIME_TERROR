// import React, { useEffect, useState } from 'react';
import Login from './Components/Login';
import Registration from './Components/Registration';
import Dashboard from './Components/Dashboard.js';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
function App() {
  return (
<div className="font-roboto">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registration" element={<Registration />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </div> 
  );
}

export default App;
