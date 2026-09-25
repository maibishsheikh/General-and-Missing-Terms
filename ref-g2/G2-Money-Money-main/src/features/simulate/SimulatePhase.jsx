// src/features/simulate/SimulatePhase.jsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../../components/Button.jsx';
import { simulationStationNarration } from '../../utils/narration.js';

import CoinCounter from './simulations/CoinCounter.jsx';
import PriceMatcher from './simulations/PriceMatcher.jsx';
import ChangeCalculator from './simulations/ChangeCalculator.jsx';

const STATIONS = [
  { id: 0, icon: '🪙', title: 'Coin Counter',       subtitle: 'Tap coins to make the target amount',       Component: CoinCounter },
  { id: 1, icon: '🏷️', title: 'Price Matcher',      subtitle: 'Match each item to its price tag',          Component: PriceMatcher },
  { id: 2, icon: '💳', title: 'Change Calculator',  subtitle: 'Work out how much change Oliver gets back',  Component: ChangeCalculator },
];

function StarRow({ count }) {
  return (
    <div className="flex gap-1 justify-center my-1 text-lg">
      {[0, 1, 2].map((idx) => (
        <span
          key={idx}
          className={idx < count ? 'text-amber-400' : 'text-white/10'}
        >
          ★
        </span>
      ))}
    </div>
  );
}

export default function SimulatePhase({ onComplete, playNarration, stop }) {
  const [activeStation, setActiveStation] = useState(0);
  const [completed, setCompleted] = useState({}); // { stationId: stars }
  const [showDone, setShowDone] = useState(false);
  
  const narrationFiredRef = useRef({});

  useEffect(() => {
    // Fire station intro narration on first visit
    if (!showDone && !narrationFiredRef.current[activeStation]) {
      narrationFiredRef.current[activeStation] = true;
      const script = simulationStationNarration(activeStation);
      playNarration(script);
    }
  }, [activeStation, showDone, playNarration]);

  const handleStationComplete = (stars) => {
    stop();
    const nextCompleted = { ...completed, [activeStation]: stars };
    setCompleted(nextCompleted);

    // Check if all stations completed
    const allDone = STATIONS.every(s => nextCompleted[s.id] !== undefined);
    if (allDone) {
      setShowDone(true);
    } else {
      // Find next incomplete station
      const nextIncomplete = STATIONS.find(s => nextCompleted[s.id] === undefined);
      if (nextIncomplete) {
        setActiveStation(nextIncomplete.id);
      }
    }
  };

  const handleNextPhase = () => {
    stop();
    onComplete();
  };

  if (showDone) {
    const totalStars = Object.values(completed).reduce((sum, s) => sum + s, 0);
    return (
      <div className="simulate-screen">
        <motion.div
          className="sim-complete-card glass-card p-6 text-center"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <span className="text-4xl block mb-2">🧪</span>
          <h2 className="sim-title">Stations Complete!</h2>
          <p className="text-white/70 mb-6">You've successfully explored all hands-on money stations!</p>
          
          <div className="space-y-4 mb-8 bg-white/5 p-4 rounded-xl border border-white/10">
            {STATIONS.map((station) => (
              <div key={station.id} className="flex justify-between items-center px-2">
                <span className="font-semibold text-sm">{station.icon} {station.title}</span>
                <StarRow count={completed[station.id] || 0} />
              </div>
            ))}
            <div className="border-t border-white/10 pt-3 mt-3 flex justify-between items-center px-2 font-bold">
              <span>Total Stars</span>
              <span className="text-amber-400">{totalStars} / 9 ★</span>
            </div>
          </div>

          <Button variant="primary" size="lg" onClick={handleNextPhase}>
            Play! 🎮
          </Button>
        </motion.div>
      </div>
    );
  }

  const current = STATIONS.find(s => s.id === activeStation);
  const CurrentComponent = current.Component;

  return (
    <div className="simulate-screen">
      {/* Station Tabs */}
      <div className="station-selector">
        {STATIONS.map((station) => {
          const isCompleted = completed[station.id] !== undefined;
          const isActive = station.id === activeStation;
          return (
            <button
              key={station.id}
              className={`station-tab ${isActive ? 'active' : ''}`}
              onClick={() => {
                stop();
                setActiveStation(station.id);
              }}
            >
              <span className="station-tab-icon">{station.icon}</span>
              <span className="station-tab-label">
                {station.title} {isCompleted && '✓'}
              </span>
              {isCompleted && <StarRow count={completed[station.id]} />}
            </button>
          );
        })}
      </div>

      {/* Main Simulation Area */}
      <div className="simulate-card glass-card flex-1 w-full max-w-[580px]">
        <CurrentComponent
          onComplete={handleStationComplete}
          playNarration={playNarration}
          stop={stop}
        />
      </div>
    </div>
  );
}
