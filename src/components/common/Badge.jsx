import React from 'react';

export function Badge({ children, color, variant = 'subtle', icon: Icon, style = {} }) {
  const getBadgeStyle = () => {
    if (variant === 'routine') {
      return {
        backgroundColor: 'rgba(163, 113, 247, 0.15)',
        color: 'var(--status-routine)',
        border: '1px solid rgba(163, 113, 247, 0.4)',
      };
    }

    if (color) {
      return {
        backgroundColor: `${color}20`,
        color: color,
        border: `1px solid ${color}40`,
      };
    }

    return {
      backgroundColor: 'var(--bg-tertiary)',
      color: 'var(--text-secondary)',
      border: '1px solid var(--border-color)',
    };
  };

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        fontSize: '11px',
        fontWeight: 600,
        padding: '2px 8px',
        borderRadius: 'var(--radius-full)',
        textTransform: 'uppercase',
        letterSpacing: '0.3px',
        ...getBadgeStyle(),
        ...style
      }}
    >
      {Icon && <Icon size={12} />}
      {children}
    </span>
  );
}
