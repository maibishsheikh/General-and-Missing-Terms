// src/components/shared/Mascot.jsx
// Relic the Tortoise Mascot component for ScrollQuest
import React from 'react';
import './Mascot.css';
import { MASCOT } from '../../config/characters.config.js';

export default function Mascot({ mood = 'curious', message, size = 'md' }) {
  const emoji = mood === 'celebrate' ? '🎉🐢' : mood === 'thinking' ? '🤔🐢' : mood === 'mentor' ? '🧐🐢' : '🐢';

  return (
    <div className={`mascot-row-wrap mascot-${size}`}>
      <div className={`mascot-avatar-circle mood-${mood}`} title={MASCOT.name}>
        <span className="mascot-avatar-emoji">{emoji}</span>
      </div>
      {message && (
        <div className="mascot-speech-bubble anim-fade-in">
          <span className="speech-text">{message}</span>
        </div>
      )}
    </div>
  );
}
