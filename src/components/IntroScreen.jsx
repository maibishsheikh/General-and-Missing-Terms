// src/components/IntroScreen.jsx
import React from 'react';
import './IntroScreen.css';
import { generateSessionQuestions } from '../utils/shuffle.js';
import questionBank from '../data/questionBank.js';

const JOURNEY = [
  { num: '01', icon: '🔍', label: 'Wonder',   sub: 'The Damaged Scroll', phase: 'wonder' },
  { num: '02', icon: '📖', label: 'Story',    sub: 'Kavya, Hafiz & Relic', phase: 'story' },
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
        Master First Terms (a), Common Differences (d), and General Term Formulas
      </h2>

      {/* Mascot Speech Bubble Row */}
      <div className="intro-speech-row">
        <div className="mascot-circle-avatar">
          🐢
        </div>
        <div className="mascot-speech-bubble">
          Hi! I'm Relic. The Guild's ancient number-scrolls are damaged! Check every gap, formulate general terms with T<sub>n</sub> = a + (n − 1)d, and calibrate restorations to save the archive! 📜 🏺
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
          <span className="fp-icon">📊</span>
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
