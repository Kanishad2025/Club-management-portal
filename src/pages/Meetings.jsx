import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/meetings-style.css';
import vitLogo from '../assets/images/vitlogo.jpg';

const Meetings = () => {
  const [meetings, setMeetings] = useState(() => {
    const saved = localStorage.getItem('meetings');
    return saved ? JSON.parse(saved) : [];
  });

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    agenda: '',
    club: 'Tech Club',
    notes: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newMeeting = {
      id: Date.now(),
      ...formData,
      createdAt: new Date().toLocaleDateString()
    };
    const updated = [...meetings, newMeeting];
    setMeetings(updated);
    localStorage.setItem('meetings', JSON.stringify(updated));
    setFormData({
      title: '',
      date: '',
      time: '',
      agenda: '',
      club: 'Tech Club',
      notes: ''
    });
    setShowForm(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this meeting?')) {
      const updated = meetings.filter(m => m.id !== id);
      setMeetings(updated);
      localStorage.setItem('meetings', JSON.stringify(updated));
    }
  };

  return (
    <>
      <header className="page-header">
        <div className="header-top">
          <div className="header-left">
            <img src={vitLogo} alt="VIT Logo" className="vit-logo-page" />
            <h1>Club Meetings</h1>
          </div>
          <div className="header-right">
            <button
              className="create-btn"
              onClick={() => setShowForm(!showForm)}
            >
              {showForm ? '✕ Cancel' : '+ Schedule Meeting'}
            </button>
            <Link to="/" className="back-btn">← Back</Link>
          </div>
        </div>
      </header>

      <section className="page-content">
        {showForm && (
          <div className="form-section">
            <h2>Schedule a New Meeting</h2>
            <form onSubmit={handleSubmit} className="meeting-form">
              <div className="form-group">
                <label>Meeting Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Monthly Planning Session"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Date</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Time</label>
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

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
                <label>Meeting Agenda</label>
                <textarea
                  name="agenda"
                  value={formData.agenda}
                  onChange={handleChange}
                  placeholder="List the agenda items..."
                  rows="4"
                />
              </div>

              <div className="form-group">
                <label>Meeting Notes</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Add any additional notes..."
                  rows="3"
                />
              </div>

              <button type="submit" className="submit-btn">Schedule Meeting</button>
            </form>
          </div>
        )}

        <div className="meetings-list">
          <h2>Scheduled Meetings</h2>
          {meetings.length === 0 ? (
            <p className="no-results">No meetings scheduled yet.</p>
          ) : (
            meetings.map(meeting => (
              <div key={meeting.id} className="meeting-card">
                <div className="meeting-header">
                  <h3>{meeting.title}</h3>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(meeting.id)}
                  >
                    ✕
                  </button>
                </div>
                <div className="meeting-details">
                  <p><strong>📅 Date:</strong> {meeting.date}</p>
                  <p><strong>⏰ Time:</strong> {meeting.time}</p>
                  <p><strong>🏢 Club:</strong> {meeting.club}</p>
                </div>
                {meeting.agenda && (
                  <div className="agenda-section">
                    <h4>📋 Agenda:</h4>
                    <p>{meeting.agenda}</p>
                  </div>
                )}
                {meeting.notes && (
                  <div className="notes-section">
                    <h4>📝 Notes:</h4>
                    <p>{meeting.notes}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </section>
    </>
  );
};

export default Meetings;
