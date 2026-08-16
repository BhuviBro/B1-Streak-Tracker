import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { CustomDatePicker } from '../common/DatePicker';
import { useData } from '../../context/DataContext';

const PRIORITIES = [
  { id: 'High', color: '#f85149' },
  { id: 'Medium', color: '#d29922' },
  { id: 'Low', color: '#58a6ff' },
];

export function AddTaskModal({ isOpen, onClose, defaultDate }) {
  const { categories, addTask } = useData();
  const [title, setTitle] = useState('');
  const [selectedDate, setSelectedDate] = useState(defaultDate || '2026-08-11');
  const [priority, setPriority] = useState('Medium');
  const [category, setCategory] = useState(categories[0]?.name || 'Study');
  const [notes, setNotes] = useState('');
  const [reminder, setReminder] = useState('');

  useEffect(() => {
    if (defaultDate) setSelectedDate(defaultDate);
  }, [defaultDate, isOpen]);

  const dateOptions = [
    { label: 'Today', value: '2026-08-11' },
    { label: 'Tomorrow', value: '2026-08-12' },
    { label: 'Pick Date', value: 'custom' },
  ];

  const handleClose = () => {
    setTitle('');
    setNotes('');
    setReminder('');
    onClose();
  };

  const handleAddTask = () => {
    if (!title.trim()) return;
    addTask({
      title: title.trim(),
      scheduledDate: selectedDate === 'custom' ? '2026-08-11' : selectedDate,
      priority,
      category,
      reminder,
      notes,
    });
    handleClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add Task">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

        {/* Title */}
        <div>
          <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>
            Task Title *
          </label>
          <input
            className="input-field"
            placeholder="What do you need to do?"
            value={title}
            onChange={e => setTitle(e.target.value)}
            autoFocus
          />
        </div>

        {/* Date Selection */}
        <div>
          <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px', display: 'block' }}>Date</label>
          <div style={{ display: 'flex', gap: '6px' }}>
            {dateOptions.map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  if (opt.value === 'custom') {
                    if (selectedDate === '2026-08-11' || selectedDate === '2026-08-12') {
                      setSelectedDate('2026-08-13');
                    }
                  } else {
                    setSelectedDate(opt.value);
                  }
                }}
                style={{
                  flex: 1, padding: '8px', borderRadius: 'var(--radius-sm)', fontSize: '13px', cursor: 'pointer',
                  border: `1px solid ${
                    (opt.value === 'custom' && selectedDate !== '2026-08-11' && selectedDate !== '2026-08-12') || selectedDate === opt.value
                      ? 'var(--accent-green-400)'
                      : 'var(--border-color)'
                  }`,
                  backgroundColor:
                    (opt.value === 'custom' && selectedDate !== '2026-08-11' && selectedDate !== '2026-08-12') || selectedDate === opt.value
                      ? 'rgba(46,160,67,0.1)'
                      : 'var(--bg-primary)',
                  color:
                    (opt.value === 'custom' && selectedDate !== '2026-08-11' && selectedDate !== '2026-08-12') || selectedDate === opt.value
                      ? 'var(--accent-green-400)'
                      : 'var(--text-secondary)',
                  fontWeight: 600, transition: 'all 0.15s ease'
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
          {selectedDate !== '2026-08-11' && selectedDate !== '2026-08-12' && (
            <CustomDatePicker
              value={selectedDate}
              onChange={newDate => setSelectedDate(newDate)}
            />
          )}
        </div>


        {/* Priority */}
        <div>
          <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px', display: 'block' }}>Priority</label>
          <div style={{ display: 'flex', gap: '8px' }}>
            {PRIORITIES.map(p => (
              <button key={p.id}
                onClick={() => setPriority(p.id)}
                style={{
                  flex: 1, padding: '8px', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontSize: '13px',
                  border: `1px solid ${priority === p.id ? p.color : 'var(--border-color)'}`,
                  backgroundColor: priority === p.id ? `${p.color}20` : 'var(--bg-primary)',
                  color: priority === p.id ? p.color : 'var(--text-secondary)',
                  fontWeight: priority === p.id ? 700 : 400, transition: 'all 0.15s ease'
                }}
              >
                {p.id}
              </button>
            ))}
          </div>
        </div>

        {/* Category */}
        <div>
          <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px', display: 'block' }}>Category</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {categories.map(cat => (
              <button key={cat.id}
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

        {/* Reminder */}
        <div>
          <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>
            Reminder (optional)
          </label>
          <input
            className="input-field"
            type="time"
            value={reminder}
            onChange={e => setReminder(e.target.value)}
          />
        </div>

        {/* Notes */}
        <div>
          <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>
            Notes (optional)
          </label>
          <textarea
            className="input-field"
            placeholder="Any extra details..."
            rows={3}
            value={notes}
            onChange={e => setNotes(e.target.value)}
            style={{ resize: 'none', lineHeight: '1.5' }}
          />
        </div>

        <Button
          variant="primary"
          fullWidth
          disabled={!title.trim()}
          onClick={handleAddTask}
        >
          Add Task
        </Button>
      </div>
    </Modal>
  );
}

