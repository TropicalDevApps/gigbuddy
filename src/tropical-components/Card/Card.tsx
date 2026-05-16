import React from 'react';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated';
  className?: string;
  style?: React.CSSProperties;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  className = '',
  style
}) => {
  return (
    <div 
      className={`surface-card ${variant === 'elevated' ? 'elevated' : ''} ${className}`}
      style={style}
    >
      {children}
    </div>
  );
};
