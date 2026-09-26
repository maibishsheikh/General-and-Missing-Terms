// src/components/simulations/ChangeMakerStation.jsx
import React, { useState } from 'react';
import './Stations.css';
import { formatMoney } from '../../utils/moneyMath.js';
import { useAudio } from '../../hooks/useAudio.js';

const SCENARIOS = [
  {
    item: 'Berry Muffin 🧁',
    price: 85,
    paid: 100,
    paidLabel: '$1.00 coin',
    correctChange: 15,
    steps: '85¢ + 10¢ = 95¢, + 5¢ = $1.00 ➔ Change: 15¢ (10¢ + 5¢)',
  },
  {
    item: 'Orange Juice 🧃',
    price: 60,
    paid: 100,
    paidLabel: '$1.00 coin',
    correctChange: 40,
    steps: '60¢ + 20¢ = 80¢, + 20¢ = $1.00 ➔ Change: 40¢ (20¢ + 20¢)',
  },
  {
    item: 'Storybook 📖',
    price: 135,
    paid: 200,
    paidLabel: '$2.00 coin',
    correctChange: 65,
    steps: '$1.35 + 5¢ = $1.40, + 10¢ = $1.50, + 50¢ = $2.00 ➔ Change: 65¢',
  },
  {
    item: 'Toy Car 🚗',
    price: 350,
    paid: 500,
    paidLabel: '$5.00 note',
    correctChange: 150,
    steps: '$3.50 + 50¢ = $4.00, + $1.00 = $5.00 ➔ Change: $1.50 ($1 + 50¢)',
  },
];

const TILL_DENOMS = [
  { label: '$2',  value: 200, icon: '🪙', bg: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)' },
  { label: '$1',  value: 100, icon: '🪙', bg: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)' },
  { label: '50¢', value: 50,  icon: '🪙', bg: 'linear-gradient(135deg, #059669 0%, #047857 100%)' },
  { label: '20¢', value: 20,  icon: '🪙', bg: 'linear-gradient(135deg, #0891b2 0%, #0e7490 100%)' },
  { label: '10¢', value: 10,  icon: '🪙', bg: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)' },
  { label: '5¢',  value: 5,   icon: '🪙', bg: 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)' },
];

export default function ChangeMakerStation({ onComplete, audioEnabled }) {
  const { narrate, stopAll, sounds } = useAudio(audioEnabled);
  const [scenIdx, setScenIdx] = useState(0);
  const [dispensedCoins, setDispensedCoins] = useState([]); // array of { id, value, label, icon }
  const [success, setSuccess] = useState(false);
  const [shake, setShake] = useState(false);

  const scenario = SCENARIOS[scenIdx] || SCENARIOS[0];
  const dispensedTotal = dispensedCoins.reduce((sum, c) => sum + c.value, 0);

  const isExact = dispensedTotal === scenario.correctChange;
  const isOver = dispensedTotal > scenario.correctChange;

  function addChangeCoin(coin) {
    if (success) return;
    sounds.click();
    const newCoin = {
      ...coin,
      id: Math.random().toString(36).substring(2, 9),
    };
    setDispensedCoins(prev => [...prev, newCoin]);
  }

  function removeChangeCoin(id) {
    if (success) return;
    sounds.click();
    setDispensedCoins(prev => prev.filter(c => c.id !== id));
  }

  function handleReset() {
    sounds.click();
    setDispensedCoins([]);
    setSuccess(false);
  }

  function newScenario() {
    stopAll();
    setScenIdx(idx => (idx + 1) % SCENARIOS.length);
    setDispensedCoins([]);
    setSuccess(false);
  }

  function handleDispense() {
    if (isExact) {
      setSuccess(true);
      sounds.correct();
      narrate([{ text: `Spot on! Exact change of ${formatMoney(scenario.correctChange)} given to customer!`, style: 'celebration' }]);
    } else {
      setShake(true);
      sounds.wrong();
      narrate([{ text: isOver ? "Too much change dispensed! Remove some coins from the hand." : "Not enough change yet! Dispense more coins from the drawer.", style: 'encouragement' }]);
      setTimeout(() => setShake(false), 600);
    }
  }

  return (
    <div className="station-wrap">
      {/* Header */}
      <div className="station-header">
        <h3 className="station-title">🔄 Station C: The Cashier Change Maker</h3>
        <div className={`station-target-box ${shake ? 'anim-shake' : ''}`}>
          <span className="station-target-label">Target Change:</span>
          <span className="station-target-num">{formatMoney(scenario.correctChange)}</span>
        </div>
      </div>

      <div className="station-grid-2col">
        {/* Left Column: Cashier Drawer Till & Actions */}
        <div className="station-col-left">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <p className="station-guide-text" style={{ textAlign: 'left', fontWeight: 700 }}>
              Customer bought <strong>{scenario.item}</strong> ({formatMoney(scenario.price)}) &amp; paid <strong>{scenario.paidLabel}</strong> ({formatMoney(scenario.paid)}):
            </p>

            <div className="till-drawer-grid">
              {TILL_DENOMS.map(c => (
                <button
                  key={c.label}
                  className="till-coin-btn"
                  style={{ background: c.bg, border: '1.5px solid rgba(255,255,255,0.35)', color: '#ffffff', textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}
                  onClick={() => addChangeCoin(c)}
                  disabled={success}
                  aria-label={`Dispense ${c.label} coin`}
                >
                  <span style={{ fontSize: '1.3rem' }}>{c.icon}</span>
                  <span style={{ fontWeight: 900 }}>{c.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="station-actions">
            <button className="btn-outline" onClick={handleReset} disabled={dispensedCoins.length === 0}>
              Clear Till
            </button>
            <button className="btn-primary" onClick={handleDispense} disabled={success || dispensedCoins.length === 0}>
              Give Change
            </button>
            <button className="btn-outline" onClick={newScenario}>
              New Customer
            </button>
          </div>
        </div>

        {/* Right Column: Count-Up Formula, Customer Hand & Success Panel */}
        <div className="station-col-right">
          <div className="change-ladder-box">
            <div className="change-ladder-step">
              <span>🏷️ Price: <strong>{formatMoney(scenario.price)}</strong></span>
              <span>💵 Paid: <strong>{formatMoney(scenario.paid)}</strong></span>
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--gold)', fontSize: '0.92rem', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: '4px' }}>
              Formula: {formatMoney(scenario.paid)} − {formatMoney(scenario.price)} = {formatMoney(scenario.correctChange)} Change
            </div>
          </div>

          {/* Customer's Hand / Dispensed Tray */}
          <div className="money-tray-display">
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: isOver ? '#f87171' : isExact ? '#4ade80' : 'var(--gold)', fontSize: '1rem', marginBottom: '4px' }}>
              Customer Hand: {formatMoney(dispensedTotal)}
            </span>
            {dispensedCoins.length === 0 ? (
              <span style={{ color: 'rgba(255, 255, 255, 0.4)', fontSize: '0.92rem', fontFamily: 'var(--font-display)' }}>
                🤲 Customer hand is empty — tap coins to dispense!
              </span>
            ) : (
              <div className="tray-coins-row">
                {dispensedCoins.map(c => (
                  <div
                    key={c.id}
                    className="tray-coin-chip"
                    onClick={() => removeChangeCoin(c.id)}
                    style={{ cursor: 'pointer', border: '1.5px solid rgba(255, 255, 255, 0.3)' }}
                    title="Click to take back coin"
                  >
                    <span>{c.icon}</span>
                    <span>{c.label}</span>
                    <span style={{ fontSize: '0.7rem', color: '#fca5a5', marginLeft: '2px' }}>✕</span>
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
                  Correct change! <strong>{formatMoney(scenario.paid)} − {formatMoney(scenario.price)} = {formatMoney(scenario.correctChange)}</strong>
                </p>
              </div>
              <div style={{ background: 'rgba(34, 197, 94, 0.18)', border: '1.5px solid rgba(34, 197, 94, 0.4)', borderRadius: '12px', padding: '6px 12px', width: '100%' }}>
                <span style={{ color: '#86efac', fontWeight: 800, fontSize: '0.88rem' }}>
                  {scenario.steps}
                </span>
              </div>
              <div className="station-success-actions">
                <button className="btn-primary" onClick={newScenario}>
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
                Tap coins from the drawer to hand exact change of <strong>{formatMoney(scenario.correctChange)}</strong> to the customer!
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
