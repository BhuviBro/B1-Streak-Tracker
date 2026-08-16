import React, { useState } from 'react';
import { Modal } from './Modal';
import { Card } from './Card';
import { Button } from './Button';
import { Badge } from './Badge';
import { CustomDatePicker } from './DatePicker';
import { Calendar, Trash2, CheckCircle2 } from 'lucide-react';

export function CarryForwardModal({ isOpen, incompleteTasks, onConfirm }) {
  const [actions, setActions] = useState({});

  if (!isOpen || incompleteTasks.length === 0) return null;

  // Format date helper: YYYY-MM-DD -> DD/MM/YY
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    const yearShort = parts[0].slice(-2);
    return `${parts[2]}/${parts[1]}/${yearShort}`;
  };

  const handleActionChange = (taskId, actionType, dateVal = '') => {
    setActions(prev => ({
      ...prev,
      [taskId]: { type: actionType, date: dateVal }
    }));
  };

  const handleSubmit = () => {
    // Fill in defaults (default action is "cancel" or unmodified if not selected)
    const finalizedActions = {};
    incompleteTasks.forEach(task => {
      finalizedActions[task.id] = actions[task.id] || { type: 'today' };
    });
    onConfirm(finalizedActions);
  };

  return (
    <Modal isOpen={isOpen} onClose={() => {}} title="⚠️ Unfinished Tasks" showCloseButton={false}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '70vh', overflowY: 'auto', paddingRight: '4px' }}>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
          You have unfinished tasks from previous days. Please choose how to handle them:
        </p>

        {incompleteTasks.map(task => {
          const currentAction = actions[task.id] || { type: 'today' };
          const origDateFormatted = formatDate(task.scheduledDate);

          return (
            <Card key={task.id} style={{ padding: '14px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-tertiary)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', wordBreak: 'break-word' }}>
                    {task.title}
                  </p>
                  <p style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '2px' }}>
                    Scheduled: {task.scheduledDate} ({origDateFormatted})
                  </p>
                </div>
                <Badge color="#f85149">Incomplete</Badge>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
                <button
                  type="button"
                  onClick={() => handleActionChange(task.id, 'today')}
                  style={{
                    flex: 1, padding: '8px 6px', borderRadius: 'var(--radius-sm)', fontSize: '12px', fontWeight: 600, cursor: 'pointer',
                    border: `1px solid ${currentAction.type === 'today' ? 'var(--accent-green-400)' : 'var(--border-color)'}`,
                    backgroundColor: currentAction.type === 'today' ? 'rgba(46,160,67,0.12)' : 'var(--bg-primary)',
                    color: currentAction.type === 'today' ? 'var(--accent-green-400)' : 'var(--text-secondary)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  ⚡ Today
                </button>
                <button
                  type="button"
                  onClick={() => handleActionChange(task.id, 'reschedule', currentAction.date || '2026-08-12')}
                  style={{
                    flex: 1, padding: '8px 6px', borderRadius: 'var(--radius-sm)', fontSize: '12px', fontWeight: 600, cursor: 'pointer',
                    border: `1px solid ${currentAction.type === 'reschedule' ? 'var(--accent-green-400)' : 'var(--border-color)'}`,
                    backgroundColor: currentAction.type === 'reschedule' ? 'rgba(46,160,67,0.12)' : 'var(--bg-primary)',
                    color: currentAction.type === 'reschedule' ? 'var(--accent-green-400)' : 'var(--text-secondary)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  📅 Reschedule
                </button>
                <button
                  type="button"
                  onClick={() => handleActionChange(task.id, 'cancel')}
                  style={{
                    flex: 1, padding: '8px 6px', borderRadius: 'var(--radius-sm)', fontSize: '12px', fontWeight: 600, cursor: 'pointer',
                    border: `1px solid ${currentAction.type === 'cancel' ? 'var(--status-danger)' : 'var(--border-color)'}`,
                    backgroundColor: currentAction.type === 'cancel' ? 'rgba(248,81,73,0.12)' : 'var(--bg-primary)',
                    color: currentAction.type === 'cancel' ? 'var(--status-danger)' : 'var(--text-secondary)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  ❌ Cancel
                </button>
              </div>

              {/* Dynamic Sub-Form for Rescheduling */}
              {currentAction.type === 'reschedule' && (
                <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px dashed var(--border-color)' }}>
                  <label style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                    Select target date:
                  </label>
                  <CustomDatePicker
                    value={currentAction.date || '2026-08-12'}
                    onChange={(newDate) => handleActionChange(task.id, 'reschedule', newDate)}
                  />
                </div>
              )}

              {/* Summary Description text */}
              <div style={{ marginTop: '8px', fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 500 }}>
                {currentAction.type === 'today' && (
                  <span>Will create: <strong style={{ color: 'var(--accent-green-400)' }}>[RollOver]: {task.title} [{origDateFormatted}]</strong> for today.</span>
                )}
                {currentAction.type === 'reschedule' && (
                  <span>Will create: <strong style={{ color: 'var(--accent-green-400)' }}>[RollOver]: {task.title} [{origDateFormatted}]</strong> for {currentAction.date}.</span>
                )}
                {currentAction.type === 'cancel' && (
                  <span style={{ color: 'var(--status-danger)' }}>Original task will be marked as Cancelled.</span>
                )}
              </div>
            </Card>
          );
        })}

        <Button
          variant="primary"
          fullWidth
          icon={CheckCircle2}
          onClick={handleSubmit}
          style={{ padding: '12px', marginTop: '8px' }}
        >
          Confirm Actions
        </Button>
      </div>
    </Modal>
  );
}
