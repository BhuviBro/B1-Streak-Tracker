# Task & Routine Streak Tracker — Complete Product & UI Instructions

## 1. Product Overview

Build a clean productivity and consistency-tracking application combining:

- Daily Tasks
- Long-term Routines
- GitHub-style overall activity calendar
- Streak tracking
- Historical activity
- Future task planning
- Profile and Settings
- Categories
- Reminders
- Light and Dark themes

The application should feel like a **personal consistency tracker**, not a complicated project-management application.

Core experience:

> **See → Do → Complete → Build Consistency → Review**

The primary visual language must be inspired by the **GitHub contribution calendar**, using GitHub-style green intensity.

---

# 2. Core Concept

There are two types of daily activities:

### Tasks

One-time or individually scheduled activities.

Examples:

- Complete Java practice
- Submit assignment
- Buy groceries
- Finish documentation

### Routines

Long-term recurring commitments.

Examples:

- Daily Coding
- Read Every Day
- Workout Daily

A routine automatically creates a **daily routine occurrence** on every applicable day between its Start Date and Goal Date.

Therefore, the user does NOT manually create a separate task for every routine day.

---

# 3. Unified Today's Activity

The Home Screen's **Today's Tasks** section is actually a unified daily action list containing:

> **Normal Tasks + Today's Routine Occurrences**

Example:

```text
Today's Tasks

☐ Complete Java Practice       Study
☐ Read 20 Pages               Study
✓ Workout                     Health
☐ Daily Coding                Routine
☐ Read Every Day              Routine
```

The routine is still stored internally as a Routine, not converted into a normal Task.

When the user completes a routine from this list:

1. Mark today's routine occurrence as completed.
2. Record completion timestamp.
3. Update the routine's own calendar.
4. Update the routine's streak/statistics.
5. Update the Home overall activity calendar.
6. Preserve the record in History.

---

# 4. Global Navigation

Use exactly five bottom-navigation items:

```text
Home | Routines | + | History | Settings
```

### Home

Overall activity, streak, today's tasks and today's routines.

### Routines

Routine management and routine-specific progress.

### +

**Add Task only.**

The central `+` must NOT create routines.

### History

Calendar-based past and future date browsing.

### Settings

Profile, appearance, categories, reminders and other settings.

---

# 5. Home Screen

The Home Screen is the main dashboard.

It should answer:

1. How consistent have I been?
2. What is my current overall streak?
3. How much time remains today?
4. What do I need to complete today?

Recommended order:

```text
Header
↓
Yearly | Monthly | Weekly
↓
Overall GitHub-style Activity Calendar
↓
Ongoing Streak | Time Remaining Today
↓
Today's Tasks
↓
Add Task
↓
Bottom Navigation
```

---

# 6. Home Header

Example:

```text
Good morning, Alex 👋
11 August 2026
```

Optionally include:

- Profile/avatar
- Notification/reminder icon

---

# 7. Overall GitHub-Style Calendar

The Home calendar represents the user's **overall daily activity**.

It includes activity from:

> **Completed Tasks + Completed Routine Occurrences**

However, the green intensity must NOT simply represent the raw number of tasks completed.

Instead, it represents the **percentage of scheduled/required activity completed that day**.

---

# 8. Calendar Completion Intensity

For each day:

```text
Required Activities
=
Tasks scheduled for that day
+
Active routine occurrences for that day
```

Then:

```text
Completion Rate
=
Completed Activities / Required Activities
```

The calendar green intensity is based primarily on this completion rate.

Suggested levels:

```text
0%          → No/empty activity
1–24%       → Light green
25–49%      → Low-medium green
50–74%      → Medium green
75–99%      → Strong green
100%        → Brightest/strongest green
```

The exact thresholds can be adjusted during implementation, but the principle must remain:

> **Green intensity represents how completely the user handled what was scheduled for that day, not how many tasks happened to exist.**

---

# 9. Important Calendar Edge Cases

## No Scheduled Activity

If:

```text
Required Activities = 0
Completed Activities = 0
```

the day should NOT be treated as a failure.

It should appear as:

> **Neutral / No scheduled activity**

Do not make it look like a missed day.

Example:

```text
Day A:
0 tasks
0 routines
0 required
```

This is a neutral day.

---

## Successful Routine-Only Day

Example:

```text
Normal Tasks: 0
Active Routines: 3
Completed Routines: 3
```

Completion rate:

```text
3 / 3 = 100%
```

This must receive the strongest green.

It must NOT appear weaker simply because there were fewer activities.

---

## Mixed Day

Example:

```text
Tasks scheduled: 4
Routines scheduled: 2

Total required: 6
Completed: 6

Completion: 100%
```

Strongest green.

---

## Partial Day

Example:

```text
Tasks scheduled: 10
Routines scheduled: 2

Total required: 12
Completed: 8

Completion: 66.7%
```

Medium/strong green.

---

# 10. Calendar Tabs

Above the Home calendar:

```text
Yearly | Monthly | Weekly
```

Default:

**Monthly**

---

## 10.1 Monthly

Display the selected month's actual dates.

Example:

```text
August 2026
```

August 2026 has exactly:

**31 calendar dates**

Do not render fake extra activity cells.

---

## 10.2 Weekly

Display exactly seven dates for the selected week.

```text
Mon Tue Wed Thu Fri Sat Sun
 10  11  12  13  14  15  16
```

---

## 10.3 Yearly

Display the year's contribution activity in a GitHub-style layout.

The date data must come from the actual calendar.

---

# 11. Critical Calendar Rendering Rule

**Never hard-code a fixed number of calendar cells.**

All calendar cells must be generated from actual dates.

Examples:

```text
January = 31
February 2026 = 28
February 2024 = 29
April = 30
August = 31
```

Blank positioning space may exist to align dates with weekdays, but blank space is NOT a date and must not be treated as activity.

This rule applies to:

- Home Monthly calendar
- Home Weekly calendar
- Home Yearly calendar
- Routine calendars
- History calendar

---

# 12. Overall Streak

The Home **Ongoing Streak** measures consecutive successful/active days.

A day qualifies as active when the user completes at least one scheduled/required activity.

Example:

```text
Aug 7 → activity completed
Aug 8 → activity completed
Aug 9 → activity completed
Aug 10 → no activity completed
Aug 11 → activity completed
```

Current streak on Aug 11:

```text
1 Day
```

The previous streak is not erased from historical records.

---

# 13. Overall Streak vs Calendar Intensity

These are separate concepts.

### Streak

Answers:

> "How many consecutive days have I shown up?"

### Green intensity

Answers:

> "How completely did I handle what was scheduled that day?"

Example:

```text
Day 1:
100% completion → strong green

Day 2:
100% completion → strong green

Day 3:
50% completion → medium green

Day 4:
0% completion → empty/missed

Day 5:
100% completion → strong green
```

The streak and color intensity must not be treated as the same metric.

---

# 14. Home Metrics

Below the calendar:

```text
🔥 Ongoing Streak        ⏱ Time Remaining Today

12 Days                  4h 32m
```

Both values should be bold and visually prominent.

### Ongoing Streak

Current overall consecutive active-day streak.

### Time Remaining Today

Dynamically calculate the time remaining until the end of the user's local day.

---

# 15. Today's Tasks

Below the streak metrics:

```text
Today's Tasks

☐ Complete Java Practice       Study
☐ Read 20 Pages                Study
✓ Workout                      Health
☐ Daily Coding                Routine
☐ Read Every Day              Routine
```

Normal tasks and today's routine occurrences appear together.

The UI should visually distinguish routines from normal tasks using a subtle Routine label/icon.

---

# 16. Completing a Task

When a normal task is checked:

1. Mark it completed.
2. Store exact completion timestamp.
3. Store completion date.
4. Update Home activity.
5. Update calendar intensity.
6. Preserve the record in History.

Example:

```text
✓ Complete Java Practice
  Completed at 8:42 PM
```

The timestamp must be generated automatically.

---

# 17. Completing a Routine Occurrence

When a routine is checked from Today's Tasks:

1. Mark today's occurrence completed.
2. Store exact completion timestamp.
3. Update routine calendar.
4. Increase routine Completed Days.
5. Update routine Current Streak.
6. Update routine Best Streak if necessary.
7. Update routine progress.
8. Update Home activity calendar.
9. Preserve the completion in History.

---

# 18. Add Task

The central bottom `+` opens **Add Task**.

Only tasks can be created here.

Required:

### Task Title

Example:

```text
Finish React project
```

### Date

Options:

```text
Today
Tomorrow
Pick a date
```

Default:

**Today**

---

# 19. Additional Task Fields

Include:

### Priority

- Low
- Medium
- High

### Category

Example:

- Study
- Work
- Health
- Fitness
- Personal
- Coding

Categories should be configurable from Settings.

### Reminder

Allow the user to choose a reminder time.

### Notes

Optional notes field.

Example:

```text
Finish authentication module before dinner.
```

---

# 20. Future Tasks

A separate Upcoming screen is NOT required.

Use the existing **History calendar** to access future dates.

The user can:

1. Open History.
2. Navigate to a future date.
3. Click the date.
4. View all tasks scheduled for that future date.
5. View routine occurrences scheduled for that date.
6. Add a new task directly for that selected date.

This avoids unnecessary navigation.

---

# 21. History Calendar Behavior

History is not limited to the past.

It works as a **date browser**.

### Past date

Show historical activity.

### Today

Show current activity.

### Future date

Show planned/scheduled activity.

Example:

```text
August 12, 2026

Scheduled Tasks

☐ Submit Assignment
☐ Buy Groceries

Scheduled Routines

🔄 Daily Coding
🔄 Read Every Day

+ Add Task
```

When `+ Add Task` is clicked from a future date, the task date should automatically default to that selected date.

---

# 22. History Screen

Top tabs:

```text
Yearly | Monthly | Weekly
```

Default:

**Monthly**

Display a real date-based calendar.

Clicking a date opens its day details.

---

# 23. Day Details

## Past Date

Example:

```text
10 August 2026

Completed Tasks
✓ Complete Java Practice       8:42 PM
✓ Workout                      7:15 PM

Missed/Pending
☐ Read Documentation

Routine Activity
✓ Daily Coding                10:21 PM
✗ Read Every Day
```

## Today

Show:

- Completed tasks
- Pending tasks
- Today's routine occurrences
- Completion times

## Future Date

Show:

- Scheduled tasks
- Scheduled routine occurrences
- Add Task

---

# 24. Routines Screen

Routines are managed separately from normal tasks.

The Home central `+` does NOT create routines.

The Routines screen has its own `+` button.

Recommended layout:

```text
Routines                         +

Routine Card

Current-month calendar
Streak
Title
Goal
Days Remaining

Routine Card

Current-month calendar
Streak
Title
Goal
Days Remaining
```

---

# 25. Routine Card

Example:

```text
┌──────────────────────────────────────┐
│ Daily Coding                         │
│ Goal: 31 Aug 2026                    │
│                                      │
│ August 2026                          │
│ Mon Tue Wed Thu Fri Sat Sun          │
│  3   4   5   6   7   8   9           │
│ 10  11  12  13  14  15  16          │
│ ...                                  │
│                                      │
│ 🔥 12 Days                            │
│ Goal: 31 Aug 2026                    │
│ 20 Days Remaining                    │
└──────────────────────────────────────┘
```

The calendar must represent actual dates only.

---

# 26. Routine Calendar

Routine calendars use a different meaning from the Home calendar.

For an individual routine, a date is:

- Completed
- Missed
- Today
- Future
- Before Start Date / Not Applicable

A routine calendar should NOT use task-count intensity.

A routine can only be completed or not completed for a particular day.

---

# 27. Add Routine

Available only through:

```text
Routines → +
```

Fields:

### Title

Example:

```text
Read Every Day
```

### Start Date

Default:

**Today**

### Goal Date

User selects the target date.

Example:

```text
Start Date: 11 Aug 2026
Goal Date: 10 Sep 2026
```

Button:

**Create Routine**

---

# 28. Routine Details

Example:

```text
Daily Coding                         ✎
```

Display:

### Start Date

```text
01 Aug 2026
```

### Goal Date

```text
31 Aug 2026
```

### Current Streak

```text
12 Days
```

### Best Streak

```text
15 Days
```

### Completed Days

```text
18 Days
```

### Missed Days

```text
3 Days
```

### Days Remaining

```text
20 Days
```

### Consistency

```text
85.7%
```

### Progress

```text
18 / 31 Days

████████████░░░░░░░
```

---

# 29. Routine Statistics Rules

Track these independently.

## Current Streak

Consecutive completed routine days ending at the latest active streak.

## Best Streak

Longest completed consecutive routine streak ever achieved.

## Completed Days

Total required routine days completed.

## Missed Days

Total required routine days not completed.

## Consistency

```text
Completed Days
------------------------------- × 100
Completed Days + Missed Days
```

---

# 30. Routine Missed-Day Behavior

Missing one routine day breaks the **Current Streak**.

However, it must NOT erase:

- Completed Days
- Best Streak
- Historical calendar
- Previous streaks

Example:

```text
Aug 1  ✅
Aug 2  ✅
Aug 3  ✅
Aug 4  ❌
Aug 5  ✅
Aug 6  ✅
Aug 7  ✅
```

Result:

```text
Current Streak: 3
Best Streak: 3
Completed Days: 6
Missed Days: 1
```

If a previous best was 12:

```text
Current Streak: 3
Best Streak: 12
```

---

# 31. Routine Goal Date

Changing the goal date must NOT delete historical completion records.

Example:

```text
Old Goal: 31 Aug 2026
New Goal: 15 Sep 2026
```

Only the active goal period changes.

---

# 32. Routine Reset

Reset requires confirmation.

Example:

> Reset this routine?
>
> Your previous progress will remain in History, but the active routine will start again.

Historical data must remain accessible.

---

# 33. Routine Pause

When paused:

- Future days are not counted as missed.
- No future routine occurrence is required.
- Previous progress remains.
- The routine can later be resumed.

---

# 34. Routine Delete

Deleting a routine requires confirmation.

Recommended behavior:

- Remove it from active routines.
- Preserve historical records where possible.
- Clearly distinguish Delete from Reset.

---

# 35. Settings

Settings should include:

```text
Profile
Appearance
Categories
Reminders
Backup & Sync
About
Logout
```

---

# 36. Profile

Include:

- Profile image/avatar
- Name
- Email
- Edit Profile

Example:

```text
Alex Johnson
alex.johnson@email.com
```

---

# 37. Appearance

Provide:

```text
Appearance

☀ Light
◐ Dark
```

The selected theme should apply throughout the application.

---

# 38. Daily Time Commitments

The application should allow the user to define how much time they normally spend on fixed or recurring life commitments.

This feature is available under:

**Settings → Daily Time**

The purpose is to understand the user's realistic daily availability.

It is NOT a task system and it must NOT contribute to:

- Streaks
- Completed Days
- Missed Days
- GitHub calendar activity
- Task completion percentage

Examples:

- Sleep
- Work
- College
- Travel
- Gym
- Family / Personal time
- Other recurring commitments

---

## 38.1 Time Commitment Concept

Instead of requiring exact start and end times, the user enters a **duration** and the days on which that duration normally applies.

Example:

😴 Sleep  
8 hours  
Every day

💼 Work  
8 hours  
Monday – Friday

🏋️ Gym  
1 hour  
Monday, Wednesday, Friday

This is intended to answer:

> "How much of my day is realistically available?"

---

## 38.2 Daily Time Screen

Settings should contain:

Daily Time

Your usual daily commitments

😴 Sleep  
8 hours  
Every day

💼 Work  
8 hours  
Mon Tue Wed Thu Fri

🏋️ Gym  
1 hour  
Mon Wed Fri

🚗 Travel  
1 hour  
Mon Tue Wed Thu Fri

+ Add Time Commitment

Each commitment should have an edit/delete menu.

---

## 38.3 Add Time Commitment

The Add Time Commitment screen should contain:

### Name

Example:

Work

### Duration

Example:

8 hours

The duration should support hours and minutes.

Examples:

- 8 hours
- 1 hour 30 minutes
- 45 minutes

### Days

Allow the user to choose the days on which the commitment normally applies.

Example:

☑ Monday  
☑ Tuesday  
☑ Wednesday  
☑ Thursday  
☑ Friday  
☐ Saturday  
☐ Sunday

Also provide convenient options:

- Every Day
- Weekdays
- Weekends
- Custom

### Type

Provide two types:

**Fixed**

For commitments that generally cannot be moved.

Examples:

- Sleep
- Work
- College
- Regular travel

**Flexible**

For commitments that consume time but can potentially be moved.

Examples:

- Gym
- Family time
- Personal time
- Meals

---

## 38.4 Example Configuration

A user may configure:

😴 Sleep  
8 hours  
Every day  
Type: Fixed

💼 Work  
8 hours  
Monday – Friday  
Type: Fixed

🏋️ Gym  
1 hour  
Monday, Wednesday, Friday  
Type: Flexible

🚗 Travel  
1 hour  
Monday – Friday  
Type: Fixed

---

## 38.5 Available Time Calculation

The application may calculate an estimated amount of available time for each day.

Example weekday:

Total day:  
24 hours

Sleep:  
8 hours

Work:  
8 hours

Travel:  
1 hour

Gym:  
1 hour

Estimated available time:  
6 hours

The calculation should consider only commitments that apply to that particular day.

Example:

Monday:

Sleep: 8h  
Work: 8h  
Travel: 1h  
Gym: 1h

Available:  
6h

Saturday:

Sleep: 8h  
Work: 0h  
Travel: 0h  
Gym: 1h

Available:  
15h

---

## 38.6 Important Rule

Daily Time Commitments are **context, not achievements**.

For example:

Sleep: 8 hours  
Work: 8 hours

does NOT mean:

Completed Activities: +2

It must NOT increase the user's:

- Overall streak
- Routine streak
- Completed Days
- GitHub calendar intensity
- Task completion percentage

Only actual Tasks and Routine occurrences count toward those systems.

---

## 38.7 Relationship With Tasks and Routines

Daily Time Commitments should eventually help the application understand the user's available capacity.

Example:

Available Time Today: 5h 30m

Planned Tasks: 2h 30m

Routine Time: 1h

Remaining Estimated Capacity:  
2h

This information can later be used for smarter scheduling and recommendations.

However, the first version does NOT need automatic task scheduling.

The feature should initially focus on:

1. Storing the user's normal time commitments.
2. Calculating estimated daily available time.
3. Showing the information clearly.
4. Keeping it completely separate from task/routine completion.

---

## 38.8 No Exact Start/End Time Required

The Daily Time system should NOT require:

Start: 09:00 AM  
End: 05:00 PM

The primary input is:

Duration + Days

Example:

Work  
8 hours  
Mon Tue Wed Thu Fri

This keeps setup simple and focuses on the user's overall time capacity.

Exact time scheduling can be introduced as a separate future feature if required.

---

## 38.9 Daily Time and Future Tasks

When viewing a future date through History, the application can eventually show:

12 August 2026

Available Time:  
6 hours

Scheduled Tasks:  
2 hours 30 minutes

Routine Time:  
1 hour

Estimated Remaining:  
2 hours 30 minutes

This is optional for the first implementation but the data model should be designed so it can support this later.

---

## 38.10 Daily Time and Streak Calendar

Daily Time Commitments must NOT change the meaning of the GitHub-style calendar.

The Home calendar continues to use:

Required Activities  
=  
Normal Tasks  
+  
Required Routine Occurrences

Daily Time Commitments are excluded.

Therefore:

Sleep 8h  
Work 8h  
Gym 1h

does not create calendar activity.

Only:

Completed Tasks  
+  
Completed Routine Occurrences

affect the Home activity calendar.

---

## 38.11 Recommended Settings Structure

The Settings screen should now contain:

Settings

Profile
────────────
Appearance
Notifications

Productivity
────────────
Daily Time
Categories
Reminders

Data
────────────
Backup & Sync

Other
────────────
About
Logout

The Daily Time feature should therefore be accessible from:

**Settings → Daily Time**
# 39. Categories

Allow users to:

- Create category
- Rename category
- Delete category
- Assign category to tasks

Example:

```text
Study
Work
Health
Fitness
Personal
Coding
```

Category colors must remain subtle and must not replace the GitHub-green primary visual system.

---

# 40. Reminders

Settings should include:

- Enable/disable reminders
- Default reminder time
- Task reminder preferences

Example:

```text
Default reminder:
07:00 PM
```

---

# 41. GitHub-Style Color System

The primary visual language should use GitHub-inspired greens.

Suggested conceptual scale:

```text
No activity       → Neutral / empty
Very low          → Light green
Low               → Green
Medium            → Darker green
High              → Strong GitHub green
Complete          → Brightest green
```

For the Home calendar, intensity is based on **completion percentage**, not raw task count.

For Routine calendars, use status-based cells.

Use red only where needed for:

- Missed
- Delete
- Destructive confirmation

---

# 42. Theme Rules

## Light Mode

- White/light background
- Dark text
- GitHub green accents
- Light gray borders
- GitHub green calendar cells

## Dark Mode

- GitHub-like dark background
- Light text
- Dark gray cards
- GitHub green accents
- Dark neutral empty cells

Avoid introducing unrelated primary colors.

---

# 43. Data Model

## Task

Every task should contain:

- Task ID
- Title
- Scheduled Date
- Created At
- Completed
- Completed At
- Priority
- Category
- Reminder
- Notes

---

## Routine

Every routine should contain:

- Routine ID
- Title
- Start Date
- Goal Date
- Status
- Created At
- Updated At

---

## Routine Occurrence / Completion

Each applicable routine day should be represented logically as an occurrence.

Store:

- Routine ID
- Date
- Required
- Completed
- Completed At

This allows the application to correctly calculate:

- Completed Days
- Missed Days
- Current Streak
- Best Streak
- Future occurrences
- History

## Firestore Document Mapping

All user state is stored in a single document under the user's dedicated collection path:

```text
users/{uid}/data/main
```

Main Schema Structure:

```json
{
  "tasks": [...],
  "routines": [...],
  "occurrences": [...],
  "timeCommitments": [...],
  "categories": [...],
  "settings": { ... }
}
```

---

# 44. Firebase Authentication & Google Sign-In

The application uses Firebase Authentication with Google Auth to manage user accounts and session persistence.

## 44.1 Setup Mode & Configuration (`.env`)

The application uses **Standard Developer Setup**, providing zero-configuration Google login for end-users. 

Store project credentials in `.env` using the Vite environment variable prefix (`VITE_`):

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

*(Note: The architecture remains extensible so a dynamic in-app Firebase setup modal can be added in a future update if required).*

## 44.2 Authentication Flow (`useAuth` Hook)

1. Use `onAuthStateChanged(auth, user => ...)` to monitor session state automatically.
2. Trigger Google Sign-In via `signInWithPopup(auth, provider)`.
3. Provide `signOut(auth)` to log out the user from Settings/Profile.
4. Expose `user`, `loading`, and `error` states to the component tree.

---

# 45. Cloud Firestore Real-Time Sync & Offline Infrastructure

Data synchronization connects the local application state with Cloud Firestore while maintaining robust offline operation.

## 45.1 Real-Time Sync (`onSnapshot`)

- Attach an `onSnapshot` listener to `users/{uid}/data/main`.
- Remote updates on any connected device automatically update local state in real time.

## 45.2 Offline Persistence (IndexedDB)

- Enable IndexedDB offline persistence via `enableIndexedDbPersistence(db)`.
- Handles edge cases gracefully:
  - `failed-precondition`: Warns if multiple browser tabs are open.
  - `unimplemented`: Warns if browser lacks IndexedDB persistence support.

## 45.3 Local Storage Cache (`localStorage`)

- Maintain a secondary local cache under `localStorage` (`app-cache`).
- Serves state instantly during app startup before network connection or if Firestore snapshot fails offline.

## 45.4 Optimistic State Updates (`update` Helper)

1. Mutate UI state immediately in React memory.
2. Save updated payload to `localStorage`.
3. Dispatch `setDoc` asynchronously to Cloud Firestore.

---

# 46. Progressive Web App (PWA) & Mobile Installation

The web application is fully installable on iOS, Android, and Desktop as a standalone PWA.

## 46.1 Web App Manifest (`public/manifest.webmanifest`)

Configured for standalone native feel:

- `display`: `standalone`
- `orientation`: `portrait`
- `theme_color` & `background_color`: `#0a0a0f`
- Icons: `pwa-192.png` (192x192) and `pwa-512.png` (512x512 maskable).

## 46.2 HTML Meta Tags (`index.html`)

- Mobile viewport: `width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover`.
- iOS Safari compatibility: `mobile-web-app-capable`, `apple-mobile-web-app-capable`, `apple-mobile-web-app-status-bar-style` (`black-translucent`), and `apple-touch-icon`.

## 46.3 Service Worker & Caching (`vite-plugin-pwa`)

- Configured via `VitePWA` in `vite.config.js` with `registerType: 'autoUpdate'`.
- Auto-generates service worker for instant offline caching of HTML, JS, CSS, and static assets.

## 46.4 Cross-Platform Installation

- **iOS (Safari)**: Tap Share → *Add to Home Screen*. Runs in full-screen mode without browser URL bars.
- **Android (Chrome/Edge)**: Tap Menu (⋮) → *Install App* or *Add to Home Screen*.
- **Desktop (Chrome/Edge/Brave)**: Click *Install Icon* in address bar.

---

# 47. Daily Activity Calculation

For each date:

```text
Required Activities
=
Scheduled normal tasks
+
Required routine occurrences
```

Then:

```text
Completed Activities
=
Completed normal tasks
+
Completed routine occurrences
```

And:

```text
Completion Rate
=
Completed Activities / Required Activities
```

If Required Activities = 0:

```text
Completion Rate = N/A
```

The calendar should show a neutral state.

---

# 48. Overall Home Calendar Example

```text
Date        Required   Completed   Rate
-----------------------------------------
Aug 1           4          4       100%
Aug 2           2          2       100%
Aug 3           8          5        63%
Aug 4           0          0        N/A
Aug 5           3          1        33%
```

Visual result:

```text
Aug 1 → Strongest green
Aug 2 → Strongest green
Aug 3 → Medium green
Aug 4 → Neutral
Aug 5 → Light/medium green
```

---

# 49. Future Date Behavior

Future dates must NOT be counted as:

- Missed
- Failed
- Zero completion
- Broken streak

They are simply:

> **Future / Planned**

A future routine occurrence is not missed until its applicable day has passed without completion.

---

# 50. Overall Streak and Future Dates

Future scheduled activities do not affect the current overall streak.

Only completed/currently evaluated dates are considered.

---

# 51. Dummy Data for Mockups

Use:

## User

```text
Name: Alex Johnson
Email: alex.johnson@email.com
```

## Current Date

```text
11 August 2026
```

## Overall Streak

```text
Ongoing Streak: 12 Days
Time Remaining Today: 4h 32m
```

## Today's Tasks

```text
Complete Java Practice
Category: Study

Read 20 Pages
Category: Study

Workout
Category: Health
```

## Today's Routine Occurrences

```text
Daily Coding
Read Every Day
```

## Routine 1

```text
Title: Daily Coding
Start Date: 01 Aug 2026
Goal Date: 31 Aug 2026
Current Streak: 12 Days
Best Streak: 15 Days
Completed Days: 18
Missed Days: 3
Days Remaining: 20
```

## Routine 2

```text
Title: Read Every Day
Start Date: 01 Aug 2026
Goal Date: 10 Sep 2026
Current Streak: 5 Days
Best Streak: 10 Days
Completed Days: 15
Missed Days: 2
Days Remaining: 30
```

## Routine 3

```text
Title: Workout Daily
Start Date: 01 Aug 2026
Goal Date: 25 Aug 2026
Current Streak: 8 Days
Best Streak: 11 Days
Completed Days: 14
Missed Days: 2
Days Remaining: 14
```

---

# 52. Screen List

The application should contain at least:

1. Home / Dashboard
2. Add Task
3. Routines
4. Routine Details
5. Add Routine
6. History Calendar
7. Day Details
8. Settings
9. Profile
10. Appearance / Theme
11. Categories
12. Reminders
13. Edit Routine
14. Daily Time
15. Firebase Login / Account Sync

A separate Upcoming screen is NOT required.

Future tasks are accessed through the History calendar.

---

# 53. Final Home Layout

```text
┌─────────────────────────────────────┐
│ Good morning, Alex 👋               │
│ 11 August 2026                      │
│                                     │
│ Yearly | MONTHLY | Weekly           │
│                                     │
│ GitHub-style Overall Calendar       │
│                                     │
│ ░ ▓ ▓ ░ █ █ ▓ ░ ▓ ▓ ░              │
│ ▓ ▓ ░ ▓ █ ▓ ▓ ░ ▓ ▓ ▓              │
│ ▓ ░ ▓ ▓ ▓ ▓ ░ ▓ ▓ ░ ▓              │
│                                     │
│ ┌─────────────┬───────────────────┐ │
│ │ 🔥 12 Days  │ ⏱ 4h 32m          │ │
│ │ Ongoing     │ Remaining Today   │ │
│ └─────────────┴───────────────────┘ │
│                                     │
│ Today's Tasks                       │
│                                     │
│ ☐ Java Practice          Study      │
│ ☐ Read 20 Pages          Study      │
│ ✓ Workout                Health     │
│ ☐ Daily Coding           Routine    │
│                                     │
│             + Add Task              │
│                                     │
│ Home Routines + History Settings    │
└─────────────────────────────────────┘
```

---

# 54. Final Routines Layout

```text
┌─────────────────────────────────────┐
│ Routines                         +  │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ Daily Coding                    │ │
│ │ Goal: 31 Aug 2026               │ │
│ │                                 │ │
│ │ August 2026                     │ │
│ │ ▣ ▣ ▣ ▣ ▢ ▣ ▣                  │ │
│ │ ▣ ▣ ▣ ▢ ▣ ▣ ▣                  │ │
│ │ ▣ ▣ ▢ ▣ ▣ ▣ ▣                  │ │
│ │                                 │ │
│ │ 🔥 12 Days   20 Days Remaining  │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ Read Every Day                  │ │
│ │ Goal: 10 Sep 2026               │ │
│ │ ...                             │ │
│ └─────────────────────────────────┘ │
│                                     │
│ Home Routines + History Settings    │
└─────────────────────────────────────┘
```

---

# 55. Final History Concept

History is a **unified calendar navigator**, not only a past-history page.

```text
History

Yearly | Monthly | Weekly

August 2026

Mon Tue Wed Thu Fri Sat Sun
                 1   2
 3   4   5   6   7   8   9
10  11  12  13  14  15  16
17  18  19  20  21  22  23
24  25  26  27  28  29  30
31
```

Clicking:

### Past date

→ Activity history.

### Today

→ Current activity.

### Future date

→ Planned tasks + planned routines + Add Task.

This keeps navigation simple and avoids creating an unnecessary Upcoming section.

---

# 56. Final Product Rules

These rules are authoritative.

### Rule 1

**Home overall calendar includes both Tasks and Routines.**

### Rule 2

**Today's Tasks is a unified list containing normal tasks + today's routine occurrences.**

### Rule 3

**Routines are created only from the Routines screen.**

### Rule 4

**The central bottom `+` creates Tasks only.**

### Rule 5

**Home calendar green intensity represents completion percentage for that day's scheduled activities, not raw task quantity.**

### Rule 6

**A day with zero scheduled activity is neutral, not failed.**

### Rule 7

**A day where all routines are completed can be 100% successful even if there were no normal tasks.**

### Rule 8

**Overall streak measures consecutive active/successful days, independently from calendar intensity.**

### Rule 9

**Routine streaks are tracked separately from the overall Home streak.**

### Rule 10

**Missing a routine day breaks that routine's current streak but does not erase historical progress or Best Streak.**

### Rule 11

**Future dates are never marked missed until their applicable day has passed.**

### Rule 12

**Future tasks and future routine occurrences are accessed by clicking future dates in History.**

### Rule 13

**No calendar may contain fake activity cells. All cells must correspond to actual dates.**

### Rule 14

**GitHub green is the primary visual system.**

### Rule 15

**Light and Dark modes must both use the same GitHub-inspired design language.**

---

# 57. Product Philosophy

The app should motivate consistency without punishing the user for having a lighter schedule.

The calendar answers:

> **How well did I complete what I planned for that day?**

The streak answers:

> **How consistently have I shown up?**

The routine statistics answer:

> **How consistently am I maintaining this specific habit?**

History answers:

> **What did I do, what did I miss, and what have I planned for the future?**

The overall product should remain simple:

> **Plan → Do → Complete → Track → Improve**
