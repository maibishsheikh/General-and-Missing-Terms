// src/components/phases/WonderPhase.jsx
import React, { useEffect } from 'react';
import './WonderPhase.css';
import Mascot from '../shared/Mascot.jsx';
import { useAudio } from '../../hooks/useAudio.js';
import { wonderNarration } from '../../utils/narration.js';

const PARTICLES = ['🪙', '💵', '💰', '🏷️', '⭐', '🏆', '🎯', '💡', '🐷', '✨'];

export default function WonderPhase({ state, dispatch }) {
  const { narrate, stopAll } = useAudio(state?.audioEnabled ?? true);

  useEffect(() => {
    const segs = wonderNarration();
    narrate(segs);
    return () => stopAll();
  }, [narrate, stopAll]);

  function handleInvestigate() {
    stopAll();
    dispatch({ type: 'COMPLETE_PHASE', payload: 'wonder' });
    dispatch({ type: 'SET_PHASE', payload: 'story' });
  }

  return (
    <div className="wonder-wrap">
      {/* Floating particles */}
      <div className="wonder-particles" aria-hidden="true">
        {PARTICLES.map((p, i) => (
          <span
            key={i}
            className="wonder-particle"
            style={{
              left: `${5 + (i * 9.5) % 90}%`,
              top: `${5 + (i * 7.5) % 80}%`,
              animationDelay: `${i * 0.6}s`,
              fontSize: `${1.1 + (i % 3) * 0.4}rem`,
            }}
          >
            {p}
          </span>
        ))}
      </div>

      <div className="wonder-content anim-slide-up">
        {/* Main hook card */}
        <div className="wonder-card glass-card">
          <div className="wonder-stadium-icon" aria-hidden="true">💰</div>
          <h1 className="wonder-title headline">The Big Money Mystery!</h1>

          <div className="wonder-number-display">
            <span className="number-display wonder-num">$2.70 ➔ 85¢ + 50¢ = $1.35 ➔ Change?</span>
          </div>

          <div className="wonder-question-card">
            <p className="body-text wonder-q">
              If Oliver has <strong className="wonder-em">one $2 coin, three 20¢ coins, and one 10¢ coin ($2.70)</strong>…
            </p>
            <p className="body-text wonder-q">
              Can he buy an <strong className="wonder-em">85¢ muffin</strong> and a <strong className="wonder-em">50¢ pencil</strong>, and what is his <span className="wonder-highlight">exact change</span> from paying with $2?
            </p>
          </div>

          {/* Mascot */}
          <div className="wonder-mascot-row">
            <Mascot mood="curious" message="Let's investigate how counting coins and making change works!" size="sm" />
          </div>

          <button className="btn btn-primary btn-lg wonder-cta" onClick={handleInvestigate}>
            Start Investigation 🔍
          </button>
        </div>
      </div>
    </div>
  );
}
