import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';

/**
 * Alarm Component
 *
 * Demonstrates: useState, useEffect, useCallback, useRef,
 * Event Handling, Conditional Rendering, Lists (map()),
 * Web Audio API for alarm sound.
 *
 * Logic:
 *  1. User sets hour & minute via inputs.
 *  2. Every second, compare currentTime with each alarm's time.
 *  3. If match → play sound + show ringing overlay.
 *  4. Alarms can be toggled on/off or deleted.
 */
function getStoredAlarms() {
  try {
    const savedAlarms = localStorage.getItem('world-clock-alarms');
    const parsedAlarms = savedAlarms ? JSON.parse(savedAlarms) : [];
    return Array.isArray(parsedAlarms) ? parsedAlarms : [];
  } catch {
    return [];
  }
}

function Alarm({ currentTime }) {
  // State: list of alarm objects
  const [alarms, setAlarms] = useState(getStoredAlarms);

  // State: input fields for new alarm
  const [inputHour,   setInputHour]   = useState('');
  const [inputMinute, setInputMinute] = useState('');
  const [inputLabel,  setInputLabel]  = useState('');

  // State: currently ringing alarm
  const [ringingAlarm, setRingingAlarm] = useState(null);

  // useRef: Audio context for alarm sound
  const audioCtxRef = useRef(null);

  useEffect(() => {
    try {
      localStorage.setItem('world-clock-alarms', JSON.stringify(alarms));
    } catch {
      // Ignore storage write failures in restricted browsers.
    }
  }, [alarms]);

  /**
   * Play alarm sound using Web Audio API
   * Creates a beeping sound without any external audio files
   */
  const playAlarmSound = useCallback(() => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtxRef.current = new AudioContext();
      const ctx = audioCtxRef.current;

      // Create oscillator for beep sound
      const playBeep = (startTime, duration) => {
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(880, startTime);   // A5 note
        oscillator.frequency.setValueAtTime(660, startTime + duration / 2); // E5

        gainNode.gain.setValueAtTime(0.4, startTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

        oscillator.start(startTime);
        oscillator.stop(startTime + duration);
      };

      // Play multiple beeps
      for (let i = 0; i < 5; i++) {
        playBeep(ctx.currentTime + i * 0.6, 0.4);
      }
    } catch (err) {
      console.warn('Audio API not available:', err);
    }
  }, []);

  /**
   * Stop alarm sound
   */
  const stopAlarmSound = useCallback(() => {
    if (audioCtxRef.current) {
      audioCtxRef.current.close();
      audioCtxRef.current = null;
    }
  }, []);

  // useEffect: Check alarms every second when time changes
  useEffect(() => {
    const currHour   = currentTime.getHours();
    const currMinute = currentTime.getMinutes();
    const currSecond = currentTime.getSeconds();

    if (currSecond !== 0) return;

    alarms.forEach((alarm) => {
      if (
        alarm.enabled &&
        alarm.hour === currHour &&
        alarm.minute === currMinute &&
        !ringingAlarm
      ) {
        setRingingAlarm(alarm);
        setAlarms((prev) =>
          prev.map((item) =>
            item.id === alarm.id ? { ...item, enabled: false } : item
          )
        );
        playAlarmSound();
      }
    });
  }, [currentTime, alarms, ringingAlarm, playAlarmSound]);

  /**
   * Handle setting a new alarm — event handling
   * useCallback prevents re-creation on every render
   */
  const handleSetAlarm = useCallback(() => {
    const hour   = parseInt(inputHour, 10);
    const minute = parseInt(inputMinute, 10);

    // Validation
    if (isNaN(hour) || hour < 0 || hour > 23) {
      alert('Please enter a valid hour (0-23)');
      return;
    }
    if (isNaN(minute) || minute < 0 || minute > 59) {
      alert('Please enter a valid minute (0-59)');
      return;
    }

    const newAlarm = {
      id:      Date.now(),         // Unique ID
      hour,
      minute,
      label:   inputLabel || `Alarm ${alarms.length + 1}`,
      enabled: true,
    };

    // Update alarms list
    setAlarms((prev) => [...prev, newAlarm]);

    // Clear inputs
    setInputHour('');
    setInputMinute('');
    setInputLabel('');
  }, [inputHour, inputMinute, inputLabel, alarms.length]);

  /**
   * Toggle alarm on/off — event handling
   */
  const handleToggleAlarm = useCallback((id) => {
    setAlarms((prev) =>
      prev.map((alarm) =>
        alarm.id === id ? { ...alarm, enabled: !alarm.enabled } : alarm
      )
    );
  }, []);

  /**
   * Delete an alarm from the list
   */
  const handleDeleteAlarm = useCallback((id) => {
    setAlarms((prev) => prev.filter((alarm) => alarm.id !== id));
  }, []);

  /**
   * Dismiss the ringing alarm
   */
  const handleDismiss = useCallback(() => {
    stopAlarmSound();
    setRingingAlarm(null);
  }, [stopAlarmSound]);

  /**
   * Clear all alarms
   */
  const handleClearAll = useCallback(() => {
    setAlarms([]);
    stopAlarmSound();
    setRingingAlarm(null);
  }, [stopAlarmSound]);

  // Format time for display in the alarm item
  const formatAlarmTime = useCallback((hour, minute) => {
    const h12 = hour % 12 || 12;
    const period = hour >= 12 ? 'PM' : 'AM';
    return `${String(h12).padStart(2, '0')}:${String(minute).padStart(2, '0')} ${period}`;
  }, []);

  const nextAlarm = useMemo(() => {
    const enabledAlarms = alarms.filter((alarm) => alarm.enabled);
    if (enabledAlarms.length === 0) {
      return null;
    }

    const upcoming = enabledAlarms
      .map((alarm) => {
        const next = new Date(currentTime);
        next.setHours(alarm.hour, alarm.minute, 0, 0);
        if (next <= currentTime) {
          next.setDate(next.getDate() + 1);
        }

        return { ...alarm, next };
      })
      .sort((a, b) => a.next - b.next);

    return upcoming[0];
  }, [alarms, currentTime]);

  return (
    <div className="glass alarm-card full-row">
      {/* Section Header */}
      <div className="section-header">
        <div className="section-icon orange">⏰</div>
        <h2>Alarm Manager</h2>
        <div className="section-line" />
      </div>

      <div className="alarm-layout">
        {/* === Set New Alarm Panel === */}
        <div className="alarm-set-panel">
          <div className="alarm-title">Set New Alarm</div>

          {/* Time Inputs */}
          <div className="alarm-inputs">
            <div className="time-seg">
              <input
                id="alarm-hour-input"
                type="number"
                className="alarm-input"
                placeholder="HH"
                min="0"
                max="23"
                value={inputHour}
                onChange={(e) => setInputHour(e.target.value)}
              />
              <div className="time-seg-label">HOUR</div>
            </div>

            <div className="alarm-colon">:</div>

            <div className="time-seg">
              <input
                id="alarm-minute-input"
                type="number"
                className="alarm-input"
                placeholder="MM"
                min="0"
                max="59"
                value={inputMinute}
                onChange={(e) => setInputMinute(e.target.value)}
              />
              <div className="time-seg-label">MIN</div>
            </div>
          </div>

          {/* Label Input */}
          <input
            id="alarm-label-input"
            type="text"
            className="alarm-label-input"
            placeholder="Alarm label (optional)"
            value={inputLabel}
            onChange={(e) => setInputLabel(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSetAlarm()}
          />

          {/* Set Button — Event Handling */}
          <button
            id="set-alarm-btn"
            className="alarm-btn set"
            onClick={handleSetAlarm}
          >
            ⏰ Set Alarm
          </button>

          {/* Clear All — Conditional Rendering: only show if there are alarms */}
          {alarms.length > 0 && (
            <button
              id="clear-alarms-btn"
              className="alarm-btn clear"
              onClick={handleClearAll}
            >
              🗑️ Clear All Alarms
            </button>
          )}

          {/* Current time display */}
          <div style={{ marginTop: '16px', textAlign: 'center' }}>
            <div className="alarm-title" style={{ marginBottom: '4px' }}>Current Time</div>
            <div
              style={{
                fontFamily: '-apple-system, BlinkMacSystemFont, "San Francisco", "Segoe UI", Roboto, Helvetica, sans-serif',
                fontSize: '1.2rem',
                fontWeight: '700',
                color: 'var(--accent-3)',
              }}
            >
              {currentTime.toLocaleTimeString('en-IN', { hour12: true })}
            </div>
            <div className="next-alarm-text">
              {nextAlarm
                ? `Next alarm: ${formatAlarmTime(nextAlarm.hour, nextAlarm.minute)} • ${nextAlarm.label}`
                : 'No active alarms scheduled'}
            </div>
          </div>
        </div>

        {/* === Alarm List Panel === */}
        <div className="alarm-list-panel">
          {/* Conditional Rendering: show empty state OR alarm list */}
          {alarms.length === 0 ? (
            <div className="no-alarms">
              <div className="no-alarms-icon">⏰</div>
              <div>No alarms set</div>
              <div style={{ marginTop: '8px', fontSize: '0.8rem' }}>
                Set your first alarm using the panel
              </div>
            </div>
          ) : (
            /* Lists (map()): render each alarm as a card */
            alarms.map((alarm) => (
              <div
                key={alarm.id}
                className={`alarm-item ${
                  ringingAlarm?.id === alarm.id ? 'ringing' : alarm.enabled ? 'active' : ''
                }`}
              >
                {/* Left: time and label */}
                <div>
                  <div className="alarm-item-time">
                    {formatAlarmTime(alarm.hour, alarm.minute)}
                  </div>
                  <div className="alarm-item-label">{alarm.label}</div>
                </div>

                {/* Right: controls */}
                <div className="alarm-item-controls">
                  {/* Toggle Switch — event handling */}
                  <div
                    id={`alarm-toggle-${alarm.id}`}
                    className={`alarm-toggle ${alarm.enabled ? 'on' : ''}`}
                    onClick={() => handleToggleAlarm(alarm.id)}
                    role="switch"
                    aria-checked={alarm.enabled}
                    title={alarm.enabled ? 'Alarm ON' : 'Alarm OFF'}
                  />

                  {/* Delete Button */}
                  <button
                    id={`alarm-delete-${alarm.id}`}
                    className="alarm-delete"
                    onClick={() => handleDeleteAlarm(alarm.id)}
                    title="Delete alarm"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* === Ringing Alarm Overlay — Conditional Rendering === */}
      {ringingAlarm && (
        <div className="alarm-ringing-overlay" onClick={handleDismiss}>
          <div
            className="alarm-ringing-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="alarm-ringing-icon">🔔</div>
            <div className="alarm-ringing-time">
              {formatAlarmTime(ringingAlarm.hour, ringingAlarm.minute)}
            </div>
            <div className="alarm-ringing-label">{ringingAlarm.label}</div>
            <button
              id="alarm-dismiss-btn"
              className="alarm-dismiss-btn"
              onClick={handleDismiss}
            >
              Dismiss Alarm
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Alarm;
