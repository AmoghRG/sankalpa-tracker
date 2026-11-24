import { useState } from 'react';
import { PRESETS } from '../utils/storageUtils';

const ICONS = ['🚩', '🪔', '🕉️', '☀️', '📿', '📜', '🌸', '⚡', '🕊️'];

export default function Header({
  sankalpa,
  allSankalpas,
  timeline,
  soundEnabled,
  setSoundEnabled,
  onUpdateSankalpa,
  onSelectSankalpa,
  onCreateSankalpa,
  onDeleteSankalpa,
  onOpenZenMode,
  onOpenBackup,
}) {
  const [editing, setEditing] = useState(false);
  const [showNewModal, setShowNewModal] = useState(false);

  // Form states for editing
  const [name, setName] = useState(sankalpa.name);
  const [icon, setIcon] = useState(sankalpa.icon || '🚩');
  const [goalCount, setGoalCount] = useState(sankalpa.goalCount);
  const [durationDays, setDurationDays] = useState(sankalpa.durationDays);
  const [startDate, setStartDate] = useState(sankalpa.startDate || '');

  // New Sankalpa form states
  const [newName, setNewName] = useState('');
  const [newIcon, setNewIcon] = useState('🚩');
  const [newGoal, setNewGoal] = useState(100);
  const [newDuration, setNewDuration] = useState(40);
  const [newStart, setNewStart] = useState(() => new Date().toISOString().slice(0, 10));

  const applyPreset = (preset) => {
    setName(preset.name);
    setIcon(preset.icon);
    setGoalCount(preset.goalCount);
    setDurationDays(preset.durationDays);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    onUpdateSankalpa({
      ...sankalpa,
      name: name.trim() || 'My Sankalpa',
      icon,
      goalCount: Math.max(Number(goalCount) || 1, 1),
      durationDays: Math.max(Number(durationDays) || 1, 1),
      startDate,
    });
    setEditing(false);
  };

  const handleCreateNew = (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    const created = {
      id: `sankalpa_${Date.now()}`,
      name: newName.trim(),
      icon: newIcon,
      goalCount: Math.max(Number(newGoal) || 1, 1),
      durationDays: Math.max(Number(newDuration) || 1, 1),
      startDate: newStart,
      sessions: [],
      createdAt: Date.now(),
    };
    onCreateSankalpa(created);
    setShowNewModal(false);
    setNewName('');
  };

  return (
    <header className="mb-8">
      {/* Top Bar with Sankalpa Switcher and Action Pills */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-zinc-800/80">
        <div className="flex items-center gap-2">
          {/* Sankalpa Selector */}
          <div className="relative">
            <select
              value={sankalpa.id}
              onChange={(e) => onSelectSankalpa(e.target.value)}
              className="bg-zinc-900 border border-zinc-800 text-zinc-100 font-medium py-1.5 px-3 rounded-lg text-sm focus:outline-none focus:border-amber-500 cursor-pointer pr-8 appearance-none"
            >
              {allSankalpas.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.icon || '🚩'} {s.name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-zinc-400 text-xs">
              ▼
            </div>
          </div>

          <button
            onClick={() => setShowNewModal(true)}
            className="text-xs bg-zinc-800/80 hover:bg-zinc-700 text-amber-400 border border-zinc-700/60 px-2.5 py-1.5 rounded-lg font-medium transition"
            title="Create a new Sankalpa"
          >
            + New
          </button>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Zen Chanting Mode */}
          <button
            onClick={onOpenZenMode}
            className="flex items-center gap-1.5 text-xs bg-gradient-to-r from-amber-600/30 to-orange-600/30 hover:from-amber-600/50 hover:to-orange-600/50 border border-amber-500/40 text-amber-200 px-3 py-1.5 rounded-lg font-medium transition shadow-sm"
          >
            <span>📿</span>
            <span className="hidden sm:inline">Japa / Zen Mode</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-1.5 rounded-lg border text-sm transition ${
              soundEnabled
                ? 'bg-zinc-800 border-zinc-700 text-amber-400'
                : 'bg-zinc-900 border-zinc-800 text-zinc-500'
            }`}
            title={soundEnabled ? 'Mute sacred chime' : 'Enable sacred chime'}
          >
            {soundEnabled ? '🔔' : '🔕'}
          </button>

          {/* Backup / Export */}
          <button
            onClick={onOpenBackup}
            className="p-1.5 bg-zinc-800/80 hover:bg-zinc-700 border border-zinc-700/60 rounded-lg text-zinc-300 text-sm transition"
            title="Backup & Restore Data"
          >
            💾
          </button>

          {/* Edit Sankalpa Settings */}
          <button
            onClick={() => {
              setName(sankalpa.name);
              setIcon(sankalpa.icon || '🚩');
              setGoalCount(sankalpa.goalCount);
              setDurationDays(sankalpa.durationDays);
              setStartDate(sankalpa.startDate || '');
              setEditing(!editing);
            }}
            className={`text-xs px-3 py-1.5 rounded-lg font-medium border transition ${
              editing
                ? 'bg-amber-500 text-black border-amber-400 font-semibold'
                : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border-zinc-700'
            }`}
          >
            {editing ? 'Close Edit' : '⚙️ Settings'}
          </button>
        </div>
      </div>

      {/* Main Sankalpa Title and Timeline Banner */}
      <div className="mt-5 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="text-3xl md:text-4xl p-2 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-inner">
              {sankalpa.icon || '🚩'}
            </span>
            <div>
              <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-white flex items-center gap-2">
                {sankalpa.name}
              </h1>
              <p className="text-zinc-400 text-sm mt-0.5">
                Vow of {sankalpa.goalCount} recitations across {sankalpa.durationDays} days
              </p>
            </div>
          </div>
        </div>

        {/* Timeline Indicator Badge */}
        <div className="bg-zinc-900/90 border border-zinc-800/90 rounded-xl px-4 py-3 flex items-center gap-4">
          <div>
            <div className="text-xs text-zinc-400 uppercase font-semibold tracking-wider">Timeline</div>
            <div className="text-sm font-medium text-amber-200">
              {timeline.hasStart ? `${timeline.startDateFormatted} → ${timeline.endDateFormatted}` : 'No start date set'}
            </div>
          </div>

          <div className="h-8 w-px bg-zinc-800" />

          <div>
            {timeline.hasStart ? (
              <div>
                <span
                  className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${
                    timeline.status === 'active'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : timeline.status === 'completed'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                  }`}
                >
                  {timeline.status === 'active' && `Day ${timeline.currentDay} / ${timeline.duration}`}
                  {timeline.status === 'completed' && 'Completed'}
                  {timeline.status === 'upcoming' && `Starts in ${Math.abs(timeline.currentDay - 1)} days`}
                </span>
                {timeline.status === 'active' && (
                  <p className="text-[11px] text-zinc-400 mt-0.5">{timeline.daysRemaining} days left</p>
                )}
              </div>
            ) : (
              <button
                onClick={() => setEditing(true)}
                className="text-xs text-amber-400 underline hover:text-amber-300"
              >
                Set start date
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Inline Editing Form */}
      {editing && (
        <form
          onSubmit={handleSaveEdit}
          className="mt-6 bg-zinc-900/95 border border-zinc-800 rounded-2xl p-6 shadow-xl animate-fade-in"
        >
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-zinc-800">
            <h3 className="text-lg font-semibold text-zinc-100 flex items-center gap-2">
              <span>⚙️</span> Edit Sankalpa Settings
            </h3>
            {allSankalpas.length > 1 && (
              <button
                type="button"
                onClick={() => {
                  if (confirm(`Are you sure you want to delete "${sankalpa.name}"?`)) {
                    onDeleteSankalpa(sankalpa.id);
                  }
                }}
                className="text-xs text-red-400 hover:text-red-300 hover:underline"
              >
                Delete This Sankalpa
              </button>
            )}
          </div>

          {/* Quick Presets */}
          <div className="mb-4">
            <label className="text-xs font-medium text-zinc-400 block mb-1.5">Apply Sacred Preset</label>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((preset) => (
                <button
                  type="button"
                  key={preset.name}
                  onClick={() => applyPreset(preset)}
                  className="text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-2.5 py-1.5 rounded-lg border border-zinc-700/60 transition flex items-center gap-1.5"
                >
                  <span>{preset.icon}</span>
                  <span>{preset.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Name */}
            <div>
              <label className="text-xs font-medium text-zinc-400 block mb-1">Sankalpa Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-zinc-950 border border-zinc-800 px-3 py-2 rounded-lg text-white text-sm focus:border-amber-500 focus:outline-none"
              />
            </div>

            {/* Icon Picker */}
            <div>
              <label className="text-xs font-medium text-zinc-400 block mb-1">Sacred Icon</label>
              <div className="flex gap-1.5 bg-zinc-950 border border-zinc-800 p-1.5 rounded-lg overflow-x-auto">
                {ICONS.map((ic) => (
                  <button
                    key={ic}
                    type="button"
                    onClick={() => setIcon(ic)}
                    className={`px-2 py-1 rounded text-sm transition ${
                      icon === ic ? 'bg-amber-500/30 border border-amber-500/50' : 'hover:bg-zinc-800'
                    }`}
                  >
                    {ic}
                  </button>
                ))}
              </div>
            </div>

            {/* Start Date */}
            <div>
              <label className="text-xs font-medium text-zinc-400 block mb-1">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 px-3 py-2 rounded-lg text-white text-sm focus:border-amber-500 focus:outline-none"
              />
            </div>

            {/* Goal and Duration */}
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="text-xs font-medium text-zinc-400 block mb-1">Goal Count</label>
                <input
                  type="number"
                  min="1"
                  value={goalCount}
                  onChange={(e) => setGoalCount(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 px-3 py-2 rounded-lg text-white text-sm focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="flex-1">
                <label className="text-xs font-medium text-zinc-400 block mb-1">Days</label>
                <input
                  type="number"
                  min="1"
                  value={durationDays}
                  onChange={(e) => setDurationDays(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 px-3 py-2 rounded-lg text-white text-sm focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="mt-5 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-4 py-2 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="text-xs bg-amber-500 hover:bg-amber-400 text-zinc-950 font-semibold px-4 py-2 rounded-lg transition shadow-md"
            >
              Save Changes
            </button>
          </div>
        </form>
      )}

      {/* Create New Sankalpa Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span>🚩</span> Create New Sankalpa
              </h3>
              <button
                onClick={() => setShowNewModal(false)}
                className="text-zinc-500 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateNew} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-zinc-400 block mb-1">Sankalpa Name</label>
                <input
                  type="text"
                  placeholder="e.g. Shiva Panchakshara Stotra"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  required
                  autoFocus
                  className="w-full bg-zinc-950 border border-zinc-800 px-3 py-2 rounded-lg text-white text-sm focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-zinc-400 block mb-1">Choose Icon</label>
                <div className="flex gap-1.5 bg-zinc-950 border border-zinc-800 p-1.5 rounded-lg overflow-x-auto">
                  {ICONS.map((ic) => (
                    <button
                      key={ic}
                      type="button"
                      onClick={() => setNewIcon(ic)}
                      className={`px-2 py-1 rounded text-sm transition ${
                        newIcon === ic ? 'bg-amber-500/30 border border-amber-500/50' : 'hover:bg-zinc-800'
                      }`}
                    >
                      {ic}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-zinc-400 block mb-1">Goal Count</label>
                  <input
                    type="number"
                    min="1"
                    value={newGoal}
                    onChange={(e) => setNewGoal(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 px-3 py-2 rounded-lg text-white text-sm focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-zinc-400 block mb-1">Duration (Days)</label>
                  <input
                    type="number"
                    min="1"
                    value={newDuration}
                    onChange={(e) => setNewDuration(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 px-3 py-2 rounded-lg text-white text-sm focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-zinc-400 block mb-1">Start Date</label>
                <input
                  type="date"
                  value={newStart}
                  onChange={(e) => setNewStart(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 px-3 py-2 rounded-lg text-white text-sm focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 bg-zinc-800 text-zinc-300 text-xs rounded-lg hover:bg-zinc-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 text-zinc-950 font-semibold text-xs rounded-lg hover:bg-amber-400 transition"
                >
                  Start Sankalpa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
}
