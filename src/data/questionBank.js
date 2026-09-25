// src/data/questionBank.js
// Procedurally generated Question Bank for ScrollQuest: General & Missing Terms (Grade 7 Math)
// 10 Worlds x 10 Questions = 100 Questions adhering to PRD §9 & TRD §4.4

import { WORLDS } from '../config/worlds.config.js';
import {
  EFFICIENCY_THRESHOLD,
  pickCleanArithmeticSequence,
  punchGaps,
  determineEfficientMethod,
  crossVerifyGap,
  generateTabularGap,
  generateWordProblemGap,
  formatGeneralTermFormula,
} from '../utils/restorationMath.js';

export const DISTRICTS = WORLDS.map(w => ({
  id: w.id,
  name: w.name,
  icon: w.emoji,
  accent: w.accent,
  description: w.description,
  conceptFocus: w.conceptFocus,
  boss: w.boss,
}));

function shuffleArray(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function makeUniqueOptions(correct, distractors) {
  const set = new Set();
  set.add(String(correct).trim());

  for (const d of distractors) {
    if (d !== null && d !== undefined && String(d).trim() !== String(correct).trim()) {
      set.add(String(d).trim());
    }
    if (set.size === 4) break;
  }

  // If we still need options, generate plausible numeric or text variants
  let offset = 1;
  const numCorrect = Number(correct);
  const isNumber = !isNaN(numCorrect);

  while (set.size < 4) {
    if (isNumber) {
      const alt1 = String(numCorrect + offset);
      const alt2 = String(numCorrect - offset);
      if (!set.has(alt1)) set.add(alt1);
      if (set.size < 4 && !set.has(alt2)) set.add(alt2);
      offset += 2;
    } else {
      const fallback = `Alternative ${set.size}`;
      set.add(fallback);
    }
  }

  return shuffleArray(Array.from(set));
}

// ─────────────────────────────────────────────────────────────────────────────
// WORLD GENERATORS (10 Questions per World)
// ─────────────────────────────────────────────────────────────────────────────

// World 0: The First Fragment (Single middle gap)
function generateWorld0Questions() {
  const questions = [];
  for (let i = 0; i < 10; i++) {
    const seq = pickCleanArithmeticSequence(5, { positiveOnly: true });
    const gapPos = Math.random() > 0.5 ? 3 : 4;
    const damaged = punchGaps(seq.terms, [gapPos]);
    const correct = seq.terms[gapPos - 1].value;
    const d = seq.d;

    // Distractors: wrong difference (+1 or -1 from d), backward mistake, calculation slip
    const distractors = [
      correct + d,
      correct - d,
      correct + (d > 0 ? 1 : -1),
    ];

    const displaySeq = damaged.map(t => (t.isBlank ? '__' : t.value)).join(', ');

    questions.push({
      id: i + 1,
      districtId: 0,
      category: 'SINGLE MIDDLE GAP',
      visual: 'scroll-strip',
      questionText: `The ancient fragment shows the sequence: ${displaySeq}. What is the missing number at position n = ${gapPos}?`,
      options: makeUniqueOptions(correct, distractors),
      correctAnswer: String(correct),
      explanation: `The common difference between adjacent terms is ${d >= 0 ? `+${d}` : d}. Stepping from position ${gapPos - 1} (${seq.terms[gapPos - 2].value}), we calculate ${seq.terms[gapPos - 2].value} ${d >= 0 ? '+' : '−'} ${Math.abs(d)} = ${correct}.`,
      hint1: `Look at the jump between the first two terms: ${seq.terms[1].value} − ${seq.terms[0].value} = ${d}.`,
      hint2: `Add ${d} to the term right before the blank (position ${gapPos - 1}).`,
      visualData: {
        sequence: damaged,
        blankIndices: [gapPos],
      },
    });
  }
  return questions;
}

// World 1: The Weathered Beginning (Missing early/first term)
function generateWorld1Questions() {
  const questions = [];
  for (let i = 0; i < 10; i++) {
    const seq = pickCleanArithmeticSequence(5, { positiveOnly: true });
    const gapPos = i % 2 === 0 ? 1 : 2; // Position 1 or 2
    const damaged = punchGaps(seq.terms, [gapPos]);
    const correct = seq.terms[gapPos - 1].value;
    const d = seq.d;
    const knownAdjacent = seq.terms[gapPos].value; // Next term

    // Headline Distractor: Adding d instead of subtracting when moving backward
    const distractorSignError = knownAdjacent + d;
    const distractorDoubleStep = correct - d;
    const distractorOffOne = correct + (d > 0 ? 2 : -2);

    const displaySeq = damaged.map(t => (t.isBlank ? '__' : t.value)).join(', ');

    questions.push({
      id: 10 + i + 1,
      districtId: 1,
      category: 'REASONING BACKWARD',
      visual: 'scroll-strip',
      questionText: `The opening of the scroll is faded: ${displaySeq}. Find the missing early term at position n = ${gapPos}.`,
      options: makeUniqueOptions(correct, [distractorSignError, distractorDoubleStep, distractorOffOne]),
      correctAnswer: String(correct),
      explanation: `Moving forward adds ${d}, so reasoning backward from position ${gapPos + 1} (${knownAdjacent}) requires reversing the step: ${knownAdjacent} − (${d}) = ${correct}. Beware of adding the step by accident!`,
      hint1: `Notice the forward step between known terms is ${d}.`,
      hint2: `To move backward from ${knownAdjacent}, do the inverse operation: subtract ${d}.`,
      visualData: {
        sequence: damaged,
        blankIndices: [gapPos],
      },
    });
  }
  return questions;
}

// World 2: The Broken Ending (Missing last / far term)
function generateWorld2Questions() {
  const questions = [];
  for (let i = 0; i < 10; i++) {
    const seq = pickCleanArithmeticSequence(4, { positiveOnly: true });
    const farN = 10 + i * 2; // e.g. 10th, 12th, 14th term
    const correct = seq.a + (farN - 1) * seq.d;
    const a = seq.a;
    const d = seq.d;

    // Distractors: using n instead of (n-1), arithmetic slips
    const distractorNtimesD = a + farN * d;
    const distractorMinusOneD = correct - d;
    const distractorWrongA = correct + 5;

    const displaySeq = seq.terms.map(t => t.value).join(', ');

    questions.push({
      id: 20 + i + 1,
      districtId: 2,
      category: 'FAR TERM CALCULATION',
      visual: 'scroll-strip',
      questionText: `A restored scroll begins with: ${displaySeq}... Using the general term formula, what is the value of the far term at position n = ${farN}?`,
      options: makeUniqueOptions(correct, [distractorNtimesD, distractorMinusOneD, distractorWrongA]),
      correctAnswer: String(correct),
      explanation: `First term a = ${a}, common difference d = ${d}. Using the general term formula: T_${farN} = a + (${farN} − 1)d = ${a} + (${farN - 1})(${d}) = ${correct}. Reaching for the formula avoids 10+ manual jumps!`,
      hint1: `Identify the first term a = ${a} and the step d = ${d}.`,
      hint2: `Multiply d by (${farN} − 1) = ${farN - 1}, then add a: ${a} + (${farN - 1} × ${d}).`,
      visualData: {
        sequence: seq.terms,
        highlightPos: farN,
      },
    });
  }
  return questions;
}

// World 3: Twin Gaps (Multiple missing terms in one sequence)
function generateWorld3Questions() {
  const questions = [];
  for (let i = 0; i < 10; i++) {
    const seq = pickCleanArithmeticSequence(6, { positiveOnly: true });
    const blank1 = 2;
    const blank2 = 4;
    const damaged = punchGaps(seq.terms, [blank1, blank2]);

    const val1 = seq.terms[blank1 - 1].value;
    const val2 = seq.terms[blank2 - 1].value;
    const correctStr = `${val1} and ${val2}`;

    const d = seq.d;
    // Distractors: inconsistent differences across gaps
    const distractor1 = `${val1} and ${val2 + d}`;
    const distractor2 = `${val1 - d} and ${val2}`;
    const distractor3 = `${val1 + 2} and ${val2 - 2}`;

    const displaySeq = damaged.map(t => (t.isBlank ? '__' : t.value)).join(', ');

    questions.push({
      id: 30 + i + 1,
      districtId: 3,
      category: 'TWIN GAPS RESTORATION',
      visual: 'scroll-strip',
      questionText: `The artifact has twin gaps at positions 2 and 4: ${displaySeq}. Which pair of numbers restores both gaps consistently?`,
      options: makeUniqueOptions(correctStr, [distractor1, distractor2, distractor3]),
      correctAnswer: correctStr,
      explanation: `Between position 1 (${seq.terms[0].value}) and position 3 (${seq.terms[2].value}), the difference is 2 steps: ${seq.terms[2].value} − ${seq.terms[0].value} = ${2 * d}. Thus common difference d = ${d}. Filling both gaps: T_2 = ${val1}, and T_4 = ${val2}.`,
      hint1: `From position 1 to position 3 is 2 steps. Divide the total difference by 2 to find d.`,
      hint2: `Check that your common difference stays identical across the entire sequence!`,
      visualData: {
        sequence: damaged,
        blankIndices: [blank1, blank2],
      },
    });
  }
  return questions;
}

// World 4: The Restoration Ledger (Tabular format with non-consecutive positions)
function generateWorld4Questions() {
  const questions = [];
  for (let i = 0; i < 10; i++) {
    const tab = generateTabularGap({ consecutivePositions: i < 3 }); // 7 items are non-consecutive
    const correct = tab.targetVal;

    questions.push({
      id: 40 + i + 1,
      districtId: 4,
      category: 'TABULAR RESTORATION',
      visual: 'restoration-table',
      questionText: `The archaeological ledger records Position ${tab.pos1} = ${tab.val1} and Position ${tab.pos2} = ${tab.val2}. What is the value at Position ${tab.blankPos}?`,
      options: makeUniqueOptions(correct, tab.distractors),
      correctAnswer: String(correct),
      explanation: `Notice that the positions differ by ${tab.posGap} (${tab.pos2} − ${tab.pos1}). The value change is ${tab.val2} − ${tab.val1} = ${tab.rawDifference}. Dividing value gap by position gap: common difference d = ${tab.rawDifference} ÷ ${tab.posGap} = ${tab.d}. At position ${tab.blankPos}, the value is ${correct}. Never use the raw difference without dividing by the position gap!`,
      hint1: `Careful: are the positions consecutive? Position difference = ${tab.pos2} − ${tab.pos1} = ${tab.posGap}.`,
      hint2: `Common step d = (Value difference) ÷ (Position difference) = ${tab.rawDifference} ÷ ${tab.posGap}.`,
      visualData: {
        rows: tab.tableData,
        columns: ['Position (n)', 'Restored Value (T_n)'],
      },
    });
  }
  return questions;
}

// World 5: The Merchant's Missing Coin (Word problems)
function generateWorld5Questions() {
  const questions = [];
  for (let i = 0; i < 10; i++) {
    const wp = generateWordProblemGap();
    const correct = wp.answer;

    questions.push({
      id: 50 + i + 1,
      districtId: 5,
      category: 'WORD PROBLEM SCENARIO',
      visual: null,
      questionText: wp.storyText,
      options: makeUniqueOptions(correct, wp.distractors),
      correctAnswer: String(correct),
      explanation: `Between ${wp.scenario.timeUnit} ${wp.p1} (${wp.v1}) and ${wp.scenario.timeUnit} ${wp.p2} (${wp.v2}), there are ${wp.stepGap} intervals with total change ${wp.rawDiff}. The constant rate per interval is ${wp.rawDiff} ÷ ${wp.stepGap} = ${wp.d} ${wp.scenario.unit}. Calculating for ${wp.scenario.timeUnit} ${wp.targetPos} yields ${correct} ${wp.scenario.unit}.`,
      hint1: `Find how many intervals elapsed between ${wp.scenario.timeUnit} ${wp.p1} and ${wp.scenario.timeUnit} ${wp.p2}: ${wp.stepGap} intervals.`,
      hint2: `Divide the total change (${wp.rawDiff}) by ${wp.stepGap} to find the rate per ${wp.scenario.timeUnit}.`,
      visualData: null,
    });
  }
  return questions;
}

// World 6: Choose Your Tool (Explicit method selection)
function generateWorld6Questions() {
  const questions = [];
  const templates = [
    {
      known: [2, 3],
      gap: 5, // distance = 2 <= 3 -> Term-to-term
      correct: "Term-to-term checking",
      distractor: "The general term formula",
      why: "The gap is only 2 positions from known term 3 (within 3 steps per the efficiency rule). A quick step is faster than deriving a formula.",
    },
    {
      known: [1, 2],
      gap: 25, // distance = 23 > 3 -> General term
      correct: "The general term formula",
      distractor: "Term-to-term checking",
      why: "The gap is 23 positions away. Doing 23 individual addition steps is slow and error-prone; direct substitution into T_n is far faster.",
    },
    {
      known: [4, 5],
      gap: 6, // distance = 1 <= 3 -> Term-to-term
      correct: "Term-to-term checking",
      distractor: "The general term formula",
      why: "The gap is immediately adjacent (distance 1). Simply adding the common difference takes just seconds.",
    },
    {
      known: [3, 4],
      gap: 40, // distance = 36 > 3 -> General term
      correct: "The general term formula",
      distractor: "Term-to-term checking",
      why: "The gap is far away at position 40. The general term formula calculates the answer in a single step.",
    },
    {
      known: [10, 11],
      gap: 12, // distance = 1 <= 3 -> Term-to-term
      correct: "Term-to-term checking",
      distractor: "The general term formula",
      why: "Position 12 is only 1 step from position 11. Quick term-to-term jump is the fastest path.",
    },
    {
      known: [1, 2],
      gap: 18, // distance = 16 > 3 -> General term
      correct: "The general term formula",
      distractor: "Term-to-term checking",
      why: "Position 18 is 16 steps away from known terms. Deriving and substituting into T_n is far more efficient.",
    },
  ];

  for (let i = 0; i < 10; i++) {
    const item = templates[i % templates.length];
    const distractors = [
      item.distractor,
      "Guess and check randomly",
      "Both methods take the exact same time",
    ];

    questions.push({
      id: 60 + i + 1,
      districtId: 6,
      category: 'METHOD SELECTION STRATEGY',
      visual: null,
      questionText: `A sequence has known terms at positions ${item.known.join(' and ')}, and a gap at position ${item.gap}. According to the Guild's efficiency rule (within 3 positions vs farther), which tool is faster?`,
      options: makeUniqueOptions(item.correct, distractors),
      correctAnswer: item.correct,
      explanation: item.why,
      hint1: `Check the distance from the nearest known term to position ${item.gap}. Is it 3 positions or fewer?`,
      hint2: `If distance <= 3, term-to-term is faster. If distance > 3, the general term is faster.`,
      visualData: null,
    });
  }
  return questions;
}

// World 7: Deriving the Master Key (Derive the general term when efficient)
function generateWorld7Questions() {
  const questions = [];
  for (let i = 0; i < 10; i++) {
    const a = 2 + i * 2;
    const d = 3 + (i % 4);
    const formula = formatGeneralTermFormula(a, d);

    // Distractor formulas
    const distractor1 = formatGeneralTermFormula(a + 1, d);
    const distractor2 = formatGeneralTermFormula(a, d + 1);
    const distractor3 = `T_n = ${a}n + ${d}`;

    const term1 = a;
    const term2 = a + d;
    const term3 = a + 2 * d;

    questions.push({
      id: 70 + i + 1,
      districtId: 7,
      category: 'DERIVING GENERAL TERM',
      visual: 'scroll-strip',
      questionText: `An ancient artifact has multiple gaps scattered across positions 10, 22, and 45. The first three terms are ${term1}, ${term2}, ${term3}. What is the Master Key general term formula T_n?`,
      options: makeUniqueOptions(formula, [distractor1, distractor2, distractor3]),
      correctAnswer: formula,
      explanation: `First term a = ${term1}, common difference d = ${term2} − ${term1} = ${d}. Formula: T_n = a + (n − 1)d = ${term1} + ${d}n − ${d} = ${formula}. Once derived, all scattered gaps can be restored instantly!`,
      hint1: `Find common difference d = ${term2} − ${term1} = ${d}.`,
      hint2: `Use T_n = dn + (a − d). Here a = ${term1} and d = ${d}.`,
      visualData: {
        sequence: [
          { position: 1, value: term1 },
          { position: 2, value: term2 },
          { position: 3, value: term3 },
        ],
      },
    });
  }
  return questions;
}

// World 8: Double-Checking the Restoration (Cross-verification)
function generateWorld8Questions() {
  const questions = [];
  for (let i = 0; i < 10; i++) {
    const seq = pickCleanArithmeticSequence(6, { positiveOnly: true });
    const targetPos = 4;
    const correctVal = seq.terms[targetPos - 1].value;

    const damaged = punchGaps(seq.terms, [targetPos]);

    const distractor1 = "By only checking the first two terms again";
    const distractor2 = "By adding 10 to see if it still looks reasonable";
    const distractor3 = "Cross-verification is optional if you are confident";

    const correctMethod = `Substitute n = ${targetPos} into general term ${seq.formula} and confirm it equals ${correctVal}`;

    questions.push({
      id: 80 + i + 1,
      districtId: 8,
      category: 'CROSS-VERIFICATION PROTOCOL',
      visual: 'verification-check',
      questionText: `A restorer filled position n = ${targetPos} with ${correctVal} using quick term-to-term checking. Following the Guild code, how must you cross-verify this result?`,
      options: makeUniqueOptions(correctMethod, [distractor1, distractor2, distractor3]),
      correctAnswer: correctMethod,
      explanation: `Cross-verification requires using a second, INDEPENDENT method. Since term-to-term was used first, substituting the position into the general term formula confirms the restored number is 100% certified.`,
      hint1: `A valid cross-check uses a different tool from the one originally used.`,
      hint2: `If you stepped term-to-term, substitute into the general term formula to confirm!`,
      visualData: {
        blankPos: targetPos,
        termToTermVal: correctVal,
        generalTermVal: correctVal,
        isVerified: true,
        claimedVal: correctVal,
      },
    });
  }
  return questions;
}

// World 9: The Grand Archive Unveiling (Mixed Review Grand Finale)
function generateWorld9Questions() {
  const questions = [];
  const mixedPickers = [
    () => generateWorld4Questions()[0],
    () => generateWorld1Questions()[1],
    () => generateWorld2Questions()[2],
    () => generateWorld5Questions()[3],
    () => generateWorld6Questions()[4],
    () => generateWorld3Questions()[5],
    () => generateWorld0Questions()[6],
    () => generateWorld7Questions()[7],
    () => generateWorld8Questions()[8],
    () => generateWorld4Questions()[9],
  ];

  for (let i = 0; i < 10; i++) {
    const base = mixedPickers[i]();
    questions.push({
      ...base,
      id: 90 + i + 1,
      districtId: 9,
      category: 'GRAND ARCHIVE FINALE',
    });
  }
  return questions;
}

// Assemble full 100 questions procedurally
export function generateQuestionBank() {
  return [
    ...generateWorld0Questions(),
    ...generateWorld1Questions(),
    ...generateWorld2Questions(),
    ...generateWorld3Questions(),
    ...generateWorld4Questions(),
    ...generateWorld5Questions(),
    ...generateWorld6Questions(),
    ...generateWorld7Questions(),
    ...generateWorld8Questions(),
    ...generateWorld9Questions(),
  ];
}

const questionBank = generateQuestionBank();
export default questionBank;
