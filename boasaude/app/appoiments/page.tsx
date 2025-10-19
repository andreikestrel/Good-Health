"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { listAppointments, listPatients, deleteAppointment, ensureSeed } from "@/lib/data/store";
import { Button } from "@/components/ui/Button";
import { FaTrash } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { Card } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";

export default function AppointmentsListPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const [version, setVersion] = useState(0);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => { ensureSeed(); }, []);
  useEffect(() => { if (!isAuthenticated) router.replace("/login"); }, [isAuthenticated, router]);
  const appointments = useMemo(() => listAppointments(), [version]);
  const patients = useMemo(() => listPatients(), [version]);

  function patientName(id: string) {
    return patients.find((p) => p.id === id)?.name || "Desconhecido";
  }

function onDelete(id: string) { setDeleteId(id); }
function confirmDelete() {
  if (!deleteId) return;
  deleteAppointment(deleteId);
  setDeleteId(null);
  setVersion((v) => v + 1);
}

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen p-4 container-responsive">
      <div className="mx-auto max-w-2xl">
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
              <div className="text-black grid gap-2 md:flex md:items-center md:justify-between md:gap-3">
                <div className="min-w-[200px]">
                  <div className="font-medium flex items-center gap-2">
                    {patientName(a.patientId)}
                    {a.video && <span className="text-xs bg-[#5B5FD9] text-white rounded-full px-2 py-0.5">Vídeo</span>}
                  </div>
                  <div className="text-xs text-black/60">{new Date(a.datetime).toLocaleString("pt-BR")}</div>
                </div>
                <div className="flex gap-2 flex-wrap md:flex-nowrap md:justify-end">
                  <Button variant="secondary" onClick={() => router.push(`/patients/details?id=${a.patientId}`)}>ver paciente</Button>
                  {a.video && (
                    <Button onClick={() => router.push(`/videocall?id=${a.id}`)}>Simular</Button>
                  )}
                  {user?.role !== "paciente" && (
                    <>
                      <Button
                        variant="icon"
                        className="transition-transform hover:scale-105"
                        onClick={() => router.push(`/appoiments/create_n_edit?id=${a.id}`)}
                        aria-label="Editar"
                      >
                        <MdEdit />
                      </Button>
                      <Button
                        variant="icon"
                        className="transition-transform hover:scale-105"
                        onClick={() => onDelete(a.id)}
                        aria-label="Excluir"
                      >
                        <FaTrash color="#EF4444" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </Card>
          ))}
          {appointments.length === 0 && <div className="text-center text-black/60">Nenhum agendamento</div>}
        </div>
      </div>
      <Modal open={!!deleteId} onClose={() => setDeleteId(null)}>
        <div className="grid gap-4 text-black">
          <div className="text-sm">Você tem certeza que deseja excluir?</div>
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" onClick={() => setDeleteId(null)}>Não</Button>
            <Button onClick={confirmDelete}>Sim</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

