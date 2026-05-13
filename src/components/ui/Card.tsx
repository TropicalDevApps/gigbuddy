import React from 'react';
import { cn } from '../../lib/utils';
import { motion, HTMLMotionProps } from 'motion/react';

interface CardProps extends HTMLMotionProps<'div'> {
  variant?: 'glass' | 'solid' | 'outline' | 'ghost';
  children: React.ReactNode;
}

export const Card = ({ className, variant = 'glass', children, ...props }: CardProps) => {
  const variants = {
    glass: 'bg-bg-side/40 backdrop-blur-md border border-white/5 shadow-xl',
    solid: 'bg-bg-side border border-border-main',
    outline: 'border border-border-main hover:border-brand/30 transition-colors',
    ghost: 'hover:bg-white/5 transition-colors',
  };

  return (
    <motion.div
      className={cn(
        'rounded-3xl p-4 sm:p-6 lg:p-8',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
};
