import React, { useMemo } from 'react';
import { INITIAL_MOCK_TASKS, INITIAL_MOCK_ROUTINES, INITIAL_MOCK_CATEGORIES } from './dummyData';

// Contribution intensity level 0-5 based on completion percentage
export function getContribLevel(required, completed, isFuture = false) {
  if (isFuture) return 'neutral';
  if (!required || required === 0) return 'neutral';
  const rate = completed / required;
  if (rate === 0) return 0; // Level 0: Black / least graded
  if (rate < 0.25) return 1;
  if (rate < 0.5) return 2;
  if (rate < 0.75) return 3;
  if (rate < 1) return 4;
  return 5;
}

export function getCellColor(level) {
  if (level === 'neutral') return 'var(--contrib-neutral)';
  return `var(--contrib-level-${level})`;
}

// Helper to generate all YYYY-MM-DD strings between two dates
function getDatesInRange(startStr, endStr) {
  const dates = [];
  if (!startStr || !endStr || startStr > endStr) return dates;
  const curr = new Date(`${startStr}T00:00:00`);
  const end = new Date(`${endStr}T00:00:00`);
  while (curr <= end) {
    const y = curr.getFullYear();
    const m = String(curr.getMonth() + 1).padStart(2, '0');
    const d = String(curr.getDate()).padStart(2, '0');
    dates.push(`${y}-${m}-${d}`);
    curr.setDate(curr.getDate() + 1);
  }
  return dates;
}

// Build activity map for the calendar
export function buildActivityMap(routines = INITIAL_MOCK_ROUTINES, tasks = INITIAL_MOCK_TASKS, todayStr = null) {
  const map = {};
  const currentToday = todayStr || (() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  })();

  // 1. Process Tasks
  tasks.forEach(task => {
    const d = task.scheduledDate;
    if (d && !task.cancelled) {
      if (!map[d]) map[d] = { required: 0, completed: 0 };
      map[d].required += 1;
      if (task.completed) map[d].completed += 1;
    }
  });

  // 2. Process Routines
  routines.forEach(routine => {
    if (routine.status === 'paused') return;

    const coveredDates = new Set();
    const effectiveStart = routine.startDate;
    const effectiveEnd = routine.goalDate && routine.goalDate < currentToday ? routine.goalDate : currentToday;

    // Routine is expected every day from startDate up to today
    if (effectiveStart && effectiveStart <= effectiveEnd) {
      const activeDates = getDatesInRange(effectiveStart, effectiveEnd);
      activeDates.forEach(dateStr => {
        coveredDates.add(dateStr);
        if (!map[dateStr]) map[dateStr] = { required: 0, completed: 0 };
        map[dateStr].required += 1;
        const doneObj = routine.completions?.[dateStr];
        const isDone = doneObj === true || (doneObj && doneObj.completed === true);
        if (isDone) map[dateStr].completed += 1;
      });
    }

    // Include any additional explicit completion records
    if (routine.completions) {
      Object.entries(routine.completions).forEach(([dateStr, doneObj]) => {
        if (!coveredDates.has(dateStr)) {
          if (!map[dateStr]) map[dateStr] = { required: 0, completed: 0 };
          map[dateStr].required += 1;
          const isDone = doneObj === true || (doneObj && doneObj.completed === true);
          if (isDone) map[dateStr].completed += 1;
        }
      });
    }
  });

  return map;
}

