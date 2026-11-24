import { useState, useEffect } from 'react';
import Header from './components/Header';
import StatsCards from './components/StatsCards';
import AnalyticsCard from './components/AnalyticsCard';
import CalendarCard from './components/CalendarCard';
import ZenModeModal from './components/ZenModeModal';
import BackupModal from './components/BackupModal';
import CompleteModal from './components/CompleteModal';
import HistoryModal from './components/HistoryModal';
import {
  toDateKey,
  calculateSankalpaTimeline,
  calculateStreaks,
  calculatePace,
} from './utils/dateUtils';
import { playChantSound, triggerHaptic } from './utils/soundUtils';
import { loadInitialData, saveSankalpas, getTimeOfDayTag } from './utils/storageUtils';

function createSession(amount, dateKey, customTime) {
  const timestamp = Date.now();
  const randomSuffix = Math.random().toString(36).substring(2, 7);
  const tagInfo = getTimeOfDayTag(new Date(timestamp));
  return {
    id: `session_${timestamp}_${randomSuffix}`,
    date: dateKey,
    time:
      customTime ||
      new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    count: amount,
    tag: tagInfo.label,
    timestamp,
  };
}

export default function App() {
  const [data, setData] = useState(() => loadInitialData());

  const [soundEnabled, setSoundEnabled] = useState(() => {
    return localStorage.getItem('sound_enabled') !== 'false';
  });

  const [isZenOpen, setIsZenOpen] = useState(false);
  const [isBackupOpen, setIsBackupOpen] = useState(false);
  const [isCompleteOpen, setIsCompleteOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const { sankalpas, activeId, archivedSankalpas = [] } = data;

  // Persist to localStorage whenever data changes
  useEffect(() => {
    if (sankalpas.length > 0) {
      saveSankalpas(sankalpas, activeId, archivedSankalpas);
    }
  }, [sankalpas, activeId, archivedSankalpas]);

  // Persist sound setting
  useEffect(() => {
    localStorage.setItem('sound_enabled', String(soundEnabled));
  }, [soundEnabled]);

  // Active Sankalpa
  const activeSankalpa = sankalpas.find((s) => s.id === activeId) || sankalpas[0] || {
    id: 'fallback',
    name: 'Hanuman Chalisa',
    icon: '🚩',
    goalCount: 100,
    durationDays: 40,
    startDate: toDateKey(),
    sessions: [],
    cycleNumber: 1,
  };

  const sessions = activeSankalpa.sessions || [];

  // Single source of truth for totalCount: sum of session counts
  const totalCount = sessions.reduce((sum, s) => sum + (Number(s.count) || 1), 0);
  const goalCount = Number(activeSankalpa.goalCount) || 100;
  const percentage = Math.min(Math.round((totalCount / goalCount) * 100), 100);
  const remaining = Math.max(goalCount - totalCount, 0);

  // Timeline & dates
  const timeline = calculateSankalpaTimeline(activeSankalpa.startDate, activeSankalpa.durationDays);
  const todayKey = toDateKey();
  const todaySessions = sessions.filter((s) => s.date === todayKey);
  const todayCount = todaySessions.reduce((sum, s) => sum + (Number(s.count) || 1), 0);

  // Streaks & Pace
  const streaks = calculateStreaks(sessions.map((s) => s.date));
  const pace = calculatePace(totalCount, goalCount, timeline);

  // Update current sankalpa helper
  const updateCurrentSankalpa = (updated) => {
    setData((prev) => ({
      ...prev,
      sankalpas: prev.sankalpas.map((s) => (s.id === updated.id ? updated : s)),
    }));
  };

  // Add count / session
  const handleAddCount = (amount = 1, dateKey = todayKey, customTime = null) => {
    if (soundEnabled) {
      if (amount >= 108) {
        playChantSound('malaComplete');
      } else {
        playChantSound('bell');
      }
    }
    triggerHaptic(amount >= 108 ? [50, 40, 80] : [25]);

    const newSession = createSession(amount, dateKey, customTime);
    const updatedSessions = [...sessions, newSession];
    updateCurrentSankalpa({ ...activeSankalpa, sessions: updatedSessions });
  };

  // Undo last session
  const handleUndoLast = () => {
    if (sessions.length === 0) return;
    const updatedSessions = sessions.slice(0, -1);
    updateCurrentSankalpa({ ...activeSankalpa, sessions: updatedSessions });
    triggerHaptic([30]);
  };

  // Delete a specific session
  const handleDeleteSession = (sessionId) => {
    const updatedSessions = sessions.filter((s) => s.id !== sessionId);
    updateCurrentSankalpa({ ...activeSankalpa, sessions: updatedSessions });
  };

  // Create new Sankalpa
  const handleCreateSankalpa = (newSankalpa) => {
    setData((prev) => ({
      ...prev,
      sankalpas: [...prev.sankalpas, newSankalpa],
      activeId: newSankalpa.id,
    }));
  };

  // Delete Sankalpa
  const handleDeleteSankalpa = (idToDelete) => {
    setData((prev) => {
      const remainingList = prev.sankalpas.filter((s) => s.id !== idToDelete);
      return {
        ...prev,
        sankalpas: remainingList,
        activeId: remainingList.length > 0 ? remainingList[0].id : null,
      };
    });
  };

  // Archive completed Sankalpa
  const handleConfirmArchive = (archivedRecord) => {
    setData((prev) => {
      const newArchived = [archivedRecord, ...(prev.archivedSankalpas || [])];
      const remainingList = prev.sankalpas.filter((s) => s.id !== activeSankalpa.id);

      let updatedList = remainingList;
      let nextId;

      if (remainingList.length > 0) {
        nextId = remainingList[0].id;
      } else {
        // If it was the only one, create next cycle automatically
        const nextCycle = {
          id: `sankalpa_${Date.now()}`,
          name: activeSankalpa.name,
          icon: activeSankalpa.icon || '🚩',
          goalCount: activeSankalpa.goalCount,
          durationDays: activeSankalpa.durationDays,
          startDate: toDateKey(),
          sessions: [],
          cycleNumber: (activeSankalpa.cycleNumber || 1) + 1,
          createdAt: Date.now(),
        };
        updatedList = [nextCycle];
        nextId = nextCycle.id;
      }

      return {
        sankalpas: updatedList,
        activeId: nextId,
        archivedSankalpas: newArchived,
      };
    });

    setIsCompleteOpen(false);
    setIsHistoryOpen(true);
  };

  // Start new cycle from an archived record
  const handleStartNewCycle = (archivedItem) => {
    const nextCycle = {
      id: `sankalpa_${Date.now()}`,
      name: archivedItem.name,
      icon: archivedItem.icon || '🚩',
      goalCount: archivedItem.goalCount,
      durationDays: archivedItem.durationDays,
      startDate: toDateKey(),
      sessions: [],
      cycleNumber: (archivedItem.cycleNumber || 1) + 1,
      createdAt: Date.now(),
    };

    setData((prev) => ({
      ...prev,
      sankalpas: [...prev.sankalpas, nextCycle],
      activeId: nextCycle.id,
    }));

    setIsHistoryOpen(false);
  };

  // Delete archived record
  const handleDeleteArchived = (archivedId) => {
    setData((prev) => ({
      ...prev,
      archivedSankalpas: (prev.archivedSankalpas || []).filter((a) => a.id !== archivedId),
    }));
  };

  // Import Sankalpas from JSON
  const handleImportSankalpas = (imported) => {
    setData({
      sankalpas: imported.sankalpas,
      archivedSankalpas: imported.archivedSankalpas || [],
      activeId: imported.sankalpas.length > 0 ? imported.sankalpas[0].id : null,
    });
  };

  const lastSession = sessions.length > 0 ? sessions[sessions.length - 1] : null;
  const lastSessionInfo = lastSession ? `+${lastSession.count || 1} at ${lastSession.time}` : '';

  return (
    <div className="min-h-screen bg-zinc-950 text-white selection:bg-amber-500 selection:text-black">
      {/* Background ambient gradient glow */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(245,158,11,0.08),rgba(255,255,255,0))]" />

      <div className="relative max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header Section */}
        <Header
          sankalpa={activeSankalpa}
          allSankalpas={sankalpas}
          timeline={timeline}
          soundEnabled={soundEnabled}
          setSoundEnabled={setSoundEnabled}
          archivedCount={archivedSankalpas.length}
          onOpenHistory={() => setIsHistoryOpen(true)}
          onOpenComplete={() => setIsCompleteOpen(true)}
          onUpdateSankalpa={updateCurrentSankalpa}
          onSelectSankalpa={(id) => setData((prev) => ({ ...prev, activeId: id }))}
          onCreateSankalpa={handleCreateSankalpa}
          onDeleteSankalpa={handleDeleteSankalpa}
          onOpenZenMode={() => setIsZenOpen(true)}
          onOpenBackup={() => setIsBackupOpen(true)}
        />

        {/* Goal Achieved / Completion Banner */}
        {totalCount >= goalCount && (
          <div className="mb-6 p-5 rounded-2xl bg-gradient-to-r from-amber-600/25 via-emerald-600/20 to-amber-600/25 border border-amber-500/50 flex flex-col sm:flex-row items-center justify-between gap-4 animate-fade-in shadow-xl">
            <div className="text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="text-2xl">🚩 🪔</span>
                <h2 className="text-lg font-extrabold text-amber-200">
                  Sankalpa Siddhi Accomplished!
                </h2>
              </div>
              <p className="text-xs text-zinc-300 mt-1">
                You have fulfilled {totalCount} of {goalCount} {activeSankalpa.name} recitations.
                Seal this vow into your sacred history to record your tapasya.
              </p>
            </div>

            <button
              onClick={() => setIsCompleteOpen(true)}
              className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-zinc-950 font-black text-xs rounded-xl shadow-lg transition active:scale-95 flex items-center gap-2 whitespace-nowrap"
            >
              <span>📜</span>
              <span>Seal & Move to History</span>
            </button>
          </div>
        )}

        {/* 3 Core Stats Cards */}
        <StatsCards
          sankalpaName={activeSankalpa.name}
          totalCount={totalCount}
          goalCount={goalCount}
          percentage={percentage}
          remaining={remaining}
          todaySessions={todaySessions}
          todayCount={todayCount}
          todayDateKey={todayKey}
          streaks={streaks}
          pace={pace}
          onAddCount={(amount) => handleAddCount(amount)}
          onUndoLast={handleUndoLast}
          onDeleteSession={handleDeleteSession}
          canUndo={sessions.length > 0}
          lastSessionInfo={lastSessionInfo}
        />

        {/* Sadhana Rhythm & Timing Analytics */}
        <AnalyticsCard
          sessions={sessions}
          timeline={timeline}
          totalCount={totalCount}
        />

        {/* Unified Calendar Card */}
        <CalendarCard
          sessions={sessions}
          timeline={timeline}
          onAddSessionForDate={(dateKey, count, time) =>
            handleAddCount(count, dateKey, time)
          }
          onDeleteSession={handleDeleteSession}
        />

        {/* Footer */}
        <footer className="mt-12 pt-6 border-t border-zinc-800/80 text-center text-xs text-zinc-400 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span>🚩</span>
            <span className="text-zinc-400 font-medium">Sankalpa Tracker</span>
            <span>• Tapasya & Sadhana Journal</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsHistoryOpen(true)}
              className="text-amber-400/90 hover:underline"
            >
              Past Sankalpas ({archivedSankalpas.length})
            </button>
            <span>•</span>
            <span>Data stays 100% private in your browser.</span>
          </div>
        </footer>
      </div>

      {/* Complete & Seal Sankalpa Modal */}
      {isCompleteOpen && (
        <CompleteModal
          sankalpa={activeSankalpa}
          totalCount={totalCount}
          timeline={timeline}
          streaks={streaks}
          soundEnabled={soundEnabled}
          onConfirmArchive={handleConfirmArchive}
          onClose={() => setIsCompleteOpen(false)}
        />
      )}

      {/* History & Past Sankalpas Modal */}
      {isHistoryOpen && (
        <HistoryModal
          archivedSankalpas={archivedSankalpas}
          onStartNewCycle={handleStartNewCycle}
          onDeleteArchived={handleDeleteArchived}
          onClose={() => setIsHistoryOpen(false)}
        />
      )}

      {/* Zen Japa Meditation Mode */}
      {isZenOpen && (
        <ZenModeModal
          sankalpa={activeSankalpa}
          totalCount={totalCount}
          soundEnabled={soundEnabled}
          onAddCount={(amount) => handleAddCount(amount)}
          onClose={() => setIsZenOpen(false)}
        />
      )}

      {/* Backup and Restore Modal */}
      {isBackupOpen && (
        <BackupModal
          sankalpas={sankalpas}
          archivedSankalpas={archivedSankalpas}
          onImportSankalpas={handleImportSankalpas}
          onClose={() => setIsBackupOpen(false)}
        />
      )}
    </div>
  );
}
