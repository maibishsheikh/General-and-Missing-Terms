// src/components/simulations/CoinRegisterStation.jsx
import React, { useState } from 'react';
import './Stations.css';
import { formatMoney } from '../../utils/moneyMath.js';
import { useAudio } from '../../hooks/useAudio.js';

const CHALLENGES = [
  { target: 45,  label: '45¢',   description: 'Build 45 cents using 20¢, 10¢, and 5¢ coins!' },
  { target: 90,  label: '90¢',   description: 'Build 90 cents using 50¢ and 20¢ coins!' },
  { target: 175, label: '$1.75', description: 'Build $1.75 using $1, 50¢, 20¢, and 5¢ coins!' },
  { target: 240, label: '$2.40', description: 'Build $2.40 using $2, 20¢ coins!' },
];

const COIN_TYPES = [
  { key: 'twoDollar', label: '$2 Coin',  value: 200, icon: '🪙', bg: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)' },
  { key: 'oneDollar', label: '$1 Coin',  value: 100, icon: '🪙', bg: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)' },
  { key: 'fiftyCent', label: '50¢ Coin', value: 50,  icon: '🪙', bg: 'linear-gradient(135deg, #059669 0%, #047857 100%)' },
  { key: 'twentyCent',label: '20¢ Coin', value: 20,  icon: '🪙', bg: 'linear-gradient(135deg, #0891b2 0%, #0e7490 100%)' },
  { key: 'tenCent',   label: '10¢ Coin', value: 10,  icon: '🪙', bg: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)' },
  { key: 'fiveCent',  label: '5¢ Coin',  value: 5,   icon: '🪙', bg: 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)' },
];

export default function CoinRegisterStation({ onComplete, audioEnabled }) {
  const { narrate, stopAll, sounds } = useAudio(audioEnabled);
  const [challIdx, setChallIdx] = useState(0);
  const [counts, setCounts] = useState({
    twoDollar: 0,
    oneDollar: 0,
    fiftyCent: 0,
    twentyCent: 0,
    tenCent: 0,
    fiveCent: 0,
  });
  const [success, setSuccess] = useState(false);
  const [shake, setShake] = useState(false);

  const challenge = CHALLENGES[challIdx] || CHALLENGES[0];
  const currentTotal = COIN_TYPES.reduce((sum, c) => sum + (counts[c.key] || 0) * c.value, 0);
  const isExact = currentTotal === challenge.target;
  const isOver = currentTotal > challenge.target;

  function addCoin(key) {
    if (success) return;
    sounds.click();
    setCounts(prev => ({ ...prev, [key]: (prev[key] || 0) + 1 }));
  }

  function removeCoin(key) {
    if (success) return;
    if ((counts[key] || 0) <= 0) return;
    sounds.click();
    setCounts(prev => ({ ...prev, [key]: prev[key] - 1 }));
  }

  function handleReset() {
    sounds.click();
    setCounts({ twoDollar: 0, oneDollar: 0, fiftyCent: 0, twentyCent: 0, tenCent: 0, fiveCent: 0 });
    setSuccess(false);
  }

  function newChallenge() {
    stopAll();
    setChallIdx(idx => (idx + 1) % CHALLENGES.length);
    setCounts({ twoDollar: 0, oneDollar: 0, fiftyCent: 0, twentyCent: 0, tenCent: 0, fiveCent: 0 });
    setSuccess(false);
  }

  function handleCheck() {
    if (isExact) {
      setSuccess(true);
      sounds.correct();
      narrate([{ text: `Spot on! You built exact ${formatMoney(challenge.target)} perfectly!`, style: 'celebration' }]);
    } else {
      setShake(true);
      sounds.wrong();
      narrate([{ text: isOver ? "You went over the target! Remove some coins and try again." : "Not quite enough yet! Add more coins to reach the target.", style: 'encouragement' }]);
      setTimeout(() => setShake(false), 600);
    }
  }

  // Active coin chips in purse
  const activeCoins = [];
  COIN_TYPES.forEach(c => {
    for (let i = 0; i < (counts[c.key] || 0); i++) {
      activeCoins.push({ id: `${c.key}-${i}`, label: c.label.replace(' Coin', ''), icon: c.icon, bg: c.bg });
    }
  });

  return (
    <div className="station-wrap">
      {/* Header with target badge */}
      <div className="station-header">
        <h3 className="station-title">🪙 Station A: Coin Till &amp; Purse Builder</h3>
        <div className={`station-target-box ${shake ? 'anim-shake' : ''}`}>
          <span className="station-target-label">Target Amount:</span>
          <span className="station-target-num">{formatMoney(challenge.target)}</span>
        </div>
      </div>

      <div className="station-grid-2col">
        {/* Left Column: Coin Supply List & Actions */}
        <div className="station-col-left">
          <div className="coin-supply-list">
            {COIN_TYPES.map(c => (
              <div key={c.key} className="coin-supply-item">
                <button
                  className="coin-btn"
                  style={{ background: c.bg }}
                  onClick={() => addCoin(c.key)}
                  disabled={success}
                  aria-label={`Add ${c.label} (${counts[c.key] || 0} in purse)`}
                >
                  <div className="coin-btn-info">
                    <span className="coin-icon">{c.icon}</span>
                    <span className="coin-label">{c.label}</span>
                  </div>
                  <span className="coin-count-pill">{counts[c.key] || 0}</span>
                </button>
                <button
                  className="coin-minus"
                  onClick={() => removeCoin(c.key)}
                  disabled={(counts[c.key] || 0) === 0 || success}
                  aria-label={`Remove ${c.label}`}
                >
                  −
                </button>
              </div>
            ))}
          </div>

          <div className="station-actions">
            <button className="btn-outline" onClick={handleReset} disabled={activeCoins.length === 0}>
              Reset
            </button>
            <button className="btn-primary" onClick={handleCheck} disabled={success || activeCoins.length === 0}>
              Check Total
            </button>
            <button className="btn-outline" onClick={newChallenge}>
              New Target
            </button>
          </div>
        </div>

        {/* Right Column: Live Calculation Bar, Visual Coin Rack & Success Panel */}
        <div className="station-col-right">
          <div className="running-ratio-bar">
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(0.95rem, 1.1vw, 1.1rem)', color: '#fff' }}>
              Purse Total: <strong style={{ color: isOver ? '#f87171' : isExact ? '#4ade80' : 'var(--gold)' }}>{formatMoney(currentTotal)}</strong> &nbsp;|&nbsp; Target: <strong>{formatMoney(challenge.target)}</strong>
            </div>
            <div className={`running-ratio-text ${isOver ? 'over' : isExact ? 'exact' : ''}`}>
              {activeCoins.length === 0
                ? '👛 Tap coin buttons on the left to add money!'
                : activeCoins.map(c => c.label).join(' + ') + ` = ${formatMoney(currentTotal)}`}
            </div>
          </div>

          {/* Visual Purse / Coin Rack */}
          <div className="money-tray-display">
            {activeCoins.length === 0 ? (
              <span style={{ color: 'rgba(255, 255, 255, 0.4)', fontSize: '0.92rem', fontFamily: 'var(--font-display)' }}>
                👛 Purse is currently empty
              </span>
            ) : (
              <div className="tray-coins-row">
                {activeCoins.map(c => (
                  <div key={c.id} className="tray-coin-chip" style={{ border: '1.5px solid rgba(255, 255, 255, 0.3)' }}>
                    <span>{c.icon}</span>
                    <span>{c.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Success Panel Matching Reference Module */}
          {success ? (
            <div className="station-success anim-bounce-in">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="success-icon">🎉</span>
                <p className="station-success-msg">
                  Target reached! You built exactly <strong>{formatMoney(challenge.target)}</strong> using {activeCoins.length} coins!
                </p>
              </div>
              <div className="station-success-actions">
                <button className="btn-primary" onClick={newChallenge}>
                  Try Another
                </button>
                <button className="btn-green" onClick={onComplete}>
                  Complete Station ✓
                </button>
              </div>
            </div>
          ) : (
            <div className="station-guide-card">
              <span className="station-guide-text">
                {challenge.description}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
