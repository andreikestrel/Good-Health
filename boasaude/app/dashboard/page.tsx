"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ensureSeed, listAppointments, listPatients } from "@/lib/data/store";

function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();
  return (
    <div className="sticky top-0 z-10 bg-transparent">
      <div className="mx-auto w-full max-w-5xl p-4">
        <div className="rounded-2xl bg-[#898AC4] p-4 text-white flex items-center justify-between">
          <div>
            <div className="text-xs opacity-80">USUARIO</div>
            <div className="text-sm">{user?.name} ({user?.role})</div>
          </div>
          <div className="text-right text-xs opacity-80">{new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}<br/>{new Date().toLocaleDateString("pt-BR")}</div>
        </div>
        <div className="mt-3 flex gap-3 flex-wrap">
          <RoleButtons />
          <Button variant="secondary" onClick={() => { logout(); router.replace("/login"); }}>Sair</Button>
        </div>
      </div>
    </div>
  );
}

function RoleButtons() {
  const { user } = useAuth();
  const router = useRouter();
  if (user?.role === "profissional") {
    return (
      <>
        <Button onClick={() => router.push('/patients')}>Pacientes</Button>
        <Button onClick={() => router.push('/appoiments')}>Agendamentos</Button>
        <Button variant="secondary" onClick={() => router.push('/patients/create_n_edit')}>Novo paciente</Button>
        <Button variant="secondary" onClick={() => router.push('/appoiments/create_n_edit')}>Novo agendamento</Button>
      </>
    );
  }
  if (user?.role === "admin") {
    return (
      <>
        <Button onClick={() => router.push('/patients')}>Pacientes</Button>
        <Button onClick={() => router.push('/appoiments')}>Agendamentos</Button>
        <Button variant="secondary" onClick={() => router.push('/patients/create_n_edit')}>Novo paciente</Button>
        <Button variant="secondary" onClick={() => router.push('/appoiments/create_n_edit')}>Novo agendamento</Button>
        <Button variant="ghost" onClick={() => router.push('/report')}>Relatorio</Button>
      </>
    );
  }
  return (
    <>
      <Button onClick={() => router.push('/appoiments')}>Minhas consultas</Button>
      <Button>Receitas</Button>
      <Button>Exames</Button>
      <Button>Requisições</Button>
    </>
  );
}

function AppointmentsList() {
  const router = useRouter();
  React.useEffect(() => { ensureSeed(); }, []);
  const appointments = React.useMemo(() => listAppointments().slice(0, 10), []);
  const patients = React.useMemo(() => listPatients(), []);
  const patientName = (id: string) => patients.find((p) => p.id === id)?.name || "Paciente";

  return (
    <div className="mx-auto max-w-md p-4">
      <div className="rounded-2xl bg-[#C0C9EE] p-4">
        <div className="grid gap-3">
          {appointments.map((a) => (
            <Card key={a.id}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-black">{patientName(a.patientId)}</div>
                  <div className="text-xs text-black/60">{new Date(a.datetime).toLocaleString("pt-BR")}</div>
                </div>
                <Button variant="secondary" onClick={() => router.push(`/patients/details?id=${a.patientId}`)}>Ver</Button>
              </div>
            </Card>
          ))}
          {appointments.length === 0 && (
            <div className="text-center text-black/60">Sem atendimentos</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();

  React.useEffect(() => {
    if (!isAuthenticated) router.replace("/login");
    else if (user?.role === 'paciente') router.replace('/dashboardPatient');
  }, [isAuthenticated, user?.role, router]);

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen container-responsive">
      <Header />
      <AppointmentsList />
    </div>
  );
}

