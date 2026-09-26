// src/components/IntroScreen.jsx
import React from 'react';
import './IntroScreen.css';
import { generateSessionQuestions } from '../utils/shuffle.js';
import questionBank from '../data/questionBank.js';

const JOURNEY = [
  { num: '01', icon: '🔍', label: 'Wonder',   desc: 'The Damaged Scroll Mystery' },
  { num: '02', icon: '📖', label: 'Story',    desc: 'Kavya & Hafiz at the Guild' },
  { num: '03', icon: '🧪', label: 'Simulate', desc: '4 Excavation Labs' },
  { num: '04', icon: '🎮', label: 'Practice', desc: '10 Worlds & Bosses' },
  { num: '05', icon: '📓', label: 'Reflect',  desc: 'Curator Log & Scorecard' },
];

export default function IntroScreen({ state, dispatch }) {
  const hasSaved = state?.phaseComplete && Object.values(state.phaseComplete).some(Boolean);

  function startFresh() {
    dispatch({ type: 'LOAD_QUESTIONS', payload: generateSessionQuestions(questionBank) });
    dispatch({ type: 'SET_PHASE', payload: 'wonder' });
  }

  function resumeSession() {
    dispatch({ type: 'SET_PHASE', payload: state.savedPhase || 'wonder' });
  }

  return (
    <div className="intro-wrap">
      {/* Top Badge */}
      <div className="intro-top-badge">
        ✨ Grade 7 Math · General &amp; Missing Terms · Archaeological Restoration Guild
      </div>

      {/* Main Title */}
      <h1 className="intro-title">
        <span className="text-orange" style={{ color: 'var(--gold)' }}>Scroll</span> <span className="text-white">Quest</span>
      </h1>
      <h2 className="intro-subtitle">ScrollQuest · Master General &amp; Missing Terms with Strategic Tool Selection</h2>

      {/* Mascot Row */}
      <div className="intro-mascot-row">
        <div className="intro-mascot-circle">🐢</div>
        <div className="intro-speech-bubble">
          Greetings, apprentice restorer! I am Relic the Tortoise.<br />
          Ancient scrolls have lost their numbers — which restoration tool will you reach for first? 📜🏺
        </div>
      </div>

      {/* Description */}
      <p className="intro-desc">
        Master when to reach for lightning-fast term-to-term checking and when to deploy the general term formula.
        Restore early, middle, and far gaps, conquer non-consecutive ledgers, and cross-verify every ancient artifact!
      </p>

      {/* Journey Card */}
      <div className="journey-card">
        <div className="journey-card-title">YOUR RESTORATION JOURNEY · CLICK ANY PHASE TO ENTER</div>

        <div className="journey-steps-container">
          <div className="journey-row top-row">
            {JOURNEY.slice(0, 3).map((j, i) => (
              <React.Fragment key={j.num}>
                <div
                  className="journey-step-item clickable-step"
                  onClick={() => dispatch({ type: 'SET_PHASE', payload: j.label.toLowerCase() === 'practice' ? 'play' : j.label.toLowerCase() })}
                  role="button"
                  tabIndex={0}
                  title={`Click to open ${j.label} phase`}
                >
                  <span className="journey-icon-circle">{j.icon}</span>
                  <div className="journey-text-col">
                    <span className="journey-item-title">{j.label}</span>
                    <span className="journey-item-desc">{j.desc}</span>
                  </div>
                </div>
                <span className={`journey-arrow ${i === 2 ? 'fade-arrow' : ''}`}>→</span>
              </React.Fragment>
            ))}
          </div>

          <div className="journey-row bottom-row">
            {JOURNEY.slice(3, 5).map((j, i) => (
              <React.Fragment key={j.num}>
                <div
                  className="journey-step-item clickable-step"
                  onClick={() => dispatch({ type: 'SET_PHASE', payload: j.label.toLowerCase() === 'practice' ? 'play' : j.label.toLowerCase() })}
                  role="button"
                  tabIndex={0}
                  title={`Click to open ${j.label} phase`}
                >
                  <span className="journey-icon-circle">{j.icon}</span>
                  <div className="journey-text-col">
                    <span className="journey-item-title">{j.label}</span>
                    <span className="journey-item-desc">{j.desc}</span>
                  </div>
                </div>
                {i === 0 && <span className="journey-arrow">→</span>}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="intro-actions-row">
        {hasSaved ? (
          <>
            <button className="btn btn-primary btn-lg" onClick={resumeSession}>
              Resume Restoration 📜
            </button>
            <button className="btn btn-outline btn-lg" onClick={startFresh}>
              Start Fresh 🔄
            </button>
          </>
        ) : (
          <button className="btn btn-primary btn-lg" onClick={startFresh}>
            Enter the Grand Archive 🏛️
          </button>
        )}
      </div>
    </div>
  );
}
