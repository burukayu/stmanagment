import React, { useState } from 'react';
import API from '../api';
import { useNavigate ,Link } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    const res = await API.post('login/', { username, password });
    localStorage.setItem('token', res.data.access);
    navigate('/tasks');
  };

  return (
  <div className="body1">
    <div className="container1">
      <h2 className="heading1">Login</h2>
      <input className="input" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
      <input className="input" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
      <button className="btn" onClick={handleLogin}>Login</button>
      <Link to="/register" className="link1">Create Account</Link>
    </div>
    <div className="footer1">&copy; 2025 Your App</div>
  </div>
);
};

export default Login;
