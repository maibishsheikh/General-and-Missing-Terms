# ScrollQuest — Module TRD
**Grade 7 · General and Missing Terms**
*(Technical companion to `ScrollQuest_Grade7_PRD.md`, produced from `Intellia_Module_Blueprint_TRD.md`. Repo: `scroll-quest-main`. Default clone source: `G2-Money-Money-main`, unless a more recent sibling — `equation-quest-main`, `pattern-quest-main`, `mosaic-quest-main`, `progression-quest-main`, or `rule-quest-main` — is designated as the actual clone source at build time.)*

---

## 1. Reference Analysis Notes — Gotcha Check

Check each fresh against whichever repo is actually cloned from, per platform blueprint §1:

1. **Dead/duplicate `src/features/*` folder.** Confirm `App.jsx`'s actual imports before copying anything.
2. **Hardcoded story-panel count.** This module uses the default **4 panels** — likely a no-op, but confirm against the actual clone source.
3. **Static vs. procedural question bank.** Build `data/questionBank.js` procedurally across the 10 concept generators in §4.1. This module's generators lean heavily on logic already proven in `pattern-quest-main`'s `patternMath.js` (clean-AP generation) and `progression-quest-main`'s interpolation approach — **conceptually reused, not literally imported**, since each module ships as an independent, self-contained repo per platform convention (§2). Re-derive the relevant functions locally in `restorationMath.js` (§4.4) rather than attempting a cross-repo dependency.
4. **Viewport-clipping bug.** Proactively apply the `100dvh` + `ResizeObserver` header-height fix.
5. **Leftover branding strings.** Check `index.html`'s `<title>` and `README.md` for stale references from whichever module was actually cloned, including leftover mascot/character references from any of the five prior Grade 7 modules.

**Module-specific risk to add:** this module's core "which method is faster" grading (Worlds 6–7, and the Error-Detective station) depends entirely on the **stated efficiency rule** from PRD §3 (nearest known term within 3 positions → term-to-term; otherwise general term). This rule is a product/pedagogical judgment call, not a mathematical fact — implement it as a single, named, easily-adjustable constant/function (`EFFICIENCY_THRESHOLD` in `restorationMath.js`), never inlined as a magic number scattered across question templates, so it can be tuned in one place if the PRD §15.2 sanity check changes it.

## 2. Tech Stack

Unchanged from platform blueprint §2.1 — reuse verbatim (same dependency versions as the five prior Grade 7 TRDs). `vite.config.js`, `tailwind.config.js`, `postcss.config.js`, `vercel.json` — reuse as-is.

## 3. Folder Structure

```
scroll-quest-main/
├── public/assets/{audio/, story/}
├── scripts/
│   ├── generate_audio.js         # MODIFY: new `phrases` array (§8)
│   └── clean_audio.js            # reuse as-is
├── src/
│   ├── assets/story/             # story_1.png ... story_4.png
│   ├── components/
│   │   ├── IntroScreen.jsx/.css  # MODIFY: title/copy only
│   │   ├── ProgressMap.jsx/.css  # reuse as-is
│   │   ├── shared/
│   │   │   ├── Mascot.jsx/.css              # reuse as-is (props swap to Relic the Tortoise)
│   │   │   ├── FeedbackOverlay.jsx/.css     # reuse as-is
│   │   │   ├── FloatingNumbers.jsx/.css     # reuse as-is
│   │   │   └── RestorationVisual.jsx        # NEW — §5.1
│   │   ├── gamification/
│   │   │   ├── KingdomMap.jsx/.css  # reuse as-is
│   │   │   └── StarRating.jsx       # reuse as-is
│   │   ├── quiz/
│   │   │   ├── QuestionRenderer.jsx/.css  # MODIFY: import RestorationVisual
│   │   │   └── BossBattleModal.jsx/.css   # reuse as-is
│   │   ├── phases/
│   │   │   ├── WonderPhase.jsx/.css    # MODIFY: content only
│   │   │   ├── StoryPhase.jsx/.css     # MODIFY: content only
│   │   │   ├── SimulatePhase.jsx/.css  # MODIFY: 4 new station imports/labels (standard 4-tab architecture)
│   │   │   ├── PlayPhase.jsx/.css      # reuse as-is
│   │   │   └── ReflectPhase.jsx/.css   # MODIFY: 3 new recap questions (§6.3)
│   │   └── simulations/
│   │       ├── TheExcavationTable.jsx        # NEW — Concept Discovery Lab — §6
│   │       ├── RaceAgainstTheSandstorm.jsx   # NEW — Build-to-Target Challenge — §6
│   │       ├── TheFullRestoration.jsx        # NEW — Multi-Step/Composite Construction — §6
│   │       ├── TheForgersFakeRestoration.jsx # NEW — Error-Detective — §6
│   │       └── Stations.css                  # MODIFY: extend with artifact/scroll, table, and sandstorm-timer visual classes
│   ├── config/
│   │   ├── worlds.config.js       # MODIFY: 10 topic-themed worlds — §4.1
│   │   ├── characters.config.js   # MODIFY: Kavya / Hafiz / Relic — §4.2
│   │   └── audio.config.js        # reuse as-is
│   ├── core/hooks/useViewport.js  # reuse as-is
│   ├── hooks/useAudio.js          # reuse as-is
│   ├── data/
│   │   ├── storyContent.js        # MODIFY: 4 story panels — §4.3
│   │   └── questionBank.js        # MODIFY: procedurally generated 100 Qs — §4.4
│   ├── utils/
│   │   ├── audio.js               # reuse as-is
│   │   ├── audioMap.js            # auto-generated — do not hand-edit
│   │   ├── narration.js           # MODIFY: topic-specific phase scripts — §8
│   │   ├── badgeEngine.js         # MODIFY: relabelled BADGES array only — §7
│   │   ├── scoring.js             # reuse as-is
│   │   ├── shuffle.js             # reuse as-is
│   │   └── restorationMath.js     # NEW — §4.4
│   ├── styles/
│   │   ├── design-tokens.css      # MODIFY: 10 new --world-N accent colors — §9
│   │   └── globals.css            # reuse as-is (apply viewport fix from §1.4 proactively)
│   ├── App.jsx                    # MODIFY only if the clone source's panel-count logic differs from 4 (§1.2)
│   ├── App.css / main.jsx / index.css   # reuse as-is
├── index.html / package.json / vite.config.js / tailwind.config.js / postcss.config.js / vercel.json / .oxlintrc.json / .gitignore
└── README.md                      # MODIFY: module-specific + art-brief (PRD §13)
```

## 4. Data Layer

### 4.1 `config/worlds.config.js`
Ten entries in the fixed shape, populated from PRD §9:

```js
export const WORLDS = [
  { id: 0, name: "The First Fragment", emoji: "🏺", accent: "var(--world-0)",
    description: "Find one missing middle term, choosing an efficient method",
    conceptFocus: "find-single-middle-gap",
    boss: { name: "The Crumbling Fragment", emoji: "🏺", reward: "Restorer's Badge" } },
  { id: 1, name: "The Weathered Beginning", emoji: "📜", accent: "var(--world-1)",
    description: "Find a missing early/first term by reasoning backward",
    conceptFocus: "find-missing-early-term",
    boss: { name: "The Faded Opening", emoji: "📜", reward: "Origin Badge" } },
  { id: 2, name: "The Broken Ending", emoji: "🗿", accent: "var(--world-2)",
    description: "Find a missing last/far term efficiently",
    conceptFocus: "find-missing-far-term",
    boss: { name: "The Lost Ending", emoji: "🗿", reward: "Closure Badge" } },
  { id: 3, name: "Twin Gaps", emoji: "🕳️", accent: "var(--world-3)",
    description: "Find two or more missing terms, staying consistent",
    conceptFocus: "find-multiple-missing-terms",
    boss: { name: "The Double Gap Guardian", emoji: "🕳️", reward: "Twin Badge" } },
  { id: 4, name: "The Restoration Ledger", emoji: "📊", accent: "var(--world-4)",
    description: "Find missing terms in a table, incl. non-consecutive positions",
    conceptFocus: "missing-terms-tabular-format",
    boss: { name: "The Ledger Keeper", emoji: "📊", reward: "Archivist Badge" } },
  { id: 5, name: "The Merchant's Missing Coin", emoji: "👻", accent: "var(--world-5)",
    description: "Find a missing term embedded in a word problem",
    conceptFocus: "missing-terms-word-problem",
    boss: { name: "The Merchant's Ghost", emoji: "👻", reward: "Trader's Badge" } },
  { id: 6, name: "Choose Your Tool", emoji: "🤔", accent: "var(--world-6)",
    description: "Explicitly practice choosing term-to-term vs. general term",
    conceptFocus: "select-efficient-method",
    boss: { name: "The Indecisive Excavator", emoji: "🤔", reward: "Strategist Badge" } },
  { id: 7, name: "Deriving the Master Key", emoji: "🗝️", accent: "var(--world-7)",
    description: "Derive the general term when it's the efficient path",
    conceptFocus: "derive-general-term-when-efficient",
    boss: { name: "The Master Key Guardian", emoji: "🗝️", reward: "Key Badge" } },
  { id: 8, name: "Double-Checking the Restoration", emoji: "🧐", accent: "var(--world-8)",
    description: "Verify a filled gap two independent ways",
    conceptFocus: "cross-verify-missing-term",
    boss: { name: "The Skeptical Curator", emoji: "🧐", reward: "Verifier Badge" } },
  { id: 9, name: "The Grand Archive Unveiling", emoji: "🏛️", accent: "var(--world-9)",
    description: "Mixed review of every concept above",
    conceptFocus: "mixed-review",
    boss: { name: "The Grand Archivist", emoji: "🏛️", reward: "Master Restorer Trophy" } },
];
```

### 4.2 `config/characters.config.js`
```js
export const CHARACTERS = {
  kavya: { name: "Kavya", role: "Reaches for the formula by habit", emoji: "👧🏽", colour: "var(--char-1)", mascotEmoji: "🐢" },
  hafiz: { name: "Hafiz", role: "Prefers quick term-to-term checks",  emoji: "🧑🏻", colour: "var(--char-2)", mascotEmoji: "🐢" },
  relic: { name: "Relic the Tortoise", role: "Mascot & mentor", emoji: "🐢", colour: "var(--mascot)", mascotEmoji: "🐢" },
};
export const MASCOT = { name: "Relic the Tortoise", emoji: "🐢" };
```

### 4.3 `data/storyContent.js`
`STORY_PANELS` array, length 4, per PRD §8.2, fixed shape `{ panel, title, text, highlight, character, characterEmoji, imageBg, imageEmoji }`. Titles: "The Damaged Scroll," "Two Tools, One Toolkit," "Choosing Wisely," "The Guild's Verdict."

### 4.4 Question Bank — Procedural Generation

**`utils/restorationMath.js`** — pure helper functions shared by the question generator and the Simulate stations:

| Function | Purpose |
|---|---|
| `EFFICIENCY_THRESHOLD` | A single named constant (default `3`) implementing PRD §3's stated efficiency rule — the sole place this number lives; every "which method is faster" determination reads from here. |
| `pickCleanArithmeticSequence(range)` | Draws `a`/`d` from curated pools (reusing the same clean-integer, healthy-negative-`d`-proportion discipline established in `pattern-quest-main`/`progression-quest-main`, re-derived locally per §1.3) and generates a full sequence. |
| `punchGaps(sequence, positions)` | Removes the term(s) at the given position(s), returning the "damaged" sequence with blanks — the central utility every world builds on. |
| `solveGapTermToTerm(sequence, blankPositions)` | Fills gap(s) by propagating the known common difference outward from the nearest known term(s). |
| `solveGapGeneralTerm(a, d, blankPositions)` | Fills gap(s) by substituting directly into the general term. |
| `determineEfficientMethod(knownPositions, blankPosition)` | Returns `"term-to-term"` or `"general-term"` per `EFFICIENCY_THRESHOLD` — the single source of truth behind every World 6/7 "correct" answer and every Error-Detective "inefficient choice" distractor; never re-implemented ad hoc per question template. |
| `crossVerifyGap(sequence, blankPosition, filledValue, a, d)` | Confirms a filled value agrees under **both** `solveGapTermToTerm` and `solveGapGeneralTerm` — used for World 8 generation and to construct the Error-Detective's "skipped verification" mistake type (a plausible-looking value that fails this check). |
| `generateTabularGap(range, { consecutivePositions = false })` | Produces a position→value table with some values blanked; when `consecutivePositions` is false, shown positions are deliberately non-adjacent, so `raw value difference ÷ position gap` (not the raw difference alone) is required — the direct generation-level implementation of World 4's headline skill. |
| `generateWordProblemGap(scenarioType)` | Embeds a gap in a money/attendance/sales-style real-world scenario (reusing the scenario-generation approach already established for word-problem worlds in the sibling modules, re-derived locally), returning both the narrative text and the underlying sequence data. |

**"Clean number" constraints (hard requirements, not inline magic numbers):**
- Every generated sequence and every gap resolves to a clean integer under **both** solving methods, so `crossVerifyGap` always genuinely agrees for a correctly-filled gap — a stricter bar than a single-method clean-number check, since disagreement here would silently break the module's central cross-verification premise.
- `generateTabularGap`'s non-consecutive-position items are generated with a genuine position gap (never accidentally consecutive), so the "divide by the position gap" skill is actually exercised rather than trivially bypassable.
- `determineEfficientMethod` classifications are only used to generate World 6/7 "correct" answers when the gap's distance from the nearest known term is unambiguous relative to `EFFICIENCY_THRESHOLD` (i.e. not generated exactly at the threshold boundary, where reasonable disagreement is most likely) — avoids shipping borderline-judgment items as if they had one clean right answer.

**`data/questionBank.js` generation:**
One or more template functions per `conceptFocus` (10 concept slugs from §4.1), each producing exactly 4 options — 1 correct + 3 distractors dominated by the module's headline habits: an inefficient-but-arithmetically-correct tool choice presented as "the" answer for method-choice items; a backward-direction sign error for early-gap items; a raw-difference-instead-of-position-gap error for tabular items; and a "looks restored but fails cross-verification" distractor for World 8 and the Error-Detective station. Fixed output schema (unchanged): `{ id, districtId, category, visual, questionText, options, correctAnswer, explanation, hint1, hint2, visualData }`. Also export `DISTRICTS` (derived from `WORLDS`) so `PlayPhase.jsx`'s existing import is unmodified.

## 5. Component Specs

### 5.1 `RestorationVisual.jsx`
Replaces the reference's domain visual component. Takes `{ type, data, compact }`. Supported `type` values: `"scroll-strip"` (a sequence strip styled as a worn scroll, with blanks rendered as faded/damaged cells), `"restoration-table"` (a position/value table with blank cells, text-labelled per PRD §12), `"tool-comparison"` (side-by-side term-to-term vs. general-term working, used in The Excavation Table and World 6/7 explanations), `"verification-check"` (a two-column "method A / method B" agreement display, used for World 8).

`compact` prop shrinks rendering for inline use inside `QuestionRenderer.jsx`. Also reused inside the Simulate stations (The Excavation Table reuses `tool-comparison` as its live interactive surface).

## 6. Simulate Station Specs

All 4 follow the fixed per-station contract: `<StationComponent onComplete={fn} audioEnabled={bool} />`, self-contained internal state, live SVG visuals themed with `design-tokens.css` variables, a `station-success` panel with a "Complete Station ✓" CTA, and keyboard-operable +/− controls alongside any slider/drag interaction. Standard single-pass architecture, consistent with RuleQuest and unlike ProgressionQuest's 5-tab deviation.

| Component | Archetype | Student manipulates | Live feedback | Completion gate |
|---|---|---|---|---|
| `TheExcavationTable.jsx` | Concept Discovery Lab | Toggles between the two restoration tools on the same gap; adjusts gap position via a slider to see how the "efficient" tool changes | `RestorationVisual` (`tool-comparison`) renders both methods' working live, side-by-side, for the current gap | Free exploration across multiple gap positions and both tool types, **plus one confirmation question** ("if the gap is 8 positions from the nearest known term, which tool is faster?") per the platform's default archetype (no special-instruction override this time) |
| `RaceAgainstTheSandstorm.jsx` | Build-to-Target Challenge | Selects a tool, then applies it to restore the gap, across multiple rounds with a visual (and paired numeric/text, per PRD §12) soft countdown, pausable | Live restoration progress with a "tool chosen" indicator alongside the numeric answer | All rounds' gaps correctly restored using a tool choice consistent with `determineEfficientMethod`; a round can be retried without penalty |
| `TheFullRestoration.jsx` | Multi-Step/Composite Construction | Restores three different gaps (early, middle, tabular) on one artifact in sequence, choosing per-gap tools, then runs `crossVerifyGap` on each | All three gaps' restoration and verification status render live on one composite artifact view | All three gaps correctly restored **and** cross-verified — targets PRD LOs 4–8 together |
| `TheForgersFakeRestoration.jsx` | Error-Detective | Taps the step in a rival restorer's claimed restoration that contains the seeded mistake, then supplies the correction | The tapped step highlights; mistake pool spans all four headline distractor types (§4.4), generated via the same math functions used for the question bank, never hand-authored | Correctly identifying the erroneous step and supplying the fix |

Wire all 4 into `SimulatePhase.jsx`'s `STATIONS` array and station-index render switch; tab bar, footer navigation, progress dots, and `COMPLETE_SIM_STATION`/`ADVANCE_SIM_STATION` gating logic are reused verbatim from the reference.

### 6.3 `ReflectPhase.jsx` Recap Questions
Replace the 3 hard-coded recap questions with 3 targeting the inefficient-tool-choice and skipped-cross-verification habits (PRD §8.5), matching the Error-Detective station's focus.

## 7. Gamification

`utils/scoring.js` (`calcXP`, `calcStars`) — reuse formulas as-is. `utils/badgeEngine.js` — reuse `checkBadges(state)` trigger logic as-is; only the `BADGES` array's display strings change, per PRD §10's rename table (First Piece Found, Steady Excavation, Restoration Streak, Full Excavation Kit, Artifact Restored, Mystery Solved, Dedicated Archivist, Master Restorer Badge).

## 8. Audio Pipeline

`config/audio.config.js`, `utils/audio.js`, `hooks/useAudio.js`, `utils/audioMap.js` — reuse mechanics as-is.

Rewrite `utils/narration.js` function *bodies* (signatures unchanged, same list as prior modules' TRDs) and `scripts/generate_audio.js`'s `phrases` array using PRD §11's rules — "general term" and "term-to-term" always named as a pair when offered as a choice, "cross-verify" paired with a plain-language explanation on first use, table entries always read with both position and value stated, a missing term always announced as "the missing term at position *n*." After content lock: `npm run generate-audio` then `npm run clean-audio`.

## 9. Design Tokens

`styles/design-tokens.css` — reuse core palette/type/radii/shadows/transitions as-is. Regenerate only the `--world-0` through `--world-9` accent block, using an archaeological/restoration palette distinct from the five prior modules' palettes:

| World | Accent (indicative) |
|---|---|
| 0 — The First Fragment | `#C9A66B` (sun-baked sand) |
| 1 — The Weathered Beginning | `#8A5A44` (weathered clay) |
| 2 — The Broken Ending | `#6B705C` (aged stone grey-green) |
| 3 — Twin Gaps | `#A68A64` (dune tan) |
| 4 — The Restoration Ledger | `#3D5A6C` (ink-blue ledger) |
| 5 — The Merchant's Missing Coin | `#B08968` (coin bronze) |
| 6 — Choose Your Tool | `#7C6A46` (tool-leather brown) |
| 7 — Deriving the Master Key | `#CB9A4C` (relic gold) |
| 8 — Double-Checking the Restoration | `#5C4B3A` (curator's desk brown) |
| 9 — The Grand Archive Unveiling | `#2B2118` (deep archive black-brown — most dramatic, for the finale) |

## 10. Build, QA, and Delivery

1. **Question bank stress test** — ≥300 randomized generations (30,000 questions) across all 10 concept categories; assert no duplicate options, no malformed/`NaN`/`undefined` fields, no gap that fails to resolve cleanly under both solving methods.
2. **Cross-verification correctness audit (module-specific, this module's highest-stakes check)** — programmatically confirm that for every "correctly filled" gap in the bank, `crossVerifyGap` returns true, and that every deliberately-wrong Error-Detective/distractor value returns false — since the entire premise of Worlds 8 and the Error-Detective station depends on this check being reliable.
3. **Efficiency-rule consistency audit** — confirm every World 6/7 item's stated correct answer matches `determineEfficientMethod`'s output under the single `EFFICIENCY_THRESHOLD` constant, and confirm no item is generated at the threshold boundary itself (§4.4).
4. **Tabular non-consecutive-position audit** — confirm `generateTabularGap`'s non-consecutive items genuinely have a position gap greater than 1, so World 4's headline skill is actually exercised.
5. **Misconception audit** — spot-check distractors are dominated by the four headline types (inefficient tool choice, backward-direction sign error, raw-difference-vs-position-gap error, failed cross-verification) rather than arbitrary numbers.
6. **Audio parity check** — every string passed to a narration helper has an exact match in `audioMap.js`, or is intentionally dynamic.
7. **Full user-journey walkthrough** — Wonder → Story (all 4 panels) → Simulate (all 4 stations completable, tab-gating correct) → Practice (World Map, all 4 modes, all 10 Boss Battles, badges) → Reflect — zero console/page errors.
8. **Production build check** — `npm install && npm run build` succeeds from a clean extract.
9. **Accessibility spot-check** — fonts/touch targets at Secondary-appropriate sizing; table cells fully text-labelled; sandstorm timer has a numeric/text pairing and a pause option.
10. **Delivery checklist** — zip excludes `node_modules/`/`dist/`; 4 story image placeholders with art-brief README; `README.md` updated and checked for leftover branding; `.env.local.example` documents `VITE_ELEVENLABS_API_KEY` with no real key committed.

## 11. Risks

- **This module's value proposition risk is a product risk, not just a technical one** (carried directly from PRD §15.1) — before investing build time, confirm the standalone-vs-practice-pack decision, since building the full five-phase architecture for content that's mostly application/format practice is a materially different time investment than extending an existing module.
- **`EFFICIENCY_THRESHOLD` is a single point of pedagogical judgment with wide blast radius.** Because §4.1's constant drives Worlds 6, 7, and a chunk of the Error-Detective mistake pool, a post-launch change to this number would require regenerating a meaningful fraction of the question bank — worth getting a teacher's sign-off on the value *before* the initial 300-run stress test, not after.
- **Reused-but-not-shared math logic across repos.** Since `restorationMath.js` deliberately re-derives patterns already proven in sibling modules' math-helper files (§1.3) rather than importing them, a bug fixed in one module's helper (e.g. a clean-number edge case discovered later in `pattern-quest-main`) will not automatically propagate here — worth a periodic cross-module audit if such fixes occur.
- **Sixth consecutive Grade-7-family module — family scope coherence risk, now at its highest point.** With six modules sharing pattern-adjacent territory, the family scope map (PRD §2) is doing more load-bearing work than ever; keep it as the first thing updated whenever any sibling module's scope changes.
- **Concept Discovery Lab tension, still unresolved for this module** (PRD §15.5), consistent with RuleQuest rather than ProgressionQuest, absent a fresh special instruction.
