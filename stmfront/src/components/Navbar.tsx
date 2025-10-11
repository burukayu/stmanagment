import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 20px",
        backgroundColor: "#072b72ff",
        color: "white",
      }}
    >
      <h2 style={{ margin: 0 }}>Task Manager</h2>

      <div>
        {!token ? (
          <>
            <Link
              to="/login"
              style={{ color: "white", marginRight: "20px", textDecoration: "none" }}
            >
              Login
            </Link>
            <Link
              to="/register"
              style={{
                color: "white",
                // backgroundColor: "#d5e3e7ff",
                padding: "6px 12px",
                // borderRadius: "5px",
                textDecoration: "none",
              }}
            >
              Create Account
            </Link>
          </>
        ) : (
          <button
            onClick={handleLogout}
            style={{
              backgroundColor: "transparent",
              color: "white",
              padding: "6px 12px",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
