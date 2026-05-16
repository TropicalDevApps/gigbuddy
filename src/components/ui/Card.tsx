import React from "react";
import { cn } from "../../lib/utils";
import { motion, HTMLMotionProps } from "motion/react";

interface CardProps extends HTMLMotionProps<"div"> {
  variant?: "glass" | "solid" | "outline" | "ghost";
  children: React.ReactNode;
}

export const Card = ({
  className,
  variant = "glass",
  children,
  ...props
}: CardProps) => {
  const variants = {
    glass: "surface-card elevated",
    solid: "surface-card",
    outline: "surface-card",
    ghost: "",
  };

  return (
    <motion.div
      className={cn(
        variants[variant],
        "p-fluid-md lg:p-fluid-lg", // Responsive breathable padding
        className,
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
};
