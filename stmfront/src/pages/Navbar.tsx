import React, { useEffect, useState }  from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css"; // reuse the same CSS
import { useUser } from "./UserContext";
interface User {
  token_type: string;
  user_id?: number;
}

const Navbar: React.FC = () => {
   const { user, setUser } = useUser();
  const navigate = useNavigate();

  // Check login status when Navbar mounts
  // useEffect(() => {
  //   const storedUser = localStorage.getItem("user");
  //   if (storedUser && storedUser !== "{}") {
  //     setUser(JSON.parse(storedUser));
  //   } else {
  //     setUser(null);
  //   }
  // },[]);

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <div className="navbar">
      <h1 className="heading">Simple Tasks Manager</h1>
      <div className="nav-buttons">
        {!user? (
          <>
            <button onClick={() => navigate("/login")} className="btn-nav">
              Login
            </button>
            <button onClick={() => navigate("/register")} className="btn-nav">
              Create Account
            </button>
          </>
        ) : (
          <button onClick={handleLogout} className="btn-nav">
            Logout
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
