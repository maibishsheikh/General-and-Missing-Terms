// src/components/simulations/RaceAgainstTheSandstorm.jsx
// Station B: Race Against the Sandstorm — Real-world Emergency Rescue Sim
// Students race to restore ancient monument numbers before a dust storm buries them.
// Inspired by real archaeological emergency rescues (like saving Palmyra artifacts).

import React, { useState, useEffect, useRef } from 'react';
import './Stations.css';
import { useAudio } from '../../hooks/useAudio.js';
import { determineEfficientMethod, EFFICIENCY_THRESHOLD } from '../../utils/restorationMath.js';

const RESCUE_ROUNDS = [
  {
    round: 1,
    title: 'Temple Column Heights',
    story: 'A line of temple columns has height markers (in cubits) arranged in an arithmetic pattern. A sandstorm is approaching — you must restore the faded marker before the wind erases all evidence!',
    columns: [
      { pos: 1, val: 10, visible: true },
      { pos: 2, val: 15, visible: true },
      { pos: 3, val: 20, visible: true },
      { pos: 4, val: null, visible: false },
    ],
    knownPositions: [1, 2, 3],
    gapPos: 4,
    a: 10, d: 5,
    answer: 25,
    timeLimit: 50,
    stormIntensity: 'mild',
    hint: 'Position 4 is just 1 step from position 3 (value 20). Add d = +5 once!',
  },
  {
    round: 2,
    title: 'Obelisk Distance Markers',
    story: 'Along the Pharaoh\'s highway, obelisks mark distances. The 15th marker was shattered by a storm. You have the first 3 markers — can you calculate it before the storm closes in?',
    columns: [
      { pos: 1, val: 8, visible: true },
      { pos: 2, val: 14, visible: true },
      { pos: 3, val: 20, visible: true },
    ],
    knownPositions: [1, 2, 3],
    gapPos: 15,
    a: 8, d: 6,
    answer: 92,
    timeLimit: 60,
    stormIntensity: 'moderate',
    hint: 'Position 15 is 12 steps from position 3 — way too far for term-to-term! Use T_n = a + (n-1)d.',
  },
  {
    round: 3,
    title: 'Aqueduct Flow Rates',
    story: 'An ancient aqueduct has flow rate engravings that decrease by a constant amount at each gate. Gate 5\'s engraving is damaged. Restore it before flooding breaches the structure!',
    columns: [
      { pos: 1, val: 50, visible: true },
      { pos: 2, val: 44, visible: true },
      { pos: 3, val: 38, visible: true },
      { pos: 5, val: 26, visible: true },
    ],
    knownPositions: [1, 2, 3, 5],
    gapPos: 4,
    a: 50, d: -6,
    answer: 32,
    timeLimit: 45,
    stormIntensity: 'severe',
    hint: 'Position 4 is between positions 3 (38) and 5 (26). Step from position 3: 38 + (-6) = 32.',
  },
];

export default function RaceAgainstTheSandstorm({ onComplete, audioEnabled }) {
  const { narrate, stopAll, sounds } = useAudio(audioEnabled);

  const [roundIdx, setRoundIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(RESCUE_ROUNDS[0].timeLimit);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedTool, setSelectedTool] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [workingSteps, setWorkingSteps] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [completedRounds, setCompletedRounds] = useState(0);
  const [success, setSuccess] = useState(false);
  const [stormOpacity, setStormOpacity] = useState(0);
  const timerRef = useRef(null);

  const round = RESCUE_ROUNDS[roundIdx];
  const efficientTool = determineEfficientMethod(round.knownPositions, round.gapPos);
  const stepsFromNearest = Math.min(
    ...round.knownPositions.map(p => Math.abs(round.gapPos - p))
  );

  // Storm timer with visual intensity
  useEffect(() => {
    if (success || isPaused) return;

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          sounds.wrong();
          narrate([{ text: 'The sandstorm swept through! Dust cleared — try again with fresh eyes!', style: 'encouragement' }]);
          return round.timeLimit;
        }
        // Update storm visual intensity
        const elapsed = round.timeLimit - (prev - 1);
        setStormOpacity(Math.min(elapsed / round.timeLimit * 0.6, 0.6));
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [success, isPaused, roundIdx, sounds, narrate, round.timeLimit]);

  function handleCheck() {
    stopAll();
    const num = Number(inputValue.trim());

    if (!selectedTool) {
      sounds.wrong();
      setFeedback({ type: 'error', text: '⚠️ Select a restoration tool first!' });
      return;
    }
    if (isNaN(num) || inputValue.trim() === '') {
      sounds.wrong();
      setFeedback({ type: 'error', text: '⚠️ Enter the missing number!' });
      return;
    }

    const isToolCorrect = selectedTool === efficientTool;
    const isValCorrect = num === round.answer;

    if (isToolCorrect && isValCorrect) {
      sounds.correct();
      const timeTaken = round.timeLimit - timeLeft;
      setFeedback({
        type: 'success',
        text: `🎉 Rescued in ${timeTaken}s! Correct value (${round.answer}) with the optimal ${efficientTool === 'term-to-term' ? 'Term-to-Term' : 'General Term'} method!`,
      });
      narrate([{ text: 'Outstanding emergency rescue work! Artifact saved from the sandstorm!', style: 'celebration' }]);

      if (roundIdx + 1 < RESCUE_ROUNDS.length) {
        setTimeout(() => {
          setRoundIdx(r => r + 1);
          setTimeLeft(RESCUE_ROUNDS[roundIdx + 1].timeLimit);
          setSelectedTool(null);
          setInputValue('');
          setWorkingSteps('');
          setFeedback(null);
          setStormOpacity(0);
          setCompletedRounds(c => c + 1);
        }, 1500);
      } else {
        setCompletedRounds(RESCUE_ROUNDS.length);
        setSuccess(true);
      }
    } else if (isValCorrect && !isToolCorrect) {
      sounds.wrong();
      setFeedback({
        type: 'error',
        text: `Value correct! But position ${round.gapPos} is ${stepsFromNearest} step(s) from known — ${efficientTool === 'term-to-term' ? 'Term-to-Term (≤3 steps)' : 'General Term (>3 steps)'} is more efficient!`,
      });
    } else {
      sounds.wrong();
      setFeedback({ type: 'error', text: `💡 ${round.hint}` });
    }
  }

  if (success) {
    return (
      <div className="station-wrap">
        <div className="station-success anim-bounce-in" style={{ maxWidth: 520, margin: '40px auto' }}>
          <span className="success-icon" style={{ fontSize: '3rem' }}>🌪️</span>
          <p className="station-success-msg">
            All {RESCUE_ROUNDS.length} emergency rescues completed! You saved ancient monuments from the sandstorm using both near-gap and far-gap restoration techniques!
          </p>
          <div className="station-success-actions">
            <button className="btn-green" onClick={onComplete}>Complete Station ✓</button>
          </div>
        </div>
      </div>
    );
  }

  const timerPercent = (timeLeft / round.timeLimit) * 100;
  const timerColor = timeLeft < 15 ? '#ef4444' : timeLeft < 25 ? '#f59e0b' : '#38bdf8';

  return (
    <div className="station-wrap" style={{ position: 'relative' }}>
      {/* Storm Overlay */}
      <div className="storm-overlay" style={{ opacity: stormOpacity }} />

      {/* Header */}
      <div className="station-header">
        <h3 className="station-title">🌪️ Station B: Race Against the Sandstorm</h3>
        <div className="station-target-box">
          <span className="station-target-label">Rescue {roundIdx + 1}/{RESCUE_ROUNDS.length}</span>
          <span className="station-target-num" style={{ color: timerColor }}>{timeLeft}s</span>
        </div>
      </div>

      {/* Story Context */}
      <div className="sim-story-banner">
        <span className="sim-story-icon">🏛️</span>
        <p className="sim-story-text">{round.story}</p>
      </div>

      {/* Storm Timer Bar */}
      <div className="sandstorm-timer-card">
        <div className="timer-label-row">
          <span className="timer-text">🌪️ Storm Approaching: <strong>{timeLeft}s remaining</strong></span>
          <button className="btn-pause" onClick={() => { sounds.click(); setIsPaused(p => !p); }}>
            {isPaused ? '▶️ Resume' : '⏸️ Pause'}
          </button>
        </div>
        <div className="sandstorm-progress-track">
          <div className="sandstorm-progress-fill" style={{ width: `${timerPercent}%`, background: timerColor }} />
        </div>
      </div>

      <div className="station-grid-2col">
        {/* Left: Monument Visualization */}
        <div className="station-col-left">
          <div className="station-panel-box">
            <h4 className="panel-subhead">🏛️ {round.title}</h4>
            <div className="monument-display">
              {round.columns.map(col => (
                <div key={col.pos} className={`monument-column ${col.visible ? 'intact' : 'damaged'}`}>
                  <div className="column-shaft">
                    <div className="column-capital">⟪</div>
                    <div className="column-value">
                      {col.visible ? col.val : '❓'}
                    </div>
                    <div className="column-base">⟫</div>
                  </div>
                  <span className="column-label">n={col.pos}</span>
                </div>
              ))}
            </div>
            <div className="pattern-analysis-box" style={{ marginTop: 12 }}>
              <div className="pattern-row">
                <span className="pattern-label">Pattern:</span>
                <span className="pattern-value">a = {round.a}, d = {round.d > 0 ? '+' : ''}{round.d}</span>
              </div>
              <div className="pattern-row">
                <span className="pattern-label">Gap Distance:</span>
                <span className={`pattern-value ${stepsFromNearest <= EFFICIENCY_THRESHOLD ? 'near-badge' : 'far-badge'}`}>
                  {stepsFromNearest} steps {stepsFromNearest <= EFFICIENCY_THRESHOLD ? '⚡ NEAR' : '📜 FAR'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Tool + Answer */}
        <div className="station-col-right">
          <div className="station-panel-box">
            <h4 className="panel-subhead">Step 1: Choose Fastest Tool</h4>
            <div className="tool-select-grid">
              <button
                className={`tool-card-btn ${selectedTool === 'term-to-term' ? 'active-tool' : ''}`}
                onClick={() => { sounds.click(); setSelectedTool('term-to-term'); }}
              >
                <span className="tool-card-icon">🖌️</span>
                <span className="tool-card-name">Term-to-Term</span>
                <span className="tool-card-desc">Step from nearest (≤ 3 steps)</span>
              </button>
              <button
                className={`tool-card-btn ${selectedTool === 'general-term' ? 'active-tool' : ''}`}
                onClick={() => { sounds.click(); setSelectedTool('general-term'); }}
              >
                <span className="tool-card-icon">📜</span>
                <span className="tool-card-name">General Term</span>
                <span className="tool-card-desc">Formula T_n = a + (n−1)d (&gt; 3 steps)</span>
              </button>
            </div>
          </div>

          <div className="station-panel-box">
            <h4 className="panel-subhead">Step 2: Show Your Working (optional)</h4>
            <textarea
              className="working-textarea"
              rows={2}
              placeholder="e.g., T_15 = 8 + (15-1)×6 = 8 + 84 = 92"
              value={workingSteps}
              onChange={(e) => setWorkingSteps(e.target.value)}
            />
          </div>

          <div className="station-panel-box">
            <h4 className="panel-subhead">Step 3: Enter Restored Value</h4>
            <div className="number-input-row">
              <input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Missing number..."
                className="sandstorm-input"
                aria-label="Restored number"
              />
              <button className="btn-primary" onClick={handleCheck} disabled={!inputValue}>
                ⚡ Rescue!
              </button>
            </div>
            {feedback && (
              <div className={`sandstorm-feedback ${feedback.type === 'success' ? 'feed-success' : 'feed-error'}`}>
                {feedback.text}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
