"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { getAppointment, listPatients, saveAppointment } from "@/lib/data/store";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Autocomplete } from "@/components/ui/Autocomplete";

export default function AppointmentFormPage() {
  const router = useRouter();
  const params = useSearchParams();
  const { isAuthenticated } = useAuth();
  const id = params.get("id") || undefined;
  const patientIdParam = params.get("patientId") || "";
  const existing = useMemo(() => (id ? getAppointment(id) : undefined), [id]);
  const patients = useMemo(() => listPatients(), []);

  const [patientId, setPatientId] = useState(existing?.patientId || patientIdParam || (patients[0]?.id || ""));
  const [datetime, setDatetime] = useState(existing?.datetime || new Date().toISOString().slice(0, 16));
  const [professionalName, setProfessionalName] = useState(existing?.professionalName || "");
  useEffect(() => {
    // default professional to logged-in user's name if blank
    if (!existing && !professionalName) {
      const name = (typeof window !== 'undefined') ? (JSON.parse(window.localStorage.getItem('boasaude.auth.user') || 'null')?.name || '') : '';
      if (name) setProfessionalName(name);
    }
  }, [existing, professionalName]);
  const [notes, setNotes] = useState(existing?.notes || "");
  const [video, setVideo] = useState<boolean>(existing?.video || false);

  useEffect(() => {
    if (!isAuthenticated) router.replace("/login");
  }, [isAuthenticated, router]);
  if (!isAuthenticated) return null;

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const iso = datetime.length === 16 ? new Date(datetime).toISOString() : datetime;
    const saved = saveAppointment({ id, patientId, datetime: iso, professionalName, notes, video });
    router.replace("/appoiments");
  }

  return (
    <div className="min-h-screen grid place-items-center p-6">
      <div className="w-full max-w-md rounded-3xl bg-[#C0C9EE] p-6 grid gap-3">
        <h1 className="text-lg">{id ? "Editar agendamento" : "Novo agendamento"}</h1>
        <form onSubmit={onSubmit} className="grid gap-3">
          <Autocomplete
            label="Paciente"
            options={patients.map((p) => ({ value: p.id, label: p.name }))}
            value={patientId}
            onChange={setPatientId}
            placeholder="Buscar paciente"
          />
          <Input label="Data e hora" type="datetime-local" value={datetime.slice(0, 16)} onChange={(e) => setDatetime(e.target.value)} />
          <Input label="Profissional" placeholder="Seu nome" value={professionalName || (typeof window !== 'undefined' ? '' : '')} onChange={(e) => setProfessionalName(e.target.value)} />
          <label className="grid gap-2 text-sm">
            <span>Observações</span>
            <textarea className="min-h-[100px] rounded-[10px] bg-white/80 px-3 py-2 text-black" placeholder="Observações do atendimento" value={notes} onChange={(e) => setNotes(e.target.value)} />
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={video} onChange={(e) => setVideo(e.target.checked)} /> Video consulta?
          </label>
          <Button type="submit" full>Salvar</Button>
        </form>
        <button className="text-sm opacity-80" onClick={() => router.back()}>Voltar</button>
      </div>
    </div>
  );
}

