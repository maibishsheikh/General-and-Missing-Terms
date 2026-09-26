// src/utils/moneyMath.js
// Mathematical and formatting utilities for MoneyQuest

export const COINS = [5, 10, 20, 50, 100, 200];
export const NOTES = [100, 200, 500, 1000];

export const DENOMINATIONS = [
  { value: 5,   label: '5¢',   type: 'coin', emoji: '🪙', color: '#c2410c' },
  { value: 10,  label: '10¢',  type: 'coin', emoji: '🪙', color: '#64748b' },
  { value: 20,  label: '20¢',  type: 'coin', emoji: '🪙', color: '#94a3b8' },
  { value: 50,  label: '50¢',  type: 'coin', emoji: '🪙', color: '#cbd5e1' },
  { value: 100, label: '$1',   type: 'coin', emoji: '🪙', color: '#eab308' },
  { value: 200, label: '$2',   type: 'coin', emoji: '🪙', color: '#f59e0b' },
  { value: 500, label: '$5',   type: 'note', emoji: '💵', color: '#10b981' },
  { value: 1000,label: '$10',  type: 'note', emoji: '💵', color: '#0ea5e9' },
];

/**
 * Formats a value in cents into a kid-friendly money string:
 * 5 -> "5¢"
 * 85 -> "85¢"
 * 100 -> "$1.00"
 * 250 -> "$2.50"
 */
export function formatMoney(cents) {
  if (cents === null || cents === undefined || isNaN(cents)) return '$0.00';
  const c = Math.round(cents);
  if (c < 100) return `${c}¢`;
  const dollars = Math.floor(c / 100);
  const remainder = c % 100;
  return `$${dollars}.${String(remainder).padStart(2, '0')}`;
}

/**
 * Formats a value in cents into a compact display without trailing .00 if whole:
 * 100 -> "$1"
 * 150 -> "$1.50"
 * 85 -> "85¢"
 */
export function formatMoneyCompact(cents) {
  if (cents < 100) return `${cents}¢`;
  const dollars = Math.floor(cents / 100);
  const remainder = cents % 100;
  if (remainder === 0) return `$${dollars}`;
  return `$${dollars}.${String(remainder).padStart(2, '0')}`;
}

/**
 * Calculates optimal coin breakdown for a given amount in cents
 */
export function getGreedyCoins(cents) {
  let rem = cents;
  const breakdown = [];
  const sorted = [...DENOMINATIONS].reverse();
  for (const d of sorted) {
    const count = Math.floor(rem / d.value);
    if (count > 0) {
      breakdown.push({ denom: d, count });
      rem %= d.value;
    }
  }
  return breakdown;
}

/**
 * Generates 4 plausible options for a multiple-choice question
 */
export function generateDistractors(correctCents, minCents = 5, maxCents = 1000, step = 5) {
  const opts = new Set([correctCents]);
  const offsets = [step, -step, step * 2, -step * 2, step * 3, -step * 3, 100, -100, 50, -50];
  
  // Shuffle offsets
  for (let i = offsets.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [offsets[i], offsets[j]] = [offsets[j], offsets[i]];
  }

  for (const off of offsets) {
    if (opts.size >= 4) break;
    const candidate = correctCents + off;
    if (candidate >= minCents && candidate <= maxCents && candidate !== correctCents) {
      opts.add(candidate);
    }
  }

  let attempts = 0;
  while (opts.size < 4 && attempts < 30) {
    attempts++;
    const fallback = Math.round((Math.floor(Math.random() * ((maxCents - minCents) / step + 1)) * step) + minCents);
    if (!opts.has(fallback)) opts.add(fallback);
  }

  const result = [...opts];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
