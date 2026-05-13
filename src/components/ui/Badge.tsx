import React from 'react';
import { cn } from '../../lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'brand' | 'blue' | 'gray' | 'danger' | 'ghost';
  size?: 'xs' | 'sm';
  className?: string;
}

export const Badge = ({ children, variant = 'gray', size = 'xs', className }: BadgeProps) => {
  const variants = {
    brand: 'bg-brand/10 text-brand border border-brand/20',
    blue: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
    gray: 'bg-white/5 text-text-dim border border-white/10',
    danger: 'bg-red-500/10 text-red-400 border border-red-500/20',
    ghost: 'bg-transparent text-text-dim border border-white/5',
  };

  const sizes = {
    xs: 'px-1.5 py-0.5 text-[8px] uppercase tracking-widest font-bold',
    sm: 'px-2 py-1 text-[10px] uppercase tracking-wider font-bold',
  };

  return (
    <span className={cn(
      'inline-flex items-center rounded-md font-mono transition-all',
      variants[variant],
      sizes[size],
      className
    )}>
      {children}
    </span>
  );
};
