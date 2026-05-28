import React from 'react';

interface TagProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning';
  className?: string;
}

export const Tag: React.FC<TagProps> = ({
  children,
  variant = 'primary',
  className = ''
}) => {
  return (
    <span className={`tag ${variant} ${className}`}>
      {children}
    </span>
  );
};
