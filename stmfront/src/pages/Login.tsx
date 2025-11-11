import React, { useState ,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import "./pages.css";
import {jwtDecode} from "jwt-decode";

interface DecodedToken {
  username: string;
  role: string;
}

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await API.post("login/", { username, password });
      localStorage.setItem("token", res.data.access);
      const user: DecodedToken = jwtDecode(res.data.access);
      localStorage.setItem("user", JSON.stringify(user));
      navigate("/tasks");
    } catch {
      alert("Login failed");
    }
  };
useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser && storedUser !== "{}"){
   navigate("/tasks");}
    
  }, []);
  return (
    <div className="body1">
    <div className="container1">
      <h2 className="heading">Login</h2>
     <form
  onSubmit={(e) => {
    e.preventDefault(); // prevent page reload
    handleLogin();
  }}
>
     <input
     className="input"
     type="text"
      name="username"
      placeholder="Username"
      value={username}
      onChange={(e) => setUsername(e.target.value)}
      autoComplete="username"
     />
      <input
        type="password"
        className="input"
        name="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}  
       autoComplete="password"
      />
      <button className="btn" onClick={handleLogin}>
        Login
      </button>
      <a onClick={() => navigate("/register")} className="link">
              Create Account
            </a>
</form>
     
    </div>
    </div>
  );

};

export default Login;
