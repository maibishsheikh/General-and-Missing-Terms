// src/components/simulations/TheForgersFakeRestoration.jsx
// Station D: The Forger's Fake Restoration (Error-Detective)
// Inspect rival claimed restorations, spot the seeded flaw (sign error, tabular gap slip, or inefficient tool), and certify the fix

import React, { useState } from 'react';
import './Stations.css';
import { useAudio } from '../../hooks/useAudio.js';

const FORGER_CASES = [
  {
    id: 1,
    title: "Case 1: The Faded Origin Slip",
    artifactInfo: "Damaged Scroll opening: [ __, 15, 21, 27 ]. Missing term at n = 1.",
    steps: [
      { id: 1, label: "Step 1", text: "Observed sequence forward difference: 21 − 15 = +6.", isError: false },
      { id: 2, label: "Step 2", text: "To find position 1, added the difference to position 2: 15 + 6 = 21.", isError: true },
      { id: 3, label: "Step 3", text: "Concluded that the missing first term at n = 1 is 21.", isError: false },
    ],
    flawExplanation: "Moving backward requires subtracting the common difference (+6), not adding it! 15 − 6 = 9.",
    correctionOptions: [
      { text: "Subtract 6 instead of adding: 15 − 6 = 9", correct: true },
      { text: "Add 12 to skip two positions: 15 + 12 = 27", correct: false },
      { text: "Keep 21 because positions can repeat", correct: false },
    ],
  },
  {
    id: 2,
    title: "Case 2: The Non-Consecutive Ledger Trap",
    artifactInfo: "Archive Ledger: Position 2 = 12, Position 6 = 32. Gap at Position 3.",
    steps: [
      { id: 1, label: "Step 1", text: "Calculated raw value difference: 32 − 12 = 20.", isError: false },
      { id: 2, label: "Step 2", text: "Assumed common difference d = 20 (ignored that position jumped by 4).", isError: true },
      { id: 3, label: "Step 3", text: "Calculated Position 3 as: 12 + 20 = 32.", isError: false },
    ],
    flawExplanation: "Positions jumped by 4 (6 − 2 = 4). You must divide raw difference by the position gap: 20 ÷ 4 = 5. So Position 3 = 12 + 5 = 17!",
    correctionOptions: [
      { text: "Divide value change by position gap: 20 ÷ 4 = 5, so T_3 = 12 + 5 = 17", correct: true },
      { text: "Multiply 20 by 4 to get d = 80", correct: false },
      { text: "Average 12 and 32 to get 22", correct: false },
    ],
  },
  {
    id: 3,
    title: "Case 3: The Inefficient Marathon Walk",
    artifactInfo: "Restoration of far term at position n = 35. Known: T_1 = 4, d = 3.",
    steps: [
      { id: 1, label: "Step 1", text: "Restorer identified a = 4 and common difference d = +3.", isError: false },
      { id: 2, label: "Step 2", text: "Decided to manually add +3 thirty-four consecutive times on scrap papyrus.", isError: true },
      { id: 3, label: "Step 3", text: "Spent 20 minutes doing 34 addition steps and introduced arithmetic errors.", isError: false },
    ],
    flawExplanation: "Distance is 34 steps (way beyond the threshold of 3)! Reaching for the general term T_35 = 4 + 34(3) = 106 takes just 5 seconds.",
    correctionOptions: [
      { text: "Use General Term: T_35 = 4 + (35 − 1)(3) = 106 in one clean step", correct: true },
      { text: "Double the step to jump by +6 instead", correct: false },
      { text: "Subtract 35 from 4", correct: false },
    ],
  },
];

export default function TheForgersFakeRestoration({ onComplete, audioEnabled }) {
  const { narrate, stopAll, sounds } = useAudio(audioEnabled);

  const [caseIdx, setCaseIdx] = useState(0);
  const [selectedStep, setSelectedStep] = useState(null);
  const [selectedFix, setSelectedFix] = useState(null);
  const [solvedCases, setSolvedCases] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [success, setSuccess] = useState(false);

  const activeCase = FORGER_CASES[caseIdx];

  function handleSelectStep(step) {
    sounds.click();
    setSelectedStep(step);
    setSelectedFix(null);
    setFeedback(null);
  }

  function handleSelectFix(option) {
    stopAll();
    setSelectedFix(option);

    if (!selectedStep) {
      sounds.wrong();
      setFeedback({ type: 'error', text: 'First click the erroneous step in the claim above!' });
      return;
    }

    if (!selectedStep.isError) {
      sounds.wrong();
      setFeedback({
        type: 'error',
        text: `Step ${selectedStep.id} is actually mathematically sound. Look closer at the other steps!`,
      });
      return;
    }

    if (option.correct) {
      sounds.correct();
      setFeedback({
        type: 'success',
        text: `Forgery Exposed! ${activeCase.flawExplanation}`,
      });
      narrate([{ text: "Brilliant archaeological detective work! The fake restoration was corrected!", style: 'celebration' }]);

      const newSolved = [...solvedCases, activeCase.id];
      setSolvedCases(newSolved);

      if (caseIdx + 1 < FORGER_CASES.length) {
        setTimeout(() => {
          setCaseIdx(c => c + 1);
          setSelectedStep(null);
          setSelectedFix(null);
          setFeedback(null);
        }, 1400);
      } else {
        setSuccess(true);
      }
    } else {
      sounds.wrong();
      setFeedback({ type: 'error', text: 'That correction does not fix the mathematical flaw. Try again!' });
    }
  }

  return (
    <div className="station-wrap">
      {/* Station Header */}
      <div className="station-header">
        <h3 className="station-title">🔍 Station D: The Forger's Fake Restoration</h3>
        <div className="station-target-box">
          <span className="station-target-label">Case Solved:</span>
          <span className="station-target-num">{caseIdx + 1} of {FORGER_CASES.length}</span>
        </div>
      </div>

      <div className="station-grid-2col">
        {/* Left Column: Suspect Working to Inspect */}
        <div className="station-col-left">
          <div className="station-panel-box">
            <div className="case-title-row">
              <span className="case-badge">Suspect Dossier #{caseIdx + 1}</span>
              <h4 className="case-title-text">{activeCase.title}</h4>
            </div>

            <p className="artifact-brief-box">
              📜 <strong>Evidence:</strong> {activeCase.artifactInfo}
            </p>

            <h5 className="sub-instruction">Click the step that contains the flawed reasoning:</h5>
            <div className="suspect-steps-list">
              {activeCase.steps.map(step => {
                const isSelected = selectedStep?.id === step.id;
                return (
                  <button
                    key={step.id}
                    className={`suspect-step-card ${isSelected ? 'step-selected' : ''}`}
                    onClick={() => handleSelectStep(step)}
                    aria-label={`Inspect ${step.label}: ${step.text}`}
                  >
                    <div className="step-tag-row">
                      <span className="step-tag">{step.label}</span>
                      {isSelected && <span className="inspect-pill">🔍 Inspected</span>}
                    </div>
                    <p className="step-body-text">{step.text}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Provide the Correct Guild Fix */}
        <div className="station-col-right">
          <div className="station-panel-box">
            <h4 className="panel-subhead">Guild Inspector's Correction:</h4>
            <p className="panel-caption">
              {selectedStep
                ? `You flagged ${selectedStep.label}. Select the legitimate Guild correction:`
                : '👈 Tap the suspicious step on the left to unlock corrections.'}
            </p>

            <div className="correction-options-list">
              {activeCase.correctionOptions.map((opt, i) => (
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
          </div>

          {/* Success Panel */}
          {success ? (
            <div className="station-success anim-bounce-in">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="success-icon">🏆</span>
                <p className="station-success-msg">
                  All Forgeries Exposed! You identified backward sign slips, tabular gap traps, and inefficient tool marathons!
                </p>
              </div>
              <div className="station-success-actions">
                <button className="btn-green" onClick={onComplete}>
                  Complete Station ✓
                </button>
              </div>
            </div>
          ) : (
            <div className="station-guide-card">
              <span className="station-guide-text">
                💡 A fake restoration often looks plausible at first glance. Inspect each step's arithmetic and method choice carefully!
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
