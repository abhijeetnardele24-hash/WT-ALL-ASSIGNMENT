import React, { useRef, useMemo } from 'react';

/**
 * AnalogClock Component
 *
 * Demonstrates: useState, useEffect, useRef, useMemo,
 * CSS transform/rotation, Date API, Conditional Rendering.
 *
 * Clock Hand Rotation Formulas:
 *   Hour Hand  : (hours % 12) × 30° + minutes × 0.5°
 *   Minute Hand: minutes × 6° + seconds × 0.1°
 *   Second Hand: seconds × 6°
 */

// Hour number positions (12, 1, 2, ..., 11)
const HOUR_LABELS = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

// Compute x,y position on a circle given angle & radius
function polarToXY(angleDeg, radius, cx = 110, cy = 110) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: cx + radius * Math.cos(rad),
    y: cy + radius * Math.sin(rad),
  };
}

function AnalogClock({ currentTime }) {
  const time = currentTime;

  // useRef: references to hands for direct DOM manipulation (performance optimization)
  const hourRef   = useRef(null);
  const minuteRef = useRef(null);
  const secondRef = useRef(null);

  // useMemo: compute rotation angles only when time changes
  const { hourDeg, minuteDeg, secondDeg } = useMemo(() => {
    const h = time.getHours() % 12;   // 0-11
    const m = time.getMinutes();       // 0-59
    const s = time.getSeconds();       // 0-59

    // Hour Hand Formula: 30° per hour + 0.5° per minute (smooth movement)
    const hourDeg = h * 30 + m * 0.5;

    // Minute Hand Formula: 6° per minute + 0.1° per second
    const minuteDeg = m * 6 + s * 0.1;

    // Second Hand Formula: 6° per second
    const secondDeg = s * 6;

    return { hourDeg, minuteDeg, secondDeg };
  }, [time]);

  // Generate 60 tick marks (12 major + 48 minor)
  const tickMarks = useMemo(() => {
    return Array.from({ length: 60 }, (_, i) => ({
      angle: i * 6,   // 360° / 60 ticks = 6° each
      isMajor: i % 5 === 0,
    }));
  }, []);

  // Hour number positions using polar coordinates
  const hourPositions = useMemo(() => {
    return HOUR_LABELS.map((num, i) => {
      const angle = i * 30; // 360° / 12 = 30° each
      const pos = polarToXY(angle, 85); // Radius 85px from center
      return { num, x: pos.x, y: pos.y };
    });
  }, []);

  const isDay = time.getHours() >= 6 && time.getHours() < 20;

  return (
    <div className="glass analog-clock-card">
      {/* Section Header */}
      <div className="section-header" style={{ marginBottom: '24px' }}>
        <div className="section-icon cyan">🕒</div>
        <h2>Analog Clock</h2>
        <div className="section-line" />
      </div>

      {/* Clock Face Wrapper with gradient ring */}
      <div className="clock-face-wrapper">
        <div className="clock-outer-ring" />

        {/* Main clock face */}
        <div className="clock-face">

          {/* Tick marks using map() — demonstrates Lists (map()) concept */}
          {tickMarks.map(({ angle, isMajor }) => (
            <div
              key={angle}
              className={`${isMajor ? 'hour-marker major' : 'minute-dot'}`}
              style={{ transform: `rotate(${angle}deg)` }}
            />
          ))}

          {/* Hour number labels using SVG for precise positioning */}
          <svg
            width="220"
            height="220"
            style={{ position: 'absolute', top: 0, left: 0 }}
          >
            {/* Hour numbers — map() over positions */}
            {hourPositions.map(({ num, x, y }) => (
              <text
                key={num}
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="middle"
                style={{
                  fontFamily: '-apple-system, BlinkMacSystemFont, "San Francisco", "Segoe UI", Roboto, Helvetica, sans-serif',
                  fontSize: '10px',
                  fontWeight: '700',
                  fill: 'rgba(144,144,184,0.9)',
                }}
              >
                {num}
              </text>
            ))}
          </svg>

          {/* Hour Hand — CSS rotate transform */}
          <div
            ref={hourRef}
            className="hand hand-hour"
            style={{ transform: `rotate(${hourDeg}deg)` }}
          />

          {/* Minute Hand */}
          <div
            ref={minuteRef}
            className="hand hand-minute"
            style={{ transform: `rotate(${minuteDeg}deg)` }}
          />

          {/* Second Hand */}
          <div
            ref={secondRef}
            className="hand hand-second"
            style={{ transform: `rotate(${secondDeg}deg)` }}
          />

          {/* Center dot */}
          <div className="clock-center" />
        </div>
      </div>

      {/* Label */}
      <div className="clock-label">
        <div className="clock-label-main">
          {/* Conditional rendering: day/night indicator */}
          {isDay ? '☀️ DAY MODE' : '🌙 NIGHT MODE'}
        </div>
        <div className="digital-date" style={{ marginTop: '4px' }}>
          {time.toLocaleDateString('en-IN', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
          })}
        </div>
      </div>
    </div>
  );
}

export default AnalogClock;
