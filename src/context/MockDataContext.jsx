import React, { createContext, useContext, useState } from 'react';
import {
  INITIAL_MOCK_USER,
  INITIAL_MOCK_TASKS,
  INITIAL_MOCK_ROUTINES,
  INITIAL_MOCK_CATEGORIES,
  INITIAL_MOCK_TIME_COMMITMENTS
} from '../utils/dummyData';

const MockDataContext = createContext(null);

export function MockDataProvider({ children }) {
  const [user, setUser] = useState(INITIAL_MOCK_USER);
  const [tasks, setTasks] = useState(INITIAL_MOCK_TASKS);
  const [routines, setRoutines] = useState(INITIAL_MOCK_ROUTINES);
  const [categories, setCategories] = useState(INITIAL_MOCK_CATEGORIES);
  const [commitments, setCommitments] = useState(INITIAL_MOCK_TIME_COMMITMENTS);

  // Task Actions
  const addTask = (newTask) => {
    const taskObj = {
      id: `task-${Date.now()}`,
      title: newTask.title,
      scheduledDate: newTask.scheduledDate || '2026-08-11',
      completed: false,
      completedAt: null,
      priority: newTask.priority || 'Medium',
      category: newTask.category || 'Personal',
      reminder: newTask.reminder || '',
      notes: newTask.notes || '',
    };
    setTasks(prev => [taskObj, ...prev]);
    return taskObj;
  };

  const toggleTask = (taskId) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const nextCompleted = !t.completed;
        return {
          ...t,
          completed: nextCompleted,
          completedAt: nextCompleted ? new Date().toISOString() : null,
        };
      }
      return t;
    }));
  };

  const deleteTask = (taskId) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
  };

  // Routine Actions
  const addRoutine = (newRoutine) => {
    const routineObj = {
      id: `routine-${Date.now()}`,
      title: newRoutine.title,
      category: newRoutine.category || 'Personal',
      startDate: newRoutine.startDate || '2026-08-11',
      goalDate: newRoutine.goalDate || '2026-09-11',
      status: 'active',
      currentStreak: 0,
      bestStreak: 0,
      completedDays: 0,
      missedDays: 0,
      daysRemaining: 31,
      consistency: 100,
      completions: {
        [newRoutine.startDate || '2026-08-11']: false,
      },
    };
    setRoutines(prev => [routineObj, ...prev]);
    return routineObj;
  };


  const toggleRoutineOccurrence = (routineId, dateStr = '2026-08-11') => {
    setRoutines(prev => prev.map(r => {
      if (r.id === routineId) {
        const currentVal = !!r.completions?.[dateStr];
        const nextVal = !currentVal;
        const newCompletions = { ...(r.completions || {}), [dateStr]: nextVal };
        const completedDays = Object.values(newCompletions).filter(Boolean).length;
        const currentStreak = nextVal ? r.currentStreak + 1 : Math.max(0, r.currentStreak - 1);
        const bestStreak = Math.max(r.bestStreak, currentStreak);
        const totalReq = completedDays + r.missedDays;
        const consistency = totalReq > 0 ? (completedDays / totalReq) * 100 : 100;

        return {
          ...r,
          currentStreak,
          bestStreak,
          completedDays,
          consistency,
          completions: newCompletions,
        };
      }
      return r;
    }));
  };

  const pauseRoutine = (routineId) => {
    setRoutines(prev => prev.map(r => r.id === routineId
      ? { ...r, status: r.status === 'active' ? 'paused' : 'active' }
      : r
    ));
  };

  const updateRoutineGoal = (routineId, newGoalDate) => {
    setRoutines(prev => prev.map(r => r.id === routineId
      ? { ...r, goalDate: newGoalDate }
      : r
    ));
  };

  const deleteRoutine = (routineId) => {
    setRoutines(prev => prev.filter(r => r.id !== routineId));
  };

  // Category Actions
  const addCategory = (name, color) => {
    const newCat = {
      id: `cat-${Date.now()}`,
      name: name.trim(),
      color: color || '#2ea043',
    };
    setCategories(prev => [...prev, newCat]);
  };

  // Time Commitment Actions
  const addCommitment = (newCommitment) => {
    const item = {
      id: `time-${Date.now()}`,
      name: newCommitment.name,
      durationMinutes: newCommitment.durationMinutes || 60,
      days: newCommitment.days || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      type: newCommitment.type || 'fixed',
    };
    setCommitments(prev => [...prev, item]);
  };

  const deleteCommitment = (id) => {
    setCommitments(prev => prev.filter(c => c.id !== id));
  };

  // User Actions
  const updateUser = (updates) => {
    setUser(prev => ({ ...prev, ...updates }));
  };

  return (
    <MockDataContext.Provider value={{
      user,
      tasks,
      routines,
      categories,
      commitments,
      addTask,
      toggleTask,
      deleteTask,
      addRoutine,
      toggleRoutineOccurrence,
      pauseRoutine,
      updateRoutineGoal,
      deleteRoutine,
      addCategory,
      addCommitment,
      deleteCommitment,
      updateUser,
    }}>
      {children}
    </MockDataContext.Provider>
  );
}

export function useMockData() {
  const ctx = useContext(MockDataContext);
  if (!ctx) {
    throw new Error('useMockData must be used within MockDataProvider');
  }
  return ctx;
}
