// src/components/CoinDisplay.jsx
import React from 'react';

/**
 * Parses question text and displays corresponding coin/note emojis dynamically
 * to help Grade 2 students visualize the collections they are counting.
 */
export default function CoinDisplay({ questionText, type }) {
  // Parse coins and notes from text
  const parseTokens = () => {
    const tokens = [];
    
    // Look for patterns like "3 ten-cent coins" or "three ten-cent coins" or "counts 4 $2 notes"
    const numberMap = {
      one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
      '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10
    };

    // Helper to find matches
    const addTokens = (regex, emoji, label) => {
      const match = questionText.match(regex);
      if (match) {
        const countWord = match[1].toLowerCase();
        const count = numberMap[countWord] || parseInt(countWord, 10) || 1;
        for (let i = 0; i < count; i++) {
          tokens.push({ emoji, label });
        }
      }
    };

    // Standard coin regexes
    addTokens(/(\w+|\d+)\s+five-cent/i, '🪙', '5¢');
    addTokens(/(\w+|\d+)\s+ten-cent/i, '🪙', '10¢');
    addTokens(/(\w+|\d+)\s+twenty-cent/i, '🪙', '20¢');
    addTokens(/(\w+|\d+)\s+fifty-cent/i, '🪙', '50¢');
    
    // Standard note regexes
    addTokens(/(\w+|\d+)\s+\$1 note/i, '💵', '$1');
    addTokens(/(\w+|\d+)\s+\$2 note/i, '💵', '$2');
    addTokens(/(\w+|\d+)\s+\$5 note/i, '💵', '$5');
    addTokens(/(\w+|\d+)\s+\$10 note/i, '💵', '$10');
    addTokens(/(\w+|\d+)\s+two-dollar note/i, '💵', '$2');

    // Fallbacks for special collections in Mixed Money Mart
    if (questionText.includes("one $1 note")) tokens.push({ emoji: '💵', label: '$1' });
    if (questionText.includes("two 50¢ coins")) {
      tokens.push({ emoji: '🪙', label: '50¢' });
      tokens.push({ emoji: '🪙', label: '50¢' });
    }
    if (questionText.includes("one 20¢ coin")) tokens.push({ emoji: '🪙', label: '20¢' });
    if (questionText.includes("one 5¢ coin")) tokens.push({ emoji: '🪙', label: '5¢' });

    return tokens;
  };

  const tokens = parseTokens();

  if (tokens.length === 0) {
    // Return a general money themed graphic placeholder if no coins parsed
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2 justify-center my-4 p-3 bg-white/5 border border-white/10 rounded-xl max-w-[340px] mx-auto">
      {tokens.map((token, idx) => (
        <div
          key={idx}
          className="flex flex-col items-center justify-center p-2 bg-white/10 border border-white/20 rounded-lg min-w-[50px] min-h-[50px]"
        >
          <span className="text-xl">{token.emoji}</span>
          <span className="text-[10px] font-bold text-amber-300 mt-0.5">{token.label}</span>
        </div>
      ))}
    </div>
  );
}
