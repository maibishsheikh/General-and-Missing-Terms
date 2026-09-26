// src/components/shared/MoneyVisual.jsx
import React from 'react';
import { formatMoney } from '../../utils/moneyMath.js';

export default function MoneyVisual({ type, data, compact = false }) {
  if (!data) return null;

  if (type === 'coins') {
    return (
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', padding: '6px 12px', background: 'rgba(255,255,255,0.06)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.12)' }}>
        {data.fifties > 0 && <span style={{ background: 'rgba(255,193,7,0.2)', border: '1.5px solid #ffb300', padding: '4px 10px', borderRadius: '16px', fontWeight: 800, fontSize: '0.95rem' }}>🪙 {data.fifties} × 50¢</span>}
        {data.twenties > 0 && <span style={{ background: 'rgba(255,255,255,0.12)', border: '1.5px solid rgba(255,255,255,0.3)', padding: '4px 10px', borderRadius: '16px', fontWeight: 800, fontSize: '0.95rem' }}>🪙 {data.twenties} × 20¢</span>}
        {data.tens > 0 && <span style={{ background: 'rgba(255,255,255,0.12)', border: '1.5px solid rgba(255,255,255,0.3)', padding: '4px 10px', borderRadius: '16px', fontWeight: 800, fontSize: '0.95rem' }}>🪙 {data.tens} × 10¢</span>}
        {data.fives > 0 && <span style={{ background: 'rgba(251,146,60,0.2)', border: '1.5px solid #fb923c', padding: '4px 10px', borderRadius: '16px', fontWeight: 800, fontSize: '0.95rem' }}>🪙 {data.fives} × 5¢</span>}
        {data.ones > 0 && <span style={{ background: 'rgba(255,215,0,0.25)', border: '1.5px solid #ffd700', padding: '4px 10px', borderRadius: '16px', fontWeight: 800, fontSize: '0.95rem' }}>🪙 {data.ones} × $1</span>}
        {data.twos > 0 && <span style={{ background: 'rgba(255,215,0,0.25)', border: '1.5px solid #ffd700', padding: '4px 10px', borderRadius: '16px', fontWeight: 800, fontSize: '0.95rem' }}>🪙 {data.twos} × $2</span>}
      </div>
    );
  }

  if (type === 'notes') {
    return (
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', padding: '6px 12px', background: 'rgba(255,255,255,0.06)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.12)' }}>
        {data.tensNotes > 0 && <span style={{ background: 'rgba(56,189,248,0.2)', border: '1.5px solid #38bdf8', padding: '4px 10px', borderRadius: '12px', fontWeight: 800, fontSize: '0.95rem' }}>💵 {data.tensNotes} × $10</span>}
        {data.fiveNotes > 0 && <span style={{ background: 'rgba(74,222,128,0.2)', border: '1.5px solid #4ade80', padding: '4px 10px', borderRadius: '12px', fontWeight: 800, fontSize: '0.95rem' }}>💵 {data.fiveNotes} × $5</span>}
        {data.twos > 0 && <span style={{ background: 'rgba(244,114,182,0.2)', border: '1.5px solid #f472b6', padding: '4px 10px', borderRadius: '12px', fontWeight: 800, fontSize: '0.95rem' }}>💵 {data.twos} × $2</span>}
      </div>
    );
  }

  if (type === 'receipt') {
    return (
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'center', padding: '6px 14px', background: 'rgba(255,255,255,0.08)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.18)' }}>
        <span style={{ fontSize: '1.2rem' }}>🧾</span>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--gold)' }}>
          {data.itemA}: {formatMoney(data.priceA)} {data.itemB ? `+ ${data.itemB}: ${formatMoney(data.priceB)}` : ''}
        </span>
      </div>
    );
  }

  if (type === 'change') {
    return (
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', alignItems: 'center', padding: '6px 14px', background: 'rgba(255,255,255,0.08)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.18)' }}>
        <span style={{ fontSize: '1.2rem' }}>🏷️ Price: <strong>{formatMoney(data.price)}</strong></span>
        <span style={{ color: 'var(--gold)', fontWeight: 900 }}>|</span>
        <span style={{ fontSize: '1.2rem' }}>💵 Paid: <strong>{formatMoney(data.paid)}</strong></span>
      </div>
    );
  }

  return null;
}
