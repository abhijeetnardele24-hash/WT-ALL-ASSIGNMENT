import React, { useCallback, useEffect, useMemo, useState } from 'react';

/**
 * WorldClock Component
 *
 * Demonstrates: useState, useEffect, useMemo, Lists (map()),
 * Date API (toLocaleString with timeZone), Props, Responsive Design.
 *
 * Uses toLocaleString() with timeZone option to display time
 * for multiple regions simultaneously.
 *
 * Example:
 *   new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
 */

// Timezone data — array of timezone configuration objects
const TIMEZONES = [
  {
    id: 'india',
    country: 'India',
    city: 'Mumbai / New Delhi',
    timezone: 'Asia/Kolkata',
    flag: '🇮🇳',
    offset: 'UTC+5:30',
    locale: 'en-IN',
  },
  {
    id: 'usa',
    country: 'USA',
    city: 'New York',
    timezone: 'America/New_York',
    flag: '🇺🇸',
    offset: 'UTC-5',
    locale: 'en-US',
  },
  {
    id: 'japan',
    country: 'Japan',
    city: 'Tokyo',
    timezone: 'Asia/Tokyo',
    flag: '🇯🇵',
    offset: 'UTC+9',
    locale: 'ja-JP',
  },
  {
    id: 'london',
    country: 'United Kingdom',
    city: 'London',
    timezone: 'Europe/London',
    flag: '🇬🇧',
    offset: 'UTC+0/+1',
    locale: 'en-GB',
  },
  {
    id: 'australia',
    country: 'Australia',
    city: 'Sydney',
    timezone: 'Australia/Sydney',
    flag: '🇦🇺',
    offset: 'UTC+10/+11',
    locale: 'en-AU',
  },
  {
    id: 'dubai',
    country: 'UAE',
    city: 'Dubai',
    timezone: 'Asia/Dubai',
    flag: '🇦🇪',
    offset: 'UTC+4',
    locale: 'ar-AE',
  },
  {
    id: 'singapore',
    country: 'Singapore',
    city: 'Singapore',
    timezone: 'Asia/Singapore',
    flag: '🇸🇬',
    offset: 'UTC+8',
    locale: 'en-SG',
  },
  {
    id: 'paris',
    country: 'France',
    city: 'Paris',
    timezone: 'Europe/Paris',
    flag: '🇫🇷',
    offset: 'UTC+1/+2',
    locale: 'fr-FR',
  },
];

function getStoredZoneIds() {
  try {
    const savedZones = localStorage.getItem('world-clock-zones');
    const parsedZones = savedZones ? JSON.parse(savedZones) : null;

    if (!Array.isArray(parsedZones)) {
      return ['india', 'usa', 'japan', 'london', 'australia'];
    }

    return parsedZones.filter((zoneId) =>
      TIMEZONES.some((zone) => zone.id === zoneId)
    );
  } catch {
    return ['india', 'usa', 'japan', 'london', 'australia'];
  }
}

/**
 * Utility: format time for a timezone using Date.toLocaleString()
 * @param {Date} date - current Date object
 * @param {string} timezone - IANA timezone string (e.g., "Asia/Kolkata")
 * @returns {string} formatted time string
 *
 * new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
 */
function getTimeForZone(date, timezone) {
  return date.toLocaleString('en-US', {
    timeZone: timezone,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });
}

function getDateForZone(date, timezone) {
  return date.toLocaleString('en-US', {
    timeZone: timezone,
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function getHourForZone(date, timezone) {
  const hourStr = date.toLocaleString('en-US', {
    timeZone: timezone,
    hour: 'numeric',
    hour12: false,
  });
  return parseInt(hourStr, 10);
}

/**
 * Single timezone card component
 * Props: tzData, currentTime
 */
function TimezoneCard({ tzData, currentTime, onRemove, removable }) {
  // Compute time strings using Date.toLocaleString with timeZone
  const timeStr = getTimeForZone(currentTime, tzData.timezone);
  const dateStr = getDateForZone(currentTime, tzData.timezone);
  const hour    = getHourForZone(currentTime, tzData.timezone);

  // Conditional rendering: day or night icon based on local hour
  const isDay = hour >= 6 && hour < 20;
  const dayNightIcon = isDay ? '☀️' : '🌙';
  const dayNightLabel = isDay ? 'Day' : 'Night';

  return (
    <div className={`timezone-card ${tzData.id}`}>
      {/* UTC offset badge */}
      <div className="tz-offset-badge">{tzData.offset}</div>
      {removable && (
        <button
          className="tz-remove-btn"
          onClick={() => onRemove(tzData.id)}
          title={`Remove ${tzData.city}`}
        >
          ✕
        </button>
      )}

      {/* Flag */}
      <span className="tz-flag">{tzData.flag}</span>

      {/* Country & City */}
      <div className="tz-country">{tzData.country}</div>
      <div className="tz-city">{tzData.city}</div>

      {/* Time — uses toLocaleString() with timeZone prop */}
      <div className="tz-time">{timeStr}</div>

      {/* Date */}
      <div className="tz-date">{dateStr}</div>

      {/* Day/Night conditional render */}
      <div className="day-night">
        <span>{dayNightIcon}</span>
        <span>{dayNightLabel}</span>
      </div>
    </div>
  );
}

/**
 * Main WorldClock Component
 * Manages the shared time state and renders all timezone cards
 */
function WorldClock({ currentTime }) {
  const [selectedIds, setSelectedIds] = useState(getStoredZoneIds);
  const [selectedZoneId, setSelectedZoneId] = useState('dubai');

  useEffect(() => {
    try {
      localStorage.setItem('world-clock-zones', JSON.stringify(selectedIds));
    } catch {
      // Ignore storage write failures in restricted browsers.
    }
  }, [selectedIds]);

  const activeTimezones = useMemo(
    () => TIMEZONES.filter((zone) => selectedIds.includes(zone.id)),
    [selectedIds]
  );

  const availableTimezones = useMemo(
    () => TIMEZONES.filter((zone) => !selectedIds.includes(zone.id)),
    [selectedIds]
  );

  const handleAddTimezone = useCallback(() => {
    if (!selectedZoneId || selectedIds.includes(selectedZoneId)) {
      return;
    }

    setSelectedIds((prev) => [...prev, selectedZoneId]);
    const nextZone = TIMEZONES.find((zone) => !selectedIds.includes(zone.id) && zone.id !== selectedZoneId);
    setSelectedZoneId(nextZone ? nextZone.id : '');
  }, [selectedIds, selectedZoneId]);

  const handleRemoveTimezone = useCallback((zoneId) => {
    setSelectedIds((prev) => prev.filter((id) => id !== zoneId));
  }, []);

  return (
    <div className="glass world-clock-card full-row">
      {/* Section Header */}
      <div className="section-header">
        <div className="section-icon green">🌍</div>
        <h2>World Clock</h2>
        <div className="section-line" />
      </div>

      <div className="world-clock-toolbar">
        <div className="world-clock-toolbar-text">
          Track multiple regions with live timezone conversion and day/night status.
        </div>
        <div className="world-clock-controls">
          <select
            className="world-clock-select"
            value={selectedZoneId}
            onChange={(event) => setSelectedZoneId(event.target.value)}
            disabled={availableTimezones.length === 0}
          >
            {availableTimezones.length === 0 ? (
              <option value="">All preset zones added</option>
            ) : (
              availableTimezones.map((zone) => (
                <option key={zone.id} value={zone.id}>
                  {zone.country} • {zone.city}
                </option>
              ))
            )}
          </select>
          <button
            className="world-clock-add-btn"
            onClick={handleAddTimezone}
            disabled={availableTimezones.length === 0}
          >
            Add Time Zone
          </button>
        </div>
      </div>

      {/* Timezone grid — uses map() to render list of cards */}
      <div className="world-clock-grid">
        {activeTimezones.map((tz) => (
          /* Key prop for React list reconciliation */
          <TimezoneCard
            key={tz.id}
            tzData={tz}
            currentTime={currentTime}
            onRemove={handleRemoveTimezone}
            removable={activeTimezones.length > 1}
          />
        ))}
      </div>
    </div>
  );
}

export default WorldClock;
