import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const MONTHS_LONG = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];
const DAY_LETTERS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

function pad(n) { return String(n).padStart(2, '0'); }

export function CustomDatePicker({ value, onChange, minDate, maxDate }) {
  // Parse incoming value or default to current date
  const initialDate = value ? new Date(`${value}T00:00:00`) : new Date();
  const [currentYear, setCurrentYear] = useState(initialDate.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(initialDate.getMonth());

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(y => y - 1);
    } else {
      setCurrentMonth(m => m - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(y => y + 1);
    } else {
      setCurrentMonth(m => m + 1);
    }
  };

  const cells = [];
  for (let i = 0; i < firstDayOfWeek; i++) {
    cells.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(d);
  }

  const handleSelectDay = (day) => {
    const formatted = `${currentYear}-${pad(currentMonth + 1)}-${pad(day)}`;
    onChange(formatted);
  };

  return (
    <div
      style={{
        backgroundColor: 'var(--bg-primary)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-md)',
        padding: '12px',
        marginTop: '6px',
        boxShadow: 'var(--shadow-sm)'
      }}
    >
      {/* Month Navigation Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
        <button
          type="button"
          onClick={prevMonth}
          style={{
            background: 'var(--bg-tertiary)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <ChevronLeft size={16} />
        </button>

        <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
          {MONTHS_LONG[currentMonth]} {currentYear}
        </span>

        <button
          type="button"
          onClick={nextMonth}
          style={{
            background: 'var(--bg-tertiary)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Weekday Headers */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px', marginBottom: '4px' }}>
        {DAY_LETTERS.map((d, idx) => (
          <div
            key={idx}
            style={{
              textAlign: 'center',
              fontSize: '10px',
              color: 'var(--text-tertiary)',
              fontWeight: 700,
              padding: '2px 0'
            }}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Day Cells */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '3px' }}>
        {cells.map((day, idx) => {
          if (!day) return <div key={`empty-${idx}`} />;

          const dateStr = `${currentYear}-${pad(currentMonth + 1)}-${pad(day)}`;
          const isSelected = value === dateStr;
          const isToday = dateStr === (() => {
            const d = new Date();
            return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
          })();

          return (
            <button
              key={dateStr}
              type="button"
              onClick={() => handleSelectDay(day)}
              style={{
                aspectRatio: '1',
                borderRadius: '6px',
                border: isSelected
                  ? '2px solid var(--accent-green-400)'
                  : isToday
                  ? '1px solid var(--accent-green-500)'
                  : '1px solid transparent',
                backgroundColor: isSelected
                  ? 'var(--accent-green-500)'
                  : isToday
                  ? 'rgba(46,160,67,0.15)'
                  : 'var(--bg-tertiary)',
                color: isSelected
                  ? '#ffffff'
                  : isToday
                  ? 'var(--accent-green-400)'
                  : 'var(--text-primary)',
                fontWeight: isSelected || isToday ? 700 : 500,
                fontSize: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.1s ease'
              }}
            >
              {day}
            </button>
          );
        })}
      </div>

      {/* Selected Indicator Footer */}
      {value && (
        <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid var(--border-muted)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Selected Date:</span>
          <span style={{ fontSize: '12px', color: 'var(--accent-green-400)', fontWeight: 600 }}>{value}</span>
        </div>
      )}
    </div>
  );
}
