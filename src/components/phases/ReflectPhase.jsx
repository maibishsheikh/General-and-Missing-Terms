// src/components/phases/ReflectPhase.jsx
import React, { useState, useEffect, useRef } from 'react';
import './ReflectPhase.css';
import Mascot from '../shared/Mascot.jsx';
import { BADGES } from '../../utils/badgeEngine.js';
import { calcStars } from '../../utils/scoring.js';
import { useAudio } from '../../hooks/useAudio.js';
import { reflectNarration, reflectCompleteNarration } from '../../utils/narration.js';
import { generateSessionQuestions } from '../../utils/shuffle.js';
import questionBank from '../../data/questionBank.js';

const REFLECT_QUESTIONS = [
  {
    q: "1. Why is using the general term formula preferred over term-to-term checking when finding a far term at position n = 45?",
    options: [
      "Because stepping 44 times term-by-term is slow and error-prone; the formula calculates it in one step.",
      "Because term-to-term checking is mathematically invalid for positions greater than 10.",
      "Because the formula only works when the common difference is a positive number.",
    ],
    correct: 0,
  },
  {
    q: "2. A restorer fills a gap using term-to-term checking and gets 24. Why does Guild code require cross-verification?",
    options: [
      "To confirm the restored number independently matches general-term substitution before certification.",
      "Because the Guild always requires guessing a second random number.",
      "Cross-verification is only necessary if your first calculation was done without paper.",
    ],
    correct: 0,
  },
  {
    q: "3. When reasoning backward to find a missing early term at position n = 1, what common trap must you avoid?",
    options: [
      "Adding the common difference instead of reversing the forward step (subtracting d).",
      "Assuming the first term must always be zero.",
      "Dividing the known term by the position number.",
    ],
    correct: 0,
  },
];

export default function ReflectPhase({ state, dispatch }) {
  const [answers, setAnswers]     = useState({});
  const [journal, setJournal]     = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { narrate, stopAll, sounds } = useAudio(state?.audioEnabled ?? true);
  const narrated = useRef(false);

  const totalCorrect = state?.districtCorrect?.reduce((s, c) => s + (c || 0), 0) || 0;
  const totalStars   = state?.districtScores?.reduce((s, sc) => {
    if (sc === null || sc === undefined) return s;
    return s + calcStars(sc);
  }, 0) || 0;

  useEffect(() => {
    if (!narrated.current) {
      narrated.current = true;
      narrate(reflectNarration());
    }
    dispatch({ type: 'COMPLETE_PHASE', payload: 'reflect' });
    return () => stopAll();
  }, [dispatch, narrate, stopAll]);

  function handleSelectOption(qIdx, optIdx) {
    sounds.click();
    setAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
  }

  function handleSubmit() {
    setSubmitted(true);
    stopAll();
    sounds.badge();
    narrate(reflectCompleteNarration());
  }

  function playAgain() {
    dispatch({ type: 'RESET_SESSION' });
    dispatch({ type: 'LOAD_QUESTIONS', payload: generateSessionQuestions(questionBank) });
    dispatch({ type: 'SET_PHASE', payload: 'intro' });
  }

  const earnedBadges = BADGES.filter(b => state?.badges?.includes(b.id));

  if (submitted) {
    return (
      <div className="reflect-wrap">
        <div className="trophy-card glass-card anim-bounce-in">
          <div className="trophy-icon">🏆</div>
          <h1 className="trophy-title headline">Master Archaeologist Certified!</h1>
          <p className="trophy-sub subheadline" style={{ color: 'var(--gold)' }}>
            General &amp; Missing Terms Mastery Complete ✅
          </p>

          {/* Stats Breakdown */}
          <div className="trophy-stats">
            <div className="trophy-stat">
              <span className="stat-value number-display">{totalCorrect}</span>
              <span className="stat-label label-text">/ 100 Questions</span>
            </div>
            <div className="trophy-stat">
              <span className="stat-value number-display">{state?.xp || 0}</span>
              <span className="stat-label label-text">XP Earned ⭐</span>
            </div>
            <div className="trophy-stat">
              <span className="stat-value number-display">{state?.maxStreak || 0}</span>
              <span className="stat-label label-text">Best Streak 🔥</span>
            </div>
          </div>

          {/* Stars */}
          <div className="trophy-stars">
            {[...Array(Math.min(Math.max(totalStars, 3), 30))].map((_, i) => (
              <span key={i} style={{ fontSize: '1.3rem', animationDelay: `${i * 0.05}s` }} className="anim-bounce-in">
                ⭐
              </span>
            ))}
          </div>

          {/* Badges */}
          {earnedBadges.length > 0 && (
            <div className="trophy-badges">
              <h3 className="subheadline" style={{ fontSize: '1rem', color: 'var(--gold)', marginBottom: '8px' }}>
                Guild Badges Unlocked:
              </h3>
              <div className="badges-grid-compact">
                {earnedBadges.map(b => (
                  <div key={b.id} className="badge-pill-compact" title={b.description}>
                    <span>{b.icon}</span>
                    <span>{b.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {journal && (
            <div className="journal-review-card">
              <span className="journal-review-label">📜 Your Restorer's Field Log:</span>
              <p className="journal-review-text">"{journal}"</p>
            </div>
          )}

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '16px' }}>
            <button className="btn btn-primary" onClick={playAgain}>
              Restore Another Archive 🔄
            </button>
            <button className="btn btn-outline" onClick={() => dispatch({ type: 'SET_PHASE', payload: 'play' })}>
              Revisit Worlds 🗺️
            </button>
          </div>
        </div>
      </div>
    );
  }

  const allAnswered = Object.keys(answers).length === REFLECT_QUESTIONS.length;

  return (
    <div className="reflect-wrap">
      <div className="reflect-container anim-slide-up">
        {/* Header */}
        <div className="reflect-header glass-card">
          <span className="reflect-badge-tag">📓 Phase 5 · Curator's Reflection</span>
          <h1 className="reflect-title headline">The Restoration Guild Review</h1>
          <p className="body-text" style={{ color: 'var(--sand)' }}>
            True mastery is not just calculating numbers — it is knowing <em>which tool to reach for</em> and proving your restoration through cross-verification.
          </p>
        </div>

        {/* 3 Recap Questions targeting misconceptions */}
        <div className="reflect-questions-card glass-card">
          <h2 className="subheadline" style={{ color: 'var(--gold)', marginBottom: '14px' }}>
            🧠 Guild Restorer's Code Check:
          </h2>

          {REFLECT_QUESTIONS.map((item, qIdx) => (
            <div key={qIdx} className="reflect-q-block">
              <p className="reflect-q-text">{item.q}</p>
              <div className="reflect-options-list">
                {item.options.map((opt, optIdx) => {
                  const isSelected = answers[qIdx] === optIdx;
                  return (
                    <button
                      key={optIdx}
                      className={`reflect-opt-btn ${isSelected ? 'selected' : ''}`}
                      onClick={() => handleSelectOption(qIdx, optIdx)}
                    >
                      <span className="opt-indicator">{isSelected ? '●' : '○'}</span>
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Reflection Journal Prompt */}
        <div className="reflect-journal-card glass-card">
          <h3 className="subheadline" style={{ color: 'var(--gold)', marginBottom: '6px' }}>
            📜 Restorer's Field Log (PRD §8.5):
          </h3>
          <p className="body-text" style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '10px' }}>
            Which restoration made you switch tools partway through, and why?
          </p>
          <textarea
            className="journal-textarea"
            rows={3}
            placeholder="Write your observation here (e.g., 'When I realized position 28 was 25 steps away, I switched from term-to-term to the general formula...')"
            value={journal}
            onChange={(e) => setJournal(e.target.value)}
          />
        </div>

        {/* Mascot Advice */}
        <div className="reflect-mascot-row">
          <Mascot
            mood="mentor"
            message="Take your time to reflect! The best restorers always know why their method works before applying it."
            size="sm"
          />
        </div>

        {/* Submit Button */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '12px' }}>
          <button
            className="btn btn-primary btn-lg"
            onClick={handleSubmit}
            disabled={!allAnswered}
            style={{ opacity: allAnswered ? 1 : 0.5 }}
          >
            Submit Field Log &amp; Receive Certificate 📜✓
          </button>
        </div>
      </div>
    </div>
  );
}
