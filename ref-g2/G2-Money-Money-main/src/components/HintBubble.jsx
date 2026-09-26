// src/components/HintBubble.jsx
import React from 'react';

export default function HintBubble({ text }) {
  if (!text) return null;
  return (
    <div className="hint-bubble">
      <span>💡</span>
      <span>{text}</span>
    </div>
  );
}
