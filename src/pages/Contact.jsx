import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/contact-style.css';
import vitLogo from '../assets/images/vitlogo.jpg';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Save to localStorage
    const messages = JSON.parse(localStorage.getItem('contacts')) || [];
    messages.push({
      id: Date.now(),
      ...formData,
      date: new Date().toLocaleDateString()
    });
    localStorage.setItem('contacts', JSON.stringify(messages));
    setSubmitted(true);
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <>
      <header className="page-header">
        <div className="header-top">
          <div className="header-left">
            <img src={vitLogo} alt="VIT Logo" className="vit-logo-page" />
            <h1>Contact Us</h1>
          </div>
          <Link to="/" className="back-btn">← Back to Home</Link>
        </div>
      </header>

      <section className="page-content contact-content">
        <div className="contact-grid">
          <div className="contact-info">
            <h2>Get in Touch</h2>
            <p>Have questions about clubs and events? We'd love to hear from you!</p>

            <div className="info-cards">
              <div className="info-card">
                <h3>📧 Email</h3>
                <p>clubs@vit.edu</p>
                <p className="subtext">For general inquiries</p>
              </div>

              <div className="info-card">
                <h3>📞 Phone</h3>
                <p>+91 (600) 123-4567</p>
                <p className="subtext">Monday - Friday, 9AM - 5PM</p>
              </div>

              <div className="info-card">
                <h3>📍 Location</h3>
                <p>VIT Chennai Campus</p>
                <p className="subtext">Tiruvallur, Chennai</p>
              </div>

              <div className="info-card">
                <h3>🕐 Hours</h3>
                <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                <p className="subtext">Saturday - Sunday: Closed</p>
              </div>
            </div>

            <div className="follow-section">
              <h3>Follow Us</h3>
              <div className="social-links">
                <a href="https://facebook.com" target="_blank" rel="noreferrer" className="social-link">Facebook</a>
                <a href="https://instagram.com" target="_blank" rel="noreferrer" className="social-link">Instagram</a>
                <a href="https://twitter.com" target="_blank" rel="noreferrer" className="social-link">Twitter</a>
                <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="social-link">LinkedIn</a>
              </div>
            </div>
          </div>

          <div className="contact-form-section">
            <h2>Send us a Message</h2>
            {submitted && (
              <div className="success-message">
                ✓ Thank you! Your message has been received. We'll get back to you soon.
              </div>
            )}
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  required
                />
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your.email@vit.edu"
                  required
                />
              </div>

              <div className="form-group">
                <label>Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="What is this about?"
                  required
                />
              </div>

              <div className="form-group">
                <label>Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Your message..."
                  rows="6"
                  required
                />
              </div>

              <button type="submit" className="submit-btn">Send Message</button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;
