import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Tasks from "./pages/Tasks";
import './App.css';
import Navbar from './pages/Navbar';
import Register from './pages/Register';
const App: React.FC = () => {
  return (
    <Router>
      <Navbar />
      <Routes> 
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/tasks" element={<Tasks />} />
      </Routes>
    </Router>
  );
}

export default App;
