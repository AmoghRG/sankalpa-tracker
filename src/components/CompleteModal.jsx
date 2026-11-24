import { useState } from 'react';
import { toDateKey, formatDisplayDate } from '../utils/dateUtils';
import { playChantSound } from '../utils/soundUtils';

export default function CompleteModal({
  sankalpa,
  totalCount,
  timeline,
  streaks,
  soundEnabled,
  onConfirmArchive,
  onClose,
}) {
  const [reflectionNote, setReflectionNote] = useState('');

  const handleSeal = (e) => {
    e.preventDefault();
    if (soundEnabled) playChantSound('malaComplete');

    const archiveRecord = {
      ...sankalpa,
      id: `archived_${sankalpa.id}_${Date.now()}`,
      originalId: sankalpa.id,
      completedAt: Date.now(),
      completedDate: toDateKey(),
      totalCompletedCount: totalCount,
      longestStreak: streaks.longestStreak,
      timelineStartDate: timeline.startDateKey,
      timelineEndDate: timeline.endDateKey || toDateKey(),
      reflectionNote: reflectionNote.trim(),
      cycleNumber: sankalpa.cycleNumber || 1,
    };

    onConfirmArchive(archiveRecord);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in text-white overflow-y-auto">
      <div className="bg-zinc-900 border border-amber-500/40 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative overflow-hidden my-8">
        {/* Ambient golden aura behind modal */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative text-center">
          <div className="inline-block p-4 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-2xl border border-amber-500/30 text-4xl shadow-inner mb-3">
            {sankalpa.icon || '🚩'}
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-amber-200 tracking-tight">
            Sankalpa Siddhi Accomplished!
          </h2>
          <p className="text-xs sm:text-sm text-zinc-300 mt-1 max-w-sm mx-auto">
            You have successfully completed your vow of <strong className="text-white">{sankalpa.name}</strong>.
          </p>

          {/* Siddhi Summary Card */}
          <div
            id="siddhi-card"
            className="mt-6 p-5 rounded-2xl bg-zinc-950/80 border border-amber-500/30 text-left shadow-lg relative"
          >
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{sankalpa.icon || '🚩'}</span>
                <div>
                  <h3 className="font-bold text-white text-base leading-tight">{sankalpa.name}</h3>
                  <span className="text-[11px] text-amber-400 font-mono">
                    Cycle #{sankalpa.cycleNumber || 1} • Fulfilled
                  </span>
                </div>
              </div>
              <span className="text-xs px-2.5 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full font-bold">
                100% Siddhi
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 my-4 text-center">
              <div className="bg-zinc-900/80 p-2.5 rounded-xl border border-zinc-800">
                <div className="text-[10px] text-zinc-400 uppercase font-semibold">Chants</div>
                <div className="text-lg font-black text-amber-200 mt-0.5">{totalCount}</div>
              </div>
              <div className="bg-zinc-900/80 p-2.5 rounded-xl border border-zinc-800">
                <div className="text-[10px] text-zinc-400 uppercase font-semibold">Duration</div>
                <div className="text-lg font-black text-zinc-200 mt-0.5">{sankalpa.durationDays}d</div>
              </div>
              <div className="bg-zinc-900/80 p-2.5 rounded-xl border border-zinc-800">
                <div className="text-[10px] text-zinc-400 uppercase font-semibold">Best Streak</div>
                <div className="text-lg font-black text-orange-400 mt-0.5">🔥 {streaks.longestStreak}d</div>
              </div>
            </div>

            <div className="text-xs text-zinc-400 flex items-center justify-between pt-2 border-t border-zinc-800/80 font-mono">
              <span>Timeline:</span>
              <span className="text-zinc-200">
                {timeline.hasStart ? `${timeline.startDateFormatted} → ${formatDisplayDate(toDateKey())}` : 'Self-Paced'}
              </span>
            </div>

            {/* Sacred Mantra Quote */}
            <div className="mt-3 p-2.5 rounded-lg bg-amber-950/20 border border-amber-500/20 text-center">
              <p className="text-[11px] italic text-amber-300/90 font-serif">
                &ldquo;Sankalpam Siddhirastu — May your dedicated tapasya bestow lasting clarity, peace, and auspicious blessings.&rdquo;
              </p>
            </div>
          </div>

          {/* Form to Seal and Archive */}
          <form onSubmit={handleSeal} className="mt-5 text-left space-y-4">
            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-1">
                Dedication & Reflection Note (Optional)
              </label>
              <textarea
                rows="3"
                value={reflectionNote}
                onChange={(e) => setReflectionNote(e.target.value)}
                placeholder="e.g. Completed with regular morning japa; felt immense inner strength and grounding..."
                className="w-full bg-zinc-950 border border-zinc-800 p-3 rounded-xl text-white text-xs focus:border-amber-500 focus:outline-none placeholder:text-zinc-600"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium rounded-xl transition order-2 sm:order-1"
              >
                Keep Active for Now
              </button>

              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 hover:from-amber-400 hover:to-orange-400 text-zinc-950 font-extrabold text-xs rounded-xl shadow-lg transition active:scale-95 flex items-center justify-center gap-2 order-1 sm:order-2"
              >
                <span>📜</span>
                <span>Seal & Save to History</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
