/**
 * Storage and Data Management Utilities for Sankalpa Tracker
 */
import { normalizeDateKey, toDateKey } from './dateUtils';

export const PRESETS = [
  {
    id: 'hanuman_chalisa',
    name: 'Hanuman Chalisa',
    icon: '🚩',
    goalCount: 100,
    durationDays: 40,
    description: '100 recitations over 40 days',
    badge: 'Most Popular',
  },
  {
    id: 'gayatri_mantra',
    name: 'Gayatri Mantra Japa',
    icon: '🪔',
    goalCount: 1008,
    durationDays: 40,
    description: '1008 morning japa counts in 40 days',
    badge: 'Vedic Japa',
  },
  {
    id: 'maha_mrityunjaya',
    name: 'Maha Mrityunjaya Mantra',
    icon: '🕉️',
    goalCount: 108,
    durationDays: 21,
    description: '108 recitations over 21 days',
    badge: 'Healing',
  },
  {
    id: 'aditya_hrudayam',
    name: 'Aditya Hrudayam Stotram',
    icon: '☀️',
    goalCount: 48,
    durationDays: 48,
    description: '48 recitations in 48 days (1 Mandala)',
    badge: '1 Mandala',
  },
  {
    id: 'vishnu_sahasranama',
    name: 'Vishnu Sahasranama',
    icon: '📿',
    goalCount: 48,
    durationDays: 48,
    description: '48 days sacred chanting of 1000 names',
    badge: 'Sacred Stotra',
  },
  {
    id: 'gita_reading',
    name: 'Bhagavad Gita Chapters',
    icon: '📜',
    goalCount: 18,
    durationDays: 18,
    description: 'Read all 18 Gita chapters in 18 days',
    badge: '18 Days',
  },
];

export function getTimeOfDayTag(date = new Date()) {
  const hour = date.getHours();
  if (hour >= 4 && hour < 12) {
    return { id: 'morning', label: 'Morning', icon: '🌅' };
  } else if (hour >= 12 && hour < 17) {
    return { id: 'afternoon', label: 'Afternoon', icon: '☀️' };
  } else if (hour >= 17 && hour < 21) {
    return { id: 'sandhya', label: 'Sandhya', icon: '🪔' };
  } else {
    return { id: 'night', label: 'Ratri / Night', icon: '🌙' };
  }
}

// Initialize and migrate data from legacy localStorage if present
export function loadInitialData() {
  try {
    let archivedSankalpas = [];
    const rawArchived = localStorage.getItem('archived_sankalpas');
    if (rawArchived) {
      try {
        const parsed = JSON.parse(rawArchived);
        if (Array.isArray(parsed)) archivedSankalpas = parsed;
      } catch (e) {
        console.error('Failed to parse archived sankalpas', e);
      }
    }

    const rawSankalpas = localStorage.getItem('sankalpas_v2');
    if (rawSankalpas) {
      const parsed = JSON.parse(rawSankalpas);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const activeId = localStorage.getItem('active_sankalpa_id') || parsed[0].id;
        return { sankalpas: parsed, activeId, archivedSankalpas };
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
            tag: s.tag || getTimeOfDayTag().label,
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
      cycleNumber: 1,
      createdAt: Date.now(),
    };

    const initialList = [initialSankalpa];
    localStorage.setItem('sankalpas_v2', JSON.stringify(initialList));
    localStorage.setItem('active_sankalpa_id', initialSankalpa.id);

    return { sankalpas: initialList, activeId: initialSankalpa.id, archivedSankalpas };
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
      cycleNumber: 1,
      createdAt: Date.now(),
    };
    return { sankalpas: [fallback], activeId: fallback.id, archivedSankalpas: [] };
  }
}

// Save sankalpas array and archives to localStorage
export function saveSankalpas(sankalpas, activeId, archivedSankalpas = []) {
  try {
    localStorage.setItem('sankalpas_v2', JSON.stringify(sankalpas));
    if (activeId) {
      localStorage.setItem('active_sankalpa_id', activeId);
    }
    localStorage.setItem('archived_sankalpas', JSON.stringify(archivedSankalpas));
  } catch (e) {
    console.error('Failed to save to localStorage', e);
  }
}

// Export all tracker data as JSON download
export function exportDataAsJSON(sankalpas, archivedSankalpas = []) {
  const exportPayload = {
    app: 'Sankalpa Tracker',
    version: '2.1',
    exportedAt: new Date().toISOString(),
    sankalpas,
    archivedSankalpas,
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
    return {
      sankalpas: data.sankalpas,
      archivedSankalpas: Array.isArray(data.archivedSankalpas) ? data.archivedSankalpas : [],
    };
  } catch (err) {
    throw new Error('Invalid JSON file format: ' + err.message, { cause: err });
  }
}
