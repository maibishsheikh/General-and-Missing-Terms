// scripts/stress_test.js
// Comprehensive QA Stress Test for ScrollQuest per TRD §10
// Tests 300 randomized iterations across all 10 concept categories (30,000 questions total)

import { generateQuestionBank } from '../src/data/questionBank.js';
import {
  EFFICIENCY_THRESHOLD,
  crossVerifyGap,
  generateTabularGap,
  determineEfficientMethod,
} from '../src/utils/restorationMath.js';

console.log('🏛️ Starting ScrollQuest QA Stress Test (TRD §10)...');

const ITERATIONS = 300;
let totalQuestionsChecked = 0;
let duplicatesFound = 0;
let malformedFound = 0;
let crossVerifyFailures = 0;
let efficiencyViolations = 0;
let tabularGapViolations = 0;

for (let iter = 1; iter <= ITERATIONS; iter++) {
  const bank = generateQuestionBank();

  if (!Array.isArray(bank) || bank.length !== 100) {
    console.error(`❌ Iteration ${iter}: Bank length is ${bank.length}, expected 100!`);
    process.exit(1);
  }

  bank.forEach((q) => {
    totalQuestionsChecked++;

    // 1. Schema check
    if (!q.id || q.districtId === undefined || !q.questionText || !q.options || !q.correctAnswer) {
      console.error(`❌ Iteration ${iter}, Q ${q.id}: Malformed fields detected!`, q);
      malformedFound++;
    }

    // 2. Options check: exactly 4 options, unique, includes correctAnswer
    if (q.options.length !== 4) {
      console.error(`❌ Iteration ${iter}, Q ${q.id}: Expected 4 options, got ${q.options.length}`);
      malformedFound++;
    }

    const uniqueOpts = new Set(q.options.map(o => String(o).trim()));
    if (uniqueOpts.size !== 4) {
      console.error(`❌ Iteration ${iter}, Q ${q.id}: Duplicate options detected!`, q.options);
      duplicatesFound++;
    }

    if (!uniqueOpts.has(String(q.correctAnswer).trim())) {
      console.error(`❌ Iteration ${iter}, Q ${q.id}: Correct answer "${q.correctAnswer}" not in options!`, q.options);
      malformedFound++;
    }

    // Check for NaN or undefined in options or question text
    q.options.forEach((opt) => {
      if (opt === undefined || opt === null || String(opt).includes('NaN') || String(opt).includes('undefined')) {
        console.error(`❌ Iteration ${iter}, Q ${q.id}: Option contains invalid text "${opt}"`);
        malformedFound++;
      }
    });

    if (q.questionText.includes('NaN') || q.questionText.includes('undefined')) {
      console.error(`❌ Iteration ${iter}, Q ${q.id}: Question text contains NaN/undefined!`);
      malformedFound++;
    }

    // 3. Efficiency rule consistency check for World 6
    if (q.districtId === 6) {
      const isTermToTerm = q.correctAnswer.toLowerCase().includes('term-to-term');
      const isGeneral = q.correctAnswer.toLowerCase().includes('general');

      if (!isTermToTerm && !isGeneral) {
        console.error(`❌ Iteration ${iter}, Q ${q.id}: World 6 correct answer is neither tool! "${q.correctAnswer}"`);
        efficiencyViolations++;
      }
    }
  });

  // 4. Tabular non-consecutive position audit
  for (let t = 0; t < 10; t++) {
    const tab = generateTabularGap({ consecutivePositions: false });
    if (tab.posGap <= 1) {
      console.error(`❌ Iteration ${iter}, Tabular gap is not non-consecutive: posGap = ${tab.posGap}`);
      tabularGapViolations++;
    }
  }

  // 5. Cross-verification math check
  const testSeq = [
    { position: 1, value: 5, isBlank: false },
    { position: 2, value: 9, isBlank: false },
    { position: 3, value: null, isBlank: true },
    { position: 4, value: 17, isBlank: false },
  ];
  const isValid = crossVerifyGap(testSeq, 3, 13, 5, 4);
  const isInvalid = crossVerifyGap(testSeq, 3, 15, 5, 4);

  if (!isValid || isInvalid) {
    console.error(`❌ Iteration ${iter}: crossVerifyGap check failed! (valid: ${isValid}, invalid: ${isInvalid})`);
    crossVerifyFailures++;
  }
}

console.log('\n═══════════════════════════════════════════════════');
console.log('✅ QA STRESS TEST RESULTS:');
console.log(`- Total Questions Evaluated: ${totalQuestionsChecked.toLocaleString()}`);
console.log(`- Duplicate Options Found:    ${duplicatesFound}`);
console.log(`- Malformed / NaN / Null:     ${malformedFound}`);
console.log(`- Cross-Verification Errors:  ${crossVerifyFailures}`);
console.log(`- Efficiency Rule Errors:     ${efficiencyViolations}`);
console.log(`- Tabular Gap Violations:     ${tabularGapViolations}`);
console.log('═══════════════════════════════════════════════════\n');

if (duplicatesFound === 0 && malformedFound === 0 && crossVerifyFailures === 0 && efficiencyViolations === 0 && tabularGapViolations === 0) {
  console.log('🎉 ALL AUDITS PASSED WITH ZERO ERRORS (≥300 RUNS)!');
  process.exit(0);
} else {
  console.error('❌ STRESS TEST FAILED!');
  process.exit(1);
}
