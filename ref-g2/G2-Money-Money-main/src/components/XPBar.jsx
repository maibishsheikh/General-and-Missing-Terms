// src/components/XPBar.jsx
import React from 'react';

export default function XPBar({ xp, levelSize = 200 }) {
  const level = Math.floor(xp / levelSize) + 1;
  const progress = ((xp % levelSize) / levelSize) * 100;

  return (
    <div style={{ width: '100%', maxWidth: 320 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontSize: '0.85rem',
          marginBottom: 4,
        }}
      >
        <span>Level {level}</span>
        <span>⭐ {xp} XP</span>
      </div>
      <div className="progress-bar-track">
        <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}
