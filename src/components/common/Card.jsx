import React from 'react';

export function Card({ children, className = '', style = {}, onClick, hoverable = false }) {
  return (
    <div
      onClick={onClick}
      style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-md)',
        padding: '16px',
        transition: 'all 0.2s ease',
        cursor: onClick || hoverable ? 'pointer' : 'default',
        boxShadow: 'var(--shadow-sm)',
        ...style
      }}
      className={`card ${hoverable ? 'card-hover' : ''} ${className}`}
    >
      {children}
    </div>
  );
}
