"use client";

import React, { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { getPatient, savePatient, type Sex } from "@/lib/data/store";
import { isValidCPF, lookupCEP, maskCPF, maskCEP, maskPhone } from "@/lib/utils/validators";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

function PatientFormPageInner() {
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

  useEffect(() => {
    let active = true;
    (async () => {
      const data = await lookupCEP(cep);
      if (active && data) {
        setUf(data.uf || uf);
        setAddress(data.address || address);
      }
    })();
    return () => { active = false; };
  }, [cep]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (cpf && !isValidCPF(cpf)) {
      alert("CPF inválido");
      return;
    }
    const saved = savePatient({ id, name, cpf, email, phone, birthDate: birth, sex, cep, uf, address, complement });
    router.replace(`/patients/details?id=${saved.id}`);
  }

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen p-6 container-responsive">
      <div className="mx-auto w-full max-w-2xl rounded-3xl bg-[#C0C9EE] p-6 grid gap-3">
        <h1 className="text-lg">{id ? "Editar paciente" : "Novo paciente"}</h1>
        <form onSubmit={onSubmit} className="grid gap-3">
          <Input label="Nome completo" value={name} onChange={(e) => setName(e.target.value)} required />
          <Input label="CPF" placeholder="000.000.000-00" value={cpf} onChange={(e) => setCpf(maskCPF(e.target.value))} required />
          <Input label="Email" type="email" placeholder="nome@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input label="Telefone" placeholder="(00) 00000-0000" value={phone} onChange={(e) => setPhone(maskPhone(e.target.value))} required />
          <div className="grid grid-cols-[1fr_auto] gap-3 items-end">
            <Input label="Data de nascimento" type="date" value={birth} onChange={(e) => setBirth(e.target.value)} />
            <label className="grid gap-2 text-sm min-w-[140px]">
              <span>Sexo</span>
              <select className="h-11 rounded-[10px] bg-white/80 px-3 text-black w-full" value={sex} onChange={(e) => setSex(e.target.value as Sex)} required>
                <option value="M">Masculino</option>
                <option value="F">Feminino</option>
                <option value="O">Outro</option>
              </select>
            </label>
          </div>
          <div className="grid grid-cols-[1fr_auto] gap-3 items-end">
            <Input label="CEP" placeholder="00000-000" value={cep} onChange={(e) => setCep(maskCEP(e.target.value))} />
            <Input label="UF" placeholder="UF" value={uf} onChange={(e) => setUf(e.target.value.toUpperCase().slice(0,2))} maxLength={2} className="w-20 text-center uppercase tracking-widest" />
          </div>
          <Input label="Endereço" placeholder="Rua, bairro - cidade" value={address} onChange={(e) => setAddress(e.target.value)} required />
          <Input label="Complemento" placeholder="Apto, bloco..." value={complement} onChange={(e) => setComplement(e.target.value)} />
          <Button type="submit" full>Salvar</Button>
        </form>
        <button className="text-sm opacity-80" onClick={() => router.back()}>Voltar</button>
      </div>
    </div>
  );
}

export default function PatientFormPage() {
  return (
    <Suspense fallback={null}>
      <PatientFormPageInner />
    </Suspense>
  );
}

