// src/utils/restorationMath.js
// Core mathematical engine for ScrollQuest: General and Missing Terms (Grade 7)

/**
 * PRD §3 / TRD §1 & §4.4 Stated Efficiency Rule:
 * A gap is term-to-term efficient if the nearest known term is within 3 positions of it (<= 3).
 * Otherwise (distance > 3), the general term formula is treated as the efficient choice.
 * Single source of truth across question generation, World 6/7 answers, and Error-Detective labs.
 */
export const EFFICIENCY_THRESHOLD = 3;

// Curated pools for clean integer arithmetic sequences
const CLEAN_A_POOL = [2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 14, 15, 18, 20, 25, 30, -5, -2, -10];
const CLEAN_D_POOL = [2, 3, 4, 5, 6, 7, 8, 10, -2, -3, -4, -5, -6, -8];

/**
 * Returns a random element from an array
 */
function sample(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Random integer between min and max (inclusive)
 */
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generates a clean arithmetic sequence with integer terms
 * @param {number} length - Number of terms
 * @param {Object} options - Custom options { a, d, positiveOnly }
 */
export function pickCleanArithmeticSequence(length = 6, options = {}) {
  let a = options.a !== undefined ? options.a : sample(CLEAN_A_POOL);
  let d = options.d !== undefined ? options.d : sample(CLEAN_D_POOL);

  // If positiveOnly is requested, ensure all terms in range are >= 0
  if (options.positiveOnly) {
    if (d < 0 && a + (length - 1) * d < 1) {
      a = Math.abs(d) * length + randomInt(2, 10);
    } else if (a < 0) {
      a = randomInt(2, 20);
    }
  }

  const terms = [];
  for (let n = 1; n <= length; n++) {
    terms.push({
      position: n,
      value: a + (n - 1) * d,
      isBlank: false,
    });
  }

  return {
    a,
    d,
    formula: formatGeneralTermFormula(a, d),
    terms,
  };
}

/**
 * Formats the nth term formula cleanly: T_n = d*n + (a - d)
 */
export function formatGeneralTermFormula(a, d) {
  const c = a - d;
  if (d === 1) {
    if (c === 0) return 'T_n = n';
    if (c > 0) return `T_n = n + ${c}`;
    return `T_n = n - ${Math.abs(c)}`;
  }
  if (d === -1) {
    if (c === 0) return 'T_n = -n';
    if (c > 0) return `T_n = ${c} - n`;
    return `T_n = -n - ${Math.abs(c)}`;
  }

  if (c === 0) return `T_n = ${d}n`;
  if (c > 0) return `T_n = ${d}n + ${c}`;
  return `T_n = ${d}n - ${Math.abs(c)}`;
}

/**
 * Punches gaps at designated 1-indexed positions
 * @param {Array} sequence - Array of term objects { position, value }
 * @param {Array<number>} blankPositions - 1-indexed positions to punch
 */
export function punchGaps(sequence, blankPositions = []) {
  const blankSet = new Set(blankPositions);
  return sequence.map(t => ({
    ...t,
    isBlank: blankSet.has(t.position),
    displayValue: blankSet.has(t.position) ? null : t.value,
  }));
}

/**
 * Solves gaps by propagating term-to-term from the nearest known term
 */
export function solveGapTermToTerm(sequence, blankPositions = []) {
  const solutions = {};
  const known = sequence.filter(t => !t.isBlank);
  if (known.length < 2) return solutions;

  // Determine d from two known consecutive or stepped terms
  const d = (known[1].value - known[0].value) / (known[1].position - known[0].position);

  blankPositions.forEach(blankPos => {
    // Find nearest known term
    let nearest = known[0];
    let minDistance = Math.abs(blankPos - nearest.position);

    for (let i = 1; i < known.length; i++) {
      const dist = Math.abs(blankPos - known[i].position);
      if (dist < minDistance) {
        minDistance = dist;
        nearest = known[i];
      }
    }

    const steps = blankPos - nearest.position;
    solutions[blankPos] = nearest.value + steps * d;
  });

  return solutions;
}

/**
 * Solves gaps by direct substitution into the general term formula
 */
export function solveGapGeneralTerm(a, d, blankPositions = []) {
  const solutions = {};
  blankPositions.forEach(pos => {
    solutions[pos] = a + (pos - 1) * d;
  });
  return solutions;
}

/**
 * Determines the objectively efficient method based on EFFICIENCY_THRESHOLD
 * @param {Array<number>} knownPositions - List of known term positions (1-indexed)
 * @param {number} blankPosition - 1-indexed position of the gap
 * @returns {'term-to-term' | 'general-term'}
 */
export function determineEfficientMethod(knownPositions, blankPosition) {
  if (!knownPositions || knownPositions.length === 0) return 'general-term';

  const distances = knownPositions.map(p => Math.abs(blankPosition - p));
  const minDistance = Math.min(...distances);

  return minDistance <= EFFICIENCY_THRESHOLD ? 'term-to-term' : 'general-term';
}

/**
 * Verifies that a filled value satisfies BOTH methods independently
 * Used for World 8, Simulate Station C/D, and question bank correctness
 */
export function crossVerifyGap(sequence, blankPosition, filledValue, a, d) {
  if (filledValue === null || filledValue === undefined || isNaN(filledValue)) {
    return false;
  }

  // Method 1: General Term substitution
  const expectedGeneral = a + (blankPosition - 1) * d;

  // Method 2: Term-to-term check from nearest known term
  const known = sequence.filter(t => t.position !== blankPosition && !t.isBlank);
  if (known.length === 0) {
    return Number(filledValue) === expectedGeneral;
  }

  let nearest = known[0];
  let minDist = Math.abs(blankPosition - nearest.position);
  for (let i = 1; i < known.length; i++) {
    const dist = Math.abs(blankPosition - known[i].position);
    if (dist < minDist) {
      minDist = dist;
      nearest = known[i];
    }
  }

  const expectedTermToTerm = nearest.value + (blankPosition - nearest.position) * d;

  // Cross-verification passes if both match each other AND the user's filledValue
  return (
    Number(filledValue) === expectedGeneral &&
    Number(filledValue) === expectedTermToTerm &&
    expectedGeneral === expectedTermToTerm
  );
}

/**
 * Generates a tabular gap question with consecutive or non-consecutive positions
 * Non-consecutive positions require dividing by position gap (ΔV / Δn), not just raw difference.
 */
export function generateTabularGap({ consecutivePositions = false } = {}) {
  const d = sample(CLEAN_D_POOL);
  const a = randomInt(5, 30);

  let pos1, pos2, blankPos;

  if (consecutivePositions) {
    pos1 = randomInt(1, 4);
    pos2 = pos1 + 1;
    blankPos = pos2 + 1;
  } else {
    // Guarantee non-consecutive positions with gap > 1
    pos1 = randomInt(1, 3);
    const gap = randomInt(2, 4); // delta n is 2, 3, or 4
    pos2 = pos1 + gap;
    // Blank position can be in between or after
    blankPos = Math.random() > 0.5 ? pos1 + 1 : pos2 + 1;
  }

  const val1 = a + (pos1 - 1) * d;
  const val2 = a + (pos2 - 1) * d;
  const targetVal = a + (blankPos - 1) * d;

  const rawDifference = val2 - val1;
  const posGap = pos2 - pos1;

  // Common distractor: taking raw difference without dividing by position gap
  const distractorRawDiff = blankPos > pos2 ? val2 + rawDifference : val1 + rawDifference;
  // Sign error distractor
  const distractorSign = targetVal + 2 * Math.abs(d);
  // Calculation off-by-one distractor
  const distractorOffByOne = targetVal + (d > 0 ? 1 : -1);

  const tableData = [
    { position: pos1, value: val1 },
    { position: pos2, value: val2 },
    { position: blankPos, value: null, isTarget: true },
  ].sort((x, y) => x.position - y.position);

  return {
    a,
    d,
    pos1,
    pos2,
    blankPos,
    val1,
    val2,
    rawDifference,
    posGap,
    targetVal,
    tableData,
    distractors: [distractorRawDiff, distractorSign, distractorOffByOne].filter(v => v !== targetVal),
  };
}

/**
 * Word problem scenario generators for World 5 & mixed review
 */
export const WORD_PROBLEM_SCENARIOS = [
  {
    type: 'market-stall',
    template: (p1, v1, p2, v2, targetPos, unit) =>
      `A market stall's daily sales of ${unit} rise by the same steady amount each day. On Day ${p1}, ${v1} ${unit} were sold. On Day ${p2}, ${v2} ${unit} were sold. How many ${unit} were sold on Day ${targetPos}?`,
    unit: 'handcrafted charms',
    timeUnit: 'Day',
  },
  {
    type: 'archaeological-dig',
    template: (p1, v1, p2, v2, targetPos, unit) =>
      `An archaeological expedition logs ancient ${unit} unearthed at each excavation layer. Layer ${p1} revealed ${v1} ${unit}, and Layer ${p2} revealed ${v2} ${unit}. Following the constant pattern, how many ${unit} are in Layer ${targetPos}?`,
    unit: 'clay tablets',
    timeUnit: 'Layer',
  },
  {
    type: 'library-archive',
    template: (p1, v1, p2, v2, targetPos, unit) =>
      `The Grand Guild Library catalogs ${unit} in consecutive storage chambers according to a strict arithmetic code. Chamber ${p1} contains ${v1} ${unit}, and Chamber ${p2} contains ${v2} ${unit}. How many ${unit} are stored in Chamber ${targetPos}?`,
    unit: 'parchment scrolls',
    timeUnit: 'Chamber',
  },
  {
    type: 'stone-masonry',
    template: (p1, v1, p2, v2, targetPos, unit) =>
      `Guild stonemasons carve glyphs on ancient pillars with a constant increase per level. Level ${p1} has ${v1} ${unit}, and Level ${p2} has ${v2} ${unit}. How many ${unit} are carved on Level ${targetPos}?`,
    unit: 'carved glyphs',
    timeUnit: 'Level',
  },
];

export function generateWordProblemGap() {
  const scenario = sample(WORD_PROBLEM_SCENARIOS);
  const d = sample([3, 4, 5, 6, 8, 10]);
  const a = randomInt(5, 25);

  const p1 = 2;
  const p2 = sample([4, 5, 6]);
  const targetPos = sample([1, 3, 7]);

  const v1 = a + (p1 - 1) * d;
  const v2 = a + (p2 - 1) * d;
  const answer = a + (targetPos - 1) * d;

  const rawDiff = v2 - v1;
  const stepGap = p2 - p1;

  const storyText = scenario.template(p1, v1, p2, v2, targetPos, scenario.unit);

  // Distractors
  const distractor1 = targetPos === 1 ? v1 + d : answer + d; // Backward sign error (added instead of subtracted for Day 1)
  const distractor2 = v1 + rawDiff; // Raw diff without dividing by stepGap
  const distractor3 = answer - (d > 0 ? d : -d);

  return {
    storyText,
    scenario,
    a,
    d,
    p1,
    p2,
    v1,
    v2,
    targetPos,
    answer,
    stepGap,
    rawDiff,
    distractors: [distractor1, distractor2, distractor3].filter(v => v !== answer),
  };
}
