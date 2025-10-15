"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { getAppointment, listPatients, saveAppointment } from "@/lib/data/store";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

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
  const [notes, setNotes] = useState(existing?.notes || "");

  useEffect(() => {
    if (!isAuthenticated) router.replace("/login");
  }, [isAuthenticated, router]);
  if (!isAuthenticated) return null;

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const iso = datetime.length === 16 ? new Date(datetime).toISOString() : datetime;
    const saved = saveAppointment({ id, patientId, datetime: iso, professionalName, notes });
    router.replace("/appoiments");
  }

  return (
    <div className="min-h-screen grid place-items-center p-6">
      <div className="w-full max-w-md rounded-3xl bg-[#C0C9EE] p-6 grid gap-3">
        <h1 className="text-lg">{id ? "Editar agendamento" : "Novo agendamento"}</h1>
        <form onSubmit={onSubmit} className="grid gap-3">
          <label className="grid gap-2 text-sm">
            <span>Paciente</span>
            <select className="h-11 rounded-[10px] bg-white/80 px-3 text-black" value={patientId} onChange={(e) => setPatientId(e.target.value)}>
              {patients.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </label>
          <Input label="Data e hora" type="datetime-local" value={datetime.slice(0, 16)} onChange={(e) => setDatetime(e.target.value)} />
          <Input label="Profissional" value={professionalName} onChange={(e) => setProfessionalName(e.target.value)} />
          <label className="grid gap-2 text-sm">
            <span>Observações</span>
            <textarea className="min-h-[100px] rounded-[10px] bg-white/80 px-3 py-2 text-black" value={notes} onChange={(e) => setNotes(e.target.value)} />
          </label>
          <Button type="submit" full>Salvar</Button>
        </form>
        <button className="text-sm opacity-80" onClick={() => router.back()}>Voltar</button>
      </div>
    </div>
  );
}

