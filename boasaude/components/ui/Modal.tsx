"use client";

import React from "react";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export function Modal({ open, onClose, children }: ModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-6" onClick={onClose}>
      <div className="w-full max-w-sm rounded-2xl bg-[#C0C9EE] p-6" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}


