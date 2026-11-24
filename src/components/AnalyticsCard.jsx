import { useState } from 'react';
import { toDateKey } from '../utils/dateUtils';

export default function AnalyticsCard({ sessions, timeline, totalCount }) {
  const [isOpen, setIsOpen] = useState(true);

  // 1. Time-of-Day Analysis
  let morning = 0;
  let afternoon = 0;
  let sandhya = 0;
  let night = 0;

  sessions.forEach((s) => {
    const c = Number(s.count) || 1;
    let hour = 8; // fallback
    if (s.time) {
      const parts = s.time.split(':');
      if (parts.length >= 1) hour = parseInt(parts[0], 10) || 8;
    }
    if (hour >= 4 && hour < 12) morning += c;
    else if (hour >= 12 && hour < 17) afternoon += c;
    else if (hour >= 17 && hour < 21) sandhya += c;
    else night += c;
  });

  const totalTagged = morning + afternoon + sandhya + night || 1;
  const morningPct = Math.round((morning / totalTagged) * 100);
  const afternoonPct = Math.round((afternoon / totalTagged) * 100);
  const sandhyaPct = Math.round((sandhya / totalTagged) * 100);
  const nightPct = Math.round((night / totalTagged) * 100);

  // Determine peak period
  const periods = [
    { name: 'Morning (Brahma Muhurta)', pct: morningPct, icon: '🌅' },
    { name: 'Evening (Sandhya)', pct: sandhyaPct, icon: '🪔' },
    { name: 'Afternoon (Madhyahna)', pct: afternoonPct, icon: '☀️' },
    { name: 'Night (Ratri)', pct: nightPct, icon: '🌙' },
  ].sort((a, b) => b.pct - a.pct);

  const peakPeriod = periods[0];

  // 2. Last 7 Days Activity Matrix
  const today = new Date();
  const last7Days = [];
  const sessionCountByDate = {};

  sessions.forEach((s) => {
    sessionCountByDate[s.date] = (sessionCountByDate[s.date] || 0) + (Number(s.count) || 1);
  });

  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = toDateKey(d);
    const dayName = d.toLocaleDateString('en-GB', { weekday: 'short' });
    const count = sessionCountByDate[key] || 0;
    last7Days.push({ key, dayName, count, isToday: i === 0 });
  }

  const maxLast7 = Math.max(...last7Days.map((d) => d.count), 5);

  // 3. Overall Pace & Consistency
  const daysElapsed = Math.max(timeline.currentDay || 1, 1);
  const avgPerDay = (totalCount / daysElapsed).toFixed(1);

  // Consistency: days with >= 1 session vs days elapsed
  const uniqueDatesCount = new Set(sessions.map((s) => s.date)).size;
  const consistencyPct = timeline.hasStart
    ? Math.min(Math.round((uniqueDatesCount / Math.max(timeline.currentDay, 1)) * 100), 100)
    : 100;

  return (
    <div className="bg-zinc-900 border border-zinc-800/80 rounded-2xl p-6 shadow-xl mt-6 transition">
      {/* Header with expand toggle */}
      <div className="flex items-center justify-between cursor-pointer select-none" onClick={() => setIsOpen(!isOpen)}>
        <div className="flex items-center gap-2.5">
          <span className="text-xl">📊</span>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <span>Sadhana Insights & Rhythm</span>
              <span className="text-[10px] px-2 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full font-mono">
                Analytics
              </span>
            </h2>
            <p className="text-xs text-zinc-400">Timing patterns, consistency, and daily pace</p>
          </div>
        </div>

        <button className="text-zinc-400 hover:text-white text-xs px-2.5 py-1 bg-zinc-800 rounded-lg border border-zinc-700/60">
          {isOpen ? 'Collapse ▲' : 'Expand ▼'}
        </button>
      </div>

      {isOpen && (
        <div className="mt-6 pt-5 border-t border-zinc-800/80 space-y-6 animate-fade-in">
          {/* Quick Metrics Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-zinc-950/70 p-3.5 rounded-xl border border-zinc-800/80">
              <span className="text-[10px] text-zinc-400 uppercase font-semibold block">Average Pace</span>
              <div className="text-xl font-black text-amber-300 mt-1">
                {avgPerDay} <span className="text-xs font-normal text-zinc-400">/ day</span>
              </div>
              <span className="text-[10px] text-zinc-400">Across {daysElapsed} active days</span>
            </div>

            <div className="bg-zinc-950/70 p-3.5 rounded-xl border border-zinc-800/80">
              <span className="text-[10px] text-zinc-400 uppercase font-semibold block">Consistency</span>
              <div className="text-xl font-black text-orange-400 mt-1">
                {consistencyPct}%
              </div>
              <span className="text-[10px] text-zinc-400">{uniqueDatesCount} days practiced</span>
            </div>

            <div className="bg-zinc-950/70 p-3.5 rounded-xl border border-zinc-800/80">
              <span className="text-[10px] text-zinc-400 uppercase font-semibold block">Total Sittings</span>
              <div className="text-xl font-black text-white mt-1">
                {sessions.length}
              </div>
              <span className="text-[10px] text-zinc-400">Prayer sessions</span>
            </div>

            <div className="bg-zinc-950/70 p-3.5 rounded-xl border border-zinc-800/80">
              <span className="text-[10px] text-zinc-400 uppercase font-semibold block">Peak Rhythm</span>
              <div className="text-base font-bold text-amber-200 mt-1 truncate flex items-center gap-1">
                <span>{peakPeriod.icon}</span>
                <span className="text-sm truncate">{peakPeriod.name.split(' ')[0]}</span>
              </div>
              <span className="text-[10px] text-zinc-400">{peakPeriod.pct}% of your chants</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* 1. Time of Day Distribution Bar */}
            <div className="bg-zinc-950/50 p-4 rounded-xl border border-zinc-800/80 flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-bold text-zinc-200 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <span>⏰</span> When You Chant (Time of Day)
                </h3>

                {/* Multi-segment progress bar */}
                <div className="w-full h-3 bg-zinc-900 rounded-full flex overflow-hidden border border-zinc-800 my-3">
                  <div style={{ width: `${morningPct}%` }} className="bg-amber-400" title={`Morning: ${morningPct}%`} />
                  <div style={{ width: `${afternoonPct}%` }} className="bg-orange-500" title={`Afternoon: ${afternoonPct}%`} />
                  <div style={{ width: `${sandhyaPct}%` }} className="bg-rose-500" title={`Sandhya: ${sandhyaPct}%`} />
                  <div style={{ width: `${nightPct}%` }} className="bg-indigo-500" title={`Night: ${nightPct}%`} />
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-zinc-300 mt-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    <span>🌅 Morning: <strong>{morningPct}%</strong> ({morning})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                    <span>☀️ Afternoon: <strong>{afternoonPct}%</strong> ({afternoon})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                    <span>🪔 Sandhya: <strong>{sandhyaPct}%</strong> ({sandhya})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                    <span>🌙 Ratri: <strong>{nightPct}%</strong> ({night})</span>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-zinc-900 text-[11px] text-zinc-400 italic">
                {morningPct >= 50
                  ? '🌟 Outstanding discipline! You maintain the sacred tradition of morning Brahma Muhurta.'
                  : sandhyaPct >= 40
                  ? '🪔 Beautiful Sandhya practice! Evening twilight brings peaceful contemplation.'
                  : '✨ Consistent rhythm across your daily routine.'}
              </div>
            </div>

            {/* 2. Last 7 Days Activity Bar Chart */}
            <div className="bg-zinc-950/50 p-4 rounded-xl border border-zinc-800/80 flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-bold text-zinc-200 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <span>📅</span> Last 7 Days Activity
                </h3>

                <div className="flex items-end justify-between gap-2 h-28 pt-4 px-1">
                  {last7Days.map((item) => {
                    const heightPct = Math.max(Math.round((item.count / maxLast7) * 100), item.count > 0 ? 15 : 4);
                    return (
                      <div key={item.key} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                        <span className="text-[10px] font-mono text-zinc-400">
                          {item.count > 0 ? item.count : ''}
                        </span>

                        <div className="w-full bg-zinc-900 rounded-t-md h-full flex items-end">
                          <div
                            style={{ height: `${heightPct}%` }}
                            className={`w-full rounded-t-md transition-all duration-500 ${
                              item.isToday
                                ? 'bg-gradient-to-t from-amber-600 to-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]'
                                : item.count > 0
                                ? 'bg-zinc-700 hover:bg-zinc-600'
                                : 'bg-zinc-900'
                            }`}
                          />
                        </div>

                        <span
                          className={`text-[10px] font-bold ${
                            item.isToday ? 'text-amber-400' : 'text-zinc-400'
                          }`}
                        >
                          {item.dayName}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-zinc-900 flex items-center justify-between text-[11px] text-zinc-400">
                <span>Gold bar = Today</span>
                <span>{last7Days.reduce((acc, d) => acc + d.count, 0)} chants in last 7 days</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
