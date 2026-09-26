// scripts/generate_audio.js
// Offline pre-generation script for ElevenLabs narration audio files.
// Strictly follows audio_generation_pipeline (5).md specifications.

import fs from 'fs';
import path from 'path';

// Helper to read environment variables without external dependencies
function loadEnv() {
  const envFiles = ['.env.local', '.env'];
  for (const file of envFiles) {
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, 'utf-8');
      for (const line of content.split('\n')) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
          const [key, ...rest] = trimmed.split('=');
          const val = rest.join('=').replace(/^["']|["']$/g, '').trim();
          if (!process.env[key.trim()]) {
            process.env[key.trim()] = val;
          }
        }
      }
    }
  }
}

loadEnv();

const apiKey = process.env.VITE_ELEVENLABS_API_KEY || process.env.ELEVENLABS_API_KEY;
if (!apiKey) {
  console.log("\n⚠️ Note: VITE_ELEVENLABS_API_KEY is not defined. Offline generation skipped.");
  console.log("To pre-generate audio files, provide your key in .env.local: VITE_ELEVENLABS_API_KEY=your_key_here\n");
}

const VOICE_ID = 'Xb7hH8MSUJpSbSDYk0k2'; // Alice — Clear, Engaging Educator
const VOICE_MODEL = 'eleven_multilingual_v2';

const VOICE_SETTINGS = {
  statement:     { stability: 0.65, similarity_boost: 0.80, style: 0.30, use_speaker_boost: true },
  instruction:   { stability: 0.65, similarity_boost: 0.80, style: 0.30, use_speaker_boost: true },
  question:      { stability: 0.55, similarity_boost: 0.75, style: 0.50, use_speaker_boost: true },
  encouragement: { stability: 0.50, similarity_boost: 0.85, style: 0.60, use_speaker_boost: true },
  emphasis:      { stability: 0.75, similarity_boost: 0.90, style: 0.20, use_speaker_boost: true },
  thinking:      { stability: 0.70, similarity_boost: 0.78, style: 0.40, use_speaker_boost: true },
  celebration:   { stability: 0.45, similarity_boost: 0.85, style: 0.80, use_speaker_boost: true },
};

const phrases = [
  // ─── INTRO & WONDER ────────────────────────────────────────────────────────
  { text: "Welcome to ScrollQuest! Deep within the ruins of the Grand Archive, ancient number-scrolls have worn away.", style: 'statement' },
  { text: "You already know two restoration tools: term-to-term checking and the general term formula.", style: 'statement' },
  { text: "Which restoration tool do you reach for first to restore each piece fastest and most reliably?", style: 'question' },
  { text: "Let's enter the Guild workshop and investigate!", style: 'celebration' },

  // ─── STORY: PANEL 1 ────────────────────────────────────────────────────────
  { text: "Deep within the ruins of the Grand Archive, apprentices Kavya and Hafiz were assigned their very first joint restoration.", style: 'statement' },
  { text: "Crucial numbers had flaked away into dust.", style: 'statement' },
  { text: "Let's derive the general term formula T_n = an + b, Kavya insisted.", style: 'statement' },
  { text: "Hafiz shook his head: Look at the first gap — it is right between two known numbers! A quick term-to-term jump takes three seconds!", style: 'statement' },

  // ─── STORY: PANEL 2 ────────────────────────────────────────────────────────
  { text: "Relic the Tortoise plodded forward, peering through his magnifying spectacles.", style: 'statement' },
  { text: "You both carry true tools from the Guild. Hafiz carries term-to-term checking. Kavya carries the general term formula.", style: 'statement' },
  { text: "Neither tool is better in all cases. A master archaeologist knows that skill lies in reaching for the right tool at the right time.", style: 'statement' },

  // ─── STORY: PANEL 3 ────────────────────────────────────────────────────────
  { text: "Here is the Guild's sacred efficiency rule, Relic taught.", style: 'statement' },
  { text: "If a gap is close — within three positions of a known number — term-to-term checking is lightning fast!", style: 'statement' },
  { text: "If the gap is far away, or in a scattered ledger, deriving the general term formula is far faster.", style: 'statement' },
  { text: "And remember: a restoration is never certified until you cross-verify your answer, checking your answer two different ways!", style: 'statement' },

  // ─── STORY: PANEL 4 ────────────────────────────────────────────────────────
  { text: "Working in tandem, Kavya and Hafiz inspected the ancient scroll.", style: 'statement' },
  { text: "For position 4, right next to position 3, Hafiz stepped forward with term-to-term checking.", style: 'statement' },
  { text: "For position 25, Kavya calculated T_25 using the general term formula in a single calculation!", style: 'statement' },
  { text: "Both restorers cross-verified each other's terms. The Grand Archivist stamped the parchment with the gold Guild Seal of Certification!", style: 'celebration' },

  // ─── SIMULATE INTROS ───────────────────────────────────────────────────────
  { text: "Welcome to Station A — The Excavation Table!", style: 'instruction' },
  { text: "Drag the gap slider to compare term-to-term checking and the general term formula side-by-side. See how the faster tool changes as the gap moves further away!", style: 'instruction' },
  { text: "Welcome to Station B — Race Against the Sandstorm!", style: 'instruction' },
  { text: "A visual sandstorm is sweeping across the artifact! Select the efficient tool — would term-to-term checking or the general term be faster here? Then enter the restored number before the sand settles!", style: 'instruction' },
  { text: "Welcome to Station C — The Full Composite Restoration!", style: 'instruction' },
  { text: "An ancient composite artifact contains three different missing terms: an early gap, a middle gap, and a tabular ledger entry. Restore each gap and cross-verify your answer two different ways to certify the artifact!", style: 'instruction' },
  { text: "Welcome to Station D — The Forger's Fake Restoration!", style: 'instruction' },
  { text: "A rival restorer submitted claimed restorations containing hidden mathematical flaws. Inspect each step, tap the flawed step, and certify the correct Guild fix!", style: 'instruction' },

  // ─── FEEDBACK & REFLECT ────────────────────────────────────────────────────
  { text: "Incredible restoration streak! You are an excavation legend! 🔥", style: 'celebration' },
  { text: "Outstanding! Three artifacts restored in a row! ⭐", style: 'celebration' },
  { text: "Spot on! The missing term is certified! 🏺", style: 'celebration' },
  { text: "Not quite — check the hint, inspect the step distance, and try again! 💡", style: 'thinking' },
  { text: "Here is your first clue: inspect the distance from the nearest known term!", style: 'statement' },
  { text: "Here is your second clue: check whether term-to-term stepping or the general term formula gives the fastest, cleanest calculation.", style: 'statement' },
  { text: "Spectacular archaeological work! You have certified this ancient world! 🏆", style: 'celebration' },
  { text: "Welcome to the Curator's Reflection! Let's review the two headline Guild habits: choosing the most efficient tool, and never skipping cross-verification.", style: 'statement' },
  { text: "Congratulations! You have completed the full ScrollQuest journey and unlocked your Master Restorer Trophy! 🏆", style: 'celebration' },
];

export { phrases };
