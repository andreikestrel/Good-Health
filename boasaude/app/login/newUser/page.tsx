"use client";

import React, { Suspense, useMemo, useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth, UserRole } from "@/lib/auth/AuthContext";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { isValidCPF, lookupCEP, maskCPF, maskCEP, maskPhone } from "@/lib/utils/validators";

function NewUserPageInner() {
  const router = useRouter();
  const params = useSearchParams();
  const { register } = useAuth();
  const defaultRole = (params.get("role") as UserRole) || "paciente";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [role, setRole] = useState<UserRole>(defaultRole);
  const [message, setMessage] = useState<string | null>(null);
  const [cpf, setCpf] = useState("");
  const [cep, setCep] = useState("");
  const [uf, setUf] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");

  const disabled = useMemo(() => !name || !email || !password || password !== confirm, [name, email, password, confirm]);

  function isStrongPassword(p: string) {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+]).{8,}$/.test(p);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValidCPF(cpf)) {
      setMessage("CPF inválido");
      return;
    }
    if (password !== confirm) {
      setMessage("As senhas devem ser iguais");
      return;
    }
    if (!isStrongPassword(password)) {
      setMessage("A senha deve ter ao menos 8 caracteres, com 1 letra maiúscula, 1 minúscula, 1 número e 1 símbolo (!@#$%^&*()-_+=)");
      return;
    }
    const res = await register({ name, email, password, role });
    if (!res.ok) setMessage(res.message || "Erro ao cadastrar");
    else {
      setMessage("Cadastro realizado. Faça login.");
      setTimeout(() => router.replace("/login"), 800);
    }
  }

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

  return (
    <div className="min-h-screen grid place-items-center p-6">
      <div className="w-full max-w-md rounded-3xl bg-[#C0C9EE] p-6 grid gap-4">
        <h1 className="text-lg">Novo usuário</h1>
        <form onSubmit={onSubmit} className="grid gap-3">
          <Input label="Nome completo" value={name} onChange={(e) => setName(e.target.value)} />
          <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input label="CPF" placeholder="000.000.000-00" value={cpf} onChange={(e) => setCpf(maskCPF(e.target.value))} />
          <Input label="Telefone" placeholder="(00) 00000-0000" value={phone} onChange={(e) => setPhone(maskPhone(e.target.value))} />
          <label className="grid gap-2 text-sm relative">
            <span>Senha</span>
            <input
              type={showPass ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-11 rounded-[10px] bg-white/80 px-4 pr-11 text-black placeholder:text-black/50 outline-none focus:ring-2 focus:ring-[#898AC4]"
            />
            <button type="button" className="absolute right-3 top-[34px] text-black/70" onClick={() => setShowPass((v) => !v)} aria-label={showPass ? "Esconder senha" : "Mostrar senha"}>
              {showPass ? <FaEyeSlash /> : <FaEye />}
            </button>
          </label>
          <label className="grid gap-2 text-sm relative">
            <span>Confirmar senha</span>
            <input
              type={showConfirm ? "text" : "password"}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="h-11 rounded-[10px] bg-white/80 px-4 pr-11 text-black placeholder:text-black/50 outline-none focus:ring-2 focus:ring-[#898AC4]"
            />
            <button type="button" className="absolute right-3 top-[34px] text-black/70" onClick={() => setShowConfirm((v) => !v)} aria-label={showConfirm ? "Esconder senha" : "Mostrar senha"}>
              {showConfirm ? <FaEyeSlash /> : <FaEye />}
            </button>
          </label>
          <div className="grid grid-cols-3 gap-3">
            <Input label="CEP" placeholder="00000-000" value={cep} onChange={(e) => setCep(maskCEP(e.target.value))} />
            <Input label="UF" placeholder="UF" value={uf} onChange={(e) => setUf(e.target.value.toUpperCase().slice(0,2))} maxLength={2} className="w-16 text-center uppercase tracking-widest" />
            <div />
          </div>
          <Input label="Endereço" placeholder="Rua, bairro - cidade" value={address} onChange={(e) => setAddress(e.target.value)} />
          <Input label="Complemento" />
          {message && <p className="text-sm text-black/70">{message}</p>}
          <Button type="submit" full disabled={disabled}>Cadastrar</Button>
        </form>
        <button className="text-sm opacity-80" onClick={() => router.back()}>Voltar</button>
      </div>
    </div>
  );
}

export default function NewUserPage() {
  return (
    <Suspense fallback={null}>
      <NewUserPageInner />
    </Suspense>
  );
}


