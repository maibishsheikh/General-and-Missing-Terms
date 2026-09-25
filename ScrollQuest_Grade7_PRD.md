# ScrollQuest — Module PRD
**Grade 7 · General and Missing Terms**
*(Produced from `Intellia_Module_Blueprint_PRD.md` — {{GRADE}} = Grade 7, {{TOPIC}} = General and Missing Terms, {{SPECIAL_INSTRUCTIONS}} = none supplied, defaults assumed throughout)*

---

## 1. Overview

ScrollQuest is this platform's dedicated **application and strategy** module for a pairing of skills every sibling module has already touched in pieces: finding a sequence's general term, and finding a missing term. Where PatternQuest teaches *how* to derive a general term and ProgressionQuest/RuleQuest each teach *specific* missing-term techniques (interpolation, backward-solving), ScrollQuest's job is different: given a gap, in any position and any presentation format, **decide which tool is actually faster** — quick term-to-term checking, or the general term — use it correctly, and cross-check the result. It's framed as an archaeological restoration guild: every world is a damaged artifact with numbers worn away, and the throughline question is "which restoration tool do you reach for here?"

## 2. Background

This is the sixth Grade 7 (Secondary 1) module built against the platform blueprint's reference architecture, following **EquationQuest**, **PatternQuest**, **MosaicQuest**, **ProgressionQuest**, and **RuleQuest**. It reuses `G2-Money-Money-main`'s five-phase pedagogical architecture per platform convention.

**Family scope map (updated for six modules):**

| Module | Owns |
|---|---|
| PatternQuest | Informal linear/arithmetic patterns; deriving `nth term = an + b`; special named sequences; figure patterns |
| MosaicQuest | The spatial/geometric side — repeating vs. growing, rotation, reflection, symmetry |
| ProgressionQuest | The formal arithmetic-progression treatment — named `a`/`d`, `Tn = a+(n-1)d`, interpolation, means, sums |
| RuleQuest | The generative rule itself — single-step and compound term-to-term rules, working backwards, rule-type classification, Fibonacci-type sequences |
| **ScrollQuest (this module)** | **Strategy and application** — given a missing term in any position/format, choosing between term-to-term checking and the general term, executing correctly, and cross-verifying. Assumes the underlying techniques (lightly reviewed, not re-taught) and focuses on format breadth and method selection |
| EquationQuest | Solving linear equations from word problems (a separate topic entirely) |

## 3. Standards Alignment

**Honest positioning — this is the most overlap-prone module in the family so far.** "General term" and "missing term" are not a new Singapore MOE content area; they're two sub-skills already inside the same Sec1 "Number Patterns" chapter PatternQuest draws on, and both have already been taught with real technique depth by PatternQuest (general term) and ProgressionQuest/RuleQuest (missing/interior/backward terms). This PRD does **not** treat "General and Missing Terms" as a new concept to teach from scratch. Instead, it positions ScrollQuest as this platform's first explicitly **application-and-practice-format** module in the family — closer to a "Part 2: putting it all together" companion than a new-content module. This is flagged prominently in §15 as worth a direct stakeholder decision: **should this ship as its own standalone module, or as an additional practice pack appended to PatternQuest?** This PRD proceeds with the standalone-module framing as requested, but the question is real and should be answered before build, not assumed.

**What makes this a genuinely distinct module rather than a re-skin, if it proceeds as requested:**
- **Format breadth.** No sibling module has yet covered missing terms presented in a table/chart (with possibly non-consecutive position numbers), or a missing term embedded inside a real-world word problem — both are new presentation formats for this family.
- **Multiple simultaneous gaps.** No sibling module asks the student to fill more than one gap in the same sequence and stay internally consistent across all of them.
- **Explicit method selection as its own graded skill.** Every sibling module teaches exactly one technique in isolation. This module is the first to ask, directly and gradeably, "which tool is actually faster for *this* gap" — a genuine, higher-order strategic skill, not just execution.
- **Cross-verification as a taught habit.** Checking a restored term two independent ways (term-to-term consistency *and* general-term substitution) before trusting it is introduced here for the first time as an explicit, named step.

**In-scope skills:**
- Finding a single missing term in the middle of a sequence, choosing an efficient method.
- Finding a missing early/first term by reasoning backward from later given terms.
- Finding a missing last/far term efficiently.
- Finding multiple missing terms within the same sequence, staying consistent across all of them.
- Finding missing terms presented in a table/chart format, including when shown positions are non-consecutive.
- Finding a missing term embedded in a real-world word problem.
- Explicitly deciding between term-to-term checking and the general term for a given gap, and justifying the choice.
- Deriving the general term specifically when it's the more efficient path (e.g. several gaps at once), rather than as a default first step.
- Cross-verifying a filled-in missing term using a second, independent method.

**Adjacent/prerequisite skills treated as bridge only, not re-taught:**
- **How** to derive a general term from scratch, and **how** to reverse a term-to-term rule — both are PatternQuest's and RuleQuest's jobs respectively; this module reviews them briefly in Story (§8.2) but does not re-teach either technique in depth.
- **Formal AP interpolation notation** (`a`, `d` solved simultaneously from two positions) — ProgressionQuest's territory; this module uses the same underlying idea informally, without the formal notation.
- **Geometric/compound/Fibonacci-type missing terms** — explicitly excluded; this module stays within arithmetic (constant-difference) sequences only, consistent with PatternQuest's scope, to keep the "which tool" decision clean and not entangled with rule-type identification (RuleQuest's job).

**Domain conventions to encode as house style:**
- Every gap-filling answer is paired with a stated method choice ("I used term-to-term because the gap was close to a known term" / "I used the general term because the gap was far away and I needed several values") — the justification is treated as part of the answer, not an afterthought.
- **Stated efficiency rule** (needed to make "which method is faster" objectively gradeable): a gap is treated as **term-to-term-efficient** if the nearest known term is within 3 positions of it; otherwise the **general term is treated as the efficient choice**. This threshold is a deliberate, stated design decision — not a universal mathematical fact — and is flagged in §15 as worth a teacher's sanity check before the bank ships, since reasonable people could set the threshold slightly differently.
- A restored term is never presented as "confirmed" without the cross-verification step being shown at least once per world.

## 4. Learning Objectives

By the end of this module, a student should be able to:
1. Find a single missing term in the middle of a sequence, choosing an efficient method.
2. Find a missing early/first term by reasoning backward from later given terms.
3. Find a missing last/far term efficiently.
4. Find multiple missing terms within the same sequence, staying internally consistent.
5. Find missing terms presented in a table/chart format, including non-consecutive shown positions.
6. Find a missing term embedded in a real-world word problem.
7. Decide between term-to-term checking and the general term for a given gap, and justify the choice against the stated efficiency rule (§3).
8. Cross-verify a filled-in missing term using a second, independent method.

Ordering runs foundational → applied (single middle gap → early gap → far gap → multiple gaps → tabular format → word-problem format → explicit method-selection practice → deriving the general term when it's the efficient choice → cross-verification capstone), and drives the world sequence in §9.

## 5. Inherited Standards *(Section A of the platform blueprint — copied verbatim, unchanged)*

- **Five-phase architecture:** Wonder → Story → Simulate → Play ("Practice" in-UI) → Reflect.
- **Gamification:** XP per question, 0–3 stars per world, streak tracking, 8 fixed badge triggers (relabelled §10), 10 Boss Battles (5Q/3 lives).
- **Practice modes:** Guided (5Q, hints, untimed), Independent (10Q, no hints), Timed Challenge (8Q, 60s), Boss Battle (5Q, 3 lives).
- **Audio pipeline:** ElevenLabs Alice voice only, 6 emotional presets, pre-generated + dynamic narration, no browser TTS fallback, strict 1:1 narration/on-screen-text parity.
- **Question bank shape:** 10 worlds × 10 questions = 100, procedurally generated, ≥300-run stress test, fixed schema, World 9 (last, 0-indexed) is the mixed-review grand finale.
- **Product standards:** React/Vite/Tailwind/Framer Motion, pixel-faithful `design-tokens.css` reuse, enlarged Simulate/Practice fonts and touch targets, zip delivery with placeholder story art + art-brief README.
- **Simulate phase:** the standard 4 required, archetype-mapped stations (no special-instruction deviation this time).

## 6. Enhancement Requests / Special Instructions

None supplied. Defaults applied: 4-panel Story (justified §8.2), Singaporean-multicultural naming for the two characters (§7), theme-specific mascot override with stated rationale (§7), and the standard single-pass 4-station Simulate design (§8.3). The Concept Discovery Lab confirmation-question tension (open across four of the five prior modules) is **not** re-resolved here by default, consistent with how RuleQuest handled it in the absence of a fresh instruction.

## 7. Module Identity

- **Module name:** **ScrollQuest**
- **Story theme:** an archaeological restoration guild — every world is a damaged artifact (a scroll, tablet, or ledger) with numbers worn away, and the throughline question is "which restoration tool — quick pattern-checking, or the general-term formula — gets this piece back fastest and most reliably?"
- **Named characters** (Singaporean-multicultural convention, first names only, distinct from all five sibling modules' pairs):
  - **Kavya** — reaches for the general term formula by habit, sometimes even when a quick check would be faster.
  - **Hafiz** — prefers quick term-to-term checking, sometimes even when it's the slower option for a far-away gap — the pair's contrasting instincts directly dramatise this module's central "which tool" question.
- **Mascot: Relic the Tortoise 🐢** *(override, with stated rationale)* — a tortoise's unhurried, deliberate nature fits a module about pausing to choose the right method rather than rushing to the first one that comes to mind, and is distinct from the owl, fox, chameleon, robot, and beaver mascots already used across the sibling modules.

## 8. Five-Phase Journey Detail

### 8.1 Wonder
Single hook screen: *"The Guild just uncovered an ancient number-scroll — but half the digits have worn away. You already know two ways to restore a missing number. The real question today: which one do you reach for first?"*

### 8.2 Story — 4 panels (default, not exceeded)

| # | Title | Concept delivered | Narrative beat |
|---|---|---|---|
| 1 | The Damaged Scroll | Hook: an artifact with missing numbers, first restoration job | Kavya and Hafiz are assigned their first joint restoration, immediately disagreeing on method. |
| 2 | Two Tools, One Toolkit | Review (not re-teach): term-to-term checking and the general term, briefly recapped | Relic the Tortoise reviews both tools without re-deriving either from scratch, framing them as "two ways to solve the same kind of problem." |
| 3 | Choosing Wisely | Formal strategy: the stated efficiency rule (§3), and cross-verification as a habit | Relic demonstrates picking a tool based on gap position, then insists on checking the answer a second way before calling it "restored." |
| 4 | The Guild's Verdict | Worked application: a scroll with an early gap and a middle gap, both tools used appropriately, both cross-verified | The pair completes the restoration using the right tool for each gap, and the Guild certifies the scroll. |

### 8.3 Simulate — 4 stations (archetype-mapped)
Summary (full technical spec in the companion TRD):

| Station | Archetype | Premise |
|---|---|---|
| The Excavation Table | Concept Discovery Lab | Student toggles between two "restoration tools" (term-to-term checker vs. general-term calculator) on the same gap, watching each work live side-by-side — builds felt intuition for when each is faster/easier, across multiple gap positions and sequence types. |
| Race Against the Sandstorm | Build-to-Target Challenge | A soft time-pressure challenge across multiple rounds: student selects the right tool and applies it correctly before a visual sandstorm re-covers the artifact — rewards correct **tool choice** as well as the final restored number. |
| The Full Restoration | Multi-Step/Composite Construction | Given an artifact with three different gaps (early, middle, tabular-format), the student restores each using the most efficient tool for that specific gap, then cross-verifies all three — the module's most composite challenge, combining LOs 4–8. |
| The Forger's Fake Restoration | Error-Detective | A rival restorer's claimed restoration contains one seeded mistake (an inefficient-but-lucky tool choice presented as if it were the "right" approach, a term-to-term consistency slip, a general-term substitution error, or a skipped cross-verification step that would have caught the error); the student finds and fixes it. |

### 8.4 Play / Practice
Standard, unchanged mechanics (10 worlds × 10 questions, 4 modes). See world table in §9.

### 8.5 Reflect
3 new recap questions targeting the module's two headline habits: **choosing an inefficient tool even when it happens to get the right answer** (the "process, not just the answer, matters" habit), and **skipping cross-verification**. Followed by the standard scorecard and a reflection prompt ("Which restoration made you switch tools partway through, and why?").

## 9. World & Question Bank Table

*Shape: `{ id, name, emoji, accent, description, conceptFocus, boss: { name, emoji, reward } }`. World 9 (last) is the mixed-review grand finale per platform standard.*

| id | World | conceptFocus | Description | Boss | Reward |
|---|---|---|---|---|---|
| 0 | The First Fragment | `find-single-middle-gap` | Find one missing middle term, choosing an efficient method | The Crumbling Fragment 🏺 | Restorer's Badge |
| 1 | The Weathered Beginning | `find-missing-early-term` | Find a missing early/first term by reasoning backward | The Faded Opening 📜 | Origin Badge |
| 2 | The Broken Ending | `find-missing-far-term` | Find a missing last/far term efficiently | The Lost Ending 🗿 | Closure Badge |
| 3 | Twin Gaps | `find-multiple-missing-terms` | Find two or more missing terms, staying consistent | The Double Gap Guardian 🕳️🕳️ | Twin Badge |
| 4 | The Restoration Ledger | `missing-terms-tabular-format` | Find missing terms in a table, incl. non-consecutive positions | The Ledger Keeper 📊 | Archivist Badge |
| 5 | The Merchant's Missing Coin | `missing-terms-word-problem` | Find a missing term embedded in a word problem | The Merchant's Ghost 👻 | Trader's Badge |
| 6 | Choose Your Tool | `select-efficient-method` | Explicitly practice choosing term-to-term vs. general term | The Indecisive Excavator 🤔 | Strategist Badge |
| 7 | Deriving the Master Key | `derive-general-term-when-efficient` | Derive the general term when it's the efficient path | The Master Key Guardian 🗝️ | Key Badge |
| 8 | Double-Checking the Restoration | `cross-verify-missing-term` | Verify a filled gap two independent ways | The Skeptical Curator 🧐 | Verifier Badge |
| 9 | The Grand Archive Unveiling | `mixed-review` | Mixed review of every concept above; hardest boss | The Grand Archivist 🏛️ | Master Restorer Trophy |

**Sample questions (illustrative, not the full 100):**

- **World 0:** *"2, 6, 10, __, 18. Find the missing term."* → `14` ✓
- **World 1:** *"__, 11, 16, 21. Find the missing first term."* → `6` ✓ (distractor `26`, reflecting adding instead of subtracting when going backward)
- **World 2:** *"An arithmetic sequence has `a=4, d=5`. Find the 15th term without listing all 15."* → `74` ✓
- **World 3:** *"5, __, 15, __, 25. Find both missing terms."* → `10, 20` ✓
- **World 4:** *"Position 2 → 11, Position 6 → 31 (a table with positions 3, 4, 5 blank). Find the value at position 4."* → `21` ✓ (headline distractor `26`, reflecting treating the raw 20-point difference as a single step instead of dividing by the 4-position gap)
- **World 5:** *"A market stall's daily sales rise by the same amount each day. Day 2: 18 items. Day 5: 33 items. How many were sold on Day 1?"* → `13` ✓
- **World 6:** *"A sequence has known terms at positions 3 and 4, with a gap at position 20. Which method is faster?"* → "The general term" ✓ (per the stated efficiency rule, §3)
- **World 7:** *"A sequence has 4 gaps scattered across positions 2 through 30. What's the most efficient first step?"* → "Derive the general term" ✓
- **World 8:** *"A restorer claims the missing term is 22, found using term-to-term checking. How would you confirm it a second way?"* → "Substitute the position into the general term and check it also gives 22" ✓
- **World 9:** mixed-type item combining a tabular gap (World 4) with an explicit method-choice question (World 6).

## 10. Gamification — Badge Renames

| Fixed trigger | Badge name |
|---|---|
| First correct answer | First Piece Found 🧩 |
| 5-answer streak | Steady Excavation 🖌️ |
| 10-answer streak | Restoration Streak 🔥 |
| All 4 Simulate stations complete | Full Excavation Kit 🧰 |
| Any world scores 3 stars | Artifact Restored ⭐⭐⭐ |
| Any Boss Battle won | Mystery Solved 🏅 |
| 20+ questions answered in Practice | Dedicated Archivist 📜 |
| Full 5-phase journey complete | Master Restorer Badge 🏆 |

## 11. Audio & Narration Content Rules

- "general term" and "term-to-term" are always spoken in full and, whenever offered as a choice, always named as a pair ("would term-to-term checking or the general term be faster here?").
- "cross-verify" is paired with "checking your answer two different ways" on first use per world, then used alone thereafter.
- Table/chart entries are always read with both parts stated ("position 4 — blank," "position 7 — value 22"), never position or value alone.
- A missing term is always announced as "the missing term at position *n*," never just "the blank," keeping its position explicitly grounded.

## 12. Accessibility

Standard enlarged fonts/touch targets in Simulate and Practice, calibrated toward the platform's Secondary-1 sizing precedent. Tables/charts (World 4, The Excavation Table, The Full Restoration) carry full text labels for every cell, including blanks, never relying on cell position alone. The "sandstorm" soft-time-pressure element in Race Against the Sandstorm always pairs its visual countdown with a numeric/text countdown, and offers an option to pause the timer, consistent with treating timing as supportive rather than punitive at this age band.

## 13. Assets Required

4 story images at the reference's standard placeholder dimensions, delivered as blank CSS-framed placeholders, with an art-brief README describing each panel:
1. The Guild workshop, Kavya and Hafiz receiving the damaged scroll, already disagreeing on method.
2. Relic the Tortoise reviewing both restoration tools at a worktable.
3. Relic demonstrating the efficiency rule and the cross-verification habit.
4. The completed, certified restoration, both gaps correctly filled and checked.

## 14. Success Metrics / Acceptance Criteria

Standard fixed criteria (question-bank stress test, audio parity, clean build, full-journey walkthrough) plus module-specific:
- Every generated gap resolves to a clean integer via both methods (term-to-term and general-term), so cross-verification (LO8) always genuinely agrees for a correctly-filled gap.
- World 6/7's "which method is faster" items are graded consistently against the stated efficiency rule (§3) — never an item where the "correct" method is ambiguous under that rule.
- World 4's tabular items include a genuine mix of consecutive and non-consecutive shown positions, so the "divide by the position gap, don't just use the raw value difference" skill is actually tested.
- Distractors are dominated by the two headline habits (inefficient-but-lucky tool choice; skipped cross-verification) plus the backward-direction sign error and the raw-difference-vs-position-gap tabular error, rather than arbitrary wrong answers.

## 15. Assumptions & Open Questions

1. **Whether this should be a standalone module at all (the central open question for this PRD, more fundamental than the routine flags raised in prior modules):** as stated in §3, this topic is squarely an application/format-breadth layer on top of PatternQuest's already-taught techniques. Recommend an explicit stakeholder decision between: (a) building it as its own module as specified here, (b) folding it into PatternQuest as an additional practice pack/extra worlds rather than a separate product, or (c) building it but explicitly marketing/positioning it as a "Part 2" companion rather than a first-time-content module.
2. **The stated efficiency rule (§3)** — "within 3 positions of a known term" is a deliberately concrete but somewhat arbitrary threshold, needed to make "which method is faster" objectively gradeable. Recommend a teacher's sanity check on this specific number before the question bank ships, since a different reasonable threshold would flip some items' "correct" answer.
3. **Family scope coherence** — the updated six-module scope map in §2 is this PRD's proposed way of keeping the growing catalogue legible; worth a single consolidated review across all six modules together rather than continuing to check each new module only against its immediate neighbours.
4. **Character names and mascot** (Kavya, Hafiz, Relic the Tortoise) are proposed defaults, not yet stakeholder-approved.
5. **Concept Discovery Lab tension — not re-resolved here**, consistent with RuleQuest's precedent: no special instruction was given for this module, so The Excavation Table defaults to the blueprint's standard confirmation-question archetype rather than ProgressionQuest's free-play resolution.
