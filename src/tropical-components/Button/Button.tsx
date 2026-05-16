import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  iconOnly?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'ghost',
  size = 'md',
  iconOnly = false,
  leftIcon,
  rightIcon,
  className = '',
  onClick,
  ...props
}) => {
  const classes = [
    'btn',
    variant,
    size !== 'md' ? size : '',
    iconOnly ? 'icon-only' : '',
    className
  ].filter(Boolean).join(' ');

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    console.log('Button clicked:', variant);
    if (onClick) onClick(e);
  };

  return (
    <button className={classes} onClick={handleClick} {...props}>
      {leftIcon && <span className="btn-icon-left">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="btn-icon-right">{rightIcon}</span>}
    </button>
  );
};
