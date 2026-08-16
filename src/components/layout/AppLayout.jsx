import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { BottomNav } from './BottomNav';

export function AppLayout({ children, activeTab, onSelectTab, onAddTaskClick }) {
  const { theme } = useTheme();

  return (
    <div
      data-theme={theme}
      style={{
        width: '100%',
        minHeight: '100vh',
        backgroundColor: 'var(--bg-primary)',
        color: 'var(--text-primary)',
        paddingBottom: '80px', // Space for bottom nav
        position: 'relative'
      }}
    >
      <main style={{ padding: '16px' }}>
        {children}
      </main>

      <BottomNav
        activeTab={activeTab}
        onSelectTab={onSelectTab}
        onAddTaskClick={onAddTaskClick}
      />
    </div>
  );
}
