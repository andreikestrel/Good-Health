"use client";

import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "destructive";
  full?: boolean;
};

export function Button({ variant = "primary", full, className = "", ...props }: ButtonProps) {
  const base = "rounded-full text-sm font-medium transition-colors h-12 px-5 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2";
  const color =
    variant === "primary"
      ? "bg-[#5B5FD9] text-white hover:bg-[#4F54D0] focus:ring-[#C7D2FE]"
      : variant === "secondary"
      ? "bg-white/90 text-[#1F2340] hover:bg-white border border-white/30 focus:ring-white/60"
      : variant === "destructive"
      ? "bg-[#EF4444] text-white hover:bg-[#DC2626] focus:ring-red-200"
      : "bg-transparent text-white hover:bg-white/10 border border-white/15 focus:ring-white/40";
  const width = full ? "w-full" : "";
  return <button className={`${base} ${color} ${width} ${className}`} {...props} />;
}


