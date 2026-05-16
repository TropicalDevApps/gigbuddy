import React from "react";
import { cn } from "../../lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "brand" | "blue" | "gray" | "danger" | "ghost";
  size?: "xs" | "sm";
  className?: string;
}

export const Badge = ({
  children,
  variant = "gray",
  size = "xs",
  className,
}: BadgeProps) => {
  const variants: Record<string, string> = {
    brand: "primary",
    blue: "success", // mapped blue to success for now, or info if available
    gray: "secondary",
    danger: "danger",
    ghost: "",
  };

  return (
    <span className={cn("tag", variants[variant], className)}>{children}</span>
  );
};
