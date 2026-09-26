// src/utils/narration.js
// Narration script builder for ScrollQuest (Grade 7 Math)
// Adheres strictly to PRD §11 rules:
// - "general term" and "term-to-term" always named as a pair when offered as a choice
// - "cross-verify" paired with "checking your answer two different ways" on first use
// - Table entries read with both position and value stated
// - Gaps announced as "the missing term at position n"
// - 1:1 strict parity with on-screen text

export const say       = (text) => ({ text, style: 'statement' });
export const ask       = (text) => ({ text, style: 'question' });
export const cheer     = (text) => ({ text, style: 'celebration' });
export const emphasize = (text) => ({ text, style: 'emphasis' });
export const think     = (text) => ({ text, style: 'thinking' });
export const instruct  = (text) => ({ text, style: 'instruction' });
export const encourage = (text) => ({ text, style: 'encouragement' });

export function wonderNarration() {
  return [
    say("Welcome to ScrollQuest! Deep within the ruins of the Grand Archive, ancient number-scrolls have worn away."),
    say("You already know two restoration tools: term-to-term checking and the general term formula."),
    ask("Which restoration tool do you reach for first to restore each piece fastest and most reliably?"),
    cheer("Let's enter the Guild workshop and investigate!"),
  ];
}

export function storyNarration(panel) {
  const scripts = [
    [
      say("Deep within the ruins of the Grand Archive, apprentices Kavya and Hafiz were assigned their very first joint restoration."),
      say("Crucial numbers had flaked away into dust."),
      say("Let's derive the general term formula T_n = an + b, Kavya insisted."),
      say("Hafiz shook his head: Look at the first gap — it is right between two known numbers! A quick term-to-term jump takes three seconds!"),
    ],
    [
      say("Relic the Tortoise plodded forward, peering through his magnifying spectacles."),
      say("You both carry true tools from the Guild. Hafiz carries term-to-term checking. Kavya carries the general term formula."),
      say("Neither tool is better in all cases. A master archaeologist knows that skill lies in reaching for the right tool at the right time."),
    ],
    [
      say("Here is the Guild's sacred efficiency rule, Relic taught."),
      say("If a gap is close — within three positions of a known number — term-to-term checking is lightning fast!"),
      say("If the gap is far away, or in a scattered ledger, deriving the general term formula is far faster."),
      say("And remember: a restoration is never certified until you cross-verify your answer, checking your answer two different ways!"),
    ],
    [
      say("Working in tandem, Kavya and Hafiz inspected the ancient scroll."),
      say("For position 4, right next to position 3, Hafiz stepped forward with term-to-term checking."),
      say("For position 25, Kavya calculated T_25 using the general term formula in a single calculation!"),
      cheer("Both restorers cross-verified each other's terms. The Grand Archivist stamped the parchment with the gold Guild Seal of Certification!"),
    ],
  ];

  return scripts[panel] || scripts[0];
}

export function simStationIntro(stationIdx) {
  const intros = [
    [
      instruct("Welcome to Station A — The Excavation Table!"),
      instruct("Drag the gap slider to compare term-to-term checking and the general term formula side-by-side. See how the faster tool changes as the gap moves further away!"),
    ],
    [
      instruct("Welcome to Station B — Race Against the Sandstorm!"),
      instruct("A visual sandstorm is sweeping across the artifact! Select the efficient tool — would term-to-term checking or the general term be faster here? Then enter the restored number before the sand settles!"),
    ],
    [
      instruct("Welcome to Station C — The Full Composite Restoration!"),
      instruct("An ancient composite artifact contains three different missing terms: an early gap, a middle gap, and a tabular ledger entry. Restore each gap and cross-verify your answer two different ways to certify the artifact!"),
    ],
    [
      instruct("Welcome to Station D — The Forger's Fake Restoration!"),
      instruct("A rival restorer submitted claimed restorations containing hidden mathematical flaws. Inspect each step, tap the flawed step, and certify the correct Guild fix!"),
    ],
  ];

  return intros[stationIdx] || intros[0];
}

export function playQuestionNarration(questionText) {
  return [
    ask(questionText)
  ];
}

export function playCorrectNarration(streak = 1) {
  if (streak >= 5) {
    return [cheer("Incredible restoration streak! You are an excavation legend! 🔥")];
  }
  if (streak >= 3) {
    return [cheer("Outstanding! Three artifacts restored in a row! ⭐")];
  }
  return [cheer("Spot on! The missing term is certified! 🏺")];
}

export function playWrongNarration() {
  return [
    think("Not quite — check the hint, inspect the step distance, and try again! 💡")
  ];
}

export function playHint1Narration() {
  return [
    say("Here is your first clue: inspect the distance from the nearest known term!")
  ];
}

export function playHint2Narration() {
  return [
    say("Here is your second clue: check whether term-to-term stepping or the general term formula gives the fastest, cleanest calculation.")
  ];
}

export function districtCompleteNarration() {
  return [
    cheer("Spectacular archaeological work! You have certified this ancient world! 🏆")
  ];
}

export function bossStartNarration() {
  return [
    cheer("The World Boss Battle begins! Answer correctly to restore the ancient relic and claim your badge! 👑")
  ];
}

export function bossWinNarration() {
  return [
    cheer("Victory! You defeated the World Boss and certified the ancient archive! 🏆")
  ];
}

export function reflectNarration() {
  return [
    say("Welcome to the Curator's Reflection! Let's review the two headline Guild habits: choosing the most efficient tool, and never skipping cross-verification.")
  ];
}

export function reflectCompleteNarration() {
  return [
    cheer("Congratulations! You have completed the full ScrollQuest journey and unlocked your Master Restorer Trophy! 🏆")
  ];
}
