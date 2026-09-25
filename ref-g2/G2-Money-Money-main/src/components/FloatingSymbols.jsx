// src/components/FloatingSymbols.jsx
import React, { useMemo } from 'react';

const MONEY_SYMBOLS = ['🪙', '💰', '💵', '🏦', '💳', '🐷', '🏷️', '✨', '💲', '🛒'];

export default function FloatingSymbols({ count = 16 }) {
  const items = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const symbol = MONEY_SYMBOLS[i % MONEY_SYMBOLS.length];
        return {
          symbol,
          left: Math.random() * 100,
          delay: Math.random() * 20,
          duration: 16 + Math.random() * 10,
        };
      }),
    [count]
  );

  return (
    <div className="floating-numbers" aria-hidden="true">
      {items.map((item, idx) => (
        <span
          key={idx}
          className="floating-number"
          style={{
            left: `${item.left}%`,
            animationDelay: `${item.delay}s`,
            animationDuration: `${item.duration}s`,
          }}
        >
          {item.symbol}
        </span>
      ))}
    </div>
  );
}
