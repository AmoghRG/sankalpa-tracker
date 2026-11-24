import { useState, useEffect, useCallback } from 'react';
import { playChantSound, triggerHaptic } from '../utils/soundUtils';

export default function ZenModeModal({
  sankalpa,
  totalCount,
  soundEnabled,
  onAddCount,
  onClose,
}) {
  const [beadIndex, setBeadIndex] = useState(0); // 0 to 108
  const [sessionAdded, setSessionAdded] = useState(0);
  const [pulse, setPulse] = useState(false);

  const incrementBead = useCallback(() => {
    setBeadIndex((prev) => {
      const nextBead = prev + 1;
      setPulse(true);
      setTimeout(() => setPulse(false), 200);

      triggerHaptic([25]);

      if (nextBead === 108) {
        // Completed 1 full Mala
        if (soundEnabled) playChantSound('malaComplete');
        triggerHaptic([50, 50, 80]);
        return 0;
      } else {
        if (soundEnabled) playChantSound('bell');
        return nextBead;
      }
    });

    setSessionAdded((prev) => prev + 1);
    onAddCount(1);
  }, [soundEnabled, onAddCount]);

  // Keyboard navigation: Spacebar increments
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        incrementBead();
      } else if (e.code === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [incrementBead, onClose]);

  return (
    <div className="fixed inset-0 z-50 bg-zinc-950 flex flex-col justify-between p-6 select-none animate-fade-in text-white">
      {/* Top Header */}
      <div className="flex items-center justify-between max-w-xl mx-auto w-full pt-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{sankalpa.icon || '📿'}</span>
          <div>
            <h2 className="text-lg font-bold tracking-wide text-zinc-100">{sankalpa.name}</h2>
            <p className="text-xs text-amber-500/80 font-mono">Zen / Japa Meditation Mode</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-semibold rounded-xl border border-zinc-800 transition shadow"
        >
          Exit Zen (Esc)
        </button>
      </div>

      {/* Center Chanting Area */}
      <div className="flex flex-col items-center justify-center my-auto">
        {/* Sacred Mala Bead Ring Indicator */}
        <div className="relative flex items-center justify-center">
          {/* Outer Ripple */}
          <div
            className={`w-72 h-72 sm:w-80 sm:h-80 rounded-full border border-amber-500/20 absolute transition-all duration-300 ${
              pulse ? 'scale-110 border-amber-500/50' : 'scale-100'
            }`}
          />

          {/* Main Tap Circle */}
          <button
            onClick={incrementBead}
            className={`w-64 h-64 sm:w-72 sm:h-72 rounded-full bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 border-2 border-amber-500/40 hover:border-amber-500 flex flex-col items-center justify-center transition-all duration-150 shadow-[0_0_50px_rgba(245,158,11,0.15)] active:scale-95 cursor-pointer ${
              pulse ? 'scale-95 shadow-[0_0_70px_rgba(245,158,11,0.3)]' : ''
            }`}
          >
            <span className="text-xs uppercase tracking-widest text-amber-400/80 font-semibold mb-1">
              Bead
            </span>
            <span className="text-6xl sm:text-7xl font-extrabold text-amber-200 tracking-tight font-mono">
              {beadIndex}
            </span>
            <span className="text-xs text-zinc-400 mt-1 font-mono">/ 108 Mala</span>

            <span className="text-[11px] text-zinc-400 mt-4 px-3 py-1 bg-zinc-800/80 rounded-full">
              Tap or press Space
            </span>
          </button>
        </div>

        {/* Total stats in sitting */}
        <div className="mt-8 flex items-center gap-6 text-center">
          <div>
            <div className="text-xs text-zinc-400 font-medium">This Sitting</div>
            <div className="text-2xl font-bold text-amber-300 font-mono">+{sessionAdded}</div>
          </div>

          <div className="h-8 w-px bg-zinc-800" />

          <div>
            <div className="text-xs text-zinc-400 font-medium">Total Accumulated</div>
            <div className="text-2xl font-bold text-white font-mono">{totalCount}</div>
          </div>
        </div>
      </div>

      {/* Bottom Hint */}
      <div className="text-center text-xs text-zinc-400 pb-2">
        Maintain slow, mindful breath with each chant. Tap to advance each bead.
      </div>
    </div>
  );
}
