import React, { useEffect, useState } from 'react';
import { useParams, Link, useLocation, useSearchParams } from 'react-router-dom';
import '../styles/club-detail-style.css';
import vitLogo from '../assets/images/vitlogo.jpg';

const dummyClubs = [
  {
    id: 'ai',
    name: 'AI Club',
    type: 'tech',
    description: 'A creative community for students who love machine learning, innovation, and building smart solutions.',
    coordinator: 'Dr. Meera',
    members: 42,
    email: 'ai.club@vit.edu',
    mission: 'Make AI approachable, practical, and fun for every learner.',
    highlights: ['Weekly coding sessions', 'Hands-on ML workshops', 'Hackathon prep'],
    upcomingEvents: ['AI Demo Day', 'Computer Vision Workshop', 'Open House Meet-up'],
  },
  {
    id: 'tech',
    name: 'Tech Club',
    type: 'tech',
    description: 'A hands-on club for coding, app development, robotics, and emerging technologies.',
    coordinator: 'Prof. Arjun',
    members: 64,
    email: 'tech.club@vit.edu',
    mission: 'Build practical tech skills and turn ideas into real-world solutions.',
    highlights: ['Build projects every month', 'Coding bootcamps', 'Innovation challenges'],
    upcomingEvents: ['Web Dev Sprint', 'Robotics Lab', 'Tech Talk Series'],
  },
  {
    id: 'sports',
    name: 'Sports Club',
    type: 'sports',
    description: 'A vibrant club for fitness, teamwork, and healthy competition across multiple games.',
    coordinator: 'Coach Nikhil',
    members: 58,
    email: 'sports.club@vit.edu',
    mission: 'Promote physical wellness, discipline, and sportsmanship.',
    highlights: ['Inter-college tournaments', 'Fitness challenges', 'Team-building sessions'],
    upcomingEvents: ['Football Trial Day', 'Basketball Skills Clinic', 'Annual Sports Fest'],
  },
  {
    id: 'art',
    name: 'Art & Culture Club',
    type: 'culture',
    description: 'A welcoming space for creative expression through art, music, dance, and cultural events.',
    coordinator: 'Ms. Riya',
    members: 37,
    email: 'culture.club@vit.edu',
    mission: 'Celebrate creativity and preserve cultural traditions through performance and design.',
    highlights: ['Art exhibitions', 'Cultural festivals', 'Photography walks'],
    upcomingEvents: ['Canvas Workshop', 'Cultural Night', 'Street Art Session'],
  },
];

const normalizeClub = (club, fallback = {}) => ({
  id: club?._id || club?.id || fallback.id || 'unknown',
  name: club?.clubName || club?.name || fallback.name || 'Unnamed Club',
  description: club?.description || fallback.description || '',
  coordinator: club?.coordinator || fallback.coordinator || 'N/A',
  members: club?.members ?? fallback.members ?? 0,
  email: club?.email || fallback.email || '',
  mission: club?.mission || fallback.mission || '',
  highlights: club?.highlights || fallback.highlights || [],
  upcomingEvents: club?.upcomingEvents || fallback.upcomingEvents || [],
  type: club?.type || fallback.type || 'general',
});

const getDummyClub = (id, name = '') => {
  const key = String(id || '').toLowerCase();
  const nameKey = String(name || '').toLowerCase();
  const matched = dummyClubs.find((club) => club.id === key || nameKey.includes(club.name.toLowerCase().split(' ')[0]));

  if (matched) {
    return matched;
  }

  if (nameKey.includes('tech') || nameKey.includes('code') || nameKey.includes('ai') || nameKey.includes('robot')) {
    return dummyClubs.find((club) => club.type === 'tech') || dummyClubs[1];
  }

  if (nameKey.includes('sport') || nameKey.includes('football') || nameKey.includes('cricket') || nameKey.includes('basketball')) {
    return dummyClubs.find((club) => club.type === 'sports') || dummyClubs[2];
  }

  return {
    id: key || 'community',
    name: 'Community Club',
    type: 'general',
    description: 'This club brings students together through engaging events, workshops, and shared learning experiences.',
    coordinator: 'Student Coordinator',
    members: 30,
    email: 'community.club@vit.edu',
    mission: 'Create a friendly platform for collaboration, confidence, and growth.',
    highlights: ['Regular meetups', 'Skill-sharing sessions', 'Community outreach'],
    upcomingEvents: ['Welcome Session', 'Workshop', 'Networking Meet'],
  };
};

const ClubDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const clubName = searchParams.get('name') || '';
  const clubDescription = searchParams.get('description') || '';
  const clubCoordinator = searchParams.get('coordinator') || '';
  const clubMembers = Number(searchParams.get('members')) || 0;
  const [club, setClub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClub = async () => {
      setLoading(true);
      setError(null);

      const currentPassedClub = location.state?.club || {
        id,
        name: clubName,
        description: clubDescription,
        coordinator: clubCoordinator,
        members: clubMembers,
      };
      const fallbackClub = getDummyClub(id, currentPassedClub?.name || currentPassedClub?.clubName || '');

      if (currentPassedClub?.name || currentPassedClub?.clubName) {
        setClub(normalizeClub(currentPassedClub, fallbackClub));
      }

      try {
        const response = await fetch(`http://localhost:5000/api/clubs/${id}`);

        if (!response.ok) {
          if (!currentPassedClub?.name && !currentPassedClub?.clubName) {
            setClub(normalizeClub(null, fallbackClub));
          }
          return;
        }

        const data = await response.json();
        setClub(normalizeClub(data, fallbackClub));
      } catch (fetchError) {
        if (!currentPassedClub?.name && !currentPassedClub?.clubName) {
          setClub(normalizeClub(null, fallbackClub));
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchClub();
    }
  }, [id, clubName, clubDescription, clubCoordinator, clubMembers, location.state]);

  if (loading) {
    return (
      <section className="club-detail-content">
        <p className="loading-message">Loading club details...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="club-detail-content">
        <p className="error-message">{error}</p>
        <Link to="/clubs" className="back-btn">
          ← Back to Clubs
        </Link>
      </section>
    );
  }

  if (!club) {
    return (
      <section className="club-detail-content">
        <p className="error-message">Club not found.</p>
        <Link to="/clubs" className="back-btn">
          ← Back to Clubs
        </Link>
      </section>
    );
  }

  return (
    <>
      <header className="page-header">
        <div className="header-top">
          <div className="header-left">
            <img src={vitLogo} alt="VIT Logo" className="vit-logo-page" />
            <h1>{club.name}</h1>
          </div>
          <Link to="/clubs" className="back-btn">
            ← Back to Clubs
          </Link>
        </div>
      </header>

      <section className="club-detail-content">
        <div className="club-hero">
          <div className="club-icon-large">🏛️</div>
          <h2>{club.name}</h2>
          <p className="tagline">{club.description}</p>
        </div>

        <div className="detail-grid">
          <div className="main-content">
            <section className="about-section">
              <h3>About this club</h3>
              <p>{club.description}</p>
              {club.mission && <p><strong>Mission:</strong> {club.mission}</p>}
            </section>

            <section className="about-section">
              <h3>Highlights</h3>
              <ul>
                {(club.highlights || []).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>

            <section className="about-section">
              <h3>Upcoming Events</h3>
              <ul>
                {(club.upcomingEvents || []).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          </div>

          <div className="sidebar">
            <div className="info-box">
              <h3>Club Details</h3>
              <div className="info-item">
                <span className="label">Coordinator</span>
                <span className="value">{club.coordinator}</span>
              </div>
              <div className="info-item">
                <span className="label">Members</span>
                <span className="value">{club.members}</span>
              </div>
              {club.email && (
                <div className="info-item">
                  <span className="label">Contact</span>
                  <span className="value">{club.email}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ClubDetail;