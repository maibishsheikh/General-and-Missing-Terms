// src/components/simulations/TheForgersFakeRestoration.jsx
// Station D: "The Scroll Restoration" — Full simulation applying ALL skills
// Progressive: Real-world scenario → Multi-gap artifact → Error detection
// Grand finale combining everything learned in Stations A, B, C

import React, { useState } from 'react';
import './Stations.css';
import { useAudio } from '../../hooks/useAudio.js';
import { EFFICIENCY_THRESHOLD } from '../../utils/restorationMath.js';

export default function TheForgersFakeRestoration({ onComplete, audioEnabled }) {
  const { narrate, stopAll, sounds } = useAudio(audioEnabled);

  const [stage, setStage] = useState('briefing');
  const [gapIdx, setGapIdx] = useState(0);
  const [selectedTool, setSelectedTool] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [crossVerify, setCrossVerify] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [restored, setRestored] = useState([false, false, false]);
  const [errorAnswer, setErrorAnswer] = useState(null);
  const [errorFeedback, setErrorFeedback] = useState(null);

  // The ancient scroll: a=4, d=5
  // Known terms: T1=4, T2=9, T3=14, T5=24
  // Missing: T4=19, T8=39, T30=149
  const scroll = {
    a: 4, d: 5,
    title: 'The Grand Archive\'s Ancient Number Scroll',
    context: 'Kavya and Hafiz discovered a damaged scroll in the Grand Archive. The sequence starts: 4, 9, 14, ?, 24, ... with several entries missing. Use EVERYTHING you\'ve learned to restore it!',
  };

  const GAPS = [
    {
      id: 0,
      title: 'Gap 1: Position 4 (Easy — Near Gap)',
      gapPos: 4,
      answer: 19,
      stepsFromNearest: 1,
      nearestKnown: { pos: 3, val: 14 },
      bestTool: 'term-to-term',
      explanation: 'Position 4 is just 1 step from position 3 (value 14). Add d=+5: 14 + 5 = 19.',
      ttCalc: '14 + 5 = 19',
      gtCalc: 'T_4 = 4 + (4−1)×5 = 4 + 15 = 19',
      icon: '🟢',
      difficulty: 'Easy',
    },
    {
      id: 1,
      title: 'Gap 2: Position 8 (Medium — Far Gap)',
      gapPos: 8,
      answer: 39,
      stepsFromNearest: 3,
      nearestKnown: { pos: 5, val: 24 },
      bestTool: 'general-term',
      explanation: 'Position 8 is 3 steps from position 5. Right at the boundary! The formula is safer: T_8 = 4 + 7×5 = 39.',
      ttCalc: '24 + 5 + 5 + 5 = 39',
      gtCalc: 'T_8 = 4 + (8−1)×5 = 4 + 35 = 39',
      icon: '🟡',
      difficulty: 'Medium',
    },
    {
      id: 2,
      title: 'Gap 3: Position 30 (Hard — Very Far Gap)',
      gapPos: 30,
      answer: 149,
      stepsFromNearest: 22,
      nearestKnown: { pos: 8, val: 39 },
      bestTool: 'general-term',
      explanation: 'Position 30 is 22 steps from the nearest known! Only the formula works here: T_30 = 4 + 29×5 = 149.',
      ttCalc: '39 + 5×22 = 39 + 110 = 149 (22 jumps!)',
      gtCalc: 'T_30 = 4 + (30−1)×5 = 4 + 145 = 149',
      icon: '🔴',
      difficulty: 'Hard',
    },
  ];

  // Error detection: fake restoration to evaluate
  const FAKE_RESTORATION = {
    claim: 'A student claims that T_15 = 79 because they calculated: T_15 = 4 + 15 × 5 = 4 + 75 = 79',
    error: 'They used n instead of (n−1)! Correct: T_15 = 4 + (15−1)×5 = 4 + 70 = 74',
    correctAnswer: 74,
    wrongAnswer: 79,
    options: [
      { text: 'T_15 = 74 — They forgot to subtract 1 from n. Correct: 4 + (15−1)×5 = 74', correct: true },
      { text: 'T_15 = 79 — Their calculation is correct', correct: false },
      { text: 'T_15 = 80 — They should have used 16 instead of 15', correct: false },
    ],
  };

  function submitGap() {
    stopAll();
    const gap = GAPS[gapIdx];
    const num = Number(userAnswer.trim());
    const crossNum = crossVerify.trim() ? Number(crossVerify.trim()) : null;

    if (!selectedTool) { sounds.wrong(); setFeedback({ type: 'error', text: '⚠️ Choose a tool first!' }); return; }
    if (isNaN(num) || userAnswer.trim() === '') { sounds.wrong(); setFeedback({ type: 'error', text: '⚠️ Enter your answer!' }); return; }

    const isToolRight = selectedTool === gap.bestTool;
    const isValRight = num === gap.answer;
    const isCrossRight = crossNum === null || crossNum === gap.answer;

    if (isValRight && isToolRight && isCrossRight) {
      sounds.correct();
      const newRestored = [...restored];
      newRestored[gapIdx] = true;
      setRestored(newRestored);
      setFeedback({ type: 'success', text: `🎉 ${gap.explanation}` });

      if (crossNum !== null) {
        narrate([{ text: 'Cross-verification confirmed! Both methods agree!', style: 'celebration' }]);
      }

      setTimeout(() => {
        if (gapIdx + 1 < GAPS.length) {
          setGapIdx(i => i + 1);
          resetInputs();
        } else {
          setStage('error-detection');
          resetInputs();
        }
      }, 1800);
    } else if (isValRight && !isToolRight) {
      sounds.wrong();
      setFeedback({
        type: 'error',
        text: `Correct value! But position ${gap.gapPos} is ${gap.stepsFromNearest} step(s) away. ${gap.bestTool === 'term-to-term' ? 'Term-to-Term' : 'Formula'} is better here!`,
      });
    } else {
      sounds.wrong();
      setFeedback({ type: 'error', text: `❌ Hint: From position ${gap.nearestKnown.pos} (value ${gap.nearestKnown.val}), the gap at position ${gap.gapPos} is ${gap.stepsFromNearest} step(s) away. d = +${scroll.d}.` });
    }
  }

  function submitErrorDetection(option) {
    stopAll();
    if (option.correct) {
      sounds.correct();
      setErrorAnswer(option);
      setErrorFeedback({ type: 'success', text: `🕵️ Correct! ${FAKE_RESTORATION.error}` });
      narrate([{ text: 'Brilliant! You caught the classic n vs n-1 error!', style: 'celebration' }]);
      setTimeout(() => setStage('complete'), 2000);
    } else {
      sounds.wrong();
      setErrorFeedback({ type: 'error', text: '❌ Look carefully: did they use n or (n−1) in the formula?' });
    }
  }

  function resetInputs() {
    setSelectedTool(null);
    setUserAnswer('');
    setCrossVerify('');
    setFeedback(null);
  }

  return (
    <div className="station-wrap sim-teaching-station">
      <div className="station-header">
        <h3 className="station-title">📜 Station D: The Scroll Restoration</h3>
        <div className="station-target-box">
          <span className="station-target-label">
            {stage === 'briefing' ? 'Briefing' : stage === 'restore' ? 'Restoring' : stage === 'error-detection' ? 'Error Check' : 'Complete'}
          </span>
          <span className="station-target-num">
            {stage === 'restore' ? `${gapIdx + 1}/${GAPS.length}` : stage === 'error-detection' ? 'Final' : ''}
          </span>
        </div>
      </div>

      <div className="sim-teach-progress">
        <div className="sim-teach-progress-track">
          {['briefing', 'restore', 'error-detection', 'complete'].map((s, i) => (
            <div key={s} className={`progress-segment ${s === stage ? 'current' : ['briefing', 'restore', 'error-detection', 'complete'].indexOf(stage) > i ? 'done' : ''}`}>
              <span className="segment-label">{['📋 Brief', '🏺 Restore', '🔍 Inspect', '🏆 Done'][i]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ─── BRIEFING ─── */}
      {stage === 'briefing' && (
        <div className="teach-content">
          <div className="teach-card glass-card">
            <h4 className="teach-title">📋 Mission Briefing</h4>
            <p className="teach-body">{scroll.context}</p>

            <div className="teach-sequence-area">
              <h5 style={{ color: '#feca57', margin: '0 0 8px', fontWeight: 800 }}>The Damaged Scroll:</h5>
              <div className="teach-number-line">
                {[
                  { pos: 1, val: 4 }, { pos: 2, val: 9 }, { pos: 3, val: 14 },
                  { pos: 4, val: null }, { pos: 5, val: 24 },
                ].map(t => (
                  <div key={t.pos} className={`teach-tile ${t.val === null ? 'gap' : 'revealed'}`}>
                    <span className="teach-pos-label">n={t.pos}</span>
                    <div className={`teach-tile-box ${t.val === null ? 'gap-box' : ''}`}>
                      <span className="teach-tile-val">{t.val !== null ? t.val : '?'}</span>
                    </div>
                  </div>
                ))}
              </div>
              <p style={{ color: '#a0a0b8', fontSize: '0.88rem', textAlign: 'center', marginTop: 8 }}>
                Also missing: positions <strong>8</strong> and <strong>30</strong>
              </p>
            </div>

            <div className="teach-summary-box">
              <div className="summary-rule"><span className="rule-icon">📏</span><span>a = {scroll.a} (first term), d = +{scroll.d} (common difference)</span></div>
              <div className="summary-rule"><span className="rule-icon">🎯</span><span>Restore 3 gaps using the right tool for each</span></div>
              <div className="summary-rule"><span className="rule-icon">🔍</span><span>Then detect an error in a fake restoration</span></div>
            </div>

            <div className="teach-nav">
              <button className="btn btn-primary btn-lg" onClick={() => { sounds.click(); setStage('restore'); }}>
                🏺 Begin Restoration!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── RESTORE ─── */}
      {stage === 'restore' && (
        <div className="teach-content">
          <div className="teach-card glass-card">
            <h4 className="teach-title">{GAPS[gapIdx].icon} {GAPS[gapIdx].title}</h4>

            {/* Scroll progress indicator */}
            <div className="scroll-progress-bar">
              {GAPS.map((g, i) => (
                <div key={i} className={`scroll-gap-indicator ${restored[i] ? 'restored' : i === gapIdx ? 'active' : ''}`}>
                  <span className="sgi-icon">{restored[i] ? '✅' : g.icon}</span>
                  <span className="sgi-label">n={g.gapPos}</span>
                </div>
              ))}
            </div>

            {/* Key info */}
            <div className="distance-indicator">
              <span className="dist-text">
                Gap at <strong>n={GAPS[gapIdx].gapPos}</strong> is <strong>{GAPS[gapIdx].stepsFromNearest} step(s)</strong> from n={GAPS[gapIdx].nearestKnown.pos} (value {GAPS[gapIdx].nearestKnown.val})
              </span>
              <span className={`dist-badge ${GAPS[gapIdx].stepsFromNearest <= EFFICIENCY_THRESHOLD ? 'near' : 'far'}`}>
                {GAPS[gapIdx].stepsFromNearest <= EFFICIENCY_THRESHOLD ? '⚡ NEAR' : '📜 FAR'}
              </span>
            </div>

            <div className="teach-tip-box">
              💡 Remember: a = {scroll.a}, d = +{scroll.d}. Choose the right tool based on how far the gap is!
            </div>

            {/* Tool Selection */}
            <div className="tool-select-grid" style={{ marginBottom: 8 }}>
              <button className={`tool-card-btn ${selectedTool === 'term-to-term' ? 'active-tool' : ''}`}
                onClick={() => { sounds.click(); setSelectedTool('term-to-term'); }}>
                <span className="tool-card-icon">🖌️</span>
                <span className="tool-card-name">Term-to-Term</span>
                <span className="tool-card-desc">Best for ≤ 3 steps</span>
              </button>
              <button className={`tool-card-btn ${selectedTool === 'general-term' ? 'active-tool' : ''}`}
                onClick={() => { sounds.click(); setSelectedTool('general-term'); }}>
                <span className="tool-card-icon">📜</span>
                <span className="tool-card-name">General Term</span>
                <span className="tool-card-desc">Best for &gt; 3 steps</span>
              </button>
            </div>

            <div className="teach-answer-row">
              <input type="number" value={userAnswer} onChange={(e) => setUserAnswer(e.target.value)}
                placeholder={`T_${GAPS[gapIdx].gapPos} = ?`} className="teach-input" />
              <input type="number" value={crossVerify} onChange={(e) => setCrossVerify(e.target.value)}
                placeholder="Cross-verify (optional)" className="teach-input" style={{ maxWidth: 160 }} />
              <button className="btn btn-primary" onClick={submitGap} disabled={!userAnswer}>🏺 Restore</button>
            </div>

            {feedback && (
              <div className={`teach-feedback ${feedback.type}`}>{feedback.text}</div>
            )}
          </div>
        </div>
      )}

      {/* ─── ERROR DETECTION ─── */}
      {stage === 'error-detection' && (
        <div className="teach-content">
          <div className="teach-card glass-card">
            <h4 className="teach-title">🔍 Bonus: Spot the Error!</h4>
            <p className="teach-body">All 3 gaps restored! But before the scroll is certified, check this student's work:</p>

            <div className="error-claim-box">
              <h5 className="error-claim-title">📝 Student's Claim:</h5>
              <p className="error-claim-text">"{FAKE_RESTORATION.claim}"</p>
            </div>

            <div className="correction-options-list">
              {FAKE_RESTORATION.options.map((opt, i) => (
                <button key={i}
                  className={`btn-correction ${errorAnswer?.text === opt.text ? (opt.correct ? 'fix-correct' : 'fix-wrong') : ''}`}
                  onClick={() => submitErrorDetection(opt)}
                  disabled={errorAnswer?.correct}>
                  <span className="fix-icon">⚖️</span>
                  <span className="fix-text">{opt.text}</span>
                </button>
              ))}
            </div>

            {errorFeedback && (
              <div className={`teach-feedback ${errorFeedback.type}`}>{errorFeedback.text}</div>
            )}
          </div>
        </div>
      )}

      {/* ─── COMPLETE ─── */}
      {stage === 'complete' && (
        <div className="teach-content">
          <div className="station-success anim-bounce-in" style={{ maxWidth: 560, margin: '20px auto' }}>
            <span className="success-icon" style={{ fontSize: '3rem' }}>🏆</span>
            <h4 className="teach-title" style={{ color: '#fcd34d' }}>All Stations Complete!</h4>
            <p className="station-success-msg">
              You've completed the full Simulation Phase! You learned to:
            </p>
            <div className="teach-summary-box">
              <div className="summary-rule"><span className="rule-icon">🖌️</span><span>Station A: Find d and step term-to-term</span></div>
              <div className="summary-rule"><span className="rule-icon">📜</span><span>Station B: Use T_n = a + (n−1)×d for far gaps</span></div>
              <div className="summary-rule"><span className="rule-icon">⚡</span><span>Station C: Choose the right tool (≤3 = step, &gt;3 = formula)</span></div>
              <div className="summary-rule"><span className="rule-icon">🔍</span><span>Station D: Apply all skills & detect errors</span></div>
            </div>
            <div className="station-success-actions">
              <button className="btn-green" onClick={onComplete}>Ready for Practice! 🎮</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
