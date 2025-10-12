import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import "./pages.css"; // reuse the same CSS
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  user_id: number;
  username: string;
  email: string;
  role: string;
  exp: number;
  iat: number;
}
const Register: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("user"); // default role
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
        const res = await API.post("register/", { username, password, email, role });
        localStorage.setItem("token", res.data.access);
        const user: DecodedToken = jwtDecode(res.data.access);
        localStorage.setItem("user", JSON.stringify(user));
        navigate("/tasks");
        } catch (err) {
        alert("Registration failed, please check your input.");
        console.error(err);
        }
      };
  useEffect(()=>{
        const user= localStorage.getItem('user')
            if(user){
                navigate("/tasks")
            }
    }
  );
  return (
    <div className="body1">
    <div className="container1">
      <h2 className="heading">Create Account</h2>

      <input
        className="input"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        type="email"
        className="input"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        className="input"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <select
        className="input"
        value={role}
        onChange={(e) => setRole(e.target.value)}
      >
        <option value="user">User</option>
        <option value="staff">Staff</option>
        <option value="admin">Admin</option>
      </select>

      <button className="btn" onClick={handleRegister}>
        Register
      </button> 
        <a onClick={() => navigate("/login")} className="link">
              have an account? login
            </a>
    </div>
    </div>
  );
};

export default Register;
