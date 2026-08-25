import React, { useCallback, useEffect, useMemo, useState } from 'react';
import './App.css';
import AnalogClock from './components/AnalogClock';
import DigitalClock from './components/DigitalClock';
import WorldClock from './components/WorldClock';
import Alarm from './components/Alarm';
import ThemeToggle from './components/ThemeToggle';
import Stopwatch from './components/Stopwatch';

function App() {
  const [isLight, setIsLight] = useState(() => {
    try {
      return localStorage.getItem('world-clock-theme') === 'light';
    } catch {
      return false;
    }
  });
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('world-clock-theme', isLight ? 'light' : 'dark');
    } catch {
      // Ignore storage write failures in restricted browsers.
    }
  }, [isLight]);

  const toggleTheme = useCallback(() => {
    setIsLight((prev) => !prev);
  }, []);

  const dashboardMeta = useMemo(() => {
    return {
      localDate: currentTime.toLocaleDateString('en-IN', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
      localTime: currentTime.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      }),
    };
  }, [currentTime]);

  return (
    <div className={`app ${isLight ? 'light-mode' : ''}`}>
      <ThemeToggle isLight={isLight} onToggle={toggleTheme} />

      <header className="app-header">
        <div className="header-badge">
          <span className="live-dot" />
          Real-Time Dashboard
        </div>
        <h1>World Clock Dashboard</h1>
        <p>
          Live sync active • {dashboardMeta.localDate} • {dashboardMeta.localTime}
        </p>
      </header>

      <main className="main-content">
        <section className="clocks-row">
          <AnalogClock currentTime={currentTime} />
          <DigitalClock currentTime={currentTime} />
        </section>

        <WorldClock currentTime={currentTime} />
        <Alarm currentTime={currentTime} />
        <section className="full-row">
          <Stopwatch />
        </section>
      </main>

      <footer className="app-footer">
        Built with React components, hooks, event handling, responsive styling, and live Date APIs.
      </footer>
    </div>
  );
}

export default App;
