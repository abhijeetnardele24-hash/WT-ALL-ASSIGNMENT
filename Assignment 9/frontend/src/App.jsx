import React, { useState, useEffect } from 'react';
import { Trophy, Calendar, History, Activity, MapPin, X } from 'lucide-react';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('LIVE');
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Scorecard modal state
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [scorecard, setScorecard] = useState(null);
  const [loadingScorecard, setLoadingScorecard] = useState(false);

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
  
  const viewScorecard = async (match) => {
    setSelectedMatch(match);
    setLoadingScorecard(true);
    setScorecard(null);
    try {
      const res = await fetch(`http://localhost:8080/api/matches/${match.id}/scorecard`);
      const data = await res.json();
      setScorecard(data);
    } catch (error) {
      console.error("Error fetching scorecard", error);
    } finally {
      setLoadingScorecard(false);
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
          <button className="cb-btn-seed" onClick={simulateMatches}>Load Data (Multiple APIs)</button>
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
          <div className="cb-empty">No {activeTab.toLowerCase()} matches currently available. Click "Load Data" to seed the database.</div>
        ) : (
          <div className="cb-match-list">
            {matches.map(match => (
              <div key={match.id} className="cb-match-card" onClick={() => viewScorecard(match)}>
                <div className="cb-card-header">
                  <div className="cb-series-info">
                    <strong>{match.seriesName || match.team1 + ' vs ' + match.team2}</strong> • {match.matchType || 'T20'}
                  </div>
                  <div className={`cb-badge ${match.matchStatus?.toLowerCase()}`}>
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
                    {match.summary || "Match in progress"}
                  </div>
                  {match.runRate && <div className="cb-runrate">{match.runRate}</div>}
                  <div className="cb-venue">
                    <MapPin size={12} /> {match.venue || "TBA"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Scorecard Modal */}
      {selectedMatch && (
        <div className="scorecard-overlay" onClick={() => setSelectedMatch(null)}>
          <div className="scorecard-modal" onClick={e => e.stopPropagation()}>
            <div className="scorecard-header">
              <h3>{selectedMatch.team1} vs {selectedMatch.team2} - Full Scorecard</h3>
              <button className="close-btn" onClick={() => setSelectedMatch(null)}><X size={20} /></button>
            </div>
            
            <div className="scorecard-body">
              {loadingScorecard ? (
                <div className="cb-loading">Loading live scorecard data from API...</div>
              ) : scorecard ? (
                <>
                  <div className="scorecard-section">
                    <h4>{scorecard.battingTeam} Batting</h4>
                    <table className="score-table">
                      <thead>
                        <tr>
                          <th>Batter</th>
                          <th></th>
                          <th>R</th>
                          <th>B</th>
                          <th>4s</th>
                          <th>6s</th>
                          <th>SR</th>
                        </tr>
                      </thead>
                      <tbody>
                        {scorecard.batsmen.map((b, i) => (
                          <tr key={i}>
                            <td className="player-name">{b.name}</td>
                            <td className="player-status">{b.status}</td>
                            <td className="player-runs">{b.runs}</td>
                            <td>{b.balls}</td>
                            <td>{b.fours}</td>
                            <td>{b.sixes}</td>
                            <td>{b.sr}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="scorecard-section">
                    <h4>{scorecard.bowlingTeam} Bowling</h4>
                    <table className="score-table">
                      <thead>
                        <tr>
                          <th>Bowler</th>
                          <th>O</th>
                          <th>M</th>
                          <th>R</th>
                          <th>W</th>
                          <th>ECON</th>
                        </tr>
                      </thead>
                      <tbody>
                        {scorecard.bowlers.map((b, i) => (
                          <tr key={i}>
                            <td className="player-name">{b.name}</td>
                            <td>{b.overs}</td>
                            <td>{b.maidens}</td>
                            <td>{b.runs}</td>
                            <td className="player-wickets">{b.wickets}</td>
                            <td>{b.econ}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="match-extras">
                    <p><strong>Partnership:</strong> {scorecard.currentPartnership}</p>
                    <p><strong>Last Wicket:</strong> {scorecard.lastWicket}</p>
                  </div>
                </>
              ) : (
                <div className="cb-empty">Detailed scorecard not available for this match yet.</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
