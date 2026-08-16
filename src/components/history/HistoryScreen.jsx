import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { AddTaskModal } from '../tasks/AddTaskModal';
import { useData } from '../../context/DataContext';
import { ChevronLeft, ChevronRight, Plus, Check, X as XIcon, Clock } from 'lucide-react';

const MONTHS_LONG  = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const MONTHS_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const DAY_LETTERS  = ['S','M','T','W','T','F','S'];
const DAY_SHORT    = ['Su','Mo','Tu','We','Th','Fr','Sa'];

function pad(n) { return String(n).padStart(2, '0'); }
function getDaysInMonth(y, m) { return new Date(y, m + 1, 0).getDate(); }
function getFirstDay(y, m)    { return new Date(y, m, 1).getDay(); }

const todayStr = '2026-08-11';

export function HistoryScreen() {
  const { tasks, routines, categories, toggleTask, toggleRoutineCompletion: toggleRoutineOccurrence } = useData();
  const [calView, setCalView] = useState('monthly');

  // Monthly nav state
  const [mYear, setMYear]   = useState(2026);
  const [mMonth, setMMonth] = useState(7); // August = index 7

  // Weekly nav state
  const [weekOffset, setWeekOffset] = useState(0);

  // Yearly nav state
  const [yYear, setYYear] = useState(2026);

  const [selectedDate, setSelectedDate] = useState('2026-08-11');
  const [showAddTask,  setShowAddTask]  = useState(false);

  // ─── Helpers ────────────────────────────────────────────────────────────────

  const getCategoryColor = (catName) => {
    const cat = categories.find(c => c.name === catName);
    return cat ? cat.color : '#8b949e';
  };

  const getTasksForDate    = (d) => tasks.filter(t => t.scheduledDate === d);
  const getRoutinesForDate = (d) => routines.filter(r => {
    const dt = new Date(d), s = new Date(r.startDate), g = new Date(r.goalDate);
    return dt >= s && dt <= g && r.status === 'active';
  });

  const hasDot = (dateStr) => {
    const tList = getTasksForDate(dateStr);
    const rList = getRoutinesForDate(dateStr);
    return tList.some(t => t.completed) || rList.some(r => r.completions?.[dateStr]);
  };

  // Cell background colour depending on past/today/future activity
  const getCellBg = (dateStr) => {
    if (dateStr > todayStr) return 'var(--bg-tertiary)';
    const tList = getTasksForDate(dateStr);
    const rList = getRoutinesForDate(dateStr);
    const total = tList.length + rList.length;
    if (total === 0) return 'var(--bg-tertiary)';
    const done = tList.filter(t => t.completed).length
               + rList.filter(r => r.completions?.[dateStr]).length;
    const rate = done / total;
    if (rate === 0) return 'var(--bg-tertiary)';
    if (rate < 0.25) return 'var(--contrib-level-1)';
    if (rate < 0.5)  return 'var(--contrib-level-2)';
    if (rate < 0.75) return 'var(--contrib-level-3)';
    if (rate < 1)    return 'var(--contrib-level-4)';
    return 'var(--contrib-level-5)';
  };

  // ─── Monthly Calendar ────────────────────────────────────────────────────────

  const renderMonthlyCalendar = () => {
    const days  = getDaysInMonth(mYear, mMonth);
    const first = getFirstDay(mYear, mMonth);
    const cells = [];
    for (let i = 0; i < first; i++) cells.push(null);
    for (let d = 1; d <= days; d++) cells.push(d);

    const prevMonth = () => { if (mMonth === 0) { setMMonth(11); setMYear(y => y - 1); } else setMMonth(m => m - 1); };
    const nextMonth = () => { if (mMonth === 11) { setMMonth(0);  setMYear(y => y + 1); } else setMMonth(m => m + 1); };

    return (
      <div>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
          <button onClick={prevMonth} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
            <ChevronLeft size={18} />
          </button>
          <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
            {MONTHS_LONG[mMonth]} {mYear}
          </span>
          <button onClick={nextMonth} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Day headers */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px', marginBottom: '4px' }}>
          {DAY_LETTERS.map((d, i) => (
            <div key={i} style={{ textAlign: 'center', fontSize: '11px', color: 'var(--text-tertiary)', fontWeight: 600, padding: '2px 0' }}>{d}</div>
          ))}
        </div>

        {/* Cells */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
          {cells.map((day, i) => {
            if (!day) return <div key={`e${i}`} />;
            const dateStr  = `${mYear}-${pad(mMonth + 1)}-${pad(day)}`;
            const isSelected = selectedDate === dateStr;
            const now     = dateStr === todayStr;
            const future  = dateStr > todayStr;
            const bg      = isSelected ? 'var(--accent-green-500)' : now ? 'rgba(35,134,54,0.18)' : future ? 'var(--bg-tertiary)' : getCellBg(dateStr);
            const col     = isSelected ? '#fff' : now ? 'var(--accent-green-400)' : 'var(--text-primary)';

            return (
              <button key={dateStr}
                onClick={() => setSelectedDate(isSelected ? null : dateStr)}
                style={{
                  aspectRatio: '1', borderRadius: '8px', border: 'none', cursor: 'pointer',
                  backgroundColor: bg, color: col,
                  fontWeight: now ? 700 : 400, fontSize: '13px',
                  outline: now && !isSelected ? '2px solid var(--accent-green-400)' : 'none',
                  outlineOffset: '-2px',
                  position: 'relative', transition: 'all 0.15s ease',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}
              >
                {day}
                {hasDot(dateStr) && !isSelected && (
                  <div style={{
                    position: 'absolute', bottom: '3px', left: '50%', transform: 'translateX(-50%)',
                    width: '4px', height: '4px', borderRadius: '50%',
                    backgroundColor: now ? 'var(--accent-green-400)' : '#fff'
                  }} />
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  // ─── Weekly Calendar ─────────────────────────────────────────────────────────

  const renderWeeklyCalendar = () => {
    const base = new Date('2026-08-11');
    base.setDate(base.getDate() - base.getDay() + weekOffset * 7);
    const week = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(base);
      d.setDate(d.getDate() + i);
      return d;
    });
    const label = `${MONTHS_SHORT[week[0].getMonth()]} ${week[0].getDate()} – ${MONTHS_SHORT[week[6].getMonth()]} ${week[6].getDate()}, ${week[0].getFullYear()}`;

    return (
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <button onClick={() => setWeekOffset(o => o - 1)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
            <ChevronLeft size={18} />
          </button>
          <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>{label}</span>
          <button onClick={() => setWeekOffset(o => o + 1)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
            <ChevronRight size={18} />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px' }}>
          {week.map(d => {
            const dateStr    = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
            const isSelected = selectedDate === dateStr;
            const now        = dateStr === todayStr;
            const future     = dateStr > todayStr;
            const bg         = isSelected ? 'var(--accent-green-500)' : now ? 'rgba(35,134,54,0.18)' : future ? 'var(--bg-tertiary)' : getCellBg(dateStr);
            const col        = isSelected ? '#fff' : now ? 'var(--accent-green-400)' : 'var(--text-primary)';

            const taskCount    = getTasksForDate(dateStr).length;
            const routineCount = getRoutinesForDate(dateStr).length;
            const total        = taskCount + routineCount;

            return (
              <button key={dateStr}
                onClick={() => setSelectedDate(isSelected ? null : dateStr)}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
                  padding: '10px 4px', borderRadius: '10px', border: 'none', cursor: 'pointer',
                  backgroundColor: bg, color: col,
                  outline: now && !isSelected ? '2px solid var(--accent-green-400)' : 'none',
                  outlineOffset: '-2px', transition: 'all 0.15s ease'
                }}
              >
                <span style={{ fontSize: '10px', color: isSelected ? 'rgba(255,255,255,0.8)' : 'var(--text-tertiary)', fontWeight: 600 }}>
                  {DAY_SHORT[d.getDay()]}
                </span>
                <span style={{ fontSize: '16px', fontWeight: now ? 700 : 500 }}>{d.getDate()}</span>
                {total > 0 && (
                  <span style={{ fontSize: '10px', color: isSelected ? 'rgba(255,255,255,0.7)' : 'var(--text-secondary)' }}>
                    {total} item{total > 1 ? 's' : ''}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  // ─── Yearly Calendar ─────────────────────────────────────────────────────────

  const renderYearlyCalendar = () => {
    return (
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <button onClick={() => setYYear(y => y - 1)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
            <ChevronLeft size={18} />
          </button>
          <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>{yYear}</span>
          <button onClick={() => setYYear(y => y + 1)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
            <ChevronRight size={18} />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
          {Array.from({ length: 12 }, (_, m) => {
            const days  = getDaysInMonth(yYear, m);
            const first = getFirstDay(yYear, m);
            const cells = [];
            for (let i = 0; i < first; i++) cells.push(null);
            for (let d = 1; d <= days; d++) cells.push(d);

            return (
              <div key={m}>
                <p style={{
                  fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)',
                  marginBottom: '5px', textAlign: 'center'
                }}>
                  {MONTHS_SHORT[m]}
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px' }}>
                  {cells.map((day, i) => {
                    if (!day) return <div key={`e${i}`} style={{ width: '10px', height: '10px' }} />;
                    const dateStr    = `${yYear}-${pad(m + 1)}-${pad(day)}`;
                    const isSelected = selectedDate === dateStr;
                    const now        = dateStr === todayStr;
                    const future     = dateStr > todayStr;
                    const bg         = isSelected ? 'var(--accent-green-400)' : now ? 'rgba(35,134,54,0.5)' : future ? 'var(--bg-tertiary)' : getCellBg(dateStr);

                    return (
                      <button key={dateStr}
                        title={dateStr}
                        onClick={() => setSelectedDate(isSelected ? null : dateStr)}
                        style={{
                          width: '10px', height: '10px', borderRadius: '2px', border: 'none',
                          backgroundColor: bg, cursor: 'pointer', padding: 0,
                          outline: now ? '1px solid var(--accent-green-400)' : 'none',
                          outlineOffset: '1px'
                        }}
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '5px', marginTop: '12px' }}>
          <span style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>Less</span>
          {[0, 1, 2, 3, 4, 5].map(l => (
            <div key={l} style={{ width: '10px', height: '10px', borderRadius: '2px', backgroundColor: l === 0 ? 'var(--bg-tertiary)' : `var(--contrib-level-${l})` }} />
          ))}
          <span style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>More</span>
        </div>
      </div>
    );
  };

  // ─── Day Details Panel ───────────────────────────────────────────────────────

  const renderDayDetails = () => {
    if (!selectedDate) return null;
    const taskList     = getTasksForDate(selectedDate);
    const routineList  = getRoutinesForDate(selectedDate);
    const isPastDate   = selectedDate < todayStr;
    const isFutureDate = selectedDate > todayStr;
    const isTodayDate  = selectedDate === todayStr;

    return (
      <Card>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>
            {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </h3>
          <Badge color={isPastDate ? '#8b949e' : isTodayDate ? '#2ea043' : '#58a6ff'}>
            {isPastDate ? 'Past' : isTodayDate ? 'Today' : 'Future'}
          </Badge>
        </div>

        {taskList.length > 0 && (
          <div style={{ marginBottom: '12px' }}>
            <p style={{ fontSize: '11px', color: 'var(--text-tertiary)', fontWeight: 700, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {isPastDate ? 'Task Log' : 'Scheduled Tasks'}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {taskList.map(t => (
                <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 10px', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)' }}>
                  <button
                    onClick={() => toggleTask(t.id)}
                    style={{
                      width: '18px', height: '18px', borderRadius: '50%', flexShrink: 0, cursor: 'pointer',
                      border: `2px solid ${t.completed ? 'var(--accent-green-400)' : 'var(--text-tertiary)'}`,
                      backgroundColor: t.completed ? 'var(--accent-green-400)' : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    {t.completed && <Check size={11} color="#fff" strokeWidth={3} />}
                  </button>
                  <span style={{ flex: 1, fontSize: '13px', color: t.completed ? 'var(--text-tertiary)' : 'var(--text-primary)', textDecoration: t.completed ? 'line-through' : 'none' }}>
                    {t.title}
                  </span>
                  {t.completedAt && (
                    <span style={{ fontSize: '11px', color: 'var(--accent-green-400)' }}>
                      {new Date(t.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  )}
                  <Badge color={getCategoryColor(t.category)}>{t.category}</Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {routineList.length > 0 && (
          <div style={{ marginBottom: '12px' }}>
            <p style={{ fontSize: '11px', color: 'var(--text-tertiary)', fontWeight: 700, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Routine Activity
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {routineList.map(r => {
                const done = r.completions?.[selectedDate];
                return (
                  <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 10px', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--status-routine)' }}>
                    <button
                      onClick={() => toggleRoutineOccurrence(r.id, selectedDate)}
                      style={{
                        width: '18px', height: '18px', borderRadius: '50%', flexShrink: 0, cursor: 'pointer',
                        border: `2px solid ${done ? 'var(--status-routine)' : 'var(--text-tertiary)'}`,
                        backgroundColor: done ? 'var(--status-routine)' : 'transparent',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}
                    >
                      {done && <Check size={11} color="#fff" strokeWidth={3} />}
                    </button>
                    <span style={{ flex: 1, fontSize: '13px', color: done ? 'var(--text-tertiary)' : 'var(--text-primary)', textDecoration: done ? 'line-through' : 'none' }}>
                      {r.title}
                    </span>
                    <Badge variant="routine">Routine</Badge>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {(isFutureDate || isTodayDate) && (
          <Button variant="secondary" fullWidth icon={Plus} onClick={() => setShowAddTask(true)}>
            Add Task for {isTodayDate ? 'Today' : selectedDate}
          </Button>
        )}

        {taskList.length === 0 && routineList.length === 0 && (
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <p style={{ fontSize: '13px', color: 'var(--text-tertiary)', marginBottom: '12px' }}>
              No activity scheduled for this day.
            </p>
            <Button variant="secondary" size="sm" icon={Plus} onClick={() => setShowAddTask(true)}>
              Add Task for This Date
            </Button>
          </div>
        )}
      </Card>
    );
  };

  // ─── Render ──────────────────────────────────────────────────────────────────

  const renderCalendar = () => {
    switch (calView) {
      case 'yearly':  return renderYearlyCalendar();
      case 'weekly':  return renderWeeklyCalendar();
      case 'monthly':
      default:        return renderMonthlyCalendar();
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ paddingTop: '8px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text-primary)' }}>History</h1>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Browse any date — past, today, or future</p>
      </div>

      {/* View Tabs */}
      <div style={{ display: 'flex', gap: '4px', backgroundColor: 'var(--bg-tertiary)', padding: '4px', borderRadius: 'var(--radius-md)' }}>
        {['yearly', 'monthly', 'weekly'].map(v => (
          <button key={v}
            onClick={() => { setCalView(v); setSelectedDate(todayStr); }}
            style={{
              flex: 1, padding: '7px', border: 'none', borderRadius: 'var(--radius-sm)',
              backgroundColor: calView === v ? 'var(--bg-secondary)' : 'transparent',
              color: calView === v ? 'var(--accent-green-400)' : 'var(--text-secondary)',
              fontWeight: calView === v ? 600 : 400, fontSize: '13px', cursor: 'pointer',
              textTransform: 'capitalize', transition: 'all 0.15s ease',
              boxShadow: calView === v ? 'var(--shadow-sm)' : 'none'
            }}>
            {v.charAt(0).toUpperCase() + v.slice(1)}
          </button>
        ))}
      </div>

      {/* Calendar */}
      <Card>{renderCalendar()}</Card>

      {/* Day details */}
      {renderDayDetails()}

      {/* Reusable Add Task Modal */}
      <AddTaskModal
        isOpen={showAddTask}
        onClose={() => setShowAddTask(false)}
        defaultDate={selectedDate || todayStr}
      />
    </div>
  );
}
