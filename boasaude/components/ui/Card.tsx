import React from "react";

export function Card({ children }: { children: React.ReactNode }) {
  return <div className="rounded-2xl bg-[#C0C9EE] p-4">{children}</div>;
}


