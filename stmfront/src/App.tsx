import React ,{useState} from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Tasks from "./pages/Tasks";
import './App.css';
import Navbar from './pages/Navbar';
import Register from './pages/Register';
import { User } from './types';
const App: React.FC = () => {
   const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser && storedUser !== "{}" ? JSON.parse(storedUser) : null;
  });

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
