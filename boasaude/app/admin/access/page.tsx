"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth, type UserRole } from "@/lib/auth/AuthContext";
import { addCustomUser, deleteCustomUser, listAllUsers, listCustomUsers, resetCustomUsers } from "@/lib/auth/users";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function AccessConfigPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const [version, setVersion] = useState(0);
  const users = useMemo(() => listAllUsers(), [version]);

  if (!isAuthenticated) {
    router.replace("/login");
    return null;
  }
  if (user?.role !== "admin") return <div className="p-6">Acesso restrito ao admin</div>;

  function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement & { name: { value: string }, email: { value: string }, password: { value: string }, role: { value: UserRole } };
    try {
      addCustomUser({ name: form.name.value, email: form.email.value, password: form.password.value, role: form.role.value });
      setVersion((v) => v + 1);
      form.reset();
    } catch (err: any) {
      alert(err?.message || "Erro ao adicionar");
    }
  }

  function remove(email: string) {
    deleteCustomUser(email);
    setVersion((v) => v + 1);
  }

  function reset() {
    resetCustomUsers();
    setVersion((v) => v + 1);
  }

  return (
    <div className="min-h-screen p-6">
      <div className="mx-auto max-w-md grid gap-4">
        <div className="rounded-2xl bg-[#898AC4] p-4 text-white flex items-center justify-between">
          <div>Configurar acessos</div>
          <Button variant="secondary" onClick={() => router.back()}>Voltar</Button>
        </div>

        <form onSubmit={handleAdd} className="rounded-2xl bg-[#C0C9EE] p-4 grid gap-2">
          <div className="grid grid-cols-2 gap-2">
            <Input label="Nome" name="name" />
            <label className="grid gap-2 text-sm">
              <span>Perfil</span>
              <select name="role" className="h-11 rounded-[10px] bg-white/80 px-3 text-black">
                <option value="paciente">Paciente</option>
                <option value="profissional">Profissional</option>
                <option value="admin">Admin</option>
              </select>
            </label>
          </div>
          <Input label="Email" name="email" type="email" />
          <Input label="Senha" name="password" type="password" />
          <Button type="submit">Adicionar</Button>
          <Button variant="ghost" type="button" onClick={reset}>Limpar usuários customizados</Button>
        </form>

        <div className="rounded-2xl bg-[#C0C9EE] p-4 grid gap-2">
          {users.map((u) => (
            <div key={u.email} className="flex items-center justify-between border-b border-white/40 py-2 last:border-b-0">
              <div className="text-black text-sm">{u.name} · {u.role}<div className="text-xs text-black/60">{u.email}</div></div>
              {listCustomUsers().some((c) => c.email === u.email) ? (
                <Button variant="ghost" onClick={() => remove(u.email)}>remover</Button>
              ) : (
                <span className="text-xs text-black/50">predefinido</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


