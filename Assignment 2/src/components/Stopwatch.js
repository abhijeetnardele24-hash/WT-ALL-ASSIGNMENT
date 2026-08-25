import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';

/**
 * Stopwatch Component (Bonus Feature)
 *
 * Demonstrates: useState, useEffect, useRef, useCallback, useMemo,
 * Event Handling, Lists (map()), Conditional Rendering.
 */
function Stopwatch() {
  // useState: running flag and elapsed milliseconds
  const [isRunning, setIsRunning]   = useState(false);
  const [elapsed, setElapsed]       = useState(0);
  const [laps, setLaps]             = useState([]);

  // useRef: stores the interval ID so it persists across renders
  const intervalRef = useRef(null);
  // useRef: stores the start time (not state — doesn't need re-render)
  const startRef    = useRef(null);

  // useEffect: start/stop the interval based on isRunning
  useEffect(() => {
    if (isRunning) {
      // Record the start time accounting for already elapsed time
      startRef.current = Date.now() - elapsed;
      intervalRef.current = setInterval(() => {
        setElapsed(Date.now() - startRef.current);
      }, 10); // Update every 10ms for smooth centisecond display
    } else {
      clearInterval(intervalRef.current);
    }

    // Cleanup function
    return () => clearInterval(intervalRef.current);
  }, [isRunning]); // eslint-disable-line

  // useCallback: Start handler
  const handleStart = useCallback(() => setIsRunning(true), []);

  // useCallback: Pause handler
  const handlePause = useCallback(() => setIsRunning(false), []);

  // useCallback: Stop/Reset handler
  const handleStop = useCallback(() => {
    setIsRunning(false);
    setElapsed(0);
    setLaps([]);
  }, []);

  // useCallback: Record lap
  const handleLap = useCallback(() => {
    if (!isRunning) return;
    setLaps((prev) => [...prev, elapsed]);
  }, [isRunning, elapsed]);

  // useMemo: Format elapsed time into MM:SS:cs
  const formattedTime = useMemo(() => {
    const totalMs = elapsed;
    const minutes       = Math.floor(totalMs / 60000);
    const seconds       = Math.floor((totalMs % 60000) / 1000);
    const centiseconds  = Math.floor((totalMs % 1000) / 10);
    return {
      mm: String(minutes).padStart(2, '0'),
      ss: String(seconds).padStart(2, '0'),
      cs: String(centiseconds).padStart(2, '0'),
    };
  }, [elapsed]);

  // Format a lap time same as formattedTime
  const formatLap = useCallback((ms) => {
    const m  = Math.floor(ms / 60000);
    const s  = Math.floor((ms % 60000) / 1000);
    const cs = Math.floor((ms % 1000) / 10);
    return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}.${String(cs).padStart(2,'0')}`;
  }, []);

  return (
    <div className="glass stopwatch-card full-row">
      {/* Section Header */}
      <div className="section-header">
        <div className="section-icon cyan">⏱️</div>
        <h2>Stopwatch</h2>
        <div className="section-line" />
      </div>

      {/* Display */}
      <div className="stopwatch-display">
        {formattedTime.mm}:{formattedTime.ss}
        <span className="stopwatch-ms">.{formattedTime.cs}</span>
      </div>

      {/* Controls — Event Handling */}
      <div className="stopwatch-controls">
        {/* Conditional Rendering: Start or Pause based on state */}
        {!isRunning ? (
          <button
            id="sw-start-btn"
            className="sw-btn start"
            onClick={handleStart}
          >
            ▶ Start
          </button>
        ) : (
          <button
            id="sw-pause-btn"
            className="sw-btn pause"
            onClick={handlePause}
          >
            ⏸ Pause
          </button>
        )}

        <button
          id="sw-lap-btn"
          className="sw-btn lap"
          onClick={handleLap}
          disabled={!isRunning}
          style={{ opacity: isRunning ? 1 : 0.5 }}
        >
          🏁 Lap
        </button>

        <button
          id="sw-stop-btn"
          className="sw-btn stop"
          onClick={handleStop}
        >
          ⏹ Reset
        </button>
      </div>

      {/* Lap List — Lists (map()) */}
      {laps.length > 0 && (
        <div className="lap-list">
          {laps.map((lapTime, index) => (
            <div key={index} className="lap-item">
              <span className="lap-num">LAP {String(index + 1).padStart(2, '0')}</span>
              <span className="lap-time">{formatLap(lapTime)}</span>
              {/* Conditional: highlight fastest/slowest lap */}
              {lapTime === Math.min(...laps) && laps.length > 1 && (
                <span style={{ color: 'var(--accent-success)', fontSize: '0.7rem' }}>
                  BEST
                </span>
              )}
              {lapTime === Math.max(...laps) && laps.length > 1 && (
                <span style={{ color: 'var(--accent-danger)', fontSize: '0.7rem' }}>
                  WORST
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Stopwatch;
