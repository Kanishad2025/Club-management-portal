import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/admin_style.css';
import { checkLogin, logout } from '../utils/auth';
import vitLogo from '../assets/images/vitlogo.jpg';

const AdminDashboard = () => {
  const [clubs, setClubs] = useState([]);
  const [allEvents, setAllEvents] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [totalClubs, setTotalClubs] = useState(0);
  const [totalEvents, setTotalEvents] = useState(0);
  const [totalAnnouncements, setTotalAnnouncements] = useState(0);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState(null);

  const calculateClubCPI = (clubName) => {
    // Calculate CPI based on API events
    const clubEvents = allEvents.filter(event => {
      const eventClubId = event.clubId ? event.clubId.toString() : '';
      const eventClubName = event.club || event.title || '';
      return eventClubName === clubName || eventClubId === clubName;
    });

    const eventCount = clubEvents.length;
    // For now, use basic CPI calculation - can be enhanced with participant and rating data
    const CPI = eventCount * 10; // Simple calculation: 10 points per event
    return CPI.toFixed(2);
  };

  // Fetch events and clubs from backend API
  useEffect(() => {
    checkLogin('admin');

    const fetchEventsAndClubs = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/events');
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        
        const eventsData = await response.json();
        const normalizedEvents = Array.isArray(eventsData) 
          ? eventsData.map(event => ({
              id: event._id,
              title: event.title,
              description: event.description,
              date: event.date ? new Date(event.date).toISOString().split('T')[0] : '',
              venue: event.venue,
              clubId: event.clubId,
              club: event.title, // Use title as display name
              time: '02:00 PM', // Default time from API
              capacity: 50, // Default capacity
              status: 'upcoming'
            }))
          : [];

        setAllEvents(normalizedEvents);

        // Extract unique clubs from events
        const clubsSet = new Set();
        normalizedEvents.forEach(event => {
          if (event.club) {
            clubsSet.add(event.club);
          }
        });
        setClubs(Array.from(clubsSet));
      } catch (error) {
        console.error('Error fetching events:', error);
        setAllEvents([]);
        setClubs([]);
      }
    };

    fetchEventsAndClubs();
  }, []);

  // Fetch statistics from backend API
  useEffect(() => {
    const fetchStatistics = async () => {
      setStatsLoading(true);
      setStatsError(null);

      try {
        const [clubsRes, eventsRes, announcementsRes] = await Promise.all([
          fetch('http://localhost:5000/api/clubs'),
          fetch('http://localhost:5000/api/events'),
          fetch('http://localhost:5000/api/announcements')
        ]);

        if (clubsRes.ok) {
          const clubsData = await clubsRes.json();
          setTotalClubs(Array.isArray(clubsData) ? clubsData.length : 0);
        }

        if (eventsRes.ok) {
          const eventsData = await eventsRes.json();
          setTotalEvents(Array.isArray(eventsData) ? eventsData.length : 0);
        }

        if (announcementsRes.ok) {
          const announcementsData = await announcementsRes.json();
          setTotalAnnouncements(Array.isArray(announcementsData) ? announcementsData.length : 0);
        }
      } catch (error) {
        setStatsError('Failed to load statistics');
        console.error('Error fetching statistics:', error);
      } finally {
        setStatsLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getEventsForDate = (day) => {
    const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return allEvents.filter(event => event.date === dateStr);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      <header className="dashboard-header">
        <div className="header-top">
          <div className="header-left">
            <img src={vitLogo} alt="VIT Logo" className="vit-logo-dashboard" />
            <h2>Administrator Dashboard</h2>
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
        <div className="statistics-section" style={{ display: 'flex', gap: '20px', marginBottom: '30px', justifyContent: 'space-around' }}>
          <div className="stat-card" style={{ flex: 1, padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', textAlign: 'center' }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#666', fontSize: '14px', textTransform: 'uppercase' }}>Total Clubs</h3>
            {statsLoading ? (
              <p style={{ margin: 0, fontSize: '28px', fontWeight: 'bold', color: '#333' }}>Loading...</p>
            ) : statsError ? (
              <p style={{ margin: 0, fontSize: '28px', fontWeight: 'bold', color: '#d32f2f' }}>Error</p>
            ) : (
              <p style={{ margin: 0, fontSize: '28px', fontWeight: 'bold', color: '#1976d2' }}>{totalClubs}</p>
            )}
          </div>

          <div className="stat-card" style={{ flex: 1, padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', textAlign: 'center' }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#666', fontSize: '14px', textTransform: 'uppercase' }}>Total Events</h3>
            {statsLoading ? (
              <p style={{ margin: 0, fontSize: '28px', fontWeight: 'bold', color: '#333' }}>Loading...</p>
            ) : statsError ? (
              <p style={{ margin: 0, fontSize: '28px', fontWeight: 'bold', color: '#d32f2f' }}>Error</p>
            ) : (
              <p style={{ margin: 0, fontSize: '28px', fontWeight: 'bold', color: '#388e3c' }}>{totalEvents}</p>
            )}
          </div>

          <div className="stat-card" style={{ flex: 1, padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', textAlign: 'center' }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#666', fontSize: '14px', textTransform: 'uppercase' }}>Total Announcements</h3>
            {statsLoading ? (
              <p style={{ margin: 0, fontSize: '28px', fontWeight: 'bold', color: '#333' }}>Loading...</p>
            ) : statsError ? (
              <p style={{ margin: 0, fontSize: '28px', fontWeight: 'bold', color: '#d32f2f' }}>Error</p>
            ) : (
              <p style={{ margin: 0, fontSize: '28px', fontWeight: 'bold', color: '#f57c00' }}>{totalAnnouncements}</p>
            )}
          </div>
        </div>

        <div className="admin-grid">
          <div className="clubs-section">
            <h3>All Clubs Performance Overview</h3>
            <div id="clubCPIContainer" className="club-container">
              {clubs.map((club) => (
                <div key={club} className="club-card">
                  <h4>{club}</h4>
                  <div className="cpi-score">
                    CPI: {calculateClubCPI(club)}
                  </div>
                </div>
              ))}
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
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
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

        <div className="all-events-section">
          <h3>All Upcoming Events</h3>
          <div className="events-list">
            {allEvents.length === 0 ? (
              <p>No events created yet.</p>
            ) : (
              allEvents
                .sort((a, b) => new Date(a.date) - new Date(b.date))
                .map((event, idx) => (
                  <div key={idx} className="event-card-admin">
                    <h4>{event.title}</h4>
                    <div className="event-details">
                      <p><strong>Date:</strong> {event.date}</p>
                      <p><strong>Club:</strong> {event.club}</p>
                      {event.venue && <p><strong>Venue:</strong> {event.venue}</p>}
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default AdminDashboard;