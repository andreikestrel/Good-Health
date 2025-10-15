"use client";

import React from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
};

export function Input({ label, className = "", ...props }: InputProps) {
  return (
    <label className="grid gap-2 text-sm w-full">
      {label && <span>{label}</span>}
      <input
        className={`h-11 rounded-[10px] bg-white/80 px-4 text-black placeholder:text-black/50 outline-none focus:ring-2 focus:ring-[#898AC4] ${className}`}
        {...props}
      />
    </label>
  );
}


