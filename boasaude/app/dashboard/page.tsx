"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();
  return (
    <div className="sticky top-0 z-10 bg-transparent">
      <div className="mx-auto max-w-md p-4">
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
        <Button variant="secondary">Novo paciente</Button>
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
        <Button variant="ghost">Relatorio</Button>
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
  // placeholder cards
  const items = Array.from({ length: 5 }).map((_, i) => ({
    id: i + 1,
    title: `Atendimento ${i + 1}`,
    subtitle: "Amanhã, 09:00",
  }));
  return (
    <div className="mx-auto max-w-md p-4">
      <div className="rounded-2xl bg-[#C0C9EE] p-4">
        <div className="grid gap-3">
          {items.map((it) => (
            <Card key={it.id}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-black">{it.title}</div>
                  <div className="text-xs text-black/60">{it.subtitle}</div>
                </div>
                <Button variant="secondary">Ver</Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  React.useEffect(() => {
    if (!isAuthenticated) router.replace("/login");
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen">
      <Header />
      <AppointmentsList />
    </div>
  );
}

