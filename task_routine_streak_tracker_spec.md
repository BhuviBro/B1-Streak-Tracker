# Task & Routine Streak Tracker — Product Specification

## 1. Home Screen

The Home Screen is the main dashboard and should immediately show the user's progress for the current day.

### Header

Display:

* Current Month Streak
* GitHub-style streak visualization
* Time remaining for today

Example:

**Current Streak: 12 Days**

`▣ ▣ ▣ ▣ ▣ ▣ ▣ ▣ ▣ ▣ ▣ ▣`

**Today**
`4h 32m remaining`

The streak should represent **consecutive days on which the user completed at least one required task/routine activity**, based on the app's streak rules.

---

## 2. Today's Tasks

Below the streak section:

### Today's Pending Tasks

Display all incomplete tasks for today.

Each task should contain:

* Checkbox
* Task title
* Optional task time/category

Example:

☐ Complete Java practice
☐ Read 20 pages
☐ Workout
☐ Finish project documentation

### Completing a Task

When the user checks a task:

1. Task changes to completed state.
2. Store the exact completion timestamp.
3. Record the date of completion.
4. Move it visually into the completed state.
5. Completed tasks should remain accessible from History.

Example:

`✓ Complete Java practice`
`Completed at 8:42 PM`

The timestamp should **not** be manually entered by the user.

---

# 3. Add Task

At the bottom of the Home Screen:

**＋ Add Task**

Clicking it opens the Add Task interface.

### Add Task

Required:

* Task Title
* Date

Date options:

* **Today** — default
* **Tomorrow**
* **Choose Date** — opens calendar

Optional future fields can include:

* Priority
* Category
* Reminder
* Notes

For the first version, keep the interface simple and only require:

**Task Title + Date**

---

# 4. Routines

The Home Screen should also contain a **Routines** button.

Clicking it opens the Routines screen.

## Routines Screen

Display all existing routines as cards.

Each routine card should show:

### Routine Name

Example:

**Daily Coding**

### Mini Monthly Streak Calendar

Use a GitHub-style contribution/streak calendar.

Example:

`▣ ▣ ▢ ▣ ▣ ▣ ▢`

The calendar should visually indicate:

* Completed day
* Missed day
* Today
* Future day

The user should be able to understand their consistency without opening the routine.

---

# 5. Routine Details

Clicking a routine opens its detail screen.

### Header

Display:

**Routine Title**

Example:

# Daily Coding

On the top-right:

**✎ Edit**

The edit button allows the user to modify routine settings.

---

## Routine Information

Display:

### Start Date

`01 Aug 2026`

### Goal Date

`31 Aug 2026`

### Active Streak

`12 Days`

### Days Remaining

`19 Days`

### Progress

Example:

`12 / 31 Days Completed`

Progress bar:

`████████░░░░`

---

# 6. Routine Rules

A routine represents a **long-term goal**, not an individual task.

Example:

Routine:

**Daily Coding**

Start Date:

`01 Aug 2026`

Goal Date:

`31 Aug 2026`

The user is expected to complete the routine every day between the Start Date and Goal Date.

When the user completes the routine for a day:

* Mark that day as completed.
* Record completion timestamp.
* Increase active streak.
* Update monthly calendar.
* Update progress.

If the user misses a required day:

* That day becomes a missed day.
* Active streak resets according to the streak rules.
* Total historical completed days remain unchanged.

Important distinction:

**Total completed days ≠ Active streak.**

Example:

`Total Completed: 20 days`

`Current Streak: 7 days`

---

# 7. Editing a Routine

The Edit button should allow:

* Change title
* Change goal date
* Reset goal
* Pause routine
* Delete routine

### Goal Date Change

If the user changes the goal date:

Example:

Old:

`31 Aug 2026`

New:

`15 Sep 2026`

The existing completion history should **not be deleted**.

Only the goal period changes.

### Reset Routine

Reset should be treated as a deliberate action.

Show confirmation:

> Reset this routine?
>
> Your previous progress will remain in History, but the active routine will start again.

Do not silently delete historical data.

---

# 8. Add Routine

At the bottom center of the Routines screen:

**＋ Add Routine**

Clicking it opens:

### Create Routine

**Title**

`________________`

**Goal Date**

`📅 Select Date`

The Start Date should automatically default to **Today**.

Example:

Title:
`Read Every Day`

Start Date:
`10 Aug 2026`

Goal Date:
`10 Sep 2026`

Button:

**Create Routine**

After creation, the routine appears on the Routines screen.

---

# 9. History

The History button opens a simple calendar.

## History Screen

Display:

### Monthly Calendar

Example:

`August 2026`

`Mon Tue Wed Thu Fri Sat Sun`

Each date should visually indicate activity.

Possible states:

* Completed tasks
* No activity
* Missed routine
* Today

The calendar should remain simple and clean.

---

# 10. Day History

When the user clicks a particular date:

Open:

# 10 August 2026

Display everything that happened on that date.

### Completed Tasks

✓ Complete Java practice
Completed: `8:42 PM`

✓ Workout
Completed: `7:15 PM`

### Pending / Missed Tasks

☐ Read documentation

### Routine Activity

✓ Daily Coding
Completed: `10:21 PM`

This gives the user a complete historical record of their activity.

---

# 11. Streak System

The streak system should be clearly defined.

### Daily Streak

A day counts toward the streak when the user completes the required activity for that day.

For normal tasks:

Completing at least one task can count as an active day.

For routines:

The specific routine must be completed for that day.

### Important

Do not calculate streak based only on the number of tasks completed.

Example:

User completes:

* 5 tasks on Monday
* 0 tasks on Tuesday
* 5 tasks on Wednesday

Their streak should be:

`1 day`

not:

`10 tasks = 10-day streak`

Streaks are based on **calendar days**, not task quantity.

---

# 12. GitHub-Style Calendar

The app should use a contribution-calendar concept similar to GitHub.

Each day is represented by a small square.

Possible intensity:

* No activity → empty
* Low activity → light
* Medium activity → medium
* High activity → strong

However, the calendar should primarily communicate **consistency**, not simply task quantity.

For routines, the cleanest representation is:

* Completed → filled square
* Missed → empty/marked square
* Future → disabled square
* Today → highlighted border

---

# 13. Important Data Rules

Every task should have:

* Task ID
* Title
* Scheduled Date
* Created At
* Completed
* Completed At

Every routine should have:

* Routine ID
* Title
* Start Date
* Goal Date
* Status
* Created At

Every routine completion should have:

* Routine ID
* Date
* Completed At

This separation is important because **tasks and routines are different entities**.

---

# 14. Main User Flow

### New User

Home

↓

No tasks

↓

`＋ Add Task`

↓

Create today's task

↓

Complete task

↓

Completion timestamp recorded

↓

Day becomes active

---

### Creating a Routine

Home

↓

Routines

↓

`＋ Add Routine`

↓

Enter title

↓

Select goal date

↓

Create

↓

Routine appears in list

↓

Open routine

↓

Complete routine for today

↓

Streak increases

---

### Checking History

Home

↓

History

↓

Calendar

↓

Select date

↓

View all tasks + routine activity for that date

---

# 15. Recommended Bottom Navigation

I would **not** put every feature as a large button on the Home Screen.

Use:

**Home | Routines | + | History**

Where:

### Home

Today's activity and streak.

### Routines

Long-term goals and streaks.

### +

Central action button:

* Add Task
* Add Routine

### History

Calendar-based historical activity.

This will make the app feel much cleaner.

---

# 16. Core Design Philosophy

The application should answer three questions immediately:

### 1. What do I need to do today?

→ Today's Tasks

### 2. Am I staying consistent?

→ Streak + contribution calendar

### 3. How have I performed over time?

→ History

The application should **not feel like a complicated project-management app**.

The primary experience should be:

**See → Do → Check → Build Streak → Review**

---

# 17. MVP Features

For Version 1, implement only:

### Tasks

* Create task
* Today/Tomorrow/Custom Date
* Complete task
* Completion timestamp
* Edit/delete task

### Routines

* Create routine
* Start date
* Goal date
* Daily completion
* Streak
* Progress
* Edit/reset/delete

### Dashboard

* Today's tasks
* Current streak
* Time remaining today
* Monthly streak calendar

### History

* Monthly calendar
* Select date
* View tasks and routine activity

Avoid adding notifications, categories, priorities, social features, achievements, etc. until the basic system works properly.
