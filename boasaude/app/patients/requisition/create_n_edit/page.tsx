"use client";

import React, { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { getRequisition, listPatients, saveRequisition } from "@/lib/data/store";
import { Autocomplete } from "@/components/ui/Autocomplete";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function RequisitionFormPage() {
  const router = useRouter();
  const params = useSearchParams();
  const { isAuthenticated } = useAuth();
  const id = params.get("id") || undefined;
  const patientIdParam = params.get("patientId") || "";
  const existing = useMemo(() => (id ? getRequisition(id) : undefined), [id]);
  const patients = useMemo(() => listPatients(), []);

  const [patientId, setPatientId] = useState(existing?.patientId || patientIdParam || (patients[0]?.id || ""));
  const [title, setTitle] = useState(existing?.title || "");
  const [notes, setNotes] = useState(existing?.notes || "");

  if (!isAuthenticated) {
    router.replace("/login");
    return null;
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    saveRequisition({ id, patientId, title, notes });
    router.replace(`/patients/requisition${patientId ? `?patientId=${patientId}` : ""}`);
  }

  return (
    <div className="min-h-screen grid place-items-center p-6">
      <div className="w-full max-w-md rounded-3xl bg-[#C0C9EE] p-6 grid gap-3">
        <h1 className="text-lg">{id ? "Editar requisição" : "Nova requisição"}</h1>
        <form onSubmit={onSubmit} className="grid gap-3">
          <Autocomplete label="Paciente" options={patients.map((p) => ({ value: p.id, label: p.name }))} value={patientId} onChange={setPatientId} />
          <Input label="Titulo" placeholder="Nome da requisição" value={title} onChange={(e) => setTitle(e.target.value)} />
          <label className="grid gap-2 text-sm">
            <span>Observações</span>
            <textarea className="min-h-[100px] rounded-[10px] bg-white/80 px-3 py-2 text-black" placeholder="Observações da requisição" value={notes} onChange={(e) => setNotes(e.target.value)} />
          </label>
          <Button type="submit" full>Salvar</Button>
        </form>
        <button className="text-sm opacity-80" onClick={() => router.back()}>Voltar</button>
      </div>
    </div>
  );
}

