// src/components/simulations/TheFullRestoration.jsx
// Station C: The Full Restoration (Multi-Step / Composite Construction)
// Comprehensive archaeological challenge combining early gap, middle gap, tabular gap, and cross-verification

import React, { useState } from 'react';
import './Stations.css';
import RestorationVisual from '../shared/RestorationVisual.jsx';
import { useAudio } from '../../hooks/useAudio.js';
import { crossVerifyGap } from '../../utils/restorationMath.js';

// Composite Artifact with a = 6, d = 4:
// n=1: Blank (Early Gap) -> value 6
// n=2: 10
// n=3: 14
// n=4: Blank (Middle Gap) -> value 18
// n=5: 22
// Tabular Ledger Section:
// Position 5 = 22, Position 8 = Blank -> value 34
const A = 6;
const D = 4;

export default function TheFullRestoration({ onComplete, audioEnabled }) {
  const { narrate, stopAll, sounds } = useAudio(audioEnabled);

  // Status for each of the 3 gaps
  const [activeStep, setActiveStep] = useState(1); // 1, 2, or 3
  const [inputs, setInputs] = useState({ 1: '', 2: '', 3: '' });
  const [tools, setTools] = useState({ 1: null, 2: null, 3: null });
  const [verified, setVerified] = useState({ 1: false, 2: false, 3: false });
  const [feedback, setFeedback] = useState(null);
  const [success, setSuccess] = useState(false);

  // Artifact Sequence for live display
  const sequenceData = [
    { position: 1, value: verified[1] ? 6 : null, isBlank: !verified[1] },
    { position: 2, value: 10, isBlank: false },
    { position: 3, value: 14, isBlank: false },
    { position: 4, value: verified[2] ? 18 : null, isBlank: !verified[2] },
    { position: 5, value: 22, isBlank: false },
  ];

  const ledgerData = [
    { position: 5, value: 22 },
    { position: 8, value: verified[3] ? 34 : null, isBlank: !verified[3] },
  ];

  function handleVerifyStep(step) {
    stopAll();
    const val = Number(inputs[step]?.trim());
    const tool = tools[step];

    if (!tool) {
      sounds.wrong();
      setFeedback({ type: 'error', text: 'Select an archaeological tool before verifying!' });
      return;
    }

    if (isNaN(val)) {
      sounds.wrong();
      setFeedback({ type: 'error', text: 'Enter a valid number for this restoration!' });
      return;
    }

    let correctVal = 0;
    let targetPos = 1;
    let expectedTool = 'term-to-term';

    if (step === 1) {
      correctVal = 6;
      targetPos = 1;
      expectedTool = 'term-to-term';
    } else if (step === 2) {
      correctVal = 18;
      targetPos = 4;
      expectedTool = 'term-to-term';
    } else if (step === 3) {
      correctVal = 34;
      targetPos = 8;
      expectedTool = 'general-term';
    }

    // Run cross-verification check
    const isMathValid = crossVerifyGap(sequenceData, targetPos, val, A, D);

    if (isMathValid && val === correctVal) {
      sounds.correct();
      const newVerified = { ...verified, [step]: true };
      setVerified(newVerified);
      setFeedback({
        type: 'success',
        text: `Gap ${step} certified! Both Term-to-Term and General Term agree on value ${val}!`,
      });
      narrate([{ text: `Gap ${step} restored and cross-verified!`, style: 'celebration' }]);

      if (step < 3) {
        setTimeout(() => {
          setActiveStep(step + 1);
          setFeedback(null);
        }, 1200);
      } else if (newVerified[1] && newVerified[2] && newVerified[3]) {
        setSuccess(true);
      }
    } else {
      sounds.wrong();
      setFeedback({
        type: 'error',
        text: `Cross-verification failed! The value ${val} does not agree with both methods. Check common difference d = +4.`,
      });
    }
  }

  return (
    <div className="station-wrap">
      {/* Station Header */}
      <div className="station-header">
        <h3 className="station-title">🏛️ Station C: The Full Composite Restoration</h3>
        <div className="station-target-box">
          <span className="station-target-label">Gaps Certified:</span>
          <span className="station-target-num">
            {[verified[1], verified[2], verified[3]].filter(Boolean).length} / 3
          </span>
        </div>
      </div>

      <div className="station-grid-2col">
        {/* Left Column: Live Composite Artifact Display */}
        <div className="station-col-left">
          <div className="station-panel-box">
            <h4 className="panel-subhead">Composite Artifact: Royal Dynasty Scroll &amp; Ledger</h4>
            <p className="panel-caption">Known core sequence: a = 6, d = +4 · Formula: T_n = 4n + 2</p>

            {/* Scroll Part */}
            <div className="composite-scroll-part">
              <span className="part-tag">Part 1: Ancient Scroll Fragment (Gaps 1 &amp; 2)</span>
              <RestorationVisual
                type="scroll-strip"
                data={{
                  sequence: sequenceData,
                  blankIndices: [verified[1] ? null : 1, verified[2] ? null : 4].filter(Boolean),
                }}
                compact={false}
              />
            </div>

            {/* Ledger Part */}
            <div className="composite-ledger-part">
              <span className="part-tag">Part 2: Royal Archive Ledger (Gap 3: Position 8)</span>
              <RestorationVisual
                type="restoration-table"
                data={{
                  rows: ledgerData,
                  columns: ['Record Position (n)', 'Certified Value (T_n)'],
                }}
                compact={true}
              />
            </div>
          </div>
        </div>

        {/* Right Column: Step-by-Step Restoration & Cross-Verification */}
        <div className="station-col-right">
          <div className="station-panel-box">
            {/* Step Selector Tabs */}
            <div className="step-pills-row">
              <button
                className={`step-pill ${activeStep === 1 ? 'active' : ''} ${verified[1] ? 'done' : ''}`}
                onClick={() => { sounds.click(); setActiveStep(1); }}
              >
                {verified[1] ? '✅' : '1.'} Early Gap (n=1)
              </button>
              <button
                className={`step-pill ${activeStep === 2 ? 'active' : ''} ${verified[2] ? 'done' : ''}`}
                onClick={() => { sounds.click(); setActiveStep(2); }}
              >
                {verified[2] ? '✅' : '2.'} Middle Gap (n=4)
              </button>
              <button
                className={`step-pill ${activeStep === 3 ? 'active' : ''} ${verified[3] ? 'done' : ''}`}
                onClick={() => { sounds.click(); setActiveStep(3); }}
              >
                {verified[3] ? '✅' : '3.'} Ledger Gap (n=8)
              </button>
            </div>

            {/* Active Step Content */}
            <div className="active-step-body">
              {activeStep === 1 && (
                <div>
                  <h4 className="active-step-title">Gap 1: Faded Opening at Position n = 1</h4>
                  <p className="panel-caption">
                    Known: Position 2 is <strong>10</strong>, Position 3 is <strong>14</strong>. Reason backward!
                  </p>
                </div>
              )}
              {activeStep === 2 && (
                <div>
                  <h4 className="active-step-title">Gap 2: Missing Middle at Position n = 4</h4>
                  <p className="panel-caption">
                    Known: Position 3 is <strong>14</strong>, Position 5 is <strong>22</strong>. Step forward!
                  </p>
                </div>
              )}
              {activeStep === 3 && (
                <div>
                  <h4 className="active-step-title">Gap 3: Far Ledger Entry at Position n = 8</h4>
                  <p className="panel-caption">
                    Position 8 is far from position 5. Use General Term T_8 = 6 + (8 − 1)(4)!
                  </p>
                </div>
              )}

              {/* Tool Selection for current gap */}
              <div className="tool-select-mini-row">
                <button
                  className={`btn-tool-mini ${tools[activeStep] === 'term-to-term' ? 'active' : ''}`}
                  onClick={() => { sounds.click(); setTools({ ...tools, [activeStep]: 'term-to-term' }); }}
                  disabled={verified[activeStep]}
                >
                  🖌️ Term-to-Term
                </button>
                <button
                  className={`btn-tool-mini ${tools[activeStep] === 'general-term' ? 'active' : ''}`}
                  onClick={() => { sounds.click(); setTools({ ...tools, [activeStep]: 'general-term' }); }}
                  disabled={verified[activeStep]}
                >
                  📜 General Term
                </button>
              </div>

              {/* Numeric Input & Cross-Verify Button */}
              <div className="number-input-row" style={{ marginTop: '8px' }}>
                <input
                  type="number"
                  placeholder="Restored number..."
                  value={inputs[activeStep] || ''}
                  onChange={(e) => setInputs({ ...inputs, [activeStep]: e.target.value })}
                  disabled={verified[activeStep]}
                  className="sandstorm-input"
                  aria-label={`Restored value for Gap ${activeStep}`}
                />
                <button
                  className="btn-primary"
                  onClick={() => handleVerifyStep(activeStep)}
                  disabled={verified[activeStep] || !inputs[activeStep]}
                >
                  {verified[activeStep] ? 'Certified ✓' : '🛡️ Cross-Verify'}
                </button>
              </div>

              {feedback && (
                <div className={`sandstorm-feedback ${feedback.type === 'success' ? 'feed-success' : 'feed-error'}`}>
                  {feedback.text}
                </div>
              )}
            </div>
          </div>

          {/* Success Panel */}
          {success ? (
            <div className="station-success anim-bounce-in">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="success-icon">🎉</span>
                <p className="station-success-msg">
                  Masterpiece Restored! You resolved all 3 composite gaps across scroll and ledger formats and certified every single term!
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
                💡 Fill and cross-verify all 3 gaps. Notice how the Guild uses both methods to prove authenticity!
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
