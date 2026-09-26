// src/features/wonder/WonderPhase.jsx
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Button from '../../components/Button.jsx';
import { WONDER_QUESTIONS } from './wonder.constants.js';
import { wonderHookNarration } from '../../utils/narration.js';

export default function WonderPhase({ onComplete, playNarration, stop }) {
  const [question, setQuestion] = useState(null);
  const narrationFiredRef = useRef(false);

  useEffect(() => {
    // Randomly pick one wonder question per session
    const picked = WONDER_QUESTIONS[Math.floor(Math.random() * WONDER_QUESTIONS.length)];
    setQuestion(picked);
  }, []);

  useEffect(() => {
    if (question && !narrationFiredRef.current) {
      narrationFiredRef.current = true;
      const script = wonderHookNarration(question);
      playNarration(script);
    }
    return () => stop();
  }, [question, playNarration, stop]);

  if (!question) return null;

  return (
    <div className="wonder-screen">
      <motion.div
        className="wonder-orb"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      >
        ?
      </motion.div>

      <motion.div
        className="mascot-container"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <span className="mascot" role="img" aria-label="Penny the Piggy Bank">🐷</span>
        <div className="speech-bubble">Hmm, I wonder… what do you think? 🤔</div>
      </motion.div>

      <motion.div
        className="wonder-card glass-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <div className="wonder-emoji">{question.emoji}</div>
        <h2 className="wonder-question">{question.question}</h2>
        <p className="wonder-subtext">{question.subtext}</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4 }}
      >
        <Button variant="primary" size="lg" onClick={onComplete}>
          Let's Discover! ✨
        </Button>
      </motion.div>
    </div>
  );
}
