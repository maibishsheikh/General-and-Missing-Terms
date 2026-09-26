// src/components/phases/WonderPhase.jsx
import React, { useEffect } from 'react';
import './WonderPhase.css';
import Mascot from '../shared/Mascot.jsx';
import { useAudio } from '../../hooks/useAudio.js';
import { wonderNarration } from '../../utils/narration.js';

const PARTICLES = ['📜', '🏺', '🗿', '🗝️', '🐢', '✨', '🔍', '📊', '🏛️', '🛡️'];

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
          <div className="wonder-stadium-icon" aria-hidden="true">🏺</div>
          <h1 className="wonder-title headline">The Worn Number-Scroll Mystery!</h1>

          <div className="wonder-number-display">
            <span className="number-display wonder-num">
              [ 7, 12, __, 22 ... Gap at n=25? ] ➔ Which Tool?
            </span>
          </div>

          <div className="wonder-question-card">
            <p className="body-text wonder-q">
              The Restoration Guild just uncovered an ancient number-scroll — but <strong className="wonder-em">crucial numbers have worn away into dust</strong>!
            </p>
            <p className="body-text wonder-q">
              You already carry two powerful restoration tools: <span className="wonder-highlight">quick term-to-term checking</span> and <span className="wonder-highlight">the general term formula</span>.
            </p>
            <p className="body-text wonder-q">
              The real question today: <strong className="wonder-em">which one do you reach for first</strong> to restore each piece fastest and most reliably?
            </p>
          </div>

          {/* Mascot */}
          <div className="wonder-mascot-row">
            <Mascot mood="curious" message="Pause and inspect the gap! Rushing to the wrong tool costs precious excavation time." size="sm" />
          </div>

          <button className="btn btn-primary btn-lg wonder-cta" onClick={handleInvestigate}>
            Enter the Guild Workshop 🔍
          </button>
        </div>
      </div>
    </div>
  );
}
