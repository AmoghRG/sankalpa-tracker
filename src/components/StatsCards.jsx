import { useState } from 'react';

export default function StatsCards({
  sankalpaName,
  totalCount,
  goalCount,
  percentage,
  remaining,
  todaySessions,
  todayCount,
  todayDateKey,
  streaks,
  pace,
  onAddCount,
  onUndoLast,
  onDeleteSession,
  canUndo,
  lastSessionInfo,
}) {
  const [pulse, setPulse] = useState(false);

  const handleIncrement = (amount) => {
    setPulse(true);
    setTimeout(() => setPulse(false), 300);
    onAddCount(amount);
  };

  const isCompleted = totalCount >= goalCount;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {/* 1. Progress Card */}
      <div className="bg-zinc-900 border border-zinc-800/80 rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden shadow-lg">
        {/* Glow behind progress */}
        <div
          className="absolute -top-12 -right-12 w-32 h-32 rounded-full blur-3xl pointer-events-none"
          style={{
            backgroundColor: isCompleted ? 'rgba(34, 197, 94, 0.15)' : 'rgba(245, 158, 11, 0.15)',
          }}
        />

        <div>
          <div className="flex items-center justify-between text-zinc-400 text-sm mb-2">
            <span className="font-medium tracking-wide">Overall Progress</span>
            {isCompleted && (
              <span className="text-xs font-semibold px-2 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full">
                Sankalpa Siddhi 🚩
              </span>
            )}
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-5xl font-black tracking-tight text-white">{percentage}%</span>
            <span className="text-zinc-400 text-lg font-medium">
              {totalCount} / {goalCount}
            </span>
          </div>

          <p className="text-zinc-400 text-sm mt-1">
            {isCompleted ? (
              <span className="text-emerald-400 font-medium">Goal fulfilled! Blessings accrued.</span>
            ) : (
              <span>Remaining: <strong className="text-zinc-200">{remaining}</strong> recitations</span>
            )}
          </p>
        </div>

        {/* Milestone Progress Bar */}
        <div className="mt-6">
          <div className="w-full bg-zinc-950 rounded-full h-3.5 p-0.5 border border-zinc-800/80 relative">
            <div
              className={`h-full rounded-full transition-all duration-500 ease-out ${
                isCompleted
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-400 shadow-[0_0_12px_rgba(16,185,129,0.5)]'
                  : 'bg-gradient-to-r from-amber-600 via-orange-500 to-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.4)]'
              }`}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>

          {/* Milestones markers */}
          <div className="flex justify-between text-[10px] text-zinc-400 mt-2 px-1 font-mono">
            <span>0%</span>
            <span>25%</span>
            <span>50%</span>
            <span>75%</span>
            <span className={percentage >= 100 ? 'text-emerald-400 font-bold' : ''}>100%</span>
          </div>
        </div>
      </div>

      {/* 2. Action / Counter Card */}
      <div className="bg-zinc-900 border border-zinc-800/80 rounded-2xl p-6 flex flex-col justify-between shadow-lg">
        <div>
          <div className="text-zinc-400 text-sm font-medium mb-3 flex items-center justify-between">
            <span>Log Chants</span>
            <span className="text-xs text-amber-500/90 font-mono">Tap to count</span>
          </div>

          {/* Primary +1 Button */}
          <button
            onClick={() => handleIncrement(1)}
            className={`w-full py-4 px-6 rounded-xl font-bold text-lg text-zinc-950 transition-all transform active:scale-95 shadow-md flex items-center justify-center gap-2 ${
              pulse ? 'scale-[1.02] shadow-orange-500/40' : ''
            } bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 hover:from-amber-400 hover:to-orange-400`}
          >
            <span className="text-xl">+1</span>
            <span className="truncate">{sankalpaName}</span>
          </button>

          {/* Multi-Count / Mala Shortcuts */}
          <div className="mt-3">
            <div className="text-[11px] text-zinc-400 font-medium mb-1.5 text-center">
              Quick Count & Mala Chants
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {[
                { label: '+3', count: 3 },
                { label: '+5', count: 5 },
                { label: '+11', count: 11 },
                { label: '📿 108', count: 108, tooltip: '1 Mala' },
              ].map(({ label, count: incCount, tooltip }) => (
                <button
                  key={label}
                  type="button"
                  title={tooltip || `Add ${incCount}`}
                  onClick={() => handleIncrement(incCount)}
                  className="py-2 px-1 text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-amber-200 border border-zinc-700/60 rounded-lg transition active:scale-95 text-center"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Undo Button */}
        <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between">
          <button
            onClick={onUndoLast}
            disabled={!canUndo}
            className={`text-xs transition flex items-center gap-1.5 ${
              canUndo
                ? 'text-zinc-400 hover:text-white cursor-pointer'
                : 'text-zinc-600 cursor-not-allowed'
            }`}
          >
            <span>↩ Undo Last</span>
            {lastSessionInfo && (
              <span className="text-[10px] text-zinc-400">({lastSessionInfo})</span>
            )}
          </button>

          <span className="text-[11px] text-zinc-400">Audio chime enabled</span>
        </div>
      </div>

      {/* 3. Today & Consistency Card */}
      <div className="bg-zinc-900 border border-zinc-800/80 rounded-2xl p-6 flex flex-col justify-between shadow-lg">
        <div>
          <div className="flex items-center justify-between text-zinc-400 text-sm mb-1">
            <span className="font-medium">Today's Practice</span>
            <span className="text-xs font-mono text-amber-400/90">{todayDateKey}</span>
          </div>

          <div className="flex items-baseline justify-between mt-2">
            <div className="text-3xl font-extrabold text-white">
              {todayCount}{' '}
              <span className="text-sm font-normal text-zinc-400">
                {todayCount === 1 ? 'recitation' : 'recitations'}
              </span>
            </div>

            {/* Streak Indicator */}
            <div className="flex items-center gap-1.5 bg-orange-950/40 border border-orange-500/30 px-2.5 py-1 rounded-lg">
              <span className="text-orange-400 text-sm">🔥</span>
              <div className="text-left">
                <span className="text-xs font-bold text-orange-200 block leading-tight">
                  {streaks.currentStreak} {streaks.currentStreak === 1 ? 'day' : 'days'}
                </span>
                <span className="text-[9px] text-orange-400/70 uppercase">Streak</span>
              </div>
            </div>
          </div>

          {/* Daily Pace Requirement */}
          <div className="mt-3 py-2 px-3 bg-zinc-950/60 rounded-lg border border-zinc-800 text-xs flex items-center gap-2">
            <span className="text-amber-400 text-sm">🎯</span>
            <span className="text-zinc-300 font-medium">{pace.message}</span>
          </div>
        </div>

        {/* Scrollable list of today's sessions */}
        <div className="mt-4 pt-3 border-t border-zinc-800">
          <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-2 flex justify-between">
            <span>Logged Today ({todaySessions.length})</span>
            {streaks.longestStreak > 0 && (
              <span className="normal-case text-zinc-400">Best: {streaks.longestStreak} days</span>
            )}
          </div>

          {todaySessions.length === 0 ? (
            <p className="text-xs text-zinc-400 italic py-2">No sessions logged yet today.</p>
          ) : (
            <div className="max-h-24 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
              {todaySessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between text-xs py-1 px-2 rounded bg-zinc-800/60 hover:bg-zinc-800 transition"
                >
                  <div className="flex items-center gap-1.5 font-mono text-zinc-300">
                    <span>{session.time}</span>
                    {session.tag && (
                      <span className="text-[10px] text-zinc-400 font-sans">
                        • {session.tag}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-amber-400 font-medium">
                      +{session.count || 1}
                    </span>
                    <button
                      onClick={() => onDeleteSession(session.id)}
                      className="text-zinc-400 hover:text-red-400 text-[10px]"
                      title="Remove this log"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
