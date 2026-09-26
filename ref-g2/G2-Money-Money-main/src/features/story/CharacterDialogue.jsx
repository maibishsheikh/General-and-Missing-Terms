// src/features/story/CharacterDialogue.jsx
import React from 'react';

const CHAR_DIALOGUE = [
  '"I have two dollars and seventy cents — that\'s enough to buy something nice at the school market!" — Oliver 👦',
  '"Always check the price tag first, then count your coins to see if you have enough!" — Emma 👧',
  '"Change is the money you get back when you pay MORE than the price. Change = Amount Paid − Price!" — Penny 🐷',
  '"Now I know how to count coins, read price tags, and make change — I\'m ready for any market!" — Oliver 👦',
];

export default function CharacterDialogue({ slideIdx }) {
  const text = CHAR_DIALOGUE[slideIdx] || '';
  if (!text) return null;

  // Split character name & dialogue
  const parts = text.split(' — ');
  const quote = parts[0];
  const char = parts[1] || '';

  // Set colors based on character name
  let colorClass = 'text-orange-400';
  if (char.includes('Emma')) colorClass = 'text-pink-400';
  if (char.includes('Penny')) colorClass = 'text-amber-400';

  return (
    <div className="mt-4 p-3 bg-white/5 rounded-xl border border-white/10 italic text-sm text-center">
      <span className="text-white/90">{quote}</span>
      <span className={`block mt-1 font-bold not-italic ${colorClass}`}>— {char}</span>
    </div>
  );
}
