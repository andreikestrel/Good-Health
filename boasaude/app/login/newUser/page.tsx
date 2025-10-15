"use client";

import React, { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth, UserRole } from "@/lib/auth/AuthContext";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function NewUserPage() {
  const router = useRouter();
  const params = useSearchParams();
  const { register } = useAuth();
  const defaultRole = (params.get("role") as UserRole) || "paciente";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [role, setRole] = useState<UserRole>(defaultRole);
  const [message, setMessage] = useState<string | null>(null);

  const disabled = useMemo(() => !name || !email || !password || password !== confirm, [name, email, password, confirm]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await register({ name, email, password, role });
    if (!res.ok) setMessage(res.message || "Erro ao cadastrar");
    else {
      setMessage("Cadastro realizado. Faça login.");
      setTimeout(() => router.replace("/login"), 800);
    }
  }

  return (
    <div className="min-h-screen grid place-items-center p-6">
      <div className="w-full max-w-md rounded-3xl bg-[#C0C9EE] p-6 grid gap-4">
        <h1 className="text-lg">Novo usuário</h1>
        <form onSubmit={onSubmit} className="grid gap-3">
          <Input label="Nome completo" value={name} onChange={(e) => setName(e.target.value)} />
          <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input label="CPF" placeholder="000.000.000-00" />
          <Input label="Telefone" placeholder="(00) 00000-0000" />
          <Input label="Senha" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <Input label="Confirmar senha" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
          <div className="grid grid-cols-3 gap-3">
            <Input label="CEP" placeholder="00000-000" />
            <Input label="UF" placeholder="UF" />
            <div />
          </div>
          <Input label="Endereço" />
          <Input label="Complemento" />
          <div className="grid grid-cols-3 gap-2 text-sm">
            <label className="flex items-center gap-2"><input type="radio" name="role" checked={role === "paciente"} onChange={() => setRole("paciente")} /> Paciente</label>
            <label className="flex items-center gap-2"><input type="radio" name="role" checked={role === "profissional"} onChange={() => setRole("profissional")} /> Profissional</label>
            <label className="flex items-center gap-2"><input type="radio" name="role" checked={role === "admin"} onChange={() => setRole("admin")} /> Admin</label>
          </div>
          {message && <p className="text-sm text-black/70">{message}</p>}
          <Button type="submit" full disabled={disabled}>Cadastrar</Button>
        </form>
        <button className="text-sm opacity-80" onClick={() => router.back()}>Voltar</button>
      </div>
    </div>
  );
}


