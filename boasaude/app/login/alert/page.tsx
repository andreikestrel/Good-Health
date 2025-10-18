"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";

export default function AlertNewUserPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [open, setOpen] = useState(false);

  function onRequest(e: React.FormEvent) {
    e.preventDefault();
    // Aqui apenas simulamos o envio de email
    setOpen(true);
  }

  return (
    <div className="min-h-screen grid place-items-center p-6">
      <div className="w-full max-w-sm rounded-3xl bg-[#C0C9EE] p-6 grid gap-4">
        <h1 className="text-lg">Solicitar novo usuário</h1>
        <form onSubmit={onRequest} className="grid gap-3">
          <Input label="Email institucional" type="email" placeholder="nome@empresa.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Button type="submit" full>Solicitar</Button>
        </form>
        <button className="text-sm text-red-700 text-center" onClick={() => setOpen(true)}>SIMULAR ACESSO</button>
        <button className="text-sm opacity-80" onClick={() => router.back()}>Voltar</button>
      </div>

      <Modal open={open} onClose={() => setOpen(false)}>
        <div className="grid gap-4">
          <Button full onClick={() => router.replace("/login/newUser?role=profissional")}>Sou profissional</Button>
          <Button full onClick={() => router.replace("/login/newUser?role=admin")}>Sou administrador</Button>
        </div>
      </Modal>
    </div>
  );
}

