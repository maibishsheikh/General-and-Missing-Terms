// src/features/story/StoryPhase.jsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../../components/Button.jsx';
import CharacterDialogue from './CharacterDialogue.jsx';
import { STORY_SLIDES } from './storyScripts/slides.js';
import { storyNarrations } from '../../utils/narration.js';

import story1 from '../../assets/story/1.png';
import story2 from '../../assets/story/2.png';
import story3 from '../../assets/story/3.png';
import story4 from '../../assets/story/4.png';

const SLIDE_IMAGES = [story1, story2, story3, story4];

function SlideImage({ src, alt }) {
  const [errored, setErrored] = useState(false);
  useEffect(() => { setErrored(false); }, [src]);

  if (errored || !src) {
    return (
      <div className="story-image-placeholder">
        <span className="story-image-placeholder-icon">🖼️</span>
        <span>Image coming soon</span>
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      className="story-image"
      onError={() => setErrored(true)}
    />
  );
}

export default function StoryPhase({ onComplete, playNarration, stop }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const narrationSlideRef = useRef(-1);

  useEffect(() => {
    // Play narration for the current slide
    if (narrationSlideRef.current !== currentSlide) {
      narrationSlideRef.current = currentSlide;
      const slides = storyNarrations.oliverMarketDay;
      if (slides && slides[currentSlide]) {
        playNarration([slides[currentSlide]]);
      }
    }
  }, [currentSlide, playNarration]);

  const handleNext = () => {
    if (currentSlide < STORY_SLIDES.length - 1) {
      setCurrentSlide(prev => prev + 1);
    } else {
      stop();
      onComplete();
    }
  };

  const handleBack = () => {
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
    }
  };

  const slide = STORY_SLIDES[currentSlide];

  return (
    <div className="story-screen">
      <div className="story-card glass-card">
        {/* Slide Image Frame */}
        <div className="story-image-full">
          <SlideImage src={SLIDE_IMAGES[currentSlide]} alt={slide.title} />
        </div>

        {/* Slide Content */}
        <div className="story-content">
          <h2 className="story-title text-amber-400">{slide.title}</h2>
          <p className="story-body">{slide.text}</p>

          {slide.highlight && (
            <div className="story-highlight">
              {slide.highlight}
            </div>
          )}

          <CharacterDialogue slideIdx={currentSlide} />
        </div>

        {/* Navigation Controls */}
        <div className="story-nav">
          <Button
            variant="outline"
            size="sm"
            onClick={handleBack}
            disabled={currentSlide === 0}
          >
            Back
          </Button>

          <div className="flex flex-col items-center gap-1">
            <div className="story-dots">
              {STORY_SLIDES.map((_, idx) => (
                <button
                  key={idx}
                  className={`story-dot ${idx === currentSlide ? 'active' : ''}`}
                  onClick={() => setCurrentSlide(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
            <span className="text-[10px] text-white/40 font-semibold font-mono">
              {currentSlide + 1} / {STORY_SLIDES.length}
            </span>
          </div>

          <Button
            variant={currentSlide === STORY_SLIDES.length - 1 ? 'green' : 'primary'}
            size="sm"
            onClick={handleNext}
          >
            {currentSlide === STORY_SLIDES.length - 1 ? 'Simulate! 🧪' : 'Next'}
          </Button>
        </div>
      </div>
    </div>
  );
}
