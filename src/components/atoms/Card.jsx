import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Card = forwardRef(({ 
  children, 
  variant = "default",
  hover = false,
  className = "",
  ...props 
}, ref) => {
  const baseClasses = "bg-white rounded-xl border border-gray-100 shadow-card transition-all duration-200";
  
  const variants = {
    default: "",
    gradient: "bg-gradient-to-br from-white to-gray-50",
    surface: "bg-surface border-gray-200",
  };
  
  const hoverClasses = hover ? "hover:shadow-card-hover hover:scale-[1.01] cursor-pointer" : "";

  return (
    <div
      ref={ref}
      className={cn(
        baseClasses,
        variants[variant],
        hoverClasses,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = "Card";

export default Card;