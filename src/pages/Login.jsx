import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/login_style.css";
import vitLogo from "../assets/images/vitlogo.jpg";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email,
            password
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message);
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem(
        "currentUser",
        JSON.stringify(data.user)
      );

      setMessage("Login Successful! Redirecting...");

      setTimeout(() => {
        if (data.user.role === "student") {
          window.location.href = "/student-dashboard";
        } else if (data.user.role === "coordinator") {
          window.location.href = "/coordinator-dashboard";
        } else {
          window.location.href = "/admin-dashboard";
        }
      }, 1000);

    } catch (error) {
      console.error(error);
      setMessage("Server Error");
    }
  };

  return (
    <>
      <header className="login-header">
        <div className="header-content">
          <Link to="/" className="logo-link">
            <img
              src={vitLogo}
              alt="VIT Logo"
              className="vit-logo-header"
            />
            <span className="brand-name">
              VIT Portal
            </span>
          </Link>
        </div>
      </header>

      <section className="login-page">
        <div className="login-container">
          <h2>Login to Portal</h2>

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                required
              />
            </div>

            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                required
              />
            </div>

            <button
              type="submit"
              className="login-submit"
            >
              Login
            </button>

            <p className="register-link">
              Don't have an account?{" "}
              <Link to="/register">
                Register
              </Link>
            </p>

            <p>{message}</p>
          </form>
        </div>
      </section>
    </>
  );
};

export default Login;