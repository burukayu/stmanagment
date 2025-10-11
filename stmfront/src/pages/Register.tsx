import React, { useState, useEffect } from "react";
import API from "../api";
import { useNavigate, Link } from "react-router-dom";
import "./styless.css"; // Reuse the same CSS

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Redirect if already logged in
  useEffect(() => {
    if (token) {
      navigate("/tasks");
    }
  }, [token, navigate]);

  const handleRegister = async () => {
    try {
      await API.post("register/", { username, email, password });
      alert("Account created! You can now login.");
      navigate("/login"); // Redirect to login after registration
    } catch (error: any) {
      console.log(error.response?.data);
      alert("Error creating account.");
    }
  };

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
          className="input"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="btn" onClick={handleRegister}>
          Create Account
        </button>
        <Link to="/login" className="link1">
          Already have an account? Login
        </Link>
      </div>

      <div className="footer1">&copy; 2025 Your App</div>
    </div>
  );
};

export default Register;
