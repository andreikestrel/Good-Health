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
  const [infoOpen, setInfoOpen] = useState(true);

  function onRequest(e: React.FormEvent) {
    e.preventDefault();
    // Aqui apenas simula o envio de email
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
        <div className="relative grid place-items-center">
          <button className="text-sm text-red-700 text-center group" onClick={() => setOpen(true)}>
            SIMULAR ACESSO
          </button>
          <div className="pointer-events-none absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition bg-black/80 text-white text-xs rounded-md px-3 py-2 w-72 text-center">
            O email acima é só visual (não é enviado), mas você pode testar a tela de cadastro de usuário (adm/profissional) clicando aqui, como se fosse o link do email.
          </div>
        </div>
        <button className="text-sm opacity-80" onClick={() => router.back()}>Voltar</button>
      </div>

      <Modal open={infoOpen} onClose={() => setInfoOpen(false)}>
        <div className="grid gap-3 text-black">
          <div className="text-sm">
            O email acima é somente visual; não será enviado. Para testar o fluxo,
            use o botão abaixo para simular o acesso como se fosse o link recebido no email.
          </div>
          <Button onClick={() => setInfoOpen(false)}>Entendi</Button>
        </div>
      </Modal>

      <Modal open={open} onClose={() => setOpen(false)}>
        <div className="grid gap-4">
          <Button full onClick={() => router.replace("/login/newUser?role=profissional")}>Sou profissional</Button>
          <Button full onClick={() => router.replace("/login/newUser?role=admin")}>Sou administrador</Button>
        </div>
      </Modal>
    </div>
  );
}

