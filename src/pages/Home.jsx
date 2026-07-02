import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/style.css';
import vitLogo from '../assets/images/vitlogo.jpg';
import campusImage from '../assets/images/campus.jpg';
import vit1Image from '../assets/images/vit1.jpg';

const Home = () => {
  useEffect(() => {
    // Load home page script if needed
  }, []);

  return (
    <>
      {/* TOP NAVBAR WITH LOGO */}
      <header>
        <nav className="top-nav" id="navbar">
          <div className="navbar-left">
            <img src={vitLogo} alt="VIT Logo" className="vit-logo" />
            <span className="brand-name">VIT Portal</span>
          </div>
          <div className="navbar-right">
            <Link to="/clubs" className="nav-link">Clubs</Link>
            <Link to="/events" className="nav-link">Events</Link>
            <Link to="/meetings" className="nav-link">Meetings</Link>
            <Link to="/announcements" className="nav-link">Announcements</Link>
            <Link to="/contact" className="nav-link">Contact</Link>
            <Link to="/login" className="nav-link login-link">Login</Link>
            <Link to="/register" className="nav-link register-link">Register</Link>
          </div>
        </nav>
      </header>

      {/* FULL BACKGROUND IMAGE */}
      <section className="hero" style={{backgroundImage: `url(${campusImage})`, backgroundSize: 'cover', backgroundPosition: 'center'}}>
        <div className="hero-overlay">
          <h1>CLUBS AND CHAPTERS</h1>
          <p>VIT, CHENNAI</p>
        </div>
      </section>

      {/* WHITE CONTENT OVER IMAGE */}
      <section className="content">
        {/* FANCY NAV BUTTONS */}
        <div className="floating-nav">
          <Link to="/clubs" className="float-nav-link">Clubs</Link>
          <Link to="/events" className="float-nav-link">Events</Link>
          <Link to="/meetings" className="float-nav-link">Meetings</Link>
          <Link to="/announcements" className="float-nav-link">Announcements</Link>
        </div>

        <div className="about-campus-wrapper">
          <div className="about-campus">
            <div className="about-text">
              <h2>About Our Campus</h2>
              <p>
                Our campus provides a vibrant environment for students to
                grow academically and socially through clubs and events.
              </p>
              <p>
                This portal empowers students, coordinators, and
                administrators with seamless event and club management.
              </p>
            </div>

            <div className="about-image">
              <img src={vit1Image} alt="Campus" className="campus-photo" />
            </div>
          </div>
        </div>

        {/* CLUBS SECTION */}
        <section className="clubs-section" id="clubs">
          <h2>Our Clubs & Communities</h2>
          <div className="clubs-container">
            <Link to="/club/1" className="club-card-link">
              <div className="club-card">
                <div className="club-icon">🔬</div>
                <h3>Tech Club</h3>
                <p>Explore technology, coding, and innovation</p>
                <span className="members">150+ Members</span>
              </div>
            </Link>

            <Link to="/club/2" className="club-card-link">
              <div className="club-card">
                <div className="club-icon">⚽</div>
                <h3>Sports Club</h3>
                <p>Excellence in athletics and team sports</p>
                <span className="members">200+ Members</span>
              </div>
            </Link>

            <Link to="/club/3" className="club-card-link">
              <div className="club-card">
                <div className="club-icon">🎨</div>
                <h3>Art Club</h3>
                <p>Creative expression through visual arts</p>
                <span className="members">120+ Members</span>
              </div>
            </Link>

            <Link to="/club/4" className="club-card-link">
              <div className="club-card">
                <div className="club-icon">🎵</div>
                <h3>Music Club</h3>
                <p>Celebrating the power of music and sound</p>
                <span className="members">180+ Members</span>
              </div>
            </Link>

            <Link to="/club/5" className="club-card-link">
              <div className="club-card">
                <div className="club-icon">📚</div>
                <h3>Literary Club</h3>
                <p>Reading, writing, and storytelling passion</p>
                <span className="members">95+ Members</span>
              </div>
            </Link>

            <Link to="/club/6" className="club-card-link">
              <div className="club-card">
                <div className="club-icon">🌍</div>
                <h3>Environment Club</h3>
                <p>Sustainability and environmental awareness</p>
                <span className="members">140+ Members</span>
              </div>
            </Link>
          </div>
        </section>
      </section>
    </>
  );
};

export default Home;
