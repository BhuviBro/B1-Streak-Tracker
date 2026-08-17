import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getContribLevel, getCellColor, buildActivityMap } from '../../utils/calendarUtils';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const DAYS = ['S','M','T','W','T','F','S'];

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay();
}

function pad(n) { return String(n).padStart(2, '0'); }

export function GitHubCalendar({ view = 'monthly', currentDate = new Date(), routines, tasks }) {
  const activityMap = buildActivityMap(routines, tasks);
  const [offset, setOffset] = useState(0);


  if (view === 'monthly') {
    const d = new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1);
    const year = d.getFullYear();
    const month = d.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);

    const cells = [];
    for (let i = 0; i < firstDay; i++) cells.push(null);
    for (let day = 1; day <= daysInMonth; day++) cells.push(day);

    return (
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
          <button onClick={() => setOffset(o => o - 1)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
            <ChevronLeft size={16} />
          </button>
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
            {MONTHS[month]} {year}
          </span>
          <button onClick={() => setOffset(o => o + 1)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Day headers */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '3px', marginBottom: '4px' }}>
          {['S','M','T','W','T','F','S'].map((d, i) => (
            <div key={i} style={{ textAlign: 'center', fontSize: '10px', color: 'var(--text-tertiary)', fontWeight: 600 }}>{d}</div>
          ))}
        </div>

        {/* Date cells */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '3px' }}>
          {cells.map((day, i) => {
            if (!day) return <div key={`empty-${i}`} />;
            const dateStr = `${year}-${pad(month + 1)}-${pad(day)}`;
            const activity = activityMap[dateStr];
            const level = activity ? getContribLevel(activity.required, activity.completed) : 'neutral';
            const isToday = dateStr === (() => {
              const d = new Date();
              return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
            })();

            return (
              <div
                key={dateStr}
                title={`${dateStr}: ${activity ? `${activity.completed}/${activity.required}` : 'No activity'}`}
                style={{
                  aspectRatio: '1',
                  borderRadius: '3px',
                  backgroundColor: getCellColor(level),
                  border: isToday ? '2px solid var(--accent-green-400)' : '1px solid transparent',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '10px',
                  color: level > 2 ? '#fff' : 'var(--text-tertiary)',
                  fontWeight: isToday ? 700 : 400,
                  transition: 'transform 0.1s ease'
                }}
              >
                {day}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px', marginTop: '8px' }}>
          <span style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>Less</span>
          {[0,1,2,3,4,5].map(l => (
            <div key={l} style={{ width: '10px', height: '10px', borderRadius: '2px', backgroundColor: l === 0 ? 'var(--contrib-neutral)' : `var(--contrib-level-${l})` }} />
          ))}
          <span style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>More</span>
        </div>
      </div>
    );
  }

  if (view === 'weekly') {
    const base = new Date(currentDate);
    base.setDate(base.getDate() - base.getDay() + offset * 7);
    const week = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(base);
      d.setDate(d.getDate() + i);
      return d;
    });

    return (
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
          <button onClick={() => setOffset(o => o - 1)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}><ChevronLeft size={16} /></button>
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
            {MONTHS[week[0].getMonth()]} {week[0].getDate()} – {MONTHS[week[6].getMonth()]} {week[6].getDate()}, {week[0].getFullYear()}
          </span>
          <button onClick={() => setOffset(o => o + 1)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}><ChevronRight size={16} /></button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px' }}>
          {week.map((d) => {
            const dateStr = `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
            const activity = activityMap[dateStr];
            const level = activity ? getContribLevel(activity.required, activity.completed) : 'neutral';
            const isToday = dateStr === (() => {
              const d = new Date();
              return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
            })();
            return (
              <div key={dateStr} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                <span style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>
                  {['Su','Mo','Tu','We','Th','Fr','Sa'][d.getDay()]}
                </span>
                <div
                  title={dateStr}
                  style={{
                    width: '36px', height: '36px', borderRadius: '6px',
                    backgroundColor: getCellColor(level),
                    border: isToday ? '2px solid var(--accent-green-400)' : '1px solid transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '12px', fontWeight: isToday ? 700 : 500,
                    color: level > 2 ? '#fff' : 'var(--text-secondary)',
                    cursor: 'pointer'
                  }}
                >
                  {d.getDate()}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Yearly view
  const year = currentDate.getFullYear() + offset;
  const monthBlocks = Array.from({ length: 12 }, (_, m) => {
    const days = getDaysInMonth(year, m);
    const firstDay = getFirstDayOfMonth(year, m);
    const cells = [];
    for (let i = 0; i < firstDay; i++) cells.push(null);
    for (let day = 1; day <= days; day++) cells.push(day);
    return { month: m, cells };
  });

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <button onClick={() => setOffset(o => o - 1)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}><ChevronLeft size={16} /></button>
        <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{year}</span>
        <button onClick={() => setOffset(o => o + 1)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}><ChevronRight size={16} /></button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
        {monthBlocks.map(({ month, cells }) => (
          <div key={month}>
            <div style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px', textAlign: 'center' }}>{MONTHS[month]}</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px' }}>
              {cells.map((day, i) => {
                if (!day) return <div key={`e${i}`} style={{ width: '8px', height: '8px' }} />;
                const dateStr = `${year}-${pad(month+1)}-${pad(day)}`;
                const activity = activityMap[dateStr];
                const level = activity ? getContribLevel(activity.required, activity.completed) : 'neutral';
                return (
                  <div key={dateStr} title={dateStr}
                    style={{ width: '8px', height: '8px', borderRadius: '1px', backgroundColor: getCellColor(level), cursor: 'pointer' }}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
