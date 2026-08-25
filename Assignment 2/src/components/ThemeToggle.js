import React, { useCallback, useEffect } from 'react';

/**
 * ThemeToggle Component
 *
 * Demonstrates: Props, Event Handling, useCallback, useEffect,
 * Conditional Rendering, CSS class toggling.
 *
 * Props:
 *  - isLight   {boolean}  - current theme state
 *  - onToggle  {function} - callback to toggle theme in parent
 */
function ThemeToggle({ isLight, onToggle }) {
  // useEffect: Apply/remove 'light-mode' class on document body
  // This syncs the theme state with the DOM class
  useEffect(() => {
    if (isLight) {
      document.body.classList.add('light-mode');
    } else {
      document.body.classList.remove('light-mode');
    }
  }, [isLight]); // Re-run when isLight changes

  // useCallback: stable reference for the toggle handler
  const handleToggle = useCallback(() => {
    onToggle(); // Call the parent's toggle function (passed as prop)
  }, [onToggle]);

  return (
    <div className="theme-toggle-container">
      {/* Theme Toggle Button — Event Handling */}
      <div
        id="theme-toggle-btn"
        className={`theme-toggle-btn ${isLight ? 'light' : ''}`}
        onClick={handleToggle}
        role="switch"
        aria-checked={isLight}
        title={isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
      >
        {/* Icons inside the toggle */}
        <span>🌙</span>
        <span>☀️</span>

        {/* Moving thumb — Conditional Rendering via CSS class */}
        <div className="theme-toggle-thumb">
          {/* Show appropriate icon based on current theme */}
          {isLight ? '☀️' : '🌙'}
        </div>
      </div>
    </div>
  );
}

export default ThemeToggle;
