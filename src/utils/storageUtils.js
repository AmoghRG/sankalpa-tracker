/**
 * Storage and Data Management Utilities for Sankalpa Tracker
 */
import { normalizeDateKey, toDateKey } from './dateUtils';

export const PRESETS = [
  {
    name: 'Hanuman Chalisa',
    icon: '🚩',
    goalCount: 100,
    durationDays: 40,
    description: '40-day Hanuman Chalisa sadhana (100 or 108 recitations)',
  },
  {
    name: 'Gayatri Mantra Japa',
    icon: '🪔',
    goalCount: 1008,
    durationDays: 40,
    description: '40-day morning Gayatri Japa sadhana',
  },
  {
    name: 'Maha Mrityunjaya Mantra',
    icon: '🕉️',
    goalCount: 108,
    durationDays: 21,
    description: '21-day healing and protection mantra',
  },
  {
    name: 'Aditya Hrudayam Stotram',
    icon: '☀️',
    goalCount: 48,
    durationDays: 48,
    description: '1 Mandala (48 days) Surya stotram sadhana',
  },
  {
    name: 'Custom Sadhana',
    icon: '📿',
    goalCount: 100,
    durationDays: 40,
    description: 'Define your own personal vow, mantra, or sacred discipline',
  },
];

// Initialize and migrate data from legacy localStorage if present
export function loadInitialData() {
  try {
    const rawSankalpas = localStorage.getItem('sankalpas_v2');
    if (rawSankalpas) {
      const parsed = JSON.parse(rawSankalpas);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const activeId = localStorage.getItem('active_sankalpa_id') || parsed[0].id;
        return { sankalpas: parsed, activeId };
      }
    }

    // Migrate from legacy single-sankalpa localStorage
    const legacyName = localStorage.getItem('sankalpaName') || 'Hanuman Chalisa';
    const legacyGoal = Number(localStorage.getItem('goalCount')) || 100;
    const legacyDuration = Number(localStorage.getItem('durationDays')) || 40;
    const legacyStartDate = localStorage.getItem('startDate') || '';
    const rawSessions = localStorage.getItem('sessions');
    let legacySessions = [];

    if (rawSessions) {
      try {
        const parsedSessions = JSON.parse(rawSessions);
        if (Array.isArray(parsedSessions)) {
          legacySessions = parsedSessions.map((s, idx) => ({
            id: s.id || `migrated_${idx}_${Date.now()}`,
            date: normalizeDateKey(s.date),
            time: s.time || '12:00',
            count: Number(s.count) || 1,
            timestamp: s.timestamp || Date.now(),
          }));
        }
      } catch (e) {
        console.error('Error parsing legacy sessions', e);
      }
    }

    const initialSankalpa = {
      id: 'default_sankalpa',
      name: legacyName,
      icon: '🚩',
      goalCount: legacyGoal,
      durationDays: legacyDuration,
      startDate: legacyStartDate,
      sessions: legacySessions,
      createdAt: Date.now(),
    };

    const initialList = [initialSankalpa];
    localStorage.setItem('sankalpas_v2', JSON.stringify(initialList));
    localStorage.setItem('active_sankalpa_id', initialSankalpa.id);

    return { sankalpas: initialList, activeId: initialSankalpa.id };
  } catch (err) {
    console.error('Failed to load initial data', err);
    const fallback = {
      id: 'default_sankalpa',
      name: 'Hanuman Chalisa',
      icon: '🚩',
      goalCount: 100,
      durationDays: 40,
      startDate: toDateKey(),
      sessions: [],
      createdAt: Date.now(),
    };
    return { sankalpas: [fallback], activeId: fallback.id };
  }
}

// Save sankalpas array to localStorage
export function saveSankalpas(sankalpas, activeId) {
  try {
    localStorage.setItem('sankalpas_v2', JSON.stringify(sankalpas));
    if (activeId) {
      localStorage.setItem('active_sankalpa_id', activeId);
    }
  } catch (e) {
    console.error('Failed to save to localStorage', e);
  }
}

// Export all tracker data as JSON download
export function exportDataAsJSON(sankalpas) {
  const exportPayload = {
    app: 'Sankalpa Tracker',
    version: '2.0',
    exportedAt: new Date().toISOString(),
    sankalpas,
  };

  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportPayload, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `sankalpa-backup-${toDateKey()}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

// Validate and parse imported JSON
export function parseImportData(jsonString) {
  try {
    const data = JSON.parse(jsonString);
    if (!data || !Array.isArray(data.sankalpas)) {
      throw new Error('Invalid format: missing sankalpas array');
    }
    return data.sankalpas;
  } catch (err) {
    throw new Error('Invalid JSON file format: ' + err.message, { cause: err });
  }
}
