import React from 'react';

interface PillProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'neutral';
  icon?: React.ReactNode;
  className?: string;
}

export const Pill: React.FC<PillProps> = ({
  children,
  variant = 'neutral',
  icon,
  className = ''
}) => {
  return (
    <div className={`pill ${variant} ${className}`}>
      {icon && <span className="pill-icon">{icon}</span>}
      {children}
    </div>
  );
};
