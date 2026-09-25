// src/features/simulate/simulations/PriceMatcher.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Button from '../../../components/Button.jsx';
import { formatMoney } from '../../../core/questions/questionBank.js';

const ROUNDS_DATA = [
  // Round 1
  [
    { id: '1a', name: 'Pencil', emoji: '✏️', cents: 20 },
    { id: '1b', name: 'Eraser', emoji: '📝', cents: 15 },
    { id: '1c', name: 'Ruler', emoji: '📏', cents: 35 },
    { id: '1d', name: 'Sticker', emoji: '⭐', cents: 10 },
  ],
  // Round 2
  [
    { id: '2a', name: 'Muffin', emoji: '🧁', cents: 85 },
    { id: '2b', name: 'Juice', emoji: '🧃', cents: 50 },
    { id: '2c', name: 'Biscuit', emoji: '🍪', cents: 40 },
    { id: '2d', name: 'Bookmark', emoji: '📚', cents: 30 },
  ],
  // Round 3
  [
    { id: '3a', name: 'Toy car', emoji: '🚗', cents: 150 },
    { id: '3b', name: 'Story book', emoji: '📖', cents: 200 },
    { id: '3c', name: 'Colour pencils', emoji: '🖍️', cents: 120 },
    { id: '3d', name: 'Badge', emoji: '🏅', cents: 75 },
  ],
];

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function PriceMatcher({ onComplete }) {
  const [round, setRound] = useState(0);
  const [items, setItems] = useState([]);
  const [prices, setPrices] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null); // item object
  const [selectedPrice, setSelectedPrice] = useState(null); // price number (cents)
  const [matched, setMatched] = useState({}); // { itemId: cents }
  const [wrong, setWrong] = useState(null); // { itemId, cents }
  const [score, setScore] = useState(0);
  const [roundComplete, setRoundComplete] = useState(false);
  const [hintsLeft, setHintsLeft] = useState(2);
  const [hintPair, setHintPair] = useState(null); // { itemId, cents }

  // Initialize round
  useEffect(() => {
    const data = ROUNDS_DATA[round];
    if (data) {
      setItems(shuffleArray(data));
      setPrices(shuffleArray(data.map(i => i.cents)));
      setSelectedItem(null);
      setSelectedPrice(null);
      setMatched({});
      setWrong(null);
      setRoundComplete(false);
      setHintsLeft(2);
      setHintPair(null);
    }
  }, [round]);

  // Evaluate matching selection
  useEffect(() => {
    if (selectedItem && selectedPrice !== null) {
      if (selectedItem.cents === selectedPrice) {
        // Correct match
        const nextMatched = { ...matched, [selectedItem.id]: selectedPrice };
        setMatched(nextMatched);
        setSelectedItem(null);
        setSelectedPrice(null);
        setHintPair((prev) => (prev?.itemId === selectedItem.id ? null : prev));

        // Check if all items matched
        if (Object.keys(nextMatched).length === items.length) {
          setScore(prev => prev + 1);
          setRoundComplete(true);
        }
      } else {
        // Incorrect match
        setWrong({ itemId: selectedItem.id, cents: selectedPrice });
        const timer = setTimeout(() => {
          setWrong(null);
          setSelectedItem(null);
          setSelectedPrice(null);
        }, 800);
        return () => clearTimeout(timer);
      }
    }
  }, [selectedItem, selectedPrice, matched, items]);

  const handleItemSelect = (item) => {
    if (wrong || matched[item.id] !== undefined) return;
    setSelectedItem(item);
  };

  const handlePriceSelect = (cents) => {
    if (wrong || Object.values(matched).includes(cents)) return;
    setSelectedPrice(cents);
  };

  const handleHint = () => {
    if (hintsLeft <= 0 || wrong || roundComplete) return;
    const unmatchedItem = items.find((item) => matched[item.id] === undefined);
    if (!unmatchedItem) return;
    setHintPair({ itemId: unmatchedItem.id, cents: unmatchedItem.cents });
    setHintsLeft((prev) => prev - 1);
  };

  // Auto-clear the hint highlight after a few seconds
  useEffect(() => {
    if (!hintPair) return;
    const timer = setTimeout(() => setHintPair(null), 2500);
    return () => clearTimeout(timer);
  }, [hintPair]);

  const handleNextRound = () => {
    if (round < 2) {
      setRound(prev => prev + 1);
    } else {
      onComplete(score);
    }
  };

  return (
    <div className="sim-station">
      <h3 className="sim-title">Round {round + 1} of 3</h3>
      <p className="sim-instruction">Tap an item, then tap its correct price!</p>

      <div className="flex items-center justify-center gap-2 -mt-1 mb-1">
        <Button
          variant="outline"
          size="sm"
          onClick={handleHint}
          disabled={hintsLeft <= 0 || !!wrong || roundComplete}
        >
          💡 Hint{hintsLeft > 0 ? ` (${hintsLeft} left)` : ''}
        </Button>
      </div>

      {hintPair && (
        <p className="text-center text-xs font-semibold text-purple-300 -mt-1 mb-1">
          💡 Glowing item and price tag are a match!
        </p>
      )}

      <div className="price-matcher-grid my-6">
        {/* Left Column: Items */}
        <div className="flex flex-col gap-3">
          <span className="text-[10px] text-white/40 font-bold uppercase tracking-wider text-center">Items</span>
          {items.map((item) => {
            const isMatched = matched[item.id] !== undefined;
            const isSelected = selectedItem?.id === item.id;
            const isWrong = wrong?.itemId === item.id;
            const isHint = hintPair?.itemId === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleItemSelect(item)}
                className={`price-item-card ${isMatched ? 'matched' : ''} ${isSelected ? 'selected' : ''} ${isWrong ? 'wrong' : ''} ${isHint ? 'hint' : ''}`}
                disabled={isMatched || wrong}
              >
                <span className="price-item-emoji">{item.emoji}</span>
                <span className="price-item-name">{item.name}</span>
                {isMatched && <span className="text-[10px] text-green-400 font-bold">✓ Matched</span>}
              </button>
            );
          })}
        </div>

        {/* Right Column: Scrambled Price Tags */}
        <div className="flex flex-col gap-3">
          <span className="text-[10px] text-white/40 font-bold uppercase tracking-wider text-center">Price Tags</span>
          {prices.map((cents) => {
            const isMatched = Object.values(matched).includes(cents);
            const isSelected = selectedPrice === cents;
            const isWrong = wrong?.cents === cents;
            const isHint = hintPair?.cents === cents;

            return (
              <button
                key={cents}
                onClick={() => handlePriceSelect(cents)}
                className={`price-tag-card ${isMatched ? 'matched' : ''} ${isSelected ? 'selected' : ''} ${isWrong ? 'wrong' : ''} ${isHint ? 'hint' : ''}`}
                disabled={isMatched || wrong}
              >
                <span className="price-tag-value font-display font-extrabold">{formatMoney(cents)}</span>
                {isMatched && <span className="text-[10px] text-green-400 font-bold">✓ Claimed</span>}
              </button>
            );
          })}
        </div>
      </div>

      {roundComplete && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center w-full"
        >
          <div className="bg-green-500/10 border border-green-500/30 text-green-400 py-3 px-4 rounded-xl font-bold mb-4">
            Excellent! All matched correctly! 🎉
          </div>
          <Button
            variant={round === 2 ? 'green' : 'primary'}
            onClick={handleNextRound}
            className="w-full"
          >
            {round === 2 ? 'Finish Station' : 'Next Round'}
          </Button>
        </motion.div>
      )}

      <div className="sim-round-dots font-bold mt-4">
        {[0, 1, 2].map((idx) => (
          <span key={idx} className={idx === round ? 'text-amber-400' : 'text-white/20'}>
            ●{' '}
          </span>
        ))}
      </div>
    </div>
  );
}
