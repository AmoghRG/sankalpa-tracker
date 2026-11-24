import { useState, useEffect } from 'react';
import Header from './components/Header';
import StatsCards from './components/StatsCards';
import CalendarCard from './components/CalendarCard';
import ZenModeModal from './components/ZenModeModal';
import BackupModal from './components/BackupModal';
import {
  toDateKey,
  calculateSankalpaTimeline,
  calculateStreaks,
  calculatePace,
} from './utils/dateUtils';
import { playChantSound, triggerHaptic } from './utils/soundUtils';
import { loadInitialData, saveSankalpas } from './utils/storageUtils';

function createSession(amount, dateKey, customTime) {
  const timestamp = Date.now();
  const randomSuffix = Math.random().toString(36).substring(2, 7);
  return {
    id: `session_${timestamp}_${randomSuffix}`,
    date: dateKey,
    time:
      customTime ||
      new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    count: amount,
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

  const { sankalpas, activeId } = data;

  // Persist to localStorage whenever sankalpas or activeId changes
  useEffect(() => {
    if (sankalpas.length > 0) {
      saveSankalpas(sankalpas, activeId);
    }
  }, [sankalpas, activeId]);

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
      sankalpas: [...prev.sankalpas, newSankalpa],
      activeId: newSankalpa.id,
    }));
  };

  // Delete Sankalpa
  const handleDeleteSankalpa = (idToDelete) => {
    setData((prev) => {
      const remainingList = prev.sankalpas.filter((s) => s.id !== idToDelete);
      return {
        sankalpas: remainingList,
        activeId: remainingList.length > 0 ? remainingList[0].id : null,
      };
    });
  };

  // Import Sankalpas from JSON
  const handleImportSankalpas = (imported) => {
    setData({
      sankalpas: imported,
      activeId: imported.length > 0 ? imported[0].id : null,
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
          onUpdateSankalpa={updateCurrentSankalpa}
          onSelectSankalpa={(id) => setData((prev) => ({ ...prev, activeId: id }))}
          onCreateSankalpa={handleCreateSankalpa}
          onDeleteSankalpa={handleDeleteSankalpa}
          onOpenZenMode={() => setIsZenOpen(true)}
          onOpenBackup={() => setIsBackupOpen(true)}
        />

        {/* Goal Achieved Special Banner */}
        {totalCount >= goalCount && (
          <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-amber-600/20 via-emerald-600/20 to-amber-600/20 border border-amber-500/40 text-center animate-fade-in shadow-lg">
            <span className="text-2xl">🚩 🪔 🕉️</span>
            <h2 className="text-xl font-extrabold text-amber-200 mt-1">
              Sankalpa Siddhi Accomplished!
            </h2>
            <p className="text-xs sm:text-sm text-zinc-300 mt-0.5">
              You have completed {totalCount} of {goalCount} {activeSankalpa.name} recitations.
              May your dedicated tapasya bring deep peace, clarity, and strength.
            </p>
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
          <div>
            Data stays 100% private in your browser.
          </div>
        </footer>
      </div>

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
          onImportSankalpas={handleImportSankalpas}
          onClose={() => setIsBackupOpen(false)}
        />
      )}
    </div>
  );
}
