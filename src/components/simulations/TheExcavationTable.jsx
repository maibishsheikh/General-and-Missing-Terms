// src/components/simulations/TheExcavationTable.jsx
// Station A: The Excavation Table (Concept Discovery Lab)
// Interactive side-by-side comparison of Term-to-Term vs General-Term formula

import React, { useState } from 'react';
import './Stations.css';
import RestorationVisual from '../shared/RestorationVisual.jsx';
import { useAudio } from '../../hooks/useAudio.js';
import { EFFICIENCY_THRESHOLD, determineEfficientMethod } from '../../utils/restorationMath.js';

export default function TheExcavationTable({ onComplete, audioEnabled }) {
  const { narrate, stopAll, sounds } = useAudio(audioEnabled);

  // Sequence state: starts with a = 4, d = 3 (known terms at n = 1, 2, 3)
  const a = 4;
  const d = 3;
  const knownPositions = [1, 2, 3];

  const [gapPos, setGapPos] = useState(5); // slider from 4 to 15
  const [activeTool, setActiveTool] = useState('both'); // 'term-to-term' | 'general-term' | 'both'
  const [hasExplored, setHasExplored] = useState(false);
  const [quizAnswered, setQuizAnswered] = useState(false);
  const [quizSelected, setQuizSelected] = useState(null);
  const [success, setSuccess] = useState(false);

  // Calculations for current gap
  const nearestKnownPos = 3;
  const nearestKnownVal = a + (nearestKnownPos - 1) * d; // 4 + 2*3 = 10
  const steps = gapPos - nearestKnownPos;
  const recommendedTool = determineEfficientMethod(knownPositions, gapPos);
  const isNear = steps <= EFFICIENCY_THRESHOLD;

  function handleSliderChange(newPos) {
    sounds.click();
    setGapPos(newPos);
    setHasExplored(true);
  }

  function handleConfirmationQuestion(answer) {
    stopAll();
    setQuizSelected(answer);
    if (answer === 'general-term') {
      sounds.correct();
      setQuizAnswered(true);
      setSuccess(true);
      narrate([
        { text: "Spot on! Since position 9 is 7 steps away (more than 3), the General Term formula is far more efficient!", style: 'celebration' },
      ]);
    } else {
      sounds.wrong();
      narrate([
        { text: "Take another look at the distance! Stepping 7 times term-by-term is much slower than substituting once into the formula.", style: 'encouragement' },
      ]);
    }
  }

  return (
    <div className="station-wrap">
      {/* Station Header */}
      <div className="station-header">
        <h3 className="station-title">🏺 Station A: The Excavation Table</h3>
        <div className="station-target-box">
          <span className="station-target-label">Gap Position:</span>
          <span className="station-target-num">n = {gapPos} ({steps} steps away)</span>
        </div>
      </div>

      <div className="station-grid-2col">
        {/* Left Column: Interactive Controls & Slider */}
        <div className="station-col-left">
          <div className="station-panel-box">
            <h4 className="panel-subhead">1. Move the Gap on the Artifact</h4>
            <p className="panel-caption">
              Known artifact terms: <strong>n=1 (4), n=2 (7), n=3 (10)</strong> · Step d = <strong>+3</strong>
            </p>

            {/* Gap Stepper & Slider */}
            <div className="slider-control-row">
              <button
                className="btn-stepper"
                onClick={() => handleSliderChange(Math.max(4, gapPos - 1))}
                disabled={gapPos <= 4}
                aria-label="Decrease gap position"
              >
                −
              </button>
              <input
                type="range"
                min="4"
                max="14"
                value={gapPos}
                onChange={(e) => handleSliderChange(Number(e.target.value))}
                className="position-slider"
                aria-label="Artifact Gap Position"
              />
              <button
                className="btn-stepper"
                onClick={() => handleSliderChange(Math.min(14, gapPos + 1))}
                disabled={gapPos >= 14}
                aria-label="Increase gap position"
              >
                +
              </button>
            </div>

            {/* Threshold Indicator Pill */}
            <div className={`threshold-badge ${isNear ? 'threshold-near' : 'threshold-far'}`}>
              <span className="badge-icon">{isNear ? '⚡' : '📜'}</span>
              <span>
                Distance = {steps} step(s) {isNear ? `(≤ ${EFFICIENCY_THRESHOLD} threshold ➔ Term-to-Term is faster!)` : `(> ${EFFICIENCY_THRESHOLD} threshold ➔ General Term is faster!)`}
              </span>
            </div>
          </div>

          {/* Discovery Confirmation Challenge */}
          <div className="station-panel-box confirm-box">
            <h4 className="panel-subhead">2. Guild Certification Check</h4>
            <p className="confirm-q-text">
              If an artifact has known terms at positions 1 and 2, and a gap at <strong>position 9</strong> (7 steps away), which tool is faster?
            </p>

            <div className="confirm-options-row">
              <button
                className={`btn-choice ${quizSelected === 'term-to-term' ? 'choice-wrong' : ''}`}
                onClick={() => handleConfirmationQuestion('term-to-term')}
                disabled={success}
              >
                🖌️ Term-to-Term (7 steps)
              </button>
              <button
                className={`btn-choice ${quizSelected === 'general-term' ? 'choice-correct' : ''}`}
                onClick={() => handleConfirmationQuestion('general-term')}
                disabled={success}
              >
                📜 General Term Formula (1 step)
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Live Side-by-Side Comparison */}
        <div className="station-col-right">
          <div className="live-preview-panel">
            <div className="live-preview-header">
              <span className="preview-label">Live Working Comparison (Gap at n = {gapPos}):</span>
            </div>

            <RestorationVisual
              type="tool-comparison"
              data={{
                gapPos,
                nearestKnownPos,
                nearestKnownVal,
                commonDiff: d,
                firstTerm: a,
                stepsRequired: steps,
                recommendedTool,
              }}
              compact={false}
            />
          </div>

          {/* Success Panel */}
          {success ? (
            <div className="station-success anim-bounce-in">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="success-icon">🎉</span>
                <p className="station-success-msg">
                  Discovery Certified! You understood the Guild efficiency rule: close gaps (≤3) use term-to-term; far gaps (>3) use the general term!
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
                💡 Drag the slider above 4 through 14 to see how the faster method flips once you pass {EFFICIENCY_THRESHOLD} steps from a known term!
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
