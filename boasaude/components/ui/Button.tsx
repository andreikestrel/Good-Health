"use client";

import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
  full?: boolean;
};

export function Button({ variant = "primary", full, className = "", ...props }: ButtonProps) {
  const base = "rounded-full text-sm font-medium transition-colors h-12 px-5 disabled:opacity-60 disabled:cursor-not-allowed";
  const color =
    variant === "primary"
      ? "bg-foreground text-background hover:opacity-90"
      : variant === "secondary"
      ? "border border-black/10 dark:border-white/20 bg-transparent text-foreground hover:bg-white/20"
      : "bg-transparent text-foreground hover:bg-white/10";
  const width = full ? "w-full" : "";
  return <button className={`${base} ${color} ${width} ${className}`} {...props} />;
}


