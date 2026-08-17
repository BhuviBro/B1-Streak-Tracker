/**
 * Pre-populated Mock Data Store for UI Prototype Preview (Phase 3)
 * Based on dummy data specifications in instructions.md Section 48
 */

const getOffsetDateStr = (offset) => {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export const INITIAL_MOCK_USER = {
  name: "Alex Johnson",
  email: "alex.johnson@email.com",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250",
  currentDate: getOffsetDateStr(0),
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
    scheduledDate: getOffsetDateStr(0),
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
    scheduledDate: getOffsetDateStr(0),
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
    scheduledDate: getOffsetDateStr(0),
    completed: true,
    completedAt: getOffsetDateStr(0) + "T19:15:00Z",
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
    startDate: getOffsetDateStr(-10),
    goalDate: getOffsetDateStr(20),
    status: "active",
    currentStreak: 12,
    bestStreak: 15,
    completedDays: 18,
    missedDays: 3,
    daysRemaining: 20,
    consistency: 85.7,
    completions: {
      [getOffsetDateStr(-10)]: true,
      [getOffsetDateStr(-9)]: true,
      [getOffsetDateStr(-8)]: true,
      [getOffsetDateStr(-7)]: false,
      [getOffsetDateStr(-6)]: true,
      [getOffsetDateStr(-5)]: true,
      [getOffsetDateStr(-4)]: true,
      [getOffsetDateStr(-3)]: true,
      [getOffsetDateStr(-2)]: true,
      [getOffsetDateStr(-1)]: true,
      [getOffsetDateStr(0)]: false,
    }
  },
  {
    id: "routine-2",
    title: "Read Every Day",
    category: "Study",
    startDate: getOffsetDateStr(-10),
    goalDate: getOffsetDateStr(30),
    status: "active",
    currentStreak: 5,
    bestStreak: 10,
    completedDays: 15,
    missedDays: 2,
    daysRemaining: 30,
    consistency: 88.2,
    completions: {
      [getOffsetDateStr(-10)]: true,
      [getOffsetDateStr(-9)]: true,
      [getOffsetDateStr(-8)]: true,
      [getOffsetDateStr(-7)]: true,
      [getOffsetDateStr(-6)]: true,
      [getOffsetDateStr(-5)]: false,
      [getOffsetDateStr(-4)]: true,
      [getOffsetDateStr(-3)]: true,
      [getOffsetDateStr(-2)]: true,
      [getOffsetDateStr(-1)]: true,
      [getOffsetDateStr(0)]: false,
    }
  },
  {
    id: "routine-3",
    title: "Workout Daily",
    category: "Health",
    startDate: getOffsetDateStr(-10),
    goalDate: getOffsetDateStr(14),
    status: "active",
    currentStreak: 8,
    bestStreak: 11,
    completedDays: 14,
    missedDays: 2,
    daysRemaining: 14,
    consistency: 87.5,
    completions: {
      [getOffsetDateStr(-10)]: true,
      [getOffsetDateStr(-9)]: true,
      [getOffsetDateStr(-8)]: true,
      [getOffsetDateStr(-7)]: true,
      [getOffsetDateStr(-6)]: true,
      [getOffsetDateStr(-5)]: true,
      [getOffsetDateStr(-4)]: true,
      [getOffsetDateStr(-3)]: true,
      [getOffsetDateStr(-2)]: false,
      [getOffsetDateStr(-1)]: true,
      [getOffsetDateStr(0)]: true,
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
