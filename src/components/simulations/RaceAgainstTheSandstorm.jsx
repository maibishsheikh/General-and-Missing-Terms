// src/components/simulations/RaceAgainstTheSandstorm.jsx
// Station B: "The Formula Builder" — TEACH the General Term Formula
// Progressive: Visual derivation → Interactive formula builder → Guided practice
// Builds on Station A: now learn the FORMULA for when stepping takes too long

import React, { useState } from 'react';
import './Stations.css';
import { useAudio } from '../../hooks/useAudio.js';

export default function RaceAgainstTheSandstorm({ onComplete, audioEnabled }) {
  const { narrate, stopAll, sounds } = useAudio(audioEnabled);

  const [stage, setStage] = useState('learn');
  const [learnStep, setLearnStep] = useState(0);

  // Interactive formula builder state
  const [builderA, setBuilderA] = useState('');
  const [builderD, setBuilderD] = useState('');
  const [builderN, setBuilderN] = useState('');
  const [builderResult, setBuilderResult] = useState(null);
  const [builderFeedback, setBuilderFeedback] = useState(null);

  // Guided practice
  const [guidedStep, setGuidedStep] = useState(0);
  const [guidedInputs, setGuidedInputs] = useState({ a: '', d: '', n: '', result: '' });
  const [guidedFeedback, setGuidedFeedback] = useState(null);

  // Free practice
  const [practiceRound, setPracticeRound] = useState(0);
  const [practiceAnswer, setPracticeAnswer] = useState('');
  const [practiceFeedback, setPracticeFeedback] = useState(null);

  // Teaching sequence for derivation: a=5, d=3
  const demoA = 5;
  const demoD = 3;

  const LEARN_SLIDES = [
    {
      title: '🤔 The Problem with Many Steps',
      body: 'In Station A, you learned term-to-term stepping: add d each time. But what if you need position 50? That\'s 49 additions! There MUST be a faster way...',
      visual: 'problem',
    },
    {
      title: '🔬 Building the Formula — Step by Step',
      body: 'Let\'s figure out the pattern! If a = 5 (first term) and d = 3 (common diff):',
      visual: 'derivation',
    },
    {
      title: '📜 The General Term Formula',
      body: 'We discovered the pattern! To find ANY term at position n:',
      visual: 'formula',
    },
    {
      title: '🧮 Let\'s Use It! Interactive Formula Calculator',
      body: 'Try it yourself! Enter a, d, and n below to calculate any term instantly. Start with a = 5, d = 3, n = 10.',
      visual: 'calculator',
    },
    {
      title: '⚡ When to Use the Formula vs Stepping',
      body: 'Now you have TWO tools! Here\'s the Guild\'s Sacred Rule:',
      visual: 'rule',
    },
  ];

  function advanceLearn() {
    sounds.click();
    if (learnStep < LEARN_SLIDES.length - 1) {
      setLearnStep(s => s + 1);
    } else {
      setStage('guided');
      narrate([{ text: 'Excellent! Now let\'s practice using the formula with guided examples!', style: 'celebration' }]);
    }
  }

  // Formula calculator
  function calculateFormula() {
    const a = Number(builderA);
    const d = Number(builderD);
    const n = Number(builderN);
    if (isNaN(a) || isNaN(d) || isNaN(n) || builderA === '' || builderD === '' || builderN === '') {
      setBuilderFeedback({ type: 'error', text: 'Fill in all three values!' });
      return;
    }
    sounds.correct();
    const result = a + (n - 1) * d;
    setBuilderResult(result);
    setBuilderFeedback({
      type: 'success',
      text: `T_${n} = ${a} + (${n} − 1) × ${d} = ${a} + ${(n - 1)} × ${d} = ${a} + ${(n - 1) * d} = ${result}`,
    });
  }

  // Guided problems
  const GUIDED_PROBLEMS = [
    {
      title: 'Find position 20',
      seq: '4, 9, 14, 19, 24, ...',
      a: 4, d: 5, n: 20,
      answer: 99,
      steps: [
        'First, identify: a = 4 (first term), d = 5 (common difference)',
        'We need: T_20 (the 20th term)',
        'Apply formula: T_20 = a + (n − 1) × d',
        'Calculate: T_20 = 4 + (20 − 1) × 5 = 4 + 19 × 5 = 4 + 95 = 99',
      ],
    },
    {
      title: 'Find position 15 (decreasing)',
      seq: '30, 26, 22, 18, ...',
      a: 30, d: -4, n: 15,
      answer: -26,
      steps: [
        'Identify: a = 30, d = −4 (decreasing sequence!)',
        'We need: T_15',
        'Apply formula: T_15 = 30 + (15 − 1) × (−4)',
        'Calculate: T_15 = 30 + 14 × (−4) = 30 − 56 = −26',
      ],
    },
    {
      title: 'Find position 8',
      seq: '7, 12, 17, 22, ...',
      a: 7, d: 5, n: 8,
      answer: 42,
      steps: [
        'Identify: a = 7, d = +5',
        'We need: T_8',
        'Apply formula: T_8 = 7 + (8 − 1) × 5',
        'Calculate: T_8 = 7 + 7 × 5 = 7 + 35 = 42',
      ],
    },
  ];

  function checkGuided() {
    const problem = GUIDED_PROBLEMS[guidedStep];
    const userResult = Number(guidedInputs.result?.trim());
    if (isNaN(userResult) || guidedInputs.result?.trim() === '') {
      sounds.wrong();
      setGuidedFeedback({ type: 'error', text: '⚠️ Enter your final answer!' });
      return;
    }
    if (userResult === problem.answer) {
      sounds.correct();
      setGuidedFeedback({ type: 'success', text: `🎉 Correct! T_${problem.n} = ${problem.answer}!` });
      setTimeout(() => {
        if (guidedStep + 1 < GUIDED_PROBLEMS.length) {
          setGuidedStep(s => s + 1);
          setGuidedInputs({ a: '', d: '', n: '', result: '' });
          setGuidedFeedback(null);
        } else {
          setStage('practice');
          setGuidedFeedback(null);
        }
      }, 1200);
    } else {
      sounds.wrong();
      setGuidedFeedback({ type: 'error', text: `❌ Not ${userResult}. Follow the steps below carefully!` });
    }
  }

  // Free practice
  const PRACTICE = [
    { seq: '6, 11, 16, 21, ...', a: 6, d: 5, n: 25, answer: 126, question: 'Find T_25 for the sequence: 6, 11, 16, 21, ...' },
    { seq: '100, 93, 86, 79, ...', a: 100, d: -7, n: 12, answer: 23, question: 'Find T_12 for the decreasing sequence: 100, 93, 86, 79, ...' },
  ];

  function checkPractice() {
    const p = PRACTICE[practiceRound];
    const num = Number(practiceAnswer.trim());
    if (num === p.answer) {
      sounds.correct();
      setPracticeFeedback({ type: 'success', text: `🎉 Correct! T_${p.n} = ${p.answer}!` });
      setTimeout(() => {
        if (practiceRound + 1 < PRACTICE.length) {
          setPracticeRound(r => r + 1);
          setPracticeAnswer('');
          setPracticeFeedback(null);
        } else {
          setStage('complete');
        }
      }, 1200);
    } else {
      sounds.wrong();
      setPracticeFeedback({ type: 'error', text: `❌ Use the formula: T_n = ${p.a} + (${p.n} − 1) × ${p.d > 0 ? p.d : `(${p.d})`}` });
    }
  }

  const slide = LEARN_SLIDES[learnStep];

  return (
    <div className="station-wrap sim-teaching-station">
      <div className="station-header">
        <h3 className="station-title">📜 Station B: The Formula Builder</h3>
        <div className="station-target-box">
          <span className="station-target-label">
            {stage === 'learn' ? 'Learning' : stage === 'guided' ? 'Guided Practice' : stage === 'practice' ? 'Free Practice' : 'Complete'}
          </span>
          <span className="station-target-num">
            {stage === 'learn' ? `${learnStep + 1}/${LEARN_SLIDES.length}` :
             stage === 'guided' ? `${guidedStep + 1}/${GUIDED_PROBLEMS.length}` :
             stage === 'practice' ? `${practiceRound + 1}/${PRACTICE.length}` : '✅'}
          </span>
        </div>
      </div>

      <div className="sim-teach-progress">
        <div className="sim-teach-progress-track">
          {['learn', 'guided', 'practice', 'complete'].map((s, i) => (
            <div key={s} className={`progress-segment ${s === stage ? 'current' : ['learn', 'guided', 'practice', 'complete'].indexOf(stage) > i ? 'done' : ''}`}>
              <span className="segment-label">{['📖 Learn', '🤝 Guided', '💪 Practice', '🏆 Done'][i]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ─── LEARN STAGE ─── */}
      {stage === 'learn' && (
        <div className="teach-content">
          <div className="teach-card glass-card">
            <h4 className="teach-title">{slide.title}</h4>
            <p className="teach-body">{slide.body}</p>

            {/* Visual: The Problem */}
            {slide.visual === 'problem' && (
              <div className="formula-visual-box">
                <div className="problem-demo">
                  <div className="demo-sequence-line">
                    <span className="demo-term">T₁=5</span>
                    <span className="demo-arrow">→</span>
                    <span className="demo-term">T₂=8</span>
                    <span className="demo-arrow">→</span>
                    <span className="demo-term">T₃=11</span>
                    <span className="demo-arrow">→</span>
                    <span className="demo-dots">... 47 more jumps ...</span>
                    <span className="demo-arrow">→</span>
                    <span className="demo-term gap-term">T₅₀=?</span>
                  </div>
                  <p className="demo-caption">😰 49 additions of +3? That takes forever and risks mistakes!</p>
                </div>
              </div>
            )}

            {/* Visual: Derivation Table */}
            {slide.visual === 'derivation' && (
              <div className="formula-visual-box">
                <div className="derivation-table">
                  <div className="deriv-row header">
                    <span className="deriv-cell">Position (n)</span>
                    <span className="deriv-cell">Calculation</span>
                    <span className="deriv-cell">Value</span>
                    <span className="deriv-cell">Pattern</span>
                  </div>
                  {[
                    { n: 1, calc: '5', val: 5, pattern: '5 + 0×3' },
                    { n: 2, calc: '5 + 3', val: 8, pattern: '5 + 1×3' },
                    { n: 3, calc: '5 + 3 + 3', val: 11, pattern: '5 + 2×3' },
                    { n: 4, calc: '5 + 3 + 3 + 3', val: 14, pattern: '5 + 3×3' },
                    { n: 'n', calc: '5 + 3 + 3 + ... + 3', val: '?', pattern: '5 + (n−1)×3' },
                  ].map((row, i) => (
                    <div key={i} className={`deriv-row ${i === 4 ? 'highlight-row' : ''}`} style={{ animationDelay: `${i * 0.2}s` }}>
                      <span className="deriv-cell deriv-n">{row.n}</span>
                      <span className="deriv-cell deriv-calc">{row.calc}</span>
                      <span className="deriv-cell deriv-val">{row.val}</span>
                      <span className="deriv-cell deriv-pattern">{row.pattern}</span>
                    </div>
                  ))}
                </div>
                <p className="demo-caption">💡 See it? Position n always = a + (n − 1) × d !</p>
              </div>
            )}

            {/* Visual: The Formula */}
            {slide.visual === 'formula' && (
              <div className="formula-visual-box">
                <div className="formula-display">
                  <div className="formula-main">
                    <span className="formula-tn">T<sub>n</sub></span>
                    <span className="formula-eq">=</span>
                    <span className="formula-part a-part">a</span>
                    <span className="formula-op">+</span>
                    <span className="formula-bracket">(</span>
                    <span className="formula-part n-part">n</span>
                    <span className="formula-op">−</span>
                    <span className="formula-part one-part">1</span>
                    <span className="formula-bracket">)</span>
                    <span className="formula-op">×</span>
                    <span className="formula-part d-part">d</span>
                  </div>
                  <div className="formula-labels">
                    <div className="f-label a-label"><span className="f-dot a-dot" /><span>a = first term</span></div>
                    <div className="f-label n-label"><span className="f-dot n-dot" /><span>n = position you want</span></div>
                    <div className="f-label d-label"><span className="f-dot d-dot" /><span>d = common difference</span></div>
                  </div>
                </div>
                <div className="formula-example">
                  <p>Example: a=5, d=3, n=50 → T₅₀ = 5 + (50−1)×3 = 5 + 147 = <strong>152</strong> ✨</p>
                  <p className="demo-caption">One calculation instead of 49 steps! 🚀</p>
                </div>
              </div>
            )}

            {/* Visual: Interactive Calculator */}
            {slide.visual === 'calculator' && (
              <div className="formula-visual-box">
                <div className="formula-calculator">
                  <div className="calc-formula-display">
                    T<sub>n</sub> = <span className="calc-a">{builderA || 'a'}</span> + (<span className="calc-n">{builderN || 'n'}</span> − 1) × <span className="calc-d">{builderD || 'd'}</span>
                  </div>
                  <div className="calc-inputs-row">
                    <div className="calc-input-group">
                      <label className="calc-label">a (first term)</label>
                      <input type="number" className="calc-input a-input" value={builderA} onChange={e => setBuilderA(e.target.value)} placeholder="5" />
                    </div>
                    <div className="calc-input-group">
                      <label className="calc-label">d (common diff)</label>
                      <input type="number" className="calc-input d-input" value={builderD} onChange={e => setBuilderD(e.target.value)} placeholder="3" />
                    </div>
                    <div className="calc-input-group">
                      <label className="calc-label">n (position)</label>
                      <input type="number" className="calc-input n-input" value={builderN} onChange={e => setBuilderN(e.target.value)} placeholder="10" />
                    </div>
                    <button className="btn btn-primary calc-btn" onClick={calculateFormula}>Calculate!</button>
                  </div>
                  {builderResult !== null && (
                    <div className="calc-result">
                      <span className="calc-result-label">Result:</span>
                      <span className="calc-result-value">{builderResult}</span>
                    </div>
                  )}
                  {builderFeedback && (
                    <div className={`teach-feedback ${builderFeedback.type}`}>{builderFeedback.text}</div>
                  )}
                </div>
              </div>
            )}

            {/* Visual: The Rule */}
            {slide.visual === 'rule' && (
              <div className="formula-visual-box">
                <div className="rule-comparison">
                  <div className="rule-card near-rule">
                    <span className="rule-emoji">🖌️</span>
                    <h5 className="rule-name">Term-to-Term</h5>
                    <p className="rule-when">Use when gap is <strong>≤ 3 steps</strong> away</p>
                    <p className="rule-how">Just add/subtract d a few times</p>
                    <div className="rule-example">Gap at n=4 from n=3? → One step!</div>
                  </div>
                  <div className="rule-vs">VS</div>
                  <div className="rule-card far-rule">
                    <span className="rule-emoji">📜</span>
                    <h5 className="rule-name">General Term Formula</h5>
                    <p className="rule-when">Use when gap is <strong>&gt; 3 steps</strong> away</p>
                    <p className="rule-how">T_n = a + (n−1)×d in one calculation</p>
                    <div className="rule-example">Gap at n=50? → Formula instantly!</div>
                  </div>
                </div>
              </div>
            )}

            <div className="teach-nav">
              {learnStep > 0 && (
                <button className="btn btn-outline btn-sm" onClick={() => { sounds.click(); setLearnStep(s => s - 1); }}>← Back</button>
              )}
              <button className="btn btn-primary btn-sm" onClick={advanceLearn}>
                {learnStep < LEARN_SLIDES.length - 1 ? 'Next →' : 'Start Practice! 🎯'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── GUIDED STAGE ─── */}
      {stage === 'guided' && (
        <div className="teach-content">
          <div className="teach-card glass-card">
            <h4 className="teach-title">🤝 {GUIDED_PROBLEMS[guidedStep].title}</h4>
            <p className="teach-body">Sequence: <strong>{GUIDED_PROBLEMS[guidedStep].seq}</strong></p>

            <div className="formula-calculator" style={{ marginBottom: 10 }}>
              <div className="calc-formula-display" style={{ fontSize: '1rem' }}>
                T<sub>{GUIDED_PROBLEMS[guidedStep].n}</sub> = <span className="calc-a">{guidedInputs.a || 'a'}</span> + (<span className="calc-n">{GUIDED_PROBLEMS[guidedStep].n}</span> − 1) × <span className="calc-d">{guidedInputs.d || 'd'}</span>
              </div>
            </div>

            <div className="scaffolding-box">
              <h5 className="scaffolding-title">📋 Follow along:</h5>
              {GUIDED_PROBLEMS[guidedStep].steps.map((step, i) => (
                <div key={i} className="scaffolding-step">
                  <span className="scaff-check">✦</span>
                  <span className="scaff-text">{step}</span>
                </div>
              ))}
            </div>

            <div className="teach-answer-row">
              <input
                type="number"
                value={guidedInputs.result}
                onChange={(e) => setGuidedInputs({ ...guidedInputs, result: e.target.value })}
                placeholder={`T_${GUIDED_PROBLEMS[guidedStep].n} = ?`}
                className="teach-input"
              />
              <button className="btn btn-primary" onClick={checkGuided} disabled={!guidedInputs.result}>
                Check ✓
              </button>
            </div>

            {guidedFeedback && (
              <div className={`teach-feedback ${guidedFeedback.type}`}>{guidedFeedback.text}</div>
            )}
          </div>
        </div>
      )}

      {/* ─── PRACTICE STAGE ─── */}
      {stage === 'practice' && (
        <div className="teach-content">
          <div className="teach-card glass-card">
            <h4 className="teach-title">💪 Free Practice #{practiceRound + 1}</h4>
            <p className="teach-body">{PRACTICE[practiceRound].question}</p>

            <div className="teach-tip-box">
              💡 Formula: T_n = a + (n − 1) × d. Identify a and d from the sequence first!
            </div>

            <div className="teach-answer-row">
              <input
                type="number"
                value={practiceAnswer}
                onChange={(e) => setPracticeAnswer(e.target.value)}
                placeholder={`T_${PRACTICE[practiceRound].n} = ?`}
                className="teach-input"
              />
              <button className="btn btn-primary" onClick={checkPractice} disabled={!practiceAnswer}>
                Submit ✓
              </button>
            </div>

            {practiceFeedback && (
              <div className={`teach-feedback ${practiceFeedback.type}`}>{practiceFeedback.text}</div>
            )}
          </div>
        </div>
      )}

      {/* ─── COMPLETE ─── */}
      {stage === 'complete' && (
        <div className="teach-content">
          <div className="station-success anim-bounce-in" style={{ maxWidth: 520, margin: '20px auto' }}>
            <span className="success-icon" style={{ fontSize: '3rem' }}>📜</span>
            <h4 className="teach-title" style={{ color: '#4ade80' }}>Station B Complete!</h4>
            <p className="station-success-msg">
              You've mastered the <strong>General Term Formula</strong>! T_n = a + (n−1)×d lets you find ANY term instantly.
            </p>
            <div className="teach-summary-box">
              <div className="summary-rule">
                <span className="rule-icon">📜</span>
                <span>Formula: T_n = a + (n − 1) × d</span>
              </div>
              <div className="summary-rule">
                <span className="rule-icon">🚀</span>
                <span>Best when the gap is FAR (&gt; 3 steps away)</span>
              </div>
            </div>
            <div className="station-success-actions">
              <button className="btn-green" onClick={onComplete}>Next: Apply Both Tools! →</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
