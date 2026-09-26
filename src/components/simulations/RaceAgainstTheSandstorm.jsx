// src/components/simulations/RaceAgainstTheSandstorm.jsx
// Station B: Race Against the Sandstorm (Build-to-Target Challenge)
// Multi-round challenge requiring both correct tool selection & restored value before the sandstorm settles

import React, { useState, useEffect } from 'react';
import './Stations.css';
import RestorationVisual from '../shared/RestorationVisual.jsx';
import { useAudio } from '../../hooks/useAudio.js';
import { determineEfficientMethod } from '../../utils/restorationMath.js';

const ROUNDS = [
  {
    round: 1,
    seq: [
      { position: 1, value: 5 },
      { position: 2, value: 9 },
      { position: 3, value: null, isBlank: true },
      { position: 4, value: 17 },
    ],
    knownPositions: [1, 2, 4],
    gapPos: 3,
    a: 5,
    d: 4,
    correctValue: 13,
    hint: "Position 3 is right between position 2 and 4 (distance = 1 step).",
  },
  {
    round: 2,
    seq: [
      { position: 1, value: 3 },
      { position: 2, value: 8 },
      { position: 3, value: 13 },
    ],
    knownPositions: [1, 2, 3],
    gapPos: 12,
    a: 3,
    d: 5,
    correctValue: 58, // 3 + 11*5 = 58
    hint: "Position 12 is 9 steps away from known terms. Avoid 9 tedious jumps!",
  },
  {
    round: 3,
    seq: [
      { position: 1, value: 20 },
      { position: 2, value: 16 },
      { position: 3, value: 12 },
      { position: 4, value: null, isBlank: true },
    ],
    knownPositions: [1, 2, 3],
    gapPos: 4,
    a: 20,
    d: -4,
    correctValue: 8,
    hint: "Notice the sequence decreases by 4. Distance is only 1 step from position 3.",
  },
];

export default function RaceAgainstTheSandstorm({ onComplete, audioEnabled }) {
  const { narrate, stopAll, sounds } = useAudio(audioEnabled);

  const [roundIdx, setRoundIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(45);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedTool, setSelectedTool] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [completedRounds, setCompletedRounds] = useState(0);
  const [success, setSuccess] = useState(false);

  const currentRound = ROUNDS[roundIdx] || ROUNDS[0];
  const efficientTool = determineEfficientMethod(currentRound.knownPositions, currentRound.gapPos);

  // Sandstorm countdown timer (pausable per PRD §12)
  useEffect(() => {
    if (success || isPaused) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          // Soft reset for current round, no penalty
          sounds.wrong();
          narrate([{ text: "The sandstorm swept the tablet! Let's clear the dust and try again.", style: 'encouragement' }]);
          return 45;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [success, isPaused, sounds, narrate]);

  function handleCheck() {
    stopAll();
    const num = Number(inputValue.trim());

    if (!selectedTool) {
      sounds.wrong();
      setFeedback({ type: 'error', text: 'Select a restoration tool before confirming!' });
      return;
    }

    if (isNaN(num)) {
      sounds.wrong();
      setFeedback({ type: 'error', text: 'Enter a valid restored number!' });
      return;
    }

    const isToolCorrect = selectedTool === efficientTool;
    const isValCorrect = num === currentRound.correctValue;

    if (isToolCorrect && isValCorrect) {
      sounds.correct();
      setFeedback({ type: 'success', text: `Spot on! Efficient tool (${efficientTool}) and correct restored value (${currentRound.correctValue})!` });
      narrate([{ text: "Magnificent! Fast tool choice and perfect calculation!", style: 'celebration' }]);

      if (roundIdx + 1 < ROUNDS.length) {
        setTimeout(() => {
          setRoundIdx(r => r + 1);
          setCompletedRounds(c => c + 1);
          setSelectedTool(null);
          setInputValue('');
          setFeedback(null);
          setTimeLeft(45);
        }, 1200);
      } else {
        setCompletedRounds(ROUNDS.length);
        setSuccess(true);
      }
    } else if (!isToolCorrect && isValCorrect) {
      sounds.wrong();
      setFeedback({
        type: 'error',
        text: `Your number is right, but the tool is inefficient! Position ${currentRound.gapPos} requires ${efficientTool === 'term-to-term' ? 'Term-to-Term' : 'the General Term'}.`,
      });
    } else {
      sounds.wrong();
      setFeedback({ type: 'error', text: `Calculation error! Recheck the pattern: ${currentRound.hint}` });
    }
  }

  function togglePause() {
    sounds.click();
    setIsPaused(p => !p);
  }

  return (
    <div className="station-wrap">
      {/* Station Header */}
      <div className="station-header">
        <h3 className="station-title">🌪️ Station B: Race Against the Sandstorm</h3>
        <div className="station-target-box">
          <span className="station-target-label">Round {roundIdx + 1} of {ROUNDS.length}</span>
          <span className="station-target-num">{timeLeft}s</span>
        </div>
      </div>

      <div className="station-grid-2col">
        {/* Left Column: Sandstorm Timer & Artifact */}
        <div className="station-col-left">
          {/* Sandstorm Timer Bar with Pausable Control */}
          <div className="sandstorm-timer-card">
            <div className="timer-label-row">
              <span className="timer-text">🌪️ Sandstorm Approaching: <strong>{timeLeft}s remaining</strong></span>
              <button className="btn-pause" onClick={togglePause} aria-label={isPaused ? 'Resume Sandstorm' : 'Pause Sandstorm'}>
                {isPaused ? '▶️ Resume' : '⏸️ Pause'}
              </button>
            </div>
            <div className="sandstorm-progress-track">
              <div
                className="sandstorm-progress-fill"
                style={{
                  width: `${(timeLeft / 45) * 100}%`,
                  background: timeLeft < 15 ? '#ef4444' : timeLeft < 25 ? '#f59e0b' : '#38bdf8',
                }}
              />
            </div>
          </div>

          {/* Current Damaged Artifact */}
          <div className="station-panel-box">
            <h4 className="panel-subhead">Damaged Artifact to Restore (Round {roundIdx + 1}):</h4>
            <RestorationVisual
              type="scroll-strip"
              data={{
                sequence: currentRound.seq,
                blankIndices: [currentRound.gapPos],
                highlightPos: currentRound.gapPos,
              }}
              compact={false}
            />
            <p className="panel-caption">
              Target: Restore the missing term at <strong>position n = {currentRound.gapPos}</strong>.
            </p>
          </div>
        </div>

        {/* Right Column: Tool Choice & Numeric Input */}
        <div className="station-col-right">
          <div className="station-panel-box">
            <h4 className="panel-subhead">Step 1: Choose the Fastest Tool</h4>
            <div className="tool-select-grid">
              <button
                className={`tool-card-btn ${selectedTool === 'term-to-term' ? 'active-tool' : ''}`}
                onClick={() => { sounds.click(); setSelectedTool('term-to-term'); }}
                disabled={success}
              >
                <span className="tool-card-icon">🖌️</span>
                <span className="tool-card-name">Term-to-Term</span>
                <span className="tool-card-desc">Step directly from nearest known term (≤ 3 steps)</span>
              </button>

              <button
                className={`tool-card-btn ${selectedTool === 'general-term' ? 'active-tool' : ''}`}
                onClick={() => { sounds.click(); setSelectedTool('general-term'); }}
                disabled={success}
              >
                <span className="tool-card-icon">📜</span>
                <span className="tool-card-name">General Term</span>
                <span className="tool-card-desc">Formula substitution T_n = a + (n−1)d (&gt; 3 steps)</span>
              </button>
            </div>
          </div>

          <div className="station-panel-box">
            <h4 className="panel-subhead">Step 2: Enter the Restored Value</h4>
            <div className="number-input-row">
              <input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Enter missing number..."
                className="sandstorm-input"
                disabled={success}
                aria-label="Restored number value"
              />
              <button className="btn-primary" onClick={handleCheck} disabled={success || !inputValue}>
                Verify &amp; Restore
              </button>
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
                <span className="success-icon">🎉</span>
                <p className="station-success-msg">
                  Sandstorm Defeated! You restored all {ROUNDS.length} artifacts using optimal tool choices under time pressure!
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
                💡 Remember: you get points for both choosing the faster tool AND calculating the correct value!
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
