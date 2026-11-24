import { useState } from 'react';
import { formatDisplayDate } from '../utils/dateUtils';

export default function HistoryModal({
  archivedSankalpas,
  onStartNewCycle,
  onDeleteArchived,
  onClose,
}) {
  const [expandedId, setExpandedId] = useState(null);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in text-white">
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-7 max-w-2xl w-full shadow-2xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800 mb-4">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">📜</span>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white leading-tight">
                Tapasya History & Past Sankalpas
              </h2>
              <p className="text-xs text-zinc-400">
                A sacred ledger of your fulfilled disciplines and resolutions
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-white text-base p-1"
          >
            ✕
          </button>
        </div>

        {/* Content list */}
        <div className="overflow-y-auto space-y-4 pr-1 flex-1 custom-scrollbar">
          {archivedSankalpas.length === 0 ? (
            <div className="py-12 text-center">
              <div className="text-4xl mb-3">🪔</div>
              <h3 className="text-base font-semibold text-zinc-200">No Archived Sankalpas Yet</h3>
              <p className="text-xs text-zinc-400 max-w-xs mx-auto mt-1">
                When you fulfill your active vow, seal it to record your milestone here and start a new cycle.
              </p>
            </div>
          ) : (
            archivedSankalpas.map((item) => {
              const isExpanded = expandedId === item.id;
              const nextCycleNum = (item.cycleNumber || 1) + 1;

              return (
                <div
                  key={item.id}
                  className="bg-zinc-950/80 border border-zinc-800/90 rounded-2xl p-4 sm:p-5 transition hover:border-zinc-700 shadow"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-900">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl p-2 bg-zinc-900 rounded-xl border border-zinc-800">
                        {item.icon || '🚩'}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-white text-base">{item.name}</h3>
                          <span className="text-[10px] px-2 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full font-mono">
                            Cycle #{item.cycleNumber || 1}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-400 mt-0.5">
                          Fulfilled on{' '}
                          <strong className="text-zinc-300">
                            {formatDisplayDate(item.completedDate)}
                          </strong>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onStartNewCycle(item)}
                        className="text-xs px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-zinc-950 font-bold rounded-lg transition active:scale-95 shadow flex items-center gap-1.5"
                        title="Start next cycle of this vow"
                      >
                        <span>🔄</span>
                        <span>Start Cycle #{nextCycleNum}</span>
                      </button>
                    </div>
                  </div>

                  {/* Badges / Stats */}
                  <div className="grid grid-cols-3 gap-2 my-3 text-center text-xs">
                    <div className="bg-zinc-900/60 p-2 rounded-lg border border-zinc-800/60">
                      <span className="text-[10px] text-zinc-400 block uppercase">Recitations</span>
                      <strong className="text-sm font-bold text-amber-300">
                        {item.totalCompletedCount || item.sessions?.length || 0}
                      </strong>
                    </div>
                    <div className="bg-zinc-900/60 p-2 rounded-lg border border-zinc-800/60">
                      <span className="text-[10px] text-zinc-400 block uppercase">Vow Target</span>
                      <strong className="text-sm font-bold text-zinc-200">
                        {item.goalCount} / {item.durationDays}d
                      </strong>
                    </div>
                    <div className="bg-zinc-900/60 p-2 rounded-lg border border-zinc-800/60">
                      <span className="text-[10px] text-zinc-400 block uppercase">Best Streak</span>
                      <strong className="text-sm font-bold text-orange-400">
                        🔥 {item.longestStreak || 0}d
                      </strong>
                    </div>
                  </div>

                  {/* Dedication Note if present */}
                  {item.reflectionNote && (
                    <div className="my-2 p-2.5 rounded-lg bg-zinc-900/90 border border-zinc-800/80 text-xs italic text-amber-200/90">
                      &ldquo;{item.reflectionNote}&rdquo;
                    </div>
                  )}

                  {/* Expand / Details toggle */}
                  <div className="mt-2 pt-2 border-t border-zinc-900 flex items-center justify-between text-xs text-zinc-400">
                    <button
                      onClick={() => toggleExpand(item.id)}
                      className="hover:text-amber-300 text-[11px] underline flex items-center gap-1"
                    >
                      {isExpanded
                        ? 'Hide session logs ▲'
                        : `View ${item.sessions?.length || 0} historical logs ▼`}
                    </button>

                    <button
                      onClick={() => {
                        if (confirm(`Delete archived history for "${item.name} (Cycle #${item.cycleNumber || 1})"?`)) {
                          onDeleteArchived(item.id);
                        }
                      }}
                      className="text-[10px] text-zinc-400 hover:text-red-400 transition"
                    >
                      Delete record
                    </button>
                  </div>

                  {/* Expanded Session Logs */}
                  {isExpanded && (
                    <div className="mt-3 pt-3 border-t border-zinc-800/60 max-h-40 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                      {(!item.sessions || item.sessions.length === 0) ? (
                        <p className="text-[11px] text-zinc-400 italic">No detailed timestamps.</p>
                      ) : (
                        item.sessions.map((s, idx) => (
                          <div
                            key={s.id || idx}
                            className="flex items-center justify-between text-[11px] py-1 px-2.5 rounded bg-zinc-900/60 text-zinc-300"
                          >
                            <span className="font-mono">{formatDisplayDate(s.date)} at {s.time}</span>
                            <span className="font-bold text-amber-400">+{s.count || 1} {s.tag ? `• ${s.tag}` : ''}</span>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-zinc-800 flex justify-between items-center text-xs text-zinc-400">
          <span>{archivedSankalpas.length} completed vow(s) recorded</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-zinc-800 text-zinc-200 rounded-xl hover:bg-zinc-700 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
