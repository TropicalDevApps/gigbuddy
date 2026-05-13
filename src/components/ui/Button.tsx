import React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';
import { cn } from '../../lib/utils';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger' | 'brand-ghost';
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'icon' | 'full';

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children?: React.ReactNode;
  icon?: React.ReactNode;
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, icon, isLoading, disabled, ...props }, ref) => {
    const variants = {
      primary: 'bg-brand text-black hover:shadow-[0_0_25px_rgba(255,69,0,0.4)] active:scale-95 border-b-4 border-black/20 hover:border-black/10',
      secondary: 'bg-white/5 border border-white/10 text-text-bright hover:bg-white/10 active:scale-95 hover:border-white/20',
      ghost: 'bg-transparent text-text-dim hover:text-text-bright hover:bg-white/5 active:scale-95',
      brand_ghost: 'bg-brand/5 border border-brand/20 text-brand hover:bg-brand/15 active:scale-95',
      brandGhost: 'bg-brand/5 border border-brand/20 text-brand hover:bg-brand/15 active:scale-95', // Alias
      outline: 'border border-bg-card/50 text-text-bright hover:border-brand/40 transition-colors bg-black/20 backdrop-blur-sm',
      danger: 'bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500/20 active:scale-95',
    };

    const sizes = {
      xs: 'px-2 py-1 text-[9px] uppercase font-bold tracking-wider rounded',
      sm: 'px-3 py-1.5 text-[10px] uppercase font-bold tracking-widest rounded-lg',
      md: 'px-6 py-2.5 text-xs uppercase font-bold tracking-widest rounded-xl',
      lg: 'px-8 py-4 text-sm uppercase font-bold tracking-widest rounded-2xl',
      icon: 'p-2 rounded-full',
      full: 'w-full py-4 text-sm uppercase font-bold tracking-widest rounded-2xl',
    };

    const variantStyles = (variant === 'brand-ghost' ? variants.brandGhost : variants[variant as keyof typeof variants]) || variants.primary;

    return (
      <motion.button
        ref={ref}
        disabled={disabled || isLoading}
        whileHover={{ y: -1 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          'relative flex items-center justify-center gap-2 font-mono transition-all disabled:opacity-50 disabled:pointer-events-none overflow-hidden group',
          variantStyles,
          sizes[size],
          className
        )}
        {...props}
      >
        {isLoading ? (
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : (
          <>
            {icon && <span className="flex-shrink-0">{icon}</span>}
            {children}
          </>
        )}
        {/* Subtle shine effect on hover for primary buttons */}
        {variant === 'primary' && (
          <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 pointer-events-none" />
        )}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';
