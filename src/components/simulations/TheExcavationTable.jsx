// src/components/simulations/TheExcavationTable.jsx
// Station A: The Excavation Table — Hands-on Archaeological Dig
// Students uncover pottery shards from sand, arrange them, discover the pattern,
// and restore the missing shard by choosing the right method.

import React, { useState, useEffect, useRef } from 'react';
import './Stations.css';
import { useAudio } from '../../hooks/useAudio.js';
import { EFFICIENCY_THRESHOLD, determineEfficientMethod } from '../../utils/restorationMath.js';

// Real-world scenario: A broken mosaic floor tile sequence in an ancient Roman bathhouse
const SCENARIOS = [
  {
    title: 'Roman Bathhouse Floor Mosaic',
    context: 'You discovered a row of mosaic tiles numbered in sequence along a bathhouse corridor. Some tiles are buried under rubble.',
    tiles: [
      { pos: 1, val: 5, found: true },
      { pos: 2, val: 8, found: true },
      { pos: 3, val: 11, found: true },
      { pos: 4, val: null, found: false },
      { pos: 5, val: 17, found: true },
    ],
    a: 5, d: 3, gapPos: 4, answer: 14,
    nearLabel: 'Just 1 step from tile 3 (value 11) — add d once!',
  },
  {
    title: 'Pyramid Chamber Engravings',
    context: 'A pharaoh\'s burial chamber has sequential hieroglyphic counters. Chamber dust obscures one critical number.',
    tiles: [
      { pos: 1, val: 7, found: true },
      { pos: 2, val: 12, found: true },
      { pos: 3, val: 17, found: true },
    ],
    a: 7, d: 5, gapPos: 10, answer: 52,
    nearLabel: 'Position 10 is 7 steps from the nearest known tile! Use the formula.',
  },
];

export default function TheExcavationTable({ onComplete, audioEnabled }) {
  const { narrate, stopAll, sounds } = useAudio(audioEnabled);
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [phase, setPhase] = useState('dig'); // dig | analyze | solve | done
  const [uncoveredTiles, setUncoveredTiles] = useState([]);
  const [selectedTool, setSelectedTool] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [dustParticles, setDustParticles] = useState([]);
  const canvasRef = useRef(null);

  const scenario = SCENARIOS[scenarioIdx];
  const knownPositions = scenario.tiles.filter(t => t.found).map(t => t.pos);
  const efficientTool = determineEfficientMethod(knownPositions, scenario.gapPos);
  const stepsFromNearest = Math.min(
    ...knownPositions.map(p => Math.abs(scenario.gapPos - p))
  );

  // Generate dust particles for dig animation
  useEffect(() => {
    const particles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 8 + 4,
      delay: Math.random() * 2,
    }));
    setDustParticles(particles);
  }, [scenarioIdx]);

  function handleDigTile(tile) {
    if (uncoveredTiles.includes(tile.pos)) return;
    sounds.click();
    setUncoveredTiles(prev => [...prev, tile.pos]);

    // When all found tiles are uncovered, move to analyze
    const foundTiles = scenario.tiles.filter(t => t.found).map(t => t.pos);
    const newUncovered = [...uncoveredTiles, tile.pos];
    if (foundTiles.every(p => newUncovered.includes(p))) {
      setTimeout(() => {
        setPhase('analyze');
        narrate([
          { text: `All visible tiles uncovered! The sequence reads: ${scenario.tiles.filter(t => t.found).map(t => `position ${t.pos} = ${t.val}`).join(', ')}. One tile at position ${scenario.gapPos} is still missing!`, style: 'instruction' },
        ]);
      }, 600);
    }
  }

  function handleToolSelect(tool) {
    sounds.click();
    setSelectedTool(tool);
  }

  function handleSubmit() {
    stopAll();
    const num = Number(userAnswer.trim());

    if (!selectedTool) {
      sounds.wrong();
      setFeedback({ type: 'error', text: 'First, choose your restoration tool!' });
      return;
    }
    if (isNaN(num) || userAnswer.trim() === '') {
      sounds.wrong();
      setFeedback({ type: 'error', text: 'Enter a valid number for the missing tile!' });
      return;
    }

    const isToolCorrect = selectedTool === efficientTool;
    const isValCorrect = num === scenario.answer;

    if (isValCorrect && isToolCorrect) {
      sounds.correct();
      setFeedback({
        type: 'success',
        text: `Perfect! The missing tile at position ${scenario.gapPos} is ${scenario.answer}, and you chose the optimal method!`,
      });
      narrate([{ text: 'Excellent archaeological work! Tile restored with the most efficient tool!', style: 'celebration' }]);

      if (scenarioIdx + 1 < SCENARIOS.length) {
        setTimeout(() => {
          setScenarioIdx(s => s + 1);
          resetRound();
        }, 1500);
      } else {
        setPhase('done');
      }
    } else if (isValCorrect && !isToolCorrect) {
      sounds.wrong();
      setFeedback({
        type: 'error',
        text: `Correct value (${scenario.answer})! But position ${scenario.gapPos} is ${stepsFromNearest} step(s) away — ${efficientTool === 'term-to-term' ? 'Term-to-Term' : 'General Term'} would be faster here.`,
      });
    } else {
      sounds.wrong();
      setFeedback({
        type: 'error',
        text: `Not quite! Hint: ${scenario.nearLabel}`,
      });
    }
  }

  function resetRound() {
    setPhase('dig');
    setUncoveredTiles([]);
    setSelectedTool(null);
    setUserAnswer('');
    setFeedback(null);
  }

  if (phase === 'done') {
    return (
      <div className="station-wrap">
        <div className="station-success anim-bounce-in" style={{ maxWidth: 520, margin: '40px auto' }}>
          <span className="success-icon" style={{ fontSize: '3rem' }}>🏺</span>
          <p className="station-success-msg">
            All excavation scenarios complete! You identified the pattern, chose the right restoration tool for near and far gaps, and restored every missing tile!
          </p>
          <div className="station-success-actions">
            <button className="btn-green" onClick={onComplete}>Complete Station ✓</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="station-wrap">
      {/* Header */}
      <div className="station-header">
        <h3 className="station-title">🏺 Station A: The Excavation Table</h3>
        <div className="station-target-box">
          <span className="station-target-label">Dig Site {scenarioIdx + 1}/{SCENARIOS.length}</span>
          <span className="station-target-num">{scenario.title}</span>
        </div>
      </div>

      {/* Context Story */}
      <div className="sim-story-banner">
        <span className="sim-story-icon">📜</span>
        <p className="sim-story-text">{scenario.context}</p>
      </div>

      {phase === 'dig' && (
        <div className="dig-site-grid">
          <h4 className="panel-subhead">🔨 Tap each sand mound to uncover the tiles beneath!</h4>
          <div className="tile-dig-row">
            {scenario.tiles.map(tile => {
              const isUncovered = uncoveredTiles.includes(tile.pos) || !tile.found;
              return (
                <div key={tile.pos} className="dig-tile-wrapper">
                  <span className="dig-pos-label">n = {tile.pos}</span>
                  {tile.found ? (
                    <button
                      className={`dig-tile ${isUncovered ? 'uncovered' : 'buried'}`}
                      onClick={() => handleDigTile(tile)}
                      disabled={isUncovered}
                    >
                      {isUncovered ? (
                        <span className="tile-value">{tile.val}</span>
                      ) : (
                        <span className="sand-cover">
                          🏜️
                          {dustParticles.slice(0, 3).map(p => (
                            <span key={p.id} className="dust-particle" style={{
                              left: `${p.x}%`, top: `${p.y}%`,
                              width: p.size, height: p.size,
                              animationDelay: `${p.delay}s`,
                            }} />
                          ))}
                        </span>
                      )}
                    </button>
                  ) : (
                    <div className="dig-tile gap-tile">
                      <span className="gap-question">❓</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <p className="panel-caption" style={{ textAlign: 'center', marginTop: 12 }}>
            {uncoveredTiles.length}/{scenario.tiles.filter(t => t.found).length} tiles uncovered
          </p>
        </div>
      )}

      {phase === 'analyze' && (
        <div className="station-grid-2col">
          {/* Left: Pattern Analysis */}
          <div className="station-col-left">
            <div className="station-panel-box">
              <h4 className="panel-subhead">📊 Pattern Analysis</h4>
              <div className="tile-strip-display">
                {scenario.tiles.map(tile => (
                  <div key={tile.pos} className={`strip-tile ${tile.found ? 'known' : 'missing'}`}>
                    <span className="strip-pos">n={tile.pos}</span>
                    <span className="strip-val">{tile.found ? tile.val : '?'}</span>
                  </div>
                ))}
              </div>
              <div className="pattern-analysis-box">
                <div className="pattern-row">
                  <span className="pattern-label">First Term (a):</span>
                  <span className="pattern-value">{scenario.a}</span>
                </div>
                <div className="pattern-row">
                  <span className="pattern-label">Common Difference (d):</span>
                  <span className="pattern-value">+{scenario.d}</span>
                </div>
                <div className="pattern-row">
                  <span className="pattern-label">Missing Position:</span>
                  <span className="pattern-value">n = {scenario.gapPos}</span>
                </div>
                <div className="pattern-row">
                  <span className="pattern-label">Steps from Nearest Known:</span>
                  <span className={`pattern-value ${stepsFromNearest <= EFFICIENCY_THRESHOLD ? 'near-badge' : 'far-badge'}`}>
                    {stepsFromNearest} step(s) {stepsFromNearest <= EFFICIENCY_THRESHOLD ? '⚡ CLOSE' : '📜 FAR'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Solve */}
          <div className="station-col-right">
            <div className="station-panel-box">
              <h4 className="panel-subhead">🛠️ Choose Your Restoration Tool</h4>
              <div className="tool-select-grid">
                <button
                  className={`tool-card-btn ${selectedTool === 'term-to-term' ? 'active-tool' : ''}`}
                  onClick={() => handleToolSelect('term-to-term')}
                >
                  <span className="tool-card-icon">🖌️</span>
                  <span className="tool-card-name">Term-to-Term</span>
                  <span className="tool-card-desc">Step from nearest tile (best when ≤ {EFFICIENCY_THRESHOLD} steps)</span>
                </button>
                <button
                  className={`tool-card-btn ${selectedTool === 'general-term' ? 'active-tool' : ''}`}
                  onClick={() => handleToolSelect('general-term')}
                >
                  <span className="tool-card-icon">📜</span>
                  <span className="tool-card-name">General Term Formula</span>
                  <span className="tool-card-desc">T_n = a + (n−1)d (best when &gt; {EFFICIENCY_THRESHOLD} steps)</span>
                </button>
              </div>
            </div>

            <div className="station-panel-box">
              <h4 className="panel-subhead">✍️ Enter the Missing Tile Value</h4>
              <div className="number-input-row">
                <input
                  type="number"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder={`Value at position ${scenario.gapPos}...`}
                  className="sandstorm-input"
                  aria-label="Restored tile value"
                />
                <button className="btn-primary" onClick={handleSubmit} disabled={!userAnswer}>
                  🏺 Restore Tile
                </button>
              </div>
              {feedback && (
                <div className={`sandstorm-feedback ${feedback.type === 'success' ? 'feed-success' : 'feed-error'}`}>
                  {feedback.text}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
