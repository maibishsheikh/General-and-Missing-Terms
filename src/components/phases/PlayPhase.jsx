// src/components/phases/PlayPhase.jsx
import React, { useState, useEffect, useRef } from 'react';
import './PlayPhase.css';
import QuestionRenderer from '../quiz/QuestionRenderer.jsx';
import BossBattleModal from '../quiz/BossBattleModal.jsx';
import FeedbackOverlay from '../shared/FeedbackOverlay.jsx';
import { useAudio } from '../../hooks/useAudio.js';
import { DISTRICTS } from '../../data/questionBank.js';
import { calcStars } from '../../utils/scoring.js';
import {
  playQuestionNarration,
  playCorrectNarration,
  playWrongNarration,
  playHint1Narration,
  playHint2Narration,
  districtCompleteNarration,
} from '../../utils/narration.js';

export default function PlayPhase({ state, dispatch }) {
  const { narrate, stopAll, sounds } = useAudio(state?.audioEnabled ?? true);
  const [showMap, setShowMap]       = useState(true);
  const [hintsShown, setHintsShown] = useState(0);
  const [showHint, setShowHint]     = useState(false);
  const [showBoss, setShowBoss]     = useState(false);
  const feedbackTimer               = useRef(null);

  const qs = state?.questionSet || [];
  const qIdx = state?.currentQuestion || 0;
  const question = qs[qIdx];
  const distIdx = state?.currentDistrict || 0;
  const district = DISTRICTS[distIdx] || DISTRICTS[0];
  const qInDistrict = qIdx % 10;
  const isPlayDone = state?.phaseComplete?.play;

  // Always show Worlds Board when entering Practice phase
  useEffect(() => {
    setShowMap(true);
  }, []);

  // Narrate question when question changes
  useEffect(() => {
    if (!showMap && !showBoss && question && !state?.showFeedback) {
      const timer = setTimeout(() => {
        narrate(playQuestionNarration(question.questionText));
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [qIdx, showMap, showBoss, narrate, question, state?.showFeedback]);

  // Auto-dismiss popup after 2.2s
  useEffect(() => {
    if (state?.showFeedback) {
      feedbackTimer.current = setTimeout(() => {
        if (state?.showFeedback === 'correct') {
          dispatch({ type: 'CLEAR_FEEDBACK' });
          advanceQuestion();
        } else {
          handleAfterWrong();
        }
      }, 2200);
    }
    return () => {
      if (feedbackTimer.current) clearTimeout(feedbackTimer.current);
    };
  }, [state?.showFeedback]);

  useEffect(() => {
    return () => {
      if (feedbackTimer.current) clearTimeout(feedbackTimer.current);
      stopAll();
    };
  }, [stopAll]);

  function handleAnswer(answer) {
    stopAll();
    const isCorrect = String(answer).trim() === String(question.correctAnswer).trim();

    if (isCorrect) {
      sounds.correct();
      dispatch({ type: 'ANSWER_CORRECT' });
      narrate(playCorrectNarration((state?.streak || 0) + 1));
    } else {
      sounds.wrong();
      dispatch({ type: 'ANSWER_INCORRECT', payload: question.explanation });
      narrate(playWrongNarration());
      setHintsShown(0);
    }
  }

  function advanceQuestion() {
    setHintsShown(0);
    setShowHint(false);
    const nextIdx = qIdx + 1;

    if (nextIdx % 10 === 0 && nextIdx <= 100) {
      sounds.levelUp();
      narrate(districtCompleteNarration());
      dispatch({ type: 'NEXT_QUESTION' });
      setShowMap(true);
    } else {
      dispatch({ type: 'NEXT_QUESTION' });
    }
  }

  function handleShowHint() {
    stopAll();
    dispatch({ type: 'USE_HINT' });
    if (hintsShown === 0) {
      setShowHint(1);
      setHintsShown(1);
      narrate(playHint1Narration());
    } else {
      setShowHint(2);
      setHintsShown(2);
      narrate(playHint2Narration());
    }
  }

  function handleAfterWrong() {
    dispatch({ type: 'CLEAR_FEEDBACK' });
    advanceQuestion();
  }

  function handlePrevQuestion() {
    stopAll();
    dispatch({ type: 'CLEAR_FEEDBACK' });
    dispatch({ type: 'PREV_QUESTION' });
  }

  function handleNextQuestion() {
    stopAll();
    dispatch({ type: 'CLEAR_FEEDBACK' });
    advanceQuestion();
  }

  function startDistrict(idx) {
    setShowMap(false);
    setTimeout(() => narrate(playQuestionNarration(qs[idx * 10]?.questionText || '')), 400);
  }

  // Play done screen
  if (isPlayDone || (qIdx >= 100 && !showMap)) {
    const totalCorrect = state?.districtCorrect?.reduce((s, c) => s + (c || 0), 0) || 0;
    return (
      <div className="play-done-wrap">
        <div className="play-done-card glass-card anim-bounce-in">
          <div className="play-done-icon">🏆</div>
          <h2 className="play-done-title headline">Practice Phase Complete!</h2>
          <div className="play-done-stats">
            <div className="stat-pill"><span>✅</span><span>{totalCorrect}/100 Correct</span></div>
            <div className="stat-pill"><span>⭐</span><span>{state?.xp || 0} XP Earned</span></div>
            <div className="stat-pill"><span>🔥</span><span>Best Streak: {state?.maxStreak || 0}</span></div>
          </div>
          <button className="btn-primary play-done-cta" onClick={() => dispatch({ type: 'SET_PHASE', payload: 'reflect' })}>
            🌟 Go to Reflect Phase
          </button>
        </div>
      </div>
    );
  }

  // District Map Screen (Worlds Board matching reference image)
  if (showMap) {
    const isAllDone = qIdx >= 100;
    const totalStars = (state?.districtScores || []).reduce(
      (acc, sc) => acc + (sc !== null && sc !== undefined ? calcStars(sc) : 0),
      0
    );

    function handlePlayWorld(idx) {
      sounds.click();
      dispatch({ type: 'SELECT_DISTRICT', payload: idx });
      setShowMap(false);
    }

    return (
      <div className="play-map-wrap">
        <div className="worlds-board-card">
          {/* Top Notch Pill */}
          <div className="worlds-card-notch" />

          {/* Header Row: Title & Subtitle on Left, Stars on Right */}
          <div className="worlds-card-header">
            <div className="worlds-title-group">
              <h2 className="worlds-title">ScrollQuest Game Worlds</h2>
              <p className="worlds-subtitle">
                10 Themed Worlds · Need 4/10 Correct to Unlock Next World
              </p>
            </div>

            <div className="worlds-stars-pill">
              <span className="star-icon">⭐</span>
              <span className="star-count">{totalStars} / 30</span>
            </div>
          </div>

          {/* 10 Worlds Grid (5 columns x 2 rows) */}
          {/* 10 Worlds Grid (5 columns x 2 rows) */}
          <div className="worlds-grid">
            {DISTRICTS.map((dist, idx) => {
              const isCurrent = idx === distIdx;
              const isCompleted = state?.districtScores?.[idx] !== null && state?.districtScores?.[idx] !== undefined;
              const prevCorrect = idx > 0 ? (state?.districtCorrect?.[idx - 1] || 0) : 10;
              const isUnlocked = idx === 0 || idx <= distIdx || prevCorrect >= 4 || isCompleted;
              const qStart = idx * 10 + 1;
              const qEnd = (idx + 1) * 10;

              return (
                <div
                  key={dist.id}
                  className={`world-card ${isCurrent ? 'active' : ''} ${!isUnlocked ? 'locked' : ''} ${isCompleted ? 'completed' : ''}`}
                  onClick={() => isUnlocked && handlePlayWorld(idx)}
                  role="button"
                  tabIndex={isUnlocked ? 0 : -1}
                  aria-label={`${dist.name} ${isUnlocked ? 'Play' : 'Locked'}`}
                >
                  <div className="world-card-top">
                    <span className="world-badge-w">W{idx + 1}</span>
                    <span className="world-badge-q">Q{qStart}–{qEnd}</span>
                  </div>

                  <div className="world-card-center">
                    {isUnlocked ? (
                      <div className="world-target-icon">
                        <svg width="28" height="28" viewBox="0 0 36 36" fill="none">
                          <circle cx="18" cy="18" r="13" stroke="#00e5a3" strokeWidth="2.4" />
                          <circle cx="18" cy="18" r="7.5" stroke="#00e5a3" strokeWidth="2.4" />
                          <circle cx="18" cy="18" r="2.8" fill="#00e5a3" />
                        </svg>
                      </div>
                    ) : (
                      <div className="world-lock-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                          <path d="M7 10V7C7 4.23858 9.23858 2 12 2C14.7614 2 17 4.23858 17 7V10" stroke="#94a3b8" strokeWidth="2.2" strokeLinecap="round" />
                          <rect x="4" y="9.5" width="16" height="12.5" rx="3.5" fill="#f59e0b" />
                          <circle cx="12" cy="15" r="1.4" fill="#78350f" />
                          <path d="M12 16.4V18.2" stroke="#78350f" strokeWidth="1.4" strokeLinecap="round" />
                        </svg>
                      </div>
                    )}
                    <span className="world-name">{dist.name}</span>
                  </div>

                  <div className="world-card-bottom">
                    {isUnlocked ? (
                      <span className="world-action-play">Play →</span>
                    ) : (
                      <span className="world-action-locked">Locked</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Action Buttons */}
          <div className="worlds-card-footer">
            <button
              className="btn-boss-battle"
              onClick={() => setShowBoss(true)}
            >
              <span className="btn-icon">👑</span> Boss Battle: {district.boss?.name || 'The Definition Keeper'}
            </button>

            <button
              className="btn-jump-reflect"
              onClick={() => dispatch({ type: 'SET_PHASE', payload: 'reflect' })}
            >
              <span className="btn-icon">🗂️</span> Jump to Reflect Phase →
            </button>
          </div>
        </div>

        {/* Boss Battle Modal from map */}
        {showBoss && (
          <BossBattleModal
            boss={district.boss}
            questions={qs.slice(distIdx * 10, distIdx * 10 + 5)}
            onWin={() => {
              setShowBoss(false);
              dispatch({ type: 'UNLOCK_BADGE', payload: 'boss_slayer' });
            }}
            onClose={() => setShowBoss(false)}
            audioEnabled={state?.audioEnabled}
          />
        )}
      </div>
    );
  }

  return (
    <div className="play-wrap">
      {/* Sleek Compact Top Bar: Topic Badge + HUD + Progress in one row */}
      <div className="play-top-bar">
        <div className="play-topic-compact">
          <span className="topic-name">
            <span className="topic-icon">{district.icon}</span> W{distIdx + 1}: {district.name}
          </span>
          <button
            className="topic-mini-btn"
            onClick={() => setShowBoss(true)}
            title="Challenge World Boss"
          >
            👑 Boss
          </button>
          <button
            className="topic-mini-btn"
            onClick={() => setShowMap(true)}
            title="View World Map"
          >
            🗺️ Map
          </button>
        </div>

        <div className="play-hud-compact">
          <span className="hud-pill-mini">⭐ {state?.xp || 0}</span>
          <span className="hud-pill-mini">🔥 {state?.streak || 0}x</span>
          <span className="hud-pill-mini q-num">Q {qInDistrict + 1}/10</span>
        </div>
      </div>

      {/* Question Progress Mini Line */}
      <div className="play-progress-line">
        <div className="play-progress-fill" style={{ width: `${((qInDistrict + 1) / 10) * 100}%` }} />
      </div>

      {/* Question Renderer */}
      {question && (
        <div className="play-question-area">
          <QuestionRenderer
            question={question}
            onAnswer={handleAnswer}
            hintsShown={hintsShown}
            showHint={showHint}
            onHint={handleShowHint}
            isLocked={state?.showFeedback === 'correct'}
            onPrev={handlePrevQuestion}
            onNext={handleNextQuestion}
            canPrev={qInDistrict > 0}
          />
        </div>
      )}

      {/* Boss Battle Modal */}
      {showBoss && (
        <BossBattleModal
          boss={district.boss}
          questions={qs.slice(distIdx * 10, distIdx * 10 + 5)}
          onWin={() => {
            setShowBoss(false);
            dispatch({ type: 'UNLOCK_BADGE', payload: 'boss_slayer' });
          }}
          onClose={() => setShowBoss(false)}
          audioEnabled={state?.audioEnabled}
        />
      )}

      {/* Feedback Overlay */}
      {state?.showFeedback && (
        <FeedbackOverlay
          isCorrect={state?.showFeedback === 'correct'}
          explanation={question?.explanation}
          onContinue={state?.showFeedback === 'correct' ? () => { dispatch({ type: 'CLEAR_FEEDBACK' }); advanceQuestion(); } : handleAfterWrong}
        />
      )}
    </div>
  );
}
