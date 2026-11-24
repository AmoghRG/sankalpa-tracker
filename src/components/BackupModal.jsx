import { useState } from 'react';
import { exportDataAsJSON, parseImportData } from '../utils/storageUtils';

export default function BackupModal({ sankalpas, onImportSankalpas, onClose }) {
  const [importStatus, setImportStatus] = useState(null);

  const handleExport = () => {
    exportDataAsJSON(sankalpas);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result;
        if (typeof content === 'string') {
          const imported = parseImportData(content);
          onImportSankalpas(imported);
          setImportStatus({ success: true, message: `Successfully restored ${imported.length} Sankalpa(s)!` });
        }
      } catch (err) {
        setImportStatus({ success: false, message: err.message });
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in text-white">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 max-w-md w-full shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-4">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <span>💾</span> Data Backup & Restore
          </h3>
          <button onClick={onClose} className="text-zinc-500 hover:text-white text-sm">
            ✕
          </button>
        </div>

        <p className="text-xs text-zinc-400 mb-4">
          Your Sankalpa progress is stored safely in your browser. Download a backup JSON file so you never lose your spiritual record.
        </p>

        {importStatus && (
          <div
            className={`p-3 rounded-lg text-xs mb-4 border ${
              importStatus.success
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                : 'bg-red-500/20 border-red-500/40 text-red-300'
            }`}
          >
            {importStatus.message}
          </div>
        )}

        {/* Export Option */}
        <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800/80 mb-4">
          <div className="font-semibold text-sm text-amber-200 mb-1">Export Backup File</div>
          <p className="text-xs text-zinc-400 mb-3">
            Download your current Sankalpas, goal counts, and all historical session timestamps.
          </p>
          <button
            onClick={handleExport}
            className="w-full py-2 px-4 bg-zinc-800 hover:bg-zinc-700 text-amber-300 font-semibold text-xs rounded-lg border border-zinc-700 transition flex items-center justify-center gap-2"
          >
            <span>📥</span> Download Backup (.json)
          </button>
        </div>

        {/* Import Option */}
        <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800/80">
          <div className="font-semibold text-sm text-zinc-200 mb-1">Restore from Backup</div>
          <p className="text-xs text-zinc-400 mb-3">
            Load an existing Sankalpa backup file to restore or merge records.
          </p>

          <label className="w-full py-2 px-4 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs rounded-lg transition flex items-center justify-center gap-2 cursor-pointer shadow">
            <span>📤</span> Select Backup File (.json)
            <input
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>

        <div className="mt-5 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-zinc-800 text-zinc-300 text-xs rounded-lg hover:bg-zinc-700 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
