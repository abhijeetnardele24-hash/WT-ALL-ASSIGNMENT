import React, { useState, useEffect } from 'react';
import { Search, User, X, ChevronRight } from 'lucide-react';
import './App.css';

function App() {
  const [activeCategory, setActiveCategory] = useState('LIVE'); 
  const [mainMatches, setMainMatches] = useState([]);
  const [quickLinks, setQuickLinks] = useState([]);
  
  const [latestNews, setLatestNews] = useState([]);
  const [featuredNews, setFeaturedNews] = useState(null);
  const [sidebarNews, setSidebarNews] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Offset pagination
  const [offset, setOffset] = useState(0);

  // Scorecard modal state
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [scorecard, setScorecard] = useState(null);
  const [loadingScorecard, setLoadingScorecard] = useState(false);

  const fetchMainData = async (resetOffset = false) => {
    try {
      if(resetOffset) setLoading(true);
      
      const currentOffset = resetOffset ? 0 : offset;
      
      // Fetch main carousel matches based on category & offset
      const matchesRes = await fetch(`http://localhost:8080/api/matches/${activeCategory.toLowerCase()}?offset=${currentOffset}`);
      const newMatches = await matchesRes.json();
      
      if (resetOffset) {
         setMainMatches(newMatches);
      } else {
         setMainMatches(prev => [...prev, ...newMatches]);
      }
      
      if(resetOffset) {
        const allMatchesRes = await fetch('http://localhost:8080/api/matches?offset=0');
        setQuickLinks(await allMatchesRes.json());

        const [latestRes, featuredRes, sidebarRes] = await Promise.all([
          fetch('http://localhost:8080/api/news/latest'),
          fetch('http://localhost:8080/api/news/featured'),
          fetch('http://localhost:8080/api/news/sidebar')
        ]);

        setLatestNews(await latestRes.json());
        setFeaturedNews(await featuredRes.json());
        setSidebarNews(await sidebarRes.json());
      }
    } catch (error) {
      console.error("Error fetching data", error);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreMatches = () => {
    setOffset(prev => prev + 25);
  };

  const viewScorecard = async (match) => {
    if(!match.matchId) return; // Need CricAPI UUID
    setSelectedMatch(match);
    setLoadingScorecard(true);
    setScorecard(null);
    try {
      const res = await fetch(`http://localhost:8080/api/matches/${match.matchId}/scorecard`);
      const data = await res.json();
      setScorecard(data);
    } catch (error) {
      console.error("Error fetching scorecard", error);
    } finally {
      setLoadingScorecard(false);
    }
  };

  useEffect(() => {
    fetchMainData(false);
  }, [offset]);

  useEffect(() => {
    setOffset(0);
    fetchMainData(true);
    const interval = setInterval(() => fetchMainData(true), 15000); // Polling real API every 15s
    return () => clearInterval(interval);
  }, [activeCategory]);

  return (
    <div className="cricbuzz-app">
      {/* Global Navigation - Green Bar */}
      <nav className="cb-global-nav">
        <div className="cb-nav-container">
          <div className="cb-nav-left">
            <div className="cb-logo">
              cric<span>buzz</span>
            </div>
            <ul className="cb-nav-list">
              <li><button className={activeCategory === 'LIVE' ? 'active-nav' : ''} onClick={() => setActiveCategory('LIVE')}>Live Scores</button></li>
              <li><button className={activeCategory === 'UPCOMING' ? 'active-nav' : ''} onClick={() => setActiveCategory('UPCOMING')}>Schedule</button></li>
              <li><button className={activeCategory === 'RECENT' ? 'active-nav' : ''} onClick={() => setActiveCategory('RECENT')}>Archives</button></li>
              <li><button>News ▾</button></li>
              <li><button>Series ▾</button></li>
              <li><button>Teams ▾</button></li>
              <li><button>Videos ▾</button></li>
              <li><button>Rankings ▾</button></li>
              <li><button>More ▾</button></li>
            </ul>
          </div>
          <div className="cb-nav-right">
            <button className="cb-premium-btn">Go Premium</button>
            <Search className="nav-icon" size={20} />
            <User className="nav-icon" size={20} />
          </div>
        </div>
      </nav>

      {/* Secondary Navigation - Dark Grey Bar */}
      <div className="cb-secondary-nav">
        <div className="cb-nav-container">
          <div className="matches-label">MATCHES</div>
          <ul className="cb-matches-quick-links">
            {quickLinks.slice(0, 5).map(match => (
              <li key={match.id} onClick={() => viewScorecard(match)}>
                {match.team1} vs {match.team2} - {match.matchStatus}
              </li>
            ))}
          </ul>
          <div className="all-matches-link">ALL ▾</div>
        </div>
      </div>

      <div className="cb-main-content">
        
        <h2 style={{ fontSize: '20px', marginBottom: '15px', color: '#222', display: 'flex', justifyContent: 'space-between', alignItems:'center' }}>
          <span>{activeCategory === 'LIVE' ? 'Live Matches' : activeCategory === 'UPCOMING' ? 'Upcoming Schedule' : 'Archived Recent Matches'}</span>
          <button onClick={loadMoreMatches} style={{background:'#009270', color:'white', border:'none', padding:'6px 12px', borderRadius:'4px', cursor:'pointer', fontSize:'14px', fontWeight:'600'}}>
            Load More Matches (Offset {offset + 25})
          </button>
        </h2>

        {loading && mainMatches.length === 0 ? (
          <div style={{ padding: '20px', color: '#666' }}>Fetching {activeCategory.toLowerCase()} data from CricAPI...</div>
        ) : mainMatches.length === 0 ? (
          <div style={{ padding: '20px', color: '#666', background: 'white', borderRadius: '4px' }}>
            No {activeCategory.toLowerCase()} matches currently found.
          </div>
        ) : (
          <div className="cb-carousel-container">
            {mainMatches.map(match => (
              <div className="cb-carousel-card" key={match.id} onClick={() => viewScorecard(match)}>
                <div className="cb-card-header">
                  <span className="cb-card-title">{match.seriesName}</span>
                  <span className="cb-card-badge">{match.matchType}</span>
                </div>
                <div className="cb-card-teams">
                  <div className="cb-team">
                    {match.team1Logo ? (
                        <img src={match.team1Logo} alt={match.team1} className="cb-flag" style={{width:'24px', height:'18px', objectFit:'cover'}}/>
                    ) : (
                        <span className="cb-flag" style={{fontSize:'18px'}}>🏏</span>
                    )}
                    <span className="cb-team-name">{match.team1}</span>
                    <span className="cb-score">{match.team1Score}</span>
                  </div>
                  <div className="cb-team">
                    {match.team2Logo ? (
                        <img src={match.team2Logo} alt={match.team2} className="cb-flag" style={{width:'24px', height:'18px', objectFit:'cover'}}/>
                    ) : (
                        <span className="cb-flag" style={{fontSize:'18px'}}>🏏</span>
                    )}
                    <span className="cb-team-name">{match.team2}</span>
                    <span className="cb-score">{match.team2Score}</span>
                  </div>
                </div>
                <div className="cb-card-status">
                  {match.summary || "Match in progress"}
                </div>
                <div className="cb-card-footer">
                  <span>SCORECARD</span>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="cb-quick-access">
          <strong>Quick Access</strong>
          <button>👥 India - Men</button>
          <button>👥 India - Women</button>
          <button>🛡️ Go ad-free</button>
        </div>

        <div className="cb-news-grid">
          <div className="cb-col-left">
            <h3 className="cb-section-title">LATEST NEWS</h3>
            <div className="cb-latest-news-list">
              {latestNews.length === 0 && <p style={{color:'#666'}}>Fetching news...</p>}
              {latestNews.map((news, i) => (
                <div className="cb-news-item" key={i}>
                  <p>{news.title}</p>
                  <span>{news.time}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="cb-col-middle">
            {featuredNews ? (
              <div className="cb-featured-story">
                <h3 className="cb-section-title-sub">{featuredNews.category}</h3>
                <img src={featuredNews.imageUrl} alt="Featured" />
                <h1 className="cb-featured-title">{featuredNews.title}</h1>
                <p className="cb-featured-desc">{featuredNews.description}</p>
              </div>
            ) : (
              <p style={{color:'#666'}}>Fetching featured story...</p>
            )}
          </div>

          <div className="cb-col-right">
            <h3 className="cb-section-title">FEATURED ARTICLES</h3>
            <div className="cb-sidebar-list">
              {sidebarNews.length === 0 && <p style={{color:'#666'}}>Fetching articles...</p>}
              {sidebarNews.map((news, i) => (
                <div className="cb-sidebar-card" key={i}>
                  <img src={news.imageUrl} alt="sidebar news" />
                  <div className="cb-sidebar-text">
                    <h4>{news.title}</h4>
                    <p>{news.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {selectedMatch && (
        <div className="scorecard-overlay" onClick={() => setSelectedMatch(null)}>
          <div className="scorecard-modal" onClick={e => e.stopPropagation()}>
            <div className="scorecard-header">
              <h3>{selectedMatch.team1} vs {selectedMatch.team2} - Detailed Scorecard</h3>
              <button className="close-btn" onClick={() => setSelectedMatch(null)}><X size={24} /></button>
            </div>
            
            <div className="scorecard-body">
              {loadingScorecard ? (
                <div className="cb-loading" style={{padding:'40px', textAlign:'center', color:'#666'}}>
                    Loading DETAILED live scorecard data from API...
                </div>
              ) : scorecard && scorecard.batsmen ? (
                <>
                  <div className="scorecard-section">
                    <h4>{scorecard.battingTeam}</h4>
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
                    <h4>{scorecard.bowlingTeam}</h4>
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
                </>
              ) : (
                <div className="cb-empty" style={{padding:'40px', textAlign:'center', color:'#666'}}>Scorecard data not available for this match.</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
