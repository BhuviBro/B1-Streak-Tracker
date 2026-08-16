import React from 'react';
import { Home, Flame, Plus, Calendar, Settings } from 'lucide-react';

export function BottomNav({ activeTab, onSelectTab, onAddTaskClick }) {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'routines', label: 'Routines', icon: Flame },
    { id: 'add', label: '', icon: Plus, isAction: true },
    { id: 'history', label: 'History', icon: Calendar },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav
      id="bottom-nav"
      style={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: '480px',
        height: '64px',
        backgroundColor: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'stretch',
        justifyContent: 'space-between',
        zIndex: 900,
        padding: '0 4px'
      }}
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;

        if (item.isAction) {
          return (
            <div
              key={item.id}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <button
                id="btn-add-task-global"
                onClick={onAddTaskClick}
                title="Add Task"
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'var(--accent-green-500)',
                  color: '#ffffff',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(35, 134, 54, 0.4)',
                  transform: 'translateY(-6px)',
                  transition: 'transform 0.15s ease, background-color 0.15s ease'
                }}
              >
                <Plus size={24} strokeWidth={2.5} />
              </button>
            </div>
          );
        }

        return (
          <button
            key={item.id}
            id={`nav-tab-${item.id}`}
            onClick={() => onSelectTab(item.id)}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '3px',
              background: 'none',
              border: 'none',
              color: isActive ? 'var(--accent-green-400)' : 'var(--text-secondary)',
              cursor: 'pointer',
              fontSize: '11px',
              fontWeight: isActive ? 700 : 400,
              padding: '6px 4px',
              borderRadius: 'var(--radius-sm)',
              transition: 'all 0.15s ease'
            }}
          >
            <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>

  );
}
