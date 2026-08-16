import React, { useMemo } from 'react';
import { INITIAL_MOCK_TASKS, INITIAL_MOCK_ROUTINES, INITIAL_MOCK_CATEGORIES } from './dummyData';

// Contribution intensity level 0-5 based on completion percentage
export function getContribLevel(required, completed) {
  if (required === 0) return 'neutral';
  const rate = completed / required;
  if (rate === 0) return 0;
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

// Build mock activity map for the calendar
export function buildActivityMap(routines = INITIAL_MOCK_ROUTINES, tasks = INITIAL_MOCK_TASKS) {
  const map = {};

  routines.forEach(routine => {
    if (routine.completions) {
      Object.entries(routine.completions).forEach(([date, done]) => {
        if (!map[date]) map[date] = { required: 0, completed: 0 };
        map[date].required += 1;
        if (done) map[date].completed += 1;
      });
    }
  });

  tasks.forEach(task => {
    const d = task.scheduledDate;
    if (d) {
      if (!map[d]) map[d] = { required: 0, completed: 0 };
      map[d].required += 1;
      if (task.completed) map[d].completed += 1;
    }
  });

  return map;
}

