import { useState } from 'react';
import {
  toDateKey,
  formatDisplayDate,
  isDateInSankalpaRange,
} from '../utils/dateUtils';

export default function CalendarCard({
  sessions,
  timeline,
  onAddSessionForDate,
  onDeleteSession,
}) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDateKey, setSelectedDateKey] = useState(null);
  const [manualCount, setManualCount] = useState(1);
  const [manualTime, setManualTime] = useState(() =>
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  );

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const monthName = currentMonth.toLocaleString('default', { month: 'long' });

  const todayKey = toDateKey();

  // Create lookup map of sessions by dateKey
  // dateKey -> { sessions: [], totalCount: number }
  const sessionsByDate = {};
  sessions.forEach((s) => {
    const key = s.date;
    if (!sessionsByDate[key]) {
      sessionsByDate[key] = { sessions: [], totalCount: 0 };
    }
    sessionsByDate[key].sessions.push(s);
    sessionsByDate[key].totalCount += Number(s.count) || 1;
  });

  // Calculate calendar grid
  const firstDayOfWeek = new Date(year, month, 1).getDay(); // 0 is Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const daysGrid = [];
  // Empty padding cells before 1st of month
  for (let i = 0; i < firstDayOfWeek; i++) {
    daysGrid.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const dateObj = new Date(year, month, d);
    daysGrid.push({
      dayNumber: d,
      dateKey: toDateKey(dateObj),
    });
  }

  const prevMonth = () => setCurrentMonth(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentMonth(new Date(year, month + 1, 1));
  const goToToday = () => {
    setCurrentMonth(new Date());
    setSelectedDateKey(todayKey);
  };

  const selectedData = selectedDateKey ? sessionsByDate[selectedDateKey] || { sessions: [], totalCount: 0 } : null;

  const handleManualAdd = (e) => {
    e.preventDefault();
    if (!selectedDateKey) return;
    onAddSessionForDate(selectedDateKey, Number(manualCount) || 1, manualTime);
    setManualCount(1);
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800/80 rounded-2xl p-6 shadow-xl mt-6">
      {/* Calendar Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-zinc-800/80">
        <div className="flex items-center gap-3">
          <span className="text-xl">📅</span>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>{monthName} {year}</span>
            </h2>
            <p className="text-xs text-zinc-400">Track consistency across the Sankalpa cycle</p>
          </div>
        </div>

        {/* Month Navigation */}
        <div className="flex items-center gap-2">
          <button
            onClick={goToToday}
            className="text-xs px-2.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium rounded-lg border border-zinc-700/60 transition"
          >
            Today
          </button>
          <div className="flex items-center bg-zinc-950 border border-zinc-800 rounded-lg p-0.5">
            <button
              onClick={prevMonth}
              className="p-1.5 hover:bg-zinc-800 rounded-md text-zinc-300 hover:text-white transition text-xs"
              title="Previous Month"
            >
              ◀
            </button>
            <button
              onClick={nextMonth}
              className="p-1.5 hover:bg-zinc-800 rounded-md text-zinc-300 hover:text-white transition text-xs"
              title="Next Month"
            >
              ▶
            </button>
          </div>
        </div>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 text-center text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-2">
        <div className="text-red-400/80">Sun</div>
        <div>Mon</div>
        <div>Tue</div>
        <div>Wed</div>
        <div>Thu</div>
        <div>Fri</div>
        <div>Sat</div>
      </div>

      {/* Calendar Days Matrix */}
      <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
        {daysGrid.map((cell, idx) => {
          if (!cell) {
            return (
              <div
                key={`empty-${idx}`}
                className="h-14 sm:h-16 rounded-xl bg-zinc-950/30 border border-transparent"
              />
            );
          }

          const { dayNumber, dateKey } = cell;
          const dayInfo = sessionsByDate[dateKey];
          const hasSessions = !!dayInfo && dayInfo.totalCount > 0;
          const totalCount = dayInfo ? dayInfo.totalCount : 0;
          const isToday = dateKey === todayKey;
          const isSelected = dateKey === selectedDateKey;
          const inRange = isDateInSankalpaRange(dateKey, timeline.startDateKey, timeline.endDateKey);

          return (
            <button
              key={dateKey}
              onClick={() => setSelectedDateKey(dateKey)}
              className={`h-14 sm:h-16 rounded-xl p-1.5 flex flex-col justify-between items-center transition relative border text-left cursor-pointer ${
                isSelected
                  ? 'bg-amber-500/20 border-amber-400 ring-2 ring-amber-400/30 shadow-lg'
                  : hasSessions
                  ? 'bg-zinc-800/90 border-amber-500/40 hover:border-amber-400'
                  : inRange
                  ? 'bg-zinc-900 border-zinc-700/60 hover:bg-zinc-800'
                  : 'bg-zinc-950/60 border-zinc-800/40 text-zinc-500 hover:bg-zinc-900'
              } ${isToday ? 'ring-1 ring-white/50' : ''}`}
            >
              <div className="w-full flex items-center justify-between">
                <span
                  className={`text-xs font-bold ${
                    isToday
                      ? 'bg-amber-500 text-zinc-950 w-5 h-5 rounded-full flex items-center justify-center font-extrabold'
                      : isSelected
                      ? 'text-amber-200'
                      : 'text-zinc-300'
                  }`}
                >
                  {dayNumber}
                </span>

                {/* In range indicator dot */}
                {inRange && !hasSessions && (
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-600" title="In Sankalpa Window" />
                )}
              </div>

              {/* Sessions indicator */}
              {hasSessions && (
                <div className="w-full flex items-center justify-center">
                  <span
                    className={`text-[11px] font-bold px-1.5 py-0.5 rounded-md ${
                      totalCount >= 10
                        ? 'bg-amber-400 text-zinc-950 shadow-[0_0_8px_rgba(251,191,36,0.6)]'
                        : totalCount >= 3
                        ? 'bg-amber-500/30 text-amber-300 border border-amber-500/50'
                        : 'bg-zinc-700 text-amber-200'
                    }`}
                  >
                    +{totalCount}
                  </span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 pt-4 border-t border-zinc-800/80 flex flex-wrap items-center justify-between gap-3 text-[11px] text-zinc-400">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>Chants Logged</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded border border-zinc-600 bg-zinc-900" />
            <span>Sankalpa Period</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 ring-2 ring-white/50" />
            <span>Today</span>
          </div>
        </div>

        <span className="text-zinc-400">Click any date to view or backfill logs</span>
      </div>

      {/* Selected Day Details Panel */}
      {selectedDateKey && (
        <div className="mt-6 pt-5 border-t border-zinc-800 bg-zinc-950/70 rounded-xl p-4 border animate-fade-in">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
            <div>
              <h3 className="text-base font-bold text-amber-200">
                {formatDisplayDate(selectedDateKey, {
                  weekday: 'short',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </h3>
              <p className="text-xs text-zinc-400">
                Total for this day: <strong className="text-white">{selectedData.totalCount}</strong> recitations ({selectedData.sessions.length} sessions)
              </p>
            </div>

            <button
              onClick={() => setSelectedDateKey(null)}
              className="text-xs text-zinc-400 hover:text-white px-2 py-1 bg-zinc-800 hover:bg-zinc-700 rounded transition"
            >
              Close ✕
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {/* List of sessions on this date */}
            <div>
              <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                Logged Sessions
              </div>

              {selectedData.sessions.length === 0 ? (
                <div className="text-xs text-zinc-400 italic py-3 bg-zinc-900/60 rounded-lg text-center">
                  No sessions recorded for this day.
                </div>
              ) : (
                <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                  {selectedData.sessions.map((s) => (
                    <div
                      key={s.id}
                      className="flex items-center justify-between text-xs py-2 px-3 bg-zinc-900 border border-zinc-800/80 rounded-lg hover:border-zinc-700 transition"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-zinc-300">{s.time}</span>
                        <span className="px-1.5 py-0.5 bg-amber-500/20 text-amber-300 rounded font-bold text-[11px]">
                          +{s.count || 1}
                        </span>
                      </div>

                      <button
                        onClick={() => onDeleteSession(s.id)}
                        className="text-xs text-zinc-400 hover:text-red-400 transition"
                        title="Delete this session"
                      >
                        Delete ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Backfill / Add session for this date */}
            <form
              onSubmit={handleManualAdd}
              className="bg-zinc-900/90 border border-zinc-800 p-3 rounded-xl flex flex-col justify-between"
            >
              <div>
                <div className="text-xs font-semibold text-zinc-300 mb-2 flex items-center gap-1.5">
                  <span>➕</span> Backfill / Add Chants for this Day
                </div>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div>
                    <label className="text-[11px] text-zinc-400 block mb-1">Recitations</label>
                    <input
                      type="number"
                      min="1"
                      value={manualCount}
                      onChange={(e) => setManualCount(e.target.value)}
                      required
                      className="w-full bg-zinc-950 border border-zinc-800 px-2 py-1.5 rounded text-white text-xs focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-zinc-400 block mb-1">Time</label>
                    <input
                      type="time"
                      value={manualTime}
                      onChange={(e) => setManualTime(e.target.value)}
                      required
                      className="w-full bg-zinc-950 border border-zinc-800 px-2 py-1.5 rounded text-white text-xs focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-amber-500/90 hover:bg-amber-400 text-zinc-950 font-bold text-xs rounded-lg transition"
              >
                Log +{manualCount} for {formatDisplayDate(selectedDateKey, { day: 'numeric', month: 'short' })}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
