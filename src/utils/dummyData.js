/**
 * Pre-populated Mock Data Store for UI Prototype Preview (Phase 3)
 * Based on dummy data specifications in instructions.md Section 48
 */

export const INITIAL_MOCK_USER = {
  name: "Alex Johnson",
  email: "alex.johnson@email.com",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250",
  currentDate: "2026-08-11",
  ongoingStreak: 12,
  timeRemainingToday: "4h 32m",
};

export const INITIAL_MOCK_CATEGORIES = [
  { id: "cat-1", name: "Study", color: "#3fb950" },
  { id: "cat-2", name: "Work", color: "#58a6ff" },
  { id: "cat-3", name: "Health", color: "#f85149" },
  { id: "cat-4", name: "Fitness", color: "#d29922" },
  { id: "cat-5", name: "Personal", color: "#a371f7" },
  { id: "cat-6", name: "Coding", color: "#238636" },
];

export const INITIAL_MOCK_TASKS = [
  {
    id: "task-1",
    title: "Complete Java Practice",
    scheduledDate: "2026-08-11",
    completed: false,
    completedAt: null,
    priority: "High",
    category: "Study",
    reminder: "07:00 PM",
    notes: "Focus on object-oriented programming concepts."
  },
  {
    id: "task-2",
    title: "Read 20 Pages",
    scheduledDate: "2026-08-11",
    completed: false,
    completedAt: null,
    priority: "Medium",
    category: "Study",
    reminder: "09:00 PM",
    notes: "Chapter 4 of System Design."
  },
  {
    id: "task-3",
    title: "Workout",
    scheduledDate: "2026-08-11",
    completed: true,
    completedAt: "2026-08-11T19:15:00Z",
    priority: "High",
    category: "Health",
    reminder: "06:00 PM",
    notes: "Leg day workout routine."
  }
];

export const INITIAL_MOCK_ROUTINES = [
  {
    id: "routine-1",
    title: "Daily Coding",
    category: "Coding",
    startDate: "2026-08-01",
    goalDate: "2026-08-31",
    status: "active",
    currentStreak: 12,
    bestStreak: 15,
    completedDays: 18,
    missedDays: 3,
    daysRemaining: 20,
    consistency: 85.7,
    completions: {
      "2026-08-01": true,
      "2026-08-02": true,
      "2026-08-03": true,
      "2026-08-04": false,
      "2026-08-05": true,
      "2026-08-06": true,
      "2026-08-07": true,
      "2026-08-08": true,
      "2026-08-09": true,
      "2026-08-10": true,
      "2026-08-11": false,
    }
  },
  {
    id: "routine-2",
    title: "Read Every Day",
    category: "Study",
    startDate: "2026-08-01",
    goalDate: "2026-09-10",
    status: "active",
    currentStreak: 5,
    bestStreak: 10,
    completedDays: 15,
    missedDays: 2,
    daysRemaining: 30,
    consistency: 88.2,
    completions: {
      "2026-08-01": true,
      "2026-08-02": true,
      "2026-08-03": true,
      "2026-08-04": true,
      "2026-08-05": true,
      "2026-08-06": false,
      "2026-08-07": true,
      "2026-08-08": true,
      "2026-08-09": true,
      "2026-08-10": true,
      "2026-08-11": false,
    }
  },
  {
    id: "routine-3",
    title: "Workout Daily",
    category: "Health",
    startDate: "2026-08-01",
    goalDate: "2026-08-25",
    status: "active",
    currentStreak: 8,
    bestStreak: 11,
    completedDays: 14,
    missedDays: 2,
    daysRemaining: 14,
    consistency: 87.5,
    completions: {
      "2026-08-01": true,
      "2026-08-02": true,
      "2026-08-03": true,
      "2026-08-04": true,
      "2026-08-05": true,
      "2026-08-06": true,
      "2026-08-07": true,
      "2026-08-08": true,
      "2026-08-09": false,
      "2026-08-10": true,
      "2026-08-11": true,
    }
  }
];


export const INITIAL_MOCK_TIME_COMMITMENTS = [
  {
    id: "time-1",
    name: "Sleep",
    durationMinutes: 480, // 8 hours
    days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    type: "fixed"
  },
  {
    id: "time-2",
    name: "Work",
    durationMinutes: 480, // 8 hours
    days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    type: "fixed"
  },
  {
    id: "time-3",
    name: "Gym",
    durationMinutes: 60, // 1 hour
    days: ["Mon", "Wed", "Fri"],
    type: "flexible"
  },
  {
    id: "time-4",
    name: "Travel",
    durationMinutes: 60, // 1 hour
    days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    type: "fixed"
  }
];
