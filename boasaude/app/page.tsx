"use client";

import React, { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { ensureSeed, listAppointments, listPatients } from "@/lib/data/store";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import Image from "next/image";

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuth();

  useEffect(() => { ensureSeed(); }, []);
  useEffect(() => {
    if (!isAuthenticated) router.replace("/login");
    else if (user?.role === "paciente") router.replace("/dashboardPatient");
  }, [isAuthenticated, user?.role, router]);
  const appointments = useMemo(() => listAppointments().slice(0, 10), []);
  const patients = useMemo(() => listPatients(), []);
  if (!isAuthenticated) return null;
  const patientName = (id: string) => patients.find((p) => p.id === id)?.name || "Paciente";

  return (
    <div className="min-h-screen p-4 container-responsive">
      <div className="mx-auto max-w-2xl grid gap-3">
        <div className="rounded-2xl bg-[#898AC4] p-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3"><Image src="/Health.svg" alt="Boa Saúde" width={24} height={24} /> Últimos atendimentos</div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => router.push("/appoiments/create_n_edit")}>Novo agendamento</Button>
            <Button variant="secondary" onClick={() => router.push("/appoiments")}>Ver todos</Button>
            <Button variant="secondary" onClick={() => { logout(); router.replace('/login'); }}>Sair</Button>
          </div>
        </div>

        <div className="rounded-2xl bg-[#C0C9EE] p-4 grid gap-3">
          {appointments.map((a) => (
            <Card key={a.id}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-black font-medium">{patientName(a.patientId)}</div>
                  <div className="text-xs text-black/60">{new Date(a.datetime).toLocaleString("pt-BR")} {a.professionalName ? `· ${a.professionalName}` : ""}</div>
                </div>
                <div className="flex gap-2">
                  <Button variant="secondary" onClick={() => router.push(`/patients/details?id=${a.patientId}`)}>ver paciente</Button>
                  <Button variant="secondary" onClick={() => router.push(`/appoiments/create_n_edit?id=${a.id}`)}>editar</Button>
                </div>
              </div>
            </Card>
          ))}
          {appointments.length === 0 && <div className="text-center text-black/60">Sem atendimentos</div>}
        </div>
      </div>
    </div>
  );
}
