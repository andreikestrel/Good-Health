"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { getPatient, savePatient, type Sex } from "@/lib/data/store";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function PatientFormPage() {
  const router = useRouter();
  const params = useSearchParams();
  const { isAuthenticated } = useAuth();
  const id = params.get("id") || undefined;
  const existing = useMemo(() => (id ? getPatient(id) : undefined), [id]);

  const [name, setName] = useState(existing?.name || "");
  const [cpf, setCpf] = useState(existing?.cpf || "");
  const [email, setEmail] = useState(existing?.email || "");
  const [phone, setPhone] = useState(existing?.phone || "");
  const [birth, setBirth] = useState(existing?.birthDate || "");
  const [sex, setSex] = useState<Sex>(existing?.sex || "M");
  const [cep, setCep] = useState(existing?.cep || "");
  const [uf, setUf] = useState(existing?.uf || "");
  const [address, setAddress] = useState(existing?.address || "");
  const [complement, setComplement] = useState(existing?.complement || "");

  useEffect(() => { if (!isAuthenticated) router.replace("/login"); }, [isAuthenticated, router]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const saved = savePatient({ id, name, cpf, email, phone, birthDate: birth, sex, cep, uf, address, complement });
    router.replace(`/patients/details?id=${saved.id}`);
  }

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen grid place-items-center p-6">
      <div className="w-full max-w-md rounded-3xl bg-[#C0C9EE] p-6 grid gap-3">
        <h1 className="text-lg">{id ? "Editar paciente" : "Novo paciente"}</h1>
        <form onSubmit={onSubmit} className="grid gap-3">
          <Input label="Nome completo" value={name} onChange={(e) => setName(e.target.value)} />
          <Input label="CPF" value={cpf} onChange={(e) => setCpf(e.target.value)} />
          <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input label="Telefone" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <div className="grid grid-cols-3 gap-3">
            <Input label="Data de nascimento" type="date" value={birth} onChange={(e) => setBirth(e.target.value)} />
            <label className="grid gap-2 text-sm">
              <span>Sexo</span>
              <select className="h-11 rounded-[10px] bg-white/80 px-3 text-black" value={sex} onChange={(e) => setSex(e.target.value as Sex)}>
                <option value="M">Masculino</option>
                <option value="F">Feminino</option>
                <option value="O">Outro</option>
              </select>
            </label>
            <div />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Input label="CEP" value={cep} onChange={(e) => setCep(e.target.value)} />
            <Input label="UF" value={uf} onChange={(e) => setUf(e.target.value)} />
            <div />
          </div>
          <Input label="Endereço" value={address} onChange={(e) => setAddress(e.target.value)} />
          <Input label="Complemento" value={complement} onChange={(e) => setComplement(e.target.value)} />
          <Button type="submit" full>Salvar</Button>
        </form>
        <button className="text-sm opacity-80" onClick={() => router.back()}>Voltar</button>
      </div>
    </div>
  );
}

