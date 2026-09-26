# ScrollQuest — General & Missing Terms

> **Grade 7 (Secondary 1) · Mathematics**  
> **Topic:** Number Patterns: General and Missing Terms  
> **Theme:** Archaeological Restoration Guild  

---

## 1. Overview

**ScrollQuest** is an educational mathematics application designed for Grade 7 (Secondary 1) students following the Singapore MOE curriculum. Framed as an archaeological restoration guild, every world is a damaged artifact (a scroll, stone tablet, or archival ledger) with numbers worn away.

The central pedagogical throughline is strategic method selection:
> *"Given a missing term in any position or presentation format, decide which tool is actually faster — quick term-to-term checking, or the general term formula — use it correctly, and cross-verify the result."*

---

## 2. Pedagogical Architecture

Following the 5-phase learning journey:

1. **Wonder Phase**: Sparks curiosity with an unrolled ancient number-scroll where numbers have flaked into dust.
2. **Story Phase (4 Panels)**:
   - *Panel 1: The Damaged Scroll*: Apprentices Kavya and Hafiz receive their first joint restoration and disagree on which tool to use.
   - *Panel 2: Two Tools, One Toolkit*: Guild Mentor Relic the Tortoise recaps both tools: Term-to-Term checking ($+d$) and the General Term formula ($T_n = a + (n-1)d$).
   - *Panel 3: Choosing Wisely*: Introduces the stated efficiency rule ($\le 3$ steps from known term $\rightarrow$ Term-to-Term; $> 3$ steps $\rightarrow$ General Term) and the sacred habit of cross-verification.
   - *Panel 4: The Guild's Verdict*: Kavya and Hafiz restore an early gap and a far gap, cross-verify each other's work, and earn the Guild Seal of Certification.
3. **Simulate Phase (4 Interactive Stations)**:
   - **Station A: The Excavation Table** (Concept Discovery Lab): Interactive slider comparing Term-to-Term and General Term calculations side-by-side on the same gap with a confirmation gate.
   - **Station B: Race Against the Sandstorm** (Build-to-Target Challenge): Soft time-pressure challenge with a pausable visual and numeric countdown requiring both efficient tool choice and correct value.
   - **Station C: The Full Composite Restoration** (Multi-Step Composite Construction): Restores an early gap, a middle gap, and a non-consecutive ledger gap, running `crossVerifyGap` on each.
   - **Station D: The Forger's Fake Restoration** (Error-Detective): Identifies and corrects seeded mistakes (backward sign slip, raw tabular difference slip, or inefficient tool marathon).
4. **Practice Phase (10 Worlds × 10 Questions = 100 Questions)**:
   - World 0: *The First Fragment* (`find-single-middle-gap`) — 🏺 Boss: The Crumbling Fragment
   - World 1: *The Weathered Beginning* (`find-missing-early-term`) — 📜 Boss: The Faded Opening
   - World 2: *The Broken Ending* (`find-missing-far-term`) — 🗿 Boss: The Lost Ending
   - World 3: *Twin Gaps* (`find-multiple-missing-terms`) — 🕳️ Boss: The Double Gap Guardian
   - World 4: *The Restoration Ledger* (`missing-terms-tabular-format`) — 📊 Boss: The Ledger Keeper
   - World 5: *The Merchant's Missing Coin* (`missing-terms-word-problem`) — 👻 Boss: The Merchant's Ghost
   - World 6: *Choose Your Tool* (`select-efficient-method`) — 🤔 Boss: The Indecisive Excavator
   - World 7: *Deriving the Master Key* (`derive-general-term-when-efficient`) — 🗝️ Boss: The Master Key Guardian
   - World 8: *Double-Checking the Restoration* (`cross-verify-missing-term`) — 🧐 Boss: The Skeptical Curator
   - World 9: *The Grand Archive Unveiling* (`mixed-review`) — 🏛️ Boss: The Grand Archivist
5. **Reflect Phase**: 3 targeted misconception recap questions, personal Restorer's Field Log journal prompt, and certified Master Restorer scorecard.

---

## 3. Characters & Mascot

- **Kavya** (`👧🏽`): Apprentice restorer who instinctively reaches for the general term formula.
- **Hafiz** (`🧑🏻`): Apprentice restorer who prefers quick term-to-term checks.
- **Relic the Tortoise** (`🐢`): Guild Mentor who embodies unhurried, deliberate strategy — choosing the right tool before rushing to calculate.

---

## 4. Art-Brief: Story Panels (PRD §13 / TRD §10.10)

Dimensions: 16:9 widescreen format (1920 × 1080 px).

- **Panel 1 (`story_1.png`)**:
  - *Setting*: Ancient stone guild workshop with scrolls, measuring compasses, and parchment fragments on wooden desks.
  - *Characters*: Kavya unrolling a geometric chart with mathematical formulas, while Hafiz points excitedly at a torn scroll fragment on the worktable, gesturing with his hands.
  - *Mood*: Dynamic, inquisitive, lighthearted disagreement between partners.

- **Panel 2 (`story_2.png`)**:
  - *Setting*: The same archive workshop, lit by warm amber lanterns and glowing relics.
  - *Characters*: Relic the Tortoise wearing small reading spectacles, standing by the table with two glowing guild badges: one depicting a stepping brush (Term-to-Term) and one depicting a master golden key (General Term).
  - *Mood*: Wise, instructional, warm.

- **Panel 3 (`story_3.png`)**:
  - *Setting*: Detailed close-up of a damaged parchment scroll laid on an archaeological restoration easel.
  - *Characters*: Relic demonstrating with a magnifying glass: pointing out a close gap (distance $\le 3$) vs a far gap (position 25), with a glowing balance scale in the background symbolizing cross-verification.
  - *Mood*: Strategic, focused, methodical.

- **Panel 4 (`story_4.png`)**:
  - *Setting*: Grand Archive ceremonial hall with high stone arches and celebratory banners.
  - *Characters*: Kavya and Hafiz high-fiving in celebration as their fully restored scroll glows with golden certified runes, stamped with the gold Guild Seal of Certification. Relic smiles approvingly.
  - *Mood*: Triumphant, accomplished, celebratory.

---

## 5. Development & Running

### Installation
```bash
npm install
```

### Local Development Server
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

### Audio Pipeline (Optional ElevenLabs Pre-generation)
```bash
# Provide VITE_ELEVENLABS_API_KEY in .env.local
npm run generate-audio
npm run clean-audio
```

---

## 6. Environment Variables

Create a `.env.local` file:
```env
VITE_ELEVENLABS_API_KEY=your_api_key_here
```
*(If no API key is provided, the engine safely skips narration without any robotic browser speech fallback, per platform specification).*
