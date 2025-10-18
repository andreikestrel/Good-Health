"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

type Option = { value: string; label: string };

type AutocompleteProps = {
  label?: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export function Autocomplete({ label, options, value, onChange, placeholder }: AutocompleteProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  const selectedLabel = useMemo(() => options.find((o) => o.value === value)?.label || "", [options, value]);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options.slice(0, 20);
    return options.filter((o) => o.label.toLowerCase().includes(q)).slice(0, 20);
  }, [options, query]);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  return (
    <div className="grid gap-2 text-sm" ref={ref}>
      {label && <span>{label}</span>}
      <div className="relative">
        <input
          className="h-11 w-full rounded-[10px] bg-white/80 px-4 text-black placeholder:text-black/50 outline-none focus:ring-2 focus:ring-[#898AC4]"
          value={open ? query : selectedLabel}
          onFocus={() => { setOpen(true); setQuery(""); }}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
        />
        {open && (
          <div className="absolute z-10 mt-1 w-full rounded-lg bg-white shadow text-black max-h-56 overflow-auto">
            {filtered.map((o) => (
              <div key={o.value} className="px-3 py-2 hover:bg-black/5 cursor-pointer" onClick={() => { onChange(o.value); setOpen(false); }}>
                {o.label}
              </div>
            ))}
            {filtered.length === 0 && <div className="px-3 py-2 text-black/60">Sem resultados</div>}
          </div>
        )}
      </div>
    </div>
  );
}


