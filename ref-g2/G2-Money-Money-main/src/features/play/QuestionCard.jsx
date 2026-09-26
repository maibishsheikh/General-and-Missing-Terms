// src/features/play/QuestionCard.jsx
import React from 'react';
import HintBubble from '../../components/HintBubble.jsx';
import CoinDisplay from '../../components/CoinDisplay.jsx';

export default function QuestionCard({
  question,
  selected,
  confirmed,
  onSelect,
  showHint,
  worldAccent,
}) {
  const { type, questionText, options, correctAnswer, hint, emoji } = question;

  const topicLabel = type.replace(/_/g, ' ').toLowerCase();

  return (
    <div className="question-card glass-card">
      {/* Topic badge */}
      <div className="topic-badge" style={{ borderColor: `${worldAccent}66`, color: worldAccent }}>
        {topicLabel}
      </div>

      {/* Question text */}
      <p className="question-text text-white/95">{questionText}</p>

      {/* Dynamic Visual Coin Display */}
      <CoinDisplay questionText={questionText} type={type} />

      {/* Hint Bubble */}
      {showHint && !confirmed && hint && (
        <HintBubble text={hint} />
      )}

      {/* Options Grid */}
      <div className="options-grid mt-4">
        {options.map((opt) => {
          let cls = 'option-btn';
          if (confirmed) {
            if (opt === correctAnswer) cls += ' correct';
            else if (opt === selected) cls += ' wrong';
            else cls += ' disabled';
          } else if (selected === opt) {
            cls += ' selected';
          }
          return (
            <button key={opt} className={cls} onClick={() => onSelect(opt)} disabled={confirmed}>
              {opt}
            </button>
          );
        })}
      </div>

      {/* Mascot Bubble */}
      <div className="mascot-container mt-6">
        <span className="mascot" aria-hidden="true">🐷</span>
        <div className="speech-bubble">
          {confirmed
            ? selected === correctAnswer
              ? "Excellent! You got it! 🎉"
              : "Not quite, check the math. Try again! 💪"
            : "Count carefully, Penny believes in you!"}
        </div>
      </div>
    </div>
  );
}
