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
  { text: "Welcome to Station A — The Pattern Lab!", style: 'instruction' },
  { text: "Discover how number sequences grow, calculate the common difference d, and master term-to-term stepping with visual jump arrows!", style: 'instruction' },
  { text: "Welcome to Station B — The Formula Builder!", style: 'instruction' },
  { text: "When stepping takes too long, we need a formula! Discover how Tn = a + (n minus 1) times d works with our interactive derivation lab and calculator!", style: 'instruction' },
  { text: "Welcome to Station C — The Tool Workshop!", style: 'instruction' },
  { text: "Now you have both tools! Practice the Guild's sacred efficiency rule: use stepping for nearby gaps, and the formula for far gaps, then cross-verify!", style: 'instruction' },
  { text: "Welcome to Station D — The Scroll Restoration!", style: 'instruction' },
  { text: "Apply everything you've learned to restore the Grand Archive's ancient scroll, and inspect student claims to catch mathematical flaws!", style: 'instruction' },

  // ─── FEEDBACK, CLUES & REFLECT ─────────────────────────────────────────────
  { text: "Incredible restoration streak! You are an excavation legend! 🔥", style: 'celebration' },
  { text: "Outstanding! Three artifacts restored in a row! ⭐", style: 'celebration' },
  { text: "Spot on! The missing term is certified! 🏺", style: 'celebration' },
  { text: "Not quite — check the hint, inspect the step distance, and try again! 💡", style: 'thinking' },
  { text: "Here is your first clue: inspect the distance from the nearest known term!", style: 'statement' },
  { text: "Here is your second clue: check whether term-to-term stepping or the general term formula gives the fastest, cleanest calculation.", style: 'statement' },
  { text: "Spectacular archaeological work! You have certified this ancient world! 🏆", style: 'celebration' },
  { text: "The World Boss Battle begins! Answer correctly to restore the ancient relic and claim your badge! 👑", style: 'celebration' },
  { text: "Victory! You defeated the World Boss and certified the ancient archive! 🏆", style: 'celebration' },
  { text: "Welcome to the Curator's Reflection! Let's review the two headline Guild habits: choosing the most efficient tool, and never skipping cross-verification.", style: 'statement' },
  { text: "Congratulations! You have completed the full ScrollQuest journey and unlocked your Master Restorer Trophy! 🏆", style: 'celebration' },
];

function sanitizeFilename(text, idx) {
  const clean = text
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .trim()
    .replace(/\s+/g, '_')
    .slice(0, 32);
  return `scroll_${String(idx + 1).padStart(2, '0')}_${clean}.mp3`;
}

async function generateAll() {
  if (!apiKey) {
    console.error("❌ Cannot generate audio: VITE_ELEVENLABS_API_KEY is missing from .env.local");
    process.exit(1);
  }

  const outputDir = path.resolve('public/assets/audio');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log(`🎙️ Starting ElevenLabs Audio Generation with Voice ID: ${VOICE_ID}`);
  console.log(`📂 Output Directory: ${outputDir}`);
  console.log(`📋 Total Phrases: ${phrases.length}\n`);

  const audioMapping = {};
  let generated = 0;
  let skipped = 0;
  let failed = 0;

  for (let i = 0; i < phrases.length; i++) {
    const item = phrases[i];
    const filename = sanitizeFilename(item.text, i);
    const filePath = path.join(outputDir, filename);
    const publicPath = `/assets/audio/${filename}`;

    audioMapping[item.text] = publicPath;

    // Check if already exists and non-empty
    if (fs.existsSync(filePath) && fs.statSync(filePath).size > 1000) {
      console.log(`[${i + 1}/${phrases.length}] ⏭️  Skipped (already exists): ${filename}`);
      skipped++;
      continue;
    }

    console.log(`[${i + 1}/${phrases.length}] 🔊 Generating: "${item.text.slice(0, 45)}..."`);

    try {
      const settings = VOICE_SETTINGS[item.style] || VOICE_SETTINGS.statement;
      const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
        method: 'POST',
        headers: {
          'xi-api-key': apiKey,
          'Content-Type': 'application/json',
          'Accept': 'audio/mpeg',
        },
        body: JSON.stringify({
          text: item.text,
          model_id: VOICE_MODEL,
          voice_settings: settings,
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error(`  ❌ ElevenLabs Error (${res.status}): ${errText}`);
        failed++;
        continue;
      }

      const buffer = Buffer.from(await res.arrayBuffer());
      fs.writeFileSync(filePath, buffer);
      console.log(`  ✅ Saved: ${filename} (${buffer.length} bytes)`);
      generated++;

      // Small delay to be polite to rate limits
      await new Promise(r => setTimeout(r, 250));
    } catch (err) {
      console.error(`  ❌ Network/Processing Error: ${err.message}`);
      failed++;
    }
  }

  // Update src/utils/audioMap.js
  const audioMapPath = path.resolve('src/utils/audioMap.js');
  const fileContent = `// src/utils/audioMap.js
// Auto-generated static asset mapping for ElevenLabs narration audio in ScrollQuest

export const audioMap = ${JSON.stringify(audioMapping, null, 2)};

export default audioMap;
`;

  fs.writeFileSync(audioMapPath, fileContent, 'utf-8');
  console.log(`\n🎉 Done! Generated: ${generated}, Skipped: ${skipped}, Failed: ${failed}`);
  console.log(`📝 Updated audio map at: ${audioMapPath}`);
}

generateAll();

export { phrases };
