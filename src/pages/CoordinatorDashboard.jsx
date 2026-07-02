import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/coordinator-style.css';
import { checkLogin, logout } from '../utils/auth';
import vitLogo from '../assets/images/vitlogo.jpg';

const normalizeEvent = (event) => {
  const rawDate = event.date ? new Date(event.date) : null;
  const date = rawDate ? rawDate.toISOString().split('T')[0] : '';

  return {
    id: event._id || event.id,
    name: event.title || event.name || 'Untitled Event',
    description: event.description || event.desc || '',
    date,
    venue: event.venue || event.location || '',
    time: event.time || '',
    capacity: event.capacity ?? 0,
    status: event.status || 'upcoming',
    clubId: event.clubId ? String(event.clubId) : event.clubId || '',
  };
};

const CoordinatorDashboard = () => {
  const [clubs, setClubs] = useState([]);
  const [selectedClubId, setSelectedClubId] = useState('');
  const [selectedClub, setSelectedClub] = useState(null);
  const [clubEvents, setClubEvents] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [cpiScore, setCpiScore] = useState('85.00');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    venue: '',
    clubId: '',
    time: '12:00',
    capacity: '50',
    status: 'upcoming',
  });

  const calculateClubCPI = (events) => {
    const score = 70 + Math.min(30, events.length * 2);
    return score.toFixed(2);
  };

  const fetchClubs = async (userClubId, userClubName) => {
    try {
      const response = await fetch('http://localhost:5000/api/clubs');
      if (!response.ok) {
        throw new Error(`Failed to load clubs (${response.status})`);
      }
      const data = await response.json();
      const loadedClubs = Array.isArray(data) ? data : [];
      setClubs(loadedClubs);

      let defaultClubId = userClubId || '';
      if (!defaultClubId && userClubName) {
        const match = loadedClubs.find((club) => club.clubName === userClubName || club.name === userClubName);
        defaultClubId = match ? match._id : '';
      }
      if (!defaultClubId && loadedClubs.length > 0) {
        defaultClubId = loadedClubs[0]._id;
      }

      if (defaultClubId) {
        setSelectedClubId(defaultClubId);
        setFormData((prev) => ({ ...prev, clubId: defaultClubId }));
        const club = loadedClubs.find((item) => item._id === defaultClubId);
        setSelectedClub(club || null);
      }
    } catch (error) {
      setErrorMessage(error.message || 'Unable to load clubs.');
    }
  };

  const fetchEvents = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:5000/api/events');
      if (!response.ok) {
        throw new Error(`Failed to load events (${response.status})`);
      }
      const data = await response.json();
      console.log('RAW API DATA:', data);
      const events = Array.isArray(data) ? data.map(normalizeEvent) : [];
      const sortedEvents = events.sort((a, b) => new Date(b.date) - new Date(a.date));
      console.log('NORMALIZED EVENTS:', sortedEvents);
      setClubEvents(sortedEvents);
      setCpiScore(calculateClubCPI(sortedEvents));
    } catch (error) {
      setErrorMessage(error.message || 'Unable to load events.');
    }
  }, []);

  useEffect(() => {
    checkLogin('coordinator');

    const user = JSON.parse(localStorage.getItem('currentUser'));
    const userClubId = user?.clubId || '';
    const userClubName = user?.club || '';

    fetchClubs(userClubId, userClubName);
    fetchEvents();
  }, [fetchEvents]);

  useEffect(() => {
    if (selectedClubId) {
      const club = clubs.find((item) => item._id === selectedClubId);
      setSelectedClub(club || null);
    }
  }, [selectedClubId, clubs]);

  const getDaysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

  const getFirstDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const getEventsForDate = (day) => {
    const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return clubEvents.filter((event) => event.date === dateStr);
  };

  const handleLogout = () => {
    logout();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === 'clubId') {
      setSelectedClubId(value);
    }
  };

  const handleEventSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIsSubmitting(true);

    const eventPayload = {
      title: formData.title,
      description: formData.description,
      date: formData.date,
      venue: formData.venue,
      clubId: formData.clubId,
      time: formData.time,
      capacity: parseInt(formData.capacity, 10) || 0,
      status: formData.status,
    };

    try {
      const response = await fetch('http://localhost:5000/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventPayload),
      });

      if (!response.ok) {
        throw new Error(`Failed to create event (${response.status})`);
      }

      await response.json();
      setSuccessMessage('Event created successfully!');
      setFormData((prev) => ({
        ...prev,
        title: '',
        description: '',
        date: '',
        venue: '',
        time: '12:00',
        capacity: '50',
        status: 'upcoming',
      }));
      fetchEvents(selectedClubId);
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (error) {
      setErrorMessage(error.message || 'Unable to create event.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/events/${eventId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Failed to delete event (${response.status})`);
      }

      setSuccessMessage('Event deleted successfully!');
      fetchEvents(selectedClubId);
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (error) {
      setErrorMessage(error.message || 'Unable to delete event.');
    }
  };

  return (
    <>
      <header className="dashboard-header">
        <div className="header-top">
          <div className="header-left">
            <img src={vitLogo} alt="VIT Logo" className="vit-logo-dashboard" />
            <h2>Coordinator Dashboard</h2>
          </div>
          <div className="header-right">
            <Link to="/" className="nav-btn">Home</Link>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </header>

      <section className="dashboard-content">
        <div className="coordinator-grid">
          <div className="cpi-section">
            <h3>Club Performance Index (CPI)</h3>
            <h2 style={{ fontSize: '2em' }}>
              CPI Score: <span id="cpiScore">{cpiScore}</span>
            </h2>
            <div className="memberCountBox" style={{ borderRadius: '10px', boxShadow: '2px 2px 5px rgba(0,0,0,0.3)', padding: '15px', marginTop: '20px' }}>
              <p><strong>Club:</strong> {selectedClub?.clubName || selectedClub?.name || 'Your Club'}</p>
              <p><strong>Total Members:</strong> <span id="totalMembers">{selectedClub?.members ?? 0}</span></p>
            </div>
          </div>

          <div className="activity-graph-section">
            <h3>Activities in Last 6 Months</h3>
            <div className="activity-chart">
              <div className="chart-bar">
                <div className="month-label">September</div>
                <div className="bar-container">
                  <div className="bar" style={{ height: '45%', background: 'linear-gradient(135deg, #533B4D 0%, #FAA4BD 100%)' }}></div>
                  <div className="bar-value">8 events</div>
                </div>
              </div>
              <div className="chart-bar">
                <div className="month-label">October</div>
                <div className="bar-container">
                  <div className="bar" style={{ height: '65%', background: 'linear-gradient(135deg, #533B4D 0%, #FAA4BD 100%)' }}></div>
                  <div className="bar-value">12 events</div>
                </div>
              </div>
              <div className="chart-bar">
                <div className="month-label">November</div>
                <div className="bar-container">
                  <div className="bar" style={{ height: '75%', background: 'linear-gradient(135deg, #533B4D 0%, #FAA4BD 100%)' }}></div>
                  <div className="bar-value">14 events</div>
                </div>
              </div>
              <div className="chart-bar">
                <div className="month-label">December</div>
                <div className="bar-container">
                  <div className="bar" style={{ height: '55%', background: 'linear-gradient(135deg, #533B4D 0%, #FAA4BD 100%)' }}></div>
                  <div className="bar-value">10 events</div>
                </div>
              </div>
              <div className="chart-bar">
                <div className="month-label">January</div>
                <div className="bar-container">
                  <div className="bar" style={{ height: '70%', background: 'linear-gradient(135deg, #533B4D 0%, #FAA4BD 100%)' }}></div>
                  <div className="bar-value">13 events</div>
                </div>
              </div>
              <div className="chart-bar">
                <div className="month-label">February</div>
                <div className="bar-container">
                  <div className="bar" style={{ height: '80%', background: 'linear-gradient(135deg, #533B4D 0%, #FAA4BD 100%)' }}></div>
                  <div className="bar-value">15 events</div>
                </div>
              </div>
            </div>
          </div>

          <div className="calendar-section">
            <h3>Event Calendar</h3>
            <div className="calendar">
              <div className="calendar-header">
                <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}>&larr;</button>
                <h4>{currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h4>
                <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}>&rarr;</button>
              </div>
              <div className="calendar-days">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div key={day} className="calendar-day-header">{day}</div>
                ))}
              </div>
              <div className="calendar-grid">
                {Array.from({ length: getFirstDayOfMonth(currentMonth) }).map((_, i) => (
                  <div key={`empty-${i}`} className="calendar-empty"></div>
                ))}
                {Array.from({ length: getDaysInMonth(currentMonth) }).map((_, i) => {
                  const day = i + 1;
                  const hasEvent = getEventsForDate(day).length > 0;
                  return (
                    <div key={day} className={`calendar-day ${hasEvent ? 'has-event' : ''}`}>
                      {day}
                      {hasEvent && <div className="event-indicator"></div>}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div id="createEventDiv" className="event-form-section">
          <h3>Create an Event</h3>
          {successMessage && <p style={{ color: '#2e7d32', marginBottom: '15px' }}>{successMessage}</p>}
          {errorMessage && <p style={{ color: '#c62828', marginBottom: '15px' }}>{errorMessage}</p>}
          <form id="eventForm" onSubmit={handleEventSubmit}>
            <div className="form-group">
              <label htmlFor="title">Event Title:</label>
              <input type="text" id="title" name="title" value={formData.title} onChange={handleInputChange} required />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description:</label>
              <input type="text" id="description" name="description" value={formData.description} onChange={handleInputChange} required />
            </div>

            <div className="form-group">
              <label htmlFor="date">Date:</label>
              <input type="date" id="date" name="date" value={formData.date} onChange={handleInputChange} required />
            </div>

            <div className="form-group">
              <label htmlFor="venue">Venue:</label>
              <input type="text" id="venue" name="venue" value={formData.venue} onChange={handleInputChange} required />
            </div>

            <div className="form-group">
              <label htmlFor="clubId">Club</label>
              <select id="clubId" name="clubId" value={formData.clubId} onChange={handleInputChange} required>
                <option value="">Select a club</option>
                {clubs.map((club) => (
                  <option key={club._id} value={club._id}>
                    {club.clubName || club.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="time">Time:</label>
              <input type="time" id="time" name="time" value={formData.time} onChange={handleInputChange} required />
            </div>

            <div className="form-group">
              <label htmlFor="capacity">Registration Capacity:</label>
              <input type="number" id="capacity" name="capacity" value={formData.capacity} onChange={handleInputChange} required />
            </div>

            <div className="form-group">
              <label htmlFor="status">Status:</label>
              <select id="status" name="status" value={formData.status} onChange={handleInputChange}>
                <option value="upcoming">Upcoming</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <button type="submit" className="submit-btn" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Event'}
            </button>
          </form>
        </div>

        <div className="events-section">
          <h3>Club Events</h3>
          <div className="events-list-coordinator">
            {clubEvents.length === 0 ? (
              <p>No events created yet.</p>
            ) : (
              clubEvents.map((event) => (
                <div key={event.id}>
                  <h4>{event.name}</h4>
                  <p>{event.date}</p>
                  <p>{event.venue}</p>
                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteEvent(event.id)}
                  >
                    Delete Event
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default CoordinatorDashboard;
