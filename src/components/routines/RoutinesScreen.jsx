import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { CustomDatePicker } from '../common/DatePicker';
import { Plus, Flame, ChevronRight, Calendar } from 'lucide-react';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const getTodayStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const getFutureDateStr = (days) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const pad = (n) => String(n).padStart(2, '0');

function RoutineCalendar({ routine }) {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  const startDate = new Date(routine.startDate);
  const goalDate = new Date(routine.goalDate);

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let day = 1; day <= daysInMonth; day++) cells.push(day);

  return (
    <div>
      {/* Day-of-week headers */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px', marginBottom: '3px' }}>
        {['S','M','T','W','T','F','S'].map((d, i) => (
          <div key={i} style={{ textAlign: 'center', fontSize: '9px', color: 'var(--text-tertiary)', fontWeight: 600 }}>{d}</div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px' }}>
        {cells.map((day, i) => {
          if (!day) return <div key={`e${i}`} />;
          const dateStr = `${year}-${pad(month+1)}-${pad(day)}`;
          const cellDate = new Date(dateStr);
          const isBeforeStart = cellDate < startDate;
          const isAfterGoal = cellDate > goalDate;
          const isFuture = cellDate > today;
          const isToday = dateStr === getTodayStr();
          const doneObj = routine.completions?.[dateStr];
          const done = doneObj === true || (doneObj && doneObj.completed === true);

          let bg = 'var(--contrib-neutral)';
          let textColor = 'var(--text-tertiary)';
          let border = '1px solid transparent';

          if (isBeforeStart || isAfterGoal) {
            bg = 'transparent';
            textColor = 'var(--text-tertiary)';
          } else if (isFuture) {
            bg = 'var(--bg-tertiary)';
            textColor = 'var(--text-secondary)';
          } else if (done) {
            bg = 'var(--contrib-level-4)';
            textColor = '#fff';
          } else if (doneObj === false) {
            bg = 'rgba(248, 81, 73, 0.25)';
            textColor = '#f85149';
          }

          if (isToday) border = '2px solid var(--accent-green-400)';

          return (
            <div key={dateStr}
              title={`${dateStr}: ${isFuture ? 'Future' : done ? 'Completed' : isBeforeStart ? 'N/A' : 'Missed'}`}
              style={{
                aspectRatio: '1', borderRadius: '4px',
                backgroundColor: bg, border,
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '10px', fontWeight: isToday ? 700 : 500,
                color: isToday && done !== true ? 'var(--accent-green-400)' : textColor,
              }}
            >
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function RoutineDetailsModal({ routine, onClose }) {
  const { categories, toggleRoutineStatus, editRoutine, deleteRoutine } = useData();
  const [editingGoal, setEditingGoal] = useState(false);
  const [newGoal, setNewGoal] = useState(routine?.goalDate || getFutureDateStr(30));
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  if (!routine) return null;

  const handleDeleteClick = () => {
    setShowConfirmDelete(true);
  };

  const handleConfirmDelete = () => {
    deleteRoutine(routine.id);
    setShowConfirmDelete(false);
    onClose();
  };
  const totalDays = routine.completedDays + routine.missedDays + routine.daysRemaining;
  const progress = totalDays > 0 ? routine.completedDays / totalDays : 0;

  const catObj = categories.find(c => c.name === routine.category);
  const catColor = catObj ? catObj.color : '#8b949e';

  const handlePause = () => {
    toggleRoutineStatus(routine.id);
    onClose();
  };

  const handleSaveGoal = () => {
    editRoutine(routine.id, { goalDate: newGoal });
    setEditingGoal(false);
    onClose();
  };

  const handleDelete = () => {
    deleteRoutine(routine.id);
    onClose();
  };

  return (
    <Modal isOpen={!!routine} onClose={onClose} title={routine.title}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Badge color={catColor}>{routine.category || 'General'}</Badge>
            <Badge variant={routine.status === 'active' ? 'routine' : 'default'}>
              {routine.status === 'active' ? 'Active' : 'Paused'}
            </Badge>
          </div>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            Start: {routine.startDate}
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          {[
            { label: 'Start Date', value: routine.startDate, color: 'var(--text-secondary)' },
            { label: 'Goal Date', value: routine.goalDate, color: 'var(--text-secondary)' },
            { label: '🔥 Current Streak', value: `${routine.currentStreak} Days`, color: '#f85149' },
            { label: '🏆 Best Streak', value: `${routine.bestStreak} Days`, color: '#d29922' },
            { label: '✅ Completed Days', value: `${routine.completedDays}`, color: 'var(--accent-green-400)' },
            { label: '❌ Missed Days', value: `${routine.missedDays}`, color: 'var(--status-danger)' },
            { label: '📅 Days Remaining', value: `${routine.daysRemaining}`, color: 'var(--status-info)' },
            { label: '📊 Consistency', value: `${routine.consistency?.toFixed(1) || 100}%`, color: 'var(--accent-green-400)' },
          ].map(({ label, value, color }) => (
            <div key={label} style={{ backgroundColor: 'var(--bg-tertiary)', padding: '10px', borderRadius: 'var(--radius-sm)' }}>
              <p style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginBottom: '2px' }}>{label}</p>
              <p style={{ fontSize: '15px', fontWeight: 700, color }}>{value}</p>
            </div>
          ))}
        </div>

        {/* Progress */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Progress</span>
            <span style={{ fontSize: '12px', color: 'var(--accent-green-400)', fontWeight: 600 }}>
              {routine.completedDays} / {totalDays} Days
            </span>
          </div>
          <div style={{ height: '8px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '99px', overflow: 'hidden' }}>
            <div style={{
              height: '100%', width: `${Math.min(100, Math.max(5, progress * 100))}%`,
              background: 'linear-gradient(90deg, var(--accent-green-500), var(--accent-green-400))',
              borderRadius: '99px', transition: 'width 0.5s ease'
            }} />
          </div>
        </div>

        {/* Edit Goal Inline with Themed Calendar */}
        {editingGoal ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '12px', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)' }}>
            <label style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>Select New Goal Date</label>
            <CustomDatePicker value={newGoal} onChange={setNewGoal} />
            <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
              <Button variant="primary" size="sm" onClick={handleSaveGoal} fullWidth>Save New Goal</Button>
              <Button variant="secondary" size="sm" onClick={() => setEditingGoal(false)} fullWidth>Cancel</Button>
            </div>
          </div>
        ) : null}

        {/* Actions */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button variant="secondary" fullWidth onClick={handlePause}>
            {routine.status === 'active' ? 'Pause' : 'Resume'}
          </Button>
          <Button variant="secondary" fullWidth onClick={() => setEditingGoal(!editingGoal)}>
            Edit Goal
          </Button>
          <Button variant="danger" fullWidth onClick={handleDeleteClick}>
            Delete
          </Button>
        </div>
      </div>

      {showConfirmDelete && (
        <Modal
          isOpen={showConfirmDelete}
          onClose={() => setShowConfirmDelete(false)}
          title="Delete Routine"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
              Are you sure you want to delete the routine <strong>"{routine.title}"</strong>? This will permanently remove its completion history and streaks.
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <Button variant="danger" fullWidth onClick={handleConfirmDelete}>
                Yes, Delete
              </Button>
              <Button variant="secondary" fullWidth onClick={() => setShowConfirmDelete(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </Modal>
  );
}

export function RoutinesScreen() {
  const { routines, categories, addRoutine } = useData();
  const [selectedRoutine, setSelectedRoutine] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(categories[0]?.name || 'Coding');
  const [startDate, setStartDate] = useState(getTodayStr());
  const [goalDate, setGoalDate] = useState(getFutureDateStr(30));
  const [activeDateTab, setActiveDateTab] = useState('goal'); // 'start' | 'goal'

  const getCategoryColor = (catName) => {
    const cat = categories.find(c => c.name === catName);
    return cat ? cat.color : '#8b949e';
  };

  const handleCreateRoutine = () => {
    if (!title.trim()) return;
    addRoutine({
      title: title.trim(),
      category,
      startDate,
      goalDate,
    });
    setTitle('');
    setShowAddModal(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '8px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text-primary)' }}>Routines</h1>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Long-term commitments & consistency</p>
        </div>
        <Button id="btn-add-routine-open" variant="primary" icon={Plus} size="sm" onClick={() => setShowAddModal(true)}>
          Add
        </Button>
      </div>

      {/* Routine Cards */}
      {routines.map(routine => (
        <Card key={routine.id} hoverable onClick={() => setSelectedRoutine(routine)}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>{routine.title}</h3>
                {routine.status === 'paused' && <Badge>Paused</Badge>}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                <Badge color={getCategoryColor(routine.category)}>{routine.category || 'General'}</Badge>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Goal: {routine.goalDate}</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Flame size={16} color="#f85149" />
              <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
                {routine.currentStreak}d
              </span>
              <ChevronRight size={14} color="var(--text-tertiary)" />
            </div>
          </div>

          <RoutineCalendar routine={routine} />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', paddingTop: '10px', borderTop: '1px solid var(--border-muted)' }}>
            <div style={{ display: 'flex', gap: '12px' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                ✅ <strong>{routine.completedDays}</strong> completed
              </span>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                ❌ <strong>{routine.missedDays}</strong> missed
              </span>
            </div>
            <span style={{ fontSize: '12px', color: 'var(--status-info)' }}>
              {routine.daysRemaining}d left
            </span>
          </div>
        </Card>
      ))}

      {routines.length === 0 && (
        <Card style={{ textAlign: 'center', padding: '32px 16px' }}>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
            No routines created yet. Start a new consistency goal!
          </p>
          <Button variant="primary" icon={Plus} onClick={() => setShowAddModal(true)}>
            Create First Routine
          </Button>
        </Card>
      )}

      {/* Routine Details Modal */}
      <RoutineDetailsModal
        routine={selectedRoutine ? routines.find(r => r.id === selectedRoutine.id) : null}
        onClose={() => setSelectedRoutine(null)}
      />

      {/* Add Routine Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Create Routine">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Routine Title */}
          <div>
            <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>Routine Title *</label>
            <input
              id="input-routine-title"
              className="input-field"
              placeholder="e.g. Read Every Day, Daily Workout"
              value={title}
              onChange={e => setTitle(e.target.value)}
              autoFocus
            />
          </div>

          {/* Category Selection */}
          <div>
            <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px', display: 'block' }}>Category</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.name)}
                  style={{
                    padding: '4px 12px', borderRadius: 'var(--radius-full)', cursor: 'pointer', fontSize: '12px', fontWeight: 600,
                    border: `1px solid ${category === cat.name ? cat.color : 'var(--border-color)'}`,
                    backgroundColor: category === cat.name ? `${cat.color}25` : 'transparent',
                    color: category === cat.name ? cat.color : 'var(--text-tertiary)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Start Date & Goal Date Themed Picker */}
          <div>
            <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>Dates</label>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              <button
                type="button"
                onClick={() => setActiveDateTab('start')}
                style={{
                  flex: 1, padding: '8px', borderRadius: 'var(--radius-sm)',
                  border: `1px solid ${activeDateTab === 'start' ? 'var(--accent-green-400)' : 'var(--border-color)'}`,
                  backgroundColor: activeDateTab === 'start' ? 'rgba(46,160,67,0.1)' : 'var(--bg-primary)',
                  color: activeDateTab === 'start' ? 'var(--accent-green-400)' : 'var(--text-secondary)',
                  fontSize: '12px', fontWeight: 600, cursor: 'pointer'
                }}
              >
                Start: {startDate}
              </button>
              <button
                type="button"
                onClick={() => setActiveDateTab('goal')}
                style={{
                  flex: 1, padding: '8px', borderRadius: 'var(--radius-sm)',
                  border: `1px solid ${activeDateTab === 'goal' ? 'var(--accent-green-400)' : 'var(--border-color)'}`,
                  backgroundColor: activeDateTab === 'goal' ? 'rgba(46,160,67,0.1)' : 'var(--bg-primary)',
                  color: activeDateTab === 'goal' ? 'var(--accent-green-400)' : 'var(--text-secondary)',
                  fontSize: '12px', fontWeight: 600, cursor: 'pointer'
                }}
              >
                Goal: {goalDate}
              </button>
            </div>

            {/* Custom Date Picker matching active date tab */}
            <CustomDatePicker
              value={activeDateTab === 'start' ? startDate : goalDate}
              onChange={newDate => {
                if (activeDateTab === 'start') setStartDate(newDate);
                else setGoalDate(newDate);
              }}
            />
          </div>

          <Button
            id="btn-submit-routine"
            variant="primary"
            fullWidth
            disabled={!title.trim()}
            onClick={handleCreateRoutine}
          >
            Create Routine
          </Button>
        </div>
      </Modal>

    </div>
  );
}
