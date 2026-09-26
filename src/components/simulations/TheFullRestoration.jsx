// src/components/simulations/TheFullRestoration.jsx
// Station C: "The Tool Workshop" — APPLY both tools & learn to choose
// Progressive: Visual comparison → Tool selector challenges → Cross-verification
// Builds on A+B: now students decide WHICH tool to use

import React, { useState } from 'react';
import './Stations.css';
import { useAudio } from '../../hooks/useAudio.js';
import { EFFICIENCY_THRESHOLD } from '../../utils/restorationMath.js';

export default function TheFullRestoration({ onComplete, audioEnabled }) {
  const { narrate, stopAll, sounds } = useAudio(audioEnabled);

  const [stage, setStage] = useState('learn');
  const [learnStep, setLearnStep] = useState(0);
  const [challengeIdx, setChallengeIdx] = useState(0);
  const [selectedTool, setSelectedTool] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [crossVerifyAnswer, setCrossVerifyAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [showWorking, setShowWorking] = useState(false);

  const LEARN_SLIDES = [
    {
      title: '🤔 Which Tool Should I Use?',
      body: 'You now know TWO powerful tools. But how do you decide which one to reach for? Let\'s learn the Guild\'s Sacred Efficiency Rule!',
      visual: 'intro',
    },
    {
      title: '📏 Count the Steps!',
      body: 'The key is: HOW FAR is the gap from the nearest known number? Count the positions between them.',
      visual: 'counting',
    },
    {
      title: '⚡ The 3-Step Rule',
      body: `If the gap is ≤ ${EFFICIENCY_THRESHOLD} steps away → Term-to-Term is faster!\nIf the gap is > ${EFFICIENCY_THRESHOLD} steps away → General Term Formula is faster!`,
      visual: 'rule',
    },
    {
      title: '🔄 Cross-Verification: The Safety Net',
      body: 'A true archaeologist ALWAYS double-checks! After finding your answer with one tool, verify it with the OTHER tool. If both methods give the same number, you can be confident it\'s correct!',
      visual: 'crossverify',
    },
  ];

  const CHALLENGES = [
    {
      title: 'Challenge 1: Near Gap',
      seq: [10, 14, 18, null, 26],
      positions: [1, 2, 3, 4, 5],
      gapPos: 4, a: 10, d: 4,
      answer: 22,
      nearestKnown: 3, nearestVal: 18,
      stepsAway: 1,
      bestTool: 'term-to-term',
      ttWorking: '18 + 4 = 22',
      gtWorking: 'T_4 = 10 + (4−1)×4 = 10 + 12 = 22',
      explanation: 'Position 4 is just 1 step from position 3. Term-to-Term is perfect: 18 + 4 = 22!',
    },
    {
      title: 'Challenge 2: Far Gap',
      seq: [3, 8, 13, 18],
      positions: [1, 2, 3, 4],
      gapPos: 20, a: 3, d: 5,
      answer: 98,
      nearestKnown: 4, nearestVal: 18,
      stepsAway: 16,
      bestTool: 'general-term',
      ttWorking: '18 + 5 + 5 + ... (16 times!) = too many steps!',
      gtWorking: 'T_20 = 3 + (20−1)×5 = 3 + 95 = 98',
      explanation: 'Position 20 is 16 steps from position 4. Way too far for stepping! Formula: T_20 = 3 + 19×5 = 98.',
    },
    {
      title: 'Challenge 3: Backward Gap',
      seq: [null, 15, 21, 27, 33],
      positions: [1, 2, 3, 4, 5],
      gapPos: 1, a: 9, d: 6,
      answer: 9,
      nearestKnown: 2, nearestVal: 15,
      stepsAway: 1,
      bestTool: 'term-to-term',
      ttWorking: '15 − 6 = 9 (step backward!)',
      gtWorking: 'T_1 = a = 9 (or: T_1 = 9 + (1−1)×6 = 9)',
      explanation: 'Position 1 is 1 step back from position 2. Subtract d: 15 − 6 = 9. Remember: backward = subtract!',
    },
    {
      title: 'Challenge 4: Cross-Verify!',
      seq: [5, 11, 17, 23],
      positions: [1, 2, 3, 4],
      gapPos: 10, a: 5, d: 6,
      answer: 59,
      nearestKnown: 4, nearestVal: 23,
      stepsAway: 6,
      bestTool: 'general-term',
      ttWorking: '23 + 6×6 = 23 + 36 = 59',
      gtWorking: 'T_10 = 5 + (10−1)×6 = 5 + 54 = 59',
      explanation: 'Position 10 is 6 steps from position 4. Formula gives T_10 = 5 + 54 = 59. Cross-check: 23 + 36 = 59 ✓',
      requiresCrossVerify: true,
    },
  ];

  function advanceLearn() {
    sounds.click();
    if (learnStep < LEARN_SLIDES.length - 1) {
      setLearnStep(s => s + 1);
    } else {
      setStage('challenge');
      narrate([{ text: 'Time to put your tool selection skills to the test!', style: 'celebration' }]);
    }
  }

  function submitChallenge() {
    stopAll();
    const ch = CHALLENGES[challengeIdx];
    const num = Number(userAnswer.trim());

    if (!selectedTool) {
      sounds.wrong();
      setFeedback({ type: 'error', text: '⚠️ First, choose which tool you want to use!' });
      return;
    }
    if (isNaN(num) || userAnswer.trim() === '') {
      sounds.wrong();
      setFeedback({ type: 'error', text: '⚠️ Enter your answer!' });
      return;
    }

    // Check cross-verify if required
    if (ch.requiresCrossVerify && (!crossVerifyAnswer || crossVerifyAnswer.trim() === '')) {
      sounds.wrong();
      setFeedback({ type: 'error', text: '⚠️ This challenge requires cross-verification! Enter the answer using the other method too.' });
      return;
    }

    const isToolCorrect = selectedTool === ch.bestTool;
    const isValueCorrect = num === ch.answer;
    const isCrossCorrect = !ch.requiresCrossVerify || Number(crossVerifyAnswer.trim()) === ch.answer;

    if (isValueCorrect && isToolCorrect && isCrossCorrect) {
      sounds.correct();
      setFeedback({ type: 'success', text: `🎉 Perfect! ${ch.explanation}` });
      setShowWorking(true);
      narrate([{ text: 'Excellent tool selection and calculation!', style: 'celebration' }]);

      setTimeout(() => {
        if (challengeIdx + 1 < CHALLENGES.length) {
          setChallengeIdx(i => i + 1);
          resetChallenge();
        } else {
          setStage('complete');
        }
      }, 2000);
    } else if (isValueCorrect && !isToolCorrect) {
      sounds.wrong();
      setFeedback({
        type: 'error',
        text: `Value correct (${ch.answer})! But ${ch.stepsAway} step(s) away means ${ch.bestTool === 'term-to-term' ? 'Term-to-Term (≤3)' : 'General Term (>3)'} is more efficient!`,
      });
    } else {
      sounds.wrong();
      setFeedback({ type: 'error', text: `❌ Not quite! The gap at position ${ch.gapPos} is ${ch.stepsAway} step(s) from position ${ch.nearestKnown} (value ${ch.nearestVal}). Try again!` });
    }
  }

  function resetChallenge() {
    setSelectedTool(null);
    setUserAnswer('');
    setCrossVerifyAnswer('');
    setFeedback(null);
    setShowWorking(false);
  }

  const slide = LEARN_SLIDES[learnStep];

  return (
    <div className="station-wrap sim-teaching-station">
      <div className="station-header">
        <h3 className="station-title">🏛️ Station C: The Tool Workshop</h3>
        <div className="station-target-box">
          <span className="station-target-label">{stage === 'learn' ? 'Learning' : stage === 'challenge' ? 'Challenge' : 'Complete'}</span>
          <span className="station-target-num">
            {stage === 'learn' ? `${learnStep + 1}/${LEARN_SLIDES.length}` :
             stage === 'challenge' ? `${challengeIdx + 1}/${CHALLENGES.length}` : '✅'}
          </span>
        </div>
      </div>

      <div className="sim-teach-progress">
        <div className="sim-teach-progress-track">
          {['learn', 'challenge', 'complete'].map((s, i) => (
            <div key={s} className={`progress-segment ${s === stage ? 'current' : ['learn', 'challenge', 'complete'].indexOf(stage) > i ? 'done' : ''}`}>
              <span className="segment-label">{['📖 Learn', '⚔️ Challenges', '🏆 Done'][i]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ─── LEARN ─── */}
      {stage === 'learn' && (
        <div className="teach-content">
          <div className="teach-card glass-card">
            <h4 className="teach-title">{slide.title}</h4>
            <p className="teach-body" style={{ whiteSpace: 'pre-line' }}>{slide.body}</p>

            {slide.visual === 'counting' && (
              <div className="formula-visual-box">
                <div className="counting-demo">
                  <div className="count-seq">
                    {[5, 9, 13, null, null, null, null, null].map((v, i) => (
                      <div key={i} className={`count-tile ${v === null ? 'unknown' : 'known'}`}>
                        <span className="count-pos">n={i + 1}</span>
                        <span className="count-val">{v !== null ? v : '?'}</span>
                      </div>
                    ))}
                  </div>
                  <div className="count-arrows-display">
                    <div className="count-near">
                      <span>n=4 → 1 step from n=3 ⚡ <strong>NEAR!</strong></span>
                    </div>
                    <div className="count-far">
                      <span>n=8 → 5 steps from n=3 📜 <strong>FAR!</strong></span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {slide.visual === 'rule' && (
              <div className="formula-visual-box">
                <div className="rule-comparison">
                  <div className="rule-card near-rule">
                    <span className="rule-emoji">🖌️⚡</span>
                    <h5 className="rule-name">≤ 3 Steps = Term-to-Term</h5>
                    <div className="rule-steps-visual">
                      <span className="step-dot active">●</span>
                      <span className="step-line">—</span>
                      <span className="step-dot active">●</span>
                      <span className="step-line">—</span>
                      <span className="step-dot active">●</span>
                      <span className="step-line dim">—</span>
                      <span className="step-dot target">?</span>
                    </div>
                    <p className="rule-how">Quick jumps: +d, +d, +d → Done!</p>
                  </div>
                  <div className="rule-card far-rule">
                    <span className="rule-emoji">📜🚀</span>
                    <h5 className="rule-name">&gt; 3 Steps = Formula</h5>
                    <div className="rule-steps-visual">
                      <span className="step-dot active">●</span>
                      <span className="step-line dim">—·—·—·—·—·—</span>
                      <span className="step-dot target">?</span>
                    </div>
                    <p className="rule-how">T_n = a + (n−1)×d → One calculation!</p>
                  </div>
                </div>
              </div>
            )}

            {slide.visual === 'crossverify' && (
              <div className="formula-visual-box">
                <div className="crossverify-demo">
                  <div className="cv-flow">
                    <div className="cv-box cv-primary">
                      <span className="cv-label">Method 1</span>
                      <span className="cv-text">Term-to-Term: 18 + 4 = <strong>22</strong></span>
                    </div>
                    <div className="cv-arrow">⟺</div>
                    <div className="cv-box cv-secondary">
                      <span className="cv-label">Method 2</span>
                      <span className="cv-text">Formula: T_4 = 10 + 3×4 = <strong>22</strong></span>
                    </div>
                  </div>
                  <div className="cv-result">
                    <span className="cv-check">✅</span>
                    <span>Both methods give 22 → Answer is CERTIFIED!</span>
                  </div>
                </div>
              </div>
            )}

            <div className="teach-nav">
              {learnStep > 0 && (
                <button className="btn btn-outline btn-sm" onClick={() => { sounds.click(); setLearnStep(s => s - 1); }}>← Back</button>
              )}
              <button className="btn btn-primary btn-sm" onClick={advanceLearn}>
                {learnStep < LEARN_SLIDES.length - 1 ? 'Next →' : 'Start Challenges! ⚔️'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── CHALLENGE ─── */}
      {stage === 'challenge' && (
        <div className="teach-content">
          <div className="teach-card glass-card">
            <h4 className="teach-title">⚔️ {CHALLENGES[challengeIdx].title}</h4>

            {/* Sequence Display */}
            <div className="teach-sequence-area">
              <div className="teach-number-line">
                {CHALLENGES[challengeIdx].seq.map((val, i) => (
                  <div key={i} className={`teach-tile ${val === null ? 'gap' : 'revealed'}`}>
                    <span className="teach-pos-label">n={CHALLENGES[challengeIdx].positions[i]}</span>
                    <div className={`teach-tile-box ${val === null ? 'gap-box' : ''}`}>
                      <span className="teach-tile-val">{val !== null ? val : '?'}</span>
                    </div>
                  </div>
                ))}
                {/* Show far gap separately */}
                {CHALLENGES[challengeIdx].gapPos > CHALLENGES[challengeIdx].positions[CHALLENGES[challengeIdx].positions.length - 1] && (
                  <>
                    <div className="teach-tile" style={{ opacity: 0.3 }}>
                      <span className="teach-pos-label">...</span>
                      <div className="teach-tile-box"><span className="teach-tile-val">···</span></div>
                    </div>
                    <div className="teach-tile gap">
                      <span className="teach-pos-label">n={CHALLENGES[challengeIdx].gapPos}</span>
                      <div className="teach-tile-box gap-box"><span className="teach-tile-val">?</span></div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Distance indicator */}
            <div className="distance-indicator">
              <span className="dist-text">
                Gap at <strong>n={CHALLENGES[challengeIdx].gapPos}</strong> is <strong>{CHALLENGES[challengeIdx].stepsAway} step(s)</strong> from nearest known (n={CHALLENGES[challengeIdx].nearestKnown}, value {CHALLENGES[challengeIdx].nearestVal})
              </span>
              <span className={`dist-badge ${CHALLENGES[challengeIdx].stepsAway <= EFFICIENCY_THRESHOLD ? 'near' : 'far'}`}>
                {CHALLENGES[challengeIdx].stepsAway <= EFFICIENCY_THRESHOLD ? '⚡ NEAR' : '📜 FAR'}
              </span>
            </div>

            {/* Tool Selection */}
            <div className="tool-select-grid" style={{ marginBottom: 10 }}>
              <button className={`tool-card-btn ${selectedTool === 'term-to-term' ? 'active-tool' : ''}`}
                onClick={() => { sounds.click(); setSelectedTool('term-to-term'); }}>
                <span className="tool-card-icon">🖌️</span>
                <span className="tool-card-name">Term-to-Term</span>
              </button>
              <button className={`tool-card-btn ${selectedTool === 'general-term' ? 'active-tool' : ''}`}
                onClick={() => { sounds.click(); setSelectedTool('general-term'); }}>
                <span className="tool-card-icon">📜</span>
                <span className="tool-card-name">General Term Formula</span>
              </button>
            </div>

            {/* Answer + Cross-verify */}
            <div className="teach-answer-row">
              <input type="number" value={userAnswer} onChange={(e) => setUserAnswer(e.target.value)}
                placeholder={`T_${CHALLENGES[challengeIdx].gapPos} = ?`} className="teach-input" />
              {CHALLENGES[challengeIdx].requiresCrossVerify && (
                <input type="number" value={crossVerifyAnswer} onChange={(e) => setCrossVerifyAnswer(e.target.value)}
                  placeholder="Cross-verify..." className="teach-input" style={{ maxWidth: 140 }} />
              )}
              <button className="btn btn-primary" onClick={submitChallenge} disabled={!userAnswer}>Submit ✓</button>
            </div>

            {feedback && (
              <div className={`teach-feedback ${feedback.type}`}>{feedback.text}</div>
            )}

            {showWorking && (
              <div className="working-reveal">
                <div className="working-method">
                  <span className="wm-label">🖌️ Term-to-Term:</span>
                  <span className="wm-calc">{CHALLENGES[challengeIdx].ttWorking}</span>
                </div>
                <div className="working-method">
                  <span className="wm-label">📜 Formula:</span>
                  <span className="wm-calc">{CHALLENGES[challengeIdx].gtWorking}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── COMPLETE ─── */}
      {stage === 'complete' && (
        <div className="teach-content">
          <div className="station-success anim-bounce-in" style={{ maxWidth: 520, margin: '20px auto' }}>
            <span className="success-icon" style={{ fontSize: '3rem' }}>🏛️</span>
            <h4 className="teach-title" style={{ color: '#4ade80' }}>Station C Complete!</h4>
            <p className="station-success-msg">
              You've mastered <strong>Tool Selection</strong> and <strong>Cross-Verification</strong>! You know when to step and when to use the formula.
            </p>
            <div className="teach-summary-box">
              <div className="summary-rule"><span className="rule-icon">⚡</span><span>≤ 3 steps → Term-to-Term</span></div>
              <div className="summary-rule"><span className="rule-icon">🚀</span><span>&gt; 3 steps → General Term Formula</span></div>
              <div className="summary-rule"><span className="rule-icon">🔄</span><span>Always cross-verify with the other method!</span></div>
            </div>
            <div className="station-success-actions">
              <button className="btn-green" onClick={onComplete}>Next: Final Challenge! →</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
