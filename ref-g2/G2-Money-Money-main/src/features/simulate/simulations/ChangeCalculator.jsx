// src/features/simulate/simulations/ChangeCalculator.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Button from '../../../components/Button.jsx';
import { formatMoney, generateDistractors } from '../../../core/questions/questionBank.js';

const SCENARIOS = [
  { item: 'Pencil', emoji: '✏️', price: 20, paid: 50, payLabel: '50¢ coin' },
  { item: 'Eraser', emoji: '📝', price: 35, paid: 50, payLabel: '50¢ coin' },
  { item: 'Sticker', emoji: '⭐', price: 10, paid: 20, payLabel: '20¢ coin' },
  { item: 'Muffin', emoji: '🧁', price: 85, paid: 100, payLabel: '$1 coin' },
  { item: 'Ruler', emoji: '📏', price: 65, paid: 100, payLabel: '$1 coin' },
  { item: 'Juice box', emoji: '🧃', price: 50, paid: 100, payLabel: '$1 coin' },
  { item: 'Story book', emoji: '📖', price: 150, paid: 200, payLabel: '$2 note' },
  { item: 'Badge', emoji: '🏅', price: 75, paid: 100, payLabel: '$1 coin' },
  { item: 'Toy car', emoji: '🚗', price: 120, paid: 200, payLabel: '$2 note' },
];

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function ChangeCalculator({ onComplete }) {
  const [round, setRound] = useState(0);
  const [sessionScenarios, setSessionScenarios] = useState([]);
  const [currentScenario, setCurrentScenario] = useState(null);
  const [options, setOptions] = useState([]);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [status, setStatus] = useState('idle'); // 'idle' | 'correct' | 'wrong'
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);

  // Initialize pool of 3 random scenarios once per mount
  useEffect(() => {
    const shuffled = shuffleArray(SCENARIOS).slice(0, 3);
    setSessionScenarios(shuffled);
    setRound(0);
    setScore(0);
  }, []);

  // Set up current scenario when round or session list updates
  useEffect(() => {
    if (sessionScenarios.length > 0) {
      const scen = sessionScenarios[round];
      setCurrentScenario(scen);
      
      const change = scen.paid - scen.price;
      const distractors = generateDistractors(change, 5, scen.paid - 5, 5);
      setOptions(distractors);
      
      setSelectedOpt(null);
      setStatus('idle');
      setAttempts(0);
    }
  }, [round, sessionScenarios]);

  const handleOptionClick = (cents) => {
    if (status === 'correct') return;
    
    setSelectedOpt(cents);
    const correctChange = currentScenario.paid - currentScenario.price;
    
    if (cents === correctChange) {
      setStatus('correct');
      if (attempts === 0) {
        setScore(prev => prev + 1);
      }
    } else {
      setStatus('wrong');
      setAttempts(prev => prev + 1);
    }
  };

  const handleReset = () => {
    if (status === 'correct') return;
    setSelectedOpt(null);
    setStatus('idle');
  };

  const handleNext = () => {
    if (round < 2) {
      setRound(prev => prev + 1);
    } else {
      onComplete(score);
    }
  };

  if (!currentScenario) return null;

  const correctChange = currentScenario.paid - currentScenario.price;

  return (
    <div className="sim-station">
      <h3 className="sim-title">Round {round + 1} of 3</h3>
      <p className="sim-instruction">How much change does Oliver get?</p>

      {/* Shopping Scenario Card */}
      <div className="change-scenario my-4">
        <div className="change-item-display">{currentScenario.emoji}</div>
        <div className="text-lg font-bold text-white/95">{currentScenario.item}</div>
        <div className="change-price my-1">{formatMoney(currentScenario.price)}</div>
        <div className="change-payment">
          He pays with a <strong>{currentScenario.payLabel}</strong>
        </div>
      </div>

      {/* Formula helper display */}
      <div className="text-center font-semibold text-xs tracking-wider text-white/40 uppercase mb-4">
        Change = Amount Paid − Price
      </div>

      {/* Options Grid */}
      <div className="options-grid mb-6">
        {options.map((opt) => {
          const isSelected = selectedOpt === opt;
          const isCorrect = opt === correctChange && status === 'correct';
          const isWrong = isSelected && status === 'wrong';

          return (
            <button
              key={opt}
              onClick={() => handleOptionClick(opt)}
              className={`option-btn ${isSelected ? 'selected' : ''} ${isCorrect ? 'correct' : ''} ${isWrong ? 'wrong' : ''}`}
              disabled={status === 'correct' || status === 'wrong'}
            >
              {formatMoney(opt)}
            </button>
          );
        })}
      </div>

      {status === 'correct' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center w-full"
        >
          <div className="conversion-fact-box mb-4 py-3 text-green-400 border-green-500/30">
            That's right! {formatMoney(currentScenario.paid)} − {formatMoney(currentScenario.price)} = {formatMoney(correctChange)}
          </div>
          <Button
            variant={round === 2 ? 'green' : 'primary'}
            onClick={handleNext}
            className="w-full"
          >
            {round === 2 ? 'Finish Station' : 'Next Round'}
          </Button>
        </motion.div>
      )}

      {status === 'wrong' && (
        <div className="text-center w-full">
          <div className="text-sm font-semibold text-red-400 mb-3">
            Not quite! Remember: Change = Amount Paid − Price. Try again!
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
          >
            🔄 Reset & Try Again
          </Button>
        </div>
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
