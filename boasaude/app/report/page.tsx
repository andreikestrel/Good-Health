"use client";

import React, { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { ensureSeed, listAppointments, listPatients, listRecipes, listRequisitions } from "@/lib/data/store";

type Preset = "diario" | "semanal" | "mensal" | "periodo";

function startOfDay(d: Date) { const x = new Date(d); x.setHours(0,0,0,0); return x; }
function endOfDay(d: Date) { const x = new Date(d); x.setHours(23,59,59,999); return x; }

function getRange(preset: Preset, custom?: { from?: string; to?: string }) {
  const now = new Date();
  if (preset === "diario") {
    return { from: startOfDay(now), to: endOfDay(now) };
  }
  if (preset === "semanal") {
    const day = now.getDay(); // 0 Sun
    const diff = (day === 0 ? -6 : 1) - day; // start Monday
    const monday = new Date(now); monday.setDate(now.getDate() + diff);
    const sunday = new Date(monday); sunday.setDate(monday.getDate() + 6);
    return { from: startOfDay(monday), to: endOfDay(sunday) };
  }
  if (preset === "mensal") {
    const first = new Date(now.getFullYear(), now.getMonth(), 1);
    const last = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return { from: startOfDay(first), to: endOfDay(last) };
  }
  const from = custom?.from ? startOfDay(new Date(custom.from)) : startOfDay(now);
  const to = custom?.to ? endOfDay(new Date(custom.to)) : endOfDay(now);
  return { from, to };
}

function fmt(d: Date) {
  return d.toLocaleDateString("pt-BR");
}

export default function ReportPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [preset, setPreset] = useState<Preset>("diario");
  const [custom, setCustom] = useState<{ from?: string; to?: string }>({});
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  React.useEffect(() => { ensureSeed(); }, []);
  React.useEffect(() => { if (!isAuthenticated) router.replace("/login"); }, [isAuthenticated, router]);
  if (!isAuthenticated) return null;

  const range = useMemo(() => getRange(preset, custom), [preset, custom]);

  const appointments = useMemo(() => listAppointments().filter(a => {
    const t = new Date(a.datetime).getTime();
    return t >= range.from.getTime() && t <= range.to.getTime();
  }), [range]);
  const recipes = useMemo(() => listRecipes().filter(r => {
    const t = new Date(r.createdAt).getTime();
    return t >= range.from.getTime() && t <= range.to.getTime();
  }), [range]);
  const requisitions = useMemo(() => listRequisitions().filter(r => {
    const t = new Date(r.createdAt).getTime();
    return t >= range.from.getTime() && t <= range.to.getTime();
  }), [range]);
  const newPatients = useMemo(() => listPatients().filter(p => {
    const t = new Date(p.createdAt).getTime();
    return t >= range.from.getTime() && t <= range.to.getTime();
  }), [range]);
  const professionalsCount = useMemo(() => {
    const set = new Set<string>();
    appointments.forEach(a => { if (a.professionalName) set.add(a.professionalName); });
    return set.size;
  }, [appointments]);

  function printReport() {
    const node = containerRef.current;
    if (!node) return;
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(`<html><head><title>Relatório</title><style>
      body { font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial; background: #EFF1FB; }
      .card { background: #C0C9EE; border-radius: 16px; padding: 16px; }
      button, .print-hidden, .no-print { display: none !important; }
      input, select, textarea { display: none !important; }
    </style></head><body>${node.innerHTML}</body></html>`);
    win.document.close();
    win.focus();
    win.print();
    win.close();
  }

  return (
    <div className="min-h-screen p-4 container-responsive">
      <div className="mx-auto max-w-2xl grid gap-4">
        <div className="rounded-2xl bg-[#898AC4] p-4 text-white flex items-center justify-between">
          <div>Relatório</div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => router.back()}>Voltar</Button>
          </div>
        </div>

        <div className="flex gap-3 flex-wrap">
          <Button variant={preset === "diario" ? "primary" : "secondary"} onClick={() => setPreset("diario")}>Diario</Button>
          <Button variant={preset === "semanal" ? "primary" : "secondary"} onClick={() => setPreset("semanal")}>Semanal</Button>
          <Button variant={preset === "mensal" ? "primary" : "secondary"} onClick={() => setPreset("mensal")}>Mensal</Button>
          <Button variant={preset === "periodo" ? "primary" : "secondary"} onClick={() => { setPreset("periodo"); setOpen(true); }}>Periodo</Button>
        </div>

        <div ref={containerRef} className="card text-center">
          <div className="text-center text-black/80 text-sm mb-4">
            {preset === "diario" ? (
              <>{fmt(range.from)}</>
            ) : (
              <>({fmt(range.from)} - {fmt(range.to)})</>
            )}
          </div>
          <div className="grid gap-2 text-black">
            <div>Atendimentos: {appointments.length}</div>
            <div>Atendimentos por vídeo: 0</div>
            <div>Requisições: {requisitions.length}</div>
            <div>Receitas: {recipes.length}</div>
            <div>Profissionais: {professionalsCount}</div>
            <div>Novos pacientes: {newPatients.length}</div>
          </div>
          <div className="mt-6 print:hidden">
            <Button onClick={printReport}>Imprimir</Button>
          </div>
        </div>

        <Modal open={open} onClose={() => setOpen(false)}>
          <div className="grid gap-3">
            <label className="grid gap-2 text-sm">
              <span>Data inicial</span>
              <input type="date" className="h-11 rounded-[10px] bg-white/90 px-3 text-black" value={custom.from || ""} onChange={(e) => setCustom((c) => ({ ...c, from: e.target.value }))} />
            </label>
            <label className="grid gap-2 text-sm">
              <span>Data final</span>
              <input type="date" className="h-11 rounded-[10px] bg-white/90 px-3 text-black" value={custom.to || ""} onChange={(e) => setCustom((c) => ({ ...c, to: e.target.value }))} />
            </label>
            <Button onClick={() => setOpen(false)}>OK</Button>
          </div>
        </Modal>
      </div>
    </div>
  );
}

