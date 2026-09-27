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

// Calculate accurate calendar-based stats for a routine
export function calculateRoutineStats(routine, todayStr = null) {
  const currentToday = todayStr || (() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  })();

  const startDate = routine.startDate;
  const goalDate = routine.goalDate;
  const completions = routine.completions || {};

  if (!startDate) {
    return {
      currentStreak: routine.currentStreak || 0,
      bestStreak: routine.bestStreak || 0,
      completedDays: routine.completedDays || 0,
      missedDays: routine.missedDays || 0,
      daysRemaining: routine.daysRemaining || 0,
      consistency: routine.consistency || 100,
      isEnded: false,
    };
  }

  // Calculate days remaining and check if goal ended
  let daysRemaining = 0;
  const isEnded = routine.status === 'completed' || Boolean(goalDate && currentToday > goalDate);
  if (goalDate) {
    if (currentToday > goalDate) {
      daysRemaining = 0;
    } else {
      const d1 = new Date(currentToday + 'T00:00:00');
      const d2 = new Date(goalDate + 'T00:00:00');
      daysRemaining = Math.max(0, Math.ceil((d2 - d1) / (1000 * 60 * 60 * 24)));
    }
  }

  // Evaluation range: from startDate to Math.min(currentToday, goalDate)
  const evalEnd = goalDate && goalDate < currentToday ? goalDate : currentToday;

  let completedDays = 0;
  let missedDays = 0;

  const activeDates = getDatesInRange(startDate, evalEnd);
  const dateStatusMap = {};

  activeDates.forEach(dateStr => {
    const doneObj = completions[dateStr];
    const isDone = doneObj === true || (doneObj && doneObj.completed === true);
    dateStatusMap[dateStr] = isDone;

    if (isDone) {
      completedDays += 1;
    } else {
      if (dateStr < currentToday || isEnded) {
        missedDays += 1;
      }
    }
  });

  // Calculate Current Streak working backwards (only active routines have ongoing streak)
  let currentStreak = 0;
  if (!isEnded) {
    let checkDate = new Date(`${currentToday}T00:00:00`);
    const startD = new Date(`${startDate}T00:00:00`);
    const todayDone = completions[currentToday] === true || (completions[currentToday] && completions[currentToday].completed === true);

    if (todayDone) {
      currentStreak += 1;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      // If not completed today yet, check yesterday to preserve active streak
      checkDate.setDate(checkDate.getDate() - 1);
    }

    while (checkDate >= startD) {
      const y = checkDate.getFullYear();
      const m = String(checkDate.getMonth() + 1).padStart(2, '0');
      const d = String(checkDate.getDate()).padStart(2, '0');
      const dateStr = `${y}-${m}-${d}`;

      const doneObj = completions[dateStr];
      const isDone = doneObj === true || (doneObj && doneObj.completed === true);

      if (isDone) {
        currentStreak += 1;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
  }

  // Calculate Best Streak chronologically
  let bestStreak = 0;
  let tempStreak = 0;

  activeDates.forEach(dateStr => {
    if (dateStatusMap[dateStr]) {
      tempStreak += 1;
      if (tempStreak > bestStreak) {
        bestStreak = tempStreak;
      }
    } else {
      tempStreak = 0;
    }
  });

  bestStreak = Math.max(bestStreak, currentStreak, routine.bestStreak || 0);

  const totalEvaluated = completedDays + missedDays;
  const consistency = totalEvaluated > 0 ? (completedDays / totalEvaluated) * 100 : 100;

  return {
    currentStreak,
    bestStreak,
    completedDays,
    missedDays,
    daysRemaining,
    consistency: Math.round(consistency * 10) / 10,
    isEnded,
  };
}

