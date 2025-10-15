"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  React.useEffect(() => {
    if (isAuthenticated) router.replace("/dashboard");
  }, [isAuthenticated, router]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const result = await login(email, password);
    if (!result.ok) setError(result.message || "Erro ao entrar");
    else router.replace("/dashboard");
  }

  return (
    <div className="min-h-screen grid place-items-center p-6">
      <div className="w-full max-w-sm rounded-3xl bg-[#C0C9EE] p-8 grid gap-8">
        <div className="aspect-square rounded-lg bg-white/70 grid place-items-center text-black/60">LOGO</div>
        <form onSubmit={onSubmit} className="grid gap-4">
          <Input
            label="Usuario / email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email"
            required
          />
          <Input
            label="Senha"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="senha"
            required
          />
          {error && <p className="text-red-700 text-sm">{error}</p>}
          <Button type="submit" full>
            Entrar
          </Button>
        </form>
        <button className="text-center text-sm opacity-80" onClick={() => setOpen(true)}>
          NOVO USUARIO
        </button>
      </div>

      <Modal open={open} onClose={() => setOpen(false)}>
        <div className="grid gap-4">
          <Button full onClick={() => router.push("/login/newUser?role=profissional")}>Sou profissional</Button>
          <Button full onClick={() => router.push("/login/newUser?role=admin")}>Sou administrador</Button>
          <Button full onClick={() => router.push("/login/newUser?role=paciente")}>Sou paciente</Button>
        </div>
      </Modal>
    </div>
  );
}

