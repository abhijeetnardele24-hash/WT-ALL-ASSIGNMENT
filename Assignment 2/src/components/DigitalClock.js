import React, { useState, useMemo, useCallback } from 'react';

/**
 * DigitalClock Component
 *
 * Demonstrates: useState, useEffect, useMemo, useCallback,
 * Date API, conditional rendering, event handling, props.
 *
 * Props:
 *  - isLight {boolean} - current theme mode
 */
function DigitalClock({ currentTime }) {
  const time = currentTime;
  // useState: toggle between 12h and 24h format
  const [is24Hour, setIs24Hour] = useState(false);

  // useMemo: computes the formatted hour only when `time` or `is24Hour` changes
  const hours = useMemo(() => {
    if (is24Hour) {
      return String(time.getHours()).padStart(2, '0');
    }
    const h = time.getHours() % 12 || 12;
    return String(h).padStart(2, '0');
  }, [time, is24Hour]);

  const minutes = useMemo(
    () => String(time.getMinutes()).padStart(2, '0'),
    [time]
  );

  const seconds = useMemo(
    () => String(time.getSeconds()).padStart(2, '0'),
    [time]
  );

  // AM / PM — conditional rendering based on hour
  const period = useMemo(() => {
    return time.getHours() >= 12 ? 'PM' : 'AM';
  }, [time]);

  const dayName = useMemo(() => {
    return time.toLocaleDateString('en-IN', { weekday: 'long' });
  }, [time]);

  // useCallback: stable reference for the format toggle handler
  const handleFormatToggle = useCallback((format24) => {
    setIs24Hour(format24);
  }, []);

  return (
    <div className="glass digital-clock-card">
      {/* Section Header */}
      <div className="section-header" style={{ marginBottom: '24px' }}>
        <div className="section-icon purple">🕐</div>
        <h2>Digital Clock</h2>
        <div className="section-line" />
      </div>

      {/* Main time display — uses conditional rendering for AM/PM */}
      <div className="time-segments">
        {/* Hours */}
        <div className="time-seg">
          <div className="digital-time">{hours}</div>
          <div className="time-seg-label">HRS</div>
        </div>

        {/* Blinking colon separator */}
        <div className="time-colon">:</div>

        {/* Minutes */}
        <div className="time-seg">
          <div className="digital-time">{minutes}</div>
          <div className="time-seg-label">MIN</div>
        </div>

        {/* Blinking colon separator */}
        <div className="time-colon">:</div>

        {/* Seconds */}
        <div className="time-seg">
          <div className="digital-time">{seconds}</div>
          <div className="time-seg-label">SEC</div>
        </div>

        {/* Conditionally render AM/PM only in 12-hour mode */}
        {!is24Hour && (
          <div className="time-seg" style={{ marginLeft: '8px' }}>
            <div className="digital-period">{period}</div>
            <div className="time-seg-label">MODE</div>
          </div>
        )}
      </div>

      {/* Date display */}
      <div className="digital-day">{dayName.toUpperCase()}</div>
      <div className="digital-date">{time.toLocaleDateString('en-IN', {
        year: 'numeric', month: 'short', day: 'numeric'
      })}</div>

      {/* Format Toggle — event handling with useCallback */}
      <div className="format-toggle">
        <button
          id="btn-12h"
          className={`format-btn ${!is24Hour ? 'active' : ''}`}
          onClick={() => handleFormatToggle(false)}
        >
          12H
        </button>
        <button
          id="btn-24h"
          className={`format-btn ${is24Hour ? 'active' : ''}`}
          onClick={() => handleFormatToggle(true)}
        >
          24H
        </button>
      </div>
    </div>
  );
}

export default DigitalClock;
