// src/components/shared/RestorationVisual.jsx
// Visual component for ScrollQuest: supports scroll-strip, restoration-table, tool-comparison, and verification-check
import React from 'react';
import './RestorationVisual.css';

export default function RestorationVisual({ type, data, compact = false }) {
  if (!data) return null;

  // 1. SCROLL STRIP: A sequence strip styled as an ancient worn scroll with faded/damaged blanks
  if (type === 'scroll-strip') {
    const { sequence = [], blankIndices = [], highlightPos = null } = data;
    return (
      <div className={`scroll-strip-container ${compact ? 'compact' : ''}`}>
        <div className="scroll-edge-left" />
        <div className="scroll-body">
          <div className="scroll-cells-row">
            {sequence.map((item, idx) => {
              const pos = item.position !== undefined ? item.position : idx + 1;
              const isBlank = item.isBlank || blankIndices.includes(pos) || item.value === null;
              const isHighlight = highlightPos === pos;

              return (
                <div
                  key={pos}
                  className={`scroll-cell ${isBlank ? 'cell-damaged' : 'cell-intact'} ${isHighlight ? 'cell-highlight' : ''}`}
                  title={`Position ${pos}: ${isBlank ? 'Worn away (Blank)' : item.value}`}
                  aria-label={`Position ${pos}: ${isBlank ? 'Worn away gap' : item.value}`}
                >
                  <span className="cell-pos-tag">n = {pos}</span>
                  <div className="cell-value-wrap">
                    {isBlank ? (
                      <span className="blank-glyph" aria-hidden="true">__</span>
                    ) : (
                      <span className="cell-val">{item.value}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="scroll-edge-right" />
      </div>
    );
  }

  // 2. RESTORATION TABLE: Position vs Value table with explicit text labels per PRD §12
  if (type === 'restoration-table') {
    const { rows = [], columns = ['Position (n)', 'Term Value (T_n)'] } = data;
    return (
      <div className={`restoration-table-wrap ${compact ? 'compact' : ''}`}>
        <table className="restoration-table" role="table" aria-label="Archaeological Restoration Ledger">
          <thead>
            <tr>
              <th scope="col" className="table-th">{columns[0]}</th>
              <th scope="col" className="table-th">{columns[1]}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => {
              const isBlank = row.value === null || row.isBlank;
              return (
                <tr key={i} className={`table-row ${isBlank ? 'row-blank' : ''}`}>
                  <td className="table-td pos-col">
                    <span className="pos-badge">Position {row.position}</span>
                  </td>
                  <td className="table-td val-col">
                    {isBlank ? (
                      <span className="blank-indicator" aria-label={`Position ${row.position}: Blank gap`}>
                        <span className="blank-mark">❓ [Blank]</span>
                      </span>
                    ) : (
                      <span className="table-val" aria-label={`Position ${row.position}: Value ${row.value}`}>
                        {row.value}
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }

  // 3. TOOL COMPARISON: Side-by-side working (Term-to-term vs General Term)
  if (type === 'tool-comparison') {
    const {
      gapPos,
      nearestKnownPos,
      nearestKnownVal,
      commonDiff,
      firstTerm,
      stepsRequired,
      recommendedTool,
    } = data;

    const termToTermSteps = stepsRequired || Math.abs(gapPos - nearestKnownPos);
    const isTermToTermFaster = recommendedTool === 'term-to-term';

    return (
      <div className={`tool-comparison-wrap ${compact ? 'compact' : ''}`}>
        {/* Method A: Term-to-term */}
        <div className={`tool-column ${isTermToTermFaster ? 'recommended-tool' : ''}`}>
          <div className="tool-column-header">
            <span className="tool-icon">🖌️</span>
            <div>
              <h4 className="tool-title">Term-to-Term Checking</h4>
              <span className="tool-meta">Steps from known term: <strong>{termToTermSteps} step(s)</strong></span>
            </div>
            {isTermToTermFaster && <span className="winner-pill">⚡ Faster Choice</span>}
          </div>
          <div className="tool-working-box">
            <p className="working-step">Start at known <strong>n = {nearestKnownPos}</strong> (value = {nearestKnownVal})</p>
            <p className="working-step">Step {commonDiff >= 0 ? `+${commonDiff}` : commonDiff} outward across {termToTermSteps} gap(s):</p>
            <div className="working-calc">
              {nearestKnownVal} {gapPos > nearestKnownPos ? '+' : '−'} ({termToTermSteps} × {Math.abs(commonDiff)})
              = <strong>{nearestKnownVal + (gapPos - nearestKnownPos) * commonDiff}</strong>
            </div>
          </div>
        </div>

        {/* Method B: General Term */}
        <div className={`tool-column ${!isTermToTermFaster ? 'recommended-tool' : ''}`}>
          <div className="tool-column-header">
            <span className="tool-icon">📜</span>
            <div>
              <h4 className="tool-title">General Term Formula</h4>
              <span className="tool-meta">Direct substitution: <strong>1 calculation</strong></span>
            </div>
            {!isTermToTermFaster && <span className="winner-pill">⚡ Faster Choice</span>}
          </div>
          <div className="tool-working-box">
            <p className="working-step">Formula: <strong>T_n = a + (n − 1)d</strong></p>
            <p className="working-step">Substitute <strong>n = {gapPos}</strong> (a = {firstTerm}, d = {commonDiff}):</p>
            <div className="working-calc">
              {firstTerm} + ({gapPos} − 1)({commonDiff}) = <strong>{firstTerm + (gapPos - 1) * commonDiff}</strong>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 4. VERIFICATION CHECK: Two-column Method agreement display
  if (type === 'verification-check') {
    const {
      blankPos,
      termToTermVal,
      generalTermVal,
      isVerified,
      claimedVal,
    } = data;

    const matches = termToTermVal === generalTermVal && (claimedVal === undefined || Number(claimedVal) === termToTermVal);

    return (
      <div className={`verification-wrap ${compact ? 'compact' : ''}`}>
        <div className="verification-header">
          <span className="verify-badge-icon">{matches ? '🛡️' : '⚠️'}</span>
          <div>
            <h4 className="verify-title">Cross-Verification Protocol: Position {blankPos}</h4>
            <p className="verify-sub">Checking the restored value using two independent methods</p>
          </div>
        </div>

        <div className="verification-grid">
          <div className="verify-col">
            <span className="verify-label">Method 1 · Term-to-Term</span>
            <div className="verify-value-box">
              <span className="verify-num">{termToTermVal}</span>
              <span className="verify-status">✓ Computed</span>
            </div>
          </div>

          <div className="verify-divider">
            <span>{matches ? '=' : '≠'}</span>
          </div>

          <div className="verify-col">
            <span className="verify-label">Method 2 · General Term</span>
            <div className="verify-value-box">
              <span className="verify-num">{generalTermVal}</span>
              <span className="verify-status">✓ Computed</span>
            </div>
          </div>
        </div>

        <div className={`verification-verdict ${matches ? 'verdict-agree' : 'verdict-disagree'}`}>
          {matches ? (
            <span>✅ <strong>Restoration Certified!</strong> Both independent methods confirm value {termToTermVal}.</span>
          ) : (
            <span>❌ <strong>Discrepancy Detected!</strong> The methods do not agree ({termToTermVal} vs {generalTermVal}).</span>
          )}
        </div>
      </div>
    );
  }

  return null;
}
