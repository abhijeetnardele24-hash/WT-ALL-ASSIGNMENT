import React, { useState, useEffect } from 'react';
import { Trophy, Clock, Calendar, History, Activity, MapPin } from 'lucide-react';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('LIVE');
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMatches = async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/matches/${activeTab.toLowerCase()}`);
      const data = await res.json();
      setMatches(data);
    } catch (error) {
      console.error("Error fetching matches", error);
    } finally {
      setLoading(false);
    }
  };

  const simulateMatches = async () => {
    try {
      await fetch('http://localhost:8080/api/matches/simulate', { method: 'POST' });
      fetchMatches();
    } catch (error) {
      console.error("Error simulating matches", error);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchMatches();
    const interval = setInterval(fetchMatches, 10000);
    return () => clearInterval(interval);
  }, [activeTab]);

  return (
    <div className="cb-container">
      {/* Navbar */}
      <nav className="cb-navbar">
        <div className="cb-nav-brand">
          <Trophy size={24} color="#009270" />
          <span>CricTracker</span>
        </div>
        <div className="cb-nav-links">
          <button className={activeTab === 'LIVE' ? 'active' : ''} onClick={() => setActiveTab('LIVE')}>
            <Activity size={16} /> Live Scores
          </button>
          <button className={activeTab === 'RECENT' ? 'active' : ''} onClick={() => setActiveTab('RECENT')}>
            <History size={16} /> Recent
          </button>
          <button className={activeTab === 'UPCOMING' ? 'active' : ''} onClick={() => setActiveTab('UPCOMING')}>
            <Calendar size={16} /> Upcoming
          </button>
        </div>
        <div className="cb-nav-actions">
          <button className="cb-btn-seed" onClick={simulateMatches}>Load Test Data</button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="cb-main">
        <div className="cb-header-section">
          <h2>{activeTab === 'LIVE' ? 'Live Cricket Scores' : activeTab === 'RECENT' ? 'Recent Cricket Matches' : 'Upcoming Cricket Matches'}</h2>
        </div>

        {loading && matches.length === 0 ? (
          <div className="cb-loading">Fetching matches...</div>
        ) : matches.length === 0 ? (
          <div className="cb-empty">No {activeTab.toLowerCase()} matches currently available. Click "Load Test Data" to seed the database.</div>
        ) : (
          <div className="cb-match-list">
            {matches.map(match => (
              <div key={match.id} className="cb-match-card">
                <div className="cb-card-header">
                  <div className="cb-series-info">
                    <strong>{match.seriesName}</strong> • {match.matchType}
                  </div>
                  <div className={`cb-badge ${match.matchStatus.toLowerCase()}`}>
                    {match.matchStatus === 'LIVE' && <span className="cb-live-dot"></span>}
                    {match.matchStatus}
                  </div>
                </div>

                <div className="cb-teams-section">
                  <div className="cb-team-row">
                    <span className="cb-team-name">{match.team1}</span>
                    <span className="cb-team-score">
                      {match.team1Score && <strong>{match.team1Score}</strong>}
                      {match.team1Overs && <span className="cb-overs">({match.team1Overs})</span>}
                    </span>
                  </div>
                  <div className="cb-team-row">
                    <span className="cb-team-name">{match.team2}</span>
                    <span className="cb-team-score">
                      {match.team2Score && <strong>{match.team2Score}</strong>}
                      {match.team2Overs && <span className="cb-overs">({match.team2Overs})</span>}
                    </span>
                  </div>
                </div>

                <div className="cb-card-footer">
                  <div className="cb-summary">
                    {match.summary}
                  </div>
                  {match.runRate && <div className="cb-runrate">{match.runRate}</div>}
                  <div className="cb-venue">
                    <MapPin size={12} /> {match.venue}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
