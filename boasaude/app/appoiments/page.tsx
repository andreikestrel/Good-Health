"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { listAppointments, listPatients, deleteAppointment, ensureSeed } from "@/lib/data/store";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function AppointmentsListPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const [version, setVersion] = useState(0);

  useEffect(() => { ensureSeed(); }, []);
  useEffect(() => { if (!isAuthenticated) router.replace("/login"); }, [isAuthenticated, router]);
  const appointments = useMemo(() => listAppointments(), [version]);
  const patients = useMemo(() => listPatients(), [version]);

  function patientName(id: string) {
    return patients.find((p) => p.id === id)?.name || "Desconhecido";
  }

  function onDelete(id: string) {
    deleteAppointment(id);
    setVersion((v) => v + 1);
  }

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen p-4">
      <div className="mx-auto max-w-md">
        <div className="rounded-2xl bg-[#898AC4] p-4 text-white flex items-center justify-between">
          <div>USUARIO</div>
          <div className="text-right text-xs opacity-80">{new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}<br/>{new Date().toLocaleDateString("pt-BR")}</div>
        </div>
        <div className="mt-3 flex gap-3">
          {user?.role !== "paciente" && (
            <Button full onClick={() => router.push("/appoiments/create_n_edit")}>Novo agendamento</Button>
          )}
          <Button variant="secondary" full onClick={() => router.back()}>Voltar</Button>
        </div>

        <div className="mt-4 rounded-2xl bg-[#C0C9EE] p-4 grid gap-3">
          {appointments.map((a) => (
            <Card key={a.id}>
              <div className="text-black flex items-center justify-between">
                <div>
                  <div className="font-medium">{patientName(a.patientId)}</div>
                  <div className="text-xs text-black/60">{new Date(a.datetime).toLocaleString("pt-BR")}</div>
                </div>
                <div className="flex gap-2">
                  <Button variant="secondary" onClick={() => router.push(`/patients/details?id=${a.patientId}`)}>ver paciente</Button>
                  {user?.role !== "paciente" && (
                    <>
                      <Button variant="secondary" onClick={() => router.push(`/appoiments/create_n_edit?id=${a.id}`)}>editar</Button>
                      <Button variant="ghost" onClick={() => onDelete(a.id)}>excluir</Button>
                    </>
                  )}
                </div>
              </div>
            </Card>
          ))}
          {appointments.length === 0 && <div className="text-center text-black/60">Nenhum agendamento</div>}
        </div>
      </div>
    </div>
  );
}

