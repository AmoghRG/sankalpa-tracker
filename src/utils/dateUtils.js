/**
 * Date utility functions for Sankalpa Tracker
 */

// Format Date object to YYYY-MM-DD in local time
export function toDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Convert legacy DD/MM/YYYY or YYYY-MM-DD to standard YYYY-MM-DD
export function normalizeDateKey(dateStr) {
  if (!dateStr) return toDateKey();
  if (dateStr.includes('/')) {
    const parts = dateStr.split('/');
    if (parts.length === 3) {
      // DD/MM/YYYY -> YYYY-MM-DD
      const [d, m, y] = parts;
      return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
    }
  }
  return dateStr;
}

// Parse YYYY-MM-DD safely into a local Date object
export function parseDateKey(dateKey) {
  if (!dateKey) return new Date();
  const [year, month, day] = dateKey.split('-').map(Number);
  return new Date(year, month - 1, day);
}

// Format YYYY-MM-DD for readable display (e.g., "24 Nov 2026")
export function formatDisplayDate(dateKey, options = { month: 'short', day: 'numeric', year: 'numeric' }) {
  if (!dateKey) return '';
  const date = parseDateKey(dateKey);
  return date.toLocaleDateString('en-GB', options);
}

// Calculate Sankalpa timeline details
export function calculateSankalpaTimeline(startDateKey, durationDays) {
  if (!startDateKey) {
    return {
      hasStart: false,
      startDateFormatted: '',
      endDateFormatted: '',
      endDateKey: '',
      currentDay: 0,
      daysRemaining: 0,
      status: 'unconfigured', // unconfigured, upcoming, active, completed
      progressDaysPercent: 0,
    };
  }

  const duration = Number(durationDays) || 40;
  const start = parseDateKey(startDateKey);
  const end = new Date(start);
  end.setDate(end.getDate() + duration - 1);
  const endDateKey = toDateKey(end);

  const today = parseDateKey(toDateKey());
  const diffTime = today.getTime() - start.getTime();
  const currentDay = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;

  let status = 'active';
  if (currentDay < 1) {
    status = 'upcoming';
  } else if (currentDay > duration) {
    status = 'completed';
  }

  const daysRemaining = Math.max(duration - Math.max(currentDay, 1) + 1, 0);
  const progressDaysPercent = Math.min(Math.max(Math.round(((currentDay - 1) / duration) * 100), 0), 100);

  return {
    hasStart: true,
    startDateFormatted: formatDisplayDate(startDateKey),
    endDateFormatted: formatDisplayDate(endDateKey),
    startDateKey,
    endDateKey,
    currentDay,
    daysRemaining,
    duration,
    status,
    progressDaysPercent,
  };
}

// Check if a date falls within the Sankalpa window
export function isDateInSankalpaRange(dateKey, startDateKey, endDateKey) {
  if (!startDateKey || !endDateKey || !dateKey) return false;
  return dateKey >= startDateKey && dateKey <= endDateKey;
}

// Calculate streaks from a Set or array of session dates
export function calculateStreaks(dateKeysArray) {
  if (!dateKeysArray || dateKeysArray.length === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  const uniqueDates = Array.from(new Set(dateKeysArray.map(normalizeDateKey))).sort();
  if (uniqueDates.length === 0) return { currentStreak: 0, longestStreak: 0 };

  const dateSet = new Set(uniqueDates);
  const todayKey = toDateKey();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = toDateKey(yesterday);

  // Calculate current streak
  let currentStreak = 0;
  let checkDate = dateSet.has(todayKey) ? new Date() : (dateSet.has(yesterdayKey) ? yesterday : null);

  if (checkDate) {
    while (true) {
      const key = toDateKey(checkDate);
      if (dateSet.has(key)) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
  }

  // Calculate longest streak
  let longestStreak = 0;
  let runningStreak = 0;
  let prevDate = null;

  for (const dateKey of uniqueDates) {
    const currentDate = parseDateKey(dateKey);
    if (!prevDate) {
      runningStreak = 1;
    } else {
      const diffDays = Math.round((currentDate - prevDate) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        runningStreak++;
      } else if (diffDays > 1) {
        runningStreak = 1;
      }
    }
    if (runningStreak > longestStreak) {
      longestStreak = runningStreak;
    }
    prevDate = currentDate;
  }

  return { currentStreak, longestStreak };
}

// Calculate pace and daily targets
export function calculatePace(totalCount, goalCount, timeline) {
  const goal = Number(goalCount) || 100;
  const remaining = Math.max(goal - totalCount, 0);

  if (remaining === 0) {
    return {
      remaining: 0,
      requiredDaily: 0,
      message: 'Sankalpa Goal Achieved! 🚩',
      status: 'completed',
    };
  }

  if (!timeline.hasStart) {
    return {
      remaining,
      requiredDaily: (remaining / (timeline.duration || 40)).toFixed(1),
      message: 'Set start date to calculate pace',
      status: 'pending',
    };
  }

  if (timeline.status === 'completed') {
    return {
      remaining,
      requiredDaily: 0,
      message: 'Timeline ended',
      status: 'overdue',
    };
  }

  const daysLeft = Math.max(timeline.daysRemaining, 1);
  const requiredDaily = (remaining / daysLeft).toFixed(1);

  return {
    remaining,
    requiredDaily,
    message: `${requiredDaily} / day needed to finish on time`,
    status: 'active',
  };
}
