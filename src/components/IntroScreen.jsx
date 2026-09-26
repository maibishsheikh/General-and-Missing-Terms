// src/components/IntroScreen.jsx
import React from 'react';
import './IntroScreen.css';
import { generateSessionQuestions } from '../utils/shuffle.js';
import questionBank from '../data/questionBank.js';

const JOURNEY = [
  { num: '01', icon: '🔍', label: 'Wonder',   sub: 'Telemetry signal alert', phase: 'wonder' },
  { num: '02', icon: '📖', label: 'Story',    sub: 'Ishaan, Xin Yi & Orbit', phase: 'story' },
  { num: '03', icon: '🧪', label: 'Simulate', sub: '4 interactive labs', phase: 'simulate' },
  { num: '04', icon: '🎮', label: 'Practice', sub: '10 worlds & bosses', phase: 'play' },
  { num: '05', icon: '📓', label: 'Reflect',  sub: 'Review & scorecard', phase: 'reflect' },
];

export default function IntroScreen({ state, dispatch }) {
  function startJourney() {
    dispatch({ type: 'LOAD_QUESTIONS', payload: generateSessionQuestions(questionBank) });
    dispatch({ type: 'SET_PHASE', payload: 'wonder' });
  }

  return (
    <div className="intro-wrap">
      {/* Top Curriculum Pill */}
      <div className="intro-curriculum-pill">
        ✨ Curriculum · General &amp; Missing Terms Grade 7
      </div>

      {/* Main Title: Scroll in Orange, Quest in White */}
      <h1 className="intro-title">
        <span className="title-orange">Scroll</span> <span className="title-white">Quest</span>
      </h1>

      {/* Subtitle in Golden Yellow */}
      <h2 className="intro-subtitle">
        Master First Terms (a), Common Differences (d), and Trajectory Formulas
      </h2>

      {/* Mascot Speech Bubble Row */}
      <div className="intro-speech-row">
        <div className="mascot-circle-avatar" title="Orbit">
          <svg width="36" height="36" viewBox="0 0 44 44" fill="none">
            {/* Top Antenna */}
            <line x1="22" y1="11" x2="22" y2="4" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="22" cy="4" r="3.5" fill="#ef4444" stroke="#ffffff" strokeWidth="1.5" />
            {/* Ears / Headset */}
            <rect x="5" y="18" width="4" height="11" rx="2" fill="#38bdf8" stroke="#ffffff" strokeWidth="1.5" />
            <rect x="35" y="18" width="4" height="11" rx="2" fill="#38bdf8" stroke="#ffffff" strokeWidth="1.5" />
            {/* Head */}
            <rect x="8" y="11" width="28" height="25" rx="7" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
            {/* Screen / Visor */}
            <rect x="12" y="15" width="20" height="13" rx="4" fill="#0f172a" />
            {/* Eyes */}
            <circle cx="17" cy="21.5" r="2.8" fill="#38bdf8" />
            <circle cx="17.8" cy="20.7" r="1" fill="#ffffff" />
            <circle cx="27" cy="21.5" r="2.8" fill="#38bdf8" />
            <circle cx="27.8" cy="20.7" r="1" fill="#ffffff" />
            {/* Mouth */}
            <line x1="19" y1="31" x2="25" y2="31" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
        <div className="mascot-speech-bubble">
          Hi! I'm Orbit. Nova-7's telemetry stream is corrupted! Check every gap, formulate general terms with <span className="formula-highlight">T<sub>n</sub> = a + (n - 1)d</span>, and calibrate trajectories to save the mission! 🚀 📡
        </div>
      </div>

      {/* Learning Journey Card */}
      <div className="intro-journey-card">
        <div className="journey-card-header">
          YOUR LEARNING JOURNEY · CLICK ANY PHASE TO START
        </div>

        <div className="journey-steps-row">
          {JOURNEY.map((j, i) => (
            <React.Fragment key={j.num}>
              <div
                className="journey-step-box"
                onClick={() => dispatch({ type: 'SET_PHASE', payload: j.phase })}
                role="button"
                tabIndex={0}
                title={`Start ${j.label} phase`}
              >
                <div className="step-icon-circle">
                  <span>{j.icon}</span>
                </div>
                <span className="step-name">{j.label}</span>
                <span className="step-sub">{j.sub}</span>
              </div>
              {i < JOURNEY.length - 1 && (
                <span className="journey-flow-arrow">→</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* CTA Button */}
      <div className="intro-cta-wrap">
        <button className="btn-begin-journey" onClick={startJourney}>
          🚀 Begin Your Journey!
        </button>
      </div>

      {/* Bottom Feature Badges */}
      <div className="intro-feature-pills">
        <div className="feature-pill">
          <span className="fp-icon">🎯</span>
          <span>100 Questions</span>
        </div>
        <div className="feature-pill">
          <span className="fp-icon">📈</span>
          <span>Sequences &amp; AP</span>
        </div>
        <div className="feature-pill">
          <span className="fp-icon">✨</span>
          <span>Badges &amp; XP</span>
        </div>
      </div>
    </div>
  );
}
