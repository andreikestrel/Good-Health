"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { listPatients, deletePatient, ensureSeed, type Patient } from "@/lib/data/store";
import { Button } from "@/components/ui/Button";
import { FaTrash } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { Card } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";

export default function PatientsListPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const [version, setVersion] = useState(0);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => { ensureSeed(); }, []);
  useEffect(() => { if (!isAuthenticated) router.replace("/login"); }, [isAuthenticated, router]);
  const patients = useMemo(() => listPatients(), [version]);
  function ageFromBirthDate(p: Patient) {
    if (!p.birthDate) return "-";
    const b = new Date(p.birthDate);
    const now = new Date();
    let age = now.getFullYear() - b.getFullYear();
    const m = now.getMonth() - b.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < b.getDate())) age--;
    return `${age} anos`;
  }

  function genderSymbol(p: Patient) {
    if (p.sex === "M") return "♂";
    if (p.sex === "F") return "♀";
    return "•";
  }

function onDelete(id: string) {
  setDeleteId(id);
}
function confirmDelete() {
  if (!deleteId) return;
  deletePatient(deleteId);
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
            <Button full onClick={() => router.push("/patients/create_n_edit")}>Novo paciente</Button>
          )}
          <Button variant="secondary" full onClick={() => router.back()}>Voltar</Button>
        </div>

        <div className="mt-4 rounded-2xl bg-[#C0C9EE]">
          {patients.map((p) => (
            <div key={p.id} className="grid grid-cols-[1fr_auto] gap-2 border-b border-white/40 px-4 py-3 last:border-b-0">
              <div className="text-black">
                <div className="font-medium">{p.name}</div>
                <div className="text-xs text-black/60">{p.phone || ""} {p.email ? ` · ${p.email}` : ""}</div>
                <div className="text-xs text-black/60">{p.cpf ? p.cpf : ""}</div>
              </div>
              <div className="text-right text-xs text-black/60">{ageFromBirthDate(p)} {genderSymbol(p)}</div>
              <div className="col-span-2 flex gap-2 justify-end">
                <Button variant="secondary" onClick={() => router.push(`/patients/details?id=${p.id}`)}>ver paciente</Button>
                {user?.role !== "paciente" && (
                  <>
                    <Button
                      variant="icon"
                      className="transition-transform hover:scale-105"
                      onClick={() => router.push(`/patients/create_n_edit?id=${p.id}`)}
                      aria-label="Editar"
                    >
                      <MdEdit />
                    </Button>
                    <Button
                      variant="icon"
                      className="transition-transform hover:scale-105"
                      onClick={() => onDelete(p.id)}
                      aria-label="Excluir"
                    >
                      <FaTrash color="#EF4444" />
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))}
          {patients.length === 0 && (
            <div className="p-6 text-center text-black/60">Nenhum paciente</div>
          )}
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

