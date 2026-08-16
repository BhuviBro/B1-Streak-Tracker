import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from './AuthContext';
import { INITIAL_MOCK_USER, INITIAL_MOCK_TASKS, INITIAL_MOCK_ROUTINES, INITIAL_MOCK_CATEGORIES, INITIAL_MOCK_TIME_COMMITMENTS } from '../utils/dummyData';

const DataContext = createContext();

const LOCAL_STORAGE_CACHE_KEY = 'streak_tracker_local_cache';

export function DataProvider({ children }) {
  const { currentUser } = useAuth();

  // Primary application state
  const [data, setData] = useState(() => {
    const cached = localStorage.getItem(LOCAL_STORAGE_CACHE_KEY);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {
        console.error('Failed to parse local storage cache', e);
      }
    }
    return {
      profile: {
        name: "Guest User",
        email: "guest@example.com",
        avatar: "",
        ongoingStreak: 0,
        timeRemainingToday: "8h 0m",
      },
      tasks: [],
      routines: [],
      categories: INITIAL_MOCK_CATEGORIES,
      timeCommitments: INITIAL_MOCK_TIME_COMMITMENTS,
    };
  });

  const [isSyncing, setIsSyncing] = useState(false);

  // Sync to Firestore when user is authenticated
  useEffect(() => {
    if (!currentUser || !import.meta.env.VITE_FIREBASE_API_KEY) return;

    try {
      const userDocRef = doc(db, 'users', currentUser.uid, 'data', 'main');
      setIsSyncing(true);

      const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
        if (docSnap.exists()) {
          const firestoreData = docSnap.data();
          setData(firestoreData);
          localStorage.setItem(LOCAL_STORAGE_CACHE_KEY, JSON.stringify(firestoreData));
        } else {
          const initialData = {
            profile: {
              name: currentUser.displayName || 'User',
              email: currentUser.email || '',
              avatar: currentUser.photoURL || '',
              ongoingStreak: 0,
              timeRemainingToday: '8h 0m',
            },
            tasks: [],
            routines: [],
            categories: INITIAL_MOCK_CATEGORIES,
            timeCommitments: INITIAL_MOCK_TIME_COMMITMENTS,
          };
          setDoc(userDocRef, initialData, { merge: true });
          setData(initialData);
          localStorage.setItem(LOCAL_STORAGE_CACHE_KEY, JSON.stringify(initialData));
        }
        setIsSyncing(false);
      }, (error) => {
        console.error('Firestore sync error (falling back to offline cache):', error);
        setIsSyncing(false);
      });

      return unsubscribe;
    } catch (e) {
      console.error('Failed to initialize Firestore listener: ', e);
    }
  }, [currentUser]);

  // Helper to persist state to local state + localStorage + Cloud Firestore
  const updateData = async (newPartialData) => {
    setData((prev) => {
      const updated = { ...prev, ...newPartialData };
      localStorage.setItem(LOCAL_STORAGE_CACHE_KEY, JSON.stringify(updated));

      if (currentUser) {
        const userDocRef = doc(db, 'users', currentUser.uid, 'data', 'main');
        setDoc(userDocRef, updated, { merge: true }).catch((err) => {
          console.warn('Optimistic offline update saved locally; Firestore write queued:', err);
        });
      }

      return updated;
    });
  };

  // -------------------------------------------------------------
  // TASK CRUD OPERATIONS (Phase 5 & 6)
  // -------------------------------------------------------------

  // 1. Add Task
  const addTask = (taskInput) => {
    const newTask = {
      id: `task-${Date.now()}`,
      title: taskInput.title,
      scheduledDate: taskInput.scheduledDate || new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      completed: false,
      completedAt: null,
      cancelled: false,
      priority: taskInput.priority || 'Medium',
      category: taskInput.category || 'Study',
      reminder: taskInput.reminder || '',
      notes: taskInput.notes || '',
    };
    updateData({ tasks: [newTask, ...(data.tasks || [])] });
  };

  // 2. Toggle Complete Task
  const toggleTask = (taskId) => {
    const updatedTasks = (data.tasks || []).map((t) => {
      if (t.id === taskId) {
        const nextCompleted = !t.completed;
        return {
          ...t,
          completed: nextCompleted,
          completedAt: nextCompleted ? new Date().toISOString() : null,
          cancelled: false // Uncomplete sets cancelled back to false
        };
      }
      return t;
    });
    updateData({ tasks: updatedTasks });
  };

  // 3. Edit Task
  const editTask = (taskId, updatedFields) => {
    const updatedTasks = (data.tasks || []).map((t) => {
      if (t.id === taskId) {
        return { ...t, ...updatedFields };
      }
      return t;
    });
    updateData({ tasks: updatedTasks });
  };

  // Carry Forward Batch Action Processor
  const batchCarryForwardTasks = (taskActionsMap, targetTodayDate) => {
    const currentTasks = data.tasks || [];
    const newTasksCreated = [];
    const updatedExistingTasks = currentTasks.map(t => {
      const action = taskActionsMap[t.id];
      if (!action) return t;

      if (action.type === 'cancel') {
        // Mark original task as cancelled in history
        return { ...t, cancelled: true };
      }

      if (action.type === 'today' || action.type === 'reschedule') {
        const targetDate = action.type === 'today' ? targetTodayDate : action.date;
        const originalDateParts = t.scheduledDate.split('-');
        const formattedOrigDate = originalDateParts.length === 3
          ? `${originalDateParts[2]}/${originalDateParts[1]}/${originalDateParts[0].slice(-2)}`
          : t.scheduledDate;

        // Create new rollover task
        const rolledOverTask = {
          id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          title: `[RollOver]: ${t.title} [${formattedOrigDate}]`,
          scheduledDate: targetDate,
          createdAt: new Date().toISOString(),
          completed: false,
          completedAt: null,
          cancelled: false,
          priority: t.priority || 'Medium',
          category: t.category || 'Study',
          reminder: t.reminder || '',
          notes: t.notes || '',
        };
        newTasksCreated.push(rolledOverTask);

        // Keep the original task as uncompleted, but mark it with metadata if needed
        return { ...t, rolledOver: true };
      }

      return t;
    });

    // Update both states
    updateData({ 
      tasks: [...newTasksCreated, ...updatedExistingTasks],
      profile: { ...data.profile, lastActiveDate: targetTodayDate }
    });
  };

  // 4. Delete Task
  const deleteTask = (taskId) => {
    const updatedTasks = (data.tasks || []).filter((t) => t.id !== taskId);
    updateData({ tasks: updatedTasks });
  };

  // -------------------------------------------------------------
  // ROUTINE OPERATIONS (Phase 7 & 8)
  // -------------------------------------------------------------

  const toggleRoutineCompletion = (routineId, dateStr) => {
    const updatedRoutines = (data.routines || []).map((r) => {
      if (r.id === routineId) {
        const completions = { ...(r.completions || {}) };
        const isCurrentTrue = completions[dateStr] === true || (completions[dateStr] && completions[dateStr].completed === true);
        const nextState = !isCurrentTrue;

        if (nextState) {
          completions[dateStr] = {
            completed: true,
            completedAt: new Date().toISOString()
          };
        } else {
          completions[dateStr] = false;
        }

        // Recalculate streak & counts dynamically
        const dates = Object.keys(completions).sort();
        let currentStreak = 0;
        let bestStreak = r.bestStreak || 0;
        let completedDays = 0;
        let missedDays = 0;

        dates.forEach((d) => {
          const isDone = completions[d] === true || (completions[d] && completions[d].completed === true);
          if (isDone) {
            completedDays += 1;
            currentStreak += 1;
            if (currentStreak > bestStreak) bestStreak = currentStreak;
          } else {
            missedDays += 1;
            currentStreak = 0;
          }
        });

        return {
          ...r,
          completions,
          currentStreak,
          bestStreak,
          completedDays,
          missedDays,
        };
      }
      return r;
    });

    updateData({ routines: updatedRoutines });
  };

  const addRoutine = (routineInput) => {
    const newRoutine = {
      id: `routine-${Date.now()}`,
      title: routineInput.title,
      category: routineInput.category || 'Study',
      startDate: routineInput.startDate || new Date().toISOString().split('T')[0],
      goalDate: routineInput.goalDate || '',
      status: 'active',
      currentStreak: 0,
      bestStreak: 0,
      completedDays: 0,
      missedDays: 0,
      daysRemaining: 30,
      consistency: 100,
      completions: {},
      createdAt: new Date().toISOString(),
    };
    updateData({ routines: [newRoutine, ...(data.routines || [])] });
  };

  const editRoutine = (routineId, updatedFields) => {
    const updatedRoutines = (data.routines || []).map((r) => {
      if (r.id === routineId) {
        return { ...r, ...updatedFields };
      }
      return r;
    });
    updateData({ routines: updatedRoutines });
  };

  const deleteRoutine = (routineId) => {
    const updatedRoutines = (data.routines || []).filter((r) => r.id !== routineId);
    updateData({ routines: updatedRoutines });
  };

  const toggleRoutineStatus = (routineId) => {
    const updatedRoutines = (data.routines || []).map((r) => {
      if (r.id === routineId) {
        return { ...r, status: r.status === 'active' ? 'paused' : 'active' };
      }
      return r;
    });
    updateData({ routines: updatedRoutines });
  };

  // -------------------------------------------------------------
  // CATEGORIES & TIME COMMITMENTS (Phase 9 & 10)
  // -------------------------------------------------------------

  const addCategory = (name, color) => {
    const newCat = { id: `cat-${Date.now()}`, name, color };
    updateData({ categories: [...(data.categories || []), newCat] });
  };

  const addTimeCommitment = (commitment) => {
    const newCommitment = {
      id: `time-${Date.now()}`,
      ...commitment,
    };
    updateData({ timeCommitments: [...(data.timeCommitments || []), newCommitment] });
  };

  const deleteTimeCommitment = (commitmentId) => {
    const updatedCommitments = (data.timeCommitments || []).filter(c => c.id !== commitmentId);
    updateData({ timeCommitments: updatedCommitments });
  };

  return (
    <DataContext.Provider
      value={{
        data,
        tasks: data.tasks || [],
        routines: data.routines || [],
        categories: data.categories || [],
        timeCommitments: data.timeCommitments || [],
        profile: data.profile || INITIAL_MOCK_USER,
        isSyncing,
        addTask,
        toggleTask,
        editTask,
        deleteTask,
        batchCarryForwardTasks,
        addRoutine,
        editRoutine,
        deleteRoutine,
        toggleRoutineStatus,
        toggleRoutineCompletion,
        addCategory,
        addTimeCommitment,
        deleteTimeCommitment,
        updateData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
