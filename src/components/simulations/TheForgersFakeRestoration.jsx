// src/components/simulations/TheForgersFakeRestoration.jsx
// Station D: The Forger's Fake Restoration — Fraud Inspector Bureau
// Students work as fraud inspectors examining submitted restoration claims.
// Inspired by real art forgery detection in museums.

import React, { useState } from 'react';
import './Stations.css';
import { useAudio } from '../../hooks/useAudio.js';

const FORGERY_CASES = [
  {
    id: 1,
    title: 'The Reversed Archaeologist',
    caseFile: 'Suspect: Dr. Petra Voss',
    scenario: 'Dr. Voss submitted a restoration for a marble staircase with step-heights: [__, 15, 21, 27]. She claims the missing 1st step height is 21.',
    evidence: {
      pattern: '[__, 15, 21, 27]',
      claimed: 'Step 1 height = 21',
      d: '+6 (each step increases by 6 cm)',
    },
    steps: [
      { id: 1, label: 'Step 1', text: 'Identified common difference: 21 − 15 = +6. ✓', isError: false, icon: '✅' },
      { id: 2, label: 'Step 2', text: 'To find Step 1, ADDED +6 to Step 2: 15 + 6 = 21.', isError: true, icon: '🔍' },
      { id: 3, label: 'Step 3', text: 'Concluded Step 1 height = 21 cm.', isError: false, icon: '📝' },
    ],
    flawExplanation: 'Moving BACKWARD requires SUBTRACTING the common difference! Step 1 = 15 − 6 = 9, not 15 + 6 = 21. Dr. Voss made the classic "backward sign slip" — adding when she should have subtracted.',
    corrections: [
      { text: 'Subtract d: Step 1 = 15 − 6 = 9 cm', correct: true },
      { text: 'Double the difference: 15 + 12 = 27', correct: false },
      { text: 'Keep 21 — the pattern can have equal values', correct: false },
    ],
    realWorldLesson: 'In real archaeology, reversed-direction errors in dating sequences have led to artifacts being mislabeled by centuries!',
  },
  {
    id: 2,
    title: 'The Ledger Gap Trap',
    caseFile: 'Suspect: Prof. Marcus Reed',
    scenario: 'Prof. Reed\'s archive ledger shows: Position 2 = 12 items, Position 6 = 32 items. He claims Position 3 has 32 items (raw difference = 20, so T_3 = 12 + 20 = 32).',
    evidence: {
      pattern: 'Position 2 → 12, Position 6 → 32',
      claimed: 'Position 3 = 32',
      d: 'Claims d = 20',
    },
    steps: [
      { id: 1, label: 'Step 1', text: 'Calculated raw difference: 32 − 12 = 20. ✓', isError: false, icon: '✅' },
      { id: 2, label: 'Step 2', text: 'Used d = 20 directly (IGNORED that positions jumped by 4, not 1).', isError: true, icon: '🔍' },
      { id: 3, label: 'Step 3', text: 'Calculated T_3 = 12 + 20 = 32.', isError: false, icon: '📝' },
    ],
    flawExplanation: 'The positions jump from 2 to 6 — that\'s 4 steps, not 1! You must divide: d = 20 ÷ 4 = 5 per position. So T_3 = 12 + 5 = 17, NOT 32.',
    corrections: [
      { text: 'Divide by position gap: d = 20 ÷ 4 = 5, so T_3 = 12 + 5 = 17', correct: true },
      { text: 'Multiply 20 × 4 = 80 for d', correct: false },
      { text: 'Average 12 and 32: (12 + 32) ÷ 2 = 22', correct: false },
    ],
    realWorldLesson: 'Museum cataloguers must always check whether records are consecutive. Non-consecutive ledger entries are a common trap in inventory audits!',
  },
  {
    id: 3,
    title: 'The Marathon Walker',
    caseFile: 'Suspect: Apprentice Jun Li',
    scenario: 'Jun Li needed to restore the 35th marker on a desert highway (T_1 = 4, d = +3). He manually added +3 thirty-four times on scratch paper, taking 20 minutes and getting 103 (wrong!).',
    evidence: {
      pattern: 'T_1 = 4, d = +3, target: position 35',
      claimed: 'T_35 = 103 (after 34 manual additions)',
      d: '+3',
    },
    steps: [
      { id: 1, label: 'Step 1', text: 'Correctly identified a = 4 and d = +3. ✓', isError: false, icon: '✅' },
      { id: 2, label: 'Step 2', text: 'Chose to manually add +3 thirty-four times instead of using the general term formula.', isError: true, icon: '🔍' },
      { id: 3, label: 'Step 3', text: 'After 20 minutes of manual additions, arrived at 103 (with accumulated arithmetic errors).', isError: false, icon: '📝' },
    ],
    flawExplanation: '34 manual steps is absurdly inefficient (threshold is ≤ 3)! The general term gives the answer in seconds: T_35 = 4 + (35-1)×3 = 4 + 102 = 106. Jun Li also made arithmetic errors along the way, getting 103 instead.',
    corrections: [
      { text: 'Use General Term: T_35 = 4 + 34×3 = 4 + 102 = 106', correct: true },
      { text: 'Double the step: add +6 seventeen times', correct: false },
      { text: 'Subtract 35 from 4 to get −31', correct: false },
    ],
    realWorldLesson: 'In GPS surveying, engineers use formulas for kilometer markers — nobody walks the entire highway counting each one!',
  },
];

export default function TheForgersFakeRestoration({ onComplete, audioEnabled }) {
  const { narrate, stopAll, sounds } = useAudio(audioEnabled);

  const [caseIdx, setCaseIdx] = useState(0);
  const [selectedStep, setSelectedStep] = useState(null);
  const [selectedFix, setSelectedFix] = useState(null);
  const [solvedCases, setSolvedCases] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [success, setSuccess] = useState(false);

  const activeCase = FORGERY_CASES[caseIdx];

  function handleSelectStep(step) {
    sounds.click();
    setSelectedStep(step);
    setSelectedFix(null);
    setFeedback(null);
    setShowExplanation(false);
  }

  function handleSelectFix(option) {
    stopAll();
    setSelectedFix(option);

    if (!selectedStep) {
      sounds.wrong();
      setFeedback({ type: 'error', text: '⚠️ First, click the suspicious step in the case file!' });
      return;
    }

    if (!selectedStep.isError) {
      sounds.wrong();
      setFeedback({
        type: 'error',
        text: `Step "${selectedStep.label}" is actually mathematically correct! Look more carefully at the other steps.`,
      });
      return;
    }

    if (option.correct) {
      sounds.correct();
      setFeedback({
        type: 'success',
        text: `🕵️ Forgery exposed! ${activeCase.flawExplanation}`,
      });
      setShowExplanation(true);
      narrate([{ text: 'Brilliant detective work! The mathematical fraud has been corrected!', style: 'celebration' }]);

      const newSolved = [...solvedCases, activeCase.id];
      setSolvedCases(newSolved);

      if (caseIdx + 1 < FORGERY_CASES.length) {
        setTimeout(() => {
          setCaseIdx(c => c + 1);
          setSelectedStep(null);
          setSelectedFix(null);
          setFeedback(null);
          setShowExplanation(false);
        }, 2000);
      } else {
        setTimeout(() => setSuccess(true), 1500);
      }
    } else {
      sounds.wrong();
      setFeedback({ type: 'error', text: '❌ That correction doesn\'t fix the mathematical flaw. Try another approach!' });
    }
  }

  if (success) {
    return (
      <div className="station-wrap">
        <div className="station-success anim-bounce-in" style={{ maxWidth: 520, margin: '40px auto' }}>
          <span className="success-icon" style={{ fontSize: '3rem' }}>🕵️</span>
          <p className="station-success-msg">
            All 3 forgeries exposed! You caught backward sign slips, non-consecutive ledger traps, and inefficient marathon walks. You're a certified fraud inspector!
          </p>
          <div className="station-success-actions">
            <button className="btn-green" onClick={onComplete}>Complete Station ✓</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="station-wrap">
      {/* Header */}
      <div className="station-header">
        <h3 className="station-title">🔍 Station D: Fraud Inspector Bureau</h3>
        <div className="station-target-box">
          <span className="station-target-label">Cases Solved:</span>
          <span className="station-target-num">{solvedCases.length}/{FORGERY_CASES.length}</span>
        </div>
      </div>

      {/* Case File Banner */}
      <div className="sim-story-banner" style={{ borderColor: 'rgba(239, 68, 68, 0.4)' }}>
        <span className="sim-story-icon">🕵️</span>
        <p className="sim-story-text">
          <strong>{activeCase.caseFile}</strong> — {activeCase.scenario}
        </p>
      </div>

      <div className="station-grid-2col">
        {/* Left: Case File & Evidence */}
        <div className="station-col-left">
          <div className="station-panel-box">
            <div className="case-title-row">
              <span className="case-badge">Case #{caseIdx + 1}</span>
              <h4 className="case-title-text">{activeCase.title}</h4>
            </div>

            <div className="evidence-box">
              <h5 className="evidence-title">📋 Evidence Summary</h5>
              {Object.entries(activeCase.evidence).map(([key, val]) => (
                <div key={key} className="evidence-row">
                  <span className="evidence-label">{key}:</span>
                  <span className="evidence-value">{val}</span>
                </div>
              ))}
            </div>

            <h5 className="sub-instruction">🔍 Tap the step that contains the flawed reasoning:</h5>
            <div className="suspect-steps-list">
              {activeCase.steps.map(step => {
                const isSelected = selectedStep?.id === step.id;
                return (
                  <button
                    key={step.id}
                    className={`suspect-step-card ${isSelected ? 'step-selected' : ''}`}
                    onClick={() => handleSelectStep(step)}
                  >
                    <div className="step-tag-row">
                      <span className="step-tag">{step.icon} {step.label}</span>
                      {isSelected && <span className="inspect-pill">🔍 Inspecting</span>}
                    </div>
                    <p className="step-body-text">{step.text}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Guild Correction */}
        <div className="station-col-right">
          <div className="station-panel-box">
            <h4 className="panel-subhead">⚖️ Select the Correct Fix:</h4>
            <p className="panel-caption">
              {selectedStep
                ? `You flagged "${selectedStep.label}". Choose the correct Guild fix:`
                : '👈 First, tap the suspicious step on the left.'}
            </p>

            <div className="correction-options-list">
              {activeCase.corrections.map((opt, i) => (
                <button
                  key={i}
                  className={`btn-correction ${selectedFix?.text === opt.text ? (opt.correct ? 'fix-correct' : 'fix-wrong') : ''}`}
                  onClick={() => handleSelectFix(opt)}
                  disabled={!selectedStep || success}
                >
                  <span className="fix-icon">⚖️</span>
                  <span className="fix-text">{opt.text}</span>
                </button>
              ))}
            </div>

            {feedback && (
              <div className={`sandstorm-feedback ${feedback.type === 'success' ? 'feed-success' : 'feed-error'}`}>
                {feedback.text}
              </div>
            )}

            {showExplanation && (
              <div className="real-world-lesson">
                <span className="lesson-icon">🌍</span>
                <p className="lesson-text">{activeCase.realWorldLesson}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
