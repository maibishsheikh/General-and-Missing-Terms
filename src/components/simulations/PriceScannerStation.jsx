// src/components/simulations/PriceScannerStation.jsx
import React, { useState } from 'react';
import './Stations.css';
import { formatMoney } from '../../utils/moneyMath.js';
import { useAudio } from '../../hooks/useAudio.js';

const MARKET_ITEMS = [
  { id: 'apple',   name: 'Crisp Apple',  emoji: '🍎', price: 50 },
  { id: 'milk',    name: 'Fresh Milk',   emoji: '🥛', price: 120 },
  { id: 'muffin',  name: 'Berry Muffin', emoji: '🧁', price: 85 },
  { id: 'juice',   name: 'Orange Juice', emoji: '🧃', price: 60 },
  { id: 'pencil',  name: 'Hb Pencil',    emoji: '✏️', price: 40 },
  { id: 'sticker', name: 'Star Sticker', emoji: '⭐', price: 30 },
  { id: 'book',    name: 'Storybook',    emoji: '📖', price: 210 },
  { id: 'toy',     name: 'Mini Toy Car', emoji: '🚗', price: 150 },
];

const SCAN_MISSIONS = [
  {
    targetTotal: 170,
    requiredItems: ['apple', 'milk'],
    instruction: "Mission 1: Oliver wants an Apple (50¢) and Fresh Milk ($1.20). Scan both to hit $1.70!",
  },
  {
    targetTotal: 175,
    requiredItems: ['muffin', 'juice', 'sticker'],
    instruction: "Mission 2: Emma wants a Muffin (85¢), Juice (60¢), and Sticker (30¢). Target = $1.75!",
  },
  {
    targetTotal: 250,
    requiredItems: ['pencil', 'book'],
    instruction: "Mission 3: Scan an Hb Pencil (40¢) and Storybook ($2.10). Target = $2.50!",
  },
];

export default function PriceScannerStation({ onComplete, audioEnabled }) {
  const { narrate, stopAll, sounds } = useAudio(audioEnabled);
  const [missionIdx, setMissionIdx] = useState(0);
  const [cartItemIds, setCartItemIds] = useState([]);
  const [success, setSuccess] = useState(false);
  const [shake, setShake] = useState(false);

  const mission = SCAN_MISSIONS[missionIdx] || SCAN_MISSIONS[0];
  const cartItems = cartItemIds.map(id => MARKET_ITEMS.find(m => m.id === id)).filter(Boolean);
  const cartTotal = cartItems.reduce((sum, item) => sum + item.price, 0);

  const isExact = cartTotal === mission.targetTotal;
  const isOver = cartTotal > mission.targetTotal;

  function toggleItem(item) {
    if (success) return;
    sounds.click();
    if (cartItemIds.includes(item.id)) {
      setCartItemIds(prev => prev.filter(id => id !== item.id));
    } else {
      setCartItemIds(prev => [...prev, item.id]);
    }
  }

  function handleReset() {
    sounds.click();
    setCartItemIds([]);
    setSuccess(false);
  }

  function newMission() {
    stopAll();
    setMissionIdx(idx => (idx + 1) % SCAN_MISSIONS.length);
    setCartItemIds([]);
    setSuccess(false);
  }

  function handleCheckout() {
    if (isExact) {
      setSuccess(true);
      sounds.correct();
      narrate([{ text: `Fantastic! Your shopping cart totals exactly ${formatMoney(mission.targetTotal)}!`, style: 'celebration' }]);
    } else {
      setShake(true);
      sounds.wrong();
      narrate([{ text: isOver ? "Cart total is over the budget! Remove an item and try again." : "Not quite at the target bill! Scan more items from the shelf.", style: 'encouragement' }]);
      setTimeout(() => setShake(false), 600);
    }
  }

  return (
    <div className="station-wrap">
      {/* Header */}
      <div className="station-header">
        <h3 className="station-title">🛒 Station B: Supermarket Scanner &amp; Cart</h3>
        <div className={`station-target-box ${shake ? 'anim-shake' : ''}`}>
          <span className="station-target-label">Target Bill:</span>
          <span className="station-target-num">{formatMoney(mission.targetTotal)}</span>
        </div>
      </div>

      <div className="station-grid-2col">
        {/* Left Column: Grocery Shelf & Actions */}
        <div className="station-col-left">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <p className="station-guide-text" style={{ textAlign: 'left', fontWeight: 700 }}>
              Tap items on the shelf to scan them into your checkout cart:
            </p>

            <div className="market-chips-pool">
              {MARKET_ITEMS.map(item => {
                const inCart = cartItemIds.includes(item.id);
                return (
                  <button
                    key={item.id}
                    className={`market-item-card ${inCart ? 'in-cart' : ''}`}
                    onClick={() => toggleItem(item)}
                    disabled={success}
                    aria-label={`Scan ${item.name} (${formatMoney(item.price)})`}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '1.3rem' }}>{item.emoji}</span>
                      <span>{item.name}</span>
                    </div>
                    <span style={{ color: inCart ? '#86efac' : 'var(--gold)', fontWeight: 900 }}>
                      {formatMoney(item.price)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="station-actions">
            <button className="btn-outline" onClick={handleReset} disabled={cartItemIds.length === 0}>
              Clear Cart
            </button>
            <button className="btn-primary" onClick={handleCheckout} disabled={success || cartItemIds.length === 0}>
              Scan &amp; Pay
            </button>
            <button className="btn-outline" onClick={newMission}>
              New List
            </button>
          </div>
        </div>

        {/* Right Column: Printed Receipt & Success Panel */}
        <div className="station-col-right">
          <div className="market-receipt-box">
            <div className="market-receipt-header">🛒 SUPERMARKET CHECKOUT RECEIPT</div>
            {cartItems.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#71717a', padding: '16px 0' }}>
                Cart is empty.<br />Tap items on the left to scan!
              </div>
            ) : (
              cartItems.map(item => (
                <div key={item.id} className="market-receipt-row">
                  <span>{item.emoji} {item.name}</span>
                  <strong>{formatMoney(item.price)}</strong>
                </div>
              ))
            )}
            <div className="market-receipt-total">
              <span>TOTAL BILL</span>
              <span style={{ color: isOver ? '#ef4444' : isExact ? '#16a34a' : '#18181b' }}>
                {formatMoney(cartTotal)}
              </span>
            </div>
          </div>

          {/* Success Panel Matching Reference Module */}
          {success ? (
            <div className="station-success anim-bounce-in">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="success-icon">🎉</span>
                <p className="station-success-msg">
                  Bill verified! The scanned items total exactly <strong>{formatMoney(mission.targetTotal)}</strong>!
                </p>
              </div>
              <div className="station-success-actions">
                <button className="btn-primary" onClick={newMission}>
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
                {mission.instruction}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
