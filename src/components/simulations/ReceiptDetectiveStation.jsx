// src/components/simulations/ReceiptDetectiveStation.jsx
import React, { useState } from 'react';
import './Stations.css';
import { useAudio } from '../../hooks/useAudio.js';

const ERROR_SCENARIOS = [
  {
    id: 0,
    problem: "Book Purchase: Paid $5.00 for $3.40 Storybook",
    steps: [
      { text: "Item: Storybook price is $3.40", isError: false },
      { text: "Payment: Customer gave a $5.00 note", isError: false },
      { text: "Change Given: Cashier returned $2.60", isError: true, errorReason: "$5.00 − $3.40 = $1.60 change (Cashier overpaid by $1.00!)" },
    ],
    correctSolution: "Change = $5.00 − $3.40 = $1.60 (Not $2.60!)",
  },
  {
    id: 1,
    problem: "Fruit Shop: Apple 50¢ + Orange Juice 60¢",
    steps: [
      { text: "Item 1: Crisp Apple costs 50¢", isError: false },
      { text: "Item 2: Orange Juice costs 60¢", isError: false },
      { text: "Total Bill: Receipt printed $1.30", isError: true, errorReason: "50¢ + 60¢ = 110¢ = $1.10 (Receipt overcharged 20¢!)" },
    ],
    correctSolution: "Total = 50¢ + 60¢ = 110¢ = $1.10 (Not $1.30!)",
  },
  {
    id: 2,
    problem: "Snack Till: Paid $2.00 for 75¢ Star Snack",
    steps: [
      { text: "Item: Star Snack costs 75¢", isError: false },
      { text: "Payment: Customer paid with a $2.00 coin", isError: false },
      { text: "Change Given: Cashier gave back $1.35", isError: true, errorReason: "$2.00 − 75¢ = 200¢ − 75¢ = $1.25 change (Cashier miscalculated by 10¢!)" },
    ],
    correctSolution: "Change = $2.00 − 75¢ = $1.25 (Not $1.35!)",
  },
];

export default function ReceiptDetectiveStation({ onComplete, audioEnabled }) {
  const { narrate, stopAll, sounds } = useAudio(audioEnabled);
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [selectedStep, setSelectedStep] = useState(null);
  const [success, setSuccess] = useState(false);

  const scenario = ERROR_SCENARIOS[scenarioIdx] || ERROR_SCENARIOS[0];

  function handleSelectStep(stepIndex) {
    if (success) return;
    const step = scenario.steps[stepIndex];
    setSelectedStep(stepIndex);

    if (step.isError) {
      setSuccess(true);
      sounds.correct();
      narrate([{ text: "Spot on! You found the calculation mistake!", style: 'celebration' }]);
    } else {
      sounds.wrong();
      narrate([{ text: "That line is correct! Inspect the other lines carefully.", style: 'encouragement' }]);
    }
  }

  function nextScenario() {
    stopAll();
    setScenarioIdx(s => (s + 1) % ERROR_SCENARIOS.length);
    setSelectedStep(null);
    setSuccess(false);
  }

  return (
    <div className="station-wrap">
      {/* Header */}
      <div className="station-header">
        <h3 className="station-title">🔍 Station D: Receipt Detective &amp; Mistake Hunter</h3>
        <div className="station-target-box">
          <span className="station-target-label">Case:</span>
          <span className="station-target-num">{scenario.problem.split(':')[0]}</span>
        </div>
      </div>

      <div className="station-grid-2col">
        {/* Left Column: Receipt Line Steps & Actions */}
        <div className="station-col-left">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <p className="station-guide-text" style={{ textAlign: 'left', fontWeight: 700 }}>
              Detective Penny found a mistake on this receipt. Tap the <strong>incorrect line</strong>:
            </p>

            <div className="spot-steps-list">
              {scenario.steps.map((step, idx) => {
                const isSelected = selectedStep === idx;
                return (
                  <div
                    key={idx}
                    className={`spot-step-card ${isSelected && step.isError ? 'selected-error' : ''} ${isSelected && !step.isError ? 'selected-correct-step' : ''}`}
                    onClick={() => handleSelectStep(idx)}
                    role="button"
                    tabIndex={0}
                    aria-label={`Line ${idx + 1}: ${step.text}`}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', flex: 1, minWidth: 0 }}>
                      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--gold)', fontSize: '0.95rem', flexShrink: 0 }}>
                        Line {idx + 1}:
                      </span>
                      <span style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 'clamp(0.92rem, 1.1vw, 1.05rem)', color: '#ffffff', wordBreak: 'break-word', lineHeight: 1.35 }}>
                        {step.text}
                      </span>
                    </div>
                    {isSelected && step.isError && <span style={{ fontSize: '1.3rem', lineHeight: 1, flexShrink: 0 }}>🎯</span>}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="station-actions">
            <button className="btn-outline" onClick={nextScenario}>
              Next Case
            </button>
          </div>
        </div>

        {/* Right Column: Diagnosis, Solution & Success Panel */}
        <div className="station-col-right">
          {success && selectedStep !== null ? (
            <div className="station-success anim-bounce-in">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span className="success-icon">💡</span>
                <p className="station-success-msg">
                  <strong>Mistake Found:</strong> {scenario.steps[selectedStep].errorReason}
                </p>
              </div>
              <div style={{ background: 'rgba(34, 197, 94, 0.18)', border: '1.5px solid rgba(34, 197, 94, 0.4)', borderRadius: '12px', padding: '10px 14px', width: '100%' }}>
                <span style={{ color: '#86efac', fontWeight: 800, fontSize: 'clamp(0.92rem, 1.1vw, 1.02rem)' }}>
                  Correct Solution: {scenario.correctSolution}
                </span>
              </div>
              <div className="station-success-actions">
                <button className="btn-primary" onClick={nextScenario}>
                  Try Another Case
                </button>
                <button className="btn-green" onClick={onComplete}>
                  Complete Station ✓
                </button>
              </div>
            </div>
          ) : (
            <div className="station-guide-card" style={{ height: '100%' }}>
              <span style={{ fontSize: '2.2rem', marginBottom: '4px' }}>🧐</span>
              <span className="station-guide-text">
                Inspect each line of the receipt: verify the prices, addition, and change arithmetic to catch the shop error!
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
