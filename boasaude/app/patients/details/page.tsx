"use client";

import React, { useEffect, useMemo } from "react";
// dynamic title handled client-side since this is a client component
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { getPatient, listAppointmentsByPatient } from "@/lib/data/store";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function PatientDetailsPage() {
  const router = useRouter();
  const params = useSearchParams();
  const { isAuthenticated } = useAuth();
  const id = params.get("id") || "";
  const patient = useMemo(() => (id ? getPatient(id) : undefined), [id]);
  const appts = useMemo(() => (id ? listAppointmentsByPatient(id) : []), [id]);

  useEffect(() => {
    if (!isAuthenticated) router.replace("/login");
  }, [isAuthenticated, router]);
  if (!isAuthenticated) return null;
  if (!patient) return <div className="p-6">Paciente não encontrado</div>;

  React.useEffect(() => {
    if (patient?.name) {
      document.title = `Good Health - ${patient.name}`;
    }
  }, [patient?.name]);

  return (
    <div className="min-h-screen grid place-items-center p-6">
      <div className="w-full max-w-md rounded-3xl bg-[#C0C9EE] p-6 grid gap-4">
        <div className="grid gap-1 text-black">
          <div className="text-base">{patient.name}</div>
          <div className="text-xs text-black/70">Telefone: {patient.phone || "-"}  email: {patient.email || "-"}</div>
          <div className="text-xs text-black/70">{patient.address || ""}</div>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => router.push(`/patients/recipes?patientId=${patient.id}`)}>receitas</Button>
          <Button variant="secondary" onClick={() => router.push(`/patients/requisition?patientId=${patient.id}`)}>requisições</Button>
        </div>
        <div className="grid gap-2">
          <div className="text-sm">Ultimos atendimentos</div>
          <div className="grid gap-2">
            {appts.map((a) => (
              <Card key={a.id}>
                <div className="text-black text-sm">Profissional: {a.professionalName || "N/A"}</div>
                <div className="text-xs text-black/60">{new Date(a.datetime).toLocaleString("pt-BR")}</div>
              </Card>
            ))}
            {appts.length === 0 && (
              <div className="text-center text-black/60 py-6">Sem atendimentos</div>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => router.push(`/appoiments/create_n_edit?patientId=${patient.id}`)}>Novo atendimento</Button>
          <Button variant="secondary" onClick={() => router.push(`/patients/create_n_edit?id=${patient.id}`)}>Editar paciente</Button>
        </div>
        <button className="text-sm opacity-80" onClick={() => router.back()}>Voltar</button>
      </div>
    </div>
  );
}

