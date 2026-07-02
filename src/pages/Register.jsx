import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/register_style.css';
import vitLogo from '../assets/images/vitlogo.jpg';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('student');
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Initialization if needed
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, email, password, role })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Registration successful! Redirecting to login...");

        setTimeout(() => {
          window.location.href = "/login";
        }, 1500);
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage("Server error. Try again.");
    }
  };

  return (
    <>
      <header className="login-header">
        <div className="header-content">
          <Link to="/" className="logo-link">
            <img src={vitLogo} alt="VIT Logo" className="vit-logo-header" />
            <span className="brand-name">VIT Portal</span>
          </Link>
        </div>
      </header>
      <section className="login-page">
        <div className="login-container">
          <h2>Create Account</h2>

        <form id="registerForm" onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Full Name</label>
            <input 
              type="text" 
              id="name" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required 
            />
          </div>

          <div className="input-group">
            <label>Email</label>
            <input 
              type="email" 
              id="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input 
              type="password" 
              id="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>

          <div className="input-group">
            <label>Confirm Password</label>
            <input 
              type="password" 
              id="confirmPassword" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required 
            />
          </div>

          <div className="input-group">
            <label>Role</label>
            <select 
              id="role" 
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="student">Student</option>
              <option value="coordinator">Coordinator</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button type="submit" className="login-submit">Register</button>

          <p className="register-link">
            Already have an account? <Link to="/login">Login</Link>
          </p>

          <p id="registerMessage">{message}</p>
        </form>
      </div>
    </section>
    </>
  );
};

export default Register;
