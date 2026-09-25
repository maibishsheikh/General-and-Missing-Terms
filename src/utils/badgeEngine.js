// src/utils/badgeEngine.js
// Badge definitions and unlock triggers for ScrollQuest (Grade 7 Math)

export const BADGES = [
  {
    id: 'first_piece',
    icon: '🧩',
    label: 'First Piece Found',
    description: 'Answered your first artifact restoration question correctly!',
  },
  {
    id: 'steady_excavation',
    icon: '🖌️',
    label: 'Steady Excavation',
    description: 'Maintained steady focus with a streak of 5 correct answers!',
  },
  {
    id: 'restoration_streak',
    icon: '🔥',
    label: 'Restoration Streak',
    description: 'Blazed through an unbroken streak of 10 correct answers!',
  },
  {
    id: 'full_kit',
    icon: '🧰',
    label: 'Full Excavation Kit',
    description: 'Successfully mastered all 4 interactive simulation labs!',
  },
  {
    id: 'artifact_restored',
    icon: '⭐⭐⭐',
    label: 'Artifact Restored',
    description: 'Achieved a perfect 3-star rating in a Practice World!',
  },
  {
    id: 'mystery_solved',
    icon: '🏅',
    label: 'Mystery Solved',
    description: 'Defeated a World Boss in an archaeological showdown!',
  },
  {
    id: 'dedicated_archivist',
    icon: '📜',
    label: 'Dedicated Archivist',
    description: 'Restored over 20 questions across the ancient archives!',
  },
  {
    id: 'master_restorer',
    icon: '🏆',
    label: 'Master Restorer Badge',
    description: 'Completed the entire 5-phase ScrollQuest archaeological journey!',
  },
];

export function checkBadges(state) {
  const unlocked = [];

  // First correct answer
  const totalCorrect = state.districtCorrect?.reduce((s, c) => s + (c || 0), 0) || 0;
  if (totalCorrect >= 1) unlocked.push('first_piece');

  // Streak checks
  if (state.maxStreak >= 5) unlocked.push('steady_excavation');
  if (state.maxStreak >= 10) unlocked.push('restoration_streak');

  // Simulation completion (all 4 stations complete)
  if (state.simStationsComplete && state.simStationsComplete.every(Boolean)) {
    unlocked.push('full_kit');
  }

  // 3-star district check (>= 9 correct out of 10)
  if (state.districtScores && state.districtScores.some(score => score !== null && score >= 9)) {
    unlocked.push('artifact_restored');
  }

  // Centurion / 20+ questions answered in Practice
  if (state.currentQuestion >= 20 || totalCorrect >= 20) {
    unlocked.push('dedicated_archivist');
  }

  // Boss slayer / Mystery Solved
  if (state.bossDefeated || (state.badges && state.badges.includes('mystery_solved'))) {
    unlocked.push('mystery_solved');
  }

  // Full 5-phase journey complete
  if (state.phaseComplete && Object.values(state.phaseComplete).every(Boolean)) {
    unlocked.push('master_restorer');
  }

  return unlocked;
}
