// src/core/audio/useAudio.js
import { useState, useCallback } from 'react';
import {
  narrate,
  speak,
  stopAudio,
  setMuted,
  isMuted,
} from '../../utils/audio.js';

/**
 * useAudio — hook that manages audio state and exposes playNarration / stop.
 */
export function useAudio() {
  const [audioEnabled, setAudioEnabled] = useState(true);

  const toggleAudio = useCallback(() => {
    const newVal = !audioEnabled;
    setAudioEnabled(newVal);
    setMuted(!newVal);
    if (!newVal) stopAudio();
  }, [audioEnabled]);

  const playNarration = useCallback(
    (segments) => {
      if (!audioEnabled) return;
      narrate(segments);
    },
    [audioEnabled]
  );

  const stop = useCallback(() => {
    stopAudio();
  }, []);

  return { audioEnabled, toggleAudio, playNarration, stop };
}
