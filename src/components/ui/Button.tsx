import React from "react";
import { motion, HTMLMotionProps } from "motion/react";
import { cn } from "../../lib/utils";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "outline"
  | "danger"
  | "brand-ghost";
type ButtonSize = "xs" | "sm" | "md" | "lg" | "icon" | "full";

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children?: React.ReactNode;
  icon?: React.ReactNode;
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      children,
      icon,
      isLoading,
      disabled,
      ...props
    },
    ref,
  ) => {
    // Map gigbuddy variants to Tropical UI classes
    const variantMap: Record<string, string> = {
      primary: "primary",
      secondary: "secondary",
      ghost: "ghost",
      "brand-ghost": "ghost",
      outline: "secondary",
      danger: "danger",
    };

    const sizeMap: Record<string, string> = {
      xs: "sm",
      sm: "sm",
      md: "",
      lg: "lg",
      icon: "icon-only",
      full: "lg w-full",
    };

    const baseClass = "btn";
    const variantClass = variantMap[variant] || "primary";
    const sizeClass = sizeMap[size] || "";

    return (
      <motion.button
        ref={ref}
        disabled={disabled || isLoading}
        whileTap={{ scale: 0.98 }}
        className={cn(baseClass, variantClass, sizeClass, className)}
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
      </motion.button>
    );
  },
);

Button.displayName = "Button";
