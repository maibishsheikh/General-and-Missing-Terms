// src/components/simulations/TheFullRestoration.jsx
// Station C: The Full Restoration — Museum Curator's Workshop
// Students act as museum curators restoring a complete ancient calendar tablet.
// Inspired by real museum restoration of Babylonian astronomical tablets.

import React, { useState } from 'react';
import './Stations.css';
import { useAudio } from '../../hooks/useAudio.js';
import { crossVerifyGap, EFFICIENCY_THRESHOLD } from '../../utils/restorationMath.js';

// Real-world: Babylonian lunar calendar tablet with 3 damaged entries
const A = 6;
const D = 4;

const GAPS = [
  {
    id: 1,
    title: 'Faded Opening — Month 1',
    context: 'The first entry of the calendar is too faded to read. You can see Month 2 shows 10 ceremonies and Month 3 shows 14 ceremonies.',
    targetPos: 1,
    correctVal: 6,
    knownInfo: 'Month 2 = 10, Month 3 = 14',
    bestTool: 'term-to-term',
    reasoning: 'Month 1 is just 1 step back from Month 2 (10). Subtract d = 4 once: 10 − 4 = 6.',
    icon: '📅',
  },
  {
    id: 2,
    title: 'Water Damage — Month 4',
    context: 'Water stains obscure the Month 4 entry. Month 3 reads 14 ceremonies and Month 5 reads 22.',
    targetPos: 4,
    correctVal: 18,
    knownInfo: 'Month 3 = 14, Month 5 = 22',
    bestTool: 'term-to-term',
    reasoning: 'Month 4 is sandwiched between Month 3 (14) and Month 5 (22). Just add d = 4 to 14: 14 + 4 = 18.',
    icon: '💧',
  },
  {
    id: 3,
    title: 'Cracked Ledger — Month 8',
    context: 'The tax ledger extension records ceremony counts for later months. Month 5 is 22, but the Month 8 entry on a separate clay fragment is cracked.',
    targetPos: 8,
    correctVal: 34,
    knownInfo: 'Month 1 = 6, d = +4, or Month 5 = 22',
    bestTool: 'general-term',
    reasoning: 'Month 8 is 5 steps from Month 3 (too far for stepping). Use formula: T_8 = 6 + (8-1)×4 = 6 + 28 = 34.',
    icon: '🧩',
  },
];

export default function TheFullRestoration({ onComplete, audioEnabled }) {
  const { narrate, stopAll, sounds } = useAudio(audioEnabled);

  const [activeGap, setActiveGap] = useState(0);
  const [inputs, setInputs] = useState({ 0: '', 1: '', 2: '' });
  const [tools, setTools] = useState({ 0: null, 1: null, 2: null });
  const [crossVerifyInputs, setCrossVerifyInputs] = useState({ 0: '', 1: '', 2: '' });
  const [verified, setVerified] = useState({ 0: false, 1: false, 2: false });
  const [feedback, setFeedback] = useState(null);
  const [success, setSuccess] = useState(false);

  // Calendar display
  const calendarEntries = [
    { month: 1, val: verified[0] ? 6 : null, status: verified[0] ? 'restored' : 'damaged' },
    { month: 2, val: 10, status: 'intact' },
    { month: 3, val: 14, status: 'intact' },
    { month: 4, val: verified[1] ? 18 : null, status: verified[1] ? 'restored' : 'damaged' },
    { month: 5, val: 22, status: 'intact' },
  ];

  const ledgerEntry = { month: 8, val: verified[2] ? 34 : null, status: verified[2] ? 'restored' : 'damaged' };

  function handleVerify(gapIdx) {
    stopAll();
    const gap = GAPS[gapIdx];
    const val = Number(inputs[gapIdx]?.trim());
    const tool = tools[gapIdx];
    const crossVal = Number(crossVerifyInputs[gapIdx]?.trim());

    if (!tool) {
      sounds.wrong();
      setFeedback({ type: 'error', text: '⚠️ Select a restoration tool first!' });
      return;
    }
    if (isNaN(val) || inputs[gapIdx]?.trim() === '') {
      sounds.wrong();
      setFeedback({ type: 'error', text: '⚠️ Enter the restored value!' });
      return;
    }

    // Check primary answer
    if (val !== gap.correctVal) {
      sounds.wrong();
      setFeedback({
        type: 'error',
        text: `❌ Value ${val} doesn't fit the pattern. ${gap.reasoning}`,
      });
      return;
    }

    // Check cross-verification (must also be correct or empty)
    if (crossVerifyInputs[gapIdx]?.trim() && crossVal !== gap.correctVal) {
      sounds.wrong();
      setFeedback({
        type: 'error',
        text: `Cross-verification mismatch! Your primary answer (${val}) and cross-check (${crossVal}) don't agree. Both methods should give the same result.`,
      });
      return;
    }

    // Success for this gap
    sounds.correct();
    const newVerified = { ...verified, [gapIdx]: true };
    setVerified(newVerified);
    setFeedback({
      type: 'success',
      text: `✅ Month ${gap.targetPos} = ${gap.correctVal} certified! ${gap.reasoning}`,
    });
    narrate([{ text: `Gap ${gapIdx + 1} restored and certified by the museum board!`, style: 'celebration' }]);

    // Auto-advance to next gap
    if (gapIdx < 2 && !newVerified[gapIdx + 1]) {
      setTimeout(() => {
        setActiveGap(gapIdx + 1);
        setFeedback(null);
      }, 1200);
    }

    // Check if all done
    if (newVerified[0] && newVerified[1] && newVerified[2]) {
      setTimeout(() => setSuccess(true), 1000);
    }
  }

  if (success) {
    return (
      <div className="station-wrap">
        <div className="station-success anim-bounce-in" style={{ maxWidth: 520, margin: '40px auto' }}>
          <span className="success-icon" style={{ fontSize: '3rem' }}>🏛️</span>
          <p className="station-success-msg">
            The complete Babylonian Calendar Tablet is restored! You handled faded openings, water damage, and cracked fragments — using both near-gap and far-gap techniques with cross-verification!
          </p>
          <div className="station-success-actions">
            <button className="btn-green" onClick={onComplete}>Complete Station ✓</button>
          </div>
        </div>
      </div>
    );
  }

  const gap = GAPS[activeGap];

  return (
    <div className="station-wrap">
      {/* Header */}
      <div className="station-header">
        <h3 className="station-title">🏛️ Station C: Museum Curator's Workshop</h3>
        <div className="station-target-box">
          <span className="station-target-label">Fragments Certified:</span>
          <span className="station-target-num">
            {Object.values(verified).filter(Boolean).length} / 3
          </span>
        </div>
      </div>

      {/* Story Context */}
      <div className="sim-story-banner">
        <span className="sim-story-icon">🏛️</span>
        <p className="sim-story-text">
          You're the lead curator restoring a Babylonian lunar ceremony calendar. The tablet records a growing number of ceremonies each month (a = {A}, d = +{D}). Three entries are damaged.
        </p>
      </div>

      <div className="station-grid-2col">
        {/* Left: Calendar Display */}
        <div className="station-col-left">
          <div className="station-panel-box">
            <h4 className="panel-subhead">📅 Ceremony Calendar Tablet</h4>
            <div className="calendar-grid">
              {calendarEntries.map(entry => (
                <div key={entry.month} className={`calendar-cell ${entry.status}`}>
                  <span className="cal-month">Month {entry.month}</span>
                  <span className="cal-value">
                    {entry.val !== null ? `${entry.val} ⛩️` : '???'}
                  </span>
                </div>
              ))}
            </div>

            <div className="ledger-section">
              <h5 className="ledger-title">📜 Tax Ledger Extension</h5>
              <div className={`calendar-cell ledger-cell ${ledgerEntry.status}`}>
                <span className="cal-month">Month {ledgerEntry.month}</span>
                <span className="cal-value">{ledgerEntry.val !== null ? `${ledgerEntry.val} ⛩️` : '???'}</span>
              </div>
            </div>

            {/* Gap Selector Tabs */}
            <div className="step-pills-row" style={{ marginTop: 14 }}>
              {GAPS.map((g, idx) => (
                <button
                  key={g.id}
                  className={`step-pill ${activeGap === idx ? 'active' : ''} ${verified[idx] ? 'done' : ''}`}
                  onClick={() => { sounds.click(); setActiveGap(idx); setFeedback(null); }}
                >
                  {verified[idx] ? '✅' : g.icon} {g.title.split('—')[0].trim()}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Current Gap Restoration */}
        <div className="station-col-right">
          <div className="station-panel-box">
            <h4 className="panel-subhead">{gap.icon} {gap.title}</h4>
            <p className="panel-caption">{gap.context}</p>
            <p className="panel-caption" style={{ color: '#feca57' }}>
              Known: {gap.knownInfo}
            </p>
          </div>

          <div className="station-panel-box">
            <h4 className="panel-subhead">🛠️ Primary Restoration Tool</h4>
            <div className="tool-select-mini-row">
              <button
                className={`btn-tool-mini ${tools[activeGap] === 'term-to-term' ? 'active' : ''}`}
                onClick={() => { sounds.click(); setTools({ ...tools, [activeGap]: 'term-to-term' }); }}
                disabled={verified[activeGap]}
              >
                🖌️ Term-to-Term
              </button>
              <button
                className={`btn-tool-mini ${tools[activeGap] === 'general-term' ? 'active' : ''}`}
                onClick={() => { sounds.click(); setTools({ ...tools, [activeGap]: 'general-term' }); }}
                disabled={verified[activeGap]}
              >
                📜 General Term
              </button>
            </div>
          </div>

          <div className="station-panel-box">
            <h4 className="panel-subhead">✍️ Restored Value</h4>
            <div className="number-input-row">
              <input
                type="number"
                placeholder={`Value at Month ${gap.targetPos}...`}
                value={inputs[activeGap] || ''}
                onChange={(e) => setInputs({ ...inputs, [activeGap]: e.target.value })}
                disabled={verified[activeGap]}
                className="sandstorm-input"
              />
            </div>

            <h4 className="panel-subhead" style={{ marginTop: 10 }}>🔄 Cross-Verify (use other method)</h4>
            <div className="number-input-row">
              <input
                type="number"
                placeholder="Cross-check value..."
                value={crossVerifyInputs[activeGap] || ''}
                onChange={(e) => setCrossVerifyInputs({ ...crossVerifyInputs, [activeGap]: e.target.value })}
                disabled={verified[activeGap]}
                className="sandstorm-input"
              />
              <button
                className="btn-primary"
                onClick={() => handleVerify(activeGap)}
                disabled={verified[activeGap] || !inputs[activeGap]}
              >
                {verified[activeGap] ? 'Certified ✓' : '🛡️ Certify'}
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
