// src/core/questions/questionBank.js
// MoneyQuest — 10 question generators = 100 total
// All amounts in CENTS internally; formatMoney converts for display.

import { COINS, NOTES } from '../../config/worlds.config.js';

// ── Utilities ────────────────────────────────────────────────────────────────

export function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

/**
 * formatMoney(cents) → "85¢" | "$1.20" | "$2.00"
 */
export function formatMoney(cents) {
  if (cents < 100) return `${cents}¢`;
  const dollars = Math.floor(cents / 100);
  const remainder = cents % 100;
  if (remainder === 0) return `$${dollars}.00`;
  return `$${dollars}.${String(remainder).padStart(2, '0')}`;
}

/**
 * generateDistractors(correct, min, max, step)
 * Produces 4 options (1 correct + 3 plausible wrong) in cents.
 */
export function generateDistractors(correctCents, minCents, maxCents, step = 5) {
  const opts = new Set([correctCents]);
  const offsets = shuffleArray([step, step * 2, step * 3, -step, -step * 2, step * 4, -step * 3]);
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
    const fallback = Math.round((randInt(minCents / step, maxCents / step) * step));
    if (!opts.has(fallback)) opts.add(fallback);
  }
  return shuffleArray([...opts]);
}

// ── Name / Context pools ─────────────────────────────────────────────────────

const ENGLISH_NAMES = [
  'Oliver', 'Emma', 'James', 'Sophie', 'Lucas', 'Mia', 'Noah',
  'Ava', 'Ethan', 'Grace', 'Henry', 'Lily', 'Jack', 'Chloe', 'Ryan', 'Ella',
];
const FEMALE_NAMES = ['Emma', 'Sophie', 'Mia', 'Ava', 'Grace', 'Lily', 'Chloe', 'Ella'];
function pronoun(name) { return FEMALE_NAMES.includes(name) ? 'she' : 'he'; }
function pronounCap(name) { return FEMALE_NAMES.includes(name) ? 'She' : 'He'; }

const MARKET_ITEMS = [
  { name: 'pencil',           emoji: '✏️',  minCents: 15,  maxCents: 50  },
  { name: 'eraser',           emoji: '📝',  minCents: 10,  maxCents: 40  },
  { name: 'ruler',            emoji: '📏',  minCents: 30,  maxCents: 70  },
  { name: 'sticker pack',     emoji: '⭐',  minCents: 50,  maxCents: 150 },
  { name: 'muffin',           emoji: '🧁',  minCents: 70,  maxCents: 120 },
  { name: 'juice box',        emoji: '🧃',  minCents: 40,  maxCents: 80  },
  { name: 'bookmark',         emoji: '📚',  minCents: 20,  maxCents: 50  },
  { name: 'coloured pencils', emoji: '🖍️', minCents: 100, maxCents: 150 },
  { name: 'toy car',          emoji: '🚗',  minCents: 100, maxCents: 200 },
  { name: 'story book',       emoji: '📖',  minCents: 150, maxCents: 250 },
  { name: 'badge',            emoji: '🏅',  minCents: 50,  maxCents: 100 },
  { name: 'biscuit',          emoji: '🍪',  minCents: 30,  maxCents: 60  },
  { name: 'balloon',          emoji: '🎈',  minCents: 20,  maxCents: 50  },
  { name: 'lolly',            emoji: '🍭',  minCents: 10,  maxCents: 30  },
  { name: 'notebook',         emoji: '📓',  minCents: 150, maxCents: 300 },
];

function pickItem(minCents, maxCents) {
  const valid = MARKET_ITEMS.filter(i => i.minCents >= minCents && i.maxCents <= maxCents);
  return pick(valid.length > 0 ? valid : MARKET_ITEMS);
}

function randomItemPrice(item) {
  const raw = randInt(Math.ceil(item.minCents / 5), Math.floor(item.maxCents / 5)) * 5;
  return raw;
}

// ── Question generators ──────────────────────────────────────────────────────

/** TYPE 1 — Count 5¢ and 10¢ coins | World 0: Coin Corner */
function genCountSmallCoins() {
  const name = pick(ENGLISH_NAMES);
  const tens  = randInt(1, 5);
  const fives = randInt(1, 5);
  const correctCents = tens * 10 + fives * 5;
  const options = generateDistractors(correctCents, 5, 80, 5);
  return {
    type: 'count_small_coins',
    questionText: `${name} has ${tens} ten-cent coin${tens > 1 ? 's' : ''} and ${fives} five-cent coin${fives > 1 ? 's' : ''}. How much money does ${pronoun(name)} have altogether?`,
    correctAnswer: formatMoney(correctCents),
    options: options.map(formatMoney),
    hint: `Add the 10¢ coins first: ${tens} × 10¢ = ${tens * 10}¢. Then add the 5¢ coins: ${fives} × 5¢ = ${fives * 5}¢.`,
    emoji: '🪙',
  };
}

/** TYPE 2 — Count mixed coins | World 1: Market Stall */
function genCountMixedCoins() {
  const name = pick(ENGLISH_NAMES);
  let fifties, twenties, tens, correctCents;
  do {
    fifties  = randInt(0, 2);
    twenties = randInt(0, 3);
    tens     = randInt(0, 2);
    correctCents = fifties * 50 + twenties * 20 + tens * 10;
  } while (correctCents === 0 || correctCents > 190);

  const options = generateDistractors(correctCents, 10, 200, 10);
  const parts = [];
  if (fifties > 0) parts.push(`${fifties} fifty-cent coin${fifties > 1 ? 's' : ''}`);
  if (twenties > 0) parts.push(`${twenties} twenty-cent coin${twenties > 1 ? 's' : ''}`);
  if (tens > 0) parts.push(`${tens} ten-cent coin${tens > 1 ? 's' : ''}`);
  const coinList = parts.join(', ');

  return {
    type: 'count_mixed_coins',
    questionText: `${name} has ${coinList}. How much money is that altogether?`,
    correctAnswer: formatMoney(correctCents),
    options: options.map(formatMoney),
    hint: `Add the biggest coins first: ${fifties > 0 ? `${fifties} × 50¢ = ${fifties * 50}¢` : ''}${twenties > 0 ? `, ${twenties} × 20¢ = ${twenties * 20}¢` : ''}${tens > 0 ? `, ${tens} × 10¢ = ${tens * 10}¢` : ''}.`,
    emoji: '🏪',
  };
}

/** TYPE 3 — Count notes | World 2: Note Bank */
function genCountNotes() {
  const name = pick(ENGLISH_NAMES);
  const noteValues = [100, 200, 500, 1000];
  const noteLabels = { 100: '$1', 200: '$2', 500: '$5', 1000: '$10' };
  const noteEmojis = { 100: '$1 note', 200: '$2 note', 500: '$5 note', 1000: '$10 note' };

  const noteVal = pick(noteValues);
  const count   = randInt(1, 5);
  const correctCents = noteVal * count;
  const opts = new Set([correctCents]);
  [count - 1, count + 1, count + 2, count - 2].forEach(c => {
    if (c > 0 && c <= 10 && opts.size < 4) opts.add(noteVal * c);
  });
  while (opts.size < 4) {
    const altNote = pick(noteValues);
    const altCount = randInt(1, 5);
    const alt = altNote * altCount;
    if (!opts.has(alt)) opts.add(alt);
  }

  return {
    type: 'count_notes',
    questionText: `${name} counts ${count} ${noteEmojis[noteVal]}${count > 1 ? 's' : ''}. How much money is that in total?`,
    correctAnswer: formatMoney(correctCents),
    options: shuffleArray([...opts]).map(formatMoney),
    hint: `${count} × ${noteLabels[noteVal]} = ${formatMoney(correctCents)}.`,
    emoji: '💵',
  };
}

/** TYPE 4 — Count mixed collection | World 3: Mixed Money Mart */
function genCountMixedCollection() {
  const name = pick(ENGLISH_NAMES);
  const noteVal  = pick([0, 100, 200]);
  const coin1Val = pick([20, 50, 100]);
  const coin1Cnt = randInt(1, 2);
  const coin2Val = pick([5, 10, 20]);
  const coin2Cnt = randInt(1, 3);

  const correctCents = noteVal + coin1Val * coin1Cnt + coin2Val * coin2Cnt;
  if (correctCents > 500 || correctCents < 25) return genCountMixedCollection();

  const options = generateDistractors(correctCents, 25, 500, 5);
  const partsList = [];
  if (noteVal > 0) partsList.push(`one ${formatMoney(noteVal)} note`);
  partsList.push(`${coin1Cnt} ${formatMoney(coin1Val)} coin${coin1Cnt > 1 ? 's' : ''}`);
  partsList.push(`${coin2Cnt} ${formatMoney(coin2Val)} coin${coin2Cnt > 1 ? 's' : ''}`);

  return {
    type: 'count_mixed_collection',
    questionText: `${name}'s purse has ${partsList.join(', ')}. How much is in ${pronoun(name)} purse?`,
    correctAnswer: formatMoney(correctCents),
    options: options.map(formatMoney),
    hint: `Start from the largest amount and add down: ${partsList.join(' + ')}.`,
    emoji: '🛍️',
  };
}

/** TYPE 5 — Cents ↔ Dollars conversion | World 4: Cents to Dollars */
function genConversion() {
  const subtype = pick(['cents_to_dollars', 'dollars_to_cents', 'fill_in']);
  const wholeDollars = randInt(1, 5);
  const extraCents   = pick([0, 25, 50, 75]);
  const totalCents   = wholeDollars * 100 + extraCents;

  if (subtype === 'cents_to_dollars') {
    const options = generateDistractors(totalCents, 100, 500, 25).map(c => formatMoney(c));
    return {
      type: 'conversion',
      questionText: `${totalCents}¢ is the same as ___?`,
      correctAnswer: formatMoney(totalCents),
      options,
      hint: `Divide by 100 to convert cents to dollars: ${totalCents} ÷ 100 = ${formatMoney(totalCents)}.`,
      emoji: '💱',
    };
  }

  if (subtype === 'dollars_to_cents') {
    const options = generateDistractors(totalCents, 100, 500, 25).map(c => `${c}¢`);
    return {
      type: 'conversion',
      questionText: `${formatMoney(totalCents)} is the same as ___ cents?`,
      correctAnswer: `${totalCents}¢`,
      options,
      hint: `Multiply by 100 to convert dollars to cents: ${wholeDollars} × 100 = ${totalCents}¢.`,
      emoji: '💱',
    };
  }

  const d = randInt(1, 10);
  const cents = d * 100;
  return {
    type: 'conversion',
    questionText: `${cents} cents = $___`,
    correctAnswer: `$${d}`,
    options: shuffleArray([`$${d}`, `$${d + 1}`, `$${d - 1 > 0 ? d - 1 : d + 2}`, `$${d + 2}`]),
    hint: `100 cents = $1. So ${cents} cents = $${d}.`,
    emoji: '💱',
  };
}

/** TYPE 6 — Compare amounts | World 5: Which is More? */
function genCompare() {
  const subtype = pick(['which_more', 'which_less', 'order_three']);

  if (subtype === 'which_more' || subtype === 'which_less') {
    let a, b;
    do {
      a = randInt(1, 40) * 5;
      b = randInt(1, 40) * 5;
    } while (a === b);

    const question = subtype === 'which_more'
      ? `Which is MORE: ${formatMoney(a)} or ${formatMoney(b)}?`
      : `Which is LESS: ${formatMoney(a)} or ${formatMoney(b)}?`;
    const correct = subtype === 'which_more'
      ? formatMoney(Math.max(a, b))
      : formatMoney(Math.min(a, b));

    return {
      type: 'compare',
      questionText: question,
      correctAnswer: correct,
      options: shuffleArray([formatMoney(a), formatMoney(b), formatMoney(a + 5), formatMoney(b - 5 > 0 ? b - 5 : b + 10)]),
      hint: `${a > b ? `${formatMoney(a)} is bigger than ${formatMoney(b)}` : `${formatMoney(b)} is bigger than ${formatMoney(a)}`}.`,
      emoji: '⚖️',
    };
  }

  const vals = shuffleArray([randInt(1, 10) * 10, randInt(11, 25) * 10, randInt(26, 50) * 10]);
  const sorted = [...vals].sort((a, b) => a - b);
  const correctLabel = sorted.map(formatMoney).join(' < ');
  const wrong1 = [sorted[1], sorted[0], sorted[2]].map(formatMoney).join(' < ');
  const wrong2 = [sorted[2], sorted[1], sorted[0]].map(formatMoney).join(' < ');
  const wrong3 = [sorted[0], sorted[2], sorted[1]].map(formatMoney).join(' < ');

  return {
    type: 'compare',
    questionText: `Put these amounts in order from LEAST to MOST: ${vals.map(formatMoney).join(', ')}`,
    correctAnswer: correctLabel,
    options: shuffleArray([correctLabel, wrong1, wrong2, wrong3]),
    hint: `The smallest amount is ${formatMoney(sorted[0])}.`,
    emoji: '⚖️',
  };
}

/** TYPE 7 — Add money amounts | World 6: Adding Money */
function genAddMoney() {
  const name = pick(ENGLISH_NAMES);
  const item1 = pickItem(5, 300);
  const item2 = pickItem(5, 300);
  const price1 = randomItemPrice(item1);
  let price2;
  do { price2 = randomItemPrice(item2); } while (price2 === price1 || price1 + price2 > 990);
  const correctCents = price1 + price2;
  const options = generateDistractors(correctCents, 10, 990, 5);

  return {
    type: 'addition',
    questionText: `${name} buys a ${item1.name} ${item1.emoji} for ${formatMoney(price1)} and a ${item2.name} ${item2.emoji} for ${formatMoney(price2)}. How much does ${pronoun(name)} spend altogether?`,
    correctAnswer: formatMoney(correctCents),
    options: options.map(formatMoney),
    hint: `Add the amounts: ${formatMoney(price1)} + ${formatMoney(price2)} = ${formatMoney(correctCents)}.`,
    emoji: '➕',
  };
}

/** TYPE 8 — Make change | World 7: Making Change */
function genChange() {
  const name = pick(ENGLISH_NAMES);
  const PAYMENT_OPTIONS = [100, 200, 500];
  const payment = pick(PAYMENT_OPTIONS);
  let price;
  do {
    price = randInt(1, (payment / 5) - 1) * 5;
  } while (price >= payment || price === 0);

  const changeCents = payment - price;
  const item = pickItem(5, payment - 5);
  const options = generateDistractors(changeCents, 5, payment - 5, 5);

  return {
    type: 'change',
    questionText: `${name} buys a ${item.name} ${item.emoji} for ${formatMoney(price)}. ${pronounCap(name)} pays with a ${formatMoney(payment)} ${payment === 100 ? 'coin' : 'note'}. How much change does ${pronoun(name)} get?`,
    correctAnswer: formatMoney(changeCents),
    options: options.map(formatMoney),
    hint: `Change = Amount Paid − Price. ${formatMoney(payment)} − ${formatMoney(price)} = ${formatMoney(changeCents)}.`,
    emoji: '🔄',
  };
}

/** TYPE 9 — Word problems | World 8: Word Problem Market */
function genWordProblem() {
  const subtype = pick(['total', 'change_left', 'how_much_more', 'enough']);
  const name  = pick(ENGLISH_NAMES);
  const name2 = pick(ENGLISH_NAMES.filter(n => n !== name));

  if (subtype === 'total') {
    const item1 = pickItem(20, 250);
    const item2 = pickItem(20, 250);
    const p1 = randomItemPrice(item1);
    const p2 = randomItemPrice(item2);
    const total = p1 + p2;
    if (total > 500) return genWordProblem();
    const opts = generateDistractors(total, 40, 500, 5);
    return {
      type: 'word_problem',
      questionText: `${name} buys a ${item1.name} for ${formatMoney(p1)} and a ${item2.name} for ${formatMoney(p2)}. How much does ${pronoun(name)} spend in total?`,
      correctAnswer: formatMoney(total),
      options: opts.map(formatMoney),
      hint: `Total = ${formatMoney(p1)} + ${formatMoney(p2)} = ${formatMoney(total)}.`,
      emoji: '📝',
    };
  }

  if (subtype === 'change_left') {
    const startCents = pick([200, 300, 500]);
    const item = pickItem(20, startCents - 5);
    const price = randomItemPrice(item);
    if (price >= startCents) return genWordProblem();
    const left = startCents - price;
    const opts = generateDistractors(left, 5, startCents, 5);
    return {
      type: 'word_problem',
      questionText: `${name} has ${formatMoney(startCents)}. ${pronounCap(name)} buys a ${item.name} ${item.emoji} for ${formatMoney(price)}. How much money does ${pronoun(name)} have left?`,
      correctAnswer: formatMoney(left),
      options: opts.map(formatMoney),
      hint: `Money left = ${formatMoney(startCents)} − ${formatMoney(price)} = ${formatMoney(left)}.`,
      emoji: '📝',
    };
  }

  if (subtype === 'how_much_more') {
    let a, b;
    do {
      a = randInt(1, 20) * 10;
      b = randInt(1, 20) * 10;
    } while (a === b || Math.abs(a - b) > 200);
    const bigger  = Math.max(a, b);
    const smaller = Math.min(a, b);
    const diff    = bigger - smaller;
    const item1 = pickItem(Math.max(5, smaller - 10), smaller + 10);
    const item2 = pickItem(Math.max(5, bigger - 10), bigger + 10);
    const opts  = generateDistractors(diff, 5, 300, 5);
    return {
      type: 'word_problem',
      questionText: `A ${item1.name} costs ${formatMoney(smaller)}. A ${item2.name} costs ${formatMoney(bigger)}. How much more does the ${item2.name} cost?`,
      correctAnswer: formatMoney(diff),
      options: opts.map(formatMoney),
      hint: `Difference = ${formatMoney(bigger)} − ${formatMoney(smaller)} = ${formatMoney(diff)}.`,
      emoji: '📝',
    };
  }

  const have   = pick([100, 150, 200, 250, 300]);
  const item   = pickItem(50, 350);
  const price  = randomItemPrice(item);
  const correct = have >= price ? 'Yes ✅' : 'No ❌';
  return {
    type: 'word_problem',
    questionText: `${name} has ${formatMoney(have)}. A ${item.name} ${item.emoji} costs ${formatMoney(price)}. Does ${pronoun(name)} have enough money to buy it?`,
    correctAnswer: correct,
    options: shuffleArray(['Yes ✅', 'No ❌', `Almost — needs ${formatMoney(Math.abs(price - have))} more`, 'Cannot tell']),
    hint: `${formatMoney(have)} ${have >= price ? '≥' : '<'} ${formatMoney(price)} — ${correct}`,
    emoji: '📝',
  };
}

/** TYPE 10 — Mixed review | World 9: Money Master */
function genMixedReview() {
  const generators = [
    genCountSmallCoins,
    genCountMixedCoins,
    genCountNotes,
    genCountMixedCollection,
    genConversion,
    genCompare,
    genAddMoney,
    genChange,
    genWordProblem,
  ];
  return pick(generators)();
}

// ── Question map by world concept ────────────────────────────────────────────

const CONCEPT_GENERATORS = {
  count_small_coins:      genCountSmallCoins,
  count_mixed_coins:      genCountMixedCoins,
  count_notes:            genCountNotes,
  count_mixed_collection: genCountMixedCollection,
  conversion:             genConversion,
  compare:                genCompare,
  addition:               genAddMoney,
  change:                 genChange,
  word_problems:          genWordProblem,
  mixed_review:           genMixedReview,
};

export function generateQuestions(worldConceptFocus, count) {
  const gen = CONCEPT_GENERATORS[worldConceptFocus] || genMixedReview;
  const questions = [];
  for (let i = 0; i < count; i++) {
    questions.push(gen());
  }
  return questions;
}

export function getReflectQuestions(count = 5) {
  return generateQuestions('mixed_review', count);
}

export function calcStars(correct, total) {
  if (total === 0) return 0;
  const pct = (correct / total) * 100;
  if (pct >= 90) return 3;
  if (pct >= 70) return 2;
  if (pct >= 50) return 1;
  return 0;
}

export function evaluateBadges(session) {
  const earned = [];
  if (session.totalCorrect >= 1)                        earned.push('first_coin');
  if (session.maxStreak   >= 5)                         earned.push('hot_streak');
  if (session.simulateComplete)                         earned.push('change_champ');
  if ((session.worldCorrect / session.worldTotal) >= 0.8) earned.push('money_master');
  if (session.worldCorrect === session.worldTotal)      earned.push('perfect_purse');
  if (session.bossDefeated)                             earned.push('boss_slayer');
  if (session.allPhasesComplete)                        earned.push('full_journey');
  return earned;
}
