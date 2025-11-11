import React ,{useState} from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Tasks from "./pages/Tasks";
import './App.css';
import Navbar from './pages/Navbar';
import Register from './pages/Register';
import { User } from './types';
import { UserProvider } from "./pages/UserContext";
const App: React.FC = () => {
   const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser && storedUser !== "{}" ? JSON.parse(storedUser) : null;
  });

  return (
    <UserProvider>
    <Router>
      <Navbar />
      <Routes> 
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/tasks" element={<Tasks />} />
      </Routes>
    </Router>
    </UserProvider>
  );
}

export default App;
