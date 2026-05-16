import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  hint?: React.ReactNode;
  error?: boolean;
  status?: string;
}

export const Input: React.FC<InputProps> = ({
  leftIcon,
  rightIcon,
  hint,
  error,
  status,
  className = '',
  ...props
}) => {
  return (
    <div className={`gd-input-wrap ${error || status === 'invalid' ? 'error' : ''} ${className}`}>
      {leftIcon}
      <input {...props} />
      {rightIcon}
      {status === 'invalid' && <span style={{ fontSize: '10px', color: 'var(--ui-danger)', fontFamily: 'var(--ui-font-mono)', marginLeft: '8px' }}>invalid</span>}
      {hint && <div className="input-hint">{hint}</div>}
    </div>
  );
};
