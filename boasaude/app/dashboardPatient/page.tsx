"use client";

import React from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";

const mock = [
  { id: 1, title: "Cirurgião - Stephen Strange", date: "2024-04-12T09:00:00Z" },
  { id: 2, title: "Clínico Geral - Anduin Wrynn", date: "2024-05-22T14:30:00Z" },
  { id: 3, title: "Cardiologista - Jaina Proudmoore", date: "2024-08-18T10:15:00Z" },
  { id: 4, title: "Dermatologista - Arthas Menethil", date: "2024-09-02T16:00:00Z" },
  { id: 5, title: "Neurologista - Sylvanas Windrunner", date: "2024-10-03T11:45:00Z" },
];

export default function DashboardPatientPage() {
  const router = useRouter();
  const { logout } = useAuth();
  return (
    <div className="min-h-screen p-4 container-responsive">
      <div className="mx-auto max-w-2xl grid gap-3">
        <div className="rounded-2xl bg-[#898AC4] p-4 text-white flex items-center justify-between">
          <div>Minhas consultas</div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => router.push('/patients/recipesPatient')}>Receitas</Button>
            <Button variant="secondary" onClick={() => router.push('/patients/examsPatient')}>Exames</Button>
            <Button variant="secondary" onClick={() => router.push('/patients/requisitionPatient')}>Requisições</Button>
            <Button variant="secondary" onClick={() => { logout(); router.replace('/login'); }}>Sair</Button>
          </div>
        </div>
        <div className="rounded-2xl bg-[#C0C9EE] p-4 grid gap-3">
          {mock.map((a) => (
            <Card key={a.id}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-black font-medium flex items-center gap-2">
                    {a.title}
                    {a.id === 2 && <span className="text-xs bg-[#5B5FD9] text-white rounded-full px-2 py-0.5">Vídeo</span>}
                  </div>
                  <div className="text-xs text-black/60">{new Date(a.date).toLocaleString("pt-BR")}</div>
                </div>
                <div className="flex gap-2">
                  {a.id === 2 && (
                    <Button onClick={() => router.push(`/videocall?doctor=${encodeURIComponent(a.title.split(' - ')[1] || 'Profissional')}`)}>Simular</Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}


