# Task & Routine Streak Tracker — Implementation Phases

This document defines the step-by-step implementation roadmap for the Task & Routine Streak Tracker.

The implementation must follow `instructions.md` as the product specification.

The application is a productivity and consistency tracker built around:

- Tasks
- Routines
- Overall daily activity
- GitHub-style activity calendar
- Overall streak
- Routine-specific streaks
- History and future planning
- Daily Time Commitments
- Firebase authentication and sync
- PWA support
- Light and Dark themes

---

# PHASE 1 — Project Setup & Environment Foundation

## Goal

Create the basic React application structure and development environment.

### Tasks

- [ ] Initialize React + Vite application.
- [ ] Install required dependencies.
- [ ] Configure Firebase.
- [ ] Configure PWA support.
- [ ] Configure environment variables.
- [ ] Create clean project folder structure.

### Dependencies

Required:

- `firebase`
- `lucide-react`
- `vite-plugin-pwa`

Additional dependencies should only be added when genuinely required.

### Folder Structure

```text
src/
├── assets/
├── components/
│   ├── common/
│   ├── layout/
│   ├── home/
│   ├── tasks/
│   ├── routines/
│   ├── history/
│   └── settings/
├── context/
├── hooks/
├── services/
├── utils/
├── styles/
└── App.jsx
```

Do not start implementing complicated business logic in this phase.

---

# PHASE 2 — Design System & Application Shell

## Goal

Create the visual foundation and navigation.

### Theme

Implement:

- GitHub-inspired Light theme
- GitHub-inspired Dark theme
- GitHub green contribution scale
- Typography
- Cards
- Buttons
- Inputs
- Modals
- Bottom navigation
- Responsive layout

### GitHub Green Scale

```text
Level 0 → Neutral / empty
Level 1 → 1–24%
Level 2 → 25–49%
Level 3 → 50–74%
Level 4 → 75–99%
Level 5 → 100%
```

### Bottom Navigation

```text
Home | Routines | + | History | Settings
```

The central `+` creates Tasks only.

The Routines screen has its own `+` for creating routines.

---

# PHASE 3 — Full UI Prototype & Screen Preview (Dummy Data Mockups)

## Goal

Build a fully interactive, clickable UI prototype pre-populated with rich dummy data so the entire user interface, themes, screens, modals, navigation, and visual aesthetics can be thoroughly reviewed and perfected before hooking up real backend logic.

### Objectives

1. **Dummy Data Store (`src/utils/dummyData.js`)**:
   - User Profile: Alex Johnson (`alex.johnson@email.com`).
   - Sample Tasks: Java Practice, Read 20 Pages, Workout, Submit Assignment.
   - Initial Routines: *Daily Coding* (12-day streak), *Read Every Day* (5-day streak), *Workout Daily* (8-day streak).
   - Sample Time Commitments: Sleep (8h), Work (8h), Gym (1h), Travel (1h).
   - Sample Categories & Reminders.

2. **Interactive Dummy UI Review Screens**:
   - **Home Screen Dashboard**: Header, GitHub activity calendar with intensity levels, Ongoing Streak badge, Time Remaining timer, Today's Merged List.
   - **Routines Screen & Routine Cards**: Routine cards with mini monthly streak calendars, stats, and add routine modal.
   - **Routine Details View**: Progress bars, stats breakdown, goal date editor, reset/pause/delete dialog previews.
   - **History & Date Browser**: Switch between Past historical logs, Today, and Future date planning screens.
   - **Add Task & Add Routine Modals**: Clickable popups with date pickers, category badges, and priority selectors.
   - **Settings & Sub-screens**: Profile page, Appearance Light/Dark mode switcher, Daily Time Commitments manager, Categories, and Reminders.
   - **Global Navigation Bar**: Interactive tab switcher (`Home | Routines | + | History | Settings`).

3. **Design & UX Verification**:
   - Test GitHub green visual hierarchy in both Light & Dark modes.
   - Verify smooth transitions, hover effects, modal animations, and responsive mobile layouts.
   - Review and refine UI feedback with the user before proceeding to backend persistence.

---

# PHASE 4 — Firebase Authentication & Data Foundation

## Goal

Establish authentication and persistent data before complex UI logic.

### Authentication

Implement:

- Firebase Authentication
- Google Sign-In
- Sign-Out
- Authentication state listener
- Auth Guard

### Firebase Data

Use a user-specific Firestore structure:

```text
users/{uid}
```

The exact schema must be finalized before implementation.

### Offline Support

Implement:

- Firestore offline persistence
- Local cache where useful
- Optimistic UI updates

The application must remain usable during temporary network loss.

---

# PHASE 5 — Core Data Models & Business Logic

## Goal

Define the core entities before building complex features.

There are three major concepts:

```text
Tasks
Routines
Daily Time Commitments
```

## Task Model

```text
id
title
scheduledDate
createdAt
completed
completedAt
priority
category
reminder
notes
```

## Routine Model

```text
id
title
startDate
goalDate
status
createdAt
updatedAt
```

## Routine Occurrence

```text
routineId
date
required
completed
completedAt
```

Routine occurrences must NOT be stored as normal tasks.

## Daily Time Commitment Model

```text
id
name
durationMinutes
days
type
createdAt
updatedAt
```

Where:

```text
type = fixed | flexible
```

---

# PHASE 6 — Task System

## Goal

Build a complete working Task system.

### Implement

- [ ] Add Task
- [ ] Edit Task
- [ ] Delete Task
- [ ] Complete Task
- [ ] Completion timestamp
- [ ] Today
- [ ] Tomorrow
- [ ] Custom date
- [ ] Priority
- [ ] Category
- [ ] Reminder
- [ ] Notes

Central `+` opens Add Task.

Required:

```text
Title
Date
```

Date options:

```text
Today
Tomorrow
Pick Date
```

When completed:

```text
completed = true
completedAt = current timestamp
```

Completing a task updates:

- Today's list
- Home activity
- Home calendar
- History

---

# PHASE 7 — Routine System

## Goal

Build routines as separate entities from tasks.

### Implement

- [ ] Create Routine
- [ ] Start Date
- [ ] Goal Date
- [ ] Automatic daily occurrences
- [ ] Routine calendar
- [ ] Complete routine
- [ ] Current Streak
- [ ] Best Streak
- [ ] Completed Days
- [ ] Missed Days
- [ ] Consistency %
- [ ] Days Remaining
- [ ] Progress
- [ ] Edit
- [ ] Reset
- [ ] Pause
- [ ] Resume
- [ ] Delete

### Critical Rule

A routine is NOT converted into a normal task.

Instead:

```text
Routine
   ↓
Daily Routine Occurrence
   ↓
Today's Tasks
```

The user sees the routine in Today's Tasks, but internally it remains a routine occurrence.

---

# PHASE 8 — Unified Today's Activity

Today's Tasks contains:

```text
Normal Tasks
+
Today's Routine Occurrences
```

Example:

```text
Today's Tasks

☐ Complete Java Practice
☐ Read 20 Pages
✓ Workout
☐ Daily Coding
☐ Read Every Day
```

Routine entries must have a clear Routine label or icon.

Completing a normal task updates overall activity.

Completing a routine occurrence updates:

- Routine statistics
- Overall activity
- History

---

# PHASE 9 — Overall Activity & Streak Engine

## Required Activities

```text
Required Activities
=
Scheduled Normal Tasks
+
Required Routine Occurrences
```

## Completed Activities

```text
Completed Activities
=
Completed Normal Tasks
+
Completed Routine Occurrences
```

## Completion Rate

```text
Completion Rate
=
Completed Activities / Required Activities
```

### Zero Activity Day

If:

```text
Required Activities = 0
```

the day is:

```text
Neutral / No Scheduled Activity
```

It is NOT a failure.

### Successful Routine-Only Day

If:

```text
Normal Tasks = 0
Routines = 3
Completed Routines = 3
```

then:

```text
Completion Rate = 100%
```

The day receives the strongest green.

### Home Calendar Intensity

The Home calendar's green intensity is based on completion percentage, NOT raw task count.

```text
100% → strongest green
75–99% → strong green
50–74% → medium green
25–49% → low-medium green
1–24% → light green
0% → empty/missed state
```

### Overall Streak

The Home streak answers:

> How many consecutive days have I shown up?

A day is active when at least one required activity has been completed.

Example:

```text
Aug 1 → completed activity
Aug 2 → completed activity
Aug 3 → completed activity
Aug 4 → no completed activity
Aug 5 → completed activity
```

Current streak on Aug 5:

```text
1 day
```

Overall streak and calendar intensity are separate calculations.

---

# PHASE 10 — Routine Streak Engine

Every routine tracks:

```text
Current Streak
Best Streak
Completed Days
Missed Days
Consistency
```

### Current Streak

Consecutive completed routine occurrences.

### Best Streak

Longest consecutive routine completion streak ever achieved.

### Completed Days

Total completed routine occurrences.

### Missed Days

Required routine days that were not completed.

Future routine days are NOT missed.

### Consistency

```text
Completed Days
------------------------------ × 100
Completed Days + Missed Days
```

Missing a routine day breaks its Current Streak but does not erase:

- Completed Days
- Best Streak
- History

---

# PHASE 11 — Home Dashboard

Build the actual Home experience using the completed business logic.

### Header

Include:

- Greeting
- Current date
- Profile avatar
- Reminder indicator if applicable

### Calendar Tabs

```text
Yearly | Monthly | Weekly
```

Default:

```text
Monthly
```

### Home Calendar

Use GitHub-style contribution visualization.

The calendar must use real calendar dates.

No artificial activity cells.

### Home Metrics

Below the calendar:

```text
🔥 Ongoing Streak
⏱ Time Remaining Today
```

Both should be visually prominent.

### Time Remaining

Calculate time remaining until midnight in the user's local timezone.

### Today's Tasks

Display:

```text
Normal Tasks
+
Today's Routine Occurrences
```

---

# PHASE 12 — Routines UI

## Goal

Build the complete Routines experience.

Each routine card contains:

```text
Title
Goal Date
Current Month Calendar
Current Streak
Days Remaining
```

Example:

```text
Daily Coding

August 2026

▣ ▣ ▣ ▣ ▢ ▣ ▣
▣ ▣ ▣ ▢ ▣ ▣ ▣

🔥 12 Days
Goal: 31 Aug 2026
20 Days Remaining
```

Routine calendars use status rather than activity intensity.

States:

```text
Completed
Missed
Today
Future
Before Start
```

---

# PHASE 13 — History & Future Date Browser

There is NO separate Upcoming screen.

History is the unified date browser.

### History Tabs

```text
Yearly | Monthly | Weekly
```

Default:

```text
Monthly
```

### Past Date

Show:

- Completed tasks
- Missed/pending tasks
- Routine activity
- Completion timestamps

### Today

Show:

- Completed tasks
- Pending tasks
- Today's routine occurrences
- Completion timestamps

### Future Date

Show:

- Scheduled tasks
- Future routine occurrences
- Add Task button

Example:

```text
12 August 2026

Scheduled Tasks

☐ Submit Assignment
☐ Buy Groceries

Scheduled Routines

🔄 Daily Coding
🔄 Read Every Day

+ Add Task
```

When Add Task is clicked, the selected date is automatically used.

---

# PHASE 14 — Calendar Engine & Date Validation

This phase is critical.

### Monthly

Use actual days:

```text
January = 31
February 2026 = 28
February 2024 = 29
April = 30
August = 31
```

Never hard-code calendar cell counts.

### Weekly

Exactly 7 dates.

### Yearly

Use only actual dates from the selected year.

### Future Dates

Future dates must never be:

```text
Missed
Failed
Zero completion
Broken streak
```

They are:

```text
Future / Planned
```

---

# PHASE 15 — Daily Time Commitments

## Goal

Allow the user to define normal time commitments.

Access:

```text
Settings → Daily Time
```

Do NOT use start/end time as the primary model.

Use:

```text
Duration + Days
```

Example:

```text
Sleep
8 hours
Every day

Work
8 hours
Monday-Friday

Gym
1 hour
Monday-Wednesday-Friday
```

### Fields

```text
Name
Duration
Days
Type
```

Duration supports hours and minutes.

Days support:

```text
Every Day
Weekdays
Weekends
Custom
```

Type:

```text
Fixed
Flexible
```

Fixed examples:

- Sleep
- Work
- College
- Regular Travel

Flexible examples:

- Gym
- Family Time
- Personal Time
- Meals

---

# PHASE 16 — Available Time Engine

Calculate estimated available time.

Example:

```text
24 hours

- Sleep 8h
- Work 8h
- Travel 1h
- Gym 1h

= 6h available
```

Only commitments applicable to the selected day are included.

Daily Time Commitments must NEVER affect:

- Overall streak
- Routine streak
- Completed Days
- Missed Days
- Calendar intensity
- Task completion percentage

They are context only.

---

# PHASE 17 — Settings

Build:

```text
Settings

Profile
Appearance
Daily Time
Categories
Reminders
Backup & Sync
About
Logout
```

### Profile

Implement:

- Name
- Email
- Avatar
- Edit Profile
- Sign Out

### Appearance

Implement:

```text
Light
Dark
```

### Categories

Allow:

- Create
- Rename
- Delete
- Assign to Tasks

GitHub green remains the primary application color.

### Reminders

Implement:

- Enable/disable
- Default reminder time
- Task reminder preferences

---

# PHASE 18 — PWA

Make the application installable.

Implement:

- Web manifest
- App icons
- Standalone display
- Service worker
- Offline caching
- Install support

Configure:

```text
vite-plugin-pwa
```

Test desktop and mobile installation.

---

# PHASE 19 — Offline & Sync

Implement:

- Firestore offline persistence
- Local cache
- Optimistic updates
- Sync when connection returns

The UI should not feel blocked while waiting for Firebase.

---

# PHASE 20 — Verification & Edge Cases

Test:

### Tasks

- Create
- Edit
- Delete
- Complete
- Timestamp
- Future dates
- Categories
- Priority

### Routines

- Create
- Start date
- Goal date
- Automatic occurrences
- Complete
- Miss
- Pause
- Resume
- Reset
- Delete
- Goal date changes

### Overall Calendar

- 0 required
- 1 required
- Multiple required
- 100% completion
- Partial completion
- 0% completion
- Routine-only day
- Task-only day
- Mixed day

### Overall Streak

- Consecutive active days
- Missed day
- Restart after missed day
- Multiple tasks on same day
- Multiple routines on same day

### Routine Streak

- Continuous completion
- Missed day
- Best streak
- Current streak
- Completed days
- Missed days
- Future days
- Paused days

### Calendar

- 28-day February
- 29-day February
- 30-day month
- 31-day month
- Month boundaries
- Year boundaries
- Leap years
- Week boundaries

### Future Dates

Verify:

```text
Future date ≠ missed
Future routine ≠ missed
Future task can be added
Routine appears automatically
```

### Daily Time

Test:

- Every day
- Weekdays
- Weekends
- Custom days
- Fixed
- Flexible
- Hours
- Minutes

Verify that Daily Time never affects streak calculations.

---

# PHASE 21 — Final UI Polish

Only after functionality works.

Implement:

- [ ] Empty states
- [ ] Loading states
- [ ] Error states
- [ ] Confirmation dialogs
- [ ] Smooth transitions
- [ ] Hover states
- [ ] Mobile responsiveness
- [ ] Touch-friendly controls
- [ ] Keyboard accessibility
- [ ] Calendar interaction polish
- [ ] Dark mode polish
- [ ] GitHub-style visual consistency

Do NOT introduce unnecessary features during this phase.

---

# FINAL IMPLEMENTATION RULES

## Rule 1

Home overall activity includes:

```text
Completed Tasks
+
Completed Routine Occurrences
```

## Rule 2

Today's Tasks is:

```text
Normal Tasks
+
Today's Routine Occurrences
```

## Rule 3

Routines remain separate entities internally.

## Rule 4

Central bottom `+` creates Tasks only.

## Rule 5

Routines are created only from:

```text
Routines → +
```

## Rule 6

Home calendar intensity is:

```text
Completed Activities / Required Activities
```

NOT raw task count.

## Rule 7

A day with zero scheduled activity is neutral.

## Rule 8

Completing all routines on a day with zero normal tasks can produce:

```text
100% completion
```

and the strongest green.

## Rule 9

Overall streak and calendar intensity are separate calculations.

## Rule 10

Routine streak and overall streak are separate calculations.

## Rule 11

Missing a routine day breaks Current Streak but does not erase:

```text
Completed Days
Best Streak
History
```

## Rule 12

Future dates cannot be marked missed.

## Rule 13

Future tasks and routines are accessed through History.

## Rule 14

There is no separate Upcoming screen.

## Rule 15

Daily Time Commitments do not contribute to activity, streak, or calendar calculations.

## Rule 16

Calendar cells must represent actual calendar dates.

Never create fake activity cells.

## Rule 17

Use GitHub-inspired green as the primary visual language.

## Rule 18

Light and Dark modes must maintain the same design system.

---

# DEVELOPMENT WORKFLOW

For every phase:

```text
Implement
↓
Run
↓
Test
↓
Fix
↓
Verify
↓
Move to next phase
```

Do NOT implement multiple major phases simultaneously.

After completing each phase, verify existing functionality before proceeding.

The application must remain runnable after every phase.

---

# FINAL PRODUCT FLOW

```text
                 HOME
                   │
       ┌───────────┼───────────┐
       │           │           │
    Tasks       Routines     Calendar
       │           │           │
       └───────────┼───────────┘
                   ↓
            Daily Activity
                   ↓
          Overall Streak
                   ↓
          GitHub Calendar


Routines
   ↓
Daily Occurrences
   ↓
Today's Tasks


History
   ↓
Past / Today / Future


Settings
   ↓
Daily Time
   ↓
Available Time
```

Core product philosophy:

> **Plan → Do → Complete → Track → Improve**
