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
  console.error("\n❌ Error: VITE_ELEVENLABS_API_KEY is not defined in .env.local or .env.");
  console.log("Please create a .env.local file with: VITE_ELEVENLABS_API_KEY=your_key_here\n");
  process.exit(1);
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
  // ─── INTRO ────────────────────────────────────────────────────────────────
  { text: "Welcome to MoneyQuest! Let's investigate the big money mystery!", style: 'celebration' },

  // ─── WONDER PHASE ────────────────────────────────────────────────────────
  { text: "If Oliver has a shiny two-dollar coin, three twenty-cent coins, and one ten-cent coin… that makes two dollars and seventy cents in total.", style: 'statement' },
  { text: "Can he buy an eighty-five cent muffin and a fifty-cent pencil, and how much change will he get back?", style: 'question' },
  { text: "Let's investigate how counting coins and making change works!", style: 'celebration' },

  // ─── STORY PHASE: PANEL 1 ────────────────────────────────────────────────
  { text: "Oliver had been saving up all week by helping with chores at home.", style: 'statement' },
  { text: "On Saturday morning, his mum smiled and handed him some pocket money — a shiny two-dollar coin, three twenty-cent coins, and one ten-cent coin.", style: 'statement' },
  { text: "How much money do I have altogether? Oliver wondered, spreading the coins out on the table.", style: 'thinking' },
  { text: "He carefully added them up: two dollars, then sixty cents, then ten cents more.", style: 'statement' },
  { text: "I have two dollars and seventy cents! he cheered proudly.", style: 'celebration' },

  // ─── STORY PHASE: PANEL 2 ────────────────────────────────────────────────
  { text: "At the school market, Oliver's eyes went wide at all the stalls.", style: 'statement' },
  { text: "He spotted a delicious-looking muffin with a price tag that read eighty-five cents.", style: 'statement' },
  { text: "Do I have enough money to buy it? he asked nervously.", style: 'question' },
  { text: "Emma, who was helping at the stall, grinned. It's simple! Your twenty-cent coins and ten-cent coin make seventy cents. You need eighty-five cents, so you need fifteen cents more.", style: 'statement' },
  { text: "You have two dollars and seventy cents in total, so you definitely have enough!", style: 'celebration' },

  // ─── STORY PHASE: PANEL 3 ────────────────────────────────────────────────
  { text: "Oliver decided to buy the muffin. He handed over his one-dollar coin.", style: 'statement' },
  { text: "Emma smiled and opened the till. Your muffin costs eighty-five cents, and you gave me one dollar. So I need to give you back the difference!", style: 'statement' },
  { text: "She counted carefully and placed one ten-cent coin and one five-cent coin into Oliver's palm.", style: 'statement' },
  { text: "That's fifteen cents change! Penny the Piggy Bank bounced excitedly. Change is the money you get back when you pay MORE than the price! One dollar minus eighty-five cents equals fifteen cents.", style: 'celebration' },

  // ─── STORY PHASE: PANEL 4 ────────────────────────────────────────────────
  { text: "By the end of the market day, Oliver had bought a muffin for eighty-five cents, a pencil for fifty cents, and a sticker pack for one dollar and twenty cents.", style: 'statement' },
  { text: "He spent two dollars and fifty-five cents in total! Starting with two dollars and seventy cents, he had fifteen cents left over.", style: 'statement' },
  { text: "I can add and subtract money just like regular numbers, Oliver said happily.", style: 'statement' },
  { text: "Emma high-fived him. You're a money master now, Oliver! Penny jingled with joy.", style: 'celebration' },

  // ─── SIMULATE STATION INTROS ─────────────────────────────────────────────
  { text: "Welcome to Station A — Coin Counter and Register Lab!", style: 'instruction' },
  { text: "Tap the coins in the tray to build the exact target amount shown. Tap any coin in your purse to remove it. Try using the fewest coins possible!", style: 'instruction' },
  { text: "Welcome to Station B — Supermarket Scanner and Price Matcher!", style: 'instruction' },
  { text: "Scan items on the market conveyor, see the prices print on your receipt, and solve the shopping budget challenges!", style: 'instruction' },
  { text: "Welcome to Station C — The Cashier Change Maker!", style: 'instruction' },
  { text: "You are the shopkeeper! A customer buys an item and pays with a larger coin or note. Calculate the change and dispense the exact coins from the till drawer!", style: 'instruction' },
  { text: "Welcome to Station D — Receipt Detective!", style: 'instruction' },
  { text: "Detective Penny has found receipts with change calculation errors. Inspect the receipt, spot the mistake, and fix the amount!", style: 'instruction' },

  // ─── FEEDBACK & HINTS ────────────────────────────────────────────────────
  { text: "Spot on! That's correct! 🎉", style: 'celebration' },
  { text: "Awesome! Three in a row! ⭐", style: 'celebration' },
  { text: "Incredible streak! You are unstoppable! 🔥", style: 'celebration' },
  { text: "Not quite — check the hint, count the coins carefully, and try again! 💡", style: 'thinking' },
  { text: "Here's your first hint! Look at the biggest coins or dollars first.", style: 'encouragement' },
  { text: "Here's your final clue! Break down the dollars and cents step by step.", style: 'encouragement' },

  // ─── DISTRICT & BOSS BATTLES ─────────────────────────────────────────────
  { text: "World Complete! Spectacular job on this money district! 🌟", style: 'celebration' },
  { text: "The Boss Battle begins! Answer correctly to defeat the boss and claim your badge!", style: 'emphasis' },
  { text: "Victory! You defeated the boss and claimed the World Badge! 👑", style: 'celebration' },

  // ─── REFLECT PHASE ───────────────────────────────────────────────────────
  { text: "Welcome to the Reflect Phase! Let's review the key money concepts and check your scorecard! 📓", style: 'statement' },
  { text: "Outstanding! You have mastered money, coins, notes, and making change! You are a true Money Master! 🏆", style: 'celebration' },
];

const outputDir = './public/assets/audio';
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

function cleanString(str) {
  return str.toLowerCase().replace(/[^a-z0-9]/g, '_').substring(0, 45).replace(/_+/g, '_').replace(/^_|_$/g, '');
}

async function main() {
  console.log(`\n🎙️ Starting ElevenLabs Audio Generation Pipeline`);
  console.log(`Voice ID: ${VOICE_ID} | Model: ${VOICE_MODEL}`);
  console.log(`Total phrases to process: ${phrases.length}\n`);

  const mapping = {};

  for (let i = 0; i < phrases.length; i++) {
    const { text, style } = phrases[i];
    const cleanText = cleanString(text);
    const fileName = `audio_${cleanText}_${i}.mp3`;
    const destPath = path.join(outputDir, fileName);

    const relativeWebPath = `/assets/audio/${fileName}`;
    mapping[text] = relativeWebPath;

    if (fs.existsSync(destPath)) {
      console.log(`[${i + 1}/${phrases.length}] ⏩ Skipped (already exists): ${fileName}`);
      continue;
    }

    console.log(`[${i + 1}/${phrases.length}] 🔊 Generating: "${text.substring(0, 40)}..." -> ${fileName}`);

    const settings = VOICE_SETTINGS[style] || VOICE_SETTINGS.statement;

    try {
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
        method: 'POST',
        headers: {
          'xi-api-key': apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          model_id: VOICE_MODEL,
          voice_settings: settings,
        }),
      });

      if (!response.ok) {
        const errBody = await response.text();
        throw new Error(`HTTP ${response.status}: ${errBody}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      fs.writeFileSync(destPath, buffer);
      console.log(`   ✅ Saved: ${destPath}`);
    } catch (e) {
      console.error(`   ❌ Failed to generate phrase "${text}":`, e.message);
    }
  }

  // Write mapping to src/utils/audioMap.js
  const mapContent = `// Auto-generated by generate_audio.js\n// Static asset mapping for offline generated narration phrases in MoneyQuest\n\nexport const audioMap = ${JSON.stringify(mapping, null, 2)};\n\nexport default audioMap;\n`;
  fs.writeFileSync('./src/utils/audioMap.js', mapContent);
  console.log("\n✨ Audio mapping updated in src/utils/audioMap.js!");
  console.log("🎉 Audio generation completed successfully!\n");
}

main().catch(console.error);
