// src/core/questions/questionFactory.js
import { WORLDS } from '../../config/worlds.config.js';
import { generateQuestions } from './questionBank.js';

let _sessionCache = {};

export function resetSession() {
  _sessionCache = {};
}

export function generateModeQuestions(worldId, count) {
  const world = WORLDS.find(w => w.id === worldId);
  if (!world) return [];
  return generateQuestions(world.conceptFocus, count);
}

export { getReflectQuestions } from './questionBank.js';
