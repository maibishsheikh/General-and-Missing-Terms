// src/components/simulations/TheExcavationTable.jsx
// Station A: "The Pattern Lab" — TEACH common difference & term-to-term stepping
// Progressive: Animated visual → Guided discovery → Scaffolded practice
// Grade 7 friendly: Every concept explained step-by-step with visuals

import React, { useState, useEffect, useRef } from 'react';
import './Stations.css';
import { useAudio } from '../../hooks/useAudio.js';

export default function TheExcavationTable({ onComplete, audioEnabled }) {
  const { narrate, stopAll, sounds } = useAudio(audioEnabled);

  // Teaching phases: learn → guided → practice → complete
  const [stage, setStage] = useState('learn'); // learn | guided | practice | complete
  const [learnStep, setLearnStep] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [highlightIdx, setHighlightIdx] = useState(-1);
  const [jumpArrows, setJumpArrows] = useState([]);

  // Guided practice state
  const [guidedStep, setGuidedStep] = useState(0);
  const [guidedAnswer, setGuidedAnswer] = useState('');
  const [guidedFeedback, setGuidedFeedback] = useState(null);

  // Free practice state
  const [practiceRound, setPracticeRound] = useState(0);
  const [practiceAnswer, setPracticeAnswer] = useState('');
  const [practiceFeedback, setPracticeFeedback] = useState(null);

  // Teaching sequence: 3, 7, 11, 15, 19, 23
  const teachSeq = [3, 7, 11, 15, 19, 23];
  const teachD = 4;
  const teachA = 3;

  // ─── LEARN STAGE: Animated step-by-step concept teaching ───
  const LEARN_SLIDES = [
    {
      title: '🔍 What is an Arithmetic Sequence?',
      body: 'Look at this row of ancient scroll numbers. Notice something special about how they grow?',
      showSeq: true, showDiffs: false, showFormula: false,
      highlight: -1, arrows: [],
    },
    {
      title: '📏 Finding the Common Difference (d)',
      body: 'The SECRET is: each number grows by the SAME amount! Let\'s check: 7 − 3 = 4, 11 − 7 = 4, 15 − 11 = 4. The common difference d = +4.',
      showSeq: true, showDiffs: true, showFormula: false,
      highlight: -1, arrows: [0, 1, 2, 3, 4],
    },
    {
      title: '🖌️ Tool #1: Term-to-Term Stepping',
      body: 'To find the NEXT number, just add d! Starting from 23 (position 6), what comes at position 7? Simply: 23 + 4 = 27! This is called "term-to-term checking".',
      showSeq: true, showDiffs: true, showFormula: false,
      highlight: 5, arrows: [0, 1, 2, 3, 4, 5],
    },
    {
      title: '⬅️ Stepping BACKWARD',
      body: 'What if the gap is BEFORE position 1? To go backward, SUBTRACT d! Before position 1 (value 3): 3 − 4 = −1. Going backward means subtracting the common difference.',
      showSeq: true, showDiffs: true, showFormula: false,
      highlight: 0, arrows: [],
    },
    {
      title: '⚡ When is Term-to-Term FAST?',
      body: 'Term-to-term is LIGHTNING FAST when the missing number is close — within 1, 2, or 3 steps of a known number. One jump? Instant! But 20 jumps? That would take forever… (we\'ll learn a better tool for that in Station B!)',
      showSeq: true, showDiffs: false, showFormula: false,
      highlight: -1, arrows: [],
    },
  ];

  function advanceLearn() {
    sounds.click();
    if (learnStep < LEARN_SLIDES.length - 1) {
      setLearnStep(s => s + 1);
    } else {
      setStage('guided');
      narrate([{ text: 'Great! Now let\'s practice what you just learned with some guided examples!', style: 'celebration' }]);
    }
  }

  // ─── GUIDED STAGE: Scaffolded practice with step-by-step help ───
  const GUIDED_PROBLEMS = [
    {
      seq: [5, 9, 13, 17, null],
      positions: [1, 2, 3, 4, 5],
      d: 4, a: 5,
      gapIdx: 4, gapPos: 5,
      answer: 21,
      scaffolding: [
        'Step 1: Find the common difference → 9 − 5 = 4, so d = +4 ✓',
        'Step 2: The gap is at position 5, right next to position 4 (value 17)',
        'Step 3: Add d once → 17 + 4 = ?',
      ],
      hint: 'Just add 4 to the last known number (17)!',
    },
    {
      seq: [null, 10, 16, 22, 28],
      positions: [1, 2, 3, 4, 5],
      d: 6, a: 4,
      gapIdx: 0, gapPos: 1,
      answer: 4,
      scaffolding: [
        'Step 1: Find the common difference → 16 − 10 = 6, so d = +6 ✓',
        'Step 2: The gap is at position 1, BEFORE position 2 (value 10)',
        'Step 3: Go BACKWARD: subtract d → 10 − 6 = ?',
      ],
      hint: 'Going backward means SUBTRACTING d from position 2!',
    },
    {
      seq: [20, 17, null, 11, 8],
      positions: [1, 2, 3, 4, 5],
      d: -3, a: 20,
      gapIdx: 2, gapPos: 3,
      answer: 14,
      scaffolding: [
        'Step 1: Find the common difference → 17 − 20 = −3, so d = −3 (decreasing!) ✓',
        'Step 2: The gap is at position 3, right next to position 2 (value 17)',
        'Step 3: Add d (which is −3) → 17 + (−3) = 17 − 3 = ?',
      ],
      hint: 'The sequence DECREASES by 3 each time. From 17, subtract 3!',
    },
  ];

  function checkGuided() {
    const problem = GUIDED_PROBLEMS[guidedStep];
    const num = Number(guidedAnswer.trim());
    if (isNaN(num) || guidedAnswer.trim() === '') {
      sounds.wrong();
      setGuidedFeedback({ type: 'error', text: '⚠️ Enter a number!' });
      return;
    }
    if (num === problem.answer) {
      sounds.correct();
      setGuidedFeedback({ type: 'success', text: `🎉 Correct! The answer is ${problem.answer}!` });
      narrate([{ text: `Perfect! ${problem.answer} is right!`, style: 'celebration' }]);
      setTimeout(() => {
        if (guidedStep + 1 < GUIDED_PROBLEMS.length) {
          setGuidedStep(s => s + 1);
          setGuidedAnswer('');
          setGuidedFeedback(null);
        } else {
          setStage('practice');
          setGuidedFeedback(null);
        }
      }, 1200);
    } else {
      sounds.wrong();
      setGuidedFeedback({ type: 'error', text: `❌ Not quite! Hint: ${problem.hint}` });
    }
  }

  // ─── PRACTICE STAGE: Free practice (less scaffolding) ───
  const PRACTICE_PROBLEMS = [
    {
      seq: [8, 13, 18, null, 28],
      positions: [1, 2, 3, 4, 5],
      d: 5, gapIdx: 3, answer: 23,
      question: 'The sequence is: 8, 13, 18, ?, 28. Find the missing number at position 4.',
    },
    {
      seq: [null, 12, 19, 26, 33],
      positions: [1, 2, 3, 4, 5],
      d: 7, gapIdx: 0, answer: 5,
      question: 'The sequence is: ?, 12, 19, 26, 33. What is the first term?',
    },
  ];

  function checkPractice() {
    const problem = PRACTICE_PROBLEMS[practiceRound];
    const num = Number(practiceAnswer.trim());
    if (isNaN(num) || practiceAnswer.trim() === '') {
      sounds.wrong();
      setPracticeFeedback({ type: 'error', text: '⚠️ Enter a number!' });
      return;
    }
    if (num === problem.answer) {
      sounds.correct();
      setPracticeFeedback({ type: 'success', text: `🎉 Correct! The answer is ${problem.answer}!` });
      setTimeout(() => {
        if (practiceRound + 1 < PRACTICE_PROBLEMS.length) {
          setPracticeRound(r => r + 1);
          setPracticeAnswer('');
          setPracticeFeedback(null);
        } else {
          setStage('complete');
        }
      }, 1200);
    } else {
      sounds.wrong();
      setPracticeFeedback({
        type: 'error',
        text: `❌ Not quite! Find d first (subtract consecutive terms), then step from the nearest known number.`,
      });
    }
  }

  // ─── RENDER ───
  const slide = LEARN_SLIDES[learnStep] || LEARN_SLIDES[0];

  return (
    <div className="station-wrap sim-teaching-station">
      {/* Header */}
      <div className="station-header">
        <h3 className="station-title">🏺 Station A: The Pattern Lab</h3>
        <div className="station-target-box">
          <span className="station-target-label">
            {stage === 'learn' ? 'Learning' : stage === 'guided' ? 'Guided Practice' : stage === 'practice' ? 'Free Practice' : 'Complete'}
          </span>
          <span className="station-target-num">
            {stage === 'learn' ? `${learnStep + 1}/${LEARN_SLIDES.length}` :
             stage === 'guided' ? `${guidedStep + 1}/${GUIDED_PROBLEMS.length}` :
             stage === 'practice' ? `${practiceRound + 1}/${PRACTICE_PROBLEMS.length}` : '✅'}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="sim-teach-progress">
        <div className="sim-teach-progress-track">
          {['learn', 'guided', 'practice', 'complete'].map((s, i) => (
            <div key={s} className={`progress-segment ${
              s === stage ? 'current' :
              ['learn', 'guided', 'practice', 'complete'].indexOf(stage) > i ? 'done' : ''
            }`}>
              <span className="segment-label">{['📖 Learn', '🤝 Guided', '💪 Practice', '🏆 Done'][i]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ─── LEARN STAGE ─── */}
      {stage === 'learn' && (
        <div className="teach-content">
          <div className="teach-card glass-card">
            <h4 className="teach-title">{slide.title}</h4>
            <p className="teach-body">{slide.body}</p>

            {/* Animated Sequence Display */}
            {slide.showSeq && (
              <div className="teach-sequence-area">
                <div className="teach-number-line">
                  {teachSeq.map((val, i) => (
                    <div key={i} className={`teach-tile ${slide.highlight === i ? 'highlighted' : ''} ${i <= learnStep ? 'revealed' : ''}`}>
                      <span className="teach-pos-label">n={i + 1}</span>
                      <div className="teach-tile-box">
                        <span className="teach-tile-val">{val}</span>
                      </div>
                    </div>
                  ))}
                  {/* Extra tile for "next" in step 3 */}
                  {learnStep === 2 && (
                    <div className="teach-tile highlighted">
                      <span className="teach-pos-label">n=7</span>
                      <div className="teach-tile-box new-tile">
                        <span className="teach-tile-val">27</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Jump Arrows showing +d */}
                {slide.showDiffs && (
                  <div className="teach-arrows-row">
                    {slide.arrows.map((_, i) => (
                      <div key={i} className="teach-jump-arrow" style={{ animationDelay: `${i * 0.15}s` }}>
                        <span className="jump-arc">⌢</span>
                        <span className="jump-label">+{teachD}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Backward step visual */}
            {learnStep === 3 && (
              <div className="teach-backward-visual">
                <div className="backward-demo">
                  <span className="bw-val">−1</span>
                  <span className="bw-arrow">← subtract {teachD} ←</span>
                  <span className="bw-val">{teachSeq[0]}</span>
                  <span className="bw-label">position 0</span>
                  <span className="bw-label" style={{ marginLeft: 60 }}>position 1</span>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="teach-nav">
              {learnStep > 0 && (
                <button className="btn btn-outline btn-sm" onClick={() => { sounds.click(); setLearnStep(s => s - 1); }}>
                  ← Back
                </button>
              )}
              <button className="btn btn-primary btn-sm" onClick={advanceLearn}>
                {learnStep < LEARN_SLIDES.length - 1 ? 'Next →' : 'Start Practice! 🎯'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── GUIDED STAGE ─── */}
      {stage === 'guided' && (
        <div className="teach-content">
          <div className="teach-card glass-card">
            <h4 className="teach-title">🤝 Guided Practice #{guidedStep + 1}</h4>

            {/* Sequence with gap */}
            <div className="teach-sequence-area">
              <div className="teach-number-line">
                {GUIDED_PROBLEMS[guidedStep].seq.map((val, i) => (
                  <div key={i} className={`teach-tile ${val === null ? 'gap' : 'revealed'}`}>
                    <span className="teach-pos-label">n={GUIDED_PROBLEMS[guidedStep].positions[i]}</span>
                    <div className={`teach-tile-box ${val === null ? 'gap-box' : ''}`}>
                      <span className="teach-tile-val">{val !== null ? val : '?'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Scaffolding Steps */}
            <div className="scaffolding-box">
              <h5 className="scaffolding-title">📋 Follow these steps:</h5>
              {GUIDED_PROBLEMS[guidedStep].scaffolding.map((step, i) => (
                <div key={i} className="scaffolding-step">
                  <span className="scaff-check">✦</span>
                  <span className="scaff-text">{step}</span>
                </div>
              ))}
            </div>

            {/* Answer Input */}
            <div className="teach-answer-row">
              <input
                type="number"
                value={guidedAnswer}
                onChange={(e) => setGuidedAnswer(e.target.value)}
                placeholder="Your answer..."
                className="teach-input"
                aria-label="Your answer"
              />
              <button className="btn btn-primary" onClick={checkGuided} disabled={!guidedAnswer}>
                Check ✓
              </button>
            </div>

            {guidedFeedback && (
              <div className={`teach-feedback ${guidedFeedback.type}`}>
                {guidedFeedback.text}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── PRACTICE STAGE ─── */}
      {stage === 'practice' && (
        <div className="teach-content">
          <div className="teach-card glass-card">
            <h4 className="teach-title">💪 Free Practice #{practiceRound + 1}</h4>
            <p className="teach-body">{PRACTICE_PROBLEMS[practiceRound].question}</p>

            <div className="teach-sequence-area">
              <div className="teach-number-line">
                {PRACTICE_PROBLEMS[practiceRound].seq.map((val, i) => (
                  <div key={i} className={`teach-tile ${val === null ? 'gap' : 'revealed'}`}>
                    <span className="teach-pos-label">n={PRACTICE_PROBLEMS[practiceRound].positions[i]}</span>
                    <div className={`teach-tile-box ${val === null ? 'gap-box' : ''}`}>
                      <span className="teach-tile-val">{val !== null ? val : '?'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="teach-tip-box">
              💡 Remember: Find d first, then step from the nearest known term!
            </div>

            <div className="teach-answer-row">
              <input
                type="number"
                value={practiceAnswer}
                onChange={(e) => setPracticeAnswer(e.target.value)}
                placeholder="Your answer..."
                className="teach-input"
              />
              <button className="btn btn-primary" onClick={checkPractice} disabled={!practiceAnswer}>
                Submit ✓
              </button>
            </div>

            {practiceFeedback && (
              <div className={`teach-feedback ${practiceFeedback.type}`}>
                {practiceFeedback.text}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── COMPLETE STAGE ─── */}
      {stage === 'complete' && (
        <div className="teach-content">
          <div className="station-success anim-bounce-in" style={{ maxWidth: 520, margin: '20px auto' }}>
            <span className="success-icon" style={{ fontSize: '3rem' }}>🏺</span>
            <h4 className="teach-title" style={{ color: '#4ade80' }}>Station A Complete!</h4>
            <p className="station-success-msg">
              You've mastered <strong>Term-to-Term Stepping</strong>! You can find the common difference d, step forward (+d) and backward (−d), and restore nearby gaps.
            </p>
            <div className="teach-summary-box">
              <div className="summary-rule">
                <span className="rule-icon">🖌️</span>
                <span>Term-to-Term: Add d to go forward, subtract d to go backward</span>
              </div>
              <div className="summary-rule">
                <span className="rule-icon">⚡</span>
                <span>Best when the gap is CLOSE (≤ 3 steps away)</span>
              </div>
            </div>
            <div className="station-success-actions">
              <button className="btn-green" onClick={onComplete}>
                Next: Learn the Formula! →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
