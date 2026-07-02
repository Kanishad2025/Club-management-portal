import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/clubs-style.css';
import vitLogo from '../assets/images/vitlogo.jpg';

const getClubIcon = (name) => {
  const lowerName = (name || '').toLowerCase();
  if (lowerName.includes('tech')) return '🔬';
  if (lowerName.includes('sport')) return '⚽';
  if (lowerName.includes('art')) return '🎨';
  if (lowerName.includes('music')) return '🎵';
  if (lowerName.includes('literary') || lowerName.includes('book')) return '📚';
  if (lowerName.includes('environment') || lowerName.includes('eco')) return '🌍';
  return '🏛️';
};

const normalizeClub = (club) => ({
  id: club._id || club.id,
  name: club.clubName || club.name || 'Unnamed Club',
  icon: getClubIcon(club.clubName || club.name),
  description: club.description || '',
  members: club.members ?? 0,
  events: club.events ?? 0,
  coordinator: club.coordinator || 'N/A',
});

const buildClubPath = (club) => {
  const params = new URLSearchParams({
    name: club.name,
    description: club.description,
    coordinator: club.coordinator,
    members: String(club.members ?? 0),
  });

  return `/club/${club.id}?${params.toString()}`;
};

const Clubs = () => {
  const [clubs, setClubs] = useState([]);
  const [filteredClubs, setFilteredClubs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClubs = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch('http://localhost:5000/api/clubs');
        if (!response.ok) {
          throw new Error(`Failed to load clubs: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        const normalizedClubs = Array.isArray(data)
          ? data.map(normalizeClub)
          : [];
        setClubs(normalizedClubs);
        setFilteredClubs(normalizedClubs);
      } catch (fetchError) {
        setError(fetchError.message || 'An unexpected error occurred.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchClubs();
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
    const filtered = clubs.filter((club) =>
      club.name.toLowerCase().includes(query.toLowerCase()) ||
      club.description.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredClubs(filtered);
  };

  return (
    <>
      <header className="page-header">
        <div className="header-top">
          <div className="header-left">
            <img src={vitLogo} alt="VIT Logo" className="vit-logo-page" />
            <h1>Clubs & Communities</h1>
          </div>
          <Link to="/" className="back-btn">← Back to Home</Link>
        </div>
      </header>

      <section className="page-content">
        <div className="search-section">
          <input
            type="text"
            placeholder="Search clubs by name or description..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="search-input"
          />
        </div>

        {isLoading && <p className="loading-message">Loading clubs...</p>}
        {error && <p className="error-message">{error}</p>}

        <div className="clubs-grid">
          {!isLoading && !error && filteredClubs.length === 0 ? (
            <p className="no-results">No clubs found matching your search.</p>
          ) : (
            filteredClubs.map((club) => (
              <div key={club.id} className="club-card-detailed">
                <div className="club-icon">{club.icon}</div>
                <h3>{club.name}</h3>
                <p className="description">{club.description}</p>
                <div className="club-stats">
                  <div className="stat">
                    <span className="stat-label">Members</span>
                    <span className="stat-value">{club.members}</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Events</span>
                    <span className="stat-value">{club.events}</span>
                  </div>
                </div>
                <p className="coordinator"><strong>Coordinator:</strong> {club.coordinator}</p>
                <Link to={buildClubPath(club)} state={{ club }} className="view-btn">
                  View Details
                </Link>
              </div>
            ))
          )}
        </div>
      </section>
    </>
  );
};

export default Clubs;