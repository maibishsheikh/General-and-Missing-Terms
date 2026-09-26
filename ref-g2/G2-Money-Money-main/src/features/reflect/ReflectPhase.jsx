// src/features/reflect/ReflectPhase.jsx
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProgressRing from '../../components/ProgressRing.jsx';
import Button from '../../components/Button.jsx';
import { getReflectQuestions } from '../../core/questions/questionFactory.js';

const TAKEAWAYS = [
  { icon: '🪙', text: 'Coins come in 5¢, 10¢, 20¢, 50¢, and $1. Notes come in $1, $2, $5, and $10.' },
  { icon: '💱', text: '100 cents = $1. Always! You can count in cents or in dollars and cents.' },
  { icon: '🔄', text: 'Change = Amount You Paid − Price of the Item.' },
  { icon: '📋', text: 'When adding money, keep cents with cents and dollars with dollars.' },
];

const CONFIDENCE_OPTIONS = [
  { emoji: '🌟', text: "I'm great with money now!" },
  { emoji: '👍', text: 'I can count money most of the time!' },
  { emoji: '📚', text: "I'm still learning — I'll practise more!" },
];

function StarRating({ stars }) {
  return (
    <div className="star-rating" style={{ fontSize: '1.4rem', margin: '6px 0' }}>
      {[0, 1, 2].map(i => <span key={i} className={i < stars ? 'star-filled' : 'star-empty'}>⭐</span>)}
    </div>
  );
}

function ReflectQuestion({ question, onAnswer, answered }) {
  const [sel, setSel] = useState(null);
  
  const pick = opt => {
    if (answered) return;
    setSel(opt);
    setTimeout(() => onAnswer(opt === question.correctAnswer), 350);
  };

  return (
    <div>
      <p className="question-text text-white/95" style={{ fontSize: '1.05rem', marginBottom: 14 }}>
        {question.questionText}
      </p>
      <div className="options-grid">
        {question.options.map(opt => {
          let cls = 'option-btn';
          if (answered || sel) {
            if (opt === question.correctAnswer) cls += ' correct';
            else if (opt === sel) cls += ' wrong';
            else cls += ' disabled';
          } else if (sel === opt) cls += ' selected';
          return <button key={opt} className={cls} onClick={() => pick(opt)} style={{ textAlign: 'center' }}>{opt}</button>;
        })}
      </div>
    </div>
  );
}

export default function ReflectPhase({ onHome, onRestart }) {
  const [screen, setScreen] = useState('quiz'); // 'quiz' | 'confidence' | 'results'
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [confidence, setConfidence] = useState(null);
  const questions = useMemo(() => getReflectQuestions(5), []);
  const total = questions.length;

  const handleAnswer = ok => {
    const updated = [...answers, ok];
    setAnswers(updated);
    if (qIndex + 1 >= total) { 
      setTimeout(() => setScreen('confidence'), 350); 
      return; 
    }
    setTimeout(() => setQIndex(i => i + 1), 550);
  };

  const handleConfidence = (i) => {
    setConfidence(i);
    setTimeout(() => setScreen('results'), 500);
  };

  const correctCount = answers.filter(Boolean).length;
  const pct = total > 0 ? Math.round((correctCount / total) * 100) : 0;
  const stars = pct >= 90 ? 3 : pct >= 70 ? 2 : pct >= 50 ? 1 : 0;

  if (screen === 'quiz') {
    const q = questions[qIndex];
    if (!q) return null;
    return (
      <div className="reflect-screen" style={{ justifyContent: 'center' }}>
        <div style={{ width: '100%', maxWidth: 560 }}>
          <div style={{ display: 'flex', alignItems: 'center', justify_content: 'space-between', justifyContent: 'space-between', marginBottom: 8 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem' }}>📓 Reflect Quiz</h2>
            <span style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.85rem' }}>{qIndex + 1}/{total}</span>
          </div>
          <div className="progress-bar-track" style={{ marginBottom: 14 }}>
            <div className="progress-bar-fill" style={{ width: `${(qIndex / total) * 100}%` }} />
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={qIndex} className="reflect-card glass-card"
              initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.22 }}>
              <ReflectQuestion question={q} onAnswer={handleAnswer} answered={answers.length > qIndex} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    );
  }

  if (screen === 'confidence') {
    return (
      <div className="reflect-screen" style={{ justifyContent: 'center' }}>
        <div className="reflect-card glass-card" style={{ width: '100%', maxWidth: 520, textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', marginBottom: 10 }}>💭 How do you feel?</h2>
          <p style={{ fontWeight: 700, marginBottom: 16 }}>How confident do you feel about counting money and calculating change?</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {CONFIDENCE_OPTIONS.map((opt, i) => (
              <button key={i} className={`option-btn${confidence === i ? ' selected' : ''}`}
                onClick={() => handleConfidence(i)}
                style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'flex-start', textAlign: 'left' }}>
                <span style={{ fontSize: '1.5rem' }}>{opt.emoji}</span>
                <span>{opt.text}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="reflect-screen">
      <div style={{ width: '100%', maxWidth: 560, display: 'flex', flexDirection: 'column', gap: 14, paddingBottom: 16 }}>
        {/* Score */}
        <div className="reflect-card glass-card" style={{ textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', marginBottom: 12 }}>🏁 Quiz Complete!</h2>
          <ProgressRing value={pct} displayValue={`${correctCount}/${total}`} label="Score" size={130} />
          <StarRating stars={stars} />
          <p style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.9rem', marginTop: 6 }}>
            {pct >= 80 ? "Outstanding! You're a Money Master! 🏆" : pct >= 60 ? "Well done! Keep practising! 💪" : "Review the key facts below 📚"}
          </p>
        </div>

        {/* Key takeaways */}
        <div className="reflect-card glass-card">
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', marginBottom: 12 }}>📌 Key Takeaways</h3>
          <ul className="takeaways-list">
            {TAKEAWAYS.map((t, i) => (
              <motion.li key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}>
                <span className="takeaway-icon">{t.icon}</span><span>{t.text}</span>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Fact box */}
        <div className="conversion-fact-box">
          <span className="mass-value">Change = Amount Paid − Price</span>
          <div style={{ fontSize: '0.85rem', marginTop: 4, color: 'rgba(255,255,255,0.65)' }}>
            $1.00 − 35¢ = 65¢
          </div>
        </div>

        {/* Badge */}
        <div className="reflect-badge glass-card">
          <span className="reflect-badge-icon">🏆</span>
          <div>
            <div className="reflect-badge-title">What I Learned Today</div>
            <div className="reflect-badge-sub">Money: Coins, Notes &amp; Change</div>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <Button variant="outline" size="sm" onClick={onRestart}>🔄 Try Again</Button>
          <Button variant="primary" size="sm" onClick={onHome}>🏠 Home</Button>
        </div>
      </div>
    </div>
  );
}
