import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/announcements-style.css';
import vitLogo from '../assets/images/vitlogo.jpg';

const normalizeAnnouncement = (announcement) => ({
  id: announcement._id || announcement.id,
  title: announcement.title || 'Untitled',
  content: announcement.content || '',
  club: announcement.author || 'Admin',
  priority: announcement.priority || 'normal',
  date: announcement.createdAt ? new Date(announcement.createdAt).toLocaleDateString() : 'N/A',
  time: announcement.createdAt ? new Date(announcement.createdAt).toLocaleTimeString() : 'N/A'
});

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    club: 'Tech Club',
    priority: 'normal'
  });

  useEffect(() => {
    const fetchAnnouncements = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch('http://localhost:5000/api/announcements');
        if (!response.ok) {
          throw new Error(`Unable to load announcements: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        const normalizedAnnouncements = Array.isArray(data)
          ? data.map(normalizeAnnouncement)
          : [];
        setAnnouncements(normalizedAnnouncements);
      } catch (fetchError) {
        setError(fetchError.message || 'Failed to load announcements.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newAnnouncement = {
      id: Date.now(),
      ...formData,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString()
    };
    const updated = [newAnnouncement, ...announcements];
    setAnnouncements(updated);
    setFormData({
      title: '',
      content: '',
      club: 'Tech Club',
      priority: 'normal'
    });
    setShowForm(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this announcement?')) {
      const updated = announcements.filter(a => a.id !== id);
      setAnnouncements(updated);
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return '#d32f2f';
      case 'medium': return '#f57c00';
      case 'low': return '#388e3c';
      default: return '#1976d2';
    }
  };

  return (
    <>
      <header className="page-header">
        <div className="header-top">
          <div className="header-left">
            <img src={vitLogo} alt="VIT Logo" className="vit-logo-page" />
            <h1>Announcements & Updates</h1>
          </div>
          <div className="header-right">
            <button
              className="create-btn"
              onClick={() => setShowForm(!showForm)}
            >
              {showForm ? '✕ Cancel' : '+ New Announcement'}
            </button>
            <Link to="/" className="back-btn">← Back</Link>
          </div>
        </div>
      </header>

      <section className="page-content">
        {showForm && (
          <div className="form-section">
            <h2>Create New Announcement</h2>
            <form onSubmit={handleSubmit} className="announcement-form">
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Announcement title..."
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Club</label>
                  <select
                    name="club"
                    value={formData.club}
                    onChange={handleChange}
                  >
                    <option>Tech Club</option>
                    <option>Sports Club</option>
                    <option>Art Club</option>
                    <option>Music Club</option>
                    <option>Literary Club</option>
                    <option>Environment Club</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Priority</label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                  >
                    <option value="low">Low</option>
                    <option value="normal">Normal</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Content</label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  placeholder="Write your announcement here..."
                  rows="6"
                  required
                />
              </div>

              <button type="submit" className="submit-btn">Post Announcement</button>
            </form>
          </div>
        )}

        {isLoading && <p className="loading-message">Loading announcements...</p>}
        {error && <p className="error-message">{error}</p>}

        <div className="announcements-list">
          <h2>Latest Announcements</h2>
          {!isLoading && !error && announcements.length === 0 ? (
            <p className="no-results">No announcements yet.</p>
          ) : (
            announcements.map(announcement => (
              <div
                key={announcement.id}
                className="announcement-card"
                style={{ borderLeftColor: getPriorityColor(announcement.priority) }}
              >
                <div className="announcement-header">
                  <div>
                    <h3>{announcement.title}</h3>
                    <div className="meta">
                      <span className="club">{announcement.club}</span>
                      <span className="date">{announcement.date} at {announcement.time}</span>
                      <span className="priority" style={{ color: getPriorityColor(announcement.priority) }}>
                        {announcement.priority.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(announcement.id)}
                  >
                    ✕
                  </button>
                </div>
                <div className="announcement-content">
                  <p>{announcement.content}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </>
  );
};

export default Announcements;
