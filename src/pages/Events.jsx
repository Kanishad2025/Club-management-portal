import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/events-style.css';
import vitLogo from '../assets/images/vitlogo.jpg';

const getStatus = (status, date) => {
  if (status) return status;
  if (!date) return 'upcoming';

  const eventDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  eventDate.setHours(0, 0, 0, 0);

  if (eventDate < today) return 'completed';
  if (eventDate.getTime() === today.getTime()) return 'ongoing';
  return 'upcoming';
};

const normalizeEvent = (event) => ({
  id: event._id || event.id,
  name: event.title || event.name || 'Upcoming Event',
  club: event.club || event.clubId || 'Club',
  date: event.date ? new Date(event.date).toLocaleDateString() : 'TBD',
  time: event.time || 'TBD',
  venue: event.venue || 'TBD',
  capacity: event.capacity ?? 'N/A',
  status: getStatus(event.status, event.date),
});

const Events = () => {
  const [events, setEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch('http://localhost:5000/api/events');
        if (!response.ok) {
          throw new Error(`Unable to load events: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        const eventsArray = Array.isArray(data) ? data.map(normalizeEvent) : [];
        const sortedEvents = eventsArray.sort((a, b) => new Date(a.date) - new Date(b.date));

        setEvents(sortedEvents);
        setFilteredEvents(sortedEvents);
      } catch (fetchError) {
        setError(fetchError.message || 'Failed to load events.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    let filtered = events;

    if (searchQuery) {
      filtered = filtered.filter((event) =>
        event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.club.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter((event) => event.status === filterStatus);
    }

    setFilteredEvents(filtered);
  }, [events, searchQuery, filterStatus]);

  return (
    <>
      <header className="page-header">
        <div className="header-top">
          <div className="header-left">
            <img src={vitLogo} alt="VIT Logo" className="vit-logo-page" />
            <h1>Events & Activities</h1>
          </div>
          <Link to="/" className="back-btn">← Back to Home</Link>
        </div>
      </header>

      <section className="page-content">
        <div className="filter-section">
          <input
            type="text"
            placeholder="Search events by name or club..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <div className="filter-buttons">
            <button
              className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
              onClick={() => setFilterStatus('all')}
            >
              All Events
            </button>
            <button
              className={`filter-btn ${filterStatus === 'upcoming' ? 'active' : ''}`}
              onClick={() => setFilterStatus('upcoming')}
            >
              Upcoming
            </button>
            <button
              className={`filter-btn ${filterStatus === 'ongoing' ? 'active' : ''}`}
              onClick={() => setFilterStatus('ongoing')}
            >
              Ongoing
            </button>
            <button
              className={`filter-btn ${filterStatus === 'completed' ? 'active' : ''}`}
              onClick={() => setFilterStatus('completed')}
            >
              Completed
            </button>
          </div>
        </div>

        {isLoading && <p className="loading-message">Loading events...</p>}
        {error && <p className="error-message">{error}</p>}

        <div className="events-grid">
          {!isLoading && !error && filteredEvents.length === 0 ? (
            <p className="no-results">No events found. Check back soon!</p>
          ) : (
            filteredEvents.map((event, idx) => (
              <div key={event.id || idx} className="event-card-large">
                <div className="event-header">
                  <h3>{event.name}</h3>
                  <span className={`status-badge ${event.status}`}>{event.status}</span>
                </div>
                <div className="event-info">
                  <p><strong>📅 Date:</strong> {event.date}</p>
                  <p><strong>⏰ Time:</strong> {event.time || 'TBD'}</p>
                  <p><strong>📍 Venue:</strong> {event.venue || 'TBD'}</p>
                  <p><strong>🏢 Club:</strong> {event.club}</p>
                  <p><strong>👥 Capacity:</strong> {event.capacity} seats</p>
                </div>
                <button className="register-event-btn">Register Now</button>
              </div>
            ))
          )}
        </div>
      </section>
    </>
  );
};

export default Events;
