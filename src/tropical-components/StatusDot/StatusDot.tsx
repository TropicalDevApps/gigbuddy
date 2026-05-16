import React from 'react';

interface StatusDotProps {
  status?: 'on' | 'warn' | 'err' | 'off';
  on?: boolean;
  variant?: 'on' | 'warning' | 'danger' | 'off' | 'success';
  className?: string;
}

export const StatusDot: React.FC<StatusDotProps> = ({
  status,
  on,
  variant,
  className = ''
}) => {
  let finalStatus = status || 'off';
  
  if (on) finalStatus = 'on';
  if (variant) {
    if (variant === 'success' || variant === 'on') finalStatus = 'on';
    if (variant === 'warning') finalStatus = 'warn';
    if (variant === 'danger') finalStatus = 'err';
    if (variant === 'off') finalStatus = 'off';
  }

  return (
    <div className={`sdot ${finalStatus} ${className}`} />
  );
};
