// src/data/storyContent.js
// 4 Archaeological Narrative Story Panels for ScrollQuest (Grade 7 Math)

export const STORY_PANELS = [
  {
    panel: 0,
    title: "The Damaged Scroll 🏺",
    text: "Deep within the ruins of the Grand Archive, apprentices Kavya and Hafiz were assigned their very first joint restoration: a weathered parchment scroll with damaged sections where crucial numbers had flaked away into dust. 'Let's quickly derive the nth term formula T_n = an + b,' Kavya insisted, unrolling her calculation sheet. Hafiz shook his head: 'Wait! Look at the first gap — it's right between two known numbers! A quick term-to-term jump takes three seconds!' Before they could argue further, a slow, gentle voice echoed from the guild archives.",
    highlight: "🏺 Ancient Number-Scroll Unearthed · Two Restorers · Which tool gets this piece back fastest?",
    character: "Kavya & Hafiz",
    characterEmoji: "👧🏽🧑🏻",
    imageBg: "radial-gradient(circle, #c9a66b 0%, #8a5a44 100%)",
    imageEmoji: "📜",
  },
  {
    panel: 1,
    title: "Two Tools, One Toolkit 🛠️",
    text: "Relic the Tortoise plodded forward, peering through his magnifying spectacles at the fragile scroll. 'Peace, young restorers,' Relic smiled. 'You both carry true tools from the Guild. Hafiz carries Term-to-Term Checking: finding the common difference d and stepping forward or backward. Kavya carries the General Term Formula: substituting any position n directly into T_n = a + (n - 1)d. Neither tool is better in all cases. A master archaeologist knows that skill lies in reaching for the right tool at the right time.'",
    highlight: "🛠️ Tool A: Term-to-Term Checking (+d) · Tool B: General Term Formula T_n = a + (n - 1)d",
    character: "Relic the Tortoise",
    characterEmoji: "🐢",
    imageBg: "radial-gradient(circle, #7f5539 0%, #2b2118 100%)",
    imageEmoji: "🐢",
  },
  {
    panel: 2,
    title: "Choosing Wisely & Cross-Verifying ⏳",
    text: "'Here is the Guild's sacred efficiency rule,' Relic taught. 'If a gap is close — within 3 positions of a known number — term-to-term checking is lightning fast! But if the gap is far away at position 20 or 50, or scattered in a non-consecutive ledger, calculating term-by-term takes dozens of tedious steps — that is when Kavya's general term shines!' Relic tapped his shell firmly: 'And remember our golden Guild code: a restoration is never certified until you cross-verify your answer using the second method!'",
    highlight: "⏳ Close gap (≤ 3 steps) ➔ Term-to-Term · Far gap (> 3 steps) ➔ General Term · Always Cross-Verify!",
    character: "Relic the Tortoise",
    characterEmoji: "🧐",
    imageBg: "radial-gradient(circle, #e9c46a 0%, #b08968 100%)",
    imageEmoji: "⚖️",
  },
  {
    panel: 3,
    title: "The Guild's Verdict 🏆",
    text: "Working in tandem, Kavya and Hafiz inspected the ancient scroll. For Position 4, right next to Position 3's number 15, Hafiz added the difference of +4 to restore 19 in an instant. For Position 25, Kavya calculated T_25 = 4(25) + 3 = 103 without breaking a sweat! Then, each restorer independently checked the other's restored term using their alternate method. The numbers matched to perfection! The Grand Archivist stamped the parchment with the gold Guild Seal of Certification.",
    highlight: "🏆 Guild Certificate Granted · Both Gaps Restored & Cross-Verified · Ready for the Excavation!",
    character: "Kavya & Hafiz",
    characterEmoji: "🌟",
    imageBg: "radial-gradient(circle, #52b788 0%, #1e4620 100%)",
    imageEmoji: "🏆",
  },
];
