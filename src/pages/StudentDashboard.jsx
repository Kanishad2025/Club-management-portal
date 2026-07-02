import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/student-dashboard-style.css';
import { checkLogin, logout } from '../utils/auth';
import vitLogo from '../assets/images/vitlogo.jpg';

const StudentDashboard = () => {
  const [studentName, setStudentName] = useState('');
  const [registeredEventsList, setRegisteredEventsList] = useState([]);
  const [ratings, setRatings] = useState({});
  const [allEvents, setAllEvents] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    checkLogin('student');

    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (user) {
      setStudentName(user.name);
    }

    // Initialize with dummy data if no events exist
    let events = JSON.parse(localStorage.getItem("events")) || {};
    if (Object.keys(events).length === 0) {
      events = {
        '2025-03-15': {
          name: 'Tech Workshop: Web Development',
          club: 'Tech Club',
          time: '02:00 PM',
          venue: 'Tech Lab 101',
          capacity: 50,
          status: 'upcoming'
        },
        '2025-03-18': {
          name: 'Music Fest 2025',
          club: 'Music Club',
          time: '05:00 PM',
          venue: 'Auditorium',
          capacity: 200,
          status: 'upcoming'
        },
        '2025-03-20': {
          name: 'Basketball Tournament',
          club: 'Sports Club',
          time: '03:30 PM',
          venue: 'Sports Complex',
          capacity: 100,
          status: 'upcoming'
        },
        '2025-03-10': {
          name: 'Digital Art Exhibition',
          club: 'Art Club',
          time: '10:00 AM',
          venue: 'Gallery Hall',
          capacity: 75,
          status: 'ongoing'
        },
        '2025-02-28': {
          name: 'Literary Night',
          club: 'Literary Club',
          time: '06:00 PM',
          venue: 'Main Hall',
          capacity: 150,
          status: 'completed'
        }
      };
      localStorage.setItem("events", JSON.stringify(events));
    }

    // Initialize dummy registered events for student
    let registeredEvents = JSON.parse(localStorage.getItem("registeredEvents")) || [];
    if (registeredEvents.length === 0) {
      registeredEvents = ['Tech Workshop: Web Development', 'Music Fest 2025'];
      localStorage.setItem("registeredEvents", JSON.stringify(registeredEvents));
    }

    // Initialize dummy ratings
    let eventRatings = JSON.parse(localStorage.getItem("eventRatings")) || {};
    if (Object.keys(eventRatings).length === 0) {
      eventRatings = {
        'Tech Workshop: Web Development': 5,
        'Music Fest 2025': 4
      };
      localStorage.setItem("eventRatings", JSON.stringify(eventRatings));
    }

    setRegisteredEventsList(registeredEvents);
    setRatings(eventRatings);
    
    // Convert events object to array
    const eventsArray = Object.entries(events).map(([date, event]) => ({
      ...event,
      date: date
    }));
    setAllEvents(eventsArray);
  }, []);

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const handleRegisterEvent = (eventName) => {
    if (!registeredEventsList.includes(eventName)) {
      const updated = [...registeredEventsList, eventName];
      setRegisteredEventsList(updated);
      localStorage.setItem("registeredEvents", JSON.stringify(updated));
    }
  };

  const getUpcomingEvents = () => {
    const today = new Date();
    return allEvents
      .filter(event => new Date(event.date) >= today)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 5);
  };

  const getEventsForDate = (day) => {
    const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return allEvents.filter(event => event.date === dateStr);
  };

  const handleStarClick = (event, value) => {
    const updatedRatings = { ...ratings, [event]: value };
    setRatings(updatedRatings);
    localStorage.setItem("eventRatings", JSON.stringify(updatedRatings));
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
            <h2>Student Dashboard</h2>
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
        <div className="welcome-box">
          <h3>Welcome, <span id="studentName">{studentName}</span></h3>
        </div>

        <div className="dashboard-grid">
          <div className="upcoming-events-box">
            <h3>Upcoming Events</h3>
            <div className="upcoming-events-list">
              {getUpcomingEvents().length === 0 ? (
                <p>No upcoming events</p>
              ) : (
                getUpcomingEvents().map((event) => (
                  <div key={event.name} className="upcoming-event-card">
                    <h4>{event.name}</h4>
                    <p><strong>Date:</strong> {event.date}</p>
                    <p><strong>Club:</strong> {event.club}</p>
                    {event.venue && <p><strong>Venue:</strong> {event.venue}</p>}
                    <button
                      className="register-btn"
                      onClick={() => handleRegisterEvent(event.name)}
                      disabled={registeredEventsList.includes(event.name)}
                    >
                      {registeredEventsList.includes(event.name) ? 'Registered' : 'Register'}
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="calendar-box">
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

        <div className="registered-events-box">
          <h3>My Registered Events</h3>
          <div id="registeredEvents">
            {registeredEventsList.length === 0 ? (
              <p>No events registered yet.</p>
            ) : (
              registeredEventsList.map((event) => (
                <div key={event} className="event-item">
                  <p>{event}</p>
                  <div className="rating">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <span
                        key={i}
                        className={`star ${ratings[event] >= i ? 'active-star' : ''}`}
                        onClick={() => handleStarClick(event, i)}
                        style={{ cursor: 'pointer' }}
                      >
                        &#9733;
                      </span>
                    ))}
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

export default StudentDashboard;
