// src/features/simulate/simulations/CoinCounter.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../../../components/Button.jsx';
import { formatMoney } from '../../../core/questions/questionBank.js';

const TARGET_RANGES = [
  { min: 5,   max: 55,   step: 5  },  // Round 0: 5–55¢
  { min: 60,  max: 100,  step: 5  },  // Round 1: 60¢–$1.00
  { min: 105, max: 200,  step: 5  },  // Round 2: $1.05–$2.00
];

const DENOMS = [
  { label: '5¢',   cents: 5,   emoji: '💵' },
  { label: '10¢',  cents: 10,  emoji: '💵' },
  { label: '20¢',  cents: 20,  emoji: '💵' },
  { label: '50¢',  cents: 50,  emoji: '💵' },
  { label: '$1',   cents: 100, emoji: '💵' },
  { label: '$2',   cents: 200, emoji: '💵' },
];

export default function CoinCounter({ onComplete }) {
  const [round, setRound] = useState(0);
  const [target, setTarget] = useState(0);
  const [selected, setSelected] = useState([]); // array of {cents, label, emoji, id}
  const [runningTotal, setRunningTotal] = useState(0);
  const [phase, setPhase] = useState('selecting'); // 'selecting' | 'confirming'
  const [score, setScore] = useState(0);

  // Generate target for current round
  useEffect(() => {
    const range = TARGET_RANGES[round];
    if (range) {
      const stepsCount = (range.max - range.min) / range.step;
      const randomStep = Math.floor(Math.random() * (stepsCount + 1));
      const targetVal = range.min + randomStep * range.step;
      setTarget(targetVal);
      setSelected([]);
      setRunningTotal(0);
      setPhase('selecting');
    }
  }, [round]);

  const handleAddCoin = (denom) => {
    if (phase !== 'selecting') return;
    const newCoin = {
      ...denom,
      id: Math.random().toString(36).substr(2, 9)
    };
    const nextSelected = [...selected, newCoin];
    setSelected(nextSelected);
    
    const nextTotal = nextSelected.reduce((sum, c) => sum + c.cents, 0);
    setRunningTotal(nextTotal);
  };

  const handleRemoveCoin = (coinId) => {
    if (phase !== 'selecting') return;
    const nextSelected = selected.filter(c => c.id !== coinId);
    setSelected(nextSelected);

    const nextTotal = nextSelected.reduce((sum, c) => sum + c.cents, 0);
    setRunningTotal(nextTotal);
  };

  const handleReset = () => {
    if (phase !== 'selecting') return;
    setSelected([]);
    setRunningTotal(0);
  };

  const handleConfirm = () => {
    if (runningTotal === target) {
      setScore(prev => prev + 1);
    }
    setPhase('confirming');
  };

  const handleNextRound = () => {
    if (round < 2) {
      setRound(prev => prev + 1);
    } else {
      onComplete(score + (runningTotal === target ? 1 : 0));
    }
  };

  // Build equation representation
  const equation = selected.map(c => c.label).join(' + ') + ` = ${formatMoney(runningTotal)}`;

  const isExact = runningTotal === target;
  const isOver = runningTotal > target;

  return (
    <div className="sim-station">
      <h3 className="sim-title">Round {round + 1} of 3</h3>
      <p className="sim-instruction">Tap coins to make the target amount! Tap a purse coin to remove it.</p>

      {/* Target Amount Display */}
      <div className="text-center my-4">
        <span className="text-xs text-white/50 block font-bold tracking-wider uppercase">Target Amount</span>
        <span className="text-4xl font-extrabold text-amber-400 font-display">
          {formatMoney(target)}
        </span>
      </div>

      {/* Running Total & Status */}
      <div className="text-center mb-4">
        <span className="text-xs text-white/50 block font-bold tracking-wider uppercase">Your Total</span>
        <div className={`running-total ${isOver ? 'over' : isExact ? 'exact' : ''}`}>
          {formatMoney(runningTotal)}
        </div>
        <div className="text-sm h-6 font-semibold mt-1">
          {isOver && <span className="text-red-400">Too much! Tap a coin in the purse to remove it.</span>}
          {isExact && <span className="text-green-400">You made it! Click Confirm! ✅</span>}
        </div>
      </div>

      {/* Purse Area */}
      <div className="purse-area min-h-[90px] mb-6">
        <AnimatePresence>
          {selected.length === 0 ? (
            <span className="text-white/20 text-sm font-semibold select-none">Purse is empty</span>
          ) : (
            selected.map((coin) => (
              <motion.button
                key={coin.id}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                onClick={() => handleRemoveCoin(coin.id)}
                className="purse-coin"
                disabled={phase !== 'selecting'}
                title="Tap to remove"
              >
                <span className="purse-coin-emoji">{coin.emoji}</span>
                <span>{coin.label}</span>
                <span className="purse-coin-remove" aria-hidden="true">✕</span>
              </motion.button>
            ))
          )}
        </AnimatePresence>
      </div>

      {phase === 'selecting' ? (
        <>
          {/* Coin Tray / Denominations Grid */}
          <div className="coin-grid mb-6">
            {DENOMS.map((denom) => (
              <button
                key={denom.label}
                onClick={() => handleAddCoin(denom)}
                className="coin-btn"
              >
                <span className="coin-btn-emoji">{denom.emoji}</span>
                <span className="coin-btn-label">{denom.label}</span>
              </button>
            ))}
          </div>

          <div className="flex gap-3 w-full">
            <Button
              variant="outline"
              onClick={handleReset}
              disabled={selected.length === 0}
            >
              🔄 Reset
            </Button>
            <Button
              variant="primary"
              onClick={handleConfirm}
              disabled={runningTotal === 0 || isOver}
              className="flex-1"
            >
              Confirm Selection
            </Button>
          </div>
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center w-full"
        >
          <div className="running-sentence my-4 py-3 bg-white/5 border border-white/10 rounded-xl">
            {isExact ? (
              <span className="text-green-400 font-bold block mb-1">Perfect Match!</span>
            ) : (
              <span className="text-red-400 font-bold block mb-1">Not quite match.</span>
            )}
            <span className="font-mono text-lg">{equation}</span>
          </div>

          <Button
            variant={round === 2 ? 'green' : 'primary'}
            onClick={handleNextRound}
            className="w-full mt-4"
          >
            {round === 2 ? 'Finish Station' : 'Next Round'}
          </Button>
        </motion.div>
      )}

      <div className="sim-round-dots font-bold">
        {[0, 1, 2].map((idx) => (
          <span key={idx} className={idx === round ? 'text-amber-400' : 'text-white/20'}>
            ●{' '}
          </span>
        ))}
      </div>
    </div>
  );
}
