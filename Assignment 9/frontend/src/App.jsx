import React, { useState, useEffect } from 'react';
import { Trophy, Clock, CheckCircle2, RefreshCw } from 'lucide-react';
import './App.css';

function App() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:8080/api/matches');
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
    fetchMatches();
    const interval = setInterval(fetchMatches, 10000); // Polling every 10s for live updates
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="logo">
          <Trophy className="logo-icon" size={32} />
          <h1>CricLive Score Manager</h1>
        </div>
        <div className="header-actions">
          <button className="btn-refresh" onClick={fetchMatches}><RefreshCw size={18} /> Refresh</button>
          <button className="btn-primary" onClick={simulateMatches}>Simulate Match</button>
        </div>
      </header>

      <main className="dashboard">
        {loading && matches.length === 0 ? (
          <div className="loading">Loading live matches...</div>
        ) : matches.length === 0 ? (
          <div className="empty-state">No matches found. Click "Simulate Match" to start.</div>
        ) : (
          <div className="matches-grid">
            {matches.map(match => (
              <div key={match.id} className="match-card">
                <div className="match-card-header">
                  <span className={`status-badge ${match.matchStatus.toLowerCase()}`}>
                    {match.matchStatus === 'LIVE' ? <span className="live-dot"></span> : null}
                    {match.matchStatus}
                  </span>
                  <span className="match-venue">{match.venue}</span>
                </div>
                
                <div className="match-teams">
                  <div className="team">
                    <h3>{match.team1}</h3>
                  </div>
                  <div className="vs">VS</div>
                  <div className="team">
                    <h3>{match.team2}</h3>
                  </div>
                </div>

                <div className="match-score">
                  {match.score}
                </div>

                <div className="match-summary">
                  {match.matchStatus === 'LIVE' ? <Clock size={16} /> : <CheckCircle2 size={16} />}
                  <span>{match.summary}</span>
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
