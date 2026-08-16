import React, { useState, useEffect, useMemo } from 'react';
import { GitHubCalendar } from './GitHubCalendar';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { useData } from '../../context/DataContext';
import { Flame, Clock, BarChart3, CalendarDays } from 'lucide-react';

function getTimeRemaining() {
  const now = new Date();
  const midnight = new Date();
  midnight.setHours(23, 59, 59, 999);
  const diff = midnight - now;
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  return `${h}h ${m}m`;
}

function getCurrentTime() {
  const now = new Date();
  let hours = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  return `${hours}:${minutes}:${seconds} ${ampm}`;
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

/* ─── Category Insights Bar Graph ─── */
function CategoryGraph({ tasks, routines, categories }) {
  // Aggregate completed counts by category
  const catData = useMemo(() => {
    const counts = {};

    // Count completed tasks per category
    tasks.forEach(t => {
      if (t.completed) {
        const cat = t.category || 'General';
        counts[cat] = (counts[cat] || 0) + 1;
      }
    });

    // Count completed routine days per category
    routines.forEach(r => {
      const cat = r.category || 'General';
      const completedCount = Object.values(r.completions || {}).filter(Boolean).length;
      counts[cat] = (counts[cat] || 0) + completedCount;
    });

    // Total (completed + pending) per category
    const totals = {};
    tasks.forEach(t => {
      const cat = t.category || 'General';
      totals[cat] = (totals[cat] || 0) + 1;
    });
    routines.forEach(r => {
      const cat = r.category || 'General';
      const totalCount = Object.keys(r.completions || {}).length;
      totals[cat] = (totals[cat] || 0) + totalCount;
    });

    return categories.map(cat => ({
      name: cat.name,
      color: cat.color,
      completed: counts[cat.name] || 0,
      total: totals[cat.name] || 0,
    })).filter(c => c.total > 0 || c.completed > 0);
  }, [tasks, routines, categories]);

  const totalCompleted = catData.reduce((sum, c) => sum + c.completed, 0);
  const totalAll = catData.reduce((sum, c) => sum + c.total, 0);

  if (catData.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '24px 16px' }}>
        <BarChart3 size={32} color="var(--text-tertiary)" style={{ margin: '0 auto 8px' }} />
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>No activity data yet</p>
        <p style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '4px' }}>
          Complete tasks & routines to see category insights
        </p>
      </div>
    );
  }

  const maxCompleted = Math.max(...catData.map(c => c.completed), 1);
  const BAR_HEIGHT = 120; // max bar height in px

  return (
    <div>
      {/* Title */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>Category Focus</h3>
          <p style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '2px' }}>Where your effort goes</p>
        </div>
        <div style={{
          padding: '4px 10px', borderRadius: 'var(--radius-full)',
          backgroundColor: 'rgba(46,160,67,0.1)', border: '1px solid rgba(46,160,67,0.3)'
        }}>
          <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--accent-green-400)' }}>
            {totalCompleted} / {totalAll} done
          </span>
        </div>
      </div>

      {/* Vertical Bar Graph */}
      <div style={{
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
        gap: catData.length <= 3 ? '24px' : '16px',
        height: `${BAR_HEIGHT + 50}px`,
        paddingBottom: '0px'
      }}>
        {catData.map(cat => {
          const barH = maxCompleted > 0 ? (cat.completed / maxCompleted) * BAR_HEIGHT : 0;
          const pct = totalAll > 0 ? Math.round((cat.completed / totalAll) * 100) : 0;
          return (
            <div key={cat.name} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
              flex: 1, maxWidth: '72px'
            }}>
              {/* Count on top */}
              <span style={{ fontSize: '13px', fontWeight: 800, color: cat.color }}>
                {cat.completed}
              </span>

              {/* Bar */}
              <div style={{
                width: '100%', height: `${BAR_HEIGHT}px`,
                display: 'flex', alignItems: 'flex-end',
                borderRadius: '8px 8px 0 0',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: '100%',
                  height: `${Math.max(barH, 6)}px`,
                  background: `linear-gradient(180deg, ${cat.color}, ${cat.color}aa)`,
                  borderRadius: '8px 8px 0 0',
                  transition: 'height 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: `0 0 12px ${cat.color}30`
                }} />
              </div>

              {/* Category label */}
              <span style={{
                fontSize: '11px', fontWeight: 600, color: 'var(--text-primary)',
                textAlign: 'center', lineHeight: '1.2'
              }}>
                {cat.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}


export function HomeScreen({ onNavigate }) {
  const [calView, setCalView] = useState('monthly');
  const [showInsights, setShowInsights] = useState(false);
  const { profile: user, tasks, routines, categories, toggleTask, toggleRoutineCompletion: toggleRoutineOccurrence } = useData();
  const [timeLeft, setTimeLeft] = useState(getTimeRemaining());
  const [currentTime, setCurrentTime] = useState(getCurrentTime());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeRemaining());
      setCurrentTime(getCurrentTime());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const todayStr = '2026-08-11';

  // Unified today list: tasks + routine occurrences
  const todayTasks = tasks.filter(t => t.scheduledDate === todayStr);
  const todayRoutines = routines.filter(r => r.status === 'active');

  const getCategoryColor = (catName) => {
    const cat = categories.find(c => c.name === catName);
    return cat ? cat.color : '#8b949e';
  };


  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '8px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text-primary)' }}>
            {getGreeting()}, {user.name.split(' ')[0]} 👋
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '3px' }}>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Tuesday, 11 August 2026
            </p>
            <span style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: 'var(--text-tertiary)', flexShrink: 0 }} />
            <p style={{ fontSize: '13px', color: 'var(--accent-green-400)', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
              {currentTime}
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {/* Toggle between Calendar and Category Insights */}
          <button
            id="btn-toggle-insights"
            onClick={() => setShowInsights(!showInsights)}
            title={showInsights ? 'Show Calendar' : 'Show Category Insights'}
            style={{
              width: '36px', height: '36px', borderRadius: 'var(--radius-sm)',
              border: `1px solid ${showInsights ? 'var(--accent-green-400)' : 'var(--border-color)'}`,
              backgroundColor: showInsights ? 'rgba(46,160,67,0.15)' : 'var(--bg-tertiary)',
              color: showInsights ? 'var(--accent-green-400)' : 'var(--text-secondary)',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s ease'
            }}
          >
            {showInsights ? <CalendarDays size={18} /> : <BarChart3 size={18} />}
          </button>
          <div style={{
            width: '36px', height: '36px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #238636, #2ea043)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', fontSize: '14px', fontWeight: 700, color: '#fff'
          }}
            onClick={() => onNavigate('settings')}
          >
            {user.name.split(' ').map(n => n[0]).join('')}
          </div>
        </div>
      </div>

      {/* Conditional: Calendar tabs + calendar  OR  Category Insights */}
      {showInsights ? (
        <Card>
          <CategoryGraph tasks={tasks} routines={routines} categories={categories} />
        </Card>
      ) : (
        <>
          {/* Calendar Tabs */}
          <div style={{ display: 'flex', gap: '4px', backgroundColor: 'var(--bg-tertiary)', padding: '4px', borderRadius: 'var(--radius-md)' }}>
            {['yearly', 'monthly', 'weekly'].map(v => (
              <button key={v}
                onClick={() => setCalView(v)}
                style={{
                  flex: 1, padding: '7px', border: 'none', borderRadius: 'var(--radius-sm)',
                  backgroundColor: calView === v ? 'var(--bg-secondary)' : 'transparent',
                  color: calView === v ? 'var(--accent-green-400)' : 'var(--text-secondary)',
                  fontWeight: calView === v ? 600 : 400, fontSize: '13px', cursor: 'pointer',
                  textTransform: 'capitalize', transition: 'all 0.15s ease',
                  boxShadow: calView === v ? 'var(--shadow-sm)' : 'none'
                }}
              >
                {v.charAt(0).toUpperCase() + v.slice(1)}
              </button>
            ))}
          </div>

          {/* GitHub Calendar */}
          <Card>
            <GitHubCalendar view={calView} currentDate={new Date('2026-08-11')} routines={routines} tasks={tasks} />
          </Card>
        </>
      )}

      {/* Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <Card style={{ textAlign: 'center' }}>
          <Flame size={20} color="#f85149" style={{ margin: '0 auto 6px' }} />
          <p style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>
            {user.ongoingStreak}
          </p>
          <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>Day Streak</p>
        </Card>
        <Card style={{ textAlign: 'center' }}>
          <Clock size={20} color="var(--status-info)" style={{ margin: '0 auto 6px' }} />
          <p style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>
            {timeLeft}
          </p>
          <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>Remaining Today</p>
        </Card>
      </div>

      {/* Today's Tasks */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>Today's Tasks</h2>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            {[...todayTasks, ...todayRoutines].filter(i => i.completed || (i.completions && i.completions[todayStr])).length} / {todayTasks.length + todayRoutines.length} done
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {/* Normal Tasks */}
          {todayTasks.map(task => (
            <div key={task.id}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '12px 14px',
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                opacity: task.completed ? 0.6 : 1,
                transition: 'opacity 0.2s ease'
              }}
            >
              <button
                onClick={() => toggleTask(task.id)}
                style={{
                  width: '20px', height: '20px', borderRadius: '50%', flexShrink: 0, cursor: 'pointer',
                  border: `2px solid ${task.completed ? 'var(--accent-green-400)' : 'var(--text-tertiary)'}`,
                  backgroundColor: task.completed ? 'var(--accent-green-400)' : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.2s ease'
                }}
              >
                {task.completed && <span style={{ color: '#fff', fontSize: '10px', fontWeight: 700 }}>✓</span>}
              </button>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{
                  fontSize: '14px', fontWeight: 500,
                  color: task.completed ? 'var(--text-tertiary)' : 'var(--text-primary)',
                  textDecoration: task.completed ? 'line-through' : 'none'
                }}>
                  {task.title}
                </p>
                {task.completed && task.completedAt && (
                  <p style={{ fontSize: '11px', color: 'var(--accent-green-400)', marginTop: '2px' }}>
                    Completed at {new Date(task.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                )}
              </div>
              <Badge color={getCategoryColor(task.category)}>{task.category}</Badge>
            </div>
          ))}

          {/* Routine Occurrences */}
          {todayRoutines.map(routine => {
            const done = routine.completions?.[todayStr];
            return (
              <div key={routine.id}
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '12px 14px',
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  borderLeft: '3px solid var(--status-routine)',
                  borderRadius: 'var(--radius-md)',
                  opacity: done ? 0.6 : 1,
                  transition: 'opacity 0.2s ease'
                }}
              >
                <button
                  onClick={() => toggleRoutineOccurrence(routine.id, todayStr)}
                  style={{
                    width: '20px', height: '20px', borderRadius: '50%', flexShrink: 0, cursor: 'pointer',
                    border: `2px solid ${done ? 'var(--status-routine)' : 'var(--text-tertiary)'}`,
                    backgroundColor: done ? 'var(--status-routine)' : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {done && <span style={{ color: '#fff', fontSize: '10px', fontWeight: 700 }}>✓</span>}
                </button>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{
                    fontSize: '14px', fontWeight: 500,
                    color: done ? 'var(--text-tertiary)' : 'var(--text-primary)',
                    textDecoration: done ? 'line-through' : 'none'
                  }}>
                    {routine.title}
                  </p>
                  <p style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '2px' }}>
                    🔥 {routine.currentStreak} day streak
                  </p>
                </div>
                <Badge variant="routine">Routine</Badge>
              </div>
            );
          })}
        </div>
      </div>


      {/* Bottom spacer */}
      <div style={{ height: '8px' }} />
    </div>
  );
}
